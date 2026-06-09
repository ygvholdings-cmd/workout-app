import { getTodayWorkout, WORKOUT_NAMES, PROGRAM } from '../data/program.js';
import { getPPLTodayWorkout, PPL_PROGRAM, PPL_WORKOUT_NAMES } from '../data/ppl.js';
import { getSettings, getTodayLogs, getWorkoutOverride, setWorkoutOverride, getActiveProgram, get1RMs, getCycles, saveCycle, getLogs } from '../store.js';
import { renderExerciseCard } from '../components/setLogger.js';
import { renderKegelCard } from '../components/kegelTimer.js';
import { getSubstitution } from '../store.js';

export function renderToday(container) {
  container.innerHTML = '';
  const settings = getSettings();
  const activeProgram = getActiveProgram();
  const programData = activeProgram === 'ppl' ? PPL_PROGRAM : PROGRAM;
  const workoutNames = activeProgram === 'ppl' ? PPL_WORKOUT_NAMES : WORKOUT_NAMES;
  const LETTERS = ['A','B','C','D','E'];

  if (!settings.programStartDate) {
    container.innerHTML = `
      <div class="screen-header"><div class="screen-title">Today's Workout</div></div>
      <div class="empty">
        <div class="empty-icon">🏋️</div>
        <p>Go to <strong>Settings</strong> to set your program start date and enter your 1RMs to get started.</p>
      </div>`;
    return;
  }

  // Resolve workout: manual override OR auto from date
  const override = getWorkoutOverride();
  let result;
  if (override) {
    const weekData = programData[override.weekIdx];
    result = weekData ? {
      weekData,
      workoutIdx: override.workoutIdx,
      exercises: weekData.workouts[override.workoutIdx],
      name: workoutNames[override.workoutIdx],
      weekNum: override.weekIdx + 1,
      isOverride: true,
    } : null;
  } else {
    result = activeProgram === 'ppl'
      ? getPPLTodayWorkout(settings.programStartDate)
      : getTodayWorkout(settings.programStartDate);
  }

  // Header (always shown)
  const header = document.createElement('div');
  header.className = 'screen-header';
  header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px';
  header.innerHTML = `
    <div>
      <div class="screen-title">Today's Workout</div>
      <div class="screen-sub" id="today-sub"></div>
    </div>
    <button id="pick-workout-btn" style="background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:6px 12px;font-size:12px;cursor:pointer;flex-shrink:0">
      ✏️ Pick workout
    </button>
  `;
  container.appendChild(header);

  // Workout picker panel (hidden by default)
  const pickerPanel = document.createElement('div');
  pickerPanel.id = 'workout-picker';
  pickerPanel.style.cssText = 'display:none;background:var(--surface);border:1px solid var(--border);border-radius:12px;margin:0 16px 8px;padding:14px;';
  pickerPanel.innerHTML = `
    <div style="font-size:13px;color:var(--text2);margin-bottom:10px">Choose any week and workout:</div>
    <div style="display:flex;gap:10px;margin-bottom:10px;flex-wrap:wrap">
      <div style="flex:1">
        <label style="font-size:11px;color:var(--text2);display:block;margin-bottom:4px">WEEK</label>
        <select id="pick-week" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:7px 10px;font-size:14px">
          ${programData.map((w,i) => `<option value="${i}">${w.label}</option>`).join('')}
        </select>
      </div>
      <div style="flex:1">
        <label style="font-size:11px;color:var(--text2);display:block;margin-bottom:4px">WORKOUT</label>
        <select id="pick-day" style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:8px;padding:7px 10px;font-size:14px">
          ${workoutNames.map((n,i) => `<option value="${i}">${LETTERS[i]} — ${n}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button id="apply-override" class="btn btn-primary" style="flex:1">Load this workout</button>
      <button id="clear-override" class="btn btn-outline" style="flex:1">Use today's auto</button>
    </div>
  `;
  container.appendChild(pickerPanel);

  // Wire picker toggle
  header.querySelector('#pick-workout-btn').addEventListener('click', () => {
    const p = document.getElementById('workout-picker');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
    if (override) {
      const wk = document.getElementById('pick-week');
      const dy = document.getElementById('pick-day');
      if (wk) wk.value = override.weekIdx;
      if (dy) dy.value = override.workoutIdx;
    }
  });
  pickerPanel.querySelector('#apply-override').addEventListener('click', () => {
    const weekIdx = parseInt(document.getElementById('pick-week').value);
    const workoutIdx = parseInt(document.getElementById('pick-day').value);
    setWorkoutOverride({ weekIdx, workoutIdx });
    renderToday(container);
  });
  pickerPanel.querySelector('#clear-override').addEventListener('click', () => {
    setWorkoutOverride(null);
    renderToday(container);
  });

  // Handle non-workout states
  if (!result) {
    container.innerHTML += '<div class="empty"><div class="empty-icon">📅</div><p>Program hasn\'t started yet.</p></div>';
    return;
  }
  if (result.finished) {
    container.innerHTML += '<div class="empty"><div class="empty-icon">🏆</div><p>Program complete! Go to Settings to restart.</p></div>';
    return;
  }
  if (result.rest) {
    container.innerHTML += '<div class="empty"><div class="empty-icon">😴</div><p>Rest day. Recover, eat well, and sleep enough.</p></div>';
    return;
  }

  const { weekData, exercises, name, weekNum, workoutIdx } = result;
  const workoutId = `${activeProgram}-W${weekNum}-${LETTERS[workoutIdx]}`;

  // Update subtitle
  const sub = document.getElementById('today-sub');
  if (sub) sub.textContent = (result.isOverride ? '✏️ Manual pick · ' : '') + weekData.label + ' · ' + ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];

  const todayLogs = getTodayLogs(workoutId);
  const totalWorkingSets = exercises.filter(e => e.category !== 'pelvic_floor').reduce((s, e) => s + (e.sets || 0), 0);

  // Hero card
  const hero = document.createElement('div');
  hero.className = 'today-hero';
  hero.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div class="today-workout-name">${name}</div>
      <div id="session-timer" style="font-size:13px;color:var(--text2);font-variant-numeric:tabular-nums;display:none">⏱ <span id="timer-elapsed">0:00</span></div>
    </div>
    <div class="today-meta">
      <span>📅 ${weekData.label}</span>
      <span>⚡ ${weekData.block === 3 ? (weekNum === 9 ? 'Deload' : 'AMRAP') : 'Block ' + weekData.block}</span>
      <span>🏋️ ${totalWorkingSets} sets</span>
      ${activeProgram === 'ppl' ? '<span class="badge badge-blue">PPL</span>' : ''}
    </div>
  `;
  container.appendChild(hero);

  // Session timer — starts on first logged set
  let sessionTimerInterval = null;
  let sessionStartTime = null;
  function startSessionTimer() {
    if (sessionTimerInterval) return;
    sessionStartTime = Date.now();
    document.getElementById('session-timer')?.style.setProperty('display', 'block');
    sessionTimerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      const m = Math.floor(elapsed / 60), s = elapsed % 60;
      const el = document.getElementById('timer-elapsed');
      if (el) el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    }, 1000);
  }

  // Progress bar
  const loggedSets = todayLogs.length;
  const progressEl = document.createElement('div');
  progressEl.className = 'today-progress';
  progressEl.id = 'today-progress';
  const pct = totalWorkingSets > 0 ? Math.round(loggedSets / totalWorkingSets * 100) : 0;
  progressEl.innerHTML = `<div class="progress-bar"><div class="progress-fill" id="progress-fill" style="width:${pct}%"></div></div><div class="progress-text">${loggedSets}/${totalWorkingSets} sets</div>`;
  container.appendChild(progressEl);

  // Session summary
  const summary = document.createElement('div');
  summary.className = 'session-summary';
  summary.id = 'session-summary';
  summary.innerHTML = `<h3>✅ Great session!</h3><div class="summary-stats"><div class="summary-stat"><div class="val" id="sum-sets">0</div><div class="lbl">Sets</div></div><div class="summary-stat"><div class="val" id="sum-vol">0</div><div class="lbl">Volume (kg)</div></div><div class="summary-stat"><div class="val" id="sum-time">0</div><div class="lbl">Min</div></div></div>`;
  container.appendChild(summary);

  function onSetLogged() {
    startSessionTimer(); // start timer on first logged set
    const fresh = getTodayLogs(workoutId);
    const done = fresh.length;
    const fillEl = document.getElementById('progress-fill');
    const textEl = progressEl.querySelector('.progress-text');
    if (fillEl) fillEl.style.width = totalWorkingSets > 0 ? Math.round(done / totalWorkingSets * 100) + '%' : '0%';
    if (textEl) textEl.textContent = `${done}/${totalWorkingSets} sets`;
    if (done >= totalWorkingSets && totalWorkingSets > 0) {
      const vol = fresh.reduce((s, l) => s + (l.weight || 0) * (l.reps || 0), 0);
      const elapsed = sessionStartTime ? Math.floor((Date.now() - sessionStartTime) / 1000) : 0;
      const mins = Math.round(elapsed / 60);
      document.getElementById('sum-sets').textContent = done;
      document.getElementById('sum-vol').textContent = Math.round(vol);
      document.getElementById('sum-time').textContent = mins || '—';
      document.getElementById('session-summary')?.classList.add('show');
      if (sessionTimerInterval) { clearInterval(sessionTimerInterval); }

      // Week 10 AMRAP day — prompt to save cycle
      if (weekNum === 10 && weekData.block === 3) {
        setTimeout(() => showSaveCyclePrompt(activeProgram, settings.programStartDate, container), 1200);
      }
    }
  }

  // ── Save cycle prompt (Week 10 only) ─────────────────────────────────
  function showSaveCyclePrompt(program, startDate, container) {
    if (document.getElementById('save-cycle-prompt')) return;
    const orms = get1RMs();
    const totalSessions = new Set(getLogs().map(l => l.date)).size;
    const prompt = document.createElement('div');
    prompt.id = 'save-cycle-prompt';
    prompt.style.cssText = 'background:linear-gradient(135deg,var(--surface),var(--surface2));border:2px solid var(--accent);border-radius:14px;margin:12px 16px;padding:16px';
    prompt.innerHTML = `
      <div style="font-size:18px;margin-bottom:6px">🏆 Program Complete!</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:12px">Save this cycle to track your progress over time. Your 1RMs and session count will be recorded.</div>
      <div style="background:var(--surface2);border-radius:8px;padding:10px;margin-bottom:12px;display:grid;grid-template-columns:repeat(2,1fr);gap:6px">
        ${Object.entries(orms).map(([lift, val]) => `<div style="font-size:12px"><span style="color:var(--text2)">${lift.toUpperCase()}</span> <strong>${val} kg</strong></div>`).join('')}
        <div style="font-size:12px"><span style="color:var(--text2)">SESSIONS</span> <strong>${totalSessions}</strong></div>
      </div>
      <textarea id="cycle-notes" placeholder="Notes (optional): how did it go?" style="width:100%;background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:13px;padding:8px;margin-bottom:10px;resize:none;height:60px"></textarea>
      <div style="display:flex;gap:8px">
        <button id="confirm-save-cycle" class="btn btn-primary" style="flex:1">Save Cycle</button>
        <button id="dismiss-cycle" class="btn btn-outline">Later</button>
      </div>
    `;
    container.insertBefore(prompt, container.querySelector('.section-label'));
    prompt.querySelector('#confirm-save-cycle').addEventListener('click', () => {
      const notes = prompt.querySelector('#cycle-notes').value.trim();
      saveCycle({ program, startDate, endDate: new Date().toISOString().slice(0,10), finalOrms: orms, totalSessions, notes });
      prompt.innerHTML = '<div style="text-align:center;padding:8px;color:var(--green);font-size:14px;font-weight:700">✅ Cycle saved! View it in Stats.</div>';
      setTimeout(() => prompt.remove(), 3000);
    });
    prompt.querySelector('#dismiss-cycle').addEventListener('click', () => prompt.remove());
  }

  // Kegel section
  const hasKegel = exercises.some(e => e.category === 'pelvic_floor');
  if (hasKegel) {
    const lbl = document.createElement('div');
    lbl.className = 'section-label';
    lbl.textContent = 'Warmup — Core Activation';
    container.appendChild(lbl);
    exercises.filter(e => e.category === 'pelvic_floor').forEach(e => renderKegelCard(e, container));
  }

  const lbl2 = document.createElement('div');
  lbl2.className = 'section-label';
  lbl2.textContent = 'Working Sets';
  container.appendChild(lbl2);

  exercises.filter(e => e.category !== 'pelvic_floor').forEach(exercise => {
    const sub = getSubstitution(exercise.name);
    const effectiveExercise = sub ? { ...exercise, name: sub } : exercise;
    renderExerciseCard(effectiveExercise, workoutId, weekNum, container, onSetLogged);
  });
}
