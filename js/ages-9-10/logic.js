/* Math Brain Test, ages 9 to 10: word problems & logic (money, two-step stories, bar charts, ages, odd one out, shape sums, grids). */
(function (M) {
  const P = M.draw9, H = M.h9, SKILL = 'logic9';
  const $ = H.money, money = (r, ans, cands) => M.valOpts(r, ans, cands.filter(c => c > 0 && Number.isInteger(c)), $, 10);

  const ITEMS = ['pens', 'notebooks', 'juice boxes', 'erasers', 'comics', 'ice creams'];
  M.add({
    id: 'a9-change', skill: SKILL, variants: M.combos(['one', 'many'], M.range(0, 29)),
    level: ([mode, s]) => (mode === 'one' ? (s < 15 ? 1 : 2) : s % 3 === 0 ? 2 : 3),
    make: ([mode, s], r) => {
      const [name] = M.names(r), item = M.pick(r, ITEMS);
      if (mode === 'one') {
        const note = s < 15 ? 5 : 10, price = 5 * M.int(r, note * 5, note * 19), ans = note * 100 - price;
        return {
          text: `${name} buys a book for ${$(price)} and pays with a €${note} note. How much change does ${name} get?`, short: `Change from €${note}`, long: true,
          ...money(r, ans, [ans + 10, ans - 10, ans + 100, ans - 100, price]),
          why: `Count on from ${$(price)} up to €${note}, or work out €${note} − ${$(price)} = ${$(ans)}.`
        };
      }
      const q = s % 3 === 0 ? 2 : M.int(r, 3, 4), each = M.pick(r, [45, 65, 75, 85, 99, 125, 135, 150, 165, 199, 225]), total = q * each;
      const note = [5, 10, 20].find(n => n * 100 > total), ans = note * 100 - total;
      return {
        text: `${M.cap(item)} cost ${$(each)} each. ${name} buys ${q} and pays with a €${note} note. How much change does ${name} get?`,
        short: `${q} ${item}, change from €${note}`, long: true,
        ...money(r, ans, [note * 100 - each, total, ans + 10, ans - 10, ans + 100]),
        why: `${q} × ${$(each)} = ${$(total)}. Then €${note} − ${$(total)} = ${$(ans)}.`
      };
    }
  });

  const STORY = [
    { lv: 3, make: r => {
      const c = M.int(r, 3, 6), p = M.int(r, 24, 32), a = M.int(r, 5, 19), ans = c * p - a;
      return { text: `A school has ${c} classes with ${p} children in each. ${a} children are away today. How many children are at school?`, ans,
        cands: [c * p, c * p + a, ans + 10, ans - 10, c + p - a], why: `${c} × ${p} = ${c * p} children. ${c * p} − ${a} = ${ans} are at school.` };
    } },
    { lv: 2, make: (r, [n]) => {
      const k = M.int(r, 3, 6), q = M.int(r, 4, 9), e = M.int(r, 2, 6), t = k * q, ans = q + e;
      return { text: `${n} shares ${t} sweets equally between ${k} friends. Then each friend is given ${e} more. How many sweets does each friend have now?`, ans,
        cands: [q, t + e, q * e, ans + 1, ans - 1], why: `${t} ÷ ${k} = ${q} each. Then ${q} + ${e} = ${ans}.` };
    } },
    { lv: 2, make: r => {
      const a = M.int(r, 3, 8), b = M.int(r, 2, 7), k = M.int(r, 3, 6), ans = (a + b) * k;
      return { text: `A pack has ${a} red pencils and ${b} blue pencils. How many pencils are in ${k} packs?`, ans,
        cands: [a + b * k, a * k + b, a + b + k, ans + k, ans - k], why: `One pack has ${a} + ${b} = ${a + b} pencils. ${a + b} × ${k} = ${ans}.` };
    } },
    { lv: 2, make: (r, [n]) => {
      const m = M.int(r, 12, 40), k = M.int(r, 2, 5), p = M.int(r, 6, 12), ans = m + k * p;
      return { text: `${n} has ${m} marbles and buys ${k} bags with ${p} marbles in each. How many marbles does ${n} have now?`, ans,
        cands: [m + k + p, (m + k) * p, ans + p, ans - p, k * p], why: `${k} × ${p} = ${k * p} new marbles. ${m} + ${k * p} = ${ans}.` };
    } },
    { lv: 3, make: (r, [n]) => {
      const k = M.int(r, 6, 15), d = M.int(r, 3, 7), P0 = k * d + M.int(r, 20, 90), ans = P0 - k * d;
      return { text: `A book has ${P0} pages. ${n} reads ${k} pages every day for ${d} days. How many pages are left to read?`, ans,
        cands: [P0 - k - d, k * d, ans + k, ans - k, P0 - k], why: `${k} × ${d} = ${k * d} pages read. ${P0} − ${k * d} = ${ans} pages left.` };
    } }
  ];
  M.add({
    id: 'a9-two-step', skill: SKILL, variants: M.combos(M.range(0, STORY.length - 1), M.range(0, 11)),
    level: ([i]) => STORY[i].lv,
    make: ([i], r) => {
      const s = STORY[i].make(r, M.names(r));
      return { text: s.text, short: 'Two-step story', ...M.numOpts(r, s.ans, s.cands), why: s.why };
    }
  });

  const vote = thing => ({
    what: `votes for a favourite ${thing}`, steps: [1, 2, 5], most: `Which ${thing} got the most votes?`, total: 'How many votes were there altogether?',
    read: n => `How many votes did ${n} get?`, diff: (a, b) => `How many more votes did ${a} get than ${b}?`
  });
  const CHARTS = [
    { ...vote('fruit'), names: ['Apple', 'Pear', 'Plum', 'Kiwi', 'Grape'] },
    { ...vote('sport'), names: ['Swim', 'Run', 'Bike', 'Ball', 'Dance'] },
    { what: 'the pets that children in a class have', steps: [1, 2], names: ['Cat', 'Dog', 'Fish', 'Bird', 'Hen'],
      most: 'Which pet do the most children have?', total: 'How many pets are there altogether?',
      read: n => `How many children have a ${n.toLowerCase()}?`, diff: (a, b) => `How many more children have a ${a.toLowerCase()} than a ${b.toLowerCase()}?` },
    { what: 'books borrowed from a library each day', steps: [2, 5, 10], names: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      most: 'On which day were the most books borrowed?', total: 'How many books were borrowed altogether?',
      read: n => `How many books were borrowed on ${n}?`, diff: (a, b) => `How many more books were borrowed on ${a} than on ${b}?` }
  ];
  const CHART_Q = {
    most: (c, v, names) => { const i = v.indexOf(Math.max(...v)); return { text: c.most, name: names[i], why: `${names[i]} has the tallest bar: ${v[i]}.` }; },
    read: (c, v, names, r) => { const i = M.int(r, 0, v.length - 1); return { text: c.read(names[i]), ans: v[i], i, why: `The top of the ${names[i]} bar lines up with ${v[i]}.` }; },
    diff: (c, v, names, r) => {
      const [i, j] = M.shuffle(r, M.range(0, v.length - 1)), [hi, lo] = v[i] > v[j] ? [i, j] : [j, i];
      return { text: c.diff(names[hi], names[lo]), ans: v[hi] - v[lo], i: hi, j: lo, why: `${v[hi]} − ${v[lo]} = ${v[hi] - v[lo]}.` };
    },
    total: (c, v) => ({ text: c.total, ans: v.reduce((a, b) => a + b, 0), why: `Add every bar: ${v.join(' + ')} = ${v.reduce((a, b) => a + b, 0)}.` })
  };
  M.add({
    id: 'a9-bar-chart', skill: SKILL, variants: M.combos(Object.keys(CHART_Q), M.range(0, 14)),
    level: ([k, s]) => ({ most: 1, read: s < 8 ? 1 : 2, diff: 2, total: 3 })[k],
    make: ([k, s], r) => {
      const c = CHARTS[s % CHARTS.length], step = c.steps[Math.floor(s / CHARTS.length) % c.steps.length], n = k === 'total' ? 4 : 5;
      const v = M.shuffle(r, M.range(1, 8)).slice(0, n).map(x => x * step), names = c.names.slice(0, n), q = CHART_Q[k](c, v, names, r);
      const base = { text: `The bar chart shows ${c.what}. ${q.text}`, short: `Bar chart: ${c.what}`, vis: P.bars(names, v, step), why: q.why };
      if (k === 'most') return { ...base, ...M.textOpts(r, q.name, names) };
      const near = k === 'total' ? [q.ans + step, q.ans - step, q.ans - v[0], q.ans + v[1]]
        : k === 'diff' ? [v[q.i] + v[q.j], q.ans + step, q.ans - step, v[q.i]] : [q.ans + step, q.ans - step, q.ans + 1, q.ans - 1];
      return { ...base, ...M.numOpts(r, q.ans, near) };
    }
  });

  const AGE = [
    { lv: 2, make: (r, [a, b]) => {
      const y = M.int(r, 6, 11), d = M.int(r, 2, 6), k = M.int(r, 2, 9), ans = y + d + k;
      return { text: `${a} is ${d} years older than ${b}. ${b} is ${y}. How old will ${a} be in ${k} years?`, ans,
        cands: [y + d, y + k, y + d - k, ans + 1, ans - 1], why: `${a} is ${y} + ${d} = ${y + d} now. In ${k} years: ${y + d} + ${k} = ${ans}.` };
    } },
    { lv: 3, make: (r, [a, b]) => {
      const y = M.int(r, 5, 12), k = M.int(r, 2, y - 1), ans = 2 * y - k;
      return { text: `${a} is twice as old as ${b}. ${b} is ${y}. How old was ${a} ${k} years ago?`, ans,
        cands: [2 * y, y - k, 2 * (y - k), ans + 1, ans - 1], why: `${a} is 2 × ${y} = ${2 * y} now. ${k} years ago: ${2 * y} − ${k} = ${ans}.` };
    } },
    { lv: 3, make: (r, [a, b]) => {
      const x = M.int(r, 5, 12), d = M.int(r, 2, 6), s = 2 * x + d;
      return { text: `${a} is ${d} years younger than ${b}. Together their ages add up to ${s}. How old is ${a}?`, ans: x,
        cands: [x + d, s - d, Math.floor(s / 2), x + 1, x - 1], why: `Take away the gap: ${s} − ${d} = ${2 * x}. Share it in two: ${2 * x} ÷ 2 = ${x}. Check: ${x} + ${x + d} = ${s}.` };
    } },
    { lv: 2, make: (r, [a]) => {
      const now = M.int(r, 8, 13), k = M.int(r, 2, 6), j = M.int(r, 2, 6), ans = now - j;
      return { text: `In ${k} years ${a} will be ${now + k}. How old was ${a} ${j} years ago?`, ans,
        cands: [now, now + k - j, now + k + j, ans + 1, ans - 1], why: `${a} is ${now + k} − ${k} = ${now} now. ${j} years ago: ${now} − ${j} = ${ans}.` };
    } }
  ];
  M.add({
    id: 'a9-ages', skill: SKILL, variants: M.combos(M.range(0, AGE.length - 1), M.range(0, 9)),
    level: ([i]) => AGE[i].lv,
    make: ([i], r) => {
      const s = AGE[i].make(r, M.names(r));
      return { text: s.text, short: 'Age puzzle', ...M.numOpts(r, s.ans, s.cands), why: s.why };
    }
  });

  /* Every rule is checked; only some are used as the answer (multiples of 6 and squares can't make a fair set). */
  const ODD = {
    even: [x => x % 2 === 0, 'even numbers', 1], m3: [x => x % 3 === 0, 'multiples of 3', 2], m4: [x => x % 4 === 0, 'multiples of 4', 2],
    m5: [x => x % 5 === 0, 'multiples of 5', 2], m6: [x => x % 6 === 0], m7: [x => x % 7 === 0, 'multiples of 7', 3],
    m9: [x => x % 9 === 0, 'multiples of 9', 3], square: [x => Number.isInteger(Math.sqrt(x))]
  };
  const ODD_RULES = ['even', 'm3', 'm4', 'm5', 'm7', 'm9'];
  /* Three numbers share the rule and one does not; no other rule may split the four 3 to 1, so the answer is unique. */
  function oddSet(key, r) {
    const [test] = ODD[key], yes = M.range(10, 99).filter(test), no = M.range(10, 99).filter(x => !test(x));
    for (let t = 0; t < 3000; t++) {
      const group = M.shuffle(r, yes).slice(0, 3), odd = M.pick(r, no), all = [...group, odd];
      if (!Object.entries(ODD).some(([k, [f]]) => k !== key && [1, 3].includes(all.filter(f).length))) return { group, odd };
    }
    throw new Error(`a9-odd-one-out: no clean set for ${key}`);
  }
  M.add({
    id: 'a9-odd-one-out', skill: SKILL, variants: M.combos(ODD_RULES, M.range(0, 9)),
    level: ([k]) => ODD[k][2],
    make: ([k], r) => {
      const { group, odd } = oddSet(k, r), desc = ODD[k][1];
      return {
        text: 'Which number is the odd one out?', short: `Odd one out: ${[...group, odd].join(', ')}`,
        ...M.textOpts(r, String(odd), group.map(String)),
        why: `${M.and(group)} are all ${desc}. ${odd} is not${k === 'even' ? ', it is odd' : ''}.`
      };
    }
  });

  const SHAPE_SUM = {
    t1: (a, b) => ({ lines: [['A', '+', 'A', '+', 'A', '=', 3 * a], ['A', '+', 'B', '=', a + b]], ask: 'B', ans: b, cands: [a + b, a, 3 * a - b, b + 1, b - 1],
      why: `A + A + A = ${3 * a}, so A = ${3 * a} ÷ 3 = ${a}. Then ${a} + B = ${a + b}, so B = ${b}.` }),
    t2: (a, b) => ({ lines: [['A', '+', 'A', '=', 2 * a], ['B', '+', 'B', '+', 'A', '=', 2 * b + a]], ask: 'B', ans: b, cands: [2 * b, a, 2 * b + a, b + 1, b - 1],
      why: `A + A = ${2 * a}, so A = ${a}. Then B + B = ${2 * b + a} − ${a} = ${2 * b}, so B = ${b}.` }),
    t3: (a, b) => ({ lines: [['A', '+', 'B', '=', a + b], ['A', '+', 'A', '+', 'B', '=', 2 * a + b]], ask: 'A', ans: a, cands: [a + b, b, 2 * a, a + 1, a - 1],
      why: `The second line has one more A than the first. ${2 * a + b} − ${a + b} = ${a}, so A = ${a}.` }),
    t4: (a, b) => ({ lines: [['A', '+', 'B', '=', a + b], ['A', '−', 'B', '=', a - b]], ask: 'A', ans: a, cands: [b, a - b, a + b, a + 1, a - 1],
      why: `Add the two lines and the Bs cancel out: A + A = ${a + b} + ${a - b} = ${2 * a}, so A = ${a}.` })
  };
  M.add({
    id: 'a9-shape-sums', skill: SKILL, variants: M.combos(Object.keys(SHAPE_SUM), M.range(0, 11)),
    level: ([t]) => (t === 't1' || t === 't2' ? 2 : 3),
    make: ([t], r) => {
      const a = M.int(r, 3, 12), b = M.pick(r, M.range(1, t === 't4' ? a - 1 : 12).filter(x => x !== a));
      const [sA, sB] = M.shuffle(r, ['triangle', 'circle', 'square', 'star']), map = { A: sA, B: sB };
      const q = SHAPE_SUM[t](a, b), lines = q.lines.map(l => l.map(x => map[x] || String(x)));
      const spoken = lines.map(l => l.map(x => ({ '+': 'plus', '−': 'minus', '=': 'equals' })[x] || x).join(' ')).join('. ');
      return {
        text: `Each shape stands for a number. What is the ${map[q.ask]} worth?`, say: `${spoken}. Each shape stands for a number. What is the ${map[q.ask]} worth?`,
        short: `Shape sums: the ${map[q.ask]}`, vis: P.symbols(lines), ...M.numOpts(r, q.ans, q.cands),
        why: M.cap(q.why.replace(/\bBs\b/g, `${sB}s`).replace(/\bA\b/g, sA).replace(/\bB\b/g, sB))
      };
    }
  });

  const GRID = {
    add: [(a, b) => a + b, 'add the first two numbers', (a, b) => `${a} + ${b}`],
    sub: [(a, b) => a - b, 'take the second number away from the first', (a, b) => `${a} − ${b}`],
    mul: [(a, b) => a * b, 'multiply the first two numbers', (a, b) => `${a} × ${b}`],
    dbl: [(a, b) => 2 * a + b, 'double the first number, then add the second', (a, b) => `2 × ${a} + ${b}`]
  };
  function gridRows(key, r) {
    const [f] = GRID[key];
    for (let t = 0; t < 500; t++) {
      const rows = M.range(0, 2).map(() => { const b = M.int(r, 2, 9), a = key === 'sub' ? b + M.int(r, 2, 9) : M.int(r, 2, 12); return [a, b, f(a, b)]; });
      const fits = ([g]) => rows.slice(0, 2).every(([a, b, c]) => g(a, b) === c);
      if (!Object.entries(GRID).some(([k, g]) => k !== key && fits(g))) return rows;
    }
    throw new Error(`a9-grid-rule: no clean grid for ${key}`);
  }
  M.add({
    id: 'a9-grid-rule', skill: SKILL, variants: M.combos(Object.keys(GRID), M.range(0, 9)),
    level: ([k]) => (k === 'add' || k === 'sub' ? 2 : 3),
    make: ([k], r) => {
      const rows = gridRows(k, r), [a, b, ans] = rows[2], [, desc, expr] = GRID[k];
      const others = Object.values(GRID).map(([g]) => g(a, b)).filter(x => x >= 0);
      return {
        text: 'Each row follows the same rule. Which number is missing?', short: 'Number grid rule',
        vis: P.grid3([rows[0], rows[1], [a, b, '?']]), ...M.numOpts(r, ans, [...others, ans + 1, ans - 1]),
        why: `In every row, ${desc}. So ${expr(a, b)} = ${ans}.`
      };
    }
  });

  const THINGS = ['pens', 'apples', 'stickers', 'cupcakes', 'pencils', 'tickets'];
  M.add({
    id: 'a9-unit-price', skill: SKILL, variants: M.combos(M.range(2, 5), M.range(0, 9)),
    level: ([q1]) => (q1 <= 3 ? 2 : 3),
    make: ([q1], r) => {
      const u = M.pick(r, [15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 80, 90, 120, 125, 150]), q2 = q1 + M.int(r, 1, 5), item = M.pick(r, THINGS);
      const cost = q1 * u, ans = q2 * u;
      return {
        text: `${q1} ${item} cost ${$(cost)}. How much do ${q2} ${item} cost?`, short: `${q2} ${item} at ${$(u)} each`,
        ...money(r, ans, [cost * q2, cost + (q2 - q1) * 100, ans + u, ans - u, cost + u]),
        why: `First find the cost of 1: ${$(cost)} ÷ ${q1} = ${$(u)}. Then ${q2} × ${$(u)} = ${$(ans)}.`
      };
    }
  });
})(window.MBT);
