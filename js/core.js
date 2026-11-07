/* Math Brain Test: shared helpers. Every other script adds to window.MBT. */
window.MBT = window.MBT || {};
(function (M) {
  M.templates = [];
  /* Every question gets read-aloud words for symbols (see M.polish below). */
  M.add = t => { M.templates.push({ ...t, make: (v, r) => M.polish(t.make(v, r)) }); };

  /* Age groups. Each has five skills; a test asks 4 questions from each. */
  M.AGES = {
    '6-8': {
      name: '6 to 8',
      note: 'counting, tens and ones, adding and taking away within 20, number patterns, shapes, and telling time',
      next: 'Try harder puzzles next, like adding two-digit numbers or telling time to the quarter hour.'
    },
    '9-10': {
      name: '9 to 10',
      note: 'numbers up to a million, times tables to 12 × 12, division with remainders, fractions and decimals, area, perimeter, angles, and two-step word problems',
      next: 'Try “Beat the clock”, or have a go at the 11 to 12 test.'
    },
    '11-12': {
      name: '11 to 12',
      note: 'negative numbers, primes and factors, simple equations, fractions, decimals and percentages, ratio, angles, area and volume, and averages',
      next: 'Try “Beat the clock”, and explain your thinking out loud on the tricky ones.'
    }
  };
  M.AGE_DEFAULT = '6-8';

  M.SKILLS = {
    numbers:    { age: '6-8', name: 'Number sense',         c: '--rod-blue',   tip: 'Count things around the house, and compare numbers like 47 and 74. Which one has more tens?' },
    patterns:   { age: '6-8', name: 'Patterns',             c: '--rod-purple', tip: 'Build bead or block patterns and ask what comes next. Count out loud by 2s, 5s and 10s.' },
    sums:       { age: '6-8', name: 'Adding & taking away', c: '--rod-orange', tip: 'Practise the pairs that make 10, like 7 + 3, 6 + 4 and 8 + 2. They make bigger sums easy.' },
    shapes:     { age: '6-8', name: 'Shapes & time',        c: '--rod-dgreen', tip: 'Read a real clock together at o’clock and half past, and count the sides of shapes you spot outside.' },
    logic:      { age: '6-8', name: 'Thinking puzzles',     c: '--rod-yellow', tip: 'Tell short story problems at mealtimes: “We have 9 grapes and eat 4. How many are left?”' },

    numbers9:   { age: '9-10', name: 'Numbers & fractions',  c: '--rod-blue',   tip: 'Round prices to the nearest 10 or 100 when shopping, and find fractions of amounts, like a quarter of 24 sweets.' },
    patterns9:  { age: '9-10', name: 'Patterns & sequences', c: '--rod-purple', tip: 'Count up and down in 6s, 7s, 25s and 1000s, and look for the rule in a number pattern before guessing.' },
    times9:     { age: '9-10', name: 'Times & division',     c: '--rod-orange', tip: 'Learn one times table a week up to 12 × 12, then use it backwards for division: 7 × 8 = 56, so 56 ÷ 8 = 7.' },
    measures9:  { age: '9-10', name: 'Shapes & measures',    c: '--rod-dgreen', tip: 'Measure rooms in steps or metres and work out the area. Read the time on a 24-hour clock together.' },
    logic9:     { age: '9-10', name: 'Word problems',        c: '--rod-yellow', tip: 'Read the question twice, write down the numbers that matter, and decide: add, take away, times or share?' },

    numbers11:  { age: '11-12', name: 'Number sense',            c: '--rod-blue',   tip: 'Practise negative numbers on a thermometer, and learn the primes up to 50 and the square numbers up to 144.' },
    algebra11:  { age: '11-12', name: 'Algebra & sequences',     c: '--rod-purple', tip: 'Treat an equation like a balance: whatever you do to one side, do to the other. Check by putting the answer back in.' },
    fractions11:{ age: '11-12', name: 'Fractions, decimals & %', c: '--rod-orange', tip: 'Learn the pairs 1/2 = 0.5 = 50%, 1/4 = 0.25 = 25%, 1/5 = 0.2 = 20% and 1/10 = 0.1 = 10%. Find 10% first, then build up.' },
    geometry11: { age: '11-12', name: 'Geometry & measures',     c: '--rod-dgreen', tip: 'Remember: angles on a straight line make 180°, in a triangle 180°, around a point 360°. Sketch the shape and label it.' },
    logic11:    { age: '11-12', name: 'Problem solving',         c: '--rod-yellow', tip: 'Break long problems into steps, and check the answer makes sense: is it about the right size?' }
  };
  M.skillsFor = age => Object.keys(M.SKILLS).filter(k => M.SKILLS[k].age === age);
  M.validAge = a => typeof a === 'string' && Object.hasOwn(M.AGES, a);

  /* Saved settings in this browser only. Storage can be blocked (private mode), so failures fall back quietly. */
  M.store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: nothing is remembered */ }
    }
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
  /* Numbers as people write them: 45,302 · 0.25 · −7 (a real minus sign). Rounds away float noise like 0.30000000000000004. */
  M.fmtNum = v => {
    const n = Math.round(v * 1e6) / 1e6;
    return (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 6 });
  };
  /* Like numOpts, but negatives and decimals are allowed. fmt turns a value into button text; step is the
     gap used for fallback distractors (0.1 for tenths and so on). */
  M.valOpts = (r, ans, cands, fmt = M.fmtNum, step = 1) => {
    const seen = new Set([fmt(ans)]), out = [];
    const take = c => { if (out.length < 3 && Number.isFinite(c) && !seen.has(fmt(c))) { seen.add(fmt(c)); out.push(c); } };
    M.shuffle(r, cands).forEach(take);
    for (let k = 1; out.length < 3; k++) { take(ans + k * step); take(ans - k * step); }
    return { opts: [ans, ...out].map(fmt), a: 0 };
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
  M.an = n => (/^(8|11|18)/.test(String(n)) ? 'an' : 'a');            // "an 8", "an 11", "a 9"
  M.euro = v => `€${Number.isInteger(v) ? v : v.toFixed(2)}`;          // €60 · €4.05

  /* Whole-number maths */
  M.gcd = (a, b) => (b ? M.gcd(b, a % b) : Math.abs(a));
  M.lcm = (a, b) => (a / M.gcd(a, b)) * b;
  M.simp = (n, d) => { const g = M.gcd(n, d) || 1; return [n / g, d / g]; };

  /* Fractions in words: 1 half, 3 quarters, 2 fifteenths; unusual ones as "5 over 13" */
  const PART = { 2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth',
    11: 'eleventh', 12: 'twelfth', 15: 'fifteenth', 16: 'sixteenth', 20: 'twentieth', 25: 'twenty-fifth', 100: 'hundredth' };
  M.fracPart = (d, many) => (d === 2 ? (many ? 'halves' : 'half') : `${PART[d] || `${d}th`}${many ? 's' : ''}`);
  const WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const num = n => WORD[n] || String(n);
  M.fracSay = (n, d) => (PART[d] ? `${num(n)} ${M.fracPart(d, n !== 1)}` : `${num(n)} over ${d}`);

  /* Read-aloud: speech engines read symbols badly, so questions and buttons that contain them get spoken words.
     Ratios are written with spaces ("2 : 3"), so clock times like 15:05 are left alone. */
  const SYM = /[−×÷²³√°%€=]|\d\/\d|\d : \d|km\/h/;
  const euros = (e, c) => {
    const eu = `${e} euro${e === '1' ? '' : 's'}`, ct = `${+c} cent${+c === 1 ? '' : 's'}`;
    return +e && +c ? `${eu} ${ct}` : +e ? eu : ct;
  };
  M.sayText = s => s
    .replace(/km\/h/g, ' kilometres per hour')
    .replace(/(\d+) (\d+)\/(\d+)/g, (m, w, n, d) => `${w} and ${M.fracSay(+n, +d)}`)
    .replace(/(\d+)\/(\d+)/g, (m, n, d) => M.fracSay(+n, +d))
    .replace(/€(\d[\d,]*)\.(\d\d)/g, (m, e, c) => euros(e, c))
    .replace(/€(\d[\d,]*)/g, (m, e) => euros(e, '0'))
    .replace(/(\d) : (\d)/g, '$1 to $2')
    .replace(/²/g, ' squared').replace(/³/g, ' cubed').replace(/√/g, ' the square root of ')
    .replace(/×/g, ' times ').replace(/÷/g, ' divided by ').replace(/−/g, ' minus ').replace(/=/g, ' equals ')
    .replace(/°C/g, ' degrees Celsius').replace(/°/g, ' degrees').replace(/%/g, ' percent')
    .replace(/\s+/g, ' ').trim();
  M.polish = q => {
    if (!q.say && SYM.test(q.text)) q.say = M.sayText(q.text);
    q.opts = q.opts.map(o => (typeof o === 'string' && SYM.test(o) ? { t: o, say: M.sayText(o) } : o));
    return q;
  };
})(window.MBT);
