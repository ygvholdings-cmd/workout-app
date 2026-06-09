// Rest timer — countdown with vibration + visual ring

let _timerInterval = null;
let _remaining = 0;
let _total = 0;

const overlay = () => document.getElementById('timer-overlay');
const digits = () => document.getElementById('timer-digits');
const label = () => document.getElementById('timer-exercise-label');
const progress = () => document.getElementById('timer-progress');

function fmt(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateRing(remaining, total) {
  const el = progress();
  if (!el) return;
  const r = 88;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? remaining / total : 0;
  el.style.strokeDasharray = circ;
  el.style.strokeDashoffset = circ * (1 - pct);
}

function vibrate(pattern) {
  try { navigator.vibrate(pattern); } catch (_) {}
}

export function startTimer(seconds, exerciseName) {
  stopTimer();
  _total = seconds;
  _remaining = seconds;

  const ov = overlay();
  if (!ov) return;
  ov.classList.add('show');

  if (label()) label().textContent = exerciseName || '';
  if (digits()) digits().textContent = fmt(_remaining);
  updateRing(_remaining, _total);

  // Warm-up vibrate (Android permission trick)
  vibrate(1);

  _timerInterval = setInterval(() => {
    _remaining--;
    if (digits()) digits().textContent = fmt(_remaining);
    updateRing(_remaining, _total);

    if (_remaining === 30) vibrate([100, 50, 100]);
    if (_remaining <= 0) {
      vibrate([300, 100, 300, 100, 500]);
      stopTimer();
    }
  }, 1000);
}

export function stopTimer() {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
  const ov = overlay();
  if (ov) ov.classList.remove('show');
  vibrate(0);
}

export function adjustTimer(delta) {
  _remaining = Math.max(0, _remaining + delta);
  _total = Math.max(_total, _remaining);
  if (digits()) digits().textContent = fmt(_remaining);
  updateRing(_remaining, _total);
}

export function initTimerUI() {
  document.getElementById('timer-skip')?.addEventListener('click', stopTimer);
  document.getElementById('timer-plus30')?.addEventListener('click', () => adjustTimer(30));
  document.getElementById('timer-minus30')?.addEventListener('click', () => adjustTimer(-30));
  overlay()?.addEventListener('click', e => {
    if (e.target === overlay()) stopTimer();
  });
}
