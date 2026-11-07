#!/usr/bin/env node
/*
 * Builds every question in the bank and checks it:
 *   - exactly 4 answer options, all different, answer listed first
 *   - no broken text (undefined, NaN, null) and no ASCII "-5" (negatives use the real minus sign "−5")
 *   - sums written as "8 + 5", "7 × 8", "3.5 − 1.2" or "(4 + 3) × 2" really equal the answer
 *   - template ids are unique and every skill has at least 4 templates
 * Then draws 300 tests per age and checks each has 20 different questions, 4 per skill, easy to hard.
 * Exits with code 1 if anything fails, so the Docker build stops.
 *
 * usage: node tests/check-bank.cjs [age]      e.g. node tests/check-bank.cjs 9-10
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const DOM_ONLY = new Set(['js/picker.js', 'js/timer.js', 'js/app.js']);   // need a browser, hold no questions
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const FILES = [...html.matchAll(/<script src="(js\/[^"]+\.js)"><\/script>/g)].map(m => m[1]).filter(f => !DOM_ONLY.has(f));
const ctx = { Math, JSON, console };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of FILES) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });

const M = ctx.MBT;
M.prepare();
const ONLY = process.argv[2];
const AGES = Object.keys(M.AGES).filter(a => !ONLY || a === ONLY);
if (!AGES.length) { console.error(`Unknown age "${ONLY}". Ages: ${Object.keys(M.AGES).join(', ')}`); process.exit(1); }
const ageOf = t => M.SKILLS[t.skill].age;
const problems = [];
const optText = o => (typeof o === 'string' ? o : o.t);
const asNumber = s => (/^−?[\d,]*\.?\d+$/.test(s) ? Number(s.replace(/,/g, '').replace('−', '-')) : null);

function checkSum(where, short, answer) {
  if (!/^[\d.,+−×÷() ]+$/.test(short) || !/[+−×÷]/.test(short)) return;
  const want = asNumber(answer);
  if (want === null) return;
  const value = Function(`return ${short.replace(/,/g, '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/')}`)();
  if (Math.abs(value - want) > 1e-9) problems.push(`${where}: ${short} = ${value}, but the answer says ${answer}`);
}
function checkQuestion(t, vi, stats) {
  const where = `${t.id}:${vi}`;
  const q = M.build({ ti: t.ti, vi, lv: t.level(t.variants[vi]) });
  const texts = q.opts.map(optText);
  if (texts.length !== 4) problems.push(`${where}: ${texts.length} options`);
  if (new Set(texts).size !== texts.length) problems.push(`${where}: repeated option in [${texts}]`);
  if (q.a !== 0) problems.push(`${where}: answer index ${q.a}`);
  if (!q.text || !q.why) problems.push(`${where}: missing text or why`);
  const blob = [q.text, q.why, q.short, q.say, q.vis, ...texts, ...q.opts.map(o => o.say)].filter(Boolean).join(' | ');
  if (/undefined|NaN|null|\[object|Infinity/.test(blob)) problems.push(`${where}: broken text: ${blob.slice(0, 160)}`);
  if (texts.some(x => /(^|\s)-\d/.test(x))) problems.push(`${where}: ASCII minus in [${texts}], use "−"`);
  if (q.short) checkSum(where, q.short, texts[0]);
  stats.skill[t.skill] = (stats.skill[t.skill] || 0) + 1;
  stats.level[q.lv]++;
}

const ids = new Set();
for (const t of M.templates) {
  if (ids.has(t.id)) problems.push(`template id "${t.id}" is used twice`);
  ids.add(t.id);
}

for (const age of AGES) {
  const stats = { skill: {}, level: { 1: 0, 2: 0, 3: 0 } };
  const mine = M.templates.filter(t => ageOf(t) === age);
  mine.forEach(t => t.variants.forEach((_, vi) => checkQuestion(t, vi, stats)));
  for (const s of M.skillsFor(age)) {
    const n = mine.filter(t => t.skill === s).length;
    if (n < 4) problems.push(`ages ${age}: skill ${s} has ${n} templates (needs at least 4)`);
  }
  for (let run = 0; run < 300; run++) {
    const picks = M.newPicks(age);
    const keys = picks.map(p => `${M.templates[p.ti].id}:${p.vi}`);
    const skills = {};
    picks.forEach(p => { const s = M.templates[p.ti].skill; skills[s] = (skills[s] || 0) + 1; });
    if (picks.length !== 20) problems.push(`ages ${age}, test ${run}: ${picks.length} questions`);
    if (new Set(keys).size !== keys.length) problems.push(`ages ${age}, test ${run}: a question appears twice`);
    if (Object.values(skills).some(n => n !== 4)) problems.push(`ages ${age}, test ${run}: skills not 4 each ${JSON.stringify(skills)}`);
    if (picks.some(p => ageOf(M.templates[p.ti]) !== age)) problems.push(`ages ${age}, test ${run}: question from another age`);
    if (picks.some((p, i) => i && p.lv < picks[i - 1].lv)) problems.push(`ages ${age}, test ${run}: not ordered easy to hard`);
  }
  console.log(`Ages ${age}: ${M.poolSize[age] || 0} questions from ${mine.length} templates`);
  console.log('  by skill:', JSON.stringify(stats.skill));
  console.log('  by level (1 warm-up, 2 thinking, 3 tricky):', JSON.stringify(stats.level));
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  problems.slice(0, 40).forEach(p => console.error(` - ${p}`));
  process.exit(1);
}
console.log('All questions passed.');
