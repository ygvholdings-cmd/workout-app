import { renderToday } from './screens/today.js';
import { renderSchedule } from './screens/schedule.js';
import { renderHistory } from './screens/history.js';
import { renderRecords } from './screens/records.js';
import { renderCalculator } from './screens/calculator.js';
import { getSettings, saveSettings, get1RMs, save1RM } from './store.js';
import { initTimerUI } from './components/timer.js';
import { initSubSheet } from './components/substituteSheet.js';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

// PWA install prompt
let _deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredInstall = e;
  document.getElementById('install-banner')?.classList.add('show');
});
document.getElementById('install-btn')?.addEventListener('click', () => {
  if (_deferredInstall) { _deferredInstall.prompt(); _deferredInstall = null; }
  document.getElementById('install-banner')?.classList.remove('show');
});
document.getElementById('install-dismiss')?.addEventListener('click', () => {
  document.getElementById('install-banner')?.classList.remove('show');
});

// Theme
function applyTheme() {
  const s = getSettings();
  document.documentElement.setAttribute('data-theme', s.darkMode ? 'dark' : 'light');
}
applyTheme();

// Router
const screens = ['today', 'schedule', 'records', 'history', 'settings'];
let activeScreen = 'today';

function navigate(screenId) {
  activeScreen = screenId;
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  const screen = document.getElementById('screen-' + screenId);
  const navBtn = document.querySelector(`.nav-btn[data-screen="${screenId}"]`);
  if (screen) screen.classList.add('active');
  if (navBtn) navBtn.classList.add('active');

  // Scroll to top
  document.getElementById('screen-container')?.scrollTo(0, 0);

  // Render
  if (screenId === 'today') renderToday(screen);
  else if (screenId === 'schedule') renderSchedule(screen);
  else if (screenId === 'history') renderHistory(screen);
  else if (screenId === 'records') renderRecords(screen);
  else if (screenId === 'settings') renderSettings(screen);
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.screen));
});

// Settings screen
function renderSettings(container) {
  container.innerHTML = '';
  const s = getSettings();
  const orms = get1RMs();

  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = '<div class="screen-title">Settings</div>';
  container.appendChild(header);

  // 1RM section
  const sec1 = document.createElement('div');
  sec1.className = 'settings-section';
  sec1.innerHTML = `<h3>My 1RMs</h3>`;
  const ormCard = document.createElement('div');
  ormCard.className = 'card';
  ormCard.innerHTML = `
    <div class="orm-grid">
      <div class="orm-item"><label>Squat (${s.units})</label><input type="number" id="orm-squat" value="${orms.squat || ''}" placeholder="e.g. 110" min="0" step="2.5"></div>
      <div class="orm-item"><label>Bench (${s.units})</label><input type="number" id="orm-bench" value="${orms.bench || ''}" placeholder="e.g. 100" min="0" step="2.5"></div>
      <div class="orm-item"><label>Deadlift (${s.units})</label><input type="number" id="orm-deadlift" value="${orms.deadlift || ''}" placeholder="e.g. 160" min="0" step="2.5"></div>
      <div class="orm-item"><label>OHP (${s.units})</label><input type="number" id="orm-ohp" value="${orms.ohp || ''}" placeholder="e.g. 60" min="0" step="2.5"></div>
    </div>
    <div style="padding:0 16px 16px"><button class="btn btn-primary btn-full" id="save-orms-btn">Save 1RMs</button></div>
  `;
  sec1.appendChild(ormCard);
  container.appendChild(sec1);

  // Program start date
  const sec2 = document.createElement('div');
  sec2.className = 'settings-section';
  sec2.innerHTML = '<h3>Program</h3>';
  const progCard = document.createElement('div');
  progCard.className = 'card';
  progCard.innerHTML = `
    <div class="setting-row">
      <div class="setting-label"><h4>Program Start Date</h4><p>Set the Sunday your program began</p></div>
      <input type="date" id="start-date" value="${s.programStartDate || ''}" style="width:140px;font-size:14px;padding:6px 8px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text)">
    </div>
    <div style="padding:0 16px 16px"><button class="btn btn-primary btn-full" id="save-date-btn">Set Start Date</button></div>
  `;
  sec2.appendChild(progCard);
  container.appendChild(sec2);

  // Preferences
  const sec3 = document.createElement('div');
  sec3.className = 'settings-section';
  sec3.innerHTML = '<h3>Preferences</h3>';
  const prefCard = document.createElement('div');
  prefCard.className = 'card';
  prefCard.innerHTML = `
    <div class="setting-row">
      <div class="setting-label"><h4>Weight Units</h4><p>kg or lbs</p></div>
      <select id="units-select" style="background:var(--surface2);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:14px;padding:6px 10px">
        <option value="kg" ${s.units === 'kg' ? 'selected' : ''}>kg</option>
        <option value="lbs" ${s.units === 'lbs' ? 'selected' : ''}>lbs</option>
      </select>
    </div>
    <div class="setting-row">
      <div class="setting-label"><h4>Dark Mode</h4><p>Easier on the eyes at the gym</p></div>
      <label class="toggle"><input type="checkbox" id="dark-toggle" ${s.darkMode ? 'checked' : ''}><span class="toggle-slider"></span></label>
    </div>
  `;
  sec3.appendChild(prefCard);
  container.appendChild(sec3);

  // App info
  const sec4 = document.createElement('div');
  sec4.className = 'settings-section';
  sec4.innerHTML = '<h3>App Info</h3>';
  const infoCard = document.createElement('div');
  infoCard.className = 'card';
  infoCard.innerHTML = `
    <div class="setting-row"><div class="setting-label"><h4>Program</h4><p>Jeff Nippard Full Body 5×/Week · 10 Weeks</p></div></div>
    <div class="setting-row"><div class="setting-label"><h4>Version</h4><p>1.0.0 · Works offline</p></div></div>
  `;
  sec4.appendChild(infoCard);
  container.appendChild(sec4);

  // Wire events
  document.getElementById('save-orms-btn')?.addEventListener('click', () => {
    ['squat', 'bench', 'deadlift', 'ohp'].forEach(lift => {
      const val = parseFloat(document.getElementById('orm-' + lift)?.value);
      if (val > 0) save1RM(lift, val);
    });
    const btn = document.getElementById('save-orms-btn');
    btn.textContent = '✓ Saved!';
    setTimeout(() => { btn.textContent = 'Save 1RMs'; }, 1500);
  });

  document.getElementById('save-date-btn')?.addEventListener('click', () => {
    const date = document.getElementById('start-date')?.value;
    if (date) {
      saveSettings({ programStartDate: date });
      const btn = document.getElementById('save-date-btn');
      btn.textContent = '✓ Saved!';
      setTimeout(() => { btn.textContent = 'Set Start Date'; }, 1500);
    }
  });

  document.getElementById('units-select')?.addEventListener('change', e => {
    saveSettings({ units: e.target.value });
  });

  document.getElementById('dark-toggle')?.addEventListener('change', e => {
    saveSettings({ darkMode: e.target.checked });
    applyTheme();
  });
}

// Init
initTimerUI();
initSubSheet();
navigate('today');
