/* Math Brain Test, ages 9 to 10: numbers & fractions (place value, rounding, negatives, Roman numerals, fractions, decimals). */
(function (M) {
  const D = M.draw, H = M.h9, N = M.fmtNum, SKILL = 'numbers9';
  const PLACE = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands'];
  const PLACE_OF = { 10: 'tens', 100: 'hundreds', 1000: 'thousands' };
  const box = D.box;
  const distinctDigits = (r, len) => M.shuffle(r, M.range(1, 9)).slice(0, len);

  M.add({
    id: 'a9-digit-value', skill: SKILL, variants: M.combos(M.range(1, 5), M.range(0, 13)),
    level: ([p]) => (p <= 2 ? 1 : p === 3 ? 2 : 3),
    make: ([p], r) => {
      const ds = distinctDigits(r, Math.max(p + 1, M.int(r, 4, 6))), n = Number(ds.join('')), d = ds[ds.length - 1 - p], ans = d * 10 ** p;
      return {
        text: `What is the value of the ${d} in ${N(n)}?`, short: `The ${d} in ${N(n)}`,
        ...M.valOpts(r, ans, [d * 10 ** (p + 1), d * 10 ** (p - 1), d, d * 10 ** (p + 2)]),
        why: `The ${d} is in the ${PLACE[p]} place, so it is worth ${N(ans)}.`
      };
    }
  });

  M.add({
    id: 'a9-round', skill: SKILL, variants: M.combos([10, 100, 1000], M.range(0, 24)),
    level: ([to]) => ({ 10: 1, 100: 2, 1000: 3 })[to],
    make: ([to], r) => {
      let n = to === 10 ? M.int(r, 101, 9999) : to === 100 ? M.int(r, 1001, 9999) : M.int(r, 1001, 99999);
      while (n % to === 0 || n % to === to / 2) n++;
      const ans = Math.round(n / to) * to, down = Math.floor(n / to) * to, digit = Math.floor((n % to) / (to / 10));
      const tenTimes = Math.round(n / (to * 10)) * to * 10, tenth = Math.round(n / (to / 10)) * (to / 10);
      return {
        text: `Round ${N(n)} to the nearest ${N(to)}.`, short: `${N(n)} to the nearest ${N(to)}`,
        ...M.valOpts(r, ans, [ans === down ? down + to : down, tenTimes, to > 10 ? tenth : ans + 2 * to, ans - to, ans + to], N, to),
        why: `Look at the digit just after the ${PLACE_OF[to]} place: it is ${digit}. ${digit >= 5 ? '5 or more rounds up' : 'Less than 5 rounds down'}, so the answer is ${N(ans)}.`
      };
    }
  });

  M.add({
    id: 'a9-compare', skill: SKILL, variants: M.combos(['biggest', 'smallest'], M.range(0, 23)),
    level: ([, s]) => 1 + (s % 3),
    make: ([which, s], r) => {
      const ds = distinctDigits(r, 4 + (s % 3)), set = new Set([Number(ds.join(''))]);
      while (set.size < 4) {
        const i = M.int(r, 0, ds.length - 2), sw = ds.slice();
        [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
        set.add(Number(sw.join('')));
      }
      const nums = [...set], ans = which === 'biggest' ? Math.max(...nums) : Math.min(...nums);
      return {
        text: `Which number is the ${which}?`, short: `The ${which} number`,
        ...M.textOpts(r, N(ans), nums.filter(x => x !== ans).map(N)),
        why: `Compare digit by digit from the left. The first place where the numbers are different decides: ${N(ans)} is the ${which}.`
      };
    }
  });

  const degC = v => `${N(v)} °C`;
  const sayTemp = s => s.replace(/−(\d+) °C/g, 'minus $1 degrees').replace(/ °C/g, ' degrees');
  const TEMP = {
    warmer(r) {
      const s = -M.int(r, 2, 9), rise = M.int(r, 3, 12), ans = s + rise;
      return {
        text: `It is ${degC(s)} in the morning. By lunch it is ${rise} degrees warmer. What is the temperature at lunch?`, ans, fmt: degC,
        cands: [-ans, -s + rise, ans + 1, ans - 1, s - rise],
        why: ans > 0 ? `From ${degC(s)} it takes ${-s} degrees to reach 0. ${ans} more makes ${degC(ans)}.` : `Count up ${rise} from ${degC(s)} to reach ${degC(ans)}.`
      };
    },
    colder(r) {
      const s = M.int(r, 1, 8), drop = M.int(r, s + 1, s + 9), ans = s - drop;
      return {
        text: `It is ${degC(s)} in the evening. In the night it gets ${drop} degrees colder. What is the temperature in the night?`, ans, fmt: degC,
        cands: [-ans, ans + 1, ans - 1, s + drop],
        why: `It takes ${s} degrees to drop to 0. ${drop - s} more takes it down to ${degC(ans)}.`
      };
    },
    gap(r) {
      const a = -M.int(r, 1, 9), b = M.int(r, 1, 12), ans = b - a;
      return {
        text: `At night it was ${degC(a)}. In the day it was ${degC(b)}. How many degrees warmer was the day?`, ans, fmt: v => `${N(v)} degrees`,
        cands: [Math.abs(b + a), ans + 1, ans - 1, ans + 2],
        why: `From ${degC(a)} up to 0 is ${-a} degrees, and from 0 up to ${degC(b)} is ${b} more: ${-a} + ${b} = ${ans}.`
      };
    }
  };
  M.add({
    id: 'a9-temperature', skill: SKILL, variants: M.combos(Object.keys(TEMP), M.range(0, 19)),
    level: ([k]) => (k === 'gap' ? 3 : 2),
    make: ([k], r) => {
      const t = TEMP[k](r), o = M.valOpts(r, t.ans, t.cands, t.fmt);
      return {
        text: t.text, say: sayTemp(t.text), short: 'Temperature', long: true, why: t.why,
        opts: o.opts.map(x => ({ t: x, say: sayTemp(x) })), a: 0
      };
    }
  });

  const RN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  const VAL = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const parts = n => RN.flatMap(([v, t]) => { const k = Math.floor(n / v); n -= k * v; return k ? [[t.repeat(k), v * k]] : []; });
  const roman = n => parts(n).map(([t]) => t).join('');
  const spaced = s => s.split('').join(' ');
  const simpleRoman = n => [[1000, 'M'], [500, 'D'], [100, 'C'], [50, 'L'], [10, 'X'], [5, 'V'], [1, 'I']]
    .map(([v, t]) => { const k = Math.floor(n / v); n -= k * v; return t.repeat(k); }).join('');
  M.add({
    id: 'a9-roman', skill: SKILL,
    variants: [...M.range(12, 99, 3).map(n => ['read', n]), ...M.range(14, 98, 4).map(n => ['write', n]),
      ...[124, 149, 190, 246, 309, 444, 490, 575, 640, 819, 904, 990].map(n => ['read', n])],
    level: ([mode, n]) => Math.min(3, (n >= 100 ? 3 : /IV|IX|XL|XC/.test(roman(n)) ? 2 : 1) + (mode === 'write' ? 1 : 0)),
    make: ([mode, n], r) => {
      const R = roman(n), why = `${parts(n).map(([t, v]) => `${t} = ${v}`).join(', ')}. So ${R} = ${n}.`;
      if (mode === 'read') {
        const plain = [...R].reduce((a, c) => a + VAL[c], 0);
        return {
          text: `What number is ${R}?`, say: `What number is the Roman numeral ${spaced(R)}?`, short: R,
          ...M.numOpts(r, n, [plain, n + 10, n - 10, n + 1, n - 1, n + 5]), why
        };
      }
      const wrong = [roman(n + 1), roman(n - 1), roman(n + 10), simpleRoman(n), R.replace('IX', 'XI').replace('IV', 'VI')];
      const o = M.textOpts(r, R, wrong);
      return {
        text: `How do you write ${n} in Roman numerals?`, short: `${n} in Roman numerals`, why,
        opts: o.opts.map(t => ({ t, say: spaced(t) })), a: 0
      };
    }
  });

  const FRACS = [[1, 2], [1, 3], [1, 4], [1, 5], [1, 10], [2, 3], [3, 4], [2, 5], [3, 5], [3, 10], [7, 10], [5, 6]];
  M.add({
    id: 'a9-fraction-of', skill: SKILL, variants: M.combos(M.range(0, FRACS.length - 1), M.range(2, 10)),
    level: ([i, k]) => { const [n, d] = FRACS[i]; return n === 1 ? (k <= 5 ? 1 : 2) : d <= 5 ? 2 : 3; },
    make: ([i, k], r) => {
      const [n, d] = FRACS[i], W = d * k, ans = n * k, f = `${n}/${d}`, said = M.fracSay(n, d);
      return {
        text: `What is ${f} of ${W}?`, say: `What is ${said} of ${W}?`, short: `${f} of ${W}`,
        vis: D.eq(`${D.frac(f)}&nbsp;of ${W} = ${box}`, `${said} of ${W}`),
        ...M.numOpts(r, ans, [k, W - ans, ans + k, ans - k, ans * 2, k + 1, k - 1, d].filter(c => c > 0)),
        why: n === 1 ? `Share ${W} into ${d} equal parts: ${W} ÷ ${d} = ${k}.` : `${W} ÷ ${d} = ${k}, so 1/${d} is ${k}. Then ${f} is ${n} × ${k} = ${ans}.`
      };
    }
  });

  const BASE = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5]];
  const sameValue = ([a, b], [c, d]) => a * d === b * c;
  M.add({
    id: 'a9-equivalent', skill: SKILL, variants: M.combos(M.range(0, BASE.length - 1), M.range(2, 5)),
    level: ([, k]) => (k === 2 ? 1 : k === 3 ? 2 : 3),
    make: ([i, k], r) => {
      const [n, d] = BASE[i], key = `${n * k}/${d * k}`;
      const wrong = [[n, d * k], [n + k, d + k], [n * k + 1, d * k], [n * k, d * k - 1], [n * k - 1, d * k], [n + 1, d * k]]
        .filter(([a, b]) => a >= 1 && a < b && !sameValue([a, b], [n, d])).map(([a, b]) => `${a}/${b}`);
      const o = M.textOpts(r, key, wrong);
      return {
        text: `Which fraction is the same as ${n}/${d}?`, say: `Which fraction is the same as ${M.fracSay(n, d)}?`, short: `Same as ${n}/${d}`,
        vis: D.eq(`${D.frac(`${n}/${d}`)} = ${box}`, `${M.fracSay(n, d)} equals what?`),
        opts: o.opts.map(f => M.draw.fracOpt(f)), a: 0,
        why: `Multiply the top and the bottom by ${k}: ${n} × ${k} = ${n * k} and ${d} × ${k} = ${d * k}.`
      };
    }
  });

  M.add({
    id: 'a9-missing-numerator', skill: SKILL, variants: M.combos(M.range(0, BASE.length - 1), M.range(2, 6)),
    level: ([, k]) => (k <= 4 ? 2 : 3),
    make: ([i, k], r) => {
      const [n, d] = BASE[i], big = d * k, ans = n * k;
      return {
        text: `Fill in the missing number: ${n}/${d} = ?/${big}`, short: `${n}/${d} = ?/${big}`,
        say: `${M.fracSay(n, d)} is the same as how many ${M.fracPart(big, true)}?`,
        vis: D.eq(`${D.frac(`${n}/${d}`)} = ${D.frac(`?/${big}`)}`, `${M.fracSay(n, d)} equals how many ${M.fracPart(big, true)}?`),
        ...M.numOpts(r, ans, [n + k, ans + 1, ans - 1, big - ans, n * (k + 1), ans + n]),
        why: `${d} × ${k} = ${big}, so multiply the top by ${k} too: ${n} × ${k} = ${ans}.`
      };
    }
  });

  M.add({
    id: 'a9-compare-fractions', skill: SKILL, variants: M.combos(['bottom', 'top'], ['biggest', 'smallest'], M.range(0, 9)),
    level: ([same, which]) => (same === 'bottom' ? 1 : which === 'biggest' ? 2 : 3),
    make: ([same, which], r) => {
      let fr, why;
      if (same === 'bottom') {
        const d = M.int(r, 5, 12), tops = M.shuffle(r, M.range(1, d - 1)).slice(0, 4);
        fr = tops.map(t => [t, d]);
        why = `They are all ${M.fracPart(d, true)}, so the one with the ${which === 'biggest' ? 'most' : 'fewest'} parts is the ${which}.`;
      } else {
        const n = M.int(r, 1, 3), bottoms = M.shuffle(r, M.range(n + 1, 12)).slice(0, 4);
        fr = bottoms.map(b => [n, b]);
        why = `They all have ${n} part${n > 1 ? 's' : ''}. The smaller the bottom number, the bigger each part.`;
      }
      const sorted = fr.slice().sort((x, y) => x[0] / x[1] - y[0] / y[1]), str = ([a, b]) => `${a}/${b}`;
      const ans = which === 'biggest' ? sorted[3] : sorted[0];
      const o = M.textOpts(r, str(ans), fr.filter(x => x !== ans).map(str));
      return { text: `Which fraction is the ${which}?`, short: `The ${which} fraction`, opts: o.opts.map(f => M.draw.fracOpt(f)), a: 0, why: `${why} The answer is ${str(ans)}.` };
    }
  });

  const MIXED = M.combos([1, 2, 3], [2, 3, 4, 5], M.range(1, 4)).filter(([, d, n]) => n < d && M.gcd(n, d) === 1).map(([w, d, n]) => [w, n, d]);
  function toMixed([w, n, d], r) {
    const top = w * d + n, imp = `${top}/${d}`;
    const wrong = [[w + 1, n, d], [w + 2, n, d], [w - 1, n, d], [w, d - n, d], [w + 3, n, d]].filter(([a, b]) => a >= 1 && !(a === w && b === n));
    return {
      text: `Which mixed number is the same as ${imp}?`, say: `Which mixed number is the same as ${M.fracSay(top, d)}?`, short: `${imp} as a mixed number`,
      vis: D.eq(D.frac(imp), M.fracSay(top, d)), opts: [[w, n, d], ...M.shuffle(r, wrong).slice(0, 3)].map(H.mixedOpt), a: 0,
      why: `${top} ÷ ${d} = ${w} remainder ${n}, so ${imp} is ${w} whole${w > 1 ? 's' : ''} and ${n}/${d}.`
    };
  }
  function toImproper([w, n, d], r) {
    const top = w * d + n, imp = `${top}/${d}`, mix = `${w} ${n}/${d}`;
    const o = M.textOpts(r, imp, [w * d - n, top + d, w + n, top + 1, top - 1].filter(t => t > 0 && t !== top).map(t => `${t}/${d}`));
    return {
      text: `Which fraction is the same as ${mix}?`, say: `Which fraction is the same as ${w} and ${M.fracSay(n, d)}?`, short: `${mix} as a fraction`,
      vis: D.eq(`${w}&thinsp;${D.frac(`${n}/${d}`)}`, `${w} and ${M.fracSay(n, d)}`), opts: o.opts.map(f => M.draw.fracOpt(f)), a: 0,
      why: `${w} whole${w > 1 ? 's are' : ' is'} ${w * d}/${d}. Add ${n}/${d} to get ${imp}.`
    };
  }
  M.add({
    id: 'a9-mixed', skill: SKILL, variants: M.combos(['to-mixed', 'to-improper'], M.range(0, MIXED.length - 1)),
    level: ([mode, i]) => (mode === 'to-mixed' || MIXED[i][0] === 1 ? 2 : 3),
    make: ([mode, i], r) => (mode === 'to-mixed' ? toMixed : toImproper)(MIXED[i], r)
  });

  M.add({
    id: 'a9-decimal-compare', skill: SKILL, variants: M.combos(['biggest', 'smallest'], M.range(0, 19)),
    level: ([, s]) => (s < 10 ? 2 : 3),
    make: ([which, s], r) => {
      const [x, y] = M.shuffle(r, M.range(1, 9)), w = s < 10 ? 0 : M.int(r, 1, 9);
      const vals = [x / 10, (10 * x + y) / 100, (10 * y + x) / 100, y / 100].map(v => w + v);
      const ans = which === 'biggest' ? Math.max(...vals) : Math.min(...vals);
      return {
        text: `Which decimal is the ${which}?`, short: `The ${which} decimal`,
        ...M.textOpts(r, N(ans), vals.filter(v => v !== ans).map(N)),
        why: `Compare the tenths first, then the hundredths. ${N(ans)} is the ${which}.`
      };
    }
  });

  M.add({
    id: 'a9-decimal-shift', skill: SKILL, variants: M.combos(['×', '÷'], [10, 100], M.range(0, 11)),
    level: ([, f]) => (f === 10 ? 2 : 3),
    make: ([op, f], r) => {
      const base = f === 10 ? M.int(r, 12, 98) : M.int(r, 102, 999), n = base % 10 === 0 ? base + 1 : base;
      const x = op === '×' ? n / f : n, ans = op === '×' ? n : n / f, expr = `${N(x)} ${op} ${f}`;
      return {
        text: `What is ${expr}?`, say: `What is ${M.sayText(expr)}?`, short: expr, vis: D.eq(`${expr} = ${box}`, M.sayText(expr)),
        ...M.valOpts(r, ans, [ans * 10, ans / 10, op === '×' ? x / f : x * f, ans * 100, ans / 100]),
        why: `${op === '×' ? 'Multiplying' : 'Dividing'} by ${f} moves every digit ${f === 10 ? 'one place' : 'two places'} to the ${op === '×' ? 'left' : 'right'}, so the answer is ${N(ans)}.`
      };
    }
  });
})(window.MBT);
