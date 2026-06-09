import { logSet, getLastUsedWeight, checkAndUpdatePR, isPlateaued, getSettings, getTodayDate, get1RMs, getLastSessionSets, getPRDetails, getProgressionSuggestion, getSetMode, saveSetMode } from '../store.js';
import { showPR } from './prBanner.js';
import { startTimer } from './timer.js';
import { computeLoad as computeLoadProg } from '../data/program.js';

export function renderExerciseCard(exercise, workoutId, weekNum, container, onSetLogged) {
  if (exercise.category === 'pelvic_floor') return; // handled by kegelTimer

  const settings = getSettings();
  const orms = get1RMs();
  const displayName = exercise.name;
  const plateaued = isPlateaued(displayName);
  const lastWeight = getLastUsedWeight(displayName);
  const suggestedLoad = computeLoadProg(exercise.intensity, orms);
  const progression = getProgressionSuggestion(displayName, exercise.reps, exercise.sets);
  let currentSetMode = getSetMode(displayName);

  const card = document.createElement('div');
  card.className = 'exercise-card' + (plateaued ? ' plateau' : '');
  card.dataset.exercise = displayName;

  // Header
  const hdr = document.createElement('div');
  hdr.className = 'exercise-header';

  const setTypeBadge = exercise.setType
    ? `<span class="badge ${exercise.setType === 'topset' ? 'badge-accent' : exercise.setType === 'amrap' ? 'badge-yellow' : 'badge-blue'}">${exercise.setType === 'topset' ? 'TOP SET' : exercise.setType === 'amrap' ? 'AMRAP' : exercise.setType === 'backoff' ? 'BACK-OFF' : exercise.setType.toUpperCase()}</span> `
    : '';
  const extraBadge = exercise.extra === 'legs' ? '<span class="badge badge-blue" style="margin-left:4px">LEGS</span>' : '';
  const modeLabels = { normal: '', drop: '↘ DROP', pyramidUp: '▲ PYRAMID', reversePyramid: '▼ REV.PYR' };
  const modeBadge = currentSetMode !== 'normal' ? `<span class="badge badge-accent" style="font-size:10px">${modeLabels[currentSetMode]}</span>` : '';

  hdr.innerHTML = `
    <div class="exercise-name">${setTypeBadge}${displayName}${extraBadge} ${modeBadge}</div>
    <button class="mode-btn" title="Set mode" style="background:none;border:1px solid var(--border);border-radius:6px;color:var(--text2);font-size:11px;padding:4px 7px;cursor:pointer;flex-shrink:0;margin-right:4px">⚡</button>
    <button class="swap-btn" title="Swap exercise">⇄ Swap</button>
  `;
  card.appendChild(hdr);

  // Meta line
  const meta = document.createElement('div');
  meta.className = 'exercise-meta';
  const intensityStr = exercise.intensity
    ? exercise.intensity.type === 'pct' ? `${exercise.intensity.p}% 1RM` :
      exercise.intensity.type === 'amrap' ? `AMRAP @ ${exercise.intensity.p}%` :
      `RPE ${exercise.intensity.v}`
    : '';
  const tempoStr = exercise.tempo ? ` · Tempo ${exercise.tempo}` : '';
  meta.innerHTML = `<span>${exercise.wu} warmup · ${exercise.sets} × ${exercise.reps}</span><span>${intensityStr}${tempoStr}</span><span>Rest ${Math.round(exercise.rest / 60)}min</span>`;
  card.appendChild(meta);

  // Progression suggestion banner
  // Effective weight: progression suggestion > %1RM load > last weight
  const effectiveWeight = progression?.suggestedWeight ?? suggestedLoad ?? lastWeight;
  if (progression) {
    const banner = document.createElement('div');
    banner.style.cssText = `display:flex;align-items:center;gap:8px;padding:6px 14px;background:var(--surface2);border-top:1px solid var(--border);font-size:12px`;
    const weightDisplay = effectiveWeight ? `<strong style="color:${progression.color};font-size:14px">${effectiveWeight} ${settings.units}</strong>` : '';
    const changeStr = progression.change > 0 ? `<span style="color:var(--green);font-size:11px">(+${progression.change}kg)</span>` :
                      progression.change < 0 ? `<span style="color:var(--red);font-size:11px">(${progression.change}kg)</span>` : '';
    banner.innerHTML = `
      <span style="font-size:16px">${progression.icon}</span>
      <div style="flex:1">
        <div>${weightDisplay} ${changeStr}</div>
        <div style="color:var(--text2);font-size:11px;margin-top:1px">${progression.reason}</div>
      </div>
    `;
    card.appendChild(banner);
  }

  // History + PR strip (always visible)
  const lastSession = getLastSessionSets(displayName);
  const prDetails = getPRDetails(displayName);
  if (lastSession || prDetails) {
    const histStrip = document.createElement('div');
    histStrip.style.cssText = 'display:flex;gap:10px;padding:4px 14px 6px;flex-wrap:wrap;border-top:1px solid var(--border)';

    if (lastSession) {
      const dateStr = new Date(lastSession.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const setsStr = lastSession.sets.map(s => `${s.weight}×${s.reps}`).join(' · ');
      const col = document.createElement('div');
      col.style.cssText = 'flex:1;min-width:0';
      col.innerHTML = `<div style="font-size:10px;color:var(--text2);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px">Last session (${dateStr})</div><div style="font-size:12px;color:var(--text);font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${setsStr}</div>`;
      histStrip.appendChild(col);
    }

    if (prDetails) {
      const col = document.createElement('div');
      col.style.cssText = 'flex-shrink:0;text-align:right';
      col.innerHTML = `<div style="font-size:10px;color:var(--accent);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:2px">🏆 PR</div><div style="font-size:12px;color:var(--accent);font-weight:700">${prDetails.weight}kg × ${prDetails.reps} · ~${Math.round(prDetails.orm)}kg 1RM</div>`;
      histStrip.appendChild(col);
    }

    card.appendChild(histStrip);
  }

  // Plateau warning
  if (plateaued) {
    const warn = document.createElement('div');
    warn.className = 'plateau-warning';
    warn.innerHTML = '⚠️ Same weight 3 sessions in a row. Consider a technique check or try a cluster set approach.';
    card.appendChild(warn);
  }

  // Notes
  if (exercise.notes) {
    const notesToggle = document.createElement('div');
    notesToggle.className = 'notes-toggle';
    notesToggle.innerHTML = '▶ Cue';
    const notesContent = document.createElement('div');
    notesContent.className = 'notes-content';
    notesContent.textContent = exercise.notes;
    notesToggle.addEventListener('click', () => {
      notesContent.classList.toggle('open');
      notesToggle.innerHTML = notesContent.classList.contains('open') ? '▼ Cue' : '▶ Cue';
    });
    card.appendChild(notesToggle);
    card.appendChild(notesContent);
  }

  // Mode button handler — show inline mode picker
  hdr.querySelector('.mode-btn').addEventListener('click', () => {
    const existing = card.querySelector('.mode-picker');
    if (existing) { existing.remove(); return; }
    const picker = document.createElement('div');
    picker.className = 'mode-picker';
    picker.style.cssText = 'display:flex;gap:6px;padding:8px 14px;background:var(--surface2);border-top:1px solid var(--border);flex-wrap:wrap';
    const modes = [
      { id: 'normal', label: 'Normal', desc: 'All sets same weight' },
      { id: 'reversePyramid', label: '▼ Reverse Pyramid', desc: 'Heavy first, drop each set' },
      { id: 'pyramidUp', label: '▲ Pyramid Up', desc: 'Light first, increase each set' },
      { id: 'drop', label: '↘ Drop Set', desc: 'One max set + drops' },
    ];
    modes.forEach(m => {
      const btn = document.createElement('button');
      const isActive = currentSetMode === m.id;
      btn.style.cssText = `flex:1;min-width:120px;padding:8px;border-radius:8px;border:1px solid ${isActive ? 'var(--accent)' : 'var(--border)'};background:${isActive ? 'var(--accent-dim)' : 'var(--surface)'};color:var(--text);cursor:pointer;text-align:left`;
      btn.innerHTML = `<div style="font-size:12px;font-weight:700">${m.label}</div><div style="font-size:10px;color:var(--text2)">${m.desc}</div>`;
      btn.addEventListener('click', () => {
        currentSetMode = m.id;
        saveSetMode(displayName, m.id);
        picker.remove();
        applyModeToInputs();
        // Update badge
        const nameEl = card.querySelector('.exercise-name');
        if (nameEl) {
          const newBadge = m.id !== 'normal' ? `<span class="badge badge-accent" style="font-size:10px">${modeLabels[m.id]}</span>` : '';
          nameEl.innerHTML = setTypeBadge + displayName + extraBadge + ' ' + newBadge;
        }
      });
      picker.appendChild(btn);
    });
    card.querySelector('.exercise-header').after(picker);
  });

  // Sets
  const setsContainer = document.createElement('div');
  setsContainer.className = 'sets-container';

  // Warmup rows (display only)
  for (let i = 0; i < exercise.wu; i++) {
    const row = document.createElement('div');
    row.className = 'set-row';
    row.innerHTML = `<div class="set-label warmup">W${i + 1}</div><div class="set-target" style="color:var(--blue)">Warmup — build to working weight</div>`;
    setsContainer.appendChild(row);
  }

  // Working set rows
  const setType = exercise.setType || 'normal';
  const labelClass = setType === 'topset' ? 'topset' : setType === 'amrap' ? 'amrap' : setType === 'backoff' ? 'backoff' : '';

  let completedSets = 0;
  const totalSets = exercise.sets;

  for (let i = 0; i < totalSets; i++) {
    const row = document.createElement('div');
    row.className = 'set-row';

    const defaultWeight = effectiveWeight || '';
    const targetReps = exercise.reps === 'AMRAP' ? '∞' : exercise.reps;

    row.innerHTML = `
      <div class="set-label ${labelClass}">${i + 1}</div>
      <div class="set-target">
        <strong>${targetReps}</strong> reps ${intensityStr ? '@ ' + intensityStr : ''}
      </div>
      <div class="set-inputs">
        <input type="number" class="weight-input" placeholder="kg" value="${defaultWeight}" min="0" step="2.5">
        <span class="x">×</span>
        <input type="number" class="reps-input" placeholder="${exercise.reps === 'AMRAP' ? '?' : exercise.reps}" min="0">
      </div>
      <button class="log-btn" title="Log set">✓</button>
    `;

    const weightInput = row.querySelector('.weight-input');
    const repsInput = row.querySelector('.reps-input');
    const logBtn = row.querySelector('.log-btn');

    logBtn.addEventListener('click', () => {
      if (logBtn.classList.contains('done')) return;

      const weight = parseFloat(weightInput.value) || 0;
      const reps = parseInt(repsInput.value) || (exercise.reps === 'AMRAP' ? 0 : parseInt(exercise.reps));

      // Log the set
      logSet({
        date: getTodayDate(),
        workoutId,
        exerciseName: displayName,
        setNum: i + 1,
        weight,
        reps,
        weekNum,
        isAmrap: setType === 'amrap',
      });

      // Check PR
      if (weight > 0 && reps > 0) {
        const pr = checkAndUpdatePR(displayName, weight, reps);
        if (pr.isNew) showPR(displayName, weight, reps, pr.newOrm);
      }

      // Mark done
      logBtn.classList.add('done');
      row.classList.add('logged');
      completedSets++;

      // Update progress
      if (onSetLogged) onSetLogged();

      // Start rest timer
      startTimer(exercise.rest, displayName);

      // Pre-fill next set weight
      const nextRow = setsContainer.querySelector(`.set-row:nth-child(${exercise.wu + i + 2})`);
      if (nextRow) {
        const nextWeight = nextRow.querySelector('.weight-input');
        if (nextWeight && !nextWeight.value) nextWeight.value = weight;
      }
    });

    setsContainer.appendChild(row);
  }

  card.appendChild(setsContainer);

  // Apply mode-based weights to all set inputs
  function applyModeToInputs() {
    const baseWeight = parseFloat(effectiveWeight) || 0;
    if (!baseWeight) return;
    const inputs = setsContainer.querySelectorAll('.set-row:not(.warmup-row) .weight-input');
    const count = inputs.length;
    if (!count) return;

    inputs.forEach((inp, i) => {
      if (inp.closest('.set-row')?.classList.contains('logged')) return;
      let w = baseWeight;
      if (currentSetMode === 'reversePyramid') {
        // Start at base, drop 5-7% per set
        const drops = [0, -0.075, -0.125];
        w = Math.round((baseWeight * (1 + (drops[i] || -0.125 - (i-2)*0.05))) / 2.5) * 2.5;
      } else if (currentSetMode === 'pyramidUp') {
        // Start at 70% of base, increase to base
        const startPct = 0.70;
        const pct = startPct + (1 - startPct) * (i / Math.max(count - 1, 1));
        w = Math.round((baseWeight * pct) / 2.5) * 2.5;
      } else if (currentSetMode === 'drop') {
        // Set 1: full weight, Set 2: -20%, Set 3: -35%
        const drops = [0, -0.20, -0.35];
        w = Math.round((baseWeight * (1 + (drops[i] || -0.35))) / 2.5) * 2.5;
      }
      inp.value = Math.max(w, 0);
    });
  }
  // Apply on initial render if mode is set
  setTimeout(applyModeToInputs, 0);

  // Swap button handler
  card.querySelector('.swap-btn').addEventListener('click', () => {
    import('./substituteSheet.js').then(({ openSubSheet }) => {
      openSubSheet(exercise.name, (newName) => {
        const nameEl = card.querySelector('.exercise-name');
        if (nameEl) {
          const badges = nameEl.querySelectorAll('.badge');
          const badgeHTML = Array.from(badges).map(b => b.outerHTML).join('');
          nameEl.innerHTML = badgeHTML + (newName || exercise.name) + extraBadge;
        }
      });
    });
  });

  container.appendChild(card);
  return card;
}
