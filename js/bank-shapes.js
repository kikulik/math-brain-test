/* Math Brain Test: shapes and time (clocks, sides, counting shapes, squares, fractions, calendar, measuring). */
(function (M) {
  const D = M.draw;
  const prev = h => (h === 1 ? 12 : h - 1), nxt = h => (h === 12 ? 1 : h + 1);

  const CLOCK = {
    oclock: {
      m: 0, hand: h => h, level: 1, label: h => `${h} o’clock`,
      wrong: h => [`${prev(h)} o’clock`, `${nxt(h)} o’clock`, h === 12 ? '6 o’clock' : '12 o’clock', `half past ${h}`],
      why: h => `The long hand points to 12 and the short hand points to ${h}, so it is ${h} o’clock.`
    },
    half: {
      m: 30, hand: h => h, level: 2, label: h => `half past ${h}`,
      wrong: h => [`half past ${prev(h)}`, `half past ${nxt(h)}`, `${h} o’clock`, `${nxt(h)} o’clock`],
      why: h => `The long hand points to 6, which means half past. The short hand has just gone past ${h}, so it is half past ${h}.`
    },
    qpast: {
      m: 15, hand: h => h, level: 3, label: h => `quarter past ${h}`,
      wrong: h => [`quarter to ${h}`, `quarter past ${prev(h)}`, `half past ${h}`, `quarter past ${nxt(h)}`],
      why: h => `The long hand points to 3, which means quarter past. The short hand has just gone past ${h}.`
    },
    qto: {
      m: 45, hand: h => prev(h), level: 3, label: h => `quarter to ${h}`,
      wrong: h => [`quarter past ${h}`, `quarter to ${nxt(h)}`, `quarter past ${prev(h)}`, `${prev(h)} o’clock`],
      why: h => `The long hand points to 9, which means quarter to. The short hand is nearly at ${h}, so it is quarter to ${h}.`
    }
  };
  M.add({
    id: 'clock', skill: 'shapes', variants: M.combos(Object.keys(CLOCK), M.range(1, 12)), level: ([k]) => CLOCK[k].level,
    make: ([k, h], r) => {
      const c = CLOCK[k];
      return {
        text: 'What time does the clock show?', short: 'Read the clock', long: true,
        vis: D.clock(c.hand(h), c.m), ...M.textOpts(r, c.label(h), c.wrong(h)), why: c.why(h)
      };
    }
  });

  const SIDES = { triangle: 3, square: 4, rectangle: 4, pentagon: 5, hexagon: 6, octagon: 8 };
  M.add({
    id: 'sides', skill: 'shapes', variants: M.combos(Object.keys(SIDES), ['sides', 'corners']),
    level: ([s]) => (SIDES[s] <= 4 ? 1 : SIDES[s] <= 6 ? 2 : 3),
    make: ([s, what], r) => {
      const n = SIDES[s];
      return {
        text: `How many ${what} does this shape have?`, short: `${M.cap(what)} on a ${s}`, vis: D.polygon(s),
        ...M.numOpts(r, n, [n + 1, n - 1, n + 2, n - 2]),
        why: `Count each ${what === 'sides' ? 'straight edge' : 'point where two sides meet'}. A ${s} has ${n} sides and ${n} corners.`
      };
    }
  });

  const KINDS = ['circle', 'triangle', 'square', 'star'];
  M.add({
    id: 'count-kind', skill: 'shapes', variants: M.combos(KINDS, M.range(2, 7)), level: ([, k]) => (k <= 4 ? 1 : 2),
    make: ([kind, k], r) => {
      const others = KINDS.filter(x => x !== kind), extra = M.int(r, 4, 7);
      const all = [...Array(k).fill(kind), ...Array.from({ length: extra }, () => M.pick(r, others))];
      return {
        text: `How many ${kind}s are in the picture?`, short: `Count the ${kind}s`,
        vis: D.scatter(M.shuffle(r, all), r, 'A picture of mixed shapes'),
        ...M.numOpts(r, k, [k + 1, k - 1, k + 2, all.length, extra]),
        why: `Look only for the ${kind}s and skip the other shapes. There are ${k}.`
      };
    }
  });

  const GRIDS = [
    [2, 2, 5, 'There are 4 small squares, plus 1 big square around all of them. That makes 5.'],
    [3, 2, 8, 'There are 6 small squares. There are also 2 bigger squares, each made of 4 small ones. 6 + 2 = 8.'],
    [3, 3, 14, 'There are 9 small squares, 4 middle-sized squares made of 4 small ones, and 1 big square. 9 + 4 + 1 = 14.'],
    [3, 1, 3, 'There are 3 small squares. The long shape around them is a rectangle, not a square.']
  ];
  M.add({
    id: 'squares', skill: 'shapes', variants: M.range(0, 3), level: () => 3,
    make: (i, r) => {
      const [cols, rows, ans, why] = GRIDS[i];
      return {
        text: 'How many squares can you find? Count the big ones and the small ones.', short: 'Squares in the picture',
        vis: D.squares(cols, rows), ...M.numOpts(r, ans, [cols * rows, ans + 1, ans - 1, ans + 2, 4]), why
      };
    }
  });

  const FRACTIONS = [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4]];
  const FRACTION_SAY = { '1/2': 'one half', '1/3': 'one third', '1/4': 'one quarter', '2/3': 'two thirds', '3/4': 'three quarters' };
  M.add({
    id: 'fraction', skill: 'shapes', variants: M.combos(['bar', 'circle'], M.range(0, 4)), level: () => 3,
    make: ([kind, i], r) => {
      const [k, n] = FRACTIONS[i], key = `${k}/${n}`;
      const wrong = M.shuffle(r, Object.keys(FRACTION_SAY).filter(f => f !== key)).slice(0, 3);
      return {
        text: 'What fraction of the shape is coloured in?', short: `Fraction of a ${kind}`, vis: D.fraction(kind, n, k),
        opts: [key, ...wrong].map(f => ({ h: D.frac(f), t: f, say: FRACTION_SAY[f] })), a: 0,
        why: `The shape has ${n} equal parts and ${k} ${k === 1 ? 'is' : 'are'} coloured, so ${key} (${FRACTION_SAY[key]}) is coloured in.`
      };
    }
  });

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  M.add({
    id: 'calendar', skill: 'shapes',
    variants: [...M.combos(['day'], M.range(0, 6), ['after', 'before']), ...M.combos(['month'], M.range(0, 11), ['after', 'before'])],
    level: ([kind]) => (kind === 'day' ? 1 : 2),
    make: ([kind, i, dir], r) => {
      const L = kind === 'day' ? DAYS : MONTHS, at = j => L[(j + L.length) % L.length], step = dir === 'after' ? 1 : -1;
      const ans = at(i + step);
      return {
        text: `Which ${kind} comes just ${dir} ${L[i]}?`, short: `The ${kind} ${dir} ${L[i]}`, long: true,
        ...M.textOpts(r, ans, [at(i - step), at(i + 2 * step), at(i + 3)]),
        why: `The ${kind}s go in order: ${at(i - 1)}, ${L[i]}, ${at(i + 1)}. So the ${kind} ${dir} ${L[i]} is ${ans}.`
      };
    }
  });

  M.add({
    id: 'measure', skill: 'shapes', variants: M.range(3, 10), level: () => 1,
    make: (len, r) => ({
      text: 'How many cubes long is the pencil?', short: 'Measure the pencil',
      vis: D.measure(len, Math.min(12, len + M.int(r, 1, 2))), ...M.numOpts(r, len, [len + 1, len - 1, len + 2]),
      why: `The pencil starts at the first cube and its tip ends at cube number ${len}. So it is ${len} cubes long.`
    })
  });
})(window.MBT);
