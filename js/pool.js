/* Math Brain Test: the question bank. Picks 20 questions per test, 4 per skill, ordered warm-up to tricky. */
(function (M) {
  const PLAN = [1, 2, 2, 3];                       // difficulty of the 4 questions each skill gets
  const FALLBACK = { 1: [1, 2, 3], 2: [2, 3, 1], 3: [3, 2, 1] };
  const SEEN_KEY = 'mbt-seen-v2';                  // recently asked questions, so retakes feel new
  const keyOf = p => `${M.templates[p.ti].id}:${p.vi}`;

  M.prepare = () => {
    M.templates.forEach((t, ti) => {
      t.ti = ti;
      t.byLevel = { 1: [], 2: [], 3: [] };
      t.variants.forEach((v, vi) => t.byLevel[t.level(v)].push(vi));
    });
    M.poolSize = M.templates.reduce((n, t) => n + t.variants.length, 0);
  };

  function loadSeen() {
    try { return JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'); } catch (e) { return []; }
  }
  function saveSeen(keys) {
    try { localStorage.setItem(SEEN_KEY, JSON.stringify(keys.slice(-400))); } catch (e) { /* storage blocked: retakes may repeat */ }
  }

  function pickVariant(t, lv, seen) {
    const vs = t.byLevel[lv];
    for (let tries = 0; tries < 8; tries++) {
      const vi = vs[Math.floor(Math.random() * vs.length)];
      if (!seen.has(`${t.id}:${vi}`)) return vi;
    }
    return vs[Math.floor(Math.random() * vs.length)];
  }
  function pickFor(skill, level, usedTemplates, seen) {
    const mine = M.templates.filter(t => t.skill === skill);
    for (const lv of FALLBACK[level]) {
      const able = mine.filter(t => t.byLevel[lv].length);
      const fresh = able.filter(t => !usedTemplates.has(t.ti));
      const list = fresh.length ? fresh : able;
      if (!list.length) continue;
      const t = list[Math.floor(Math.random() * list.length)];
      const p = { ti: t.ti, vi: pickVariant(t, lv, seen), lv };
      usedTemplates.add(t.ti);
      seen.add(keyOf(p));
      return p;
    }
    return null;
  }

  M.newPicks = () => {
    const history = loadSeen(), seen = new Set(history), picks = [];
    for (const skill of Object.keys(M.SKILLS)) {
      const used = new Set();
      for (const lv of PLAN) { const p = pickFor(skill, lv, used, seen); if (p) picks.push(p); }
    }
    saveSeen([...history, ...picks.map(keyOf)]);
    return M.shuffle(Math.random, picks).sort((a, b) => a.lv - b.lv);
  };

  M.build = p => {
    const t = M.templates[p.ti];
    const q = t.make(t.variants[p.vi], M.rng(M.hash(`${t.id}:${p.vi}`)));
    return Object.assign({ skill: t.skill, lv: p.lv, id: `${t.id}:${p.vi}` }, q);
  };
  M.validPick = p => Boolean(p && M.templates[p.ti] && Number.isInteger(p.vi) && p.vi >= 0 &&
    p.vi < M.templates[p.ti].variants.length && [1, 2, 3].includes(p.lv));
})(window.MBT);
