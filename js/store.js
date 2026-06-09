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

// Returns the sets from the most recent logged session for this exercise
export function getLastSessionSets(exerciseName) {
  const logs = getLogs().filter(l => l.exerciseName === exerciseName && l.weight > 0);
  if (!logs.length) return null;
  // Find the most recent date
  const lastDate = logs[logs.length - 1].date;
  const sets = logs.filter(l => l.date === lastDate).map(l => ({ weight: l.weight, reps: l.reps }));
  return { date: lastDate, sets };
}

// Returns PR: heaviest weight logged, and best estimated 1RM set
export function getPRDetails(exerciseName) {
  const prs = getPRs();
  return prs[exerciseName] || null;
}

// --- Smart progression engine ---
// Returns a weight/reps suggestion for the next session of an exercise
export function getProgressionSuggestion(exerciseName, repsTarget, setCount) {
  const lastSession = getLastSessionSets(exerciseName);
  if (!lastSession || !lastSession.sets.length) {
    return { suggestedWeight: null, change: 0, reason: 'First session — start at a comfortable weight', icon: '🆕', color: 'var(--text2)' };
  }

  const workingSets = lastSession.sets.filter(s => s.weight > 0 && s.reps > 0);
  if (!workingSets.length) return null;

  const lastWeight = workingSets[workingSets.length - 1].weight;

  // Parse target reps — handle "8", "6-8", "10/10", "15+15", "RPE only", "AMRAP"
  const targetNum = (() => {
    if (!repsTarget || repsTarget === 'AMRAP' || repsTarget === 'RPE only') return null;
    const m = String(repsTarget).match(/\d+/);
    return m ? parseInt(m[0]) : null;
  })();

  if (!targetNum) {
    // AMRAP or RPE-only: if they logged more reps than last time, suggest +2.5
    const lastAvgReps = workingSets.reduce((s, l) => s + l.reps, 0) / workingSets.length;
    const prev2Sessions = getRecentSessionWeights(exerciseName, 2);
    if (prev2Sessions.length >= 2 && prev2Sessions[1] >= prev2Sessions[0]) {
      return { suggestedWeight: lastWeight + 2.5, change: 2.5, reason: `Strong performance — add weight`, icon: '📈', color: 'var(--green)' };
    }
    return { suggestedWeight: lastWeight, change: 0, reason: `Keep same weight, push for more reps`, icon: '→', color: 'var(--text2)' };
  }

  const avgReps = workingSets.reduce((s, l) => s + l.reps, 0) / workingSets.length;
  const completedSets = workingSets.filter(s => s.reps >= targetNum).length;
  const totalSets = setCount || workingSets.length;
  const completionRate = completedSets / totalSets;

  const round = v => Math.round(v / 2.5) * 2.5;

  if (completionRate >= 1.0 && avgReps >= targetNum) {
    // Crushed it — increase
    const inc = 2.5;
    return {
      suggestedWeight: round(lastWeight + inc),
      change: inc,
      reason: `Hit all ${Math.round(avgReps)} reps last session — add ${inc}kg`,
      icon: '📈',
      color: 'var(--green)',
    };
  } else if (completionRate >= 0.75) {
    // Almost there — repeat
    return {
      suggestedWeight: lastWeight,
      change: 0,
      reason: `${completedSets}/${totalSets} sets completed — repeat this weight`,
      icon: '→',
      color: 'var(--yellow)',
    };
  } else {
    // Struggled — reduce slightly
    const dec = 2.5;
    return {
      suggestedWeight: Math.max(round(lastWeight - dec), 0),
      change: -dec,
      reason: `Tough last session — drop ${dec}kg to nail technique`,
      icon: '📉',
      color: 'var(--red)',
    };
  }
}

// --- Program cycle history ---
export function getCycles() {
  try { return JSON.parse(localStorage.getItem('programCycles') || '[]'); } catch { return []; }
}

export function saveCycle(cycle) {
  // cycle: { program, startDate, endDate, finalOrms, totalSessions, totalVolume, notes }
  const cycles = getCycles();
  cycles.push({ ...cycle, savedAt: new Date().toISOString() });
  localStorage.setItem('programCycles', JSON.stringify(cycles));
}

export function deleteCycle(idx) {
  const cycles = getCycles();
  cycles.splice(idx, 1);
  localStorage.setItem('programCycles', JSON.stringify(cycles));
}

