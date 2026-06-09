import { PROGRAM, WORKOUT_NAMES, getWeekWorkouts } from '../data/program.js';
import { PPL_PROGRAM, PPL_WORKOUT_NAMES } from '../data/ppl.js';
import { getSettings, getActiveProgram } from '../store.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WORKOUT_LETTERS = ['A', 'B', 'C', 'D', 'E'];

export function renderSchedule(container) {
  container.innerHTML = '';
  const settings = getSettings();
  const activeProgram = getActiveProgram();
  const programData = activeProgram === 'ppl' ? PPL_PROGRAM : PROGRAM;
  const workoutNames = activeProgram === 'ppl' ? PPL_WORKOUT_NAMES : WORKOUT_NAMES;

  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = `<div class="screen-title">Schedule</div><div class="screen-sub">${activeProgram === 'ppl' ? 'PPL — ' : 'Full Body — '}This week's program</div>`;
  container.appendChild(header);

  if (!settings.programStartDate) {
    container.innerHTML += '<div class="empty"><div class="empty-icon">📅</div><p>Set your program start date in Settings first.</p></div>';
    return;
  }

  const start = new Date(settings.programStartDate);
  const today = new Date();
  start.setHours(0,0,0,0); today.setHours(0,0,0,0);
  const diffDays = Math.floor((today - start) / 86400000);
  const weekIdx = Math.min(Math.max(Math.floor(diffDays / 7), 0), programData.length - 1);
  const weekData = programData[weekIdx];
  if (!weekData) { container.innerHTML += '<div class="empty"><p>Program not started yet.</p></div>'; return; }

  // Week info
  const weekInfo = document.createElement('div');
  weekInfo.className = 'week-info';
  weekInfo.innerHTML = `<strong>${weekData.label}</strong> &nbsp;·&nbsp; Block ${weekData.block} &nbsp;·&nbsp; Week ${weekData.week} of 10`;
  container.appendChild(weekInfo);

  // Week strip (7 days, Sun–Sat)
  const todayDow = new Date().getDay();
  const strip = document.createElement('div');
  strip.className = 'week-strip';

  for (let dow = 0; dow < 7; dow++) {
    const isGymDay = dow < 5;
    const pill = document.createElement('div');
    pill.className = 'day-pill' + (dow === todayDow ? ' today' : '') + (!isGymDay ? ' rest' : '');
    pill.dataset.dow = dow;
    if (isGymDay) {
      pill.innerHTML = `
        <div class="day-name">${DAY_NAMES[dow]}</div>
        <div class="day-letter">${WORKOUT_LETTERS[dow]}</div>
        <div class="day-type">${workoutNames[dow].split(' ')[0]}</div>
      `;
      pill.addEventListener('click', () => showDayDetail(dow, weekData, workoutNames, container));
    } else {
      pill.innerHTML = `<div class="day-name">${DAY_NAMES[dow]}</div><div class="day-letter">—</div><div class="day-type">Rest</div>`;
    }
    strip.appendChild(pill);
  }
  container.appendChild(strip);

  // Default: show today's preview (or first gym day)
  const previewDow = todayDow < 5 ? todayDow : 0;
  showDayDetail(previewDow, weekData, workoutNames, container);
}

function showDayDetail(dow, weekData, workoutNames, container) {
  container.querySelector('.schedule-detail')?.remove();

  const exercises = weekData.workouts[dow] || [];
  const detail = document.createElement('div');
  detail.className = 'schedule-detail';
  detail.innerHTML = `<h3>${workoutNames[dow]}</h3>`;

  exercises
    .filter(e => e.category !== 'pelvic_floor')
    .forEach(e => {
      const row = document.createElement('div');
      row.className = 'preview-exercise';
      const intensity = e.intensity
        ? e.intensity.type === 'pct' ? `${e.intensity.p}%` :
          e.intensity.type === 'amrap' ? `AMRAP @${e.intensity.p}%` :
          `RPE${e.intensity.v}` : '';
      row.innerHTML = `
        <span>${e.name}${e.extra === 'legs' ? ' 🦵' : ''}</span>
        <span class="preview-sets">${e.sets}×${e.reps} ${intensity}</span>
      `;
      detail.appendChild(row);
    });

  container.appendChild(detail);
}
