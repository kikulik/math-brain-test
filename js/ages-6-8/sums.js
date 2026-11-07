/* Math Brain Test: adding and taking away (within 20, tens, missing numbers, two-digit sums). */
(function (M) {
  const D = M.draw;
  const box = D.box;

  function eqQ(expr, spoken, ans, r, cands, why) {
    return { text: `What is ${expr}?`, short: expr, say: `What is ${spoken}?`, vis: D.eq(`${expr} = ${box}`), ...M.numOpts(r, ans, cands), why };
  }
  function boxQ(expr, spoken, ans, r, cands, why, text) {
    return {
      text: text || 'Which number is hiding in the box?', short: expr.replace(box, '?'),
      say: `${spoken}. ${text || 'Which number is hiding in the box?'}`, vis: D.eq(expr, spoken), ...M.numOpts(r, ans, cands), why
    };
  }

  function addWhy(a, b) {
    const big = Math.max(a, b), small = Math.min(a, b), sum = a + b;
    if (sum <= 10 || big === 10) return `Start at ${big} and count on ${small}. You land on ${sum}.`;
    return `${big} + ${10 - big} makes 10. Then ${small - (10 - big)} more makes ${sum}.`;
  }
  M.add({
    id: 'add', skill: 'sums', variants: M.combos(M.range(1, 10), M.range(1, 10)), level: ([a, b]) => (a + b <= 10 ? 1 : 2),
    make: ([a, b], r) => eqQ(`${a} + ${b}`, `${a} plus ${b}`, a + b, r,
      [a + b + 1, a + b - 1, a + b + 2, a + b - 2, Math.abs(a - b), a + b + 10], addWhy(a, b))
  });

  function subWhy(a, b) {
    const d = a - b;
    if (a > 10 && d < 10) return `${a} take away ${a - 10} is 10. Take away ${b - (a - 10)} more and you get ${d}.`;
    return `Start at ${a} and count back ${b}. You land on ${d}.`;
  }
  M.add({
    id: 'subtract', skill: 'sums', variants: M.combos(M.range(6, 20), M.range(2, 9)).filter(([a, b]) => a > b),
    level: ([a]) => (a <= 10 ? 1 : 2),
    make: ([a, b], r) => eqQ(`${a} − ${b}`, `${a} take away ${b}`, a - b, r,
      [a - b + 1, a - b - 1, a - b + 2, a + b, a - b + 10], subWhy(a, b))
  });

  const tens = [
    ...M.combos(M.range(1, 9), M.range(1, 9)).filter(([a, b]) => a + b <= 10).map(([a, b]) => ['+', a * 10, b * 10]),
    ...M.combos(M.range(2, 9), M.range(1, 8)).filter(([a, b]) => b < a).map(([a, b]) => ['−', a * 10, b * 10])
  ];
  M.add({
    id: 'tens', skill: 'sums', variants: tens, level: () => 2,
    make: ([op, a, b], r) => {
      const plus = op === '+', ans = plus ? a + b : a - b;
      const why = `${M.tensWord(a / 10)} ${plus ? 'and' : 'take away'} ${M.tensWord(b / 10)} ${plus ? 'make' : 'leaves'} ${M.tensWord(ans / 10)}, which is ${ans}.`;
      return eqQ(`${a} ${op} ${b}`, `${a} ${plus ? 'plus' : 'take away'} ${b}`, ans, r,
        [ans + 10, ans - 10, ans / 10, ans + 1, plus ? a - b : a + b], why);
    }
  });

  M.add({
    id: 'missing-add', skill: 'sums', variants: M.combos(M.range(2, 9), M.range(4, 18)).filter(([b, c]) => c - b >= 2),
    level: ([, c]) => (c <= 10 ? 2 : 3),
    make: ([b, c], r) => {
      const ans = c - b;
      return boxQ(`${box} + ${b} = ${c}`, `Something plus ${b} makes ${c}`, ans, r,
        [c + b, ans + 1, ans - 1, ans + 2, b, c], `${ans} + ${b} = ${c}, so the hiding number is ${ans}.`);
    }
  });

  M.add({
    id: 'missing-sub', skill: 'sums', variants: M.combos(M.range(6, 15), M.range(1, 13)).filter(([a, c]) => a - c >= 2),
    level: () => 3,
    make: ([a, c], r) => {
      const ans = a - c;
      return boxQ(`${a} − ${box} = ${c}`, `${a} take away something leaves ${c}`, ans, r,
        [a + c, ans + 1, ans - 1, c, ans + 2], `${a} − ${ans} = ${c}. Check it: ${c} + ${ans} = ${a}.`);
    }
  });

  M.add({
    id: 'make-ten', skill: 'sums', variants: [...M.range(1, 9).map(a => [10, a]), ...M.range(11, 19).map(a => [20, a])],
    level: ([t]) => (t === 10 ? 1 : 2),
    make: ([t, a], r) => boxQ(`${a} + ${box} = ${t}`, `${a} plus something makes ${t}`, t - a, r,
      [t - a + 1, t - a - 1, t - a + 2, t + a, t - a + 10], `${a} and ${t - a} make ${t}.`, `What do you add to ${a} to make ${t}?`)
  });

  function threeWhy(a, b, c) {
    const pair = [[a, b, c], [a, c, b], [b, c, a]].find(([x, y]) => x + y === 10);
    if (pair) return `Find two numbers that make 10: ${pair[0]} + ${pair[1]} = 10. Then 10 + ${pair[2]} = ${a + b + c}.`;
    return `${a} + ${b} = ${a + b}. Then ${a + b} + ${c} = ${a + b + c}.`;
  }
  M.add({
    id: 'add-three', skill: 'sums',
    variants: M.combos(M.range(1, 7), M.range(1, 7), M.range(1, 7)).filter(([a, b, c]) => a <= b && b <= c),
    level: ([a, b, c]) => (a + b + c > 15 ? 3 : 2),
    make: (v, r) => {
      const [a, b, c] = M.shuffle(r, v), s = a + b + c;
      return eqQ(`${a} + ${b} + ${c}`, `${a} plus ${b} plus ${c}`, s, r, [s + 1, s - 1, s + 2, s - 2, a + b, s + 10], threeWhy(a, b, c));
    }
  });

  function twoDigitWhy(n, b) {
    const o = n % 10, s = n + b;
    if (o + b <= 9) return `Add the ones: ${o} + ${b} = ${o + b}. The tens stay the same, so the answer is ${s}.`;
    if (o + b === 10) return `The ones make ${o} + ${b} = 10, which is one more ten. So the answer is ${s}.`;
    return `${n} + ${10 - o} makes ${n + 10 - o}. Then ${b - (10 - o)} more makes ${s}.`;
  }
  M.add({
    id: 'add-2digit', skill: 'sums', variants: M.combos(M.range(21, 69).filter(n => n % 10), M.range(2, 9)),
    level: ([n, b]) => (n % 10 + b <= 9 ? 2 : 3),
    make: ([n, b], r) => eqQ(`${n} + ${b}`, `${n} plus ${b}`, n + b, r,
      [n + b + 10, n + b - 10, n + b + 1, n + b - 1, n + b * 10], twoDigitWhy(n, b))
  });
})(window.MBT);
