import { calcEpley, calcBrzycki, save1RM, getSettings } from '../store.js';

export function renderCalculator(container) {
  container.innerHTML = '';

  const settings = getSettings();

  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = '<div class="screen-title">1RM Calculator</div><div class="screen-sub">Estimate your one-rep max</div>';
  container.appendChild(header);

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="calc-inputs">
      <div>
        <label style="font-size:13px;color:var(--text2);display:block;margin-bottom:6px">Exercise</label>
        <select id="calc-lift" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:15px;padding:8px 10px;width:100%;outline:none">
          <option value="">— Custom —</option>
          <option value="squat">Back Squat</option>
          <option value="bench">Barbell Bench Press</option>
          <option value="deadlift">Deadlift</option>
          <option value="ohp">Overhead Press</option>
        </select>
      </div>
      <div>
        <label style="font-size:13px;color:var(--text2);display:block;margin-bottom:6px">Weight (${settings.units})</label>
        <input type="number" id="calc-weight" placeholder="e.g. 100" min="0" step="2.5">
      </div>
      <div>
        <label style="font-size:13px;color:var(--text2);display:block;margin-bottom:6px">Reps performed</label>
        <input type="number" id="calc-reps" placeholder="e.g. 5" min="1" max="36">
      </div>
    </div>
  `;
  container.appendChild(card);

  const result = document.createElement('div');
  result.className = 'calc-result';
  result.id = 'calc-result';
  result.innerHTML = `
    <h3>Estimated 1RM</h3>
    <div class="orm-result" id="calc-orm">—</div>
    <div class="orm-result-sub" id="calc-sub">Enter weight and reps above</div>
    <table class="calc-table" id="calc-table" style="display:none">
      <thead><tr><th>% 1RM</th><th>Weight</th><th>Rep target</th></tr></thead>
      <tbody id="calc-tbody"></tbody>
    </table>
    <button class="btn btn-primary btn-full" id="save-orm-btn" style="margin-top:16px;display:none">Save as my 1RM</button>
  `;
  container.appendChild(result);

  function update() {
    const weight = parseFloat(document.getElementById('calc-weight')?.value);
    const reps = parseInt(document.getElementById('calc-reps')?.value);
    if (!weight || !reps) return;

    const epley = calcEpley(weight, reps);
    const brzycki = calcBrzycki(weight, reps);
    const avg = Math.round((epley + brzycki) / 2);

    document.getElementById('calc-orm').textContent = `${avg} ${settings.units}`;
    document.getElementById('calc-sub').textContent = `Epley: ${Math.round(epley)} · Brzycki: ${Math.round(brzycki)}`;

    // Build % table
    const tbody = document.getElementById('calc-tbody');
    const table = document.getElementById('calc-table');
    if (tbody && table) {
      tbody.innerHTML = '';
      [[100,1],[95,2],[90,3],[87.5,4],[85,5],[80,6],[77.5,8],[75,10],[70,12],[65,15]].forEach(([pct, reps]) => {
        const w = Math.round(avg * pct / 100 / 2.5) * 2.5;
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${pct}%</td><td>${w} ${settings.units}</td><td>~${reps} reps</td>`;
        tbody.appendChild(tr);
      });
      table.style.display = '';
    }

    const saveBtn = document.getElementById('save-orm-btn');
    if (saveBtn) saveBtn.style.display = '';
  }

  document.getElementById('calc-weight')?.addEventListener('input', update);
  document.getElementById('calc-reps')?.addEventListener('input', update);

  document.getElementById('save-orm-btn')?.addEventListener('click', () => {
    const lift = document.getElementById('calc-lift')?.value;
    const weight = parseFloat(document.getElementById('calc-weight')?.value);
    const reps = parseInt(document.getElementById('calc-reps')?.value);
    if (!weight || !reps) return;
    const orm = Math.round((calcEpley(weight, reps) + calcBrzycki(weight, reps)) / 2);
    if (lift) {
      save1RM(lift, orm);
      document.getElementById('save-orm-btn').textContent = `✓ Saved ${lift} 1RM = ${orm} ${settings.units}`;
      setTimeout(() => { document.getElementById('save-orm-btn').textContent = 'Save as my 1RM'; }, 2500);
    } else {
      alert('Select a lift from the dropdown to save the 1RM.');
    }
  });
}
