/* Math Brain Test: the optional timer.
   The clock runs only while a question is waiting for an answer and the page is visible,
   so reading an explanation or switching to another app never costs time. */
(function (M) {
  const $ = s => document.querySelector(s);
  const MODES = {
    off:   { name: 'No timer',       hint: 'Take as long as you like on every question.' },
    watch: { name: 'Stopwatch',      hint: 'A clock counts up while you think. See how long the whole test takes.' },
    clock: { name: 'Beat the clock', hint: 'Answer before time runs out: 40 seconds for warm-ups, 50 for thinking puzzles, 60 for tricky ones.' }
  };
  const LIMIT_S = { 1: 40, 2: 50, 3: 60 };
  const LOW_S = 10;
  const KEY = 'mbt-timer';
  const DEFAULT = 'watch';

  let acc = 0, since = 0, running = false, beat = 0, onTick = null;
  const now = () => performance.now();
  const visible = () => document.visibilityState !== 'hidden';
  const fold = () => { if (since) { acc += now() - since; since = 0; } };
  const elapsed = () => acc + (since ? now() - since : 0);
  const tick = () => { if (onTick) onTick(elapsed()); };
  const valid = m => typeof m === 'string' && Object.hasOwn(MODES, m);

  /* Starts counting from fromMs (non-zero when a half-done question is restored). */
  function start(fromMs, cb) {
    stop();
    acc = fromMs || 0;
    since = visible() ? now() : 0;
    running = true;
    onTick = cb;
    beat = setInterval(tick, 200);
    tick();
  }
  function stop() {
    fold();
    running = false;
    onTick = null;
    clearInterval(beat);
    return Math.round(acc);
  }
  document.addEventListener('visibilitychange', () => {
    if (!running) return;
    if (visible()) since = now(); else fold();
  });

  const fmt = sec => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const limit = lv => (LIMIT_S[lv] || LIMIT_S[3]) * 1000;

  /* Draws the clock in the question header. frac = share of time left, only for "Beat the clock". */
  function paint(mode, sec, frac) {
    $('#timer').hidden = mode === 'off';
    $('#tbar').hidden = mode !== 'clock';
    if (mode === 'off') return;
    const low = mode === 'clock' && sec <= LOW_S;
    $('#timer-text').textContent = fmt(sec);
    $('#timer').classList.toggle('low', low);
    $('#timer').setAttribute('aria-label', mode === 'clock' ? `${sec} seconds left` : `Time ${fmt(sec)}`);
    if (mode !== 'clock') return;
    $('#tbar').classList.toggle('low', low);
    $('#tbar i').style.transform = `scaleX(${Math.max(0, Math.min(1, frac))})`;
  }

  const picked = () => { const m = M.picked('timer'); return valid(m) ? m : 'off'; };
  function initPicker() {
    const saved = M.store.get(KEY, DEFAULT), sel = valid(saved) ? saved : DEFAULT;
    const hint = m => { $('#timer-hint').textContent = MODES[m].hint; };
    M.picker({
      el: '#timer-modes', name: 'timer', selected: sel,
      options: Object.entries(MODES).map(([k, m]) => [k, m.name]),
      onChange: m => { if (!valid(m)) return; hint(m); M.store.set(KEY, m); }
    });
    hint(sel);
  }

  M.timer = { MODES, valid, start, stop, elapsed, fmt, limit, paint, picked, initPicker };
})(window.MBT);
