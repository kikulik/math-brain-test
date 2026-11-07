/* Math Brain Test: screens, answering and the score page. */
(function (M) {
  const $ = s => document.querySelector(s);
  const SKILLS = M.SKILLS;
  const STAGE = { 1: 'Warm-up', 2: 'Thinking', 3: 'Tricky' };
  const LEVELS = {
    5: { name: 'Math Superstar', msg: 'You solved nearly every puzzle, even the tricky ones at the end.' },
    4: { name: 'Puzzle Pro',     msg: 'You really know your numbers. Only a few slipped past you.' },
    3: { name: 'Clever Counter', msg: 'Lots of right answers! A little practice will make you even stronger.' },
    2: { name: 'Number Builder', msg: 'You are building good math skills. Practise a bit and try again soon.' },
    1: { name: 'Math Explorer',  msg: 'Every puzzle you try makes your brain stronger. Practise together and try again.' }
  };
  const PRAISE = ['Yes! That’s right.', 'Correct! Great thinking.', 'You got it!', 'Super! That’s right.', 'Spot on!'];
  const TIMEOUT = -1;   // stored as the answer when "Beat the clock" runs out
  const state = { screen: 'start', name: '', idx: 0, answers: [], picks: [], perms: [], t0: 0, t1: 0, timer: 'off', times: [], age: M.AGE_DEFAULT };
  let QS = [];

  const opt = o => (typeof o === 'string' ? { t: o } : o);
  const answered = i => Number.isInteger(state.answers[i]);
  const isRight = i => state.answers[i] === QS[i].a;
  const timed = () => state.timer !== 'off';
  const msBefore = i => state.times.slice(0, i).reduce((a, t) => a + (t || 0), 0);
  const totalMs = () => msBefore(QS.length);
  const scoreOf = () => QS.filter((q, i) => isRight(i)).length;
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  function newRun() {
    const picks = M.newPicks(state.age);
    QS = picks.map(M.build);
    Object.assign(state, {
      picks, idx: 0, answers: [], times: [], t0: Date.now(), t1: 0,
      perms: QS.map(q => M.shuffle(Math.random, M.range(0, q.opts.length - 1)))
    });
  }
  function show(screen) {
    state.screen = screen;
    for (const id of ['start', 'quiz', 'result']) $('#' + id).hidden = id !== screen;
  }
  function stopSpeech() {
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { /* speech not available */ }
  }

  /* ---------- quiz ---------- */
  function renderRods() {
    $('#rods').style.gridTemplateColumns = `repeat(${QS.length}, minmax(0, 1fr))`;
    $('#rods').innerHTML = QS.map((q, i) => {
      const cls = (answered(i) ? ' done' : '') + (i === state.idx ? ' now' : '');
      return `<i class="rod${cls}" style="--c:var(${SKILLS[q.skill].c})"></i>`;
    }).join('');
  }
  function optButton(q, oi, di) {
    const o = opt(q.opts[oi]);
    return `<button type="button" class="opt${q.long ? ' long' : ''}" data-oi="${oi}"><span class="key" aria-hidden="true">${di + 1}</span>${o.h || o.t}</button>`;
  }
  function renderQuestion() {
    const q = QS[state.idx], sk = SKILLS[q.skill];
    $('#qcount').textContent = `Question ${state.idx + 1} of ${QS.length}`;
    $('#qtag').innerHTML = `<i class="swatch" style="--c:var(${sk.c})"></i>${sk.name} · ${STAGE[q.lv]}`;
    $('#prompt').textContent = q.text;
    const vis = $('#visual');
    vis.innerHTML = q.vis || '';
    vis.hidden = !q.vis;
    $('#opts').innerHTML = state.perms[state.idx].map((oi, di) => optButton(q, oi, di)).join('');
    $('#feedback').hidden = true;
    $('#live').textContent = '';
    renderRods();
    if (answered(state.idx)) markAnswered(false);
    startClock();
  }

  /* The stopwatch shows the whole test's time; "Beat the clock" shows what is left for this question. */
  function showClock(ms) {
    if (state.timer !== 'clock') { M.timer.paint(state.timer, Math.floor((msBefore(state.idx) + ms) / 1000), 1); return; }
    const lim = M.timer.limit(QS[state.idx].lv), left = Math.max(0, lim - ms);
    M.timer.paint('clock', Math.ceil(left / 1000), left / lim);
    if (left <= 0) choose(TIMEOUT);
  }
  function startClock() {
    if (!timed()) { M.timer.paint('off'); return; }
    const spent = state.times[state.idx] || 0;
    if (answered(state.idx)) showClock(spent);
    else M.timer.start(spent, showClock);
  }
  function markAnswered(fresh) {
    const q = QS[state.idx], picked = state.answers[state.idx], ok = picked === q.a;
    document.querySelectorAll('#opts .opt').forEach(b => {
      const oi = +b.dataset.oi;
      b.disabled = true;
      if (oi === q.a) b.classList.add('is-right');
      else if (oi === picked) b.classList.add('is-wrong');
      if (fresh && ok && oi === picked) b.classList.add('pop');
    });
    const fb = $('#feedback');
    fb.className = `feedback ${ok ? 'good' : 'bad'}`;
    $('#fb-text').innerHTML = ok
      ? `<strong>${PRAISE[state.idx % PRAISE.length]}</strong>`
      : `<strong>${picked === TIMEOUT ? 'Time’s up!' : 'Good try!'}</strong> The answer is <b>${opt(q.opts[q.a]).t}</b>. ${q.why}`;
    $('#next').textContent = state.idx === QS.length - 1 ? 'See my score' : 'Next question';
    fb.hidden = false;
    renderRods();
    if (!fresh) return;
    $('#live').textContent = $('#fb-text').textContent;
    $('#next').focus({ preventScroll: true });
    fb.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
  }
  /* oi is the chosen option, or TIMEOUT when "Beat the clock" runs out. */
  function choose(oi) {
    if (answered(state.idx)) return;
    stopSpeech();
    if (timed()) {
      const ms = M.timer.stop();
      state.times[state.idx] = oi === TIMEOUT ? M.timer.limit(QS[state.idx].lv) : ms;
    }
    state.answers[state.idx] = oi;
    markAnswered(true);
    if (timed()) showClock(state.times[state.idx]);
  }
  function goToQuestion() {
    show('quiz');
    renderQuestion();
    $('#prompt').focus({ preventScroll: true });
    if ($('#quiz').getBoundingClientRect().top < 0) $('#quiz').scrollIntoView({ block: 'start' });
  }
  function next() {
    stopSpeech();
    if (state.idx < QS.length - 1) { state.idx++; goToQuestion(); return; }
    state.t1 = Date.now();
    show('result');
    renderResult();
    window.scrollTo({ top: 0 });
    if (scoreOf() >= 11) confetti();
  }
  function speak() {
    try {
      const q = QS[state.idx];
      const words = state.perms[state.idx].map(i => opt(q.opts[i]).say || opt(q.opts[i]).t);
      const u = new SpeechSynthesisUtterance(`${q.say || q.text} Is it ${words.slice(0, -1).join(', ')}, or ${words[words.length - 1]}?`);
      u.rate = 0.9;
      u.lang = 'en-US';
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (e) { /* speech not available: the button does nothing */ }
  }

  /* ---------- results ---------- */
  function skillScore(k) {
    let got = 0, total = 0;
    QS.forEach((q, i) => { if (q.skill === k) { total++; if (isRight(i)) got++; } });
    return { got, total };
  }
  function skillRow(k) {
    const s = SKILLS[k], { got, total } = skillScore(k);
    const cells = Array.from({ length: total }, (_, i) => `<i class="cell${i < got ? ' on' : ''}"></i>`).join('');
    return `<div class="brow" style="--c:var(${s.c})"><div><b>${s.name}</b><span>${got} of ${total} right</span></div><div class="cells" aria-hidden="true">${cells}</div></div>`;
  }
  function renderPractice() {
    let worst = null;
    for (const k of M.skillsFor(state.age)) {
      const sc = skillScore(k);
      if (sc.got < sc.total && (!worst || sc.got < worst.got)) worst = { k, got: sc.got };
    }
    $('#r-practice').innerHTML = '<p class="eyebrow">Practise next</p>' + (worst
      ? `<p><b>${SKILLS[worst.k].name}.</b> ${SKILLS[worst.k].tip}</p>`
      : `<p><b>Every skill is strong.</b> ${M.AGES[state.age].next}</p>`);
  }
  function reviewItem(q, i) {
    const right = opt(q.opts[q.a]).t, ok = isRight(i), late = state.answers[i] === TIMEOUT;
    const yours = answered(i) && !late ? opt(q.opts[state.answers[i]]).t : 'nothing';
    let line = ok ? `Answer: <b>${right}</b>`
      : late ? `Time ran out. Answer: <b>${right}</b>`
      : `You chose <b>${yours}</b>. Answer: <b>${right}</b>`;
    if (timed() && !late && state.times[i]) line += ` · ${Math.max(1, Math.round(state.times[i] / 1000))} s`;
    return `<li><span class="n">${i + 1}</span><div><p class="rq">${q.short || q.text}</p><p class="ra">${line}</p></div>` +
      `<span class="mark ${ok ? 'ok' : 'no'}" aria-label="${ok ? 'Right' : 'Not right'}">${ok ? '✓' : '✗'}</span></li>`;
  }
  function timeLine() {
    if (!timed()) {
      const mins = Math.max(1, Math.round(((state.t1 || Date.now()) - state.t0) / 60000));
      return `Finished in about ${mins} minute${mins === 1 ? '' : 's'}`;
    }
    const sec = Math.round(totalMs() / 1000), clock = M.timer.fmt(sec);
    if (state.timer === 'clock') {
      const inTime = QS.filter((q, i) => state.answers[i] !== TIMEOUT).length;
      return `Answered in time: ${inTime} of ${QS.length} · total time ${clock}`;
    }
    const per = Math.max(1, Math.round(sec / QS.length));
    return `Your time: ${clock} · about ${per} second${per === 1 ? '' : 's'} a question`;
  }
  function renderResult() {
    const right = scoreOf(), pct = right / QS.length;
    const stars = pct >= 0.95 ? 5 : pct >= 0.75 ? 4 : pct >= 0.55 ? 3 : pct >= 0.35 ? 2 : 1;
    $('#r-title').textContent = state.name ? `Well done, ${state.name}!` : 'Well done!';
    $('#r-msg').textContent = LEVELS[stars].msg;
    $('#r-score').innerHTML = `${right}<small>/ ${QS.length}</small>`;
    $('#r-level').textContent = LEVELS[stars].name;
    $('#r-stars').setAttribute('aria-label', `${stars} out of 5 stars`);
    $('#r-stars').innerHTML = M.range(0, 4).map(i =>
      `<svg viewBox="0 0 48 48" class="${i < stars ? 'on' : ''}" style="--d:${i * 120}ms" aria-hidden="true"><polygon points="${M.draw.starPts(24, 25, 21, 9)}"/></svg>`).join('');
    $('#r-time').textContent = timeLine();
    $('#r-age').textContent = M.AGES[state.age].name;
    $('#r-skills').innerHTML = M.skillsFor(state.age).map(skillRow).join('');
    renderPractice();
    $('#r-review').innerHTML = QS.map(reviewItem).join('');
  }

  function confetti() {
    if (reduceMotion()) return;
    const cv = $('#confetti'), ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1, W = innerWidth, H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); cv.hidden = false;
    const css = getComputedStyle(document.documentElement);
    const cols = ['--rod-red', '--rod-yellow', '--rod-blue', '--rod-lgreen', '--rod-purple', '--rod-orange'].map(v => css.getPropertyValue(v).trim());
    const bits = Array.from({ length: 90 }, () => ({
      x: Math.random() * W, y: -20 - Math.random() * H * 0.5, w: 7, h: 7 * (1 + Math.floor(Math.random() * 4)),
      vx: -1 + Math.random() * 2, vy: 2.5 + Math.random() * 3, r: Math.random() * 6, vr: -0.1 + Math.random() * 0.2,
      c: cols[Math.floor(Math.random() * cols.length)]
    }));
    const start = performance.now();
    (function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (const b of bits) {
        b.x += b.vx; b.y += b.vy; b.r += b.vr;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); ctx.restore();
      }
      if (t - start < 2800 && state.screen === 'result') requestAnimationFrame(frame);
      else { ctx.clearRect(0, 0, W, H); cv.hidden = true; }
    })(start);
  }

  /* ---------- wiring ---------- */
  function startRun() { newRun(); window.scrollTo({ top: 0 }); goToQuestion(); }
  function onKey(e) {
    if (state.screen !== 'quiz' || e.altKey || e.ctrlKey || e.metaKey) return;
    const n = parseInt(e.key, 10);
    if (!(n >= 1 && n <= 4)) return;
    const b = document.querySelectorAll('#opts .opt')[n - 1];
    if (b && !b.disabled) { e.preventDefault(); choose(+b.dataset.oi); }
  }
  function wire() {
    $('#start-form').addEventListener('submit', e => {
      e.preventDefault();
      state.name = $('#kid-name').value.trim().slice(0, 24);
      state.timer = M.timer.picked();
      state.age = pickedAge();
      startRun();
    });
    $('#home').addEventListener('click', () => { show('start'); window.scrollTo({ top: 0 }); });
    $('#opts').addEventListener('click', e => {
      const b = e.target.closest('.opt');
      if (b && !b.disabled) choose(+b.dataset.oi);
    });
    $('#next').addEventListener('click', next);
    $('#speak').addEventListener('click', speak);
    $('#again').addEventListener('click', startRun);
    document.addEventListener('keydown', onKey);
  }
  function restore(d) {
    if (!d || !['quiz', 'result'].includes(d.screen) || !Array.isArray(d.picks) || !d.picks.length || !d.picks.every(M.validPick)) return false;
    try {
      const qs = d.picks.map(M.build);
      if (!Array.isArray(d.answers) || !Array.isArray(d.perms) || d.perms.length !== qs.length) return false;
      if (!d.perms.every((p, i) => Array.isArray(p) && p.length === qs[i].opts.length)) return false;
      QS = qs;
      Object.assign(state, d, {
        timer: M.timer.valid(d.timer) ? d.timer : 'off',
        age: M.validAge(d.age) ? d.age : M.SKILLS[qs[0].skill].age,
        times: Array.isArray(d.times) ? d.times.map(t => (Number.isFinite(t) ? t : 0)) : []
      });
      return true;
    } catch (e) { return false; }
  }
  function boot(data) {
    if ('speechSynthesis' in window) $('#speak').hidden = false;
    if (!restore(data)) { show('start'); return; }
    $('#kid-name').value = state.name || '';
    show(state.screen);
    if (state.screen === 'quiz') renderQuestion(); else renderResult();
  }

  /* ---------- start screen: age picker ---------- */
  const AGE_KEY = 'mbt-age';
  const pickedAge = () => { const a = M.picked('age'); return M.validAge(a) ? a : M.AGE_DEFAULT; };
  function showAge(age) {
    $('#bank-count').textContent = (M.poolSize[age] || 0).toLocaleString('en-US');
    $('#age-name').textContent = M.AGES[age].name;
    $('#age-note').textContent = M.AGES[age].note;
    $('#skill-list').innerHTML = M.skillsFor(age)
      .map(k => `<li><i class="swatch" style="--c:var(${SKILLS[k].c})"></i>${SKILLS[k].name}</li>`).join('');
  }
  function initAgePicker() {
    const saved = M.store.get(AGE_KEY, M.AGE_DEFAULT), age = M.validAge(saved) ? saved : M.AGE_DEFAULT;
    M.picker({
      el: '#age-modes', name: 'age', selected: age,
      options: Object.entries(M.AGES).map(([k, a]) => [k, a.name]),
      onChange: a => { if (!M.validAge(a)) return; M.store.set(AGE_KEY, a); showAge(a); }
    });
    showAge(age);
  }

  M.prepare();
  initAgePicker();
  M.timer.initPicker();
  wire();
  window.claude?.hot?.snapshot?.(() => {
    const times = [...state.times];
    if (state.screen === 'quiz' && timed() && !answered(state.idx)) times[state.idx] = Math.round(M.timer.elapsed());
    return { ...state, times, answers: [...state.answers], picks: state.picks.map(p => ({ ...p })), perms: state.perms.map(p => [...p]) };
  });
  if (window.claude?.hot?.ready) window.claude.hot.ready(boot); else boot(window.claude?.hot?.data ?? {});
})(window.MBT);
