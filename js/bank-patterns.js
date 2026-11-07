/* Math Brain Test: pattern puzzles (counting on and back, missing numbers, growing jumps, shape patterns). */
(function (M) {
  const D = M.draw;

  function seqQ(items, ans, why, r, cands, lead) {
    const listed = items.join(', ');
    const ask = lead ? `${lead} What number comes next?` : 'What number comes next?';
    return { text: ask, short: `${listed}, ?`, say: `${listed}. ${ask}`, vis: D.seq([...items, '?']), ...M.numOpts(r, ans, cands), why };
  }

  const forward = [
    ...M.range(0, 20).map(s => [s, 2]),
    ...M.range(0, 50, 5).map(s => [s, 5]), ...M.range(1, 4).map(s => [s, 5]),
    ...M.range(0, 50).map(s => [s, 10]),
    ...M.range(0, 12).map(s => [s, 3]),
    ...M.range(0, 8).map(s => [s, 4])
  ];
  M.add({
    id: 'count-on', skill: 'patterns', variants: forward,
    level: ([s, step]) => {
      if (step === 3 || step === 4) return 3;
      return (step === 2 && s % 2 === 0) || (step === 10 && s % 10 === 0) ? 1 : 2;
    },
    make: ([s, step], r) => {
      const items = [0, 1, 2, 3].map(i => s + i * step), ans = s + 4 * step;
      return seqQ(items, ans, `Each number is ${step} more than the one before. ${items[3]} + ${step} = ${ans}.`, r,
        [ans + 1, ans - 1, ans + step, ans + 2, ans - 2, ans + 10]);
    }
  });

  const backward = [...M.range(10, 30).map(s => [s, 2]), ...M.range(20, 60, 5).map(s => [s, 5]), ...M.range(40, 95).map(s => [s, 10])];
  M.add({
    id: 'count-back', skill: 'patterns', variants: backward, level: () => 2,
    make: ([s, step], r) => {
      const items = [0, 1, 2, 3].map(i => s - i * step), ans = s - 4 * step;
      return seqQ(items, ans, `Each number is ${step} less than the one before. ${items[3]} − ${step} = ${ans}.`, r,
        [ans + 1, ans - 1, ans - step, ans + 2, ans + 10]);
    }
  });

  const middle = [
    ...M.combos(M.range(0, 10), [1, 2, 3]).map(([s, p]) => [s, 2, p]),
    ...M.combos(M.range(0, 50, 5), [1, 2, 3]).map(([s, p]) => [s, 5, p]),
    ...M.combos(M.range(0, 50, 10), [1, 2, 3]).map(([s, p]) => [s, 10, p])
  ];
  M.add({
    id: 'missing-middle', skill: 'patterns', variants: middle, level: ([, step]) => (step === 10 ? 1 : 2),
    make: ([s, step, pos], r) => {
      const items = M.range(0, 4).map(i => s + i * step), ans = items[pos];
      const shown = items.map((x, i) => (i === pos ? '?' : x));
      return {
        text: 'Which number is missing?', short: shown.join(', '),
        say: `${shown.map(x => (x === '?' ? 'something' : x)).join(', ')}. Which number is missing?`,
        vis: D.seq(shown), ...M.numOpts(r, ans, [ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10].filter(x => !items.includes(x))),
        why: `The numbers go up by ${step} each time. ${items[pos - 1]} + ${step} = ${ans}.`
      };
    }
  });

  const growing = [...M.range(1, 12).map(s => ['jumps', s]), ['double', 1], ['double', 2], ['double', 3]];
  M.add({
    id: 'growing', skill: 'patterns', variants: growing, level: () => 3,
    make: ([kind, s], r) => {
      if (kind === 'double') {
        const items = [s, 2 * s, 4 * s, 8 * s], ans = 16 * s;
        return seqQ(items, ans, `Each number is double the one before. ${8 * s} + ${8 * s} = ${ans}.`, r,
          [10 * s, 12 * s, ans + 2, ans - 2, 9 * s], 'This one is tricky.');
      }
      const items = [0, 1, 3, 6, 10].map(d => s + d), ans = s + 15;
      return seqQ(items, ans, `The jumps get one bigger each time: +1, +2, +3, +4, and then +5. ${s + 10} + 5 = ${ans}.`, r,
        [s + 14, s + 13, s + 16, s + 20], 'This one is tricky.');
    }
  });

  const UNITS = { AB: [0, 1], ABC: [0, 1, 2], AAB: [0, 0, 1], ABB: [0, 1, 1] };
  const SHAPES = ['circle', 'triangle', 'square', 'star'];
  const orders = k => (k === 2
    ? M.combos(M.range(0, 3), M.range(0, 3)).filter(([a, b]) => a !== b)
    : M.combos(M.range(0, 3), M.range(0, 3), M.range(0, 3)).filter(([a, b, c]) => a !== b && b !== c && a !== c));
  M.add({
    id: 'shape-pattern', skill: 'patterns',
    variants: Object.keys(UNITS).flatMap(u => orders(u === 'ABC' ? 3 : 2).map(p => [u, p])),
    level: ([u]) => (u === 'AB' ? 1 : 2),
    make: ([u, p], r) => {
      const unit = UNITS[u].map(i => SHAPES[p[i]]), len = M.int(r, 5, 6);
      const shown = M.range(0, len - 1).map(i => unit[i % unit.length]), ans = unit[len % unit.length];
      return {
        text: 'Which shape comes next?', short: `${shown.join(', ')}, ?`, say: `${shown.join(', ')}. Which shape comes next?`,
        vis: D.seq([...shown.map(k => ({ shape: k })), '?']),
        opts: [ans, ...SHAPES.filter(k => k !== ans)].map(D.shapeOpt), a: 0,
        why: `The pattern repeats ${unit.join(', ')}, and then starts again. Next comes the ${ans}.`
      };
    }
  });
})(window.MBT);
