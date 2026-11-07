/* Math Brain Test, ages 9 to 10: times & division (tables to 12 × 12, division, remainders, × 10, written methods, scaling). */
(function (M) {
  const D = M.draw, H = M.h9, N = M.fmtNum, SKILL = 'times9';
  const box = D.box;
  const EASY = [2, 3, 4, 5, 10];
  const tableLevel = (a, b) => (EASY.includes(a) && EASY.includes(b) ? 1 : Math.min(a, b) >= 7 && a !== 10 && b !== 10 ? 3 : 2);
  const eqQ = (expr, ans, r, cands, why) => ({
    text: `What is ${expr}?`, say: `What is ${M.sayText(expr)}?`, short: expr, vis: D.eq(`${expr} = ${box}`, M.sayText(expr)),
    ...M.valOpts(r, ans, cands.filter(c => c >= 0 && Number.isInteger(c))), why
  });
  const trick = (a, b) => {
    const p = a * b, big = Math.max(a, b), small = Math.min(a, b);
    if (big === 9) return `Times 9 is times 10, take one away: ${small * 10} − ${small} = ${p}.`;
    if (big === 11) return `Times 11 is times 10, add one more: ${small * 10} + ${small} = ${p}.`;
    if (big === 12) return `Times 12 is times 10 plus times 2: ${small * 10} + ${small * 2} = ${p}.`;
    return `${a} × ${b} = ${p}. Count in ${big}s ${small} times if you get stuck.`;
  };

  M.add({
    id: 'a9-times', skill: SKILL, variants: M.combos(M.range(2, 12), M.range(2, 12)).filter(([a, b]) => a <= b),
    level: ([a, b]) => tableLevel(a, b),
    make: ([a, b], r) => {
      const [x, y] = r() < 0.5 ? [a, b] : [b, a], p = a * b;
      return eqQ(`${x} × ${y}`, p, r, [a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b, a + b, p + 10], trick(a, b));
    }
  });

  M.add({
    id: 'a9-divide', skill: SKILL, variants: M.combos(M.range(2, 12), M.range(2, 12)),
    level: ([a, b]) => ([2, 5, 10].includes(a) ? 1 : tableLevel(a, b)),
    make: ([a, b], r) => {
      const p = a * b;
      return eqQ(`${p} ÷ ${a}`, b, r, [b + 1, b - 1, b + 2, a, p - a, b * 2], `${a} × ${b} = ${p}, so ${p} ÷ ${a} = ${b}.`);
    }
  });

  M.add({
    id: 'a9-missing-factor', skill: SKILL, variants: M.combos(M.range(3, 12), M.range(3, 12)).filter(([a, b]) => a <= b),
    level: ([, b]) => (b <= 9 ? 2 : 3),
    make: ([a, b], r) => {
      const [known, ans] = r() < 0.5 ? [a, b] : [b, a], p = a * b, first = r() < 0.5;
      const shown = first ? `${box} × ${known} = ${p}` : `${known} × ${box} = ${p}`, spoken = first ? `what times ${known} is ${p}` : `${known} times what is ${p}`;
      return {
        text: 'Which number is hiding in the box?', say: `${spoken}? Which number is hiding in the box?`, short: shown.replace(box, '?'),
        vis: D.eq(shown, spoken), ...M.numOpts(r, ans, [ans + 1, ans - 1, p - known, ans + 2, known]),
        why: `${p} ÷ ${known} = ${ans}, so ${ans} × ${known} = ${p}.`
      };
    }
  });

  M.add({
    id: 'a9-remainder', skill: SKILL, variants: M.combos(M.range(3, 9), M.range(3, 9)),
    level: ([d]) => (d <= 6 ? 2 : 3),
    make: ([d, q], r) => {
      const rem = M.int(r, 1, d - 1), n = d * q + rem, rs = (a, b) => `${a} r ${b}`;
      const o = M.textOpts(r, rs(q, rem), [rs(q + 1, rem), rs(q - 1, rem + d), rs(q, rem === 1 ? 2 : rem - 1), rs(q, d - rem)]);
      return {
        text: `What is ${n} ÷ ${d}?`, say: `What is ${n} divided by ${d}? r means remainder.`, short: `${n} ÷ ${d} (with remainder)`,
        vis: D.eq(`${n} ÷ ${d} = ${box}`, `${n} divided by ${d}`), a: 0,
        opts: o.opts.map(t => ({ t, say: t.replace(' r ', ' remainder ') })),
        why: `${d} × ${q} = ${d * q}, and ${n} − ${d * q} = ${rem} left over. So the answer is ${q} remainder ${rem}.`
      };
    }
  });

  const SHIFT = { '× 10': [10, 1], '× 100': [100, 1], '× 1000': [1000, 1], '÷ 10': [10, -1], '÷ 100': [100, -1] };
  M.add({
    id: 'a9-times-ten', skill: SKILL, variants: M.combos(Object.keys(SHIFT), M.range(0, 9)),
    level: ([op]) => ({ '× 10': 1, '× 100': 2, '÷ 10': 2, '× 1000': 3, '÷ 100': 3 })[op],
    make: ([op], r) => {
      const [f, dir] = SHIFT[op], q = M.int(r, 4, 99), x = dir > 0 ? M.int(r, 3, 99) : q * f, res = dir > 0 ? x * f : q;
      const expr = `${N(x)} ${op}`, places = String(f).length - 1;
      return eqQ(expr, res, r, [res * 10, res * 100, res * 1000, x, res / 10, res / 100],
        `${dir > 0 ? 'Multiplying' : 'Dividing'} by ${N(f)} moves the digits ${places} place${places > 1 ? 's' : ''} to the ${dir > 0 ? 'left' : 'right'}: ${expr} = ${N(res)}.`);
    }
  });

  /* The classic slip in written multiplication: forgetting to add the carried digit. */
  function forgotCarry(x, m) {
    const ds = String(x).split('').reverse().map(Number);
    return ds.reduce((s, d, i) => s + (i === ds.length - 1 ? d * m : (d * m) % 10) * 10 ** i, 0);
  }
  const TWO = [13, 14, 16, 17, 18, 19, 23, 24, 26, 27, 28, 34, 36, 47];
  const THREE = [112, 124, 135, 142, 153, 206, 215, 231, 246, 312];
  M.add({
    id: 'a9-multiply', skill: SKILL, variants: [...M.combos(TWO, M.range(3, 8)), ...M.combos(THREE, M.range(2, 5))],
    level: ([x]) => (x < 100 ? 2 : 3),
    make: ([x, m], r) => {
      const ans = x * m, ones = x % 10, tens = x % 100 - ones, hundreds = x - x % 100;
      const parts = [hundreds, tens, ones].filter(p => p > 0);
      const why = `Split ${x} into ${M.and(parts)}: ${parts.map(p => `${p} × ${m} = ${p * m}`).join(', ')}. Add them up: ${N(ans)}.`;
      return eqQ(`${x} × ${m}`, ans, r, [forgotCarry(x, m), (x - ones) * m + ones, ans + 10, ans - 10, ans + m], why);
    }
  });

  const DOUBLE = [36, 47, 58, 65, 74, 85, 99, 125, 136, 145, 250, 375], HALF = [56, 74, 98, 132, 150, 176, 214, 350, 490, 730, 918, 1000];
  M.add({
    id: 'a9-double-half', skill: SKILL, variants: [...DOUBLE.map(n => ['double', n]), ...HALF.map(n => ['half', n])],
    level: ([mode, n]) => (mode === 'double' ? (n < 100 ? 1 : 2) : n < 100 ? 2 : 3),
    make: ([mode, n], r) => {
      const dbl = mode === 'double', ans = dbl ? 2 * n : n / 2, big = n >= 100 ? n - (n % 100) : n - (n % 10), small = n - big;
      const f = x => (dbl ? 2 * x : x / 2), word = dbl ? 'Double' : 'Half of';
      const why = small === 0 ? `${word} ${N(big)} is ${N(ans)}.`
        : `${word} ${N(big)} is ${N(f(big))} and ${word.toLowerCase()} ${small} is ${f(small)}. ${N(f(big))} + ${f(small)} = ${N(ans)}.`;
      return {
        text: dbl ? `What is double ${N(n)}?` : `What is half of ${N(n)}?`, short: `${word} ${N(n)}`,
        ...M.valOpts(r, ans, [ans + 10, ans - 10, ans + 1, ans - 1, f(big) + small].filter(Number.isInteger)), why
      };
    }
  });

  M.add({
    id: 'a9-three-numbers', skill: SKILL, variants: M.combos(M.range(2, 5), M.range(3, 9), [2, 5]),
    level: ([a, b, c]) => (a * b * c <= 100 ? 2 : 3),
    make: ([a, b, c], r) => {
      const ans = a * b * c, ac = a * c;
      const why = ac % 10 === 0 ? `Do ${a} × ${c} = ${ac} first, then ${ac} × ${b} = ${ans}.` : `Do ${a} × ${b} = ${a * b} first, then ${a * b} × ${c} = ${ans}.`;
      return eqQ(`${a} × ${b} × ${c}`, ans, r, [a * b + c, a + b + c, ans + a, ans - b, a * b * (c + 1)], why);
    }
  });

  const SCALE = [
    { fmt: v => `${v} kg`, times: (a, k) => `A puppy weighs ${a} kg. A big dog weighs ${k} times as much. How much does the big dog weigh?`,
      back: (b, k) => `A big dog weighs ${b} kg. That is ${k} times as much as a puppy. How much does the puppy weigh?` },
    { fmt: v => `${v} cm`, times: (a, k) => `A short ribbon is ${a} cm long. A long ribbon is ${k} times as long. How long is the long ribbon?`,
      back: (b, k) => `A long ribbon is ${b} cm long. That is ${k} times as long as a short ribbon. How long is the short ribbon?` },
    { fmt: v => `${v} stickers`, times: (a, k, [x, y]) => `${x} has ${a} stickers. ${y} has ${k} times as many. How many stickers does ${y} have?`,
      back: (b, k, [x, y]) => `${y} has ${b} stickers. That is ${k} times as many as ${x}. How many stickers does ${x} have?` },
    { fmt: v => `€${v}`, times: (a, k) => `A pen costs €${a}. A bag costs ${k} times as much. How much does the bag cost?`,
      back: (b, k) => `A bag costs €${b}. That is ${k} times as much as a pen. How much does the pen cost?` }
  ];
  M.add({
    id: 'a9-scale', skill: SKILL, variants: M.combos(M.range(0, SCALE.length - 1), ['times', 'back'], M.range(0, 4)),
    level: ([, mode]) => (mode === 'times' ? 2 : 3),
    make: ([i, mode], r) => {
      const s = SCALE[i], a = M.int(r, 3, 9), k = M.int(r, 3, 8), big = a * k, names = M.names(r), long = i === 2;
      if (mode === 'times') {
        return {
          text: s.times(a, k, names), short: `${k} times ${s.fmt(a)}`, long,
          ...M.valOpts(r, big, [a + k, big + a, big - a, a * (k + 1)], s.fmt), why: `${k} times as much means ${a} × ${k} = ${big}.`
        };
      }
      return {
        text: s.back(big, k, names), short: `${s.fmt(big)} ÷ ${k}`, long,
        ...M.valOpts(r, a, [big - k, a + 1, a - 1, big + k, a + 2].filter(x => x > 0), s.fmt), why: `Share ${big} into ${k} equal parts: ${big} ÷ ${k} = ${a}.`
      };
    }
  });
})(window.MBT);
