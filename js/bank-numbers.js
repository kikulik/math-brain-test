/* Math Brain Test: number sense puzzles (counting, tens and ones, comparing, number words). */
(function (M) {
  const D = M.draw;
  const KINDS = ['star', 'circle', 'triangle', 'square'];
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const words = n => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));
  const tensOnes = n => `${M.tensWord(Math.floor(n / 10))} and ${M.onesWord(n % 10)}`;

  M.add({
    id: 'count', skill: 'numbers', variants: M.combos(M.range(3, 15), KINDS),
    level: ([n]) => (n <= 8 ? 1 : 2),
    make: ([n, kind], r) => ({
      text: `How many ${kind}s are there?`, short: `Count the ${kind}s`,
      vis: D.scatter(Array(n).fill(kind), r, `A group of ${kind}s`),
      ...M.numOpts(r, n, [n - 1, n + 1, n - 2, n + 2]),
      why: `Touch each ${kind} once as you count. There are ${n}.`
    })
  });

  M.add({
    id: 'blocks', skill: 'numbers', variants: M.combos(M.range(1, 9), M.range(0, 9)),
    level: () => 2,
    make: ([t, o], r) => {
      const n = t * 10 + o, sticks = `${t} ${t === 1 ? 'stick makes' : 'sticks make'} ${t * 10}`;
      return {
        text: 'Each orange stick is 10. Each small cube is 1. What number do the blocks show?', short: 'Tens and ones blocks',
        say: 'Each orange stick is worth 10. Each small cube is worth 1. What number do the blocks show?',
        vis: D.blocks(t, o), ...M.numOpts(r, n, [M.swapDigits(n), t + o, t * 100 + o, n + 10, n - 10, n + 1]),
        why: o ? `${sticks} and ${o} ${o === 1 ? 'cube makes' : 'cubes make'} ${o}. ${t * 10} + ${o} = ${n}.` : `${sticks}, and there are no cubes.`
      };
    }
  });

  M.add({
    id: 'compare', skill: 'numbers',
    variants: M.combos(M.range(1, 8), M.range(2, 9), ['biggest', 'smallest']).filter(([a, b]) => b > a),
    level: () => 1,
    make: ([a, b, which], r) => {
      const set = new Set([a * 10 + b, b * 10 + a]);
      while (set.size < 4) set.add(M.pick(r, [a, b, M.int(r, 1, 9)]) * 10 + M.int(r, 0, 9));
      const nums = [...set], ans = which === 'biggest' ? Math.max(...nums) : Math.min(...nums);
      return {
        text: `Which number is the ${which}?`, short: `The ${which} number`,
        opts: [ans, ...nums.filter(x => x !== ans)].map(String), a: 0,
        why: `${ans} is the ${which}. Compare the tens first. If the tens are the same, compare the ones.`
      };
    }
  });

  const STEP = { '1 more': 1, '1 less': -1, '10 more': 10, '10 less': -10 };
  M.add({
    id: 'more-less', skill: 'numbers', variants: M.combos(M.range(11, 89), Object.keys(STEP)),
    level: ([n, op]) => (Math.abs(STEP[op]) === 10 || (op === '1 more' && n % 10 === 9) || (op === '1 less' && n % 10 === 0) ? 2 : 1),
    make: ([n, op], r) => {
      const ans = n + STEP[op];
      return {
        text: `What number is ${op} than ${n}?`, short: `${op} than ${n}`,
        ...M.numOpts(r, ans, [n, n - STEP[op], ans + 1, ans - 1, ans + 10, ans - 10, M.swapDigits(ans)]),
        why: Math.abs(STEP[op]) === 10
          ? `${STEP[op] > 0 ? 'Adding' : 'Taking away'} 10 changes the tens by one and keeps the ones the same. ${n} becomes ${ans}.`
          : `Count ${STEP[op] > 0 ? 'on' : 'back'} one from ${n} and you get ${ans}.`
      };
    }
  });

  M.add({
    id: 'between', skill: 'numbers', variants: M.range(1, 98), level: () => 1,
    make: (n, r) => {
      const ans = n + 1;
      return {
        text: `Which number comes between ${n} and ${n + 2}?`, short: `Between ${n} and ${n + 2}`,
        ...M.numOpts(r, ans, [n + 3, n - 1, ans + 10, ans - 10, M.swapDigits(ans)]),
        why: `Count up: ${n}, ${ans}, ${n + 2}. The number in the middle is ${ans}.`
      };
    }
  });

  M.add({
    id: 'parity', skill: 'numbers', variants: M.combos(['even', 'odd'], M.range(0, 19)), level: () => 2,
    make: ([kind, i], r) => {
      const ans = kind === 'even' ? 2 + 2 * i : 1 + 2 * i, others = new Set();
      while (others.size < 3) { const x = M.int(r, 1, 40); if (x % 2 !== ans % 2) others.add(x); }
      const rule = kind === 'even' ? 'Even numbers end in 0, 2, 4, 6 or 8' : 'Odd numbers end in 1, 3, 5, 7 or 9';
      return {
        text: `Which number is ${kind}?`, short: `Find the ${kind} number`, opts: [ans, ...others].map(String), a: 0,
        why: `${rule}. ${ans} ends in ${ans % 10}.`
      };
    }
  });

  M.add({
    id: 'words', skill: 'numbers', variants: M.range(13, 99), level: () => 2,
    make: (n, r) => ({
      text: `Which number is “${words(n)}”?`, short: `“${words(n)}”`, say: `Which number is ${words(n)}?`,
      ...M.numOpts(r, n, [M.swapDigits(n), n + 10, n - 10, n + 1, n - 1].filter(x => x >= 10)),
      why: `“${M.cap(words(n))}” means ${tensOnes(n)}, which is ${n}.`
    })
  });

  M.add({
    id: 'place', skill: 'numbers', variants: M.combos(M.range(1, 9), M.range(1, 9), ['tens first', 'ones first']),
    level: ([, , order]) => (order === 'tens first' ? 2 : 3),
    make: ([t, o, order], r) => {
      const n = t * 10 + o;
      const parts = order === 'tens first' ? `${M.tensWord(t)} and ${M.onesWord(o)}` : `${M.onesWord(o)} and ${M.tensWord(t)}`;
      return {
        text: `Which number has ${parts}?`, short: M.cap(parts),
        ...M.numOpts(r, n, [o * 10 + t, t + o, n + 10, n - 10, n + 1]),
        why: `${M.tensWord(t)} ${t === 1 ? 'is' : 'are'} ${t * 10}. Add ${M.onesWord(o)} to get ${n}.`
      };
    }
  });

  M.add({
    id: 'number-line', skill: 'numbers',
    variants: [...M.range(1, 19).filter(v => v % 5).map(v => [20, v]), ...M.range(1, 9).filter(v => v !== 5).map(v => [100, v * 10])],
    level: ([max]) => (max === 20 ? 2 : 3),
    make: ([max, v], r) => ({
      text: 'What number is the arrow pointing to?', short: `Number line to ${max}`, vis: D.numberLine(max, v),
      ...M.numOpts(r, v, max === 20 ? [v + 1, v - 1, v + 2, v - 2] : [v + 10, v - 10, v / 10, v + 5]),
      why: max === 20
        ? `Each small mark is 1 more. Count on from the nearest number below the arrow and you reach ${v}.`
        : `Each mark is 10 more. Count by tens from 0 until you reach the arrow: it points to ${v}.`
    })
  });
})(window.MBT);
