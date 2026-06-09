// All localStorage read/write — single source of truth

const KEYS = {
  logs: 'workoutLogs',
  prs: 'personalRecords',
  settings: 'settings',
  orms: 'onerm',
  subs: 'sessionSubs',
  subDate: 'sessionSubsDate',
};

// --- Settings ---
export function getSettings() {
  const defaults = { units: 'kg', darkMode: true, programStartDate: null };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEYS.settings) || '{}') };
  } catch { return defaults; }
}

export function saveSettings(partial) {
  const current = getSettings();
  localStorage.setItem(KEYS.settings, JSON.stringify({ ...current, ...partial }));
}

// --- 1RMs ---
export function get1RMs() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.orms) || '{}');
  } catch { return {}; }
}

export function save1RM(lift, value) {
  const orms = get1RMs();
  orms[lift] = Number(value);
  localStorage.setItem(KEYS.orms, JSON.stringify(orms));
}

// --- Workout logs ---
export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.logs) || '[]');
  } catch { return []; }
}

export function logSet(data) {
  // data: { date, workoutId, exerciseName, setNum, weight, reps, rpe, weekNum, isAmrap }
  const logs = getLogs();
  logs.push({ ...data, ts: Date.now() });
  localStorage.setItem(KEYS.logs, JSON.stringify(logs));
}

export function getLastUsedWeight(exerciseName) {
  const logs = getLogs();
  for (let i = logs.length - 1; i >= 0; i--) {
    if (logs[i].exerciseName === exerciseName && logs[i].weight > 0) {
      return logs[i].weight;
    }
  }
  return null;
}

export function getLogsForExercise(exerciseName, limit = 10) {
  return getLogs()
    .filter(l => l.exerciseName === exerciseName)
    .slice(-limit);
}

export function getRecentSessionWeights(exerciseName, sessions = 3) {
  // Get best weight per session (by date) for plateau detection
  const logs = getLogs().filter(l => l.exerciseName === exerciseName && l.weight > 0);
  const byDate = {};
  logs.forEach(l => {
    const d = l.date;
    if (!byDate[d] || l.weight > byDate[d]) byDate[d] = l.weight;
  });
  const dates = Object.keys(byDate).sort().slice(-sessions);
  return dates.map(d => byDate[d]);
}

export function isPlateaued(exerciseName) {
  const weights = getRecentSessionWeights(exerciseName, 3);
  if (weights.length < 3) return false;
  return weights[0] === weights[1] && weights[1] === weights[2];
}

export function getWorkoutHistory(limit = 30) {
  const logs = getLogs();
  // Group by date
  const grouped = {};
  logs.forEach(l => {
    if (!grouped[l.date]) grouped[l.date] = [];
    grouped[l.date].push(l);
  });
  return Object.keys(grouped).sort().reverse().slice(0, limit)
    .map(date => ({ date, sets: grouped[date] }));
}

export function getTodayLogs(workoutId) {
  const today = new Date().toISOString().slice(0, 10);
  return getLogs().filter(l => l.date === today && l.workoutId === workoutId);
}

// --- Personal Records ---
export function getPRs() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.prs) || '{}');
  } catch { return {}; }
}

// Returns { isNew, newOrm, oldOrm }
export function checkAndUpdatePR(exerciseName, weight, reps) {
  if (!weight || !reps || weight <= 0 || reps <= 0) return { isNew: false };
  const orm = weight * (1 + reps / 30); // Epley formula
  const prs = getPRs();
  const existing = prs[exerciseName];
  if (!existing || orm > existing.orm) {
    const prev = existing ? existing.orm : 0;
    prs[exerciseName] = { weight, reps, orm: Math.round(orm * 10) / 10, date: new Date().toISOString().slice(0, 10) };
    localStorage.setItem(KEYS.prs, JSON.stringify(prs));
    return { isNew: true, newOrm: orm, oldOrm: prev, weight, reps };
  }
  return { isNew: false };
}

// --- Session substitutions (cleared daily) ---
function getSubsForToday() {
  const today = new Date().toISOString().slice(0, 10);
  const saved = localStorage.getItem(KEYS.subDate);
  if (saved !== today) {
    localStorage.setItem(KEYS.subs, '{}');
    localStorage.setItem(KEYS.subDate, today);
  }
  try {
    return JSON.parse(localStorage.getItem(KEYS.subs) || '{}');
  } catch { return {}; }
}

export function getSubstitution(originalName) {
  return getSubsForToday()[originalName] || null;
}

export function setSubstitution(originalName, newExercise) {
  const subs = getSubsForToday();
  if (newExercise === null) {
    delete subs[originalName];
  } else {
    subs[originalName] = newExercise;
  }
  localStorage.setItem(KEYS.subs, JSON.stringify(subs));
}

// --- Utils ---
export function calcEpley(weight, reps) {
  if (!weight || !reps) return 0;
  return weight * (1 + reps / 30);
}

export function calcBrzycki(weight, reps) {
  if (!weight || !reps || reps >= 37) return 0;
  return weight * (36 / (37 - reps));
}

export function formatWeight(kg, units) {
  if (units === 'lbs') return Math.round(kg * 2.2046) + ' lbs';
  return kg + ' kg';
}

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}
