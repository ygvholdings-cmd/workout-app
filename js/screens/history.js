import { getWorkoutHistory, getSettings } from '../store.js';

export function renderHistory(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = '<div class="screen-title">History</div><div class="screen-sub">All logged sets</div>';
  container.appendChild(header);

  const settings = getSettings();
  const history = getWorkoutHistory(60);

  if (!history.length) {
    container.innerHTML += '<div class="empty"><div class="empty-icon">📋</div><p>No workouts logged yet. Start training to see history here.</p></div>';
    return;
  }

  history.forEach(({ date, sets }) => {
    const day = document.createElement('div');
    day.className = 'history-day';

    const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const totalVol = sets.reduce((s, l) => s + (l.weight || 0) * (l.reps || 0), 0);

    day.innerHTML = `<div class="history-day-header"><span>${formattedDate}</span><span>${Math.round(totalVol)} kg total vol</span></div>`;

    // Group by exercise
    const byEx = {};
    sets.forEach(l => {
      if (!byEx[l.exerciseName]) byEx[l.exerciseName] = [];
      byEx[l.exerciseName].push(l);
    });

    Object.entries(byEx).forEach(([name, logs]) => {
      const entry = document.createElement('div');
      entry.className = 'history-entry';
      const bestSet = logs.reduce((best, l) => (l.weight > (best.weight || 0) ? l : best), {});
      const setsStr = logs.map(l => `${l.weight || '?'}×${l.reps || '?'}`).join(', ');
      entry.innerHTML = `
        <div class="history-entry-header">
          <span class="history-entry-name">${name}</span>
          <span class="history-entry-sets">${logs.length} sets</span>
        </div>
        <div style="font-size:12px;color:var(--text2)">${setsStr}</div>
      `;
      day.appendChild(entry);
    });

    container.appendChild(day);
  });
}
