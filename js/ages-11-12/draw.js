/* Math Brain Test, ages 11 to 12: pictures (M.draw11) and helpers shared by this age's bank files (M.h11). */
(function (M) {
  const D = M.draw, G = M.draw11 = {}, H = M.h11 = {};
  const { f1, rad } = D;
  const INK = 'fill:var(--ink)', KEY = 'fill:var(--accent);font-weight:800';
  const tint = (c, pct = 22) => `style="fill:color-mix(in srgb, var(${c}) ${pct}%, var(--card))"`;

  /* ---------- maths ---------- */
  H.isPrime = n => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
  H.thin = (list, k) => list.filter((_, i) => i % k === 0);   // keep every k-th variant so one template doesn't dominate
  H.cap = (list, n) => H.thin(list, Math.max(1, Math.floor(list.length / n)));
  H.nearest = (r, list, x, k) => M.shuffle(r, [...list].sort((a, b) => Math.abs(a - x) - Math.abs(b - x)).slice(0, k + 2)).slice(0, k);

  /* ---------- fractions ---------- */
  /* [n, d] → simplest form as text: "3/4", "1 1/2" or "2" */
  H.fstr = ([n, d]) => {
    const [a, b] = M.simp(n, d);
    if (b === 1) return String(a);
    return a > b ? `${Math.floor(a / b)} ${a % b}/${b}` : `${a}/${b}`;
  };
  /* An answer button for a fraction: stacked on screen, spoken as "3 quarters" */
  H.fopt = f => {
    const [a, b] = M.simp(f[0], f[1]), t = H.fstr([a, b]);
    if (b === 1) return { t };
    const w = Math.floor(a / b);
    return { t, h: (w ? `${w} ` : '') + D.frac(`${a % b}/${b}`), say: (w ? `${w} and ` : '') + M.fracSay(a % b, b) };
  };
  /* Like M.numOpts for fractions: distractors are simplified and never equal in value to the answer or each other. */
  H.fracOpts = (r, ans, cands) => {
    const a = M.simp(ans[0], ans[1]), vals = [a[0] / a[1]], out = [];
    const take = c => {
      if (out.length >= 3 || !c || c[0] <= 0 || c[1] <= 0 || !Number.isInteger(c[0]) || !Number.isInteger(c[1])) return;
      const s = M.simp(c[0], c[1]);
      if (vals.some(v => Math.abs(v - s[0] / s[1]) < 1e-9)) return;
      vals.push(s[0] / s[1]);
      out.push(s);
    };
    M.shuffle(r, cands).forEach(take);
    for (let k = 1; out.length < 3; k++) { take([a[0] + k, a[1]]); take([a[0], a[1] + k]); }
    return { opts: [a, ...out].map(H.fopt), a: 0 };
  };

  /* Big equations in this age are a little smaller so long expressions fit on a phone. */
  H.eq = (html, label, size = 'clamp(1.8rem,7.5vw,2.6rem)') => D.eq(html, label, size);

  /* ---------- SVG building blocks ---------- */
  const txt = (x, y, s, style = INK, size = 15) => D.text(x, y, s, { style: `${style};font-size:${size}px` });
  const lab = (x, y, s, size = 15) => (s ? txt(x, y, s, s === 'x' || s.includes('?') ? KEY : INK, size) : '');
  const line = (x1, y1, x2, y2, cls = 's-ink') => D.line(x1, y1, x2, y2, `class="${cls}"`);
  const dashed = (a, b) => D.line(a[0], a[1], b[0], b[1], 'class="s-ink thin" style="stroke-dasharray:6 5"');
  const rightAngle = (x, y) => `<path d="M${f1(x)} ${f1(y - 11)} h11 v11" class="s-ink thin" fill="none"/>`;
  const P = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))];
  const arc = (cx, cy, r, a0, a1) => {
    const [x0, y0] = P(cx, cy, r, a0), [x1, y1] = P(cx, cy, r, a1);
    return `<path d="M${f1(x0)} ${f1(y0)} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${f1(x1)} ${f1(y1)}" class="s-ink thin" fill="none"/>`;
  };
  const unit = (to, from) => { const dx = to[0] - from[0], dy = to[1] - from[1], l = Math.hypot(dx, dy); return [dx / l, dy / l]; };
  const angOf = v => (Math.atan2(-v[1], v[0]) * 180) / Math.PI;
  const dot = (x, y) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="4" class="f-ink"/>`;
  const cell = (x, y, w, h, v, c) =>
    `<rect x="${f1(x)}" y="${f1(y)}" width="${w}" height="${h}" class="s-ink" ${tint(c)}/>` + lab(x + w / 2, y + h / 2, String(v), 17);

  /* ---------- angles ---------- */
  /* parts: [[degrees, label], ...] drawn to size, either on a straight line (sum 180) or around a point (sum 360). */
  G.angles = (parts, around) => {
    const cx = around ? 130 : 170, cy = around ? 120 : 135, len = around ? 100 : 128;
    let s = around ? '' : line(20, cy, 320, cy), a = around ? 15 : 0;
    parts.forEach(([deg, label], i) => {
      s += arc(cx, cy, 24 + (i % 2) * 7, a, a + deg);
      const [lx, ly] = P(cx, cy, deg < 55 ? 64 : 54, a + deg / 2);
      s += lab(lx, ly, label);
      a += deg;
      if (around || i < parts.length - 1) { const [x, y] = P(cx, cy, len, a); s += line(cx, cy, x, y); }
    });
    s += dot(cx, cy);
    return around ? D.svg(260, 240, s, 'Angles around a point') : D.svg(340, 150, s, 'Angles on a straight line');
  };
  /* Two straight lines crossing. labels go round the four angles, starting with the one between 0° and a. */
  G.cross = (a, labels) => {
    const cx = 170, cy = 95, sec = [[0, a], [a, 180], [180, 180 + a], [180 + a, 360]];
    let s = line(...P(cx, cy, 150, 0), ...P(cx, cy, 150, 180)) + line(...P(cx, cy, 88, a), ...P(cx, cy, 88, a + 180));
    sec.forEach(([a0, a1], i) => {
      if (!labels[i]) return;
      s += arc(cx, cy, 22, a0, a1);
      const [lx, ly] = P(cx, cy, 46, (a0 + a1) / 2);
      s += lab(lx, ly, labels[i]);
    });
    return D.svg(340, 190, s + dot(cx, cy), 'Two straight lines crossing');
  };
  /* Triangle drawn to the given angles A (bottom left) and B (bottom right). iso marks the two equal sides. */
  G.triangle = (A, B, labels, iso) => {
    const C = 180 - A - B, side = Math.sin(rad(B)) / Math.sin(rad(C));
    const raw = [[0, 0], [1, 0], [side * Math.cos(rad(A)), side * Math.sin(rad(A))]];
    const xs = raw.map(p => p[0]), minX = Math.min(...xs), maxX = Math.max(...xs), maxY = raw[2][1];
    const sc = Math.min(250 / (maxX - minX), 175 / maxY);
    const pts = raw.map(([x, y]) => [40 + (x - minX) * sc, 22 + (maxY - y) * sc]);
    let s = `<polygon points="${D.pts(pts)}" class="s-ink" ${tint('--rod-dgreen')}/>`;
    pts.forEach((p, i) => {
      if (!labels[i]) return;
      const u = unit(pts[(i + 1) % 3], p), v = unit(pts[(i + 2) % 3], p), deg = [A, B, C][i];
      let a0 = angOf(u), span = (angOf(v) - a0 + 720) % 360;
      if (span > 180) { a0 = angOf(v); span = 360 - span; }
      const bis = unit([u[0] + v[0], u[1] + v[1]], [0, 0]), d = Math.min(58, 15 / Math.sin(rad(deg / 2)) + 9);
      s += arc(p[0], p[1], 16, a0, a0 + span) + lab(p[0] + bis[0] * d, p[1] + bis[1] * d, labels[i]);
    });
    if (iso) [[pts[0], pts[2]], [pts[1], pts[2]]].forEach(([a, b]) => {
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], n = unit([a[1], -a[0]], [b[1], -b[0]]);
      s += line(m[0] - n[0] * 8, m[1] - n[1] * 8, m[0] + n[0] * 8, m[1] + n[1] * 8);
    });
    return D.svg(f1((maxX - minX) * sc + 80), f1(maxY * sc + 44), s, 'A triangle with angles marked');
  };
  /* A four-sided shape with a label in each corner (not to scale). */
  G.quad = labels => {
    const pts = [[50, 172], [300, 182], [262, 42], [96, 58]], c = [177, 113];
    let s = `<polygon points="${D.pts(pts)}" class="s-ink" ${tint('--rod-blue')}/>`;
    pts.forEach((p, i) => { const u = unit(c, p); s += lab(p[0] + u[0] * 40, p[1] + u[1] * 34, labels[i]); });
    s += txt(175, 208, 'Not drawn to scale', 'fill:var(--ink-soft)', 13);
    return D.svg(340, 220, s, 'A quadrilateral with its angles marked');
  };
  G.regular = n => D.svg(220, 196, `<polygon points="${D.polyPts(n, 110, n % 2 ? 106 : 98, 84, -90)}" class="s-ink thick" ${tint('--rod-purple', 30)}/>`, 'A regular shape');

  /* ---------- lengths and areas (drawn to scale) ---------- */
  G.triArea = (b, h, u) => {
    const sc = Math.min(230 / b, 130 / h), B = b * sc, Ht = h * sc, x0 = 50, y0 = Ht + 24, apex = [x0 + B * 0.62, y0 - Ht];
    let s = `<polygon points="${D.pts([[x0, y0], [x0 + B, y0], apex])}" class="s-ink" ${tint('--rod-orange')}/>`;
    s += dashed(apex, [apex[0], y0]) + rightAngle(apex[0], y0);
    s += lab(x0 + B / 2, y0 + 16, `${b} ${u}`) + lab(apex[0] - 30, y0 - Ht / 2, `${h} ${u}`);
    return D.svg(f1(B + 100), f1(y0 + 32), s, 'A triangle with its base and height marked');
  };
  G.para = (b, h, slant, u) => {
    const offU = Math.sqrt(slant * slant - h * h), sc = Math.min(220 / (b + offU), 130 / h);
    const B = b * sc, Ht = h * sc, off = offU * sc, x0 = 62, y0 = Ht + 22;
    const pts = [[x0, y0], [x0 + B, y0], [x0 + B + off, y0 - Ht], [x0 + off, y0 - Ht]];
    let s = `<polygon points="${D.pts(pts)}" class="s-ink" ${tint('--rod-yellow', 30)}/>`;
    s += dashed([x0 + off, y0 - Ht], [x0 + off, y0]) + rightAngle(x0 + off, y0);
    s += lab(x0 + B / 2, y0 + 16, `${b} ${u}`) + lab(x0 + off + 28, y0 - Ht / 2, `${h} ${u}`) + lab(x0 + off / 2 - 30, y0 - Ht / 2, `${slant} ${u}`);
    return D.svg(f1(x0 + B + off + 30), f1(y0 + 32), s, 'A parallelogram with its base, height and slanted side marked');
  };
  G.rect = (w, h, bottom, left) => {
    const sc = Math.min(220 / w, 130 / h), W = w * sc, Ht = h * sc, x0 = 62, y0 = 14;
    const s = `<rect x="${x0}" y="${y0}" width="${f1(W)}" height="${f1(Ht)}" class="s-ink" ${tint('--rod-blue')}/>` +
      lab(x0 + W / 2, y0 + Ht + 16, bottom) + lab(x0 - 32, y0 + Ht / 2, left);
    return D.svg(f1(W + 100), f1(Ht + 44), s, 'A rectangle');
  };
  /* W × H rectangle with a cw × ch piece cut from the top right. show: which edges get which label. */
  G.lshape = (W, Hh, cw, ch, show) => {
    const sc = Math.min(225 / W, 150 / Hh), X = v => 54 + v * sc, Y = v => 22 + v * sc;
    const pts = [[0, 0], [W - cw, 0], [W - cw, ch], [W, ch], [W, Hh], [0, Hh]].map(([x, y]) => [X(x), Y(y)]);
    const at = { top: [X((W - cw) / 2), Y(0) - 13], left: [X(0) - 30, Y(Hh / 2)], bottom: [X(W / 2), Y(Hh) + 15],
      right: [X(W) + 28, Y((ch + Hh) / 2)], innerH: [X(W - cw / 2), Y(ch) - 13], innerV: [X(W - cw) + 26, Y(ch / 2)] };
    let s = `<polygon points="${D.pts(pts)}" class="s-ink" ${tint('--rod-purple')}/>`;
    for (const [k, v] of Object.entries(show)) s += lab(at[k][0], at[k][1], v);
    return D.svg(f1(W * sc + 112), f1(Hh * sc + 50), s, 'An L-shaped figure with some side lengths');
  };
  /* hide: 'l', 'w' or 'h' shows that edge as "?" */
  G.cuboid = (l, w, h, u, hide) => {
    const sc = Math.min(165 / (l + 0.45 * w), 120 / (h + 0.3 * w)), L = l * sc, Ht = h * sc;
    const dx = w * sc * 0.43, dy = w * sc * 0.25, x0 = 48, y0 = 14 + dy;
    const face = (pts, pct) => `<polygon points="${D.pts(pts)}" class="s-ink" ${tint('--rod-dgreen', pct)}/>`;
    let s = face([[x0, y0], [x0 + L, y0], [x0 + L, y0 + Ht], [x0, y0 + Ht]], 25) +
      face([[x0, y0], [x0 + dx, y0 - dy], [x0 + L + dx, y0 - dy], [x0 + L, y0]], 12) +
      face([[x0 + L, y0], [x0 + L + dx, y0 - dy], [x0 + L + dx, y0 + Ht - dy], [x0 + L, y0 + Ht]], 45);
    const show = (k, v) => `${hide === k ? '?' : v} ${u}`;
    s += lab(x0 + L / 2, y0 + Ht + 15, show('l', l)) + lab(x0 - 28, y0 + Ht / 2, show('h', h)) +
      lab(x0 + L + dx / 2 + 28, y0 + Ht - dy / 2 + 6, show('w', w));
    return D.svg(f1(x0 + L + dx + 66), f1(y0 + Ht + 30), s, 'A cuboid with its length, width and height marked');
  };
  G.circle = (kind, label) => {
    const cx = 120, cy = 92, r = 74;
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" class="s-ink" ${tint('--rod-blue')}/>`;
    s += kind === 'r' ? line(cx, cy, cx + r, cy) + lab(cx + r / 2, cy - 14, label) : line(cx - r, cy, cx + r, cy) + lab(cx, cy - 14, label);
    return D.svg(240, 184, s + dot(cx, cy), kind === 'r' ? 'A circle with its radius marked' : 'A circle with its diameter marked');
  };

  /* ---------- coordinates ---------- */
  /* points: [[x, y, 'A'], ...] on a grid from lo to hi on both axes */
  G.grid = (points, lo, hi) => {
    const cellW = Math.min(30, 260 / (hi - lo)), X = v => 34 + (v - lo) * cellW, Y = v => 14 + (hi - v) * cellW;
    const faint = 'class="s-ink thin" style="stroke:var(--ink-soft);opacity:.35"', ax = lo < 0 ? 0 : lo;
    let s = '';
    for (let v = lo; v <= hi; v++) {
      s += `<line x1="${f1(X(v))}" y1="${f1(Y(lo))}" x2="${f1(X(v))}" y2="${f1(Y(hi))}" ${faint}/><line x1="${f1(X(lo))}" y1="${f1(Y(v))}" x2="${f1(X(hi))}" y2="${f1(Y(v))}" ${faint}/>`;
      if (v !== ax || lo === 0) {
        s += txt(X(v), Y(ax) + 13, M.fmtNum(v), 'fill:var(--ink-soft)', 13);
        if (v !== ax) s += txt(X(ax) - 12, Y(v), M.fmtNum(v), 'fill:var(--ink-soft)', 13);
      }
    }
    s += line(X(lo), Y(ax), X(hi), Y(ax)) + line(X(ax), Y(lo), X(ax), Y(hi));
    s += txt(X(hi) + 10, Y(ax), 'x', INK, 14) + txt(X(ax), Y(hi) - 8, 'y', INK, 14);
    points.forEach(([x, y, name]) => {
      s += `<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="5.5" class="f-red s-ink thin"/>` + txt(X(x) + 12, Y(y) - 12, name, 'fill:var(--ink);font-weight:800', 15);
    });
    return D.svg(f1(X(hi) + 22), f1(Y(lo) + 28), s, 'A coordinate grid with lettered points');
  };

  /* ---------- puzzles ---------- */
  /* Function machine: input → steps → output; any of them can be '?' */
  G.machine = (steps, input, output) => {
    const items = [[input, 1], ...steps.map(s => [s, 0]), [output, 1]], w = k => (k ? 54 : 50), GAP = 18;
    let x = (340 - items.reduce((a, [, k]) => a + w(k), 0) - GAP * (items.length - 1)) / 2, s = '';
    items.forEach(([t, k], i) => {
      s += `<rect x="${f1(x)}" y="20" width="${w(k)}" height="46" rx="${k ? 23 : 8}" class="s-ink" ${k ? 'style="fill:var(--card)"' : tint('--rod-purple', 30)}/>`;
      s += lab(x + w(k) / 2, 43, String(t), 18);
      x += w(k);
      if (i < items.length - 1) {
        s += line(x + 3, 43, x + GAP - 5, 43) + `<polygon points="${D.pts([[x + GAP - 2, 43], [x + GAP - 9, 38], [x + GAP - 9, 48]])}" class="f-ink"/>`;
        x += GAP;
      }
    });
    return D.svg(340, 86, s, 'A function machine');
  };
  const BALL = { red: 'f-red', blue: 'f-blue', green: 'f-lgreen', yellow: 'f-yellow' };
  G.bag = (balls, r) => {
    const list = M.shuffle(r, balls), per = 7, rows = Math.ceil(list.length / per), W = per * 30 + 34;
    let s = `<rect x="8" y="8" width="${W - 16}" height="${rows * 30 + 22}" rx="24" class="s-ink" style="fill:var(--card)"/>`;
    list.forEach((c, i) => { s += `<circle cx="${32 + (i % per) * 30}" cy="${34 + Math.floor(i / per) * 30}" r="11.5" class="${BALL[c]} s-ink thin"/>`; });
    return D.svg(W, rows * 30 + 38, s, `A bag of ${list.length} balls`);
  };
  /* rows from top to bottom; each brick is the sum of the two bricks under it */
  G.pyramid = rows => {
    const bw = 66, bh = 40, W = rows[rows.length - 1].length * bw + 16;
    const s = rows.map((row, i) => row.map((v, j) => cell((W - row.length * bw) / 2 + j * bw, 8 + i * bh, bw, bh, v, '--rod-orange')).join('')).join('');
    return D.svg(W, rows.length * bh + 16, s, 'A number pyramid');
  };
  G.table = rows => {
    const cw = 66, ch = 46;
    const s = rows.map((row, i) => row.map((v, j) => cell(4 + j * cw, 4 + i * ch, cw, ch, v, '--rod-yellow')).join('')).join('');
    return D.svg(rows[0].length * cw + 8, rows.length * ch + 8, s, 'A grid of numbers');
  };
})(window.MBT);
