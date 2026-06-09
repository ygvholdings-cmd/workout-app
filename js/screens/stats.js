import { getPRs, getLogs, getSettings, getCycles, deleteCycle } from '../store.js';

// Muscle group mapping for volume calculation
const MUSCLE_MAP = {
  'Back Squat': ['quads','glutes'], 'Hack Squat': ['quads','glutes'],
  'Leg Press': ['quads','glutes'], 'Single-Leg Leg Press': ['quads','glutes'],
  'Hack Squat or Leg Press': ['quads','glutes'],
  'Bulgarian Split Squat': ['quads','glutes'], 'Leg Extension': ['quads'],
  'Sissy Squat': ['quads'],
  'Deadlift': ['hamstrings','back','glutes'], 'Reset Deadlift': ['hamstrings','back','glutes'],
  'Romanian Deadlift': ['hamstrings','glutes'], 'Glute Ham Raise': ['hamstrings'],
  'Nordic Curl': ['hamstrings'], 'Lying Leg Curl': ['hamstrings'],
  'Seated Leg Curl': ['hamstrings'], 'Swiss Ball Leg Curl': ['hamstrings'],
  'Barbell Hip Thrust': ['glutes'], 'Barbell Hip Thrust or RDL': ['glutes','hamstrings'],
  'Seated Hip Abduction': ['glutes'],
  'Standing Calf Raise': ['calves'], 'Seated Calf Raise': ['calves'],
  'Eccentric-Accentuated Standing Calf Raise': ['calves'],
  'Barbell Bench Press': ['chest','triceps'], 'Dumbbell Bench Press': ['chest','triceps'],
  'Dumbbell Incline Press': ['chest','triceps'], 'Low Incline Dumbbell Press': ['chest','triceps'],
  'Low to High Cable Flye': ['chest'], 'Decline Bench Press': ['chest','triceps'],
  'Dip': ['chest','triceps'], 'Push Up': ['chest','triceps'],
  'Machine Chest Press': ['chest','triceps'], 'Cable Crossover': ['chest'],
  'Weighted Pull-Up': ['back','biceps'], 'Chin-Up': ['back','biceps'],
  'Weighted Chin-Up': ['back','biceps'],
  'Pronated Pulldown': ['back'], 'Wide Grip Lat Pulldown': ['back'],
  'Cable Straight-Arm Pulldown': ['back'], 'Cable Pull-Over': ['back'],
  'Humble Row': ['back'], 'Chest-Supported T-Bar Row': ['back'],
  'Banded Chest-Supported T-Bar Row': ['back'], 'Pendlay Row': ['back'],
  'Dumbbell Row': ['back'], 'Cable Seated Row': ['back'],
  'Barbell Bent-Over Row': ['back'], 'Banded Barbell Row (explosive)': ['back'],
  'Cable Seated Row (wide grip)': ['back'], 'Cable Seated Row (close grip)': ['back'],
  'Overhead Press': ['shoulders','triceps'], 'Arnold Press': ['shoulders'],
  'Dumbbell Shoulder Press': ['shoulders','triceps'],
  'Egyptian Lateral Raise': ['shoulders'], 'Cable Lateral Raise': ['shoulders'],
  'Dumbbell Lateral Raise': ['shoulders'], 'Machine Lateral Raise': ['shoulders'],
  'Rope Face Pull': ['shoulders','back'], 'Reverse Pec Deck': ['shoulders','back'],
  'Cable Rope Upright Row': ['shoulders','traps'],
  'Hex Bar / Smith Machine Shrug': ['traps'],
  'Supinated EZ Bar Curl': ['biceps'], 'Dumbbell Curl': ['biceps'],
  'EZ Bar Curl': ['biceps'], 'EZ Bar Curl 21s': ['biceps'],
  'Incline Dumbbell Curl': ['biceps'], 'Hammer Curl': ['biceps'],
  'Cable Single-Arm Curl': ['biceps'],
  'Tricep Pressdown': ['triceps'], 'Overhead Tricep Extension': ['triceps'],
  'EZ Bar Skull Crusher': ['triceps'],
  'Hanging Leg Raise': ['core'], 'AB Wheel Rollout': ['core'],
  'Cable Crunch': ['core'], 'Bicycle Crunch': ['core'],
};

