/* Math Brain Test: shared helpers. Every other script adds to window.MBT. */
window.MBT = window.MBT || {};
(function (M) {
  M.templates = [];
  M.add = t => { M.templates.push(t); };

  M.SKILLS = {
    numbers:  { name: 'Number sense',         c: '--rod-blue',   tip: 'Count things around the house, and compare numbers like 47 and 74. Which one has more tens?' },
    patterns: { name: 'Patterns',             c: '--rod-purple', tip: 'Build bead or block patterns and ask what comes next. Count out loud by 2s, 5s and 10s.' },
    sums:     { name: 'Adding & taking away', c: '--rod-orange', tip: 'Practise the pairs that make 10, like 7 + 3, 6 + 4 and 8 + 2. They make bigger sums easy.' },
    shapes:   { name: 'Shapes & time',        c: '--rod-dgreen', tip: 'Read a real clock together at o’clock and half past, and count the sides of shapes you spot outside.' },
    logic:    { name: 'Thinking puzzles',     c: '--rod-yellow', tip: 'Tell short story problems at mealtimes: “We have 9 grapes and eat 4. How many are left?”' }
  };

  /* Seeded randomness, so the same template + variant always builds the same question. */
  M.hash = str => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  M.rng = seed => () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  M.int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
  M.pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  M.shuffle = (r, arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  M.range = (lo, hi, step = 1) => { const a = []; for (let i = lo; i <= hi; i += step) a.push(i); return a; };
  M.combos = (...lists) => lists.reduce((acc, list) => acc.flatMap(a => list.map(x => [...a, x])), [[]]);

  /* Answer options. The answer always goes first; the quiz shuffles the order on screen. */
  M.numOpts = (r, ans, cands) => {
    const seen = new Set([ans]), out = [];
    for (const c of M.shuffle(r, cands)) {
      if (out.length === 3) break;
      if (Number.isInteger(c) && c >= 0 && !seen.has(c)) { seen.add(c); out.push(c); }
    }
    for (let k = 1; out.length < 3; k++) {
      for (const c of [ans + k, ans - k]) if (out.length < 3 && c >= 0 && !seen.has(c)) { seen.add(c); out.push(c); }
    }
    return { opts: [ans, ...out].map(String), a: 0 };
  };
  M.textOpts = (r, ans, wrong) => {
    const pool = [...new Set(wrong)].filter(w => w !== ans);
    return { opts: [ans, ...M.shuffle(r, pool).slice(0, 3)], a: 0 };
  };

  /* Words and small text helpers */
  M.NAMES = ['Sam', 'Mia', 'Leo', 'Ava', 'Noah', 'Zara', 'Omar', 'Lily', 'Ben', 'Nina', 'Kai', 'Rosa', 'Theo', 'Ivy', 'Max', 'Zoe'];
  M.names = r => M.shuffle(r, M.NAMES).slice(0, 3);
  M.and = list => (list.length < 2 ? String(list[0]) : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`);
  M.chain = (times, n) => Array(times).fill(n).join(' + ');
  M.tensWord = t => `${t} ${t === 1 ? 'ten' : 'tens'}`;
  M.onesWord = o => `${o} ${o === 1 ? 'one' : 'ones'}`;
  M.swapDigits = n => (n >= 10 && n < 100 ? (n % 10) * 10 + Math.floor(n / 10) : n + 1);
  M.cap = s => s.charAt(0).toUpperCase() + s.slice(1);
})(window.MBT);
