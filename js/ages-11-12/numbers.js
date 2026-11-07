/* Math Brain Test, ages 11 to 12: number sense (negatives, order of operations, primes, factors, powers, rounding, decimals). */
(function (M) {
  const H = M.h11, F = M.fmtNum, SKILL = 'numbers11';
  const par = v => (v < 0 ? `(${F(v)})` : String(v));
  const signRule = (a, b) => (a < 0 && b < 0 ? 'Two negative signs make a positive' : 'One negative sign makes the answer negative');

  /* ---------- negative numbers ---------- */
  const pairs = (as, bs, k) => M.combos(as, bs).map(([a, b]) => [k, a, b]);
  const NEG = [
    ...H.thin(pairs(M.range(-9, -1), M.range(2, 9), '+'), 5),
    ...H.thin(pairs(M.range(1, 8), M.range(2, 9), '−').filter(([, a, b]) => a < b), 3),
    ...H.thin(pairs(M.range(-9, -1), M.range(2, 9), '−'), 5),
    ...H.thin(pairs(M.range(-9, 9).filter(Boolean), M.range(-9, -2), '+'), 11),
    ...H.thin(pairs(M.range(-9, 9).filter(Boolean), M.range(-9, -2), '−'), 11),
    ...H.thin(pairs(M.range(-9, -2), M.range(2, 9), '×'), 7),
    ...H.thin(pairs(M.range(-9, -2), M.range(-9, -2), '×'), 7),
    ...H.thin(M.combos(M.range(2, 9), M.range(2, 9)).map(([a, b]) => ['÷', -a * b, b]), 7),
    ...H.thin(M.combos(M.range(2, 9), M.range(2, 9)).map(([a, b]) => ['÷', a * b * (a % 2 ? 1 : -1), -b]), 7)
  ];
  function negWhy(k, a, b, v) {
    const A = Math.abs(a), B = Math.abs(b);
    if (k === '×' || k === '÷') return `${A} ${k} ${B} = ${Math.abs(v)}. ${signRule(a, b)}, so the answer is ${F(v)}.`;
    if (b < 0) return k === '+' ? `Adding a negative is the same as taking away: ${F(a)} − ${B} = ${F(v)}.`
      : `Taking away a negative is the same as adding: ${F(a)} + ${B} = ${F(v)}.`;
    return `Start at ${F(a)} on a number line and count ${k === '+' ? 'up' : 'down'} ${b}. You reach ${F(v)}.`;
  }
  M.add({
    id: 'a11-negatives', skill: SKILL, variants: NEG,
    level: ([k, a, b]) => (k === '×' || k === '÷' ? (b < 0 ? 3 : 2) : b < 0 ? (k === '−' ? 3 : 2) : a < 0 && k === '−' ? 2 : 1),
    make: ([k, a, b], r) => {
      const expr = `${F(a)} ${k} ${par(b)}`, v = { '+': a + b, '−': a - b, '×': a * b, '÷': a / b }[k];
      const A = Math.abs(a), B = Math.abs(b), s = Math.sign(v) || 1;
      const cands = k === '+' || k === '−' ? [-v, A + B, -(A + B), A - B, B - A] : [-v, v + s, -v - s, k === '×' ? A + B : a + b];
      return { text: `What is ${expr}?`, short: expr, vis: H.eq(`${expr} = ${M.draw.box}`, expr), ...M.valOpts(r, v, cands), why: negWhy(k, a, b, v) };
    }
  });

  const PLACES = ['Oslo', 'Rome', 'Cairo', 'Moscow', 'Helsinki', 'Madrid', 'Reykjavik', 'Lisbon', 'Warsaw', 'Athens'];
  const TEMP = [
    ...H.thin(pairs([-12, -10, -9, -7, -6, -4, -3, -2], [5, 8, 11, 14], 'rise'), 2),
    ...M.combos(M.range(2, 9), [3, 6, 10]).map(([s, d]) => ['fall', s, s + d]),
    ...pairs([-9, -7, -5, -3, -2], [4, 6, 9, 12], 'warmer'),
    ...[[-2, -9], [-3, -11], [-1, -7], [-4, -13], [-5, -12], [-6, -15], [-2, -14], [-3, -8], [-1, -10], [-4, -9]].map(([a, b]) => ['colder', a, b])
  ];
  M.add({
    id: 'a11-temperature', skill: SKILL, variants: TEMP,
    level: ([k]) => ({ rise: 1, fall: 2, warmer: 2, colder: 3 }[k]),
    make: ([k, a, b], r) => {
      const [p1, p2] = M.shuffle(r, PLACES), deg = v => `${F(v)} °C`, gap = v => `${v} degrees`;
      if (k === 'rise' || k === 'fall') {
        const end = k === 'rise' ? a + b : a - b;
        const text = k === 'rise'
          ? `At 6 am it was ${F(a)} °C in ${p1}. By noon the temperature had gone up by ${b} degrees. What was the temperature at noon?`
          : `In the evening it was ${a} °C in ${p1}. Overnight the temperature fell by ${b} degrees. What was it in the morning?`;
        const cands = k === 'rise' ? [a - b, -end, end + 1, -(a - b)] : [-end, a + b, end - 1, b];
        return { text, short: `${F(a)} °C ${k === 'rise' ? 'up' : 'down'} ${b}`, long: true, ...M.valOpts(r, end, cands, deg),
          why: `${F(a)} ${k === 'rise' ? '+' : '−'} ${b} = ${F(end)}, so it was ${F(end)} °C.` };
      }
      const diff = a < b ? b - a : a - b, text = k === 'warmer'
        ? `At midday it is ${F(a)} °C in ${p1} and ${b} °C in ${p2}. How many degrees warmer is it in ${p2}?`
        : `One night it was ${F(a)} °C in ${p1} and ${F(b)} °C in ${p2}. How many degrees colder was it in ${p2}?`;
      const cands = (k === 'warmer' ? [b + a, b, Math.abs(a), diff + 2] : [Math.abs(a) + Math.abs(b), Math.abs(b), diff + 2, diff - 2]).filter(c => c > 0);
      return { text, short: `${F(a)} °C and ${F(b)} °C`, long: true, ...M.valOpts(r, diff, cands, gap),
        why: k === 'warmer' ? `From ${F(a)} up to 0 is ${-a} degrees, then up to ${b} is ${b} more: ${-a} + ${b} = ${diff}.`
          : `${F(a)} − (${F(b)}) = ${F(a)} + ${-b} = ${diff}, so it was ${diff} degrees colder.` };
    }
  });

  /* ---------- order of operations ---------- */
  const ORDER = {
    addMul: [1, M.combos([3, 5, 7, 9, 12], [2, 3, 4, 6], [3, 5, 7]), ([a, b, c]) => [`${a} + ${b} × ${c}`, a + b * c,
      [(a + b) * c, a + b + c], `Multiply first: ${b} × ${c} = ${b * c}. Then ${a} + ${b * c} = ${a + b * c}.`]],
    brMul: [1, M.combos([2, 4, 6, 8, 11], [3, 5, 7], [2, 3, 4, 6]), ([a, b, c]) => [`(${a} + ${b}) × ${c}`, (a + b) * c,
      [a + b * c, a + b + c], `Brackets first: ${a} + ${b} = ${a + b}. Then ${a + b} × ${c} = ${(a + b) * c}.`]],
    subMul: [2, M.combos([30, 40, 45, 50, 60], [3, 4, 6], [4, 5, 7]), ([a, b, c]) => [`${a} − ${b} × ${c}`, a - b * c,
      [(a - b) * c, a - b - c], `Multiply first: ${b} × ${c} = ${b * c}. Then ${a} − ${b * c} = ${a - b * c}.`]],
    addDiv: [2, M.combos([5, 8, 10, 14, 20], [24, 36, 48, 60], [3, 4, 6]), ([a, b, c]) => [`${a} + ${b} ÷ ${c}`, a + b / c,
      [(a + b) / c, a + b - c], `Divide first: ${b} ÷ ${c} = ${b / c}. Then ${a} + ${b / c} = ${a + b / c}.`]],
    mulSub: [2, M.combos([3, 4, 6, 7], [5, 8, 9], [2, 3], [4, 6]), ([a, b, c, d]) => [`${a} × ${b} − ${c} × ${d}`, a * b - c * d,
      [(a * b - c) * d, a * (b - c) * d], `Do both multiplications first: ${a * b} − ${c * d} = ${a * b - c * d}.`]],
    mulBr: [3, M.combos([2, 3, 4, 5], [3, 6, 8], [2, 5, 7], [4, 9]), ([a, b, c, d]) => [`${a} × (${b} + ${c}) − ${d}`, a * (b + c) - d,
      [a * b + c - d, a * (b + c - d)], `Brackets first: ${b} + ${c} = ${b + c}. Then ${a} × ${b + c} = ${a * (b + c)}, and take away ${d}.`]],
    square: [3, M.combos([3, 4, 5, 6, 7, 8], [2, 3, 4], [2, 5, 6]), ([a, b, c]) => [`${a}² + ${b} × ${c}`, a * a + b * c,
      [2 * a + b * c, (a * a + b) * c], `Powers first: ${a}² = ${a * a}. Then ${b} × ${c} = ${b * c}, and ${a * a} + ${b * c} = ${a * a + b * c}.`]],
    brSquare: [3, M.combos([2, 3, 4, 5, 6], [1, 2, 3, 4], [2, 3, 5]), ([a, b, c]) => [`(${a} + ${b})² − ${c}`, (a + b) ** 2 - c,
      [a * a + b * b - c, 2 * (a + b) - c], `Brackets first: ${a} + ${b} = ${a + b}. Then ${a + b}² = ${(a + b) ** 2}, and take away ${c}.`]]
  };
  const orderOk = ([k, ...p]) => { const [, v, wrong] = ORDER[k][2](p); return v >= 0 && Number.isInteger(v) && !wrong.includes(v); };
  M.add({
    id: 'a11-order', skill: SKILL,
    variants: Object.keys(ORDER).flatMap(k => H.cap(ORDER[k][1].map(p => [k, ...p]).filter(orderOk), 10)),
    level: ([k]) => ORDER[k][0],
    make: ([k, ...p], r) => {
      const [expr, v, wrong, why] = ORDER[k][2](p);
      return {
        text: `Work out ${expr}`, short: expr, vis: H.eq(`${expr} = ${M.draw.box}`, expr),
        ...M.numOpts(r, v, [...wrong.filter(Number.isInteger), v + 2, v - 2, v + 10]), why
      };
    }
  });

  /* ---------- primes, factors and multiples ---------- */
  const sf = n => { for (let k = 2; k * k <= n; k++) if (n % k === 0) return k; return n; };
  const split = n => `${n} = ${sf(n)} × ${n / sf(n)}`;
  const nextPrime = n => { let p = n + 1; while (!H.isPrime(p)) p++; return p; };
  const PRIMES = M.range(11, 97).filter(H.isPrime);
  const ODD_COMPOSITES = [9, 15, 21, 25, 27, 33, 35, 39, 45, 49, 51, 55, 57, 63, 65, 69, 75, 77, 81, 85, 87, 91, 93, 95, 99];
  const PRIME_V = [...PRIMES.map(p => ['is', p]), ...[27, 33, 39, 49, 51, 57, 63, 69, 77, 87, 91, 93].map(c => ['not', c]),
    ...[20, 24, 28, 32, 36, 40, 44, 48, 52, 54, 60, 62, 66, 70, 74, 78, 84, 90].map(n => ['next', n])];
  M.add({
    id: 'a11-primes', skill: SKILL, variants: PRIME_V,
    level: ([k, n]) => (k === 'is' ? (n < 30 ? 1 : n < 60 ? 2 : 3) : k === 'not' ? (n <= 51 ? 2 : 3) : nextPrime(n) < 50 ? 2 : 3),
    make: ([k, n], r) => {
      if (k === 'is') {
        const wrong = H.nearest(r, ODD_COMPOSITES, n, 3);
        return { text: 'Which of these numbers is a prime number?', short: `Which is prime? (${n})`, opts: [n, ...wrong].map(String), a: 0,
          why: `${wrong.map(split).join(', ')}. Only ${n} can't be divided by anything except 1 and itself.` };
      }
      if (k === 'not') {
        const wrong = H.nearest(r, PRIMES.filter(p => p !== n), n, 3);
        return { text: 'Which of these numbers is NOT a prime number?', short: `Which is not prime? (${n})`, opts: [n, ...wrong].map(String), a: 0,
          why: `${split(n)}, so ${n} is not prime. The other three can only be divided by 1 and themselves.` };
      }
      const p = nextPrime(n), odds = M.range(n + 1, p - 1).filter(x => x % 2);
      return {
        text: `What is the first prime number after ${n}?`, short: `First prime after ${n}`,
        ...M.numOpts(r, p, [n + 1, nextPrime(p), p + 2, n - 1].filter(x => x !== p)),
        why: `${odds.length ? `${odds.map(split).join(', ')}. ` : ''}${p} can only be divided by 1 and itself.`
      };
    }
  });

  const FACT_V = [...[24, 28, 32, 36, 42, 45, 48, 54, 56, 63, 72, 84, 96].map(n => ['factor', n]),
    ...M.combos(M.range(6, 12), [4, 7]).map(([k, j]) => ['multiple', k, j]),
    ...[[12, 18], [16, 24], [15, 25], [18, 27], [20, 30], [24, 36], [14, 21], [28, 42], [24, 40], [30, 45], [36, 48], [27, 36],
      [32, 48], [45, 60], [42, 56], [21, 35], [16, 40], [18, 30], [48, 60], [54, 72]].map(p => ['hcf', ...p]),
    ...[[4, 6], [6, 8], [4, 10], [6, 9], [8, 12], [6, 10], [9, 12], [10, 15], [12, 16], [3, 8], [5, 6], [4, 7], [12, 18], [8, 10],
      [6, 15], [14, 21], [9, 15], [10, 12], [15, 20], [16, 24]].map(p => ['lcm', ...p])];
  function factorQ([k, a, b], r) {
    if (k === 'factor') {
      const f = M.pick(r, M.range(3, 12).filter(x => a % x === 0)), non = M.range(3, 15).filter(x => a % x);
      return { text: `Which of these numbers is a factor of ${a}?`, short: `A factor of ${a}`, ...M.numOpts(r, f, H.nearest(r, non, f, 3)),
        why: `${a} ÷ ${f} = ${a / f} exactly, so ${f} is a factor of ${a}. The others leave a remainder.` };
    }
    if (k === 'multiple') {
      const m = a * b;
      return { text: `Which of these numbers is a multiple of ${a}?`, short: `A multiple of ${a}`,
        ...M.numOpts(r, m, [m - 1, m + 1, m + 2, m - 2, a + b * 10].filter(x => x % a)), why: `${a} × ${b} = ${m}, so ${m} is in the ${a} times table.` };
    }
    const g = M.gcd(a, b), l = M.lcm(a, b);
    if (k === 'hcf') {
      return { text: `What is the highest common factor (HCF) of ${a} and ${b}?`, short: `HCF of ${a} and ${b}`,
        ...M.numOpts(r, g, [g / 2, g * 2, l, b - a, Math.min(a, b)]),
        why: `${g} goes into both: ${a} = ${g} × ${a / g} and ${b} = ${g} × ${b / g}. Nothing bigger goes into both.` };
    }
    const big = Math.max(a, b), small = Math.min(a, b), steps = M.range(1, l / big).map(i => i * big);
    return { text: `What is the lowest common multiple (LCM) of ${a} and ${b}?`, short: `LCM of ${a} and ${b}`,
      ...M.numOpts(r, l, [a * b, l * 2, g, a + b, big * 2]),
      why: `Count in ${big}s: ${steps.join(', ')}. ${l} is the first one that ${small} also goes into.` };
  }
  M.add({
    id: 'a11-factors', skill: SKILL, variants: FACT_V,
    level: ([k, a, b]) => (k === 'factor' || k === 'multiple' ? 1 : k === 'hcf' ? 2 : M.lcm(a, b) <= 36 ? 2 : 3),
    make: factorQ
  });

  /* ---------- powers and roots ---------- */
  const POW_V = [...M.range(3, 15).map(n => ['sq', n]), ...[2, 3, 4, 5, 6, 10].map(n => ['cube', n]), ...M.range(4, 15).map(n => ['root', n]),
    ...H.cap(M.combos(M.range(2, 8), M.range(2, 8)).filter(([a, b]) => a < b).map(([a, b]) => ['sum', a, b]), 12)];
  M.add({
    id: 'a11-powers', skill: SKILL, variants: POW_V,
    level: ([k, n]) => (k === 'sq' || k === 'root' ? (n <= 12 ? 1 : 2) : k === 'cube' ? ([2, 3, 10].includes(n) ? 2 : 3) : 2),
    make: ([k, n, m], r) => {
      const Q = {
        sq: [`${n}²`, n * n, [2 * n, n * n + n, (n + 1) ** 2, (n - 1) ** 2], `${n}² means ${n} × ${n} = ${n * n}.`],
        cube: [`${n}³`, n ** 3, [3 * n, n * n, n ** 3 + n * n, (n + 1) ** 3], `${n}³ means ${n} × ${n} × ${n} = ${n ** 3}.`],
        root: [`√${n * n}`, n, [n + 1, n - 1, 2 * n, (n * n) / 2], `${n} × ${n} = ${n * n}, so the square root of ${n * n} is ${n}.`],
        sum: [`${n}² + ${m}²`, n * n + m * m, [(n + m) ** 2, 2 * n + 2 * m, n * n * m * m, n * n + m * m + 1],
          `${n}² = ${n * n} and ${m}² = ${m * m}. ${n * n} + ${m * m} = ${n * n + m * m}.`]
      }[k];
      return { text: `What is ${Q[0]}?`, short: Q[0], vis: H.eq(`${Q[0]} = ${M.draw.box}`, Q[0]), ...M.numOpts(r, Q[1], Q[2]), why: Q[3] };
    }
  });

  const POW10_V = [...M.combos([3.7, 0.45, 2.06, 0.8, 12.5, 0.063, 4.25, 0.09], [10, 100, 1000]).map(([x, p]) => ['×', x, p]),
    ...M.combos([45, 7, 360, 2.5, 0.6, 81.3, 1250, 9.04], [10, 100, 1000]).map(([x, p]) => ['÷', x, p])];
  M.add({
    id: 'a11-powers-of-ten', skill: SKILL, variants: POW10_V,
    level: ([k, x, p]) => (k === '÷' ? (p === 1000 ? 3 : 2) : p === 1000 || String(x).length > 4 ? 2 : 1),
    make: ([k, x, p], r) => {
      const v = Math.round((k === '×' ? x * p : x / p) * 1e6) / 1e6, places = String(p).length - 1, expr = `${F(x)} ${k} ${F(p)}`;
      const cands = [v * 10, v / 10, v * 100, v / 100, k === '×' ? x / p : x * p].filter(c => c >= 0.001 && c < 1e6);
      return {
        text: `What is ${expr}?`, short: expr, vis: H.eq(`${expr} = ${M.draw.box}`, expr), ...M.valOpts(r, v, cands),
        why: `${k === '×' ? 'Multiplying' : 'Dividing'} by ${F(p)} moves every digit ${places} place${places > 1 ? 's' : ''} to the ${k === '×' ? 'left' : 'right'}: ${F(x)} becomes ${F(v)}.`
      };
    }
  });

  /* ---------- rounding (numbers held as whole hundredths/thousandths so there is no float noise) ---------- */
  const until = (r, lo, hi, bad) => { let X; do X = M.int(r, lo, hi); while (bad(X)); return X; };
  const ROUND = {
    whole: [1, r => until(r, 1001, 9999, X => X % 100 === 50 || X % 100 === 0), X => {
      const a = Math.round(X / 100), up = X % 100 >= 50;
      return [(X / 100).toFixed(2), 'the nearest whole number', String(a), [a + (up ? -1 : 1), a + (up ? 1 : -1), Math.round(X / 1000) * 10].map(String)
        .concat((Math.round(X / 10) / 10).toFixed(1), (Math.floor(X / 10) / 10).toFixed(1)), up];
    }],
    thou: [1, r => until(r, 10001, 99999, N => N % 1000 === 500 || N % 1000 === 0), N => {
      const a = Math.round(N / 1000) * 1000, up = N % 1000 >= 500;
      return [F(N), 'the nearest thousand', F(a), [a + (up ? -1000 : 1000), a + (up ? 1000 : -1000), Math.round(N / 100) * 100,
        Math.round(N / 1e4) * 1e4, Math.floor(N / 100) * 100].map(F), up];
    }],
    tenthou: [2, r => until(r, 100001, 999999, N => N % 1e4 === 5000 || N % 1e4 === 0), N => {
      const a = Math.round(N / 1e4) * 1e4, up = N % 1e4 >= 5000;
      return [F(N), 'the nearest ten thousand', F(a), [a + (up ? -1e4 : 1e4), a + (up ? 1e4 : -1e4), Math.round(N / 1000) * 1000,
        Math.round(N / 1e5) * 1e5, Math.floor(N / 1000) * 1000].map(F), up];
    }],
    dp1: [2, r => until(r, 1001, 9999, X => Math.floor(X / 10) % 10 === 5 || X % 10 === 0 || Math.round(X / 100) % 10 === 0 || Math.round(X / 10) % 10 === 0), X => {
      const a = Math.round(X / 100), up = X % 100 >= 50;
      return [(X / 1000).toFixed(3), '1 decimal place', (a / 10).toFixed(1),
        [((a + (up ? -1 : 1)) / 10).toFixed(1), (Math.round(X / 10) / 100).toFixed(2), String(Math.round(X / 1000)), ((a + 10) / 10).toFixed(1)], up];
    }],
    dp2: [2, r => until(r, 1001, 9999, X => X % 10 === 5 || X % 10 === 0 || Math.round(X / 10) % 10 === 0), X => {
      const a = Math.round(X / 10), up = X % 10 >= 5;
      return [(X / 1000).toFixed(3), '2 decimal places', (a / 100).toFixed(2),
        [((a + (up ? -1 : 1)) / 100).toFixed(2), (Math.round(X / 100) / 10).toFixed(1), ((a + 10) / 100).toFixed(2), ((a + (up ? 1 : -1)) / 100).toFixed(2)], up];
    }],
    carry: [3, r => M.int(r, 1, 8) * 100 + 90 + M.int(r, 5, 9), X => {
      const w = Math.floor(X / 100);
      return [(X / 100).toFixed(2), '1 decimal place', (w + 1).toFixed(1), [`${w}.9`, `${w}.10`, `${w + 1}.1`], true];
    }]
  };
  M.add({
    id: 'a11-rounding', skill: SKILL,
    variants: M.combos(Object.keys(ROUND), M.range(0, 12)),
    level: ([k]) => ROUND[k][0],
    make: ([k], r) => {
      const [x, to, ans, wrong, up] = ROUND[k][2](ROUND[k][1](r)), val = s => +s.replace(/,/g, '');
      const uniq = wrong.filter((w, i) => val(w) !== val(ans) && wrong.findIndex(z => val(z) === val(w)) === i);   // "4.0" and "4" are the same answer
      return {
        text: `Round ${x} to ${to}.`, short: `${x} to ${to}`, ...M.textOpts(r, ans, uniq),
        why: k === 'carry' ? `The second decimal digit is 5 or more, so round up: ${x} → ${ans}. The 9 tenths become 10 tenths, which is 1 whole.`
          : `Look at the digit just after the place you are rounding to. It is ${up ? '5 or more, so round up' : 'less than 5, so round down'}: ${x} → ${ans}.`
      };
    }
  });

  /* ---------- decimal place value ---------- */
  const PLACE = ['tenths', 'hundredths', 'thousandths'];
  const DEC_V = [...M.combos(['value'], M.range(0, 17)), ...M.combos(['biggest', 'smallest', 'between'], M.range(0, 11))];
  function decimalQ([k, i], r) {
    if (k === 'value') {
      const d = M.shuffle(r, M.range(1, 9)).slice(0, 4), pos = (i % 3) + 1, x = `${d[0]}.${d[1]}${d[2]}${d[3]}`, digit = d[pos];
      const vals = [digit / 10, digit / 100, digit / 1000, digit].map(F);
      return { text: `What is the value of the digit ${digit} in ${x}?`, short: `The ${digit} in ${x}`, ...M.textOpts(r, vals[pos - 1], vals),
        why: `In ${x} the ${digit} is in the ${PLACE[pos - 1]} place, so it is worth ${vals[pos - 1]}.` };
    }
    const a = M.int(r, 2, 8), b = M.int(r, 1, 9), c = M.int(r, 1, 9);
    if (k === 'biggest') {
      return { text: 'Which of these numbers is the biggest?', short: `Biggest: 0.${a}`, ...M.textOpts(r, `0.${a}`, [`0.${a - 1}${b}`, `0.${a - 1}${b}${c}`, `0.0${a}${b}`]),
        why: `Compare the tenths first: 0.${a} has ${a} tenths and all the others have fewer. More digits doesn't mean bigger.` };
    }
    if (k === 'smallest') {
      return { text: 'Which of these numbers is the smallest?', short: `Smallest: 0.0${a}${b}`, ...M.textOpts(r, `0.0${a}${b}`, [`0.${a}0${b}`, `0.${a}${b}`, `0.${b}`]),
        why: `0.0${a}${b} has 0 tenths. All the others have at least 1 tenth, so they are bigger.` };
    }
    const m = Math.min(b, 8), lo = `${a}.${m}`, hi = `${a}.${m + 1}`;
    return { text: `Which number is between ${lo} and ${hi}?`, short: `Between ${lo} and ${hi}`,
      ...M.textOpts(r, `${a}.${m}${c}`, [`${a}.${m + 1}${c}`, `${a}.0${m}${c}`, `${a + 1}.${m}${c}`]),
      why: `${lo} = ${lo}0 and ${hi} = ${hi}0. ${a}.${m}${c} is bigger than ${lo}0 and smaller than ${hi}0.` };
  }
  M.add({
    id: 'a11-decimals', skill: SKILL, variants: DEC_V,
    level: ([k, i]) => (k === 'value' ? (i % 3 === 2 ? 2 : 1) : k === 'between' ? 3 : 2),
    make: decimalQ
  });
})(window.MBT);
