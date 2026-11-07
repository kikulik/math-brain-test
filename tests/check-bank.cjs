#!/usr/bin/env node
/*
 * Builds every question in the bank and checks it:
 *   - exactly 4 answer options, all different, answer listed first
 *   - no broken text (undefined, NaN, null) and no negative numbers
 *   - sums written as "8 + 5" or "15 − 7" really equal the answer
 * Then draws 300 practice tests and checks each has 20 different questions, 4 per skill, easy to hard.
 * Exits with code 1 if anything fails, so the Docker build stops.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const JS = path.join(__dirname, '..', 'js');
const FILES = ['core', 'draw', 'bank-numbers', 'bank-patterns', 'bank-sums', 'bank-shapes', 'bank-logic', 'pool'];
const ctx = { Math, JSON, console };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(JS, `${f}.js`), 'utf8'), ctx, { filename: `${f}.js` });

const M = ctx.MBT;
M.prepare();
const problems = [];
const perSkill = {};
const perLevel = { 1: 0, 2: 0, 3: 0 };
const optText = o => (typeof o === 'string' ? o : o.t);

function checkQuestion(t, vi) {
  const where = `${t.id}:${vi}`;
  const q = M.build({ ti: t.ti, vi, lv: t.level(t.variants[vi]) });
  const texts = q.opts.map(optText);
  if (texts.length !== 4) problems.push(`${where}: ${texts.length} options`);
  if (new Set(texts).size !== texts.length) problems.push(`${where}: repeated option in [${texts}]`);
  if (q.a !== 0) problems.push(`${where}: answer index ${q.a}`);
  const blob = [q.text, q.why, q.short, q.say, q.vis, ...texts].filter(Boolean).join(' | ');
  if (/undefined|NaN|null|\[object/.test(blob)) problems.push(`${where}: broken text: ${blob.slice(0, 160)}`);
  if (texts.some(x => /^-\d/.test(x))) problems.push(`${where}: negative option in [${texts}]`);
  if (q.short && /^[\d +−]+$/.test(q.short)) {
    const value = Function(`return ${q.short.replace(/−/g, '-')}`)();
    if (String(value) !== texts[0]) problems.push(`${where}: ${q.short} = ${value}, but the answer says ${texts[0]}`);
  }
  perSkill[t.skill] = (perSkill[t.skill] || 0) + 1;
  perLevel[q.lv]++;
}
M.templates.forEach(t => t.variants.forEach((_, vi) => checkQuestion(t, vi)));

for (let run = 0; run < 300; run++) {
  const picks = M.newPicks();
  const ids = picks.map(p => `${M.templates[p.ti].id}:${p.vi}`);
  const skills = {};
  picks.forEach(p => { const s = M.templates[p.ti].skill; skills[s] = (skills[s] || 0) + 1; });
  if (picks.length !== 20) problems.push(`test ${run}: ${picks.length} questions`);
  if (new Set(ids).size !== ids.length) problems.push(`test ${run}: a question appears twice`);
  if (Object.values(skills).some(n => n !== 4)) problems.push(`test ${run}: skills not 4 each ${JSON.stringify(skills)}`);
  if (picks.some((p, i) => i && p.lv < picks[i - 1].lv)) problems.push(`test ${run}: not ordered easy to hard`);
}

console.log(`Questions in the bank: ${M.poolSize}`);
console.log('By skill:', JSON.stringify(perSkill));
console.log('By level (1 warm-up, 2 thinking, 3 tricky):', JSON.stringify(perLevel));
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.slice(0, 40).forEach(p => console.error(` - ${p}`));
  process.exit(1);
}
console.log('All questions passed.');
