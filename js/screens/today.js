import { getTodayWorkout, WORKOUT_NAMES } from '../data/program.js';
import { getSettings, getTodayLogs } from '../store.js';
import { renderExerciseCard } from '../components/setLogger.js';
import { renderKegelCard } from '../components/kegelTimer.js';
import { getSubstitution } from '../store.js';

export function renderToday(container) {
  container.innerHTML = '';
  const settings = getSettings();

  if (!settings.programStartDate) {
    container.innerHTML = `
      <div class="screen-header">
        <div class="screen-title">Today's Workout</div>
      </div>
      <div class="empty">
        <div class="empty-icon">🏋️</div>
        <p>Go to <strong>Settings</strong> to set your program start date and enter your 1RMs to get started.</p>
      </div>
    `;
    return;
  }

  const result = getTodayWorkout(settings.programStartDate);

  if (!result) {
    container.innerHTML = `<div class="screen-header"><div class="screen-title">Today's Workout</div></div><div class="empty"><div class="empty-icon">📅</div><p>Program hasn't started yet.</p></div>`;
    return;
  }

  if (result.finished) {
    container.innerHTML = `<div class="screen-header"><div class="screen-title">Program Complete! 🎉</div></div><div class="empty"><div class="empty-icon">🏆</div><p>You completed the 10-week program! Go to Settings to restart with your new 1RMs.</p></div>`;
    return;
  }

  if (result.rest) {
    container.innerHTML = `<div class="screen-header"><div class="screen-title">Rest Day</div></div><div class="empty"><div class="empty-icon">😴</div><p>Today is a rest day. Recover, eat well, and sleep enough. You train again tomorrow.</p></div>`;
    return;
  }

  const { weekData, exercises, name, weekNum, workoutIdx } = result;
  const workoutId = `W${weekNum}-${['A','B','C','D','E'][workoutIdx]}`;

  // Count logged sets today
  const todayLogs = getTodayLogs(workoutId);
  const totalWorkingSets = exercises.filter(e => e.category !== 'pelvic_floor').reduce((s, e) => s + (e.sets || 0), 0);
  const loggedSets = todayLogs.length;

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = `
    <div class="screen-title">Today's Workout</div>
    <div class="screen-sub">${weekData.label} · ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()]}</div>
  `;
  container.appendChild(header);

  // Hero card
  const hero = document.createElement('div');
  hero.className = 'today-hero';
  hero.innerHTML = `
    <div class="today-workout-name">${name}</div>
    <div class="today-meta">
      <span>📅 ${weekData.label}</span>
      <span>⚡ ${weekData.block === 3 ? (weekNum === 9 ? 'Deload' : 'AMRAP Week') : 'Block ' + weekData.block}</span>
      <span>🏋️ ${totalWorkingSets} working sets</span>
    </div>
  `;
  container.appendChild(hero);

  // Progress bar
  const progressEl = document.createElement('div');
  progressEl.className = 'today-progress';
  progressEl.id = 'today-progress';
  const pct = totalWorkingSets > 0 ? Math.round(loggedSets / totalWorkingSets * 100) : 0;
  progressEl.innerHTML = `<div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:${pct}%"></div></div><div class="progress-text">${loggedSets}/${totalWorkingSets} sets</div>`;
  container.appendChild(progressEl);

  // Session summary (hidden until workout done)
  const summary = document.createElement('div');
  summary.className = 'session-summary';
  summary.id = 'session-summary';
  summary.innerHTML = `<h3>✅ Great session!</h3><div class="summary-stats"><div class="summary-stat"><div class="val" id="sum-sets">0</div><div class="lbl">Sets</div></div><div class="summary-stat"><div class="val" id="sum-vol">0</div><div class="lbl">Volume (kg)</div></div><div class="summary-stat"><div class="val" id="sum-time">0</div><div class="lbl">Min</div></div></div>`;
  container.appendChild(summary);

  const sessionStart = Date.now();

  function onSetLogged() {
    const fresh = getTodayLogs(workoutId);
    const done = fresh.length;
    const fillEl = document.getElementById('progress-fill');
    const textEl = progressEl.querySelector('.progress-text');
    if (fillEl) fillEl.style.width = totalWorkingSets > 0 ? Math.round(done / totalWorkingSets * 100) + '%' : '0%';
    if (textEl) textEl.textContent = `${done}/${totalWorkingSets} sets`;

    if (done >= totalWorkingSets && totalWorkingSets > 0) {
      const vol = fresh.reduce((s, l) => s + (l.weight || 0) * (l.reps || 0), 0);
      const mins = Math.round((Date.now() - sessionStart) / 60000);
      document.getElementById('sum-sets').textContent = done;
      document.getElementById('sum-vol').textContent = Math.round(vol);
      document.getElementById('sum-time').textContent = mins;
      document.getElementById('session-summary')?.classList.add('show');
    }
  }

  // Kegel section label
  const hasKegel = exercises.some(e => e.category === 'pelvic_floor');
  if (hasKegel) {
    const lbl = document.createElement('div');
    lbl.className = 'section-label';
    lbl.textContent = 'Warmup — Core Activation';
    container.appendChild(lbl);
    exercises.filter(e => e.category === 'pelvic_floor').forEach(e => renderKegelCard(e, container));
  }

  // Main exercises label
  const lbl2 = document.createElement('div');
  lbl2.className = 'section-label';
  lbl2.textContent = 'Working Sets';
  container.appendChild(lbl2);

  exercises.filter(e => e.category !== 'pelvic_floor').forEach(exercise => {
    // Apply substitution if set
    const sub = getSubstitution(exercise.name);
    const effectiveExercise = sub ? { ...exercise, name: sub } : exercise;
    renderExerciseCard(effectiveExercise, workoutId, weekNum, container, onSetLogged);
  });
}
