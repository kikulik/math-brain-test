/* Math Brain Test: SVG pictures. Every function returns markup as a string. */
(function (M) {
  const D = M.draw = {};
  const f1 = n => Math.round(n * 10) / 10;
  const rad = deg => deg * Math.PI / 180;

  D.pts = list => list.map(([x, y]) => `${f1(x)},${f1(y)}`).join(' ');
  D.starPts = (cx, cy, R, r) => D.pts(M.range(0, 9).map(i => {
    const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  }));
  D.polyPts = (n, cx, cy, r, startDeg) => D.pts(M.range(0, n - 1).map(i => {
    const a = rad(startDeg + i * 360 / n);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }));
  D.svg = (w, h, inner, label) =>
    `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">${inner}</svg>`;

  /* Shapes used for counting, patterns and answer buttons */
  const FILL = { circle: 'f-blue', triangle: 'f-orange', square: 'f-green', star: 'f-yellow' };
  D.shape = (kind, cx, cy, s) => {
    const c = `${FILL[kind]} s-ink`;
    if (kind === 'circle') return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(s * 0.72)}" class="${c}"/>`;
    if (kind === 'square') {
      return `<rect x="${f1(cx - s * 0.68)}" y="${f1(cy - s * 0.68)}" width="${f1(s * 1.36)}" height="${f1(s * 1.36)}" rx="3" class="${c}"/>`;
    }
    if (kind === 'triangle') {
      return `<polygon points="${D.pts([[cx, cy - s * 0.8], [cx + s * 0.82, cy + s * 0.7], [cx - s * 0.82, cy + s * 0.7]])}" class="${c}"/>`;
    }
    return `<polygon points="${D.starPts(cx, cy + s * 0.05, s * 0.86, s * 0.36)}" class="${c}"/>`;
  };
  D.icon = (kind, size) =>
    `<svg viewBox="0 0 48 48" width="${size}" height="${size}" aria-hidden="true">${D.shape(kind, 24, 24, 24)}</svg>`;
  D.shapeOpt = kind => ({ h: `${D.icon(kind, 56)}<span class="sr">${kind}</span>`, t: kind });
  D.frac = f => {
    const [a, b] = f.split('/');
    return `<span class="frac" aria-hidden="true"><span>${a}</span><span>${b}</span></span><span class="sr">${f}</span>`;
  };

  /* Rows of number chips and big equations */
  D.seq = items => `<div class="seq">${items.map(it => (it === '?' ? '<span class="chip q">?</span>'
    : `<span class="chip">${typeof it === 'object' ? D.icon(it.shape, 40) : it}</span>`)).join('')}</div>`;
  D.eq = (html, label) => (label
    ? `<div class="eq" role="img" aria-label="${label}">${html}</div>`
    : `<div class="eq" aria-hidden="true">${html}</div>`);

  /* Shapes dropped into random cells of a 6 × 3 grid, with a little wobble */
  D.scatter = (kinds, r, label) => {
    const cells = M.shuffle(r, M.range(0, 17));
    const inner = kinds.map((k, i) => {
      const c = cells[i];
      return D.shape(k, 30 + (c % 6) * 56 + M.int(r, -6, 6), 28 + Math.floor(c / 6) * 50 + M.int(r, -4, 4), 21);
    }).join('');
    return D.svg(340, 156, inner, label);
  };

  /* Base-ten blocks: orange tens sticks and white unit cubes */
  D.blocks = (tens, ones) => {
    let s = '';
    for (let t = 0; t < tens; t++) {
      const x = 14 + t * 24;
      s += `<rect x="${x}" y="10" width="16" height="130" rx="2" class="f-orange s-ink"/>`;
      for (let k = 1; k < 10; k++) s += `<line x1="${x}" x2="${x + 16}" y1="${10 + k * 13}" y2="${10 + k * 13}" class="s-ink thin"/>`;
    }
    const ox = 14 + tens * 24 + 14;
    for (let o = 0; o < ones; o++) {
      s += `<rect x="${ox + (o % 3) * 21}" y="${124 - Math.floor(o / 3) * 21}" width="16" height="16" rx="2" class="f-unit s-ink"/>`;
    }
    return D.svg(ox + (ones ? 63 : 0) + 8, 150, s, 'Orange sticks and small cubes');
  };

  /* Analog clock: red long hand for minutes, dark short hand for hours */
  const hand = (deg, len, cls) =>
    `<line x1="100" y1="100" x2="${f1(100 + len * Math.sin(rad(deg)))}" y2="${f1(100 - len * Math.cos(rad(deg)))}" class="${cls}"/>`;
  D.clock = (h, m) => {
    let s = '<circle cx="100" cy="100" r="92" class="face"/>';
    for (let i = 0; i < 60; i++) {
      const a = rad(i * 6), r1 = i % 5 ? 84 : 78;
      s += `<line x1="${f1(100 + r1 * Math.sin(a))}" y1="${f1(100 - r1 * Math.cos(a))}" x2="${f1(100 + 88 * Math.sin(a))}" y2="${f1(100 - 88 * Math.cos(a))}" class="tick${i % 5 ? '' : ' big'}"/>`;
    }
    for (let n = 1; n <= 12; n++) {
      const a = rad(n * 30);
      s += `<text x="${f1(100 + 64 * Math.sin(a))}" y="${f1(100 - 64 * Math.cos(a))}" class="clocknum" text-anchor="middle" dominant-baseline="central">${n}</text>`;
    }
    s += hand(m * 6, 72, 'hand-m') + hand(((h % 12) + m / 60) * 30, 46, 'hand-h') + '<circle cx="100" cy="100" r="7" class="f-ink"/>';
    return `<svg viewBox="0 0 200 200" width="210" height="210" role="img" aria-label="A clock">${s}</svg>`;
  };

  /* Balance scale: 1 apple on the left, k cubes on the right */
  D.balance = k => {
    const size = 14, gap = 2, x0 = 250 - (k * size + (k - 1) * gap) / 2;
    const cubes = M.range(0, k - 1).map(i =>
      `<rect x="${f1(x0 + i * (size + gap))}" y="${112 - size}" width="${size}" height="${size}" rx="2" class="f-blue s-ink"/>`).join('');
    const s = '<rect x="155" y="60" width="10" height="88" class="f-soft"/>' +
      '<rect x="120" y="146" width="80" height="10" rx="4" class="f-soft"/>' +
      '<line x1="70" y1="62" x2="10" y2="112" class="string"/><line x1="70" y1="62" x2="130" y2="112" class="string"/>' +
      '<line x1="250" y1="62" x2="190" y2="112" class="string"/><line x1="250" y1="62" x2="310" y2="112" class="string"/>' +
      '<path d="M10 112 Q70 132 130 112 Z" class="f-card s-ink"/><path d="M190 112 Q250 132 310 112 Z" class="f-card s-ink"/>' +
      '<circle cx="70" cy="93" r="18" class="f-red s-ink"/>' +
      '<line x1="70" y1="76" x2="73" y2="67" class="s-ink" style="stroke-width:3"/>' +
      '<ellipse cx="81" cy="70" rx="7" ry="3.5" transform="rotate(-30 81 70)" class="f-lgreen s-ink thin"/>' + cubes +
      '<rect x="30" y="52" width="260" height="10" rx="5" class="f-ink"/><circle cx="160" cy="57" r="8" class="f-card s-ink"/>' +
      '<text x="70" y="152" text-anchor="middle" class="svg-label">1 apple</text>' +
      `<text x="250" y="152" text-anchor="middle" class="svg-label">${k} cubes</text>`;
    return D.svg(320, 165, s, `A balanced scale with 1 apple on one side and ${k} cubes on the other`);
  };

  /* A grid of squares, for "how many squares can you find?" */
  D.squares = (cols, rows) => {
    const c = 52, w = cols * c, h = rows * c;
    let s = `<rect x="11" y="11" width="${w}" height="${h}" class="f-card s-ink thick"/>`;
    for (let i = 1; i < cols; i++) s += `<line x1="${11 + i * c}" y1="11" x2="${11 + i * c}" y2="${11 + h}" class="s-ink thick"/>`;
    for (let j = 1; j < rows; j++) s += `<line x1="11" y1="${11 + j * c}" x2="${11 + w}" y2="${11 + j * c}" class="s-ink thick"/>`;
    return D.svg(w + 22, h + 22, s, 'Squares drawn in a grid');
  };

  /* Flat shapes for counting sides and corners */
  const POLY = { triangle: [3, -90], square: [4, -45], pentagon: [5, -90], hexagon: [6, 0], octagon: [8, 22.5] };
  D.polygon = name => {
    const inner = name === 'rectangle'
      ? '<rect x="16" y="42" width="168" height="84" rx="2" class="f-purple s-ink thick"/>'
      : `<polygon points="${D.polyPts(POLY[name][0], 100, name === 'triangle' ? 96 : 84, 72, POLY[name][1])}" class="f-purple s-ink thick"/>`;
    return D.svg(200, 168, inner, 'A shape');
  };

  /* A bar or a circle cut into n equal parts, k of them coloured */
  D.fraction = (kind, n, k) => {
    const cls = i => `${i < k ? 'f-orange' : 'f-card'} s-ink thick`;
    if (kind === 'bar') {
      const w = 240 / n;
      const bars = M.range(0, n - 1).map(i => `<rect x="${f1(20 + i * w)}" y="16" width="${f1(w)}" height="88" class="${cls(i)}"/>`).join('');
      return D.svg(280, 120, bars, 'A bar cut into equal parts');
    }
    const p = deg => `${f1(80 + 64 * Math.cos(rad(deg)))} ${f1(76 + 64 * Math.sin(rad(deg)))}`;
    const parts = M.range(0, n - 1).map(i => {
      const a0 = -90 + i * 360 / n;
      return `<path d="M80 76 L${p(a0)} A64 64 0 0 1 ${p(a0 + 360 / n)} Z" class="${cls(i)}"/>`;
    }).join('');
    return D.svg(160, 152, parts, 'A circle cut into equal parts');
  };

  /* A pencil lying above a row of cubes (the row is longer than the pencil) */
  D.measure = (len, cubes) => {
    const u = 24, x0 = 16, w = len * u;
    const pencil = `<rect x="${x0}" y="20" width="14" height="26" rx="3" class="f-red s-ink"/>` +
      `<polygon points="${D.pts([[x0 + 14, 20], [x0 + w - 22, 20], [x0 + w, 33], [x0 + w - 22, 46], [x0 + 14, 46]])}" class="f-yellow s-ink"/>` +
      `<polygon points="${D.pts([[x0 + w - 8, 28.3], [x0 + w, 33], [x0 + w - 8, 37.7]])}" class="f-ink"/>`;
    const row = M.range(0, cubes - 1).map(i => `<rect x="${x0 + i * u}" y="62" width="${u}" height="${u}" class="f-unit s-ink"/>`).join('');
    return D.svg(x0 * 2 + cubes * u, 100, pencil + row, 'A pencil above a row of cubes');
  };

  /* Number line from 0 to max with a red arrow over the target */
  D.numberLine = (max, target) => {
    const x0 = 20, per = 280 / max, tick = max === 20 ? 1 : 10, label = max === 20 ? 5 : 50;
    let s = `<line x1="${x0}" y1="60" x2="${x0 + 280}" y2="60" class="s-ink"/>`;
    for (let v = 0; v <= max; v += tick) {
      const x = f1(x0 + v * per), big = v % label === 0;
      s += `<line x1="${x}" y1="${big ? 48 : 53}" x2="${x}" y2="${big ? 72 : 67}" class="s-ink"/>`;
      if (big) s += `<text x="${x}" y="92" text-anchor="middle" class="svg-label">${v}</text>`;
    }
    const tx = x0 + target * per;
    s += `<polygon points="${D.pts([[tx, 44], [tx - 9, 24], [tx + 9, 24]])}" class="f-red s-ink"/>`;
    return D.svg(320, 104, s, 'A number line with an arrow');
  };
})(window.MBT);
