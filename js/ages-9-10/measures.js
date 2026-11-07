/* Math Brain Test, ages 9 to 10: shapes & measures (perimeter, area, angles, turns, 24-hour time, durations, units, 3D shapes, symmetry). */
(function (M) {
  const P = M.draw9, N = M.fmtNum, SKILL = 'measures9';
  const sq = u => `${u}²`, saySq = s => s.replace(/(c?m)²/, (_, u) => `square ${u === 'cm' ? 'centimetres' : 'metres'}`);

  const RECTS = [[3, 2], [4, 3], [5, 2], [5, 3], [6, 4], [7, 3], [8, 5], [9, 4], [10, 3], [12, 5], [6, 5], [8, 3], [7, 4], [9, 6], [10, 7], [11, 4], [12, 6], [5, 4], [9, 2], [10, 6]];
  const RECT = {
    perimeter: (w, h, u) => ({ ans: 2 * (w + h), fmt: v => `${v} ${u}`, cands: [w + h, w * h, 2 * w + h, 2 * (w + h) + 2, 2 * (w + h) - 2],
      text: 'What is the perimeter of this rectangle?', why: `Add all four sides: ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)} ${u}.` }),
    area: (w, h, u) => ({ ans: w * h, fmt: v => `${v} ${sq(u)}`, cands: [2 * (w + h), w + h, w * h + w, w * h - h, w * (h + 1)],
      text: 'What is the area of this rectangle?', why: `Area = length × width: ${w} × ${h} = ${w * h} ${sq(u)}.` }),
    missing: (w, h, u) => ({ ans: h, fmt: v => `${v} ${u}`, cands: [2 * (w + h) - w, w + h, 2 * h, h + 1, h - 1],
      text: `The perimeter of this rectangle is ${2 * (w + h)} ${u}. How long is the side marked “?”`,
      why: `The two ${w} ${u} sides make ${2 * w} ${u}. ${2 * (w + h)} − ${2 * w} = ${2 * h} ${u} for the other two sides, so one side is ${h} ${u}.` })
  };
  M.add({
    id: 'a9-rectangle', skill: SKILL, variants: M.combos(Object.keys(RECT), M.range(0, RECTS.length - 1)),
    level: ([k]) => ({ perimeter: 1, area: 2, missing: 3 })[k],
    make: ([k, i], r) => {
      const [w, h] = RECTS[i], u = i % 3 ? 'cm' : 'm', q = RECT[k](w, h, u), o = M.valOpts(r, q.ans, q.cands.filter(x => x > 0), q.fmt);
      return {
        text: q.text, short: `Rectangle ${w} by ${h}: ${k}`, vis: P.rect(w, h, `${w} ${u}`, k === 'missing' ? '?' : `${h} ${u}`),
        opts: o.opts.map(t => ({ t, say: saySq(t) })), a: 0, why: q.why
      };
    }
  });

  M.add({
    id: 'a9-grid-shape', skill: SKILL,
    variants: [...M.combos(['area'], M.range(3, 6), M.range(3, 5), [1, 2], [1, 2]),
      ...M.combos(['perimeter'], M.range(3, 6), M.range(3, 5), [1, 2]).map(([k, w, h, c]) => [k, w, h, c, c])],
    level: ([k, w, h]) => (k === 'perimeter' ? 3 : w * h <= 16 ? 1 : 2),
    make: ([k, w, h, cw, ch], r) => {
      const area = w * h - cw * ch, per = 2 * (w + h);
      if (k === 'area') {
        const o = M.valOpts(r, area, [w * h, area + 1, area - 1, area + 2, w * h - cw], v => `${v} cm²`);
        return {
          text: 'Each small square is 1 cm². What is the area of the blue shape?', say: 'Each small square is 1 square centimetre. What is the area of the blue shape?',
          short: 'Area of a shape on squares', vis: P.gridShape(w, h, cw, ch), opts: o.opts.map(t => ({ t, say: saySq(t) })), a: 0,
          why: `The full ${w} by ${h} rectangle would have ${w * h} squares. ${cw * ch} ${cw * ch === 1 ? 'is' : 'are'} cut out, so ${w * h} − ${cw * ch} = ${area} cm².`
        };
      }
      return {
        text: 'Each small square has 1 cm sides. What is the perimeter of the blue shape?', short: 'Perimeter of a shape on squares', vis: P.gridShape(w, h, cw, ch),
        ...M.valOpts(r, per, [area, per - 2, per + 2, per - cw - ch, per + 2 * (cw + ch)].filter(x => x > 0), v => `${v} cm`),
        why: `Walk around the edge. Cutting out the corner moves two sides inwards but keeps their length, so it is still ${w} + ${h} + ${w} + ${h} = ${per} cm.`
      };
    }
  });

  const KIND = d => (d < 90 ? 'acute' : d === 90 ? 'right angle' : d < 180 ? 'obtuse' : 'reflex');
  const KIND_WHY = {
    acute: 'It is smaller than a right angle (less than 90°), so it is acute.',
    'right angle': 'The square corner mark means exactly 90°: a right angle.',
    obtuse: 'It is bigger than a right angle but smaller than a straight line (between 90° and 180°), so it is obtuse.',
    reflex: 'It is bigger than a straight line (more than 180°), so it is reflex.'
  };
  const DEGS = [20, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 90, 100, 110, 115, 120, 130, 135, 140, 150, 160, 170, 200, 215, 230, 250, 270, 290, 310, 330];
  M.add({
    id: 'a9-angle-type', skill: SKILL, variants: DEGS,
    level: d => (d <= 90 ? 1 : d < 180 ? 2 : 3),
    make: (d, r) => ({
      text: 'What kind of angle is marked in red?', short: 'Kind of angle', vis: P.angle(d),
      ...M.textOpts(r, KIND(d), Object.keys(KIND_WHY)), why: KIND_WHY[KIND(d)]
    })
  });

  const DIRS = ['north', 'east', 'south', 'west'], TURN = { quarter: 1, half: 2, 'three-quarter': 3 };
  const TURN_NAME = ['full turn', 'quarter turn', 'half turn', 'three-quarter turn'];
  M.add({
    id: 'a9-compass', skill: SKILL,
    variants: [...M.combos(['where'], DIRS, Object.keys(TURN), ['clockwise', 'anticlockwise']), ...M.combos(['what'], DIRS, [1, 2, 3])],
    level: ([mode, , t, dir]) => (mode === 'what' ? (t === 3 ? 3 : 2) : t === 'three-quarter' ? 3 : dir === 'clockwise' ? 1 : 2),
    make: ([mode, start, t, dir], r) => {
      const i = DIRS.indexOf(start);
      if (mode === 'where') {
        const k = TURN[t], end = DIRS[(i + (dir === 'clockwise' ? k : 4 - k)) % 4];
        return {
          text: `You face ${start}. You make a ${t} turn ${dir}. Which way are you facing now?`, short: `${start}, ${t} turn ${dir}`, long: true,
          vis: P.compass(start), ...M.textOpts(r, end, DIRS),
          why: `A ${t} turn is ${k} quarter${k > 1 ? 's' : ''} of the way round. Going ${dir} from ${start} you end up facing ${end}.`
        };
      }
      const end = DIRS[(i + t) % 4];
      return {
        text: `You face ${start} and turn clockwise until you face ${end}. What turn did you make?`, short: `${start} to ${end}, clockwise`, long: true,
        vis: P.compass(start), ...M.textOpts(r, TURN_NAME[t], TURN_NAME),
        why: `Clockwise from ${start}, each quarter turn moves on one direction: ${DIRS.slice(i + 1).concat(DIRS).slice(0, t).join(', then ')}. That is a ${TURN_NAME[t]}.`
      };
    }
  });

  const pad = n => String(n).padStart(2, '0');
  const t24 = (h, m) => `${pad(h)}:${pad(m)}`;
  const t12 = (h, m) => `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h < 12 ? 'am' : 'pm'}`;
  function why24(h, m, mode) {
    if (h === 0) return `00:${pad(m)} is just after midnight. On a 12-hour clock that is 12:${pad(m)} am.`;
    if (h === 12) return `12:${pad(m)} is just after midday. On a 12-hour clock that is 12:${pad(m)} pm.`;
    if (h < 12) return `Morning times keep the same hour on both clocks: ${t24(h, m)} is ${t12(h, m)}.`;
    return mode === 'to12' ? `After midday, take 12 away from the hours: ${h} − 12 = ${h - 12}. So ${t24(h, m)} is ${t12(h, m)}.`
      : `After midday, add 12 to the hours: ${h - 12} + 12 = ${h}. So ${t12(h, m)} is ${t24(h, m)}.`;
  }
  const HOURS = [0, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  M.add({
    id: 'a9-24-hour', skill: SKILL, variants: M.combos(['to12', 'to24'], HOURS, [0, 1]),
    level: ([mode, h]) => (h === 0 || h === 12 ? 3 : mode === 'to12' ? 1 : 2),
    make: ([mode, h], r) => {
      const m = M.pick(r, [5, 10, 15, 20, 25, 35, 40, 45, 50, 55]), h12 = h % 12 === 0 ? 12 : h % 12, other = h < 12 ? 'pm' : 'am';
      if (mode === 'to12') {
        const wrong = [`${h12}:${pad(m)} ${other}`, t12((h + 1) % 24, m), t12((h + 23) % 24, m), h >= 13 ? `${h - 10}:${pad(m)} pm` : `${h}:${pad(m)} ${other}`];
        return { text: `What is ${t24(h, m)} in 12-hour time?`, short: `${t24(h, m)} in 12-hour time`, ...M.textOpts(r, t12(h, m), wrong), why: why24(h, m, mode) };
      }
      const wrong = [t24((h + 12) % 24, m), t24((h + 1) % 24, m), t24((h + 23) % 24, m), h >= 13 ? t24(h - 2, m) : t24(h + 10, m)];
      return { text: `What is ${t12(h, m)} on a 24-hour clock?`, short: `${t12(h, m)} on a 24-hour clock`, ...M.textOpts(r, t24(h, m), wrong), why: why24(h, m, mode) };
    }
  });

  const clock = mins => t12(Math.floor(mins / 60) % 24, mins % 60);
  const dur = mins => (mins < 60 ? `${mins} min` : `${Math.floor(mins / 60)} h${mins % 60 ? ` ${mins % 60} min` : ''}`);
  const sayDur = s => s.replace(/(\d+) h\b/, (_, n) => `${n} hour${n === '1' ? '' : 's'}`).replace(/min$/, 'minutes');
  const STARTS = [515, 590, 615, 700, 825, 860, 955, 1110], DURS = [25, 40, 55, 70, 85, 95, 110, 135];
  function durationWhy(s, d) {
    const toHour = 60 - (s % 60), e = s + d;
    if (d <= toHour) return `Count on ${d} minutes from ${clock(s)} to reach ${clock(e)}.`;
    return `From ${clock(s)} to ${clock(s + toHour)} is ${toHour} min. From there to ${clock(e)} is ${d - toHour} min more. ${toHour} + ${d - toHour} = ${d} min = ${dur(d)}.`;
  }
  /* The slip of taking times away like ordinary numbers: 4:10 − 2:45 gives "1 h 65 min". */
  function naiveGap(s, e, d) {
    const sm = s % 60, em = e % 60, hours = Math.floor(e / 60) - Math.floor(s / 60) - 1;
    if (em >= sm) return dur(d + 20);
    return hours > 0 ? `${hours} h ${100 + em - sm} min` : `${100 + em - sm} min`;
  }
  M.add({
    id: 'a9-duration', skill: SKILL, variants: M.combos(M.range(0, STARTS.length - 1), M.range(0, DURS.length - 1)),
    level: ([, j]) => (DURS[j] <= 40 ? 1 : DURS[j] <= 85 ? 2 : 3),
    make: ([i, j], r) => {
      const s = STARTS[i], d = DURS[j], e = s + d;
      if ((i + j) % 2) {
        return {
          text: `A train leaves at ${clock(s)}. The trip takes ${sayDur(dur(d))}. What time does it arrive?`, short: `${clock(s)} + ${dur(d)}`, long: true,
          ...M.textOpts(r, clock(e), [clock(e + 10), clock(e - 10), clock(e + 60), clock(e - 60)]), why: durationWhy(s, d)
        };
      }
      const o = M.textOpts(r, dur(d), [dur(d + 10), dur(d - 10), naiveGap(s, e, d), dur(d + 60)]);
      return {
        text: `A film starts at ${clock(s)} and ends at ${clock(e)}. How long is the film?`, short: `${clock(s)} to ${clock(e)}`, long: true,
        opts: o.opts.map(t => ({ t, say: sayDur(t) })), a: 0, why: durationWhy(s, d)
      };
    }
  });

  const WORD = { m: 'metres', cm: 'centimetres', mm: 'millimetres', km: 'kilometres', kg: 'kilograms', g: 'grams', l: 'litres', ml: 'millilitres', h: 'hours', min: 'minutes', s: 'seconds', weeks: 'weeks', days: 'days' };
  const ONE = { weeks: 'week', days: 'day' };
  const ALT = { 10: [100, 1], 100: [10, 1000], 1000: [100, 10], 60: [100, 10], 7: [10, 5] };
  const CONV = [
    ['m', 'cm', '×', 100, [2, 3, 6, 9, 1.5, 4.5]], ['cm', 'mm', '×', 10, [4, 7, 12, 25, 3.5, 8.5]], ['km', 'm', '×', 1000, [2, 5, 8, 1.5, 3.5, 0.5]],
    ['kg', 'g', '×', 1000, [3, 4, 7, 2.5, 1.5, 0.25]], ['l', 'ml', '×', 1000, [2, 6, 9, 1.5, 3.5, 0.5]], ['h', 'min', '×', 60, [2, 3, 5, 1.5, 2.5, 4]],
    ['min', 's', '×', 60, [2, 4, 5, 10, 1.5, 3.5]], ['weeks', 'days', '×', 7, [2, 3, 5, 8, 10, 12]], ['cm', 'm', '÷', 100, [300, 500, 700, 250, 450, 125]],
    ['g', 'kg', '÷', 1000, [2000, 6000, 3500, 1500, 500, 4250]], ['min', 'h', '÷', 60, [120, 180, 240, 90, 150, 30]]
  ];
  const convAns = (op, f, v) => (op === '×' ? v * f : v / f);
  M.add({
    id: 'a9-convert', skill: SKILL, variants: CONV.flatMap((c, i) => c[4].map(v => [i, v])),
    level: ([i, v]) => {
      const [, , op, f] = CONV[i], ans = convAns(op, f, v), dec = !Number.isInteger(v) || !Number.isInteger(ans);
      return Math.min(3, 1 + (dec ? 1 : 0) + (f === 60 || f === 7 ? 1 : 0) + (op === '÷' && !dec ? 1 : 0));
    },
    make: ([i, v], r) => {
      const [from, to, op, f] = CONV[i], ans = convAns(op, f, v), fmt = x => `${N(x)} ${to}`;
      const why = op === '×' ? `1 ${ONE[from] || from} = ${N(f)} ${to}, so ${N(v)} ${from} = ${N(v)} × ${N(f)} = ${fmt(ans)}.`
        : `${N(f)} ${from} = 1 ${ONE[to] || to}, so ${N(v)} ${from} = ${N(v)} ÷ ${N(f)} = ${fmt(ans)}.`;
      const step = Number.isInteger(ans) ? (op === '×' ? f : 1) : 0.5;
      const o = M.valOpts(r, ans, ALT[f].map(a => convAns(op, a, v)), fmt, step);
      return {
        text: `How many ${WORD[to]} are in ${N(v)} ${WORD[from]}?`, short: `${N(v)} ${from} in ${to}`,
        opts: o.opts.map(t => ({ t, say: `${t.split(' ')[0]} ${WORD[to]}` })), a: 0, why
      };
    }
  });

  const SOLID = { cube: [6, 12, 8], cuboid: [6, 12, 8], 'triangular prism': [5, 9, 6], 'pentagonal prism': [7, 15, 10],
    'square-based pyramid': [5, 8, 5], 'triangular-based pyramid': [4, 6, 4] };
  const PARTS = ['faces', 'edges', 'vertices'];
  M.add({
    id: 'a9-solid', skill: SKILL, variants: M.combos(Object.keys(SOLID), [0, 1, 2]),
    level: ([name, w]) => (name === 'cube' || name === 'cuboid' ? (w === 1 ? 2 : 1) : name === 'pentagonal prism' || w === 1 ? 3 : 2),
    make: ([name, w], r) => {
      const [f, e, v] = SOLID[name], ans = SOLID[name][w], what = w === 2 ? 'vertices (corners)' : PARTS[w];
      return {
        text: `This is a ${name}. How many ${what} does it have?`, short: `${M.cap(PARTS[w])} of a ${name}`, vis: P.solid(name),
        ...M.numOpts(r, ans, [f, e, v, ans + 1, ans - 1, ans + 2].filter(x => x !== ans)),
        why: `A ${name} has ${f} faces (flat surfaces), ${e} edges (where faces meet) and ${v} vertices (corners). Dashed lines are edges at the back.`
      };
    }
  });

  const SYM = {
    square: [4, 'A square folds 4 ways: across, up and down, and along both diagonals.', 1],
    rectangle: [2, 'A rectangle folds across and up and down. The diagonals do not work, so it has 2.', 2],
    'equilateral triangle': [3, 'All 3 sides are equal, so a line from each corner to the middle of the opposite side works: 3.', 2],
    'isosceles triangle': [1, 'Only the line straight down the middle works, so it has 1.', 1],
    'regular pentagon': [5, 'A regular shape with 5 equal sides has 5 lines of symmetry.', 2],
    'regular hexagon': [6, 'A regular shape with 6 equal sides has 6 lines of symmetry.', 2],
    'regular octagon': [8, 'A regular shape with 8 equal sides has 8 lines of symmetry.', 2],
    kite: [1, 'Only the long line from top to bottom folds a kite into matching halves: 1.', 1],
    parallelogram: [0, 'No fold makes the two halves match, so a parallelogram has 0 lines of symmetry.', 3],
    rhombus: [2, 'A rhombus folds along both diagonals, but not across the middle: 2.', 3]
  };
  M.add({
    id: 'a9-symmetry', skill: SKILL, variants: Object.keys(SYM), level: name => SYM[name][2],
    make: (name, r) => {
      const [n, why] = SYM[name];
      return {
        text: `How many lines of symmetry does this ${name} have?`, short: `Symmetry of a ${name}`, vis: P.flat(name),
        ...M.numOpts(r, n, [n + 1, n - 1, n * 2, n + 2, 4, 2].filter(x => x !== n)), why
      };
    }
  });
})(window.MBT);
