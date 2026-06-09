import { getPRs, getSettings } from '../store.js';

export function renderRecords(container) {
  container.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = '<div class="screen-title">Personal Records</div><div class="screen-sub">Best estimated 1RM per exercise</div>';
  container.appendChild(header);

  const settings = getSettings();
  const prs = getPRs();
  const entries = Object.entries(prs).sort((a, b) => b[1].orm - a[1].orm);

  if (!entries.length) {
    container.innerHTML += '<div class="empty"><div class="empty-icon">🏆</div><p>No records yet. Log your first workout to start tracking PRs!</p></div>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'records-list';
  list.innerHTML = `
    <div class="record-row" style="opacity:0.5;font-size:11px;text-transform:uppercase;letter-spacing:0.05em">
      <div class="record-name">Exercise</div>
      <div class="record-vals"><div>Est. 1RM</div></div>
    </div>
  `;

  entries.forEach(([name, pr]) => {
    const row = document.createElement('div');
    row.className = 'record-row';
    const dateStr = new Date(pr.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    row.innerHTML = `
      <div class="record-name">${name}</div>
      <div class="record-vals">
        <div class="record-orm">${Math.round(pr.orm)} ${settings.units}</div>
        <div class="record-detail">${pr.weight} × ${pr.reps} · ${dateStr}</div>
      </div>
    `;
    list.appendChild(row);
  });

  container.appendChild(list);
}