// --- Weak Point Analyzer ---
// Muscle map (same as stats.js — needed for set counting)
const WP_MUSCLE_MAP = {
  'Back Squat': ['quads','glutes'], 'Hack Squat': ['quads','glutes'],
  'Hack Squat or Leg Press': ['quads','glutes'],
  'Leg Press': ['quads','glutes'], 'Single-Leg Leg Press': ['quads','glutes'],
  'Bulgarian Split Squat': ['quads','glutes'], 'Leg Extension': ['quads'],
  'Deadlift': ['hamstrings','back','glutes'], 'Reset Deadlift': ['hamstrings','back'],
  'Romanian Deadlift': ['hamstrings','glutes'],
  'Glute Ham Raise': ['hamstrings','glutes'], 'Nordic Curl': ['hamstrings'],
  'Lying Leg Curl': ['hamstrings'], 'Seated Leg Curl': ['hamstrings'],
  'Swiss Ball Leg Curl': ['hamstrings'],
  'Barbell Hip Thrust': ['glutes'], 'Barbell Hip Thrust or RDL': ['glutes','hamstrings'],
  'Seated Hip Abduction': ['glutes'],
  'Standing Calf Raise': ['calves'], 'Seated Calf Raise': ['calves'],
  'Eccentric-Accentuated Standing Calf Raise': ['calves'],
  'Barbell Bench Press': ['chest','triceps'], 'Dumbbell Bench Press': ['chest','triceps'],
  'Dumbbell Incline Press': ['chest','triceps'], 'Low Incline Dumbbell Press': ['chest','triceps'],
  'Low to High Cable Flye': ['chest'], 'Decline Bench Press': ['chest','triceps'],
  'Dip': ['chest','triceps'], 'Push Up': ['chest','triceps'],
  'Weighted Pull-Up': ['back','biceps'], 'Chin-Up': ['back','biceps'],
  'Weighted Chin-Up': ['back','biceps'],
  'Pronated Pulldown': ['back'], 'Wide Grip Lat Pulldown': ['back'],
  'Lat Pulldown': ['back'], 'Cable Pull-Over': ['back'],
  'Humble Row': ['back'], 'Chest-Supported T-Bar Row': ['back'],
  'Banded Chest-Supported T-Bar Row': ['back'], 'Pendlay Row': ['back'],
  'Dumbbell Row': ['back'], 'Cable Seated Row': ['back'],
  'Barbell Bent-Over Row': ['back'], 'Banded Barbell Row (explosive)': ['back'],
  'Overhead Press': ['shoulders','triceps'], 'Arnold Press': ['shoulders'],
  'Dumbbell Shoulder Press': ['shoulders','triceps'],
  'Egyptian Lateral Raise': ['shoulders'], 'Cable Lateral Raise': ['shoulders'],
  'Dumbbell Lateral Raise': ['shoulders'], 'Rope Face Pull': ['shoulders'],
  'Reverse Pec Deck': ['shoulders'],
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

// Recommended exercises per lagging muscle (best hypertrophy options)
const WP_RECOMMENDATIONS = {
  quads:      ['Hack Squat', 'Leg Press', 'Leg Extension', 'Bulgarian Split Squat'],
  hamstrings: ['Romanian Deadlift', 'Lying Leg Curl', 'Nordic Curl', 'Glute Ham Raise'],
  glutes:     ['Barbell Hip Thrust', 'Bulgarian Split Squat', 'Romanian Deadlift'],
  back:       ['Weighted Pull-Up', 'Barbell Bent-Over Row', 'Cable Seated Row', 'Humble Row'],
  chest:      ['Barbell Bench Press', 'Dumbbell Incline Press', 'Low to High Cable Flye'],
  shoulders:  ['Overhead Press', 'Egyptian Lateral Raise', 'Arnold Press', 'Rope Face Pull'],
  biceps:     ['Incline Dumbbell Curl', 'EZ Bar Curl', 'Hammer Curl'],
  triceps:    ['EZ Bar Skull Crusher', 'Overhead Tricep Extension', 'Tricep Pressdown'],
  calves:     ['Standing Calf Raise', 'Seated Calf Raise'],
  core:       ['AB Wheel Rollout', 'Hanging Leg Raise', 'Cable Crunch'],
  traps:      ['Hex Bar / Smith Machine Shrug', 'Cable Rope Upright Row'],
};

// Weekly set targets for intermediate hypertrophy (lower end of evidence-based ranges)
const WP_TARGETS = {
  quads: 12, hamstrings: 10, glutes: 10, back: 14,
  chest: 12, shoulders: 12, biceps: 8, triceps: 8,
  calves: 8, core: 6, traps: 4,
};

const WP_LABELS = {
  quads: 'Quads', hamstrings: 'Hamstrings', glutes: 'Glutes', back: 'Back',
  chest: 'Chest', shoulders: 'Shoulders', biceps: 'Biceps', triceps: 'Triceps',
  calves: 'Calves', core: 'Core', traps: 'Traps',
};

export function getWeakPointAnalysis() {
  const logs = getLogs();
  if (!logs.length) return null;

  // Last 4 weeks
  const cutoff = Date.now() - 28 * 86400000;
  const recent = logs.filter(l => new Date(l.date + 'T12:00:00').getTime() >= cutoff);
  if (!recent.length) return null;

  // Count unique training weeks (groups of 7 days from start)
  const dates = [...new Set(recent.map(l => l.date))].sort();
  const firstDate = new Date(dates[0] + 'T12:00:00');
  const lastDate = new Date(dates[dates.length - 1] + 'T12:00:00');
  const numWeeks = Math.max(1, Math.ceil((lastDate - firstDate + 1) / (7 * 86400000)));

  // Count sets per muscle group
  const muscleSets = {};
  recent.forEach(l => {
    const muscles = WP_MUSCLE_MAP[l.exerciseName] || [];
    muscles.forEach(m => { muscleSets[m] = (muscleSets[m] || 0) + 1; });
  });

  // Weekly average and comparison to target
  const results = Object.entries(WP_TARGETS).map(([muscle, target]) => {
    const totalSets = muscleSets[muscle] || 0;
    const weeklyAvg = totalSets / numWeeks;
    const ratio = weeklyAvg / target;
    const deficit = Math.max(0, target - weeklyAvg);
    let status = 'good';
    if (ratio < 0.5) status = 'critical';
    else if (ratio < 0.75) status = 'low';
    else if (ratio < 1.0) status = 'moderate';

    return {
      muscle,
      label: WP_LABELS[muscle],
      weeklyAvg: Math.round(weeklyAvg * 10) / 10,
      target,
      ratio: Math.round(ratio * 100) / 100,
      deficit: Math.round(deficit * 10) / 10,
      status,
      recommendations: WP_RECOMMENDATIONS[muscle] || [],
    };
  });

  // Sort worst first
  results.sort((a, b) => a.ratio - b.ratio);
  return { results, numWeeks };
}

// --- Set mode (drop set / pyramid) per exercise per day ---
export function getSetMode(exerciseName) {
  const today = getTodayDate();
  try {
    const modes = JSON.parse(localStorage.getItem('setModes') || '{}');
    return modes[today]?.[exerciseName] || 'normal';
  } catch { return 'normal'; }
}

export function saveSetMode(exerciseName, mode) {
  const today = getTodayDate();
  try {
    const modes = JSON.parse(localStorage.getItem('setModes') || '{}');
    if (!modes[today]) modes[today] = {};
    modes[today][exerciseName] = mode;
    // Keep only last 2 days to prevent buildup
    const days = Object.keys(modes).sort();
    if (days.length > 2) delete modes[days[0]];
    localStorage.setItem('setModes', JSON.stringify(modes));
  } catch {}
}

// --- Custom exercises ---
export function getCustomExercises() {
  try { return JSON.parse(localStorage.getItem('customExercises') || '[]'); } catch { return []; }
}

export function saveCustomExercise(exercise) {
  // exercise: { name, muscleGroup, equipment, notes }
  const list = getCustomExercises();
  const idx = list.findIndex(e => e.name.toLowerCase() === exercise.name.toLowerCase());
  if (idx >= 0) list[idx] = exercise; else list.push(exercise);
  localStorage.setItem('customExercises', JSON.stringify(list));
}

export function deleteCustomExercise(name) {
  const list = getCustomExercises().filter(e => e.name !== name);
  localStorage.setItem('customExercises', JSON.stringify(list));
}

// --- Workout override (manual day picker) ---
export function getWorkoutOverride() {
  try {
    return JSON.parse(localStorage.getItem('workoutOverride') || 'null');
  } catch { return null; }
}

export function setWorkoutOverride(override) {
  // override: { weekIdx: 0-9, workoutIdx: 0-4 } or null to clear
  if (override === null) {
    localStorage.removeItem('workoutOverride');
  } else {
    localStorage.setItem('workoutOverride', JSON.stringify(override));
  }
}

// --- Active program ---
export function getActiveProgram() {
  return localStorage.getItem('activeProgram') || 'fullbody';
}

export function setActiveProgram(name) {
  localStorage.setItem('activeProgram', name);
}
