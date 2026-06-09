import { logSet, getLastUsedWeight, checkAndUpdatePR, isPlateaued, getSettings, getTodayDate, get1RMs } from '../store.js';
import { showPR } from './prBanner.js';
import { startTimer } from './timer.js';
import { computeLoad as computeLoadProg } from '../data/program.js';

export function renderExerciseCard(exercise, workoutId, weekNum, container, onSetLogged) {
  if (exercise.category === 'pelvic_floor') return; // handled by kegelTimer

  const settings = getSettings();
  const orms = get1RMs();
  const sub = null; // substitution applied before calling this
  const displayName = exercise.name;
  const plateaued = isPlateaued(displayName);
  const lastWeight = getLastUsedWeight(displayName);
  const suggestedLoad = computeLoadProg(exercise.intensity, orms);

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

  hdr.innerHTML = `
    <div class="exercise-name">${setTypeBadge}${displayName}${extraBadge}</div>
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
  const loadStr = suggestedLoad ? ` · ~${suggestedLoad} ${settings.units}` : lastWeight ? ` · Last: ${lastWeight} ${settings.units}` : '';
  const tempoStr = exercise.tempo ? ` · Tempo ${exercise.tempo}` : '';
  meta.innerHTML = `<span>${exercise.wu} warmup · ${exercise.sets} × ${exercise.reps}</span><span>${intensityStr}${loadStr}${tempoStr}</span><span>Rest ${Math.round(exercise.rest / 60)}min</span>`;
  card.appendChild(meta);

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

    const defaultWeight = suggestedLoad || lastWeight || '';
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
