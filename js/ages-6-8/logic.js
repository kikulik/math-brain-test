/* Math Brain Test: thinking puzzles (story problems, balance, odd one out, ordering, riddles). */
(function (M) {
  const D = M.draw;
  const THINGS = ['stickers', 'marbles', 'shells', 'crayons', 'cookies', 'toy cars', 'stamps', 'balloons'];

  M.add({
    id: 'story-add', skill: 'logic', variants: M.combos(M.range(3, 11), M.range(2, 8)), level: ([a, b]) => (a + b <= 10 ? 1 : 2),
    make: ([a, b], r) => {
      const [n] = M.names(r), t = M.pick(r, THINGS), s = a + b;
      return {
        text: `${n} has ${a} ${t}. Then ${n} gets ${b} more. How many ${t} does ${n} have now?`, short: `${n}’s ${t}`,
        ...M.numOpts(r, s, [s + 1, s - 1, a - b, s + 10, b]), why: `${a} + ${b} = ${s}.`
      };
    }
  });

  M.add({
    id: 'story-sub', skill: 'logic', variants: M.combos(M.range(6, 14), M.range(2, 6)), level: ([a]) => (a <= 10 ? 1 : 2),
    make: ([a, b], r) => {
      const [n] = M.names(r), t = M.pick(r, THINGS), d = a - b;
      return {
        text: `${n} has ${a} ${t} and gives ${b} away to a friend. How many ${t} does ${n} have left?`, short: `${n}’s ${t}`,
        ...M.numOpts(r, d, [d + 1, d - 1, a + b, b, d + 2]), why: `${a} take away ${b} leaves ${d}.`
      };
    }
  });

  M.add({
    id: 'story-compare', skill: 'logic', variants: M.combos(M.range(3, 11), M.range(1, 5)), level: () => 3,
    make: ([a, d], r) => {
      const [n1, n2] = M.names(r), t = M.pick(r, THINGS), b = a + d;
      return {
        text: `${n1} has ${a} ${t}. ${n2} has ${b} ${t}. How many more ${t} does ${n2} have than ${n1}?`, short: `How many more ${t}?`,
        ...M.numOpts(r, d, [a + b, b, a, d + 1, d + 2]), why: `${b} − ${a} = ${d}, so ${n2} has ${d} more.`
      };
    }
  });

  const GROUPS = [['bags', 'apples'], ['boxes', 'crayons'], ['plates', 'cookies'], ['nests', 'eggs'], ['vases', 'flowers']];
  M.add({
    id: 'groups', skill: 'logic', variants: M.combos(M.range(2, 5), M.range(2, 5)), level: () => 3,
    make: ([g, e], r) => {
      const [holder, thing] = M.pick(r, GROUPS), s = g * e;
      return {
        text: `There are ${g} ${holder} with ${e} ${thing} in each. How many ${thing} are there altogether?`, short: `${g} ${holder} of ${e}`,
        ...M.numOpts(r, s, [g + e, s + e, s - e, s + 1, s - 1]), why: `${M.chain(g, e)} = ${s}.`
      };
    }
  });

  M.add({
    id: 'share', skill: 'logic', variants: M.combos([2, 3], M.range(2, 6)), level: () => 3,
    make: ([g, e], r) => {
      const total = g * e, [n1, n2] = M.names(r), who = g === 2 ? `${n1} and ${n2} share` : 'Three friends share';
      return {
        text: `${who} ${total} grapes equally. How many grapes does each one get?`, short: `Share ${total} grapes`,
        ...M.numOpts(r, e, [e + 1, e - 1, e + 2, total, total - g]), why: `${M.chain(g, e)} = ${total}, so each one gets ${e}.`
      };
    }
  });

  M.add({
    id: 'balance', skill: 'logic', variants: M.combos(M.range(2, 5), [2, 3]), level: () => 3,
    make: ([k, m], r) => ({
      text: `The scale is balanced, so 1 apple weighs the same as ${k} cubes. How many cubes weigh the same as ${m} apples?`,
      short: `Balance: 1 apple = ${k} cubes`, vis: D.balance(k),
      ...M.numOpts(r, k * m, [k + m, k, k * m + 1, k * m - 1, k * m + k]),
      why: `Each apple matches ${k} cubes. ${m} apples match ${M.chain(m, k)} = ${k * m} cubes.`
    })
  });

  /* Odd one out: exactly one rule splits the four numbers 3 to 1, so there is only one fair answer. */
  function distinctNumbers(r, test, lo, hi, n, avoid) {
    const out = [];
    while (out.length < n) { const x = M.int(r, lo, hi); if (test(x) && !out.includes(x) && !avoid.includes(x)) out.push(x); }
    return out;
  }
  function oddSet(rule, r) {
    if (rule === 'even' || rule === 'odd') {
      const two = r() < 0.5, lo = two ? 11 : 1, hi = two ? 99 : 9, keep = rule === 'even' ? 0 : 1;
      const group = distinctNumbers(r, x => x % 2 === keep && x % 10 !== 0, lo, hi, 3, []);
      const odd = distinctNumbers(r, x => x % 2 !== keep && x % 10 !== 0, lo, hi, 1, group)[0];
      return { group, odd, why: `${M.and(group)} are ${rule} numbers. ${odd} is ${rule === 'even' ? 'odd' : 'even'}.` };
    }
    if (rule === 'tens') {
      const group = distinctNumbers(r, x => x % 10 === 0, 10, 90, 3, []);
      const odd = distinctNumbers(r, x => x % 10 !== 0 && x % 2 === 0, 11, 99, 1, group)[0];
      return { group, odd, why: `${M.and(group)} all end in 0, so they are whole tens. ${odd} does not end in 0.` };
    }
    const par = M.int(r, 0, 1);
    const group = distinctNumbers(r, x => x % 2 === par && x % 10 !== 0, 11, 99, 3, []);
    const odd = distinctNumbers(r, x => x % 2 === par, 1, 9, 1, group)[0];
    return { group, odd, why: `${M.and(group)} have two digits. ${odd} has only one digit.` };
  }
  M.add({
    id: 'odd-one-out', skill: 'logic', variants: M.combos(['even', 'odd', 'tens', 'digits'], M.range(0, 14)), level: () => 2,
    make: ([rule], r) => {
      const { group, odd, why } = oddSet(rule, r);
      return {
        text: 'Three of these numbers belong together. Which one does not belong?',
        short: `Odd one out: ${M.shuffle(r, [...group, odd]).join(', ')}`, opts: [odd, ...group].map(String), a: 0, why
      };
    }
  });

  const COMPARE = [['taller', 'tallest', 'shortest'], ['older', 'oldest', 'youngest'], ['faster', 'fastest', 'slowest'], ['heavier', 'heaviest', 'lightest']];
  M.add({
    id: 'order', skill: 'logic', variants: M.combos(M.range(0, 3), ['most', 'least'], M.range(0, 3)), level: () => 3,
    make: ([ci, which], r) => {
      const [more, most, least] = COMPARE[ci], [A, B, C] = M.names(r);
      const s1 = `${A} is ${more} than ${B}.`, s2 = `${B} is ${more} than ${C}.`;
      const word = which === 'most' ? most : least, ans = which === 'most' ? A : C;
      return {
        text: `${r() < 0.5 ? `${s1} ${s2}` : `${s2} ${s1}`} Who is the ${word}?`, short: `Who is the ${word}?`, long: true,
        opts: [ans, ...[A, B, C].filter(x => x !== ans), 'We can’t tell'], a: 0,
        why: `${A} is ${more} than ${B}, and ${B} is ${more} than ${C}. So ${ans} is the ${word}.`
      };
    }
  });

  M.add({
    id: 'riddle', skill: 'logic', variants: M.range(3, 19), level: () => 3,
    make: (n, r) => {
      const par = n % 2 ? 'odd' : 'even', lo = n - 2, hi = n + 2;
      return {
        text: `I am bigger than ${lo} and smaller than ${hi}. I am an ${par} number. What number am I?`, short: 'Number riddle',
        ...M.numOpts(r, n, [n - 1, n + 1, lo, hi]),
        why: `The numbers bigger than ${lo} and smaller than ${hi} are ${n - 1}, ${n} and ${n + 1}. Only ${n} is ${par}.`
      };
    }
  });

  const ANIMALS = [['chicken', 'chickens', 2], ['duck', 'ducks', 2], ['dog', 'dogs', 4], ['cat', 'cats', 4]];
  M.add({
    id: 'legs', skill: 'logic', variants: M.combos(M.range(0, 3), M.range(2, 5)), level: ([i]) => (ANIMALS[i][2] === 2 ? 2 : 3),
    make: ([i, n], r) => {
      const [one, many, legs] = ANIMALS[i], s = n * legs;
      return {
        text: `How many legs do ${n} ${many} have altogether?`, short: `Legs on ${n} ${many}`,
        ...M.numOpts(r, s, [n + legs, s + legs, s - legs, s + 1, n]), why: `Each ${one} has ${legs} legs. ${M.chain(n, legs)} = ${s}.`
      };
    }
  });
})(window.MBT);
