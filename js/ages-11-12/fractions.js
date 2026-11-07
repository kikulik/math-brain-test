/* Math Brain Test, ages 11 to 12: fractions, decimals and percentages. */
(function (M) {
  const H = M.h11, D = M.draw, F = M.fmtNum, SKILL = 'fractions11';
  const df = (n, d) => D.frac(`${n}/${d}`);
  const fracEq = (html, label) => H.eq(html, label, 'clamp(1.5rem,6vw,2.2rem)');
  const round6 = v => Math.round(v * 1e6) / 1e6;
  const cents = c => Math.abs(c * 100 - Math.round(c * 100)) < 1e-6;
  const simpler = (ans, n, d) => (H.fstr(ans) !== `${n}/${d}` ? `${n}/${d} = ${H.fstr(ans)}` : `${n}/${d}`);
  const PROPER = M.combos([2, 3, 4, 5, 6, 8, 10, 12], M.range(1, 11)).filter(([d, n]) => n < d && M.gcd(n, d) === 1).map(([d, n]) => [n, d]);
  const upTo = d => PROPER.filter(f => f[1] <= d);

  /* ---------- adding and subtracting ---------- */
  function addKind([[a, b], [c, d]], op) {
    if (b === d || M.lcm(b, d) > 24) return null;
    const v = op === '+' ? a / b + c / d : a / b - c / d;
    if (op === '−') return v > 0 ? 'sub' : null;
    if (Math.abs(v - 1) < 1e-9) return null;
    return v > 1 ? 'mixed' : b % d === 0 || d % b === 0 ? 'easy' : 'add';
  }
  const ADD_ALL = M.combos(M.combos(PROPER, PROPER), ['+', '−']);
  const ADD_V = ['easy', 'add', 'sub', 'mixed'].flatMap(kind =>
    H.cap(ADD_ALL.filter(([p, op]) => addKind(p, op) === kind).map(([[[a, b], [c, d]], op]) => [kind, op, a, b, c, d]), 18));
  M.add({
    id: 'a11-fraction-add', skill: SKILL, variants: ADD_V,
    level: ([kind]) => ({ easy: 1, add: 2, sub: 2, mixed: 3 }[kind]),
    make: ([, op, a, b, c, d], r) => {
      const l = M.lcm(b, d), A = (a * l) / b, C = (c * l) / d, N = op === '+' ? A + C : A - C, ans = [N, l], expr = `${a}/${b} ${op} ${c}/${d}`;
      const cands = op === '+' ? [[a + c, b + d], [a + c, l], [N + 1, l], [a * c, b * d]] : [[Math.abs(a - c) || 1, Math.abs(b - d)], [Math.abs(a - c) || 1, l], [N + 1, l], [A + C, l]];
      return {
        text: `What is ${expr}? Give the answer in its simplest form.`, short: expr,
        vis: fracEq(`${df(a, b)} ${op} ${df(c, d)} = ${M.draw.box}`, expr), ...H.fracOpts(r, ans, cands),
        why: `Make the bottom numbers the same: ${a}/${b} = ${A}/${l} and ${c}/${d} = ${C}/${l}. ${A} ${op} ${C} = ${N}, so the answer is ${simpler(ans, N, l)}.`
      };
    }
  });

  /* ---------- simplifying and equivalent fractions ---------- */
  const BASE = upTo(10);
  const SIMP_V = [...H.thin(M.combos(BASE, [2, 3, 4, 5, 6]).map(([f, k]) => ['simplify', ...f, k]), 4),
    ...H.thin(M.combos(BASE, [2, 3, 4, 5]).map(([f, k]) => ['equal', ...f, k]), 5),
    ...H.thin(M.combos(BASE, [3, 4, 5, 6, 8]).map(([f, k]) => ['missing', ...f, k]), 6)];
  function equivalentQ([kind, a, b, k], r) {
    const A = a * k, B = b * k;
    if (kind === 'simplify') {
      return { text: `Write ${A}/${B} in its simplest form.`, short: `Simplify ${A}/${B}`, vis: fracEq(`${df(A, B)} = ${M.draw.box}`, `${A}/${B}`),
        ...H.fracOpts(r, [a, b], [[a, b + 1], [a + 1, b], [b - a, b], [a, 2 * b]]),
        why: `${A} and ${B} can both be divided by ${k}: ${A} ÷ ${k} = ${a} and ${B} ÷ ${k} = ${b}. Nothing else divides both ${a} and ${b}.` };
    }
    if (kind === 'equal') {
      const seen = new Set([`${A}/${B}`]);
      const wrong = M.shuffle(r, [[a + k, b + k], [A, b + k], [a + k, B], [A + 1, B], [A, B - 1], [a, B], [A, b], [A + 2, B]])
        .filter(([n, d]) => n > 0 && d > 0 && n * b !== d * a && !seen.has(`${n}/${d}`) && seen.add(`${n}/${d}`)).slice(0, 3);
      return { text: `Which fraction is equal to ${a}/${b}?`, short: `Equal to ${a}/${b}`, vis: fracEq(`${df(a, b)} = ${M.draw.box}`, `${a}/${b}`),
        opts: [M.draw.fracOpt(A, B), ...wrong.map(([n, d]) => M.draw.fracOpt(n, d))], a: 0,
        why: `Multiply the top and the bottom by the same number: ${a} × ${k} = ${A} and ${b} × ${k} = ${B}.` };
    }
    return { text: `Find the missing number: ${a}/${b} = ?/${B}`, short: `${a}/${b} = ?/${B}`, vis: fracEq(`${df(a, b)} = ${D.frac(`?/${B}`)}`, `${a}/${b} = ?/${B}`),
      ...M.numOpts(r, A, [a + B - b, A + 1, a + k, B - A]), why: `${b} × ${k} = ${B}, so multiply the top by ${k} too: ${a} × ${k} = ${A}.` };
  }
  M.add({
    id: 'a11-equivalent-fractions', skill: SKILL, variants: SIMP_V,
    level: ([kind, , , k]) => (kind === 'missing' ? 2 : kind === 'simplify' && k >= 4 ? 2 : 1), make: equivalentQ
  });

  /* ---------- fractions of amounts ---------- */
  const OF_FR = [[1, 3], [1, 4], [1, 5], [1, 8], [2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [3, 8], [5, 8], [7, 10], [3, 10]];
  const OF_V = [...H.thin(M.combos(OF_FR, [3, 4, 5, 6, 7, 8, 9, 12]).map(([[a, b], m]) => ['of', a, b, m]), 3),
    ...H.thin(M.combos(OF_FR.filter(([a]) => a > 1), M.range(3, 9)).map(([[a, b], m]) => ['back', a, b, m]), 2)];
  const OF_TEXT = [
    (a, b, N) => [`What is ${a}/${b} of ${N}?`, `${a}/${b} of ${N}`],
    (a, b, N) => [`There are ${N} pupils in a year group. ${a}/${b} of them walk to school. How many pupils walk to school?`, `${a}/${b} of ${N} pupils`],
    (a, b, N) => [`A bag holds ${N} marbles and ${a}/${b} of them are blue. How many blue marbles are there?`, `${a}/${b} of ${N} marbles`],
    (a, b, N) => [`A train journey is ${N} km long. The train has gone ${a}/${b} of the way. How many km is that?`, `${a}/${b} of ${N} km`]
  ];
  M.add({
    id: 'a11-fraction-of', skill: SKILL, variants: OF_V,
    level: ([kind, a]) => (kind === 'back' ? 3 : a === 1 ? 1 : 2),
    make: ([kind, a, b, m], r) => {
      const N = b * m;
      if (kind === 'back') {
        return { text: `${a}/${b} of a number is ${a * m}. What is the number?`, short: `${a}/${b} of ? = ${a * m}`,
          ...M.numOpts(r, N, [m, a * m * b, a * m + a, a * m + m * 2]), why: `${a}/${b} is ${a * m}, so 1/${b} is ${a * m} ÷ ${a} = ${m}. The whole number is ${b} × ${m} = ${N}.` };
      }
      const [text, short] = M.pick(r, OF_TEXT)(a, b, N);
      return { text, short, ...M.numOpts(r, a * m, [m, N - a * m, a * m + m, N / a, a * N]),
        why: a === 1 ? `1/${b} of ${N} means ${N} ÷ ${b} = ${m}.` : `Find 1/${b} first: ${N} ÷ ${b} = ${m}. Then ${a} × ${m} = ${a * m}.` };
    }
  });

  /* ---------- multiplying and dividing fractions ---------- */
  const MUL_V = [...H.thin(M.combos(upTo(8), M.range(2, 9)).map(([f, k]) => ['whole', ...f, k]), 5),
    ...H.thin(M.combos(upTo(6), upTo(6)).map(([f, g]) => ['frac', ...f, ...g]), 6),
    ...H.thin(M.combos(upTo(6), M.range(2, 5)).map(([f, k]) => ['divide', ...f, k]), 3)];
  function mulQ([kind, a, b, c, d], r) {
    if (kind === 'whole') {
      const k = c, ans = [k * a, b], expr = `${k} × ${a}/${b}`;
      return { text: `What is ${expr}?`, short: expr, vis: fracEq(`${k} × ${df(a, b)} = ${M.draw.box}`, expr),
        ...H.fracOpts(r, ans, [[a, k * b], [k + a, b], [k * a + 1, b], [k * a, b + k]]), why: `${k} lots of ${a}/${b} is ${simpler(ans, k * a, b)}.` };
    }
    if (kind === 'frac') {
      const ans = [a * c, b * d], expr = `${a}/${b} × ${c}/${d}`;
      return { text: `What is ${expr}?`, short: expr, vis: fracEq(`${df(a, b)} × ${df(c, d)} = ${M.draw.box}`, expr),
        ...H.fracOpts(r, ans, [[a + c, b + d], [a * d, b * c], [a * c, b + d], [a + c, b * d]]),
        why: `Multiply the tops and the bottoms: ${a} × ${c} = ${a * c} and ${b} × ${d} = ${b * d}, so ${simpler(ans, a * c, b * d)}.` };
    }
    const k = c, ans = [a, b * k], expr = `${a}/${b} ÷ ${k}`;
    return { text: `What is ${expr}?`, short: expr, vis: fracEq(`${df(a, b)} ÷ ${k} = ${M.draw.box}`, expr),
      ...H.fracOpts(r, ans, [[a * k, b], [a, b + k], [k, a * b], [a + k, b * k]]),
      why: `Dividing by ${k} means sharing into ${k} equal parts, so the bottom number gets ${k} times bigger: ${a}/${b} ÷ ${k} = ${simpler(ans, a, b * k)}.` };
  }
  M.add({ id: 'a11-fraction-multiply', skill: SKILL, variants: MUL_V, level: ([kind]) => (kind === 'whole' ? 2 : 3), make: mulQ });

  /* ---------- fractions, decimals and percentages ---------- */
  const NICE = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 8], [3, 8], [5, 8], [7, 8],
    [1, 20], [3, 20], [7, 20], [9, 20], [11, 20], [1, 25], [4, 25], [6, 25], [1, 50], [3, 50]];
  const valOf = s => (s.endsWith('%') ? parseFloat(s) / 100 : s.includes('/') ? s.split('/')[0] / s.split('/')[1] : parseFloat(s));
  const distinct = (ans, list) => list.filter((w, i) => Math.abs(valOf(w) - valOf(ans)) > 1e-9 && list.findIndex(z => Math.abs(valOf(z) - valOf(w)) < 1e-9) === i);
  const FDP_V = M.combos(['toPct', 'toDec', 'toFrac', 'same'], NICE).filter((_, i) => i % 3 !== 2).map(([k, f]) => [k, ...f]);
  function fdpQ([kind, a, b], r) {
    const dec = round6(a / b), p = round6(dec * 100);
    if (kind === 'toPct') {
      return { text: `Write ${F(dec)} as a percentage.`, short: `${F(dec)} as a %`, ...M.textOpts(r, `${F(p)}%`, distinct(`${F(p)}%`, [`${F(dec)}%`, `${F(p / 10)}%`, `${F(p * 10)}%`])),
        why: `Multiply by 100 to turn a decimal into a percentage: ${F(dec)} × 100 = ${F(p)}%.` };
    }
    if (kind === 'toDec') {
      return { text: `Write ${a}/${b} as a decimal.`, short: `${a}/${b} as a decimal`,
        ...M.textOpts(r, F(dec), distinct(F(dec), [`0.${a}${b}`, `${a}.${b}`, F(dec * 10), F(dec / 10)])),
        why: `${a} ÷ ${b} = ${F(dec)}.${b === 8 ? ' (1/8 = 0.125 is a handy one to remember.)' : ''}` };
    }
    if (kind === 'toFrac') {
      const ans = M.simp(Math.round(p * 2), 200);
      return { text: `Write ${F(p)}% as a fraction in its simplest form.`, short: `${F(p)}% as a fraction`,
        ...H.fracOpts(r, ans, [[Math.round(p), 1000], [ans[0] + 1, ans[1]], [ans[0], ans[1] + 5], [Math.round(p) % 10 || 1, 10]]),
        why: `${F(p)}% means ${F(p)} out of 100: ${F(p)}/100 = ${H.fstr(ans)}.` };
    }
    return { text: `Which of these is the same as ${a}/${b}?`, short: `Same as ${a}/${b}`,
      ...M.textOpts(r, F(dec), distinct(F(dec), [`0.${a}${b}`, `${a}.${b}`, `${F(p / 10)}%`, `${F(p * 10)}%`])),
      why: `${a}/${b} = ${a} ÷ ${b} = ${F(dec)}, which is also ${F(p)}%.` };
  }
  M.add({ id: 'a11-fdp', skill: SKILL, variants: FDP_V, level: ([kind, , b]) => (kind === 'toPct' || kind === 'same' ? 1 : b === 8 ? 3 : 2), make: fdpQ });

  /* Which is biggest / smallest out of fractions, decimals and percentages? Tricky ones use closer values. */
  const POOL = [...NICE.map(f => ({ v: f[0] / f[1], f })), ...[0.55, 0.65, 0.45, 0.62, 0.58, 0.67, 0.33, 0.48, 0.72, 0.38, 0.27, 0.81].map(v => ({ v }))];
  function compareQ([kind, i], r) {
    const c = 0.25 + r() * 0.55, win = i % 3 === 0 ? 0.08 : 0.15, byGap = [...POOL].sort((x, y) => Math.abs(x.v - c) - Math.abs(y.v - c));
    let near = POOL.filter(x => Math.abs(x.v - c) <= win);
    if (near.length < 5) near = byGap.slice(0, 6);
    const pick = M.shuffle(r, near).filter((x, j, arr) => arr.findIndex(y => Math.abs(y.v - x.v) < 1e-9) === j).slice(0, 4);
    const shown = pick.map((x, j) => (x.f && j % 2 === 0 ? { ...M.draw.fracOpt(...x.f), v: x.v } : j % 2 ? { t: `${F(x.v * 100)}%`, v: x.v } : { t: F(x.v), v: x.v }));
    const best = shown.reduce((m, x) => ((kind === 'largest' ? x.v > m.v : x.v < m.v) ? x : m));
    const opts = [best, ...shown.filter(x => x !== best)].map(({ v, ...o }) => (o.h ? o : o.t));
    return { text: `Which of these is the ${kind}?`, short: `The ${kind} of ${shown.map(x => x.t).join(', ')}`, opts, a: 0,
      why: `Turn them all into percentages: ${shown.map(x => `${x.t} = ${F(x.v * 100)}%`).join(', ')}. The ${kind} is ${best.t}.` };
  }
  M.add({ id: 'a11-compare-fdp', skill: SKILL, variants: M.combos(['largest', 'smallest'], M.range(0, 20)), level: ([, i]) => (i % 3 === 0 ? 3 : 2), make: compareQ });

  /* ---------- percentages of amounts ---------- */
  const PCT_LV = { 10: 1, 50: 1, 25: 1, 1: 2, 5: 2, 20: 2, 30: 2, 40: 2, 60: 2, 75: 2, 15: 3, 35: 3, 45: 3, 12.5: 3 };
  function pctWhy(p, N, v) {
    if (p === 10 || p === 1) return `${p}% means divide by ${100 / p}: ${N} ÷ ${100 / p} = ${F(v)}.`;
    if (p === 50 || p === 25 || p === 12.5) return `${F(p)}% is ${{ 50: 'a half', 25: 'a quarter', 12.5: 'an eighth' }[p]}: ${N} ÷ ${100 / p} = ${F(v)}.`;
    if (p === 75) return `25% is ${F(N / 4)}, so 75% is 3 × ${F(N / 4)} = ${F(v)}.`;
    if (p === 5) return `10% is ${F(N / 10)}, and 5% is half of that: ${F(v)}.`;
    if (p % 10 === 0) return `10% is ${F(N / 10)}, so ${p}% is ${p / 10} × ${F(N / 10)} = ${F(v)}.`;
    return `10% is ${F(N / 10)} and 5% is ${F(N / 20)}. ${p}% = ${(p - 5) / 10} × ${F(N / 10)} + ${F(N / 20)} = ${F(v)}.`;
  }
  const PCT_V = H.thin(M.combos(Object.keys(PCT_LV).map(Number), [20, 30, 40, 50, 60, 80, 90, 120, 140, 160, 200, 240, 300, 360, 400])
    .filter(([p, N]) => Number.isInteger(round6((p * N) / 100) * 10)), 3);
  M.add({
    id: 'a11-percent-of', skill: SKILL, variants: PCT_V,
    level: ([p]) => PCT_LV[p],
    make: ([p, N], r) => {
      const v = round6((p * N) / 100), ctx = Number.isInteger(v) && r() < 0.4;
      return {
        text: ctx ? `A school has ${N} pupils and ${F(p)}% of them have a pet. How many pupils is that?` : `What is ${F(p)}% of ${N}?`, short: `${F(p)}% of ${N}`,
        ...M.valOpts(r, v, [(p * N) / 10, p, v * 2, v / 2, N - v, v + 1].filter(c => c > 0 && cents(c))), why: pctWhy(p, N, v)
      };
    }
  });

  const ITEMS = ['coat', 'bike', 'board game', 'jacket', 'tent', 'scooter', 'pair of trainers', 'lamp', 'backpack', 'guitar'];
  const CHANGE_V = H.thin([...M.combos([10, 20, 25, 50, 15, 30, 40], [20, 40, 60, 80, 120, 150, 200, 240]).map(([p, N]) => ['off', p, N]),
    ...M.combos([10, 20, 5, 15, 25], [20, 40, 60, 80, 120, 200]).map(([p, N]) => ['up', p, N])], 2);
  M.add({
    id: 'a11-percent-change', skill: SKILL, variants: CHANGE_V,
    level: ([kind, p]) => (kind === 'off' && [10, 20, 25, 50].includes(p) ? 2 : 3),
    make: ([kind, p, N], r) => {
      const ch = round6((p * N) / 100), v = kind === 'off' ? N - ch : N + ch, item = M.pick(r, ITEMS), sign = kind === 'off' ? '−' : '+';
      const text = kind === 'off' ? `A ${item} costs €${N}. In a sale the price is cut by ${p}%. What is the sale price?`
        : `A ${item} costs €${N}. The price goes up by ${p}%. What is the new price?`;
      return {
        text, short: `€${N} ${sign} ${p}%`, long: true,
        ...M.valOpts(r, v, [ch, kind === 'off' ? N - p : N + p, kind === 'off' ? N + ch : N - ch, v + 5].filter(c => c > 0), M.euro, 5),
        why: `${p}% of €${N} is ${M.euro(ch)}. €${N} ${sign} ${M.euro(ch)} = ${M.euro(v)}.`
      };
    }
  });

  /* ---------- decimal calculations ---------- */
  const DEC_V = [...H.thin(M.combos([0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 1.5, 2.5, 0.25, 0.75], M.range(2, 9)).map(([a, k]) => ['mul', a, k]), 5),
    ...H.thin(M.combos([0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.2, 0.15, 0.25], M.range(2, 9)).map(([b, k]) => ['div', round6(b * k), k]), 3),
    ...H.thin(M.combos([0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.2], [0.2, 0.3, 0.4, 0.6, 0.7, 0.9]).map(([a, b]) => ['decdec', a, b]), 5),
    ...H.thin(M.combos([1, 2, 3, 5, 10], [0.45, 0.7, 0.35, 0.08, 1.25, 0.6]).filter(([w, d]) => w > d).map(([w, d]) => ['sub', w, d]), 2)];
  M.add({
    id: 'a11-decimal-calc', skill: SKILL, variants: DEC_V,
    level: ([kind]) => ({ mul: 1, div: 2, sub: 2, decdec: 3 }[kind]),
    make: ([kind, a, b], r) => {
      const op = { mul: '×', div: '÷', decdec: '×', sub: '−' }[kind], v = round6({ '×': a * b, '÷': a / b, '−': a - b }[op]), expr = `${F(a)} ${op} ${F(b)}`;
      const cands = kind === 'sub' ? [v + 1, a - b * 10, v + 0.1, a + b] : [v * 10, v / 10, a + b, v + (kind === 'div' ? 0.1 : 1)];
      const why = {
        mul: `${F(a)} × ${b}: think ${F(a * 10)} × ${b} = ${F(a * 10 * b)}, then divide by 10: ${F(v)}.`,
        div: `${F(a)} ÷ ${b}: think ${F(a * 100)} hundredths ÷ ${b} = ${F(v * 100)} hundredths = ${F(v)}.`,
        decdec: `${F(a * 10)} × ${F(b * 10)} = ${F(a * b * 100)}. There are 2 decimal places in the question, so the answer is ${F(v)}.`,
        sub: `Line up the decimal points: ${F(a)} − ${F(b)} = ${F(v)}. Check: ${F(v)} + ${F(b)} = ${F(a)}.`
      }[kind];
      return { text: `What is ${expr}?`, short: expr, vis: H.eq(`${expr} = ${M.draw.box}`, expr), ...M.valOpts(r, v, cands.map(round6).filter(c => c > 0)), why };
    }
  });
})(window.MBT);