const MUSCLE_LABELS = {
  quads: 'Quads', hamstrings: 'Hamstrings', glutes: 'Glutes',
  back: 'Back', chest: 'Chest', shoulders: 'Shoulders',
  biceps: 'Biceps', triceps: 'Triceps', calves: 'Calves',
  traps: 'Traps', core: 'Core',
};

const MUSCLE_COLORS = {
  quads: '#4fc3f7', hamstrings: '#29b6f6', glutes: '#0288d1',
  back: '#66bb6a', chest: '#ff7043', shoulders: '#ffa726',
  biceps: '#ab47bc', triceps: '#7e57c2', calves: '#26c6da',
  traps: '#8d6e63', core: '#78909c',
};

const LIFT_COLORS = { squat: '#ff6b35', bench: '#4fc3f7', deadlift: '#66bb6a', ohp: '#ffa726' };

function getLastNWeeks(logs, n = 8) {
  const now = Date.now();
  const cutoff = now - n * 7 * 86400000;
  return logs.filter(l => new Date(l.date).getTime() >= cutoff);
}

function weekLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

// ─── SVG LINE CHART ────────────────────────────────────────────────────────
function renderLineChart(container, datasets, title, yLabel = 'kg') {
  const W = 340, H = 160, PAD = { top: 20, right: 10, bottom: 30, left: 42 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const allVals = datasets.flatMap(d => d.points.map(p => p.y)).filter(v => v > 0);
  if (!allVals.length) return;
  const minY = Math.floor(Math.min(...allVals) * 0.95);
  const maxY = Math.ceil(Math.max(...allVals) * 1.05);

  const allDates = [...new Set(datasets.flatMap(d => d.points.map(p => p.x)))].sort();
  if (allDates.length < 2) return;

  const xScale = x => PAD.left + (allDates.indexOf(x) / (allDates.length - 1)) * innerW;
  const yScale = y => PAD.top + innerH - ((y - minY) / (maxY - minY)) * innerH;

  let svg = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;overflow:visible">`;

  // Y grid lines
  const ySteps = 4;
  for (let i = 0; i <= ySteps; i++) {
    const yVal = minY + (maxY - minY) * (i / ySteps);
    const yPos = yScale(yVal);
    svg += `<line x1="${PAD.left}" y1="${yPos}" x2="${W - PAD.right}" y2="${yPos}" stroke="var(--border)" stroke-width="1"/>`;
    svg += `<text x="${PAD.left - 4}" y="${yPos + 4}" text-anchor="end" font-size="9" fill="var(--text2)">${Math.round(yVal)}</text>`;
  }

  // X labels (every other date)
  allDates.forEach((d, i) => {
    if (i % Math.ceil(allDates.length / 5) === 0 || i === allDates.length - 1) {
      svg += `<text x="${xScale(d)}" y="${H - 2}" text-anchor="middle" font-size="9" fill="var(--text2)">${weekLabel(d)}</text>`;
    }
  });

  // Lines + dots
  datasets.forEach(({ points, color, label }) => {
    if (points.length < 1) return;
    const sorted = points.filter(p => allDates.includes(p.x)).sort((a, b) => a.x.localeCompare(b.x));
    if (sorted.length >= 2) {
      const pathD = sorted.map((p, i) => `${i === 0 ? 'M' : 'L'}${xScale(p.x)},${yScale(p.y)}`).join(' ');
      svg += `<path d="${pathD}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`;
    }
    sorted.forEach(p => {
      svg += `<circle cx="${xScale(p.x)}" cy="${yScale(p.y)}" r="3.5" fill="${color}"/>`;
    });
  });

  // Legend
  datasets.forEach(({ color, label }, i) => {
    const lx = PAD.left + i * 90;
    svg += `<circle cx="${lx}" cy="${PAD.top - 8}" r="4" fill="${color}"/>`;
    svg += `<text x="${lx + 8}" y="${PAD.top - 4}" font-size="9" fill="var(--text2)">${label}</text>`;
  });

  svg += `</svg>`;

  const wrap = document.createElement('div');
  wrap.innerHTML = `<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.05em">${title}</div>${svg}`;
  container.appendChild(wrap);
}

// ─── SVG HORIZONTAL BAR CHART ─────────────────────────────────────────────
function renderBarChart(container, data, title) {
  if (!data.length) return;
  const maxVal = Math.max(...data.map(d => d.value));
  if (!maxVal) return;

  const wrap = document.createElement('div');
  wrap.innerHTML = `<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">${title}</div>`;

  data.forEach(({ label, value, color }) => {
    const pct = Math.round((value / maxVal) * 100);
    const row = document.createElement('div');
    row.style.cssText = 'margin-bottom:6px';
    row.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:3px">
        <span>${label}</span><span style="color:var(--text);font-weight:600">${Math.round(value).toLocaleString()}</span>
      </div>
      <div style="height:8px;background:var(--surface2);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${color};border-radius:4px;transition:width 0.4s ease"></div>
      </div>`;
    wrap.appendChild(row);
  });

  container.appendChild(wrap);
}

// ─── MAIN RENDER ──────────────────────────────────────────────────────────
export function renderStats(container) {
  container.innerHTML = '';
  const settings = getSettings();
  const logs = getLogs();
  const prs = getPRs();

  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = '<div class="screen-title">Stats & Records</div><div class="screen-sub">Volume, strength trends, PRs</div>';
  container.appendChild(header);

  if (!logs.length) {
    container.innerHTML += '<div class="empty"><div class="empty-icon">📊</div><p>No workouts logged yet. Start training to see your stats!</p></div>';
    return;
  }

  const recentLogs = getLastNWeeks(logs, 8);

  // ── Quick stat cards ──────────────────────────────────────────────────
  const statsCard = document.createElement('div');
  statsCard.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:12px 16px';

  const totalSessions = new Set(logs.map(l => l.date)).size;
  const thisMonthStart = new Date(); thisMonthStart.setDate(1); thisMonthStart.setHours(0,0,0,0);
  const thisMonthLogs = logs.filter(l => new Date(l.date) >= thisMonthStart);
  const monthVol = Math.round(thisMonthLogs.reduce((s, l) => s + (l.weight||0)*(l.reps||0), 0));
  const prCount = Object.keys(prs).length;

  [
    { val: totalSessions, lbl: 'Sessions', icon: '📅' },
    { val: prCount, lbl: 'Exercises tracked', icon: '🏆' },
    { val: monthVol > 999 ? (monthVol/1000).toFixed(1)+'t' : monthVol+'kg', lbl: 'Volume this month', icon: '⚡' },
  ].forEach(({ val, lbl, icon }) => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px 8px;text-align:center';
    card.innerHTML = `<div style="font-size:18px">${icon}</div><div style="font-size:18px;font-weight:700;margin:4px 0">${val}</div><div style="font-size:10px;color:var(--text2)">${lbl}</div>`;
    statsCard.appendChild(card);
  });
  container.appendChild(statsCard);

  // ── Strength trend chart ──────────────────────────────────────────────
  const strengthCard = document.createElement('div');
  strengthCard.className = 'card';
  strengthCard.style.cssText = 'padding:14px';

  // Build estimated 1RM series per lift
  const liftExercises = {
    squat: ['Back Squat', 'Back Squat — TOP SET'],
    bench: ['Barbell Bench Press', 'Barbell Bench Press — TOP SET'],
    deadlift: ['Deadlift', 'Deadlift — TOP SET'],
    ohp: ['Overhead Press', 'Overhead Press — TOP SET'],
  };

  const strengthDatasets = Object.entries(liftExercises).map(([lift, names]) => {
    const byDate = {};
    logs.forEach(l => {
      if (names.some(n => l.exerciseName && l.exerciseName.startsWith(n.split(' —')[0])) && l.weight > 0 && l.reps > 0) {
        const orm = l.weight * (1 + l.reps / 30);
        if (!byDate[l.date] || orm > byDate[l.date]) byDate[l.date] = orm;
      }
    });
    return {
      label: lift.charAt(0).toUpperCase() + lift.slice(1),
      color: LIFT_COLORS[lift],
      points: Object.entries(byDate).map(([x, y]) => ({ x, y: Math.round(y) })),
    };
  }).filter(d => d.points.length > 0);

  if (strengthDatasets.length) {
    renderLineChart(strengthCard, strengthDatasets, 'Estimated 1RM Trend (kg)');
  } else {
    strengthCard.innerHTML = '<p style="font-size:13px;color:var(--text2);text-align:center;padding:8px">Log compound lifts to see strength trends</p>';
  }
  container.appendChild(strengthCard);

  // ── Weekly volume by muscle group ─────────────────────────────────────
  const volCard = document.createElement('div');
  volCard.className = 'card';
  volCard.style.cssText = 'padding:14px';

  // Get last 4 weeks of volume per muscle
  const last4 = getLastNWeeks(logs, 4);
  const muscleVol = {};
  last4.forEach(l => {
    if (!l.weight || !l.reps || !l.exerciseName) return;
    const vol = l.weight * l.reps;
    const muscles = MUSCLE_MAP[l.exerciseName] || [];
    muscles.forEach(m => { muscleVol[m] = (muscleVol[m] || 0) + vol; });
  });

  const volData = Object.entries(muscleVol)
    .sort((a, b) => b[1] - a[1])
    .map(([m, v]) => ({ label: MUSCLE_LABELS[m] || m, value: v, color: MUSCLE_COLORS[m] || '#888' }));

  if (volData.length) {
    renderBarChart(volCard, volData, 'Volume by Muscle Group — Last 4 Weeks (kg)');
  } else {
    volCard.innerHTML = '<p style="font-size:13px;color:var(--text2);text-align:center;padding:8px">Log workouts to see muscle volume breakdown</p>';
  }
  container.appendChild(volCard);

  // ── PRs this month ────────────────────────────────────────────────────
  const monthPRs = Object.entries(prs)
    .filter(([, pr]) => new Date(pr.date) >= thisMonthStart)
    .sort((a, b) => b[1].orm - a[1].orm);

  if (monthPRs.length) {
    const prCard = document.createElement('div');
    prCard.style.cssText = 'margin:0 16px 8px';
    prCard.innerHTML = `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text2);padding:8px 0 4px">🏆 PRs This Month</div>`;
    monthPRs.forEach(([name, pr]) => {
      const row = document.createElement('div');
      row.style.cssText = 'background:var(--surface);border:1px solid var(--accent);border-radius:8px;padding:10px 12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center';
      row.innerHTML = `<span style="font-size:13px;font-weight:500">${name}</span><span style="font-size:13px;color:var(--accent);font-weight:700">${pr.weight}×${pr.reps} · ~${Math.round(pr.orm)}kg</span>`;
      prCard.appendChild(row);
    });
    container.appendChild(prCard);
  }

  // ── Program Cycle History ────────────────────────────────────────────
  const cycles = getCycles();
  if (cycles.length) {
    const cycleLabel = document.createElement('div');
    cycleLabel.style.cssText = 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text2);padding:8px 16px 4px';
    cycleLabel.textContent = '🔄 Program Cycles Completed';
    container.appendChild(cycleLabel);

    cycles.forEach((cycle, idx) => {
      const card = document.createElement('div');
      card.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:10px;margin:0 16px 8px;padding:12px 14px';

      const startStr = cycle.startDate ? new Date(cycle.startDate).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'2-digit'}) : '—';
      const endStr = cycle.endDate ? new Date(cycle.endDate).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'2-digit'}) : '—';
      const prog = cycle.program === 'ppl' ? 'PPL' : 'Full Body 5×';

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
          <div>
            <div style="font-size:14px;font-weight:700">Cycle ${idx + 1} — ${prog}</div>
            <div style="font-size:11px;color:var(--text2)">${startStr} → ${endStr} · ${cycle.totalSessions || '—'} sessions</div>
          </div>
          <button class="del-cycle-btn" data-idx="${idx}" style="background:none;border:none;color:var(--text2);font-size:16px;cursor:pointer">✕</button>
        </div>
        ${cycle.finalOrms ? `
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
          ${Object.entries(cycle.finalOrms).map(([lift, val]) => `
            <div style="background:var(--surface2);border-radius:6px;padding:6px;text-align:center">
              <div style="font-size:16px;font-weight:700">${Math.round(val)}</div>
              <div style="font-size:10px;color:var(--text2)">${lift.toUpperCase()} kg</div>
            </div>`).join('')}
        </div>` : ''}
        ${cycle.notes ? `<div style="font-size:12px;color:var(--text2);margin-top:8px;font-style:italic">"${cycle.notes}"</div>` : ''}
      `;
      card.querySelector('.del-cycle-btn').addEventListener('click', () => {
        deleteCycle(idx);
        renderStats(container);
      });
      container.appendChild(card);
    });

    // Comparison if ≥2 cycles
    if (cycles.length >= 2) {
      const last = cycles[cycles.length - 1];
      const prev = cycles[cycles.length - 2];
      if (last.finalOrms && prev.finalOrms) {
        const compCard = document.createElement('div');
        compCard.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:10px;margin:0 16px 12px;padding:12px 14px';
        compCard.innerHTML = `<div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.05em">Cycle ${cycles.length-1} → ${cycles.length} Strength Gains</div>`;
        Object.keys(last.finalOrms).forEach(lift => {
          const delta = Math.round((last.finalOrms[lift] || 0) - (prev.finalOrms[lift] || 0));
          const color = delta > 0 ? 'var(--green)' : delta < 0 ? 'var(--red)' : 'var(--text2)';
          const sign = delta > 0 ? '+' : '';
          const row = document.createElement('div');
          row.style.cssText = 'display:flex;justify-content:space-between;padding:4px 0;font-size:13px;border-bottom:1px solid var(--border)';
          row.innerHTML = `<span>${lift.charAt(0).toUpperCase()+lift.slice(1)}</span><span style="color:${color};font-weight:700">${sign}${delta} kg est. 1RM</span>`;
          compCard.appendChild(row);
        });
        container.appendChild(compCard);
      }
    }
  }

  // ── All-time PR table ─────────────────────────────────────────────────
  const allPRs = Object.entries(prs).sort((a, b) => b[1].orm - a[1].orm);
  if (allPRs.length) {
    const label = document.createElement('div');
    label.style.cssText = 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text2);padding:8px 16px 4px';
    label.textContent = 'All-Time Personal Records';
    container.appendChild(label);

    const list = document.createElement('div');
    list.style.cssText = 'padding:0 16px 24px';
    allPRs.forEach(([name, pr]) => {
      const dateStr = new Date(pr.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)';
      row.innerHTML = `
        <div style="flex:1;font-size:13px;font-weight:500">${name}</div>
        <div style="text-align:right">
          <div style="font-size:15px;font-weight:700">${Math.round(pr.orm)} kg est.</div>
          <div style="font-size:11px;color:var(--text2)">${pr.weight}kg × ${pr.reps} · ${dateStr}</div>
        </div>`;
      list.appendChild(row);
    });
    container.appendChild(list);
  }
}
