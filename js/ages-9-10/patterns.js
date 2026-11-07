/* Math Brain Test, ages 9 to 10: patterns & sequences (steps, through zero, multiples, factors, squares, growing patterns, machines). */
(function (M) {
  const P = M.draw9, H = M.h9, N = M.fmtNum, SKILL = 'patterns9';

  function seqQ(items, ans, cands, why, lead = 'What number comes next?') {
    const spoken = items[items.length - 1] === '?' ? items.slice(0, -1) : items;
    const listed = spoken.map(x => (x === '?' ? 'what' : N(x))).join(', ');
    return {
      text: lead, say: `${M.sayText(listed)}. ${lead}`, short: `${items.map(x => (x === '?' ? '?' : N(x))).join('; ')}`,
      vis: M.draw.chips(items.map(x => (x === '?' ? '?' : N(x)))), ...cands, why
    };
  }

  const BIG = [25, 50, 100, 1000], EASY = [6, 7, 8, 9, 11, 12], HARD = [75, 250];
  const stepLevel = step => (BIG.includes(step) ? 1 : EASY.includes(step) ? 2 : 3);
  const nearby = (ans, step) => [ans + step, ans + 1, ans - 1, ans + 10, ans - 10, ans - step, ans + (step >= 100 ? 100 : 2)];
  M.add({
    id: 'a9-step', skill: SKILL, variants: M.combos([...BIG, ...EASY, ...HARD], ['up', 'down'], M.range(0, 4)),
    level: ([step, dir]) => Math.min(3, stepLevel(step) + (dir === 'down' ? 1 : 0)),
    make: ([step, dir], r) => {
      const unit = step >= 1000 ? 100 : step >= 25 ? 5 : 1;
      const start = dir === 'up' ? M.int(r, 1, 40) * unit : step * M.int(r, 6, 10) + M.int(r, 0, 9) * unit;
      const sign = dir === 'up' ? 1 : -1, items = M.range(0, 4).map(i => start + sign * i * step), ans = start + sign * 5 * step;
      return seqQ([...items, '?'], ans, M.valOpts(r, ans, nearby(ans, step).filter(x => x >= 0)),
        `The numbers go ${dir} by ${N(step)} each time: ${N(items[4])} ${dir === 'up' ? '+' : '−'} ${N(step)} = ${N(ans)}.`);
    }
  });

  M.add({
    id: 'a9-through-zero', skill: SKILL, variants: M.combos(M.range(2, 6), ['down', 'up'], M.range(0, 4)),
    level: ([, dir]) => (dir === 'down' ? 2 : 3),
    make: ([step, dir], r) => {
      const sign = dir === 'up' ? 1 : -1, start = dir === 'down' ? M.int(r, 1, 3 * step) : -M.int(r, 2 * step, 4 * step);
      const items = M.range(0, 4).map(i => start + sign * i * step), ans = start + sign * 5 * step;
      return seqQ([...items, '?'], ans, M.valOpts(r, ans, [-ans, ans - sign * step, ans + sign * step, ans + 1, ans - 1]),
        `The numbers go ${dir} by ${step} each time, even past zero: ${N(items[4])} ${dir === 'up' ? '+' : '−'} ${step} = ${N(ans)}.`);
    }
  });

  M.add({
    id: 'a9-missing-term', skill: SKILL, variants: M.combos([...BIG, ...EASY], M.range(0, 5)),
    level: ([step, s]) => Math.min(3, (BIG.includes(step) ? 1 : 2) + (s % 2)),
    make: ([step, s], r) => {
      const sign = s % 2 ? -1 : 1, unit = step >= 1000 ? 100 : step >= 25 ? 5 : 1;
      const start = sign > 0 ? M.int(r, 1, 40) * unit : step * M.int(r, 6, 10) + M.int(r, 0, 9) * unit;
      const terms = M.range(0, 5).map(i => start + sign * i * step), gap = M.int(r, 1, 4), ans = terms[gap];
      const items = terms.map((t, i) => (i === gap ? '?' : t));
      return seqQ(items, ans, M.valOpts(r, ans, nearby(ans, step).filter(x => x >= 0)),
        `The numbers go ${sign > 0 ? 'up' : 'down'} by ${N(step)} each time, so the missing number is ${N(terms[gap - 1])} ${sign > 0 ? '+' : '−'} ${N(step)} = ${N(ans)}.`,
        'Which number is missing?');
    }
  });

  M.add({
    id: 'a9-multiple', skill: SKILL, variants: M.combos(M.range(3, 12), ['is', 'not'], M.range(0, 3)),
    level: ([k, mode]) => ([3, 4, 5, 10].includes(k) ? 1 : 2) + (mode === 'not' ? 1 : 0),
    make: ([k, mode], r) => {
      const m = M.int(r, 3, 12);
      if (mode === 'is') {
        const ans = k * m, near = new Set([ans + 1, ans - 1, ans + 2, ans - 2, ans + k + 1, ans - k + 1]);
        const wrong = M.shuffle(r, [...near].filter(x => x > 0 && x % k)).slice(0, 3);
        return {
          text: `Which number is a multiple of ${k}?`, short: `A multiple of ${k}`, ...M.textOpts(r, String(ans), wrong.map(String)),
          why: `${ans} = ${k} × ${m}, so it is in the ${k} times table. The others are not.`
        };
      }
      const ans = k * m + M.int(r, 1, k - 1), wrong = M.shuffle(r, [m - 2, m - 1, m + 1, m + 2].map(x => k * x)).slice(0, 3);
      return {
        text: `Which number is NOT a multiple of ${k}?`, say: `Which number is not a multiple of ${k}?`, short: `Not a multiple of ${k}`,
        ...M.textOpts(r, String(ans), wrong.map(String)),
        why: `${ans} is not in the ${k} times table: ${k} × ${m} = ${k * m} and ${k} × ${m + 1} = ${k * (m + 1)}.`
      };
    }
  });

  const FNUMS = [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 54, 56, 60, 63, 72, 84, 90, 96, 100];
  M.add({
    id: 'a9-factor', skill: SKILL, variants: M.combos(FNUMS, ['is', 'not']),
    level: ([n, mode]) => (mode === 'is' && n <= 48 ? 2 : 3),
    make: ([n, mode], r) => {
      const factors = M.range(2, n / 2).filter(x => n % x === 0), others = M.range(2, Math.min(n - 1, 20)).filter(x => n % x);
      const yes = mode === 'is', ans = M.pick(r, yes ? factors : others);
      const wrong = M.shuffle(r, yes ? others : factors).slice(0, 3);
      return {
        text: `Which number is ${yes ? '' : 'NOT '}a factor of ${n}?`, say: `Which number is ${yes ? '' : 'not '}a factor of ${n}?`,
        short: `${yes ? 'A' : 'Not a'} factor of ${n}`, ...M.textOpts(r, String(ans), wrong.map(String)),
        why: yes ? `${n} ÷ ${ans} = ${n / ans} exactly, so ${ans} is a factor of ${n}.`
          : `${n} ÷ ${ans} leaves a remainder, so ${ans} is not a factor. The others all divide ${n} exactly.`
      };
    }
  });

  const PAIRS = [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [4, 6], [3, 8], [2, 7], [5, 6], [6, 8], [4, 10], [6, 9]];
  M.add({
    id: 'a9-common-multiple', skill: SKILL, variants: M.combos(M.range(0, PAIRS.length - 1), M.range(0, 2)),
    level: () => 3,
    make: ([i], r) => {
      const [a, b] = PAIRS[i], lcm = a * b / M.gcd(a, b), ans = lcm * M.int(r, 1, Math.floor(100 / lcm));
      const onlyA = M.range(1, 100 / a).map(x => a * x).filter(x => x % b), onlyB = M.range(1, 100 / b).map(x => b * x).filter(x => x % a);
      const near = list => list.slice().sort((x, y) => Math.abs(x - ans) - Math.abs(y - ans)).slice(0, 3);
      const wrong = [M.pick(r, near(onlyA)), M.pick(r, near(onlyB)), ans + 1];
      return {
        text: `Which number is a multiple of both ${a} and ${b}?`, short: `Multiple of ${a} and ${b}`,
        ...M.textOpts(r, String(ans), wrong.map(String)),
        why: `${ans} = ${a} × ${ans / a} and ${ans} = ${b} × ${ans / b}, so it is in both times tables.`
      };
    }
  });

  const isSquare = x => Number.isInteger(Math.sqrt(x));
  M.add({
    id: 'a9-square', skill: SKILL, variants: [...M.range(2, 12).map(n => ['value', n]), ...M.combos(['pick'], M.range(3, 12), [0, 1])],
    level: ([mode, n]) => (mode === 'value' ? (n <= 5 ? 1 : n <= 10 ? 2 : 3) : n <= 8 ? 2 : 3),
    make: ([mode, n], r) => {
      const sq = n * n;
      if (mode === 'value') {
        return {
          text: `What is ${n} squared (${n} × ${n})?`, say: `What is ${n} squared, which is ${n} times ${n}?`, short: `${n} × ${n}`,
          ...M.numOpts(r, sq, [2 * n, sq + n, sq - n, (n + 1) ** 2, (n - 1) ** 2]), why: `${n} squared means ${n} × ${n} = ${sq}.`
        };
      }
      const wrong = [sq + 1, sq - 1, sq + 2, sq - 2, n * (n + 1), n * (n - 1)].filter(x => x > 0 && !isSquare(x));
      return {
        text: 'Which of these is a square number?', short: 'A square number', ...M.textOpts(r, String(sq), M.shuffle(r, wrong).slice(0, 3).map(String)),
        why: `${sq} = ${n} × ${n}, so ${sq} small squares can make ${M.an(n)} ${n} by ${n} square.`
      };
    }
  });

  const GROW = {
    L: { f: k => 2 * k - 1, why: (t, v) => `Each pattern adds 2 squares, one on top and one on the side. Pattern ${t} has ${t} + ${t - 1} = ${v}.` },
    stair: { f: k => k * (k + 1) / 2, why: (t, v) => `Pattern ${t} has columns of 1, 2, 3 … up to ${t} squares: 1 + 2 + … + ${t} = ${v}.` },
    square: { f: k => k * k, why: (t, v) => `Pattern ${t} is ${M.an(t)} ${t} by ${t} square: ${t} × ${t} = ${v}.` },
    rect: { f: k => k * (k + 1), why: (t, v) => `Pattern ${t} is ${t + 1} squares wide and ${t} tall: ${t + 1} × ${t} = ${v}.` },
    cross: { f: k => 4 * k + 1, why: (t, v) => `Each pattern adds 4 squares, one on each arm. Pattern ${t} has 1 + 4 × ${t} = ${v}.` },
    sticks: { f: k => 3 * k + 1, why: (t, v) => `Each new square needs 3 more sticks. Pattern ${t} has 1 + 3 × ${t} = ${v} sticks.` }
  };
  M.add({
    id: 'a9-growing', skill: SKILL, variants: M.combos(Object.keys(GROW), [4, 5, 6, 8, 10]),
    level: ([, t]) => (t === 4 ? 1 : t <= 6 ? 2 : 3),
    make: ([kind, t], r) => {
      const g = GROW[kind], v = g.f(t), lin = g.f(3) + (t - 3) * (g.f(3) - g.f(2)), what = kind === 'sticks' ? 'sticks' : 'squares';
      return {
        text: `Here are patterns 1, 2 and 3. How many ${what} will pattern ${t} have?`, short: `Pattern ${t}`, vis: P.growing(kind),
        ...M.numOpts(r, v, [g.f(t - 1), g.f(t + 1), v + 1, v - 1, lin]), why: g.why(t, v)
      };
    }
  });

  const step = (t, f) => ({ t, f });
  const RULES = [
    [step('× 2', x => 2 * x), step('+ 1', x => x + 1)], [step('× 3', x => 3 * x), step('− 1', x => x - 1)],
    [step('× 2', x => 2 * x), step('− 3', x => x - 3)], [step('× 10', x => 10 * x), step('+ 5', x => x + 5)],
    [step('÷ 2', x => x / 2), step('+ 4', x => x + 4)], [step('× 5', x => 5 * x), step('− 2', x => x - 2)],
    [step('+ 4', x => x + 4), step('× 2', x => 2 * x)], [step('− 3', x => x - 3), step('× 3', x => 3 * x)]
  ];
  M.add({
    id: 'a9-machine', skill: SKILL, variants: M.combos(M.range(0, RULES.length - 1), M.range(4, 9), ['out', 'in']),
    level: ([i, , mode]) => (i === 0 || i === 3 ? 1 : 2) + (mode === 'in' ? 1 : 0),
    make: ([i, n, mode], r) => {
      const [s1, s2] = RULES[i], x = s1.t === '÷ 2' ? 2 * n : n, y = s2.f(s1.f(x)), swapped = s1.f(s2.f(x));
      const rule = `${s1.t}, then ${s2.t}`, ruleSay = `${M.sayText(s1.t)}, then ${M.sayText(s2.t)}`;
      if (mode === 'out') {
        return {
          text: `${x} goes into the machine. It does ${rule}. What comes out?`, say: `${x} goes into the machine. It does ${ruleSay}. What comes out?`,
          short: `${x} → ${rule}`, vis: P.machine(String(x), [s1.t, s2.t], '?'),
          ...M.numOpts(r, y, [swapped, s1.f(x), y + 1, y - 1, y + 2]), why: `${x} ${s1.t} = ${s1.f(x)}, then ${s1.f(x)} ${s2.t} = ${y}.`
        };
      }
      return {
        text: `The machine does ${rule}. Out came the number ${y}. What number went in?`,
        say: `The machine does ${ruleSay}. Out came the number ${y}. What number went in?`,
        short: `? → ${rule} → ${y}`, vis: P.machine('?', [s1.t, s2.t], String(y)),
        ...M.numOpts(r, x, [s2.f(s1.f(y)), x + 1, x - 1, x + 2, s1.f(x)]),
        why: `Work backwards: undo ${s2.t}, then undo ${s1.t}. Check: ${x} ${s1.t} = ${s1.f(x)}, and ${s1.f(x)} ${s2.t} = ${y}.`
      };
    }
  });
})(window.MBT);
