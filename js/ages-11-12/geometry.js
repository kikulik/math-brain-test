/* Math Brain Test, ages 11 to 12: geometry & measures (angles, area, perimeter, volume, circles, coordinates, units). */
(function (M) {
  const H = M.h11, G = M.draw11, F = M.fmtNum, SKILL = 'geometry11';
  const deg = v => `${F(v)}°`;
  const cents = c => Math.abs(c * 100 - Math.round(c * 100)) < 1e-6;
  const degOpts = (r, v, cands) => M.valOpts(r, v, cands.filter(c => c > 0 && c < 360 && Number.isInteger(c)), deg, 10);
  const unitOpts = (r, v, cands, u) => M.valOpts(r, v, cands.filter(c => c > 0), x => `${F(x)} ${u}`);
  const FIND_X = 'Find the size of the angle marked x.';

  /* ---------- angles on a line and around a point ---------- */
  const LINE_V = [...M.range(35, 145, 5).filter(a => a !== 90).map(a => ['one', a, 0]),
    ...H.thin(M.combos(M.range(35, 100, 5), M.range(35, 100, 5)).filter(([a, b]) => 180 - a - b >= 35), 7).map(([a, b]) => ['two', a, b])];
  M.add({
    id: 'a11-angles-line', skill: SKILL, variants: LINE_V, level: ([k]) => (k === 'one' ? 1 : 2),
    make: ([k, a, b], r) => {
      const x = 180 - a - b, parts = k === 'one' ? [[a, deg(a)], [x, 'x']] : [[a, deg(a)], [b, deg(b)], [x, 'x']];
      const known = k === 'one' ? `${a}` : `${a} − ${b}`;
      return {
        text: FIND_X, say: `Angles on a straight line: ${k === 'one' ? `${a} degrees and x` : `${a} degrees, ${b} degrees and x`}. Find x.`,
        short: `Straight line: ${parts.map(p => p[1]).join(', ')}`, vis: G.angles(r() < 0.5 ? parts : [...parts].reverse()),
        ...degOpts(r, x, [360 - a - b, Math.abs(90 - a - b) || x + 20, a + b, x + 10]), why: `Angles on a straight line add up to 180°: 180 − ${known} = ${x}, so x = ${x}°.`
      };
    }
  });

  const PT = [60, 70, 80, 90, 100, 110, 120, 130, 140];
  const POINT_V = [...H.thin(M.combos(PT, PT, PT).filter(([a, b, c]) => a <= b && b <= c && 360 - a - b - c >= 50 && 360 - a - b - c <= 150), 5),
    ...M.combos(PT, PT).filter(([a, b]) => a < b && 360 - a - b <= 170 && 360 - a - b >= 100)];
  M.add({
    id: 'a11-angles-point', skill: SKILL, variants: POINT_V, level: () => 2,
    make: (known, r) => {
      const sum = known.reduce((s, v) => s + v, 0), x = 360 - sum, parts = M.shuffle(r, [...known.map(v => [v, deg(v)]), [x, 'x']]);
      return {
        text: FIND_X, say: `Angles around a point: ${known.join(' degrees, ')} degrees and x. Find x.`, short: `Around a point: ${known.map(deg).join(', ')}, x`,
        vis: G.angles(parts, true), ...degOpts(r, x, [x + 10, x - 10, Math.abs(180 - sum) || x + 20, 360 - x]),
        why: `Angles around a point add up to 360°. ${known.join(' + ')} = ${sum}, and 360 − ${sum} = ${x}, so x = ${x}°.`
      };
    }
  });

  /* ---------- triangles and crossing lines ---------- */
  const TRI_V = [...H.thin(M.combos(M.range(35, 85, 5), M.range(35, 85, 5)).filter(([a, b]) => 180 - a - b >= 40), 5).map(([a, b]) => ['third', a, b]),
    ...M.range(30, 110, 10).map(c => ['isoBase', c, 0]), ...M.range(40, 75, 5).map(b => ['isoApex', b, 0]), ...M.range(25, 65, 5).map(a => ['right', a, 0])];
  function triangleQ([k, a, b], r) {
    if (k === 'third' || k === 'right') {
      /* right-angled: the smaller angle goes bottom right so the triangle is drawn wide, not tall and thin */
      const angs = k === 'right' ? [90, Math.min(a, 90 - a), Math.max(a, 90 - a)] : [a, b, 180 - a - b];
      const pos = k === 'right' ? (a <= 45 ? 2 : 1) : M.int(r, 0, 2), x = angs[pos];
      const known = angs.filter((_, i) => i !== pos), labels = angs.map((v, i) => (i === pos ? 'x' : deg(v)));
      return [G.triangle(angs[0], angs[1], labels), FIND_X, `A triangle has angles of ${known.join(' degrees and ')} degrees, and x. Find x.`, x,
        [180 - known[0], known[0] + known[1], x + 10, 360 - known[0] - known[1]], `The angles in a triangle add up to 180°: 180 − ${known[0]} − ${known[1]} = ${x}.`];
    }
    const iso = 'This triangle is isosceles: the two sides with a dash are the same length. Find the size of the angle marked x.';
    if (k === 'isoBase') {
      const x = (180 - a) / 2;
      return [G.triangle(x, x, ['x', '', deg(a)], true), iso, `An isosceles triangle has a top angle of ${a} degrees. Find one of the bottom angles, x.`, x,
        [180 - a, a, x + 10, 2 * x + 10], `The two bottom angles are equal. 180 − ${a} = ${180 - a}, shared between them: ${180 - a} ÷ 2 = ${x}.`];
    }
    const x = 180 - 2 * a;
    return [G.triangle(a, a, [deg(a), '', 'x'], true), iso, `An isosceles triangle has a bottom angle of ${a} degrees. Find the top angle, x.`, x,
      [180 - a, a, x + 10, 90 - a], `The two bottom angles are both ${a}°. 180 − ${a} − ${a} = ${x}.`];
  }
  M.add({
    id: 'a11-angles-triangle', skill: SKILL, variants: TRI_V, level: ([k]) => ({ third: 1, right: 1, isoApex: 2, isoBase: 3 }[k]),
    make: (v, r) => {
      const [vis, text, say, x, cands, why] = triangleQ(v, r);
      return { text, say, short: say.replace(/ Find.*$/, '').replace(/ degrees/g, '°'), vis, ...degOpts(r, x, cands), why };
    }
  });

  M.add({
    id: 'a11-angles-crossing', skill: SKILL, variants: M.combos(M.range(40, 140, 5).filter(a => a !== 90), ['opposite', 'next']), level: () => 2,
    make: ([a, kind], r) => {
      const size = i => (i % 2 ? 180 - a : a), s = M.int(r, 0, 3), t = kind === 'opposite' ? (s + 2) % 4 : (s + (r() < 0.5 ? 1 : 3)) % 4, x = size(t);
      const labels = [0, 1, 2, 3].map(i => (i === s ? deg(size(s)) : i === t ? 'x' : ''));
      return {
        text: `Two straight lines cross. ${FIND_X}`, say: `Two straight lines cross. One angle is ${size(s)} degrees. Find the angle marked x.`,
        short: `Crossing lines: ${deg(size(s))} and x`, vis: G.cross(a, labels), ...degOpts(r, x, [180 - x, x + 10, 360 - x, 90]),
        why: kind === 'opposite' ? `Vertically opposite angles are equal, so x = ${x}°.` : `x and ${size(s)}° sit on a straight line, so x = 180 − ${size(s)} = ${x}°.`
      };
    }
  });

  /* ---------- angles in polygons ---------- */
  const NAMES = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: 'dodecagon' };
  const QV = [65, 70, 75, 80, 85, 95, 100, 105, 110, 115, 120];
  const POLY_V = [...[5, 6, 7, 8, 9, 10].map(n => ['sum', n]), ...[5, 6, 8, 9, 10, 12].map(n => ['each', n]),
    ...H.thin(M.combos(QV, QV, QV).filter(([a, b, c]) => a < b && b < c && 360 - a - b - c >= 60 && 360 - a - b - c <= 130), 3).map(p => ['quad', ...p])];
  function polygonQ([k, n, b, c], r) {
    if (k === 'quad') {
      const known = [n, b, c], x = 360 - n - b - c, labels = M.shuffle(r, [...known.map(deg), 'x']);
      return { text: `This shape has four sides. ${FIND_X}`, say: `A four-sided shape has angles of ${known.join(', ')} degrees and x. Find x.`, short: `Quadrilateral: ${known.map(deg).join(', ')}, x`,
        vis: G.quad(labels), ...degOpts(r, x, [x + 10, x - 10, 540 - n - b - c, 180 - x]), why: `The angles in a four-sided shape add up to 360°: 360 − ${n} − ${b} − ${c} = ${x}.` };
    }
    const S = (n - 2) * 180, name = NAMES[n];
    if (k === 'sum') {
      return { text: `What do the inside angles of a ${name} add up to?`, short: `Angles in a ${name}`, vis: G.regular(n),
        ...M.valOpts(r, S, [n * 180, S - 180, 360, S + 180], deg, 180), why: `A ${name} has ${n} sides. From one corner it splits into ${n - 2} triangles, and ${n - 2} × 180° = ${F(S)}°.` };
    }
    const e = S / n;
    return { text: `This is a regular ${name}: all its sides and angles are equal. How big is each inside angle?`, short: `Inside angle of a regular ${name}`, vis: G.regular(n),
      ...degOpts(r, e, [360 / n, e + 10, e - 10, 180 - e + 10]), why: `The inside angles add up to (${n} − 2) × 180° = ${F(S)}°. Shared between ${n} angles: ${F(S)} ÷ ${n} = ${e}°.` };
  }
  M.add({ id: 'a11-angles-polygon', skill: SKILL, variants: POLY_V, level: ([k]) => (k === 'each' ? 3 : 2), make: polygonQ });

  /* ---------- area and perimeter ---------- */
  const LSH = M.combos([8, 10, 12, 14], [6, 8, 10, 12], [3, 4, 5, 6], [2, 3, 4, 5]).filter(([W, Hh, cw, ch]) => cw <= W - 3 && ch <= Hh - 3 && cw * 3 >= W);
  const lLabels = (W, Hh, cw, ch, u) => ({ bottom: `${W} ${u}`, left: `${Hh} ${u}`, top: `${W - cw} ${u}`, right: `${Hh - ch} ${u}` });
  const AREA_V = [...H.thin(M.combos(M.range(4, 16), M.range(3, 12)).filter(([b, h]) => (b * h) % 2 === 0), 6).map(([b, h]) => ['tri', b, h]),
    ...H.thin(M.combos(M.range(4, 14), M.range(3, 9), [1, 2, 3]), 11).map(([b, h, e]) => ['para', b, h, h + e]),
    ...H.thin(LSH, 6).map(p => ['lshape', ...p]), ...H.thin(M.combos(M.range(3, 12), M.range(4, 12)).filter(([w, h]) => w !== h), 6).map(([w, h]) => ['side', w, h])];
  function areaQ([k, a, b, c, d]) {
    if (k === 'tri') {
      const A = (a * b) / 2;
      return [G.triArea(a, b, 'cm'), 'Find the area of this triangle.', A, [a * b, a + b, 2 * (a + b), A + b], 'cm²', `Area of a triangle = base × height ÷ 2 = ${a} × ${b} ÷ 2 = ${A} cm².`];
    }
    if (k === 'para') {
      return [G.para(a, b, c, 'cm'), 'Find the area of this parallelogram.', a * b, [a * c, (a * b) / 2, 2 * (a + c), a * b + a], 'cm²',
        `Area = base × height = ${a} × ${b} = ${a * b} cm². Use the height that meets the base at a right angle, not the sloping side.`];
    }
    if (k === 'lshape') {
      const A = a * b - c * d;
      return [G.lshape(a, b, c, d, lLabels(a, b, c, d, 'm')), 'Find the area of this L-shaped garden. All the corners are right angles.', A,
        [a * b, (a - c) * b + (b - d) * a, 2 * (a + b), A + c], 'm²',
        `The cut-out corner is ${a} − ${a - c} = ${c} m wide and ${b} − ${b - d} = ${d} m tall. Whole rectangle ${a} × ${b} = ${a * b} m², minus ${c} × ${d} = ${c * d} m², leaves ${A} m².`];
    }
    return [G.rect(a, b, `${a} cm`, '? cm'), `This rectangle has an area of ${a * b} cm². What is the missing length?`, b,
      [a * b - a, (a * b) / 2 - a, a, b + 1, 2 * b], 'cm', `Area = length × width, so the missing length is ${a * b} ÷ ${a} = ${b} cm.`];
  }
  M.add({
    id: 'a11-area', skill: SKILL, variants: AREA_V,
    level: ([k, a, b]) => (k === 'tri' ? (a * b <= 60 ? 1 : 2) : k === 'lshape' ? 3 : 2),
    make: (v, r) => {
      const [vis, text, ans, cands, u, why] = areaQ(v);
      return { text, short: text.replace(/ All the corners.*$/, ''), vis, ...unitOpts(r, ans, cands.filter(Number.isInteger), u), why };
    }
  });

  const PER_V = [...H.thin(M.combos(M.range(3, 15), M.range(2, 12)).filter(([w, h]) => w !== h), 10).map(([w, h]) => ['rect', w, h]),
    ...M.range(3, 12).map(s => ['square', s]), ...H.thin(LSH, 6).map(p => ['lshape', ...p]),
    ...H.thin(M.combos(M.range(3, 12), M.range(4, 15)).filter(([w, h]) => w !== h), 9).map(([w, h]) => ['missing', w, h])];
  function perimeterQ([k, a, b, c, d]) {
    if (k === 'rect') return [G.rect(a, b, `${a} cm`, `${b} cm`), 'Find the perimeter of this rectangle.', 2 * (a + b), [a * b, a + b, 2 * a + b], 'cm', `Perimeter = ${a} + ${b} + ${a} + ${b} = ${2 * (a + b)} cm.`];
    if (k === 'square') return ['', `A square has an area of ${a * a} cm². What is its perimeter?`, 4 * a, [a * a, 2 * a, a, (a * a) / 4], 'cm', `${a} × ${a} = ${a * a}, so each side is ${a} cm. The perimeter is 4 × ${a} = ${4 * a} cm.`];
    if (k === 'lshape') {
      const P = 2 * (a + b);
      return [G.lshape(a, b, c, d, lLabels(a, b, c, d, 'm')), 'Find the perimeter of this shape. All the corners are right angles.', P,
        [a + b + (a - c) + (b - d), a * b - c * d, P - c, P + 2 * d], 'm', `The two unlabelled sides are ${c} m and ${d} m. ${a} + ${b} + ${a - c} + ${d} + ${c} + ${b - d} = ${P} m.`];
    }
    const P = 2 * (a + b);
    return [G.rect(a, b, `${a} cm`, '? cm'), `This rectangle has a perimeter of ${P} cm. What is the missing length?`, b, [P - a, P / 2, P - 2 * a, b + 1], 'cm',
      `Two lengths of ${a} cm use ${2 * a} cm. That leaves ${P - 2 * a} cm for the other two sides: ${P - 2 * a} ÷ 2 = ${b} cm.`];
  }
  M.add({
    id: 'a11-perimeter', skill: SKILL, variants: PER_V, level: ([k]) => ({ rect: 1, square: 2, missing: 2, lshape: 3 }[k]),
    make: (v, r) => {
      const [vis, text, ans, cands, u, why] = perimeterQ(v);
      return { text, short: text.replace(/ All the corners.*$/, ''), vis, ...unitOpts(r, ans, cands.filter(Number.isInteger), u), why };
    }
  });

  /* ---------- volume ---------- */
  const BOX = M.combos(M.range(2, 10), M.range(2, 8), M.range(2, 6));
  const TANKS = [[50, 40, 30], [20, 20, 25], [40, 25, 20], [60, 30, 20], [30, 30, 40], [50, 20, 10], [100, 50, 40], [80, 50, 25]];
  const VOL_V = [...H.thin(BOX, 11).map(p => ['cuboid', ...p]), ...H.thin(BOX, 17).map(p => ['missing', ...p]), ...TANKS.map(p => ['litres', ...p])];
  function volumeQ([k, l, w, h]) {
    const V = l * w * h;
    if (k === 'cuboid') return [G.cuboid(l, w, h, 'cm'), 'What is the volume of this cuboid?', V, [l + w + h, l * w, 2 * (l * w + l * h + w * h), V + l * w], 'cm³', `Volume = length × width × height = ${l} × ${w} × ${h} = ${V} cm³.`];
    if (k === 'missing') return [G.cuboid(l, w, h, 'cm', 'h'), `This box has a volume of ${V} cm³. How tall is it?`, h, [V - l - w, V / l, h + 1, l * w], 'cm', `${l} × ${w} = ${l * w}, and ${V} ÷ ${l * w} = ${h}, so it is ${h} cm tall.`];
    return [G.cuboid(l, w, h, 'cm'), `This fish tank is ${l} cm long, ${w} cm wide and ${h} cm tall. How many litres does it hold? (1 litre = 1,000 cm³)`, V / 1000,
      [V / 100, V / 10000, V, l + w + h], 'litres', `${l} × ${w} × ${h} = ${F(V)} cm³. ${F(V)} ÷ 1,000 = ${F(V / 1000)} litres.`];
  }
  M.add({
    id: 'a11-volume', skill: SKILL, variants: VOL_V, level: ([k, l, w, h]) => (k === 'cuboid' ? (l * w * h <= 100 ? 1 : 2) : 3),
    make: (v, r) => {
      const [vis, text, ans, cands, u, why] = volumeQ(v);
      return { text, short: text.replace(/ \(1 litre.*$/, ''), long: v[0] === 'litres', vis, ...unitOpts(r, ans, cands.filter(cents), u), why };
    }
  });

  /* ---------- circles ---------- */
  const CIRC_V = [...M.range(2, 15).map(n => ['r', n]), ...M.range(3, 12).map(n => ['d', 2 * n]), ...[4, 5, 6, 7, 8, 10, 12, 20].map(n => ['circD', n]), ...[2, 3, 4, 5, 6, 10].map(n => ['circR', n])];
  const PI3 = 'Using π ≈ 3,';
  M.add({
    id: 'a11-circles', skill: SKILL, variants: CIRC_V, level: ([k]) => (k === 'r' || k === 'd' ? 1 : 3),
    make: ([k, n], r) => {
      const Q = {
        r: [G.circle('r', `${n} cm`), `The radius of this circle is ${n} cm. What is its diameter?`, 2 * n, [n / 2, n, n * n, 4 * n], `The diameter goes right across, so it is 2 × the radius: 2 × ${n} = ${2 * n} cm.`],
        d: [G.circle('d', `${n} cm`), `The diameter of this circle is ${n} cm. What is its radius?`, n / 2, [2 * n, n, n - 2, n + 2], `The radius is half the diameter: ${n} ÷ 2 = ${n / 2} cm.`],
        circD: [G.circle('d', `${n} cm`), `${PI3} about how long is the circumference of this circle?`, 3 * n, [6 * n, n + 3, 3 * n * n, n * n], `Circumference = π × diameter ≈ 3 × ${n} = ${3 * n} cm.`],
        circR: [G.circle('r', `${n} cm`), `${PI3} about how long is the circumference of this circle?`, 6 * n, [3 * n, 2 * n, 3 * n * n, 6 * n + 6], `The diameter is 2 × ${n} = ${2 * n} cm. Circumference ≈ 3 × ${2 * n} = ${6 * n} cm.`]
      }[k];
      const short = k === 'r' || k === 'd' ? Q[1].replace(/ What.*/, '') : `Circumference, ${k === 'circD' ? 'diameter' : 'radius'} ${n} cm`;
      return { text: Q[1], say: Q[1].replace(PI3, 'Using pi as about 3,'), short, vis: Q[0], ...unitOpts(r, Q[2], Q[3].filter(Number.isInteger), 'cm'), why: Q[4] };
    }
  });

  /* ---------- coordinates ---------- */
  const pt = (x, y) => `(${F(x)}, ${F(y)})`;
  function scatterPoints(r, lo, hi, n) {
    const out = [];
    while (out.length < n) {
      const x = M.int(r, lo, hi), y = M.int(r, lo, hi);
      if (x !== y && x && y && Math.abs(x) !== Math.abs(y) && out.every(p => Math.abs(p[0] - x) + Math.abs(p[1] - y) >= 3)) out.push([x, y, 'ABCD'[out.length]]);
    }
    return out;
  }
  function coordQ([k], r) {
    if (k === 'read' || k === 'read4') {
      const [lo, hi] = k === 'read' ? [0, 8] : [-5, 5], pts = scatterPoints(r, k === 'read' ? 1 : lo, hi, 4), [x, y, name] = M.pick(r, pts);
      const wrong = k === 'read' ? [pt(y, x), pt(x + 1, y), pt(x, y - 1)] : [pt(y, x), pt(-x, y), pt(x, -y)];
      return [G.grid(pts, lo, hi), `What are the coordinates of point ${name}?`, pt(x, y), wrong,
        `${name} is at ${F(x)} on the x-axis (across) and ${F(y)} on the y-axis (up or down). Across comes first: ${pt(x, y)}.`];
    }
    let x, y;
    do { x = M.int(r, -4, 4); y = M.int(r, -4, 4); } while (!x || !y || Math.abs(x) === Math.abs(y));   // keeps every answer choice different
    if (k === 'move') {
      const dx = M.pick(r, [-5, -3, -2, 2, 3, 4]), dy = M.pick(r, [-6, -4, -2, 3, 5]);
      return ['', `Point P is at ${pt(x, y)}. It moves ${Math.abs(dx)} ${dx > 0 ? 'right' : 'left'} and ${Math.abs(dy)} ${dy > 0 ? 'up' : 'down'}. Where is it now?`,
        pt(x + dx, y + dy), [pt(x - dx, y + dy), pt(x + dx, y - dy), pt(x + dy, y + dx), pt(x - dx, y - dy)],
        `Right and left change the first number: ${F(x)} ${dx > 0 ? '+' : '−'} ${Math.abs(dx)} = ${F(x + dx)}. Up and down change the second: ${F(y)} ${dy > 0 ? '+' : '−'} ${Math.abs(dy)} = ${F(y + dy)}.`];
    }
    const axis = r() < 0.5 ? 'x' : 'y', ans = axis === 'x' ? pt(x, -y) : pt(-x, y);
    return [G.grid([[x, y, 'P']], -5, 5), `Point P ${pt(x, y)} is reflected in the ${axis}-axis. Where does it end up?`, ans,
      [axis === 'x' ? pt(-x, y) : pt(x, -y), pt(-x, -y), pt(y, x)], `Reflecting in the ${axis}-axis flips P to the other side of that axis, so the ${axis === 'x' ? 'second' : 'first'} number changes sign: ${ans}.`];
  }
  M.add({
    id: 'a11-coordinates', skill: SKILL, variants: M.combos(['read', 'read4', 'move', 'reflect'], M.range(0, 14)),
    level: ([k]) => ({ read: 1, read4: 2, move: 2, reflect: 3 }[k]),
    make: (v, r) => {
      const [vis, text, ans, wrong, why] = coordQ(v, r);
      return { text, short: text.replace(/ Where.*| What.*/, '') || text, vis, ...M.textOpts(r, ans, wrong.filter(w => w !== ans)), why };
    }
  });

  /* ---------- units ---------- */
  const SAY_UNIT = { km: 'kilometres', m: 'metres', cm: 'centimetres', mm: 'millimetres', kg: 'kilograms', g: 'grams', ml: 'millilitres' };
  const spoken = s => s.replace(/\b(km|cm|mm|kg|ml|m|g)\b/g, w => SAY_UNIT[w]);
  const CONV = [['km', 'm', 1000, [3, 7, 12, 2.5, 0.8, 4.25, 0.35]], ['m', 'cm', 100, [4, 2.5, 0.75, 1.2, 3.05, 0.4]], ['cm', 'mm', 10, [7, 12.5, 3.4, 0.8]],
    ['kg', 'g', 1000, [2, 3.5, 0.25, 1.75, 0.6]], ['litres', 'ml', 1000, [1.5, 0.75, 2.25, 0.2, 4]], ['hours', 'minutes', 60, [1.5, 2.5, 0.75, 3.25, 0.25]]];
  const UNIT_V = [...CONV.flatMap((c, ci) => c[3].flatMap(v => [['down', ci, v], ['up', ci, v]])).filter(([k, ci]) => !(k === 'up' && CONV[ci][1] === 'minutes')),
    ...[10, 15, 20, 25, 30, 40, 50].map(v => ['toKm', 0, v]), ...[16, 24, 32, 40, 48, 80].map(v => ['toMiles', 0, v])];
  function unitQ([k, ci, v]) {
    if (k === 'toKm' || k === 'toMiles') {
      const ans = k === 'toKm' ? (v * 8) / 5 : (v * 5) / 8, from = k === 'toKm' ? 'miles' : 'km', to = k === 'toKm' ? 'km' : 'miles';
      return [`5 miles is about 8 km. About how many ${to} is ${v} ${from}?`, ans, to, [v * 8, v / 5, v + 3, v, ans * 2],
        k === 'toKm' ? `${v} miles is ${v / 5} lots of 5 miles, so it is about ${v / 5} × 8 = ${ans} km.` : `${v} km is ${v / 8} lots of 8 km, so it is about ${v / 8} × 5 = ${ans} miles.`];
    }
    const [big, small, f] = CONV[ci], down = k === 'down', val = down ? v : Math.round(v * f * 1e6) / 1e6, ans = down ? Math.round(v * f * 1e6) / 1e6 : v;
    return [`How many ${down ? small : big} is ${F(val)} ${down ? big : small}?`, ans, down ? small : big, down ? [ans / 10, ans * 10, v / f, ans + f] : [val * f, ans * 10, ans / 10, ans * 100],
      `There are ${F(f)} ${small} in 1 ${big.replace(/s$/, '')}, so ${down ? 'multiply' : 'divide'} by ${F(f)}: ${F(val)} ${down ? '×' : '÷'} ${F(f)} = ${F(ans)}.`];
  }
  M.add({
    id: 'a11-units', skill: SKILL, variants: UNIT_V,
    level: ([k, , v]) => (k === 'toKm' || k === 'toMiles' ? 3 : k === 'down' ? (Number.isInteger(v) ? 1 : 2) : Number.isInteger(v) ? 2 : 3),
    make: (variant, r) => {
      const [text, ans, u, cands, why] = unitQ(variant);
      const o = unitOpts(r, ans, cands.map(c => Math.round(c * 1e6) / 1e6).filter(c => c >= 0.001), u);
      return { text, say: spoken(text), short: text.replace(/^5 miles is about 8 km\. /, ''), ...o, opts: o.opts.map(t => ({ t, say: spoken(t) })), why };
    }
  });
})(window.MBT);
