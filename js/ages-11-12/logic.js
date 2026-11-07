/* Math Brain Test, ages 11 to 12: problem solving (ratio, proportion, speed, averages, probability, best buys, puzzles). */
(function (M) {
  const H = M.h11, G = M.draw11, F = M.fmtNum, SKILL = 'logic11';
  const THINGS = ['stickers', 'marbles', 'sweets', 'cards', 'stamps', 'beads'];
  const withUnit = u => x => `${F(x)} ${u}`;
  const cents = c => Math.abs(c * 100 - Math.round(c * 100)) < 1e-6;

  /* ---------- ratio ---------- */
  const PAIRS = M.combos(M.range(1, 7), M.range(1, 7)).filter(([a, b]) => a !== b && M.gcd(a, b) === 1);
  const TRIPLES = [[1, 2, 3], [2, 3, 4], [1, 2, 5], [3, 4, 5], [1, 3, 4], [2, 3, 5]];
  const RATIO_V = [...H.thin(M.combos(PAIRS, [2, 3, 4, 5, 6, 8, 10, 12]), 11).map(([[a, b], u]) => ['share', a, b, 0, u]),
    ...M.combos(TRIPLES, [3, 4, 6, 10]).map(([[a, b, c], u]) => ['share3', a, b, c, u]),
    ...H.thin(M.combos(PAIRS, [2, 3, 4, 5, 6]), 7).map(([[a, b], u]) => ['scale', a, b, 0, u]),
    ...H.thin(M.combos(PAIRS, [2, 3, 4, 5, 6]), 7).map(([[a, b], u]) => ['total', a, b, 0, u])];
  function ratioQ([k, a, b, c, u], r) {
    const [n1, n2] = M.names(r), thing = M.pick(r, THINGS);
    if (k === 'share') {
      const T = (a + b) * u, first = r() < 0.5, ans = (first ? a : b) * u, who = first ? n1 : n2;
      return [`${n1} and ${n2} share ${T} ${thing} in the ratio ${a} : ${b}. How many does ${who} get?`, ans, [(first ? b : a) * u, T / 2, T - (first ? a : b), ans + u],
        `There are ${a} + ${b} = ${a + b} parts. ${T} ÷ ${a + b} = ${u} in each part, so ${who} gets ${first ? a : b} × ${u} = ${ans}.`];
    }
    if (k === 'share3') {
      const T = (a + b + c) * u;
      return [`${T} ${thing} are shared in the ratio ${a} : ${b} : ${c}. How many are in the biggest share?`, c * u, [T / 3, b * u, c * u + u, T - c],
        `There are ${a} + ${b} + ${c} = ${a + b + c} parts. ${T} ÷ ${a + b + c} = ${u} in each part. The biggest share is ${c} × ${u} = ${c * u}.`];
    }
    if (k === 'scale') {
      return [`In a club the ratio of boys to girls is ${a} : ${b}. There are ${a * u} boys. How many girls are there?`, b * u, [a * u + (b - a), a * u, b * u + u, b + a * u],
        `${a * u} boys is ${u} lots of ${a}, so there are ${u} lots of ${b} girls: ${u} × ${b} = ${b * u}.`];
    }
    return [`A necklace has red and blue beads in the ratio ${a} : ${b}. There are ${a * u} red beads. How many beads are there altogether?`, (a + b) * u,
      [b * u, a * u + b, (a + b) * u + u, a * u * b], `${a * u} red beads is ${u} lots of ${a}. So there are ${b * u} blue beads, and ${a * u} + ${b * u} = ${(a + b) * u} altogether.`];
  }
  M.add({
    id: 'a11-ratio', skill: SKILL, variants: RATIO_V, level: ([k, a, b]) => (k === 'share' && (a === 1 || b === 1) ? 1 : k === 'share' || k === 'scale' ? 2 : 3),
    make: (v, r) => { const [text, ans, cands, why] = ratioQ(v, r); return { text, short: text.split('. ')[0], ...M.numOpts(r, ans, cands), why }; }
  });

  /* ---------- proportion ---------- */
  const PEOPLE = [[4, 6], [4, 10], [6, 9], [2, 5], [8, 12], [4, 7], [6, 10], [3, 5]];
  const PROP_V = [...M.combos(PEOPLE, [25, 40, 50, 75]).map(([[p, q], g]) => ['recipe', p, q, g]),
    ...H.thin(M.combos([3, 4, 5, 6], [7, 8, 9, 10], [15, 20, 25, 30, 35, 40, 45, 60, 75, 80]), 5).map(([k, m, c]) => ['unit', k, m, c]),
    ...M.combos([3, 4, 5, 6], [2, 3]).map(([n, f]) => ['same', n, n * f, 0]),
    ...[[2, 6, 3], [3, 4, 2], [4, 6, 3], [6, 4, 3], [2, 9, 3], [5, 6, 3], [3, 8, 4], [4, 3, 6], [6, 5, 10], [8, 3, 6]].map(p => ['inverse', ...p])];
  function proportionQ([k, a, b, c], r) {
    if (k === 'recipe') {
      return [`A recipe for ${a} people uses ${a * c} g of flour. How much flour is needed for ${b} people?`, b * c, [a * c + (b - a), a * c * b, c, b * c + c], 'g',
        `${a * c} g for ${a} people is ${a * c} ÷ ${a} = ${c} g each. For ${b} people: ${b} × ${c} = ${b * c} g.`];
    }
    if (k === 'unit') {
      const item = M.pick(r, ['pencils', 'apples', 'stickers', 'rubbers', 'bread rolls']);
      return [`${a} ${item} cost ${M.euro((a * c) / 100)}. How much do ${b} ${item} cost?`, (b * c) / 100, [(a * c + b - a) / 100, (a * c) / 100, ((b + 1) * c) / 100, (b * a * c) / 100], '€',
        `One costs ${M.euro((a * c) / 100)} ÷ ${a} = ${M.euro(c / 100)}. So ${b} cost ${b} × ${M.euro(c / 100)} = ${M.euro((b * c) / 100)}.`];
    }
    if (k === 'same') {
      return [`${a} machines make ${a} toys in ${a} minutes. How many minutes do ${b} machines take to make ${b} toys?`, a, [b, a * b, b * b, a + b], 'minutes',
        `Each machine makes 1 toy in ${a} minutes. ${b} machines working together make ${b} toys in the same ${a} minutes.`];
    }
    return [`${a} painters take ${b} hours to paint a fence. How long would ${c} painters take, working at the same speed?`, (a * b) / c, [(b * c) / a, b, a * b, (a * b) / c + 1], 'hours',
      `The job takes ${a} × ${b} = ${a * b} painter-hours. Shared between ${c} painters: ${a * b} ÷ ${c} = ${(a * b) / c} hours. More painters means less time.`];
  }
  M.add({
    id: 'a11-proportion', skill: SKILL, variants: PROP_V, level: ([k]) => (k === 'recipe' || k === 'unit' ? 2 : 3),
    make: (v, r) => {
      const [text, ans, cands, u, why] = proportionQ(v, r), money = u === '€';
      return { text, short: text.split('. ')[0], ...M.valOpts(r, ans, cands.filter(c => c > 0 && cents(c)), money ? M.euro : withUnit(u), money ? 0.1 : 1), why };
    }
  });

  /* ---------- speed, distance and time ---------- */
  const MOVERS = [['A car', 'drives', [40, 50, 60, 70, 80, 90]], ['A train', 'travels', [60, 80, 100, 120, 150]], ['A cyclist', 'rides', [12, 14, 16, 18, 20]], ['A walker', 'walks', [3, 4, 5, 6]]];
  function speedQ([mi, k], r) {
    const [who, verb, speeds] = MOVERS[mi], s = M.pick(r, speeds), go = mi > 1 ? 'do they go' : 'does it go';
    if (k === 'dist' || k === 'half') {
      const t = k === 'dist' ? M.int(r, 2, 5) : M.pick(r, [1.5, 2.5, 0.5]), d = s * t;
      return [`${who} ${verb} at ${s} km/h for ${F(t)} hours. How far ${go}?`, d, [s + t, d / 2, s * (t + 1), d + 10], 'km', `Distance = speed × time = ${s} × ${F(t)} = ${F(d)} km.`];
    }
    if (k === 'speed') {
      const t = M.int(r, 2, 4), d = s * t;
      return [`${who} ${verb} ${d} km in ${t} hours. What is the average speed?`, s, [d * t, d - t, s + 10, s * 2], 'km/h', `Speed = distance ÷ time = ${d} ÷ ${t} = ${s} km/h.`];
    }
    const frac = M.pick(r, [0.5, 1.5, 0.25, 0.75, 1.25]), d = s * frac, mins = frac * 60;
    return [`${who} ${verb} ${F(d)} km at ${s} km/h. How many minutes does the journey take?`, mins, [frac * 100, mins + 30, d * 10, mins - 15], 'minutes',
      `Time = distance ÷ speed = ${F(d)} ÷ ${s} = ${F(frac)} hours, and ${F(frac)} × 60 = ${mins} minutes.`];
  }
  M.add({
    id: 'a11-speed', skill: SKILL, variants: M.combos([0, 1, 2, 3], ['dist', 'half', 'speed', 'mins'], M.range(0, 4)), level: ([, k]) => ({ dist: 1, half: 2, speed: 2, mins: 3 }[k]),
    make: (v, r) => {
      const [text, ans, cands, u, why] = speedQ(v, r);
      return { text, short: text.split('. ')[0], ...M.valOpts(r, ans, cands.filter(c => c > 0 && Number.isInteger(Math.round(c * 1000) / 100)), withUnit(u), u === 'km/h' ? 5 : 10), why };
    }
  });

  /* ---------- averages ---------- */
  const STAT = { range: 1, mode: 1, median: 2, mean: 2, missing: 3, median6: 3 };
  const distinctNums = (r, n, lo, hi) => { const s = new Set(); while (s.size < n) s.add(M.int(r, lo, hi)); return [...s]; };
  function dataQ(k, r) {
    if (k === 'range') { const d = distinctNums(r, 5, 3, 40), mx = Math.max(...d), mn = Math.min(...d); return [d, 'range', mx - mn, [mx, mn, mx + mn, mx - mn + 1], `Range = biggest − smallest = ${mx} − ${mn} = ${mx - mn}.`]; }
    if (k === 'mode') { const [m, ...o] = distinctNums(r, 5, 3, 30), d = M.shuffle(r, [m, m, ...o]); return [d, 'mode', m, [...o.slice(0, 2), 2, Math.max(...d)], `The mode is the number that appears most often: ${m} appears twice.`]; }
    if (k === 'median' || k === 'median6') {
      const n = k === 'median' ? M.pick(r, [5, 7]) : 6, mid = (n - 1) / 2;
      let d;
      do d = distinctNums(r, n, 2, 40); while (k === 'median' && d[mid] === [...d].sort((a, b) => a - b)[mid]);
      const s = [...d].sort((a, b) => a - b), med = n % 2 ? s[mid] : (s[2] + s[3]) / 2;
      return [d, 'median', med, n % 2 ? [d[mid], s[mid + 1], s[mid - 1]] : [s[2], s[3], (d[2] + d[3]) / 2, med + 1],
        `Put them in order: ${s.join(', ')}. ${n % 2 ? `The middle number is ${med}.` : `The middle two are ${s[2]} and ${s[3]}, and halfway between them is ${F(med)}.`}`];
    }
    if (k === 'mean') {
      let d, mean;
      do { d = distinctNums(r, 4, 2, 30); mean = M.int(r, 6, 20); d.push(5 * mean - d.reduce((a, b) => a + b, 0)); } while (d[4] < 1 || d[4] > 40 || new Set(d).size < 5);
      const sum = 5 * mean, med = [...d].sort((a, b) => a - b)[2];
      return [d, 'mean', mean, [sum, med, mean + 1, Math.round(sum / 4)], `Add them up: ${d.join(' + ')} = ${sum}. Then divide by 5: ${sum} ÷ 5 = ${mean}.`];
    }
    let d, mean, last;
    do { d = distinctNums(r, 3, 2, 25); mean = M.int(r, 8, 18); last = 4 * mean - d.reduce((a, b) => a + b, 0); } while (last < 1 || last > 40 || d.includes(last));
    return [d, 'missing', last, [4 * mean, mean, last + 2, Math.abs(3 * mean - (4 * mean - last))],
      `4 numbers with a mean of ${mean} add up to 4 × ${mean} = ${4 * mean}. ${d.join(' + ')} = ${4 * mean - last}, so the missing number is ${4 * mean} − ${4 * mean - last} = ${last}.`, mean];
  }
  M.add({
    id: 'a11-averages', skill: SKILL, variants: M.combos(Object.keys(STAT), M.range(0, 14)), level: ([k]) => STAT[k],
    make: ([k], r) => {
      const [d, stat, ans, cands, why, mean] = dataQ(k, r), list = d.join(', ');
      const text = stat === 'missing' ? `The mean of four numbers is ${mean}. Three of them are ${M.and(d)}. What is the fourth number?` : `What is the ${stat} of these numbers?`;
      return { text, say: stat === 'missing' ? text : `${list}. ${text}`, short: stat === 'missing' ? `Mean ${mean}: ${list}, ?` : `${M.cap(stat)} of ${list}`,
        vis: stat === 'missing' ? M.draw.chips([...d, '?']) : M.draw.chips(d), ...M.valOpts(r, ans, cands.filter(c => c > 0 && c !== ans), F, 1), why };
    }
  });

  /* ---------- probability ---------- */
  const DICE = [['an even number', [2, 4, 6]], ['a number bigger than 4', [5, 6]], ['a prime number', [2, 3, 5]], ['a 6', [6]], ['a number less than 3', [1, 2]],
    ['a multiple of 3', [3, 6]], ['anything except a 6', [1, 2, 3, 4, 5]], ['a number bigger than 1', [2, 3, 4, 5, 6]]];
  const COINS = [['two heads', 1], ['one head and one tail', 2], ['at least one head', 3], ['no heads', 1]];
  const CARDS = [['a multiple of 3', 'multiples of 3', n => n % 3 === 0], ['a multiple of 4', 'multiples of 4', n => n % 4 === 0], ['a prime number', 'prime numbers', H.isPrime],
    ['a square number', 'square numbers', n => Number.isInteger(Math.sqrt(n))], ['a multiple of 5', 'multiples of 5', n => n % 5 === 0]];
  const PROB_V = [...M.combos(['bag', 'bagNot'], M.range(0, 11)), ...DICE.map((_, i) => ['dice', i]), ...COINS.map((_, i) => ['coins', i]), ...M.combos(['cards'], M.range(0, 14))];
  const outOf = (n, d) => `${n}/${d}${H.fstr([n, d]) !== `${n}/${d}` ? ` = ${H.fstr([n, d])}` : ''}`;
  function probQ([k, i], r) {
    if (k === 'bag' || k === 'bagNot') {
      const cols = M.shuffle(r, ['red', 'blue', 'green', 'yellow']).slice(0, M.int(r, 2, 3)), counts = cols.map(() => M.int(r, 1, 6)), total = counts.reduce((a, b) => a + b, 0);
      const ci = M.int(r, 0, cols.length - 1), want = k === 'bag' ? counts[ci] : total - counts[ci], what = k === 'bag' ? cols[ci] : `not ${cols[ci]}`;
      return [G.bag(cols.flatMap((c, j) => Array(counts[j]).fill(c)), r), `A bag has ${M.and(cols.map((c, j) => `${counts[j]} ${c}`))} balls. One ball is picked without looking. What is the probability that it is ${what}?`,
        [want, total], [[want, total - want || 1], [total - want, total], [1, want], [want, total + 1]], `${want} of the ${total} balls are ${what}, so the probability is ${outOf(want, total)}.`];
    }
    if (k === 'dice') {
      const [ev, list] = DICE[i], n = list.length;
      return ['', `A fair six-sided dice is rolled. What is the probability of getting ${ev}?`, [n, 6], [[n, 5], [6 - n, 6], [1, n + 1], [n, 12]], `The numbers that count are ${M.and(list)}: ${n} out of 6, so ${outOf(n, 6)}.`];
    }
    if (k === 'coins') {
      const [ev, n] = COINS[i];
      return ['', `Two fair coins are flipped. What is the probability of getting ${ev}?`, [n, 4], [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]], `There are 4 equally likely results: HH, HT, TH, TT. ${n} of them ${n === 1 ? 'is' : 'are'} ${ev}, so ${outOf(n, 4)}.`];
    }
    const [ev, plural, test] = CARDS[i % CARDS.length], N = [10, 12, 20][Math.floor(i / CARDS.length)], hits = M.range(1, N).filter(test);
    return ['', `Cards numbered 1 to ${N} are shuffled and one is picked. What is the probability that it is ${ev}?`, [hits.length, N],
      [[hits.length, N - hits.length], [hits.length + 1, N], [N - hits.length, N], [1, hits.length]], `The ${plural} are ${M.and(hits)}: that's ${hits.length} out of ${N}, so ${outOf(hits.length, N)}.`];
  }
  M.add({
    id: 'a11-probability', skill: SKILL, variants: PROB_V, level: ([k, i]) => (k === 'bag' ? (i % 2 ? 2 : 1) : k === 'bagNot' || k === 'dice' ? 2 : 3),
    make: (v, r) => {
      const [vis, text, ans, cands, why] = probQ(v, r);
      return { text, short: text.replace(/^.*What is the probability (that it is|of getting) /, 'Probability: ').replace(/\?$/, ''), vis, ...H.fracOpts(r, ans, cands), why };
    }
  });

  /* ---------- best buy ---------- */
  const BUY_ITEMS = [['pens', 'pen'], ['apples', 'apple'], ['batteries', 'battery'], ['yoghurts', 'yoghurt'], ['bread rolls', 'roll']];
  M.add({
    id: 'a11-best-buy', skill: SKILL, variants: M.combos(['easy', 'close'], M.range(0, 19)), level: ([k]) => (k === 'easy' ? 2 : 3),
    make: ([k], r) => {
      const [items, one] = M.pick(r, BUY_ITEMS), base = M.int(r, 6, 18) * 5, counts = M.shuffle(r, [2, 3, 4, 5, 6, 8, 10, 12]).slice(0, 4);
      const deltas = [0, ...M.shuffle(r, k === 'easy' ? [5, 10, 15, 20, 25] : [2, 3, 4, 5, 6]).slice(0, 3)];
      const packs = counts.map((n, j) => ({ each: base + deltas[j], t: `${n} for ${M.euro((n * (base + deltas[j])) / 100)}` }));
      return {
        text: `Which pack of ${items} is the best value for money?`, short: `Best value ${items}`, long: true, opts: packs.map(p => p.t), a: 0,
        why: `Work out the price of one ${one}: ${packs.map(p => `${p.t} is ${M.euro(p.each / 100)} each`).join(', ')}. ${packs[0].t} is the cheapest per ${one}.`
      };
    }
  });

  /* ---------- number puzzles ---------- */
  function pyramidQ([k], r) {
    if (k === 'top4') {
      const b = M.range(1, 4).map(() => M.int(r, 1, 9)), m1 = [b[0] + b[1], b[1] + b[2], b[2] + b[3]], m2 = [m1[0] + m1[1], m1[1] + m1[2]], top = m2[0] + m2[1];
      return [G.pyramid([['?'], ['', ''], ['', '', ''], b]), top, [b[0] + b[1] + b[2] + b[3], top - b[1], top + 2, m2[0] * 2],
        `Fill it in row by row: ${m1.join(', ')}, then ${m2.join(', ')}, then ${m2[0]} + ${m2[1]} = ${top}.`];
    }
    const [a, b, c] = [M.int(r, 2, 15), M.int(r, 2, 15), M.int(r, 2, 15)], top = a + 2 * b + c;
    if (k === 'top3') return [G.pyramid([['?'], ['', ''], [a, b, c]]), top, [a + b + c, top + b, top - 1, (a + b) * 2], `${a} + ${b} = ${a + b} and ${b} + ${c} = ${b + c}. Then ${a + b} + ${b + c} = ${top}.`];
    return [G.pyramid([[top], ['', ''], [a, '?', c]]), b, [top - a - c, b + 1, b - 1, Math.round(top / 3)],
      `The middle bricks are ${a} + ? and ? + ${c}, so the top is ${a} + ${c} + 2 × ? = ${top}. ${top} − ${a + c} = ${top - a - c}, and half of that is ${b}.`];
  }
  M.add({
    id: 'a11-pyramid', skill: SKILL, variants: M.combos(['top3', 'top4', 'base'], M.range(0, 17)), level: ([k]) => ({ top3: 1, top4: 2, base: 3 }[k]),
    make: (v, r) => {
      const [vis, ans, cands, why] = pyramidQ(v, r);
      return { text: 'Each brick is the sum of the two bricks under it. What number goes in the brick with the question mark?', short: 'Number pyramid', vis, ...M.numOpts(r, ans, cands), why };
    }
  });

  const RULES = [['the first two multiplied', (a, b) => a * b, 2], ['the first two added', (a, b) => a + b, 2], ['double the first, plus the second', (a, b) => 2 * a + b, 3],
    ['the first two added, then doubled', (a, b) => 2 * (a + b), 3], ['the first two multiplied, minus 1', (a, b) => a * b - 1, 3]];
  function gridRows(ri, r) {
    for (;;) {
      const rows = [0, 1, 2].map(() => [M.int(r, 2, 9), M.int(r, 2, 9)]), f = RULES[ri][1];
      const fits = g => rows.slice(0, 2).every(([a, b]) => g(a, b) === f(a, b));
      if (!RULES.some((x, j) => j !== ri && fits(x[1]))) return rows;   // only one rule may fit the first two rows
    }
  }
  M.add({
    id: 'a11-grid-rule', skill: SKILL, variants: M.combos(M.range(0, RULES.length - 1), M.range(0, 7)), level: ([ri]) => RULES[ri][2],
    make: ([ri], r) => {
      const rows = gridRows(ri, r), f = RULES[ri][1], [a, b] = rows[2], ans = f(a, b);
      return {
        text: 'Each row follows the same rule. What number is missing?', short: `Row rule: ${rows.map(([x, y], j) => (j < 2 ? `${x}, ${y}, ${f(x, y)}` : `${x}, ${y}, ?`)).join(' / ')}`,
        vis: G.table(rows.map(([x, y], j) => [x, y, j < 2 ? f(x, y) : '?'])), ...M.numOpts(r, ans, RULES.map(x => x[1](a, b)).concat(ans + 1)),
        why: `In each row the third number is ${RULES[ri][0]}: ${rows.slice(0, 2).map(([x, y]) => `${x}, ${y} → ${f(x, y)}`).join('; ')}. So ${a}, ${b} → ${ans}.`
      };
    }
  });

  /* ---------- age puzzles ---------- */
  const AGE_V = [...M.combos([20, 24, 28, 30, 34, 36, 40], [2, 4, 6, 8]).map(([s, d]) => ['sum', s, d]), ...M.combos([2, 3, 4, 5], [4, 6, 8, 10, 12]).map(([k, y]) => ['times', k, y]),
    ...[[6, 3, 4], [8, 3, 6], [5, 4, 3], [10, 2, 14], [7, 3, 5], [4, 4, 4], [9, 3, 6], [12, 2, 16], [6, 4, 2], [5, 3, 10]].map(p => ['future', ...p])];
  function agesQ([k, a, b, c], r) {
    const [n1, n2] = M.names(r);
    if (k === 'sum') {
      const young = (a - b) / 2;
      return [`${n1} and ${n2} are ${a} years old altogether. ${n1} is ${b} years older than ${n2}. How old is ${n2}?`, young, [a - b, (a + b) / 2, a / 2, young + 1],
        `Take away the difference: ${a} − ${b} = ${a - b}. That is two lots of ${n2}'s age, so ${n2} is ${a - b} ÷ 2 = ${young}.`];
    }
    if (k === 'times') {
      return [`${n1} is ${a} times as old as ${n2}. Together they are ${(a + 1) * b} years old. How old is ${n2}?`, b, [a * b, (a + 1) * b / 2, b * 2, (a + 1) * b / a],
        `${n2}'s age is 1 part and ${n1}'s is ${a} parts: ${a + 1} parts in all. ${(a + 1) * b} ÷ ${a + 1} = ${b}.`];
    }
    const p = b * (a + c) - c;
    return [`${n1} is ${a} and ${n1}'s mum is ${p}. In how many years will Mum be exactly ${b} times as old as ${n1}?`, c, [c + 2, c - 2, p - b * a, Math.round(p / b) - a],
      `In ${c} years ${n1} will be ${a + c} and Mum will be ${p + c}. ${b} × ${a + c} = ${p + c}.`];
  }
  M.add({
    id: 'a11-age-puzzles', skill: SKILL, variants: AGE_V, level: ([k, a, b]) => (k === 'future' ? 3 : (k === 'times' && a === 2) || (k === 'sum' && b === 2) ? 1 : 2),
    make: (v, r) => { const [text, ans, cands, why] = agesQ(v, r); return { text, short: text.split('. ').slice(0, -1).join('. '), long: false, ...M.numOpts(r, ans, cands), why }; }
  });
})(window.MBT);
