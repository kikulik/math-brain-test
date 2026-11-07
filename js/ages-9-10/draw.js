/* Math Brain Test, ages 9 to 10: pictures used only by this age (M.draw9) and helpers shared by its banks (M.h9). */
(function (M) {
  const D = M.draw, P = M.draw9 = {}, H = M.h9 = {};
  const { f1, rad } = D;
  const label = (x, y, s, anchor = 'middle', style = '') => D.text(x, y, s, { anchor, style });
  const INK_LABEL = 'fill:var(--ink);font-size:18px';
  const ROD = ['--rod-blue', '--rod-orange', '--rod-dgreen', '--rod-purple', '--rod-red', '--rod-yellow'];

  /* ---------- helpers shared by the 9-10 banks ---------- */
  /* A mixed number shown exactly as given (not simplified): 2 1/3 */
  H.mixedOpt = ([w, n, d]) => ({ h: `${w}&thinsp;${D.frac(`${n}/${d}`)}`, t: `${w} ${n}/${d}`, say: `${w} and ${M.fracSay(n, d)}` });
  H.money = c => M.euro(c / 100);   // the 9-10 banks keep money in cents

  /* ---------- pictures ---------- */

  /* A rectangle drawn to scale with its top and left sides labelled. */
  P.rect = (w, h, top, left) => {
    const k = Math.min(210 / w, 110 / h), W = w * k, Ht = h * k, x = 80, y = 30;
    const s = `<rect x="${x}" y="${y}" width="${f1(W)}" height="${f1(Ht)}" class="f-lgreen s-ink" style="fill-opacity:.45"/>` +
      label(x + W / 2, y - 15, top, 'middle', INK_LABEL) + label(x - 10, y + Ht / 2, left, 'end', INK_LABEL);
    return D.svg(f1(x + W + 20), f1(y + Ht + 14), s, `A rectangle, ${top} by ${left}`);
  };

  /* A w × h grid with a cw × ch corner cut off the top right. Shaded squares make the shape. */
  P.gridShape = (w, h, cw, ch) => {
    const u = Math.min(40, 280 / w, 170 / h), x0 = 10, y0 = 10;
    let s = '';
    for (let c = 0; c < w; c++) {
      for (let r = 0; r < h; r++) {
        const cut = c >= w - cw && r < ch;
        s += `<rect x="${f1(x0 + c * u)}" y="${f1(y0 + r * u)}" width="${f1(u)}" height="${f1(u)}" ` +
          (cut ? 'class="f-card" style="stroke:var(--ink-soft);stroke-width:1;stroke-dasharray:3 3;opacity:.5"/>' : 'class="f-blue s-ink thin" style="fill-opacity:.35"/>');
      }
    }
    return D.svg(f1(x0 * 2 + w * u), f1(y0 * 2 + h * u), s, 'A shape made of squares on a grid');
  };

  /* An angle: one arm points right, the other turns deg degrees anticlockwise. Right angles get a square mark. */
  P.angle = deg => {
    const reflex = deg > 180, cx = 150, cy = reflex ? 115 : 130, L = 115, R = 32;
    const p = (a, d) => `${f1(cx + d * Math.cos(rad(a)))} ${f1(cy - d * Math.sin(rad(a)))}`;
    const mark = deg === 90
      ? `<path d="M${cx + 22} ${cy} L${cx + 22} ${cy - 22} L${cx} ${cy - 22}" style="fill:none;stroke:var(--rod-red);stroke-width:3"/>`
      : `<path d="M${p(0, R)} A${R} ${R} 0 ${deg > 180 ? 1 : 0} 0 ${p(deg, R)}" style="fill:none;stroke:var(--rod-red);stroke-width:3"/>`;
    const arms = `<path d="M${p(0, L)} L${cx} ${cy} L${p(deg, L)}" class="s-ink thick" style="fill:none"/>`;
    return D.svg(300, reflex ? 235 : 145, mark + arms + `<circle cx="${cx}" cy="${cy}" r="5" class="f-ink"/>`, 'An angle');
  };

  /* A compass with a red arrow showing which way you are facing. */
  P.compass = dir => {
    const c = 90, a = rad({ north: -90, east: 0, south: 90, west: 180 }[dir]), at = (d, off = 0) => [c + d * Math.cos(a + off), c + d * Math.sin(a + off)];
    const letters = [['N', c, 14], ['E', 166, c], ['S', c, 166], ['W', 14, c]].map(([t, x, y]) => label(x, y, t, 'middle', INK_LABEL)).join('');
    const [tx, ty] = at(54), head = D.pts([at(54), at(38, 0.32), at(38, -0.32)]);
    return D.svg(180, 180, `<circle cx="${c}" cy="${c}" r="62" class="f-card s-ink"/>${letters}` +
      `<line x1="${c}" y1="${c}" x2="${f1(tx)}" y2="${f1(ty)}" style="stroke:var(--rod-red);stroke-width:6;stroke-linecap:round"/>` +
      `<polygon points="${head}" class="f-red"/><circle cx="${c}" cy="${c}" r="6" class="f-ink"/>`, `A compass. You are facing ${dir}`);
  };

  /* Growing patterns, shown as pattern 1, 2 and 3. */
  const CELLS = {
    L: k => [...M.range(0, k - 1).map(r => [0, r]), ...M.range(1, k - 1).map(c => [c, k - 1])],
    stair: k => M.range(0, k - 1).flatMap(c => M.range(k - 1 - c, k - 1).map(r => [c, r])),
    square: k => M.range(0, k - 1).flatMap(c => M.range(0, k - 1).map(r => [c, r])),
    rect: k => M.range(0, k).flatMap(c => M.range(0, k - 1).map(r => [c, r])),
    cross: k => [[k, k], ...M.range(1, k).flatMap(i => [[k - i, k], [k + i, k], [k, k - i], [k, k + i]])]
  };
  function stage(kind, k, x, base, u) {
    if (kind === 'sticks') {
      const top = base - u;
      let s = `<line x1="${x}" y1="${top}" x2="${x}" y2="${base}" class="s-ink thick"/>`;
      for (let i = 0; i < k; i++) {
        const a = x + i * u, b = a + u;
        s += `<line x1="${a}" y1="${top}" x2="${b}" y2="${top}" class="s-ink thick"/><line x1="${a}" y1="${base}" x2="${b}" y2="${base}" class="s-ink thick"/>` +
          `<line x1="${b}" y1="${top}" x2="${b}" y2="${base}" class="s-ink thick"/>`;
      }
      return { s, w: k * u };
    }
    const cells = CELLS[kind](k), rows = Math.max(...cells.map(([, r]) => r)) + 1, cols = Math.max(...cells.map(([c]) => c)) + 1;
    const s = cells.map(([c, r]) => `<rect x="${f1(x + c * u)}" y="${f1(base - (rows - r) * u)}" width="${u}" height="${u}" class="f-orange s-ink thin"/>`).join('');
    return { s, w: cols * u };
  }
  P.growing = kind => {
    const u = kind === 'sticks' ? 26 : kind === 'cross' ? 12 : 16, base = kind === 'cross' ? 100 : 80, gap = 18;
    let x = 10, s = '';
    for (let k = 1; k <= 3; k++) {
      const w = stage(kind, k, 0, base, u).w, slot = Math.max(w, 76);
      s += stage(kind, k, x + (slot - w) / 2, base, u).s + label(x + slot / 2, base + 20, `Pattern ${k}`);
      x += slot + gap;
    }
    return D.svg(f1(x - gap + 14), base + 34, s, 'Patterns 1, 2 and 3');
  };

  /* A function machine: input → [two steps] → output. Either end can be "?". */
  P.machine = (input, steps, output) => {
    const box = (x, v) => `<rect x="${x}" y="38" width="62" height="44" rx="10" class="f-card s-ink"/>` +
      label(x + 31, 60, v, 'middle', v === '?' ? 'fill:var(--accent);font-size:22px;font-weight:800' : 'fill:var(--ink);font-size:20px');
    const arrow = x => `<path d="M${x} 60 h22 m-8 -7 l8 7 l-8 7" class="s-ink" style="fill:none"/>`;
    const machine = '<rect x="104" y="14" width="112" height="92" rx="12" class="f-purple s-ink" style="fill-opacity:.25"/>' +
      steps.map((t, i) => label(160, 44 + i * 32, t, 'middle', INK_LABEL)).join('');
    return D.svg(320, 120, box(8, input) + arrow(74) + machine + arrow(222) + box(250, output), 'A number machine');
  };

  /* A bar chart. Values are whole steps, so every bar ends on a grid line. */
  P.bars = (names, values, step) => {
    const top = Math.ceil(Math.max(...values) / step) * step + step, x0 = 44, y0 = 180, H = 150, bw = 270 / names.length;
    let s = '';
    for (let v = 0; v <= top; v += step) {
      const y = f1(y0 - v / top * H);
      s += `<line x1="${x0}" y1="${y}" x2="${x0 + 274}" y2="${y}" style="stroke:var(--grid);stroke-width:1.5"/>` + label(x0 - 8, y, v, 'end');
    }
    s += names.map((n, i) => {
      const h = values[i] / top * H, x = x0 + 8 + i * bw;
      return `<rect x="${f1(x)}" y="${f1(y0 - h)}" width="${f1(bw - 16)}" height="${f1(h)}" class="s-ink thin" style="fill:var(${ROD[i]})"/>` +
        label(x + (bw - 16) / 2, y0 + 16, n);
    }).join('');
    s += `<line x1="${x0}" y1="${y0}" x2="${x0 + 274}" y2="${y0}" class="s-ink"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - H - 6}" class="s-ink"/>`;
    return D.svg(328, 205, s, 'A bar chart');
  };

  /* A 3 × 3 grid of numbers; the last cell is "?". */
  P.grid3 = rows => {
    const cw = 76, ch = 50, x0 = 8, y0 = 8;
    const s = rows.flatMap((row, r) => row.map((v, c) => {
      const x = x0 + c * cw, y = y0 + r * ch, q = v === '?';
      return `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" class="${q ? 'f-card' : 'f-unit'} s-ink"/>` +
        label(x + cw / 2, y + ch / 2, v, 'middle', q ? 'fill:var(--accent);font-size:24px;font-weight:800' : 'fill:var(--ink);font-size:21px');
    })).join('');
    return D.svg(x0 * 2 + cw * 3, y0 * 2 + ch * 3, s, 'A grid of numbers with one missing');
  };

  /* 3D shapes drawn see-through: hidden edges dashed. */
  const DASH = 'style="fill:none;stroke:var(--ink-soft);stroke-width:2;stroke-dasharray:5 4"';
  const poly = (pts, cls, extra = '') => `<polygon points="${D.pts(pts)}" class="${cls}" ${extra}/>`;
  const edge = (p, q, dashed) => D.line(p[0], p[1], q[0], q[1], dashed ? DASH : 'class="s-ink"');
  /* Back corners hidden behind the solid: the chain of the back face that faces the front, between the two
     corners where the outline turns. Every edge touching a hidden corner is dashed. */
  function hiddenBack(front, dx, dy) {
    const n = front.length, t = front.map(([x, y]) => dx * y - dy * x), d = front.map(([x, y]) => dx * x + dy * y);
    const lo = t.indexOf(Math.min(...t)), hi = t.indexOf(Math.max(...t));
    const chain = (a, b) => { const out = []; for (let i = (a + 1) % n; i !== b; i = (i + 1) % n) out.push(i); return out; };
    const c1 = chain(lo, hi), c2 = chain(hi, lo), avg = c => c.reduce((s, i) => s + d[i], 0) / (c.length || 1);
    if (!c1.length) return c2;
    if (!c2.length) return c1;
    return avg(c1) < avg(c2) ? c1 : c2;
  }
  function prism(front, dx, dy) {
    const back = front.map(([x, y]) => [x + dx, y + dy]), n = back.length, hidden = hiddenBack(front, dx, dy);
    const backEdges = back.map((p, i) => edge(p, back[(i + 1) % n], hidden.includes(i) || hidden.includes((i + 1) % n))).join('');
    const links = front.map((p, i) => edge(p, back[i], hidden.includes(i))).join('');
    return backEdges + links + poly(front, 'f-green s-ink', 'style="fill-opacity:.35"');
  }
  function pyramid(base, apex, hidden) {
    const n = base.length;
    return base.map((p, i) => edge(p, base[(i + 1) % n], hidden.includes(i) || hidden.includes((i + 1) % n))).join('') +
      base.map((p, i) => edge(p, apex, hidden.includes(i))).join('');
  }
  const SOLIDS = {
    cube: () => prism([[60, 80], [150, 80], [150, 170], [60, 170]], 50, -40),
    cuboid: () => prism([[40, 90], [190, 90], [190, 165], [40, 165]], 55, -40),
    'triangular prism': () => prism([[50, 165], [125, 165], [87, 100]], 120, -45),
    'pentagonal prism': () => prism([[80, 70], [125, 103], [108, 155], [52, 155], [35, 103]], 120, -40),
    'square-based pyramid': () => pyramid([[50, 160], [170, 160], [210, 125], [90, 125]], [130, 25], [3]),
    'triangular-based pyramid': () => pyramid([[45, 165], [185, 165], [140, 120]], [115, 30], [2])
  };
  P.solid = name => D.svg(270, 190, SOLIDS[name](), `A ${name}`);

  /* Flat shapes for "lines of symmetry". */
  const FLAT = {
    square: () => poly([[60, 30], [170, 30], [170, 140], [60, 140]], 'f-purple s-ink thick'),
    rectangle: () => poly([[25, 45], [205, 45], [205, 135], [25, 135]], 'f-purple s-ink thick'),
    'equilateral triangle': () => `<polygon points="${D.polyPts(3, 115, 100, 72, -90)}" class="f-purple s-ink thick"/>`,
    'isosceles triangle': () => poly([[115, 15], [160, 160], [70, 160]], 'f-purple s-ink thick'),
    'regular pentagon': () => `<polygon points="${D.polyPts(5, 115, 92, 72, -90)}" class="f-purple s-ink thick"/>`,
    'regular hexagon': () => `<polygon points="${D.polyPts(6, 115, 88, 72, 0)}" class="f-purple s-ink thick"/>`,
    'regular octagon': () => `<polygon points="${D.polyPts(8, 115, 88, 74, 22.5)}" class="f-purple s-ink thick"/>`,
    kite: () => poly([[115, 12], [165, 62], [115, 165], [65, 62]], 'f-purple s-ink thick'),
    parallelogram: () => poly([[20, 140], [70, 40], [210, 40], [160, 140]], 'f-purple s-ink thick'),
    rhombus: () => poly([[115, 12], [180, 88], [115, 164], [50, 88]], 'f-purple s-ink thick')
  };
  P.flat = name => D.svg(230, 176, FLAT[name](), `A ${name}`);

  /* Shape sums like ▲ + ▲ = 16, one equation per line. lines: [[item, ...], ...]; items are shape names or text. */
  P.symbols = lines => `<div aria-hidden="true" style="display:grid;gap:10px;justify-items:center;font:700 clamp(1.4rem,6vw,1.9rem)/1 var(--font-body)">${
    lines.map(l => `<div style="display:flex;align-items:center;gap:.35em">${l.map(it => (['circle', 'triangle', 'square', 'star'].includes(it)
      ? D.icon(it, 40) : `<span>${it}</span>`)).join('')}</div>`).join('')}</div>`;
})(window.MBT);
