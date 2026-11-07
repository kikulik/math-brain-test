/* Math Brain Test, ages 11 to 12: algebra & sequences (equations, substitution, simplifying, function machines, sequences). */
(function (M) {
  const H = M.h11, G = M.draw11, F = M.fmtNum, SKILL = 'algebra11';
  /* Letters in italics for the big equation. One wrapping span keeps it a single flex item, so it spaces and wraps like text. */
  const ital = s => `<span>${s.replace(/(^|[^a-z])([a-z])(?![a-z])/g, '$1<i>$2</i>')}</span>`;
  const term = (k, v) => (k === 1 ? v : `${k}${v}`);
  const lin = (k, c, v = 'n') => (c > 0 ? `${term(k, v)} + ${c}` : c < 0 ? `${term(k, v)} − ${-c}` : term(k, v));

  /* ---------- equations ---------- */
  function solveOne(k, r) {
    if (k === 'add') { const a = M.int(r, 3, 19), x = M.int(r, 2, 30), b = x + a; return [`x + ${a} = ${b}`, x, [b + a, b, a, x + 1], `Take ${a} from both sides: x = ${b} − ${a} = ${x}.`]; }
    if (k === 'sub') { const a = M.int(r, 3, 19), x = M.int(r, a + 2, 45), b = x - a; return [`x − ${a} = ${b}`, x, [b - a, b, a, x - 1], `Add ${a} to both sides: x = ${b} + ${a} = ${x}.`]; }
    if (k === 'mul') { const a = M.int(r, 3, 12), x = M.int(r, 3, 12), b = a * x; return [`${a}x = ${b}`, x, [b - a, b + a, x + 1, x - 1], `${a}x means ${a} × x. Divide both sides by ${a}: x = ${b} ÷ ${a} = ${x}.`]; }
    const a = M.int(r, 2, 9), b = M.int(r, 3, 12), x = a * b;
    return [`x ÷ ${a} = ${b}`, x, [b + a, a, x + a, x - b], `Multiply both sides by ${a}: x = ${b} × ${a} = ${x}.`];
  }
  function solveTwo(k, r) {
    const a = M.int(r, 2, 9), x = M.int(r, 2, 12), b = M.int(r, 2, 15);
    if (k === 'plus') { const c = a * x + b; return [`${a}x + ${b} = ${c}`, x, [(c + b) / a, c / a - b, c - b, x + 1], `Take ${b} from both sides: ${a}x = ${c - b}. Then divide by ${a}: x = ${x}.`]; }
    if (k === 'minus') {
      const s = Math.min(b, a * x - 1), c = a * x - s;
      return [`${a}x − ${s} = ${c}`, x, [(c - s) / a, c / a + s, c + s, x - 1], `Add ${s} to both sides: ${a}x = ${c + s}. Then divide by ${a}: x = ${x}.`];
    }
    if (k === 'brackets') { const c = a * (x + b); return [`${a}(x + ${b}) = ${c}`, x, [c / a + b, c - b, x + b, (c - b) / a], `Divide both sides by ${a}: x + ${b} = ${c / a}. Then x = ${c / a} − ${b} = ${x}.`]; }
    if (k === 'divide') { const m = M.int(r, 2, 9), c = m + b; return [`x ÷ ${a} + ${b} = ${c}`, a * m, [c - b, a * c - b, a * c, a * m + a], `Take ${b} from both sides: x ÷ ${a} = ${m}. Then multiply by ${a}: x = ${a * m}.`]; }
    const xn = -M.int(r, 1, 8), bb = M.int(r, 10, 30), c = a * xn + bb;
    return [`${a}x + ${bb} = ${F(c)}`, xn, [-xn, (c + bb) / a, c - bb, xn - 1], `Take ${bb} from both sides: ${a}x = ${F(c - bb)}. Then divide by ${a}: x = ${F(xn)}.`];
  }
  const SOLVE = { add: [1, solveOne], sub: [1, solveOne], mul: [1, solveOne], div: [2, solveOne],
    plus: [2, solveTwo], minus: [2, solveTwo], brackets: [3, solveTwo], divide: [3, solveTwo], negative: [3, solveTwo] };
  M.add({
    id: 'a11-equations', skill: SKILL, variants: M.combos(Object.keys(SOLVE), M.range(0, 10)),
    level: ([k]) => SOLVE[k][0],
    make: ([k], r) => {
      const [eq, x, cands, why] = SOLVE[k][1](k, r);
      return { text: `Solve ${eq}. What is x?`, short: eq, vis: H.eq(ital(eq), eq), ...M.valOpts(r, x, cands.filter(Number.isInteger)), why };
    }
  });

  /* ---------- substitution ---------- */
  function substitute(k, r) {
    const p = M.int(r, 2, 9), q = M.int(r, 1, 12);
    if (k === 'linear') {
      const a = M.int(r, 2, 9), minus = q < p * a && r() < 0.5, v = minus ? p * a - q : p * a + q, op = minus ? '−' : '+';
      return [`If a = ${a}, what is ${p}a ${op} ${q}?`, v, [minus ? p * 10 + a - q : p * 10 + a + q, minus ? p + a - q : p + a + q, minus ? p * a + q : p * a - q],
        `${p}a means ${p} × a = ${p} × ${a} = ${p * a}. Then ${p * a} ${op} ${q} = ${v}.`];
    }
    if (k === 'two') {
      const x = M.int(r, 2, 9), y = M.int(r, 2, 9), s = M.int(r, 2, 6), v = p * x + s * y;
      return [`If x = ${x} and y = ${y}, what is ${p}x + ${s}y?`, v, [p * y + s * x, p + x + s + y, (p + s) * (x + y), v + 1],
        `${p} × ${x} = ${p * x} and ${s} × ${y} = ${s * y}. ${p * x} + ${s * y} = ${v}.`];
    }
    if (k === 'divide') {
      const d = M.int(r, 2, 6), m = d * M.int(r, 3, 12), v = m / d + q;
      return [`If m = ${m}, what is m ÷ ${d} + ${q}?`, v, [m / (d + q), (m + q) / d, m - d + q, v + d],
        `m ÷ ${d} = ${m} ÷ ${d} = ${m / d}. Then ${m / d} + ${q} = ${v}.`];
    }
    if (k === 'square') {
      const n = M.int(r, 2, 7);
      return r() < 0.5
        ? [`If n = ${n}, what is n² + ${q}?`, n * n + q, [2 * n + q, (n + q) ** 2, n + q], `n² means n × n = ${n} × ${n} = ${n * n}. Then ${n * n} + ${q} = ${n * n + q}.`]
        : [`If n = ${n}, what is 2n²?`, 2 * n * n, [(2 * n) ** 2, 4 * n, 2 * n + 2], `Square first, then double: ${n}² = ${n * n}, and 2 × ${n * n} = ${2 * n * n}.`];
    }
    const a = -M.int(r, 1, 6), c = M.int(r, 3, 20), v = p * a + c;
    return [`If a = ${F(a)}, what is ${p}a + ${c}?`, v, [-p * a + c, -v, p * a - c, v + p], `${p} × (${F(a)}) = ${F(p * a)}. Then ${F(p * a)} + ${c} = ${F(v)}.`];
  }
  const SUBST = { linear: 1, two: 2, divide: 2, square: 3, negative: 3 };
  M.add({
    id: 'a11-substitute', skill: SKILL, variants: M.combos(Object.keys(SUBST), M.range(0, 15)),
    level: ([k]) => SUBST[k],
    make: ([k], r) => {
      const [text, v, cands, why] = substitute(k, r);
      return { text, short: text.replace(/^If /, '').replace(/, what is /, ': ').replace(/\?$/, ''), ...M.valOpts(r, v, cands.filter(Number.isInteger)), why };
    }
  });

  /* ---------- simplifying and expanding ---------- */
  function simplify(k, r) {
    const v = M.pick(r, ['a', 'b', 'm', 'x', 'y']), p = M.int(r, 2, 9), q = M.int(r, 3, 9);
    if (k === 'collect') {
      const s = M.int(r, 1, p + q - 2), c = p + q - s;
      return [`${p}${v} + ${q}${v} − ${term(s, v)}`, term(c, v), [term(p + q + s, v), `${term(c, v)}²`, String(c), term(Math.abs(p - q + s) || c + 2, v)],
        `${p} + ${q} − ${s} = ${c}, so there are ${c} lots of ${v}: ${term(c, v)}.`, 'Simplify'];
    }
    if (k === 'two') {
      const s = M.int(r, 1, p - 1), t = M.int(r, 1, 7), x1 = p - s;
      return [`${p}x + ${q}y − ${term(s, 'x')} + ${t}y`, `${term(x1, 'x')} + ${term(q + t, 'y')}`, [`${term(p + s, 'x')} + ${term(q + t, 'y')}`,
        `${term(x1, 'x')} + ${term(Math.abs(q - t) || q + t + 1, 'y')}`, `${x1 + q + t}xy`, `${term(x1 + 1, 'x')} + ${term(q + t, 'y')}`],
        `Collect the x terms: ${p}x − ${term(s, 'x')} = ${term(x1, 'x')}. Then the y terms: ${q}y + ${t}y = ${term(q + t, 'y')}.`, 'Simplify'];
    }
    if (k === 'expand') {
      return [`${p}(x + ${q})`, `${p}x + ${p * q}`, [`${p}x + ${q}`, `x + ${p * q}`, `${p}x + ${p + q}`, `${p * q}x`],
        `Multiply both terms inside the bracket by ${p}: ${p} × x = ${p}x and ${p} × ${q} = ${p * q}.`, 'Expand'];
    }
    if (k === 'expandAdd') {
      const c = M.int(r, 1, 4);
      return [`${p}(x + ${q}) + ${term(c, 'x')}`, `${p + c}x + ${p * q}`, [`${p + c}x + ${q}`, `${p}x + ${p * q + c}`, `${p + c}x + ${p * q + c}`],
        `${p}(x + ${q}) = ${p}x + ${p * q}. Then add ${term(c, 'x')}: ${p}x + ${term(c, 'x')} = ${p + c}x, so ${p + c}x + ${p * q}.`, 'Simplify'];
    }
    return [`${p}a × ${q}b`, `${p * q}ab`, [`${p + q}ab`, `${p}${q}ab`, `${p * q}a + b`],
      `Multiply the numbers and keep the letters: ${p} × ${q} = ${p * q}, and a × b = ab.`, 'Simplify'];
  }
  const SIMP = { collect: 1, two: 2, expand: 2, expandAdd: 3, product: 3 };
  M.add({
    id: 'a11-simplify', skill: SKILL, variants: M.combos(Object.keys(SIMP), M.range(0, 13)),
    level: ([k]) => SIMP[k],
    make: ([k], r) => {
      const [expr, ans, wrong, why, verb] = simplify(k, r);
      return { text: `${verb} ${expr}`, short: `${verb} ${expr}`, vis: H.eq(ital(expr), expr), ...M.textOpts(r, ans, wrong), why };
    }
  });

  /* ---------- function machines ---------- */
  const OP = { '+': (v, k) => v + k, '−': (v, k) => v - k, '×': (v, k) => v * k, '÷': (v, k) => v / k };
  const INV = { '+': '−', '−': '+', '×': '÷', '÷': '×' };
  const WORD = { '+': 'add', '−': 'take away', '×': 'multiply by', '÷': 'divide by' };
  const run = (n, steps) => steps.reduce((v, [o, k]) => OP[o](v, k), n);
  const okRun = (n, steps) => steps.every((s, i) => { const v = run(n, steps.slice(0, i + 1)); return Number.isInteger(v) && v > 0 && v <= 200; });
  const undo = steps => [...steps].reverse().map(([o, k]) => [INV[o], k]);
  const chain = (n, steps) => steps.map((s, i) => `${run(n, steps.slice(0, i))} ${s[0]} ${s[1]} = ${run(n, steps.slice(0, i + 1))}`).join(', ');
  function machineSetup(r, count) {
    for (;;) {
      const n = M.int(r, 2, 12), steps = M.range(1, count).map((_, i) => [M.pick(r, i % 2 ? ['+', '−'] : ['×', '÷', '+']), M.int(r, 2, 9)]);
      if (steps[0][0] === '+' && steps[1][0] === '+') continue;
      if (steps.some((s, i) => i && s[1] === steps[i - 1][1] && INV[s[0]] === steps[i - 1][0])) continue;   // +6 then −6 cancels out
      if (okRun(n, steps)) return [n, steps];
    }
  }
  function machineQ(k, r) {
    const [n, steps] = machineSetup(r, k === 'three' ? 3 : 2), out = run(n, steps), labels = steps.map(([o, kk]) => `${o}${kk}`);
    const said = `The machine does this: ${steps.map(([o, kk]) => `${WORD[o]} ${kk}`).join(', then ')}.`;
    if (k === 'forward' || k === 'three') {
      return [G.machine(labels, n, '?'), `${n} goes into this machine. What number comes out?`, said, out,
        [run(n, [...steps].reverse()), run(n, steps.slice(0, -1)), out + steps[steps.length - 1][1]], `${chain(n, steps)}.`];
    }
    if (k === 'backward') {
      return [G.machine(labels, '?', out), `${out} came out of this machine. What number went in?`, said, n,
        [run(out, steps), run(out, steps.map(([o, kk]) => [INV[o], kk])), n + 1], `Work backwards and do the opposite of each box: ${chain(out, undo(steps))}.`];
    }
    const [o0, k0] = steps[0], mid = run(n, [steps[0]]);
    return [G.machine([`${o0}?`, ...labels.slice(1)], n, out), `${n} goes in and ${out} comes out. What number is missing from the first box?`, said, k0,
      [out - n, k0 + 1, k0 - 1, mid], `Undo the last box: ${chain(out, undo(steps.slice(1)))}. So ${n} ${o0} ? = ${mid}, and ${n} ${o0} ${k0} = ${mid}.`];
  }
  const MACH = { forward: 1, three: 2, backward: 2, missing: 3 };
  M.add({
    id: 'a11-machines', skill: SKILL, variants: M.combos(Object.keys(MACH), M.range(0, 17)),
    level: ([k]) => MACH[k],
    make: ([k], r) => {
      const [vis, text, said, ans, cands, why] = machineQ(k, r);
      return { text, say: `${said} ${text}`, short: text.replace(' this machine', ' the machine'), vis, ...M.numOpts(r, ans, cands.filter(Number.isInteger)), why };
    }
  });

  /* ---------- linear sequences ---------- */
  const AD = M.combos(M.range(1, 9), M.range(2, 9));
  const NTH_V = [...H.cap(AD.map(([a, d]) => ['tenth', a, d]), 20), ...H.cap(AD.map(([a, d]) => ['rule', a, d]), 22),
    ...H.cap(AD.map(([a, d]) => ['which', a, d]), 16), ...M.combos([13, 17, 20, 25, 30], M.range(3, 7)).map(([a, d]) => ['down', a, d])];
  function nthQ([k, a, d], r) {
    const sign = k === 'down' ? -1 : 1, terms = M.range(0, 3).map(i => a + sign * i * d), shown = M.draw.chips([...terms.map(F), '…']);
    const c = a - d, rule = lin(d, c), list = terms.map(F).join(', ');
    if (k === 'tenth') {
      return { text: 'What is the 10th term of this sequence?', short: `10th term of ${list}…`, vis: shown, ...M.numOpts(r, a + 9 * d, [a + 10 * d, 10 * d, a + 8 * d, 10 * a]),
        why: `Each term is ${d} more. From the 1st term to the 10th is 9 jumps: ${a} + 9 × ${d} = ${a + 9 * d}.` };
    }
    if (k === 'rule') {
      return { text: 'Which rule gives the nth term of this sequence?', short: `Rule for ${list}…`, vis: shown,
        ...M.textOpts(r, rule, [lin(d, a), `n + ${d}`, lin(d + 1, c - 1)]),
        why: `The terms go up by ${d}, so the rule starts ${d}n. When n = 1, ${d}n = ${d}, and the first term is ${a}, so the rule is ${rule}.` };
    }
    if (k === 'which') {
      const m = M.int(r, 8, 15), target = a + (m - 1) * d;
      return { text: `Which term of this sequence is ${target}?`, short: `Which term of ${list}… is ${target}?`, vis: shown,
        ...M.numOpts(r, m, [m - 1, m + 1, Math.floor(target / d), target - a]),
        why: `The rule is ${rule}. When n = ${m}: ${d} × ${m} ${c < 0 ? '−' : '+'} ${Math.abs(c)} = ${target}. So ${target} is term number ${m}.` };
    }
    const v = a - 5 * d;
    return { text: 'This sequence keeps going down by the same amount. What is the 6th term?', short: `6th term of ${list}…`, vis: shown,
      ...M.valOpts(r, v, [a - 6 * d, -v, a - 4 * d, v + 1]), why: `Each term is ${d} less. The 6th term is 5 jumps after the 1st: ${a} − 5 × ${d} = ${F(v)}.` };
  }
  M.add({ id: 'a11-nth-term', skill: SKILL, variants: NTH_V, level: ([k]) => (k === 'tenth' || k === 'down' ? 2 : 3), make: nthQ });

  /* ---------- special sequences ---------- */
  const tri = n => (n * (n + 1)) / 2;
  const SPECIAL = {
    squares: [1, [1, 2, 3, 4, 5, 6], k => M.range(k, k + 4).map(i => i * i), k => `They are square numbers: ${k}², ${k + 1}², ${k + 2}², ${k + 3}², so next is ${k + 4}² = ${(k + 4) ** 2}.`],
    doubling: [1, [3, 5, 6, 7, 9, 11], a => [1, 2, 4, 8, 16].map(m => a * m), a => `Each term is double the one before: ${8 * a} × 2 = ${16 * a}.`],
    halving: [1, [3, 5, 7, 9, 11, 13], a => [16, 8, 4, 2, 1].map(m => a * m), a => `Each term is half the one before: ${2 * a} ÷ 2 = ${a}.`],
    triangle: [2, [1, 2, 3, 4, 5], k => M.range(k, k + 4).map(tri), k => `The gaps grow by 1 each time: +${k + 1}, +${k + 2}, +${k + 3}. Next add ${k + 4}: ${tri(k + 3)} + ${k + 4} = ${tri(k + 4)}.`],
    fibonacci: [2, [[1, 2], [2, 3], [1, 3], [2, 5], [3, 4], [1, 4], [3, 5], [2, 7]], ([a, b]) => [a, b, a + b, a + 2 * b, 2 * a + 3 * b, 3 * a + 5 * b],
      ([a, b]) => `Each term is the two before it added together: ${a + 2 * b} + ${2 * a + 3 * b} = ${3 * a + 5 * b}.`],
    squarePlus: [3, [1, 2, 3, 5, 6], c => M.range(1, 6).map(i => i * i + c), c => `The gaps are 3, 5, 7, 9: they go up by 2. The next gap is 11: ${25 + c} + 11 = ${36 + c}.`],
    cubes: [3, [1, 2, 3], k => M.range(k, k + 4).map(i => i ** 3), k => `They are cube numbers: ${k}³, ${k + 1}³, ${k + 2}³, ${k + 3}³, so next is ${k + 4}³ = ${(k + 4) ** 3}.`],
    doublePlus: [3, [1, 2, 3, 4, 5], a => [a, 2 * a + 1, 4 * a + 3, 8 * a + 7, 16 * a + 15], a => `Each term is double the one before, plus 1: ${8 * a + 7} × 2 + 1 = ${16 * a + 15}.`]
  };
  M.add({
    id: 'a11-special-sequences', skill: SKILL,
    variants: Object.keys(SPECIAL).flatMap(k => SPECIAL[k][1].map((_, i) => [k, i])),
    level: ([k]) => SPECIAL[k][0],
    make: ([k, i], r) => {
      const p = SPECIAL[k][1][i], all = SPECIAL[k][2](p), shown = all.slice(0, -1), next = all[all.length - 1];
      const last = shown[shown.length - 1], prev = shown[shown.length - 2];
      return {
        text: 'What comes next in this sequence?', short: `${shown.join(', ')}, ?`, say: `${shown.join(', ')}. What comes next?`,
        vis: M.draw.chips([...shown.map(F), '?']), ...M.numOpts(r, next, [last + (last - prev), last * 2, last + prev + 1, next + 1, next - 2]),
        why: SPECIAL[k][3](p)
      };
    }
  });

  /* ---------- writing expressions: [level, k => [question, short, answer, wrong answers, why]] ---------- */
  const means = p => `Which expression means “${p}”?`;
  const WORDS = [
    [1, k => [means(`${k} more than n`), `${k} more than n`, `n + ${k}`, [`${k}n`, `n − ${k}`, `${k} − n`, `n + ${k + 1}`], `“More than” means add: n + ${k}.`]],
    [1, k => [means(`${k} less than n`), `${k} less than n`, `n − ${k}`, [`${k} − n`, `${k}n`, `n + ${k}`, `n ÷ ${k}`],
      `Start with n and take ${k} away: n − ${k}. (${k} − n would mean n less than ${k}.)`]],
    [1, k => [means(`n multiplied by ${k}`), `n multiplied by ${k}`, `${k}n`, [`n + ${k}`, `n − ${k}`, `n ÷ ${k}`, `${k} + n`], `${k} × n is written ${k}n.`]],
    [2, k => [means(`double n, then add ${k}`), `double n, then add ${k}`, `2n + ${k}`, [`2(n + ${k})`, `n + ${k + 2}`, `${k}n + 2`, `2n + ${2 * k}`],
      `Double n is 2n. Then add ${k}: 2n + ${k}.`]],
    [2, k => [means(`add ${k} to n, then multiply by 3`), `add ${k} to n, then × 3`, `3(n + ${k})`, [`3n + ${k}`, `n + ${3 * k}`, `${k}n + 3`, `n + ${k} + 3`],
      `The adding happens first, so it goes in a bracket: (n + ${k}). Then multiply by 3: 3(n + ${k}).`]],
    [2, k => [means(`divide n by ${k}, then take away 1`), `n divided by ${k}, then − 1`, `n ÷ ${k} − 1`, [`(n − 1) ÷ ${k}`, `${k} ÷ n − 1`, `n − ${k} − 1`, `n ÷ (${k} − 1)`],
      `Divide first: n ÷ ${k}. Then take away 1: n ÷ ${k} − 1.`]],
    [3, k => [`Mia is n years old. Her brother is ${k} years older than her. Which expression gives their two ages added together?`, 'Mia’s and her brother’s ages together',
      `2n + ${k}`, [`n + ${k}`, `2n + ${2 * k}`, `${k}n`, `n + ${2 * k}`], `Mia is n and her brother is n + ${k}. Together: n + n + ${k} = 2n + ${k}.`]],
    [3, k => [`Pens cost p cents each. Which expression gives the cost, in cents, of ${k} pens and a 50-cent ruler?`, `${k} pens and a ruler`,
      `${k}p + 50`, [`${k + 50}p`, `p + ${k + 50}`, `${k}(p + 50)`, `50p + ${k}`], `${k} pens cost ${k} × p = ${k}p cents. Add the ruler: ${k}p + 50.`]],
    [3, k => [`A rectangle is w cm wide. Its length is ${k} cm more than its width. Which expression gives its perimeter in cm?`, 'Perimeter of the rectangle',
      `4w + ${2 * k}`, [`2w + ${k}`, `4w + ${k}`, `w + ${k}`, `2w + ${2 * k}`], `The length is w + ${k}. Perimeter = w + w + (w + ${k}) + (w + ${k}) = 4w + ${2 * k}.`]]
  ];
  M.add({
    id: 'a11-expressions', skill: SKILL, variants: H.cap(M.combos(M.range(0, WORDS.length - 1), M.range(2, 9)), 60),
    level: ([i]) => WORDS[i][0],
    make: ([i, k], r) => {
      const [text, short, ans, wrong, why] = WORDS[i][1](k);
      return { text, short, long: WORDS[i][0] === 3, ...M.textOpts(r, ans, wrong), why };
    }
  });
})(window.MBT);
