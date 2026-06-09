// Push Pull Legs — Custom 10-Week Program
// 5 days/week: Sun=Legs A, Mon=Push A, Tue=Pull A, Wed=Legs B, Thu=Push B (Upper hybrid)
// Fri/Sat: Rest
// Goal: Recomposition — muscle gain + fat loss. Lagging legs emphasis.
// Block 1 (Wk 1-4): Volume. Block 2 (Wk 5-8): Intensity + top sets. Wk 9: Deload. Wk 10: AMRAPs.

const pct = (lift, p) => ({ type: 'pct', lift, p });
const rpe = v => ({ type: 'rpe', v });
const amrap = (lift, p) => ({ type: 'amrap', lift, p });
const R = { short: 90, med: 120, comp: 180, heavy: 240 };
function ex(name, wu, sets, reps, intensity, rest, notes, opts = {}) {
  return { name, wu, sets, reps, intensity, rest, notes, ...opts };
}

// ─── WORKOUT TEMPLATES ─────────────────────────────────────────────────────

// A = Legs A (Quad + Glute dominant)
// B = Push A (Chest + Shoulders + Triceps)
// C = Pull A (Back + Biceps)
// D = Legs B (Posterior chain — Hamstring + Glute dominant)
// E = Upper (Push/Pull hybrid — Arms, Shoulders, Back accessories)

// ─── BLOCK 1: WEEKS 1–4 ───────────────────────────────────────────────────

function legsA_b1(sqPct, sqReps, sqSets, rpeLevel) {
  return [
    ex('Back Squat', 3, sqSets, String(sqReps), pct('squat', sqPct), R.comp,
      "Sit back and down, 15° toe flare, drive knees out. LEGS FOCUS: full depth, controlled descent."),
    ex('Hack Squat or Leg Press', 2, 4, '10', rpe(rpeLevel), R.med,
      "LEGS FOCUS: feet shoulder-width. Feel quad stretch at bottom — go deep. Slow 3-sec eccentric.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Bulgarian Split Squat', 1, 3, '10/10', rpe(rpeLevel), R.med,
      "LEGS FOCUS: rear foot elevated. Torso upright. Knee tracks toe. Drive through front heel.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Leg Extension', 1, 3, '15', rpe(rpeLevel), R.short,
      "LEGS FOCUS: squeeze quad hard at top. 2-sec hold at peak. Slow 3-sec descent.", { tempo: '3-2-1', extra: 'legs' }),
    ex('Standing Calf Raise', 1, 4, '12', rpe(7), R.short,
      "Full range of motion — stretch at bottom, rise onto toes. 2-sec pause at bottom."),
    ex('Seated Hip Abduction', 1, 3, '20', rpe(7), R.short,
      "Focus on driving knees apart. Glute medius activation."),
  ];
}

function legsB_b1(dlPct, dlReps, dlSets, rpeLevel) {
  return [
    ex('Deadlift', 3, dlSets, String(dlReps), pct('deadlift', dlPct), R.heavy,
      "Brace lats, chest tall, hips high. Pull slack before lifting. LEGS FOCUS: feel hamstrings load at bottom."),
    ex('Romanian Deadlift', 2, 4, '10', rpe(rpeLevel), R.med,
      "LEGS FOCUS: hinge at hips, soft knees. Bar slides down legs. Feel hamstrings stretch. 3-sec eccentric.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Lying Leg Curl', 1, 4, '12', rpe(rpeLevel), R.short,
      "LEGS FOCUS: 3-sec eccentric. Squeeze hamstrings to curl. Don't let hips lift.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Barbell Hip Thrust', 2, 4, '12', rpe(rpeLevel), R.med,
      "Drive hips to full extension. Squeeze glutes hard at top. 1-sec hold.", { extra: 'legs' }),
    ex('Seated Leg Curl', 1, 3, '15', rpe(rpeLevel), R.short,
      "LEGS FOCUS: full stretch at bottom, strong contraction at top. 3-sec eccentric.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Seated Calf Raise', 1, 4, '15', rpe(7), R.short,
      "Slow eccentric — 3 sec down. Full stretch at bottom. Targets soleus."),
  ];
}

function pushA_b1(bPct, bReps, bSets, rpeLevel) {
  return [
    ex('Barbell Bench Press', 3, bSets, String(bReps), pct('bench', bPct), R.comp,
      "1-2 sec pause on chest. Elbows at 45°. Explode off chest. Squeeze shoulder blades."),
    ex('Dumbbell Incline Press', 2, 3, '10', rpe(rpeLevel), R.med,
      "~30° incline. Full ROM. Squeeze upper chest at top."),
    ex('Cable Lateral Raise', 0, 4, '15', rpe(rpeLevel), R.short,
      "Raise dumbbell out not up. Pinky slightly higher than thumb. Mind-muscle with side delt."),
    ex('Overhead Press', 2, 3, '10', pct('ohp', 70), R.med,
      "Squeeze glutes. Press bar up and slightly back. Clear head out of the way."),
    ex('Low to High Cable Flye', 0, 3, '15', rpe(rpeLevel), R.short,
      "Palms face ceiling → rotate to floor as you pull elbows up and in. Chest stretch."),
    ex('Tricep Pressdown', 0, 3, '15', rpe(rpeLevel), R.short,
      "Elbows fixed at sides. Squeeze triceps fully at bottom."),
    ex('EZ Bar Skull Crusher', 1, 3, '12', rpe(rpeLevel), R.short,
      "Arc bar back behind head. Full stretch on tricep long head."),
  ];
}

function pullA_b1(rpeLevel) {
  return [
    ex('Weighted Pull-Up', 2, 4, '6', rpe(rpeLevel), R.med,
      "1.5× shoulder-width pronated grip. Pull chest to bar. Full dead hang at bottom."),
    ex('Barbell Bent-Over Row', 2, 4, '8', rpe(rpeLevel), R.med,
      "Hip hinge ~45°. Pull bar to lower chest. Squeeze shoulder blades. 1-sec hold."),
    ex('Cable Seated Row (wide grip)', 1, 3, '12', rpe(rpeLevel), R.med,
      "Wide grip — targets mid-back and rhomboids. Full protraction at front."),
    ex('Cable Pull-Over', 1, 3, '15', rpe(rpeLevel), R.med,
      "Lean 45°. Pull straight down. Lat focus. Arms slightly bent."),
    ex('Dumbbell Curl', 0, 3, '12', rpe(rpeLevel), R.short,
      "Alternate arms. Supinate at top. Full extension at bottom."),
    ex('Hammer Curl', 0, 3, '10', rpe(rpeLevel), R.short,
      "3-sec eccentric. Brachialis and brachioradialis focus.", { tempo: '3-1-1' }),
    ex('Rope Face Pull', 0, 3, '20', rpe(7), R.short,
      "Pull elbows up and out. External rotation. Rear delt + rotator cuff."),
  ];
}

function upperHybrid_b1(ohpPct, ohpReps, rpeLevel) {
  return [
    ex('Overhead Press', 3, 4, String(ohpReps), pct('ohp', ohpPct), R.med,
      "Squeeze glutes to keep torso upright. Press up and slightly back. Clear head."),
    ex('Chin-Up', 1, 3, '8', rpe(rpeLevel), R.med,
      "Supinated shoulder-width grip. Full dead hang. Pull with lats, not just arms."),
    ex('Arnold Press', 0, 3, '12', rpe(rpeLevel), R.med,
      "Start palms in, elbows forward. Rotate palms forward as you press. Hits all delt heads."),
    ex('Dumbbell Lateral Raise', 0, 4, '15', rpe(rpeLevel), R.short,
      "Slight forward lean. Raise out not up. Mind-muscle with middle delt."),
    ex('EZ Bar Curl', 1, 3, '10', rpe(rpeLevel), R.short,
      "Full ROM. Don't swing. Squeeze at top."),
    ex('Overhead Tricep Extension', 0, 3, '12', rpe(rpeLevel), R.short,
      "Full overhead stretch. Targets long head of tricep."),
    ex('Cable Crunch', 1, 3, '15', rpe(7), R.short,
      "Focus on spinal flexion. Avoid yanking with arms."),
  ];
}

// WEEK 1
const PPL_W1 = {
  week: 1, block: 1, label: 'Week 1',
  workouts: [
    legsA_b1(77.5, 6, 3, 7),
    pushA_b1(80, 5, 3, 7),
    pullA_b1(7),
    legsB_b1(80, 4, 3, 7),
    upperHybrid_b1(70, 8, 7),
  ]
};

// WEEK 2
const PPL_W2 = {
  week: 2, block: 1, label: 'Week 2',
  workouts: [
    legsA_b1(77.5, 8, 4, 7),
    pushA_b1(82.5, 5, 3, 7),
    pullA_b1(7),
    legsB_b1(80, 5, 4, 7),
    upperHybrid_b1(72.5, 8, 7),
  ]
};

// WEEK 3
const PPL_W3 = {
  week: 3, block: 1, label: 'Week 3',
  workouts: [
    legsA_b1(80, 5, 4, 8),
    pushA_b1(85, 3, 3, 8),
    pullA_b1(8),
    legsB_b1(82.5, 4, 4, 8),
    upperHybrid_b1(75, 6, 8),
  ]
};

// WEEK 4
const PPL_W4 = {
  week: 4, block: 1, label: 'Week 4',
  workouts: [
    legsA_b1(80, 6, 4, 8),
    pushA_b1(85, 4, 4, 8),
    pullA_b1(8),
    legsB_b1(82.5, 5, 4, 8),
    upperHybrid_b1(77.5, 6, 8),
  ]
};

// ─── BLOCK 2: WEEKS 5–8 (Top Set + Back-Off) ─────────────────────────────

function legsA_b2(sqTopPct, sqTopReps, sqBoPct, sqBoReps, rpeLevel) {
  return [
    ex('Back Squat — TOP SET', 3, 1, String(sqTopReps), pct('squat', sqTopPct), R.comp,
      "Max effort on this set. Perfect technique. Push for a PR rep count!", { setType: 'topset' }),
    ex('Back Squat — Back Off', 0, 2, String(sqBoReps), pct('squat', sqBoPct), R.comp,
      "Lighter — maintain speed and technique.", { setType: 'backoff' }),
    ex('Hack Squat or Leg Press', 2, 4, '8', rpe(rpeLevel), R.med,
      "LEGS FOCUS: heavier now. Full depth. Control the eccentric.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Bulgarian Split Squat', 1, 4, '8/8', rpe(rpeLevel), R.med,
      "LEGS FOCUS: add load (hold DBs or use smith). Knee tracks toe. Full depth.", { extra: 'legs' }),
    ex('Leg Extension (drop set)', 1, 3, '12+8', rpe(9), R.short,
      "12 reps full weight → drop 30% → 8 more reps without rest. Quad burn.", { setType: 'dropset', extra: 'legs' }),
    ex('Standing Calf Raise', 1, 4, '10', rpe(8), R.short,
      "Add weight each week. Full ROM. 2-sec pause at bottom."),
    ex('Seated Hip Abduction', 1, 3, '20', rpe(7), R.short,
      "Drive knees out. Glute medius activation."),
  ];
}

function legsB_b2(dlTopPct, dlTopReps, dlBoPct, dlBoReps, rpeLevel) {
  return [
    ex('Deadlift — TOP SET', 3, 1, String(dlTopReps), pct('deadlift', dlTopPct), R.heavy,
      "Max effort. Brace hard. Belt if needed. Push for a PR!", { setType: 'topset' }),
    ex('Reset Deadlift — Back Off', 0, 2, String(dlBoReps), pct('deadlift', dlBoPct), R.heavy,
      "Reset from floor. Perfect technique.", { setType: 'backoff' }),
    ex('Romanian Deadlift', 2, 4, '8', rpe(rpeLevel), R.med,
      "LEGS FOCUS: heavier now. 3-sec eccentric. Hamstrings fully loaded.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Lying Leg Curl', 1, 4, '10', rpe(rpeLevel), R.short,
      "LEGS FOCUS: 3-sec eccentric. Squeeze hard at top.", { tempo: '3-1-1', extra: 'legs' }),
    ex('Barbell Hip Thrust', 2, 4, '10', rpe(rpeLevel), R.med,
      "Heavy now. Drive hips up fully. Squeeze glutes at top. 1-sec hold.", { extra: 'legs' }),
    ex('Nordic Curl (assisted)', 0, 3, '6', rpe(8), R.med,
      "LEGS FOCUS: eccentric-only if needed. Slowly lower body — hamstrings working hard!", { extra: 'legs' }),
    ex('Seated Calf Raise', 1, 4, '12', rpe(8), R.short,
      "3-sec eccentric. Full stretch at bottom."),
  ];
}

function pushA_b2(bTopPct, bTopReps, bBoPct, bBoReps, rpeLevel) {
  return [
    ex('Barbell Bench Press — TOP SET', 3, 1, String(bTopReps), pct('bench', bTopPct), R.comp,
      "Max effort. Explode off chest. Push for a PR!", { setType: 'topset' }),
    ex('Barbell Bench Press — Back Off', 0, 3, String(bBoReps), pct('bench', bBoPct), R.comp,
      "Lighter. Controlled reps. Squeeze chest.", { setType: 'backoff' }),
    ex('Low Incline Dumbbell Press', 0, 4, '10', rpe(rpeLevel), R.med,
      "15° incline. Constant tension. Tuck elbows slightly."),
    ex('Cable Lateral Raise', 0, 4, '15', rpe(rpeLevel), R.short,
      "Unilateral. Cable keeps tension through full ROM. Slow eccentric.", { tempo: '2-0-1' }),
    ex('Overhead Press', 2, 4, '6', pct('ohp', 80), R.med,
      "Squeeze glutes. Press up and slightly back."),
    ex('Tricep Pressdown', 0, 4, '12', rpe(rpeLevel), R.short,
      "Elbows pinned. Full squeeze at bottom."),
    ex('Overhead Tricep Extension', 0, 3, '12', rpe(rpeLevel), R.short,
      "Full stretch at top. Long head emphasis."),
  ];
}

function pullA_b2(rpeLevel) {
  return [
    ex('Weighted Pull-Up', 2, 4, '5', rpe(rpeLevel), R.med,
      "Add weight each week. Full dead hang. Chest to bar."),
    ex('Banded Barbell Row (explosive)', 2, 4, '8', rpe(rpeLevel), R.med,
      "Explosive pull. Band adds accommodating resistance. Drive elbows back hard."),
    ex('Cable Seated Row (close grip)', 1, 4, '10', rpe(rpeLevel), R.med,
      "Close grip — more lat involvement. Full protraction at front."),
    ex('Cable Pull-Over', 1, 3, '15', rpe(rpeLevel), R.med,
      "Lat focus. Arms slightly bent. Lean 45°."),
    ex('Supinated EZ Bar Curl', 1, 3, '10+2', rpe(10), R.short,
      "10 controlled reps + 2 cheat reps with momentum.", { setType: 'dropset' }),
    ex('Cable Single-Arm Curl', 0, 3, '10', rpe(rpeLevel), R.short,
      "Elbow behind torso for max bicep stretch."),
    ex('Rope Face Pull', 0, 3, '20', rpe(7), R.short,
      "Pull elbows up and out. External rotation. Rear delt + rotator cuff."),
  ];
}

function upperHybrid_b2(ohpTopPct, ohpTopReps, rpeLevel) {
  return [
    ex('Overhead Press — TOP SET', 3, 1, String(ohpTopReps), pct('ohp', ohpTopPct), R.med,
      "Max effort. Squeeze glutes, press up and slightly back.", { setType: 'topset' }),
    ex('Overhead Press — Back Off', 0, 3, '6', pct('ohp', 75), R.med,
      "Lighter. Speed reps. Stay tight.", { setType: 'backoff' }),
    ex('Weighted Chin-Up', 1, 4, '5', rpe(rpeLevel), R.med,
      "Add weight. Full dead hang. Supinated grip. Pull with lats."),
    ex('Arnold Press', 0, 3, '10', rpe(rpeLevel), R.med,
      "All delt heads. Start palms in, rotate to face forward as you press."),
    ex('Egyptian Lateral Raise', 1, 3, '10', rpe(rpeLevel), R.short,
      "Lean away from cable. 2-sec eccentric. Side delt peak.", { tempo: '2-0-1' }),
    ex('EZ Bar Curl 21s', 1, 3, '7/7/7', rpe(rpeLevel), R.short,
      "7 bottom half + 7 top half + 7 full ROM. No rest between portions."),
    ex('EZ Bar Skull Crusher', 1, 3, '10', rpe(rpeLevel), R.short,
      "Arc bar behind head. Tricep long head stretch."),
    ex('AB Wheel Rollout', 1, 3, '8', rpe(8), R.short,
      "Squeeze glutes. Don't pull from arms. Full extension if possible."),
  ];
}

// WEEK 5
const PPL_W5 = {
  week: 5, block: 2, label: 'Week 5 — Block 2',
  workouts: [
    legsA_b2(87.5, '3-5', 75, 5, 8),
    pushA_b2(87.5, '3', 77.5, 5, 8),
    pullA_b2(8),
    legsB_b2(90, 2, 80, 3, 8),
    upperHybrid_b2(82.5, 4, 8),
  ]
};

// WEEK 6
const PPL_W6 = {
  week: 6, block: 2, label: 'Week 6 — Block 2',
  workouts: [
    legsA_b2(90, 2, 80, 4, 8),
    pushA_b2(85, 4, 77.5, 6, 8),
    pullA_b2(8),
    legsB_b2(85, 4, 75, 5, 8),
    upperHybrid_b2(85, 4, 8),
  ]
};

// WEEK 7
const PPL_W7 = {
  week: 7, block: 2, label: 'Week 7 — Block 2',
  workouts: [
    legsA_b2(80, '6-8', 70, 8, 8),
    pushA_b2(75, 10, 70, 8, 8),
    pullA_b2(8),
    legsB_b2(80, 6, 70, 6, 8),
    upperHybrid_b2(80, 6, 8),
  ]
};

// WEEK 8
const PPL_W8 = {
  week: 8, block: 2, label: 'Week 8 — Block 2',
  workouts: [
    legsA_b2(92.5, 2, 85, 2, 9),
    pushA_b2(90, 2, 80, 3, 9),
    pullA_b2(9),
    legsB_b2(95, 2, 85, 3, 9),
    upperHybrid_b2(87.5, 3, 9),
  ]
};

// ─── WEEK 9: DELOAD ────────────────────────────────────────────────────────
const PPL_W9 = {
  week: 9, block: 3, label: 'Week 9 — Deload',
  workouts: [
    // Legs A deload
    [
      ex('Back Squat', 3, 3, '5', pct('squat', 70), R.comp, "DELOAD: Light and fast. Technique focus. Should feel easy."),
      ex('Leg Press', 1, 3, '12', rpe(6), R.med, "DELOAD: Moderate weight. Focus on feel."),
      ex('Leg Extension', 1, 3, '15', rpe(6), R.short, "DELOAD: Light. Quad activation."),
      ex('Standing Calf Raise', 1, 3, '12', rpe(6), R.short, "DELOAD: Light. Full ROM."),
    ],
    // Push A deload
    [
      ex('Barbell Bench Press', 3, 3, '5', pct('bench', 70), R.comp, "DELOAD: Speed reps. Explosive technique. Should feel easy."),
      ex('Dumbbell Incline Press', 1, 3, '12', rpe(6), R.med, "DELOAD: Light. Technique practice."),
      ex('Dumbbell Lateral Raise', 0, 3, '15', rpe(6), R.short, "DELOAD: Light. Mind-muscle connection."),
      ex('Tricep Pressdown', 0, 3, '15', rpe(6), R.short, "DELOAD: Light. Full squeeze."),
    ],
    // Pull A deload
    [
      ex('Pull-Up (bodyweight)', 1, 3, '6', rpe(6), R.med, "DELOAD: Bodyweight only. Full ROM."),
      ex('Dumbbell Row', 1, 3, '12', rpe(6), R.med, "DELOAD: Light. Squeeze at top."),
      ex('Cable Seated Row', 1, 3, '12', rpe(6), R.med, "DELOAD: Light. Full protraction."),
      ex('Dumbbell Curl', 0, 3, '12', rpe(6), R.short, "DELOAD: Light. Full ROM."),
    ],
    // Legs B deload
    [
      ex('Deadlift', 3, 3, '3', pct('deadlift', 70), R.heavy, "DELOAD: Explosive reps. Should feel light and crisp."),
      ex('Romanian Deadlift', 1, 3, '12', rpe(6), R.med, "DELOAD: Hamstring activation. 3-sec eccentric."),
      ex('Lying Leg Curl', 1, 3, '12', rpe(6), R.short, "DELOAD: Light. Focus on feel."),
      ex('Seated Calf Raise', 1, 3, '15', rpe(6), R.short, "DELOAD: Full ROM. Light."),
    ],
    // Upper deload
    [
      ex('Overhead Press', 2, 3, '6', pct('ohp', 70), R.med, "DELOAD: Light. Practice technique for AMRAPs."),
      ex('Chin-Up (bodyweight)', 1, 3, '8', rpe(6), R.med, "DELOAD: Full ROM. Bodyweight."),
      ex('Arnold Press', 0, 3, '10', rpe(6), R.med, "DELOAD: Very light. Shoulder mobility."),
      ex('EZ Bar Curl', 1, 2, '12', rpe(6), R.short, "DELOAD: Light. Full ROM."),
      ex('Tricep Pressdown', 0, 2, '15', rpe(6), R.short, "DELOAD: Light. Full squeeze."),
    ],
  ]
};

// ─── WEEK 10: AMRAPs ───────────────────────────────────────────────────────
const PPL_W10 = {
  week: 10, block: 3, label: 'Week 10 — AMRAPs',
  workouts: [
    // Legs A AMRAP
    [
      ex('Back Squat — AMRAP', 3, 1, 'AMRAP', amrap('squat', 90), R.comp,
        "AS MANY REPS AS POSSIBLE at 90% 1RM. Use a spotter! Gives new estimated 1RM.", { setType: 'amrap' }),
      ex('Back Squat — Back Off', 0, 2, '5', pct('squat', 75), R.comp, "Controlled back-off sets.", { setType: 'backoff' }),
      ex('Hack Squat or Leg Press', 2, 4, '10', rpe(8), R.med, "Push hard — final session.", { extra: 'legs' }),
      ex('Bulgarian Split Squat', 1, 3, '10/10', rpe(8), R.med, "Final session — full effort.", { extra: 'legs' }),
      ex('Leg Extension', 1, 3, '15', rpe(9), R.short, "Final session — max burn.", { extra: 'legs' }),
      ex('Standing Calf Raise', 1, 4, '12', rpe(8), R.short, "Final session. Full ROM."),
    ],
    // Push AMRAP
    [
      ex('Barbell Bench Press — AMRAP', 3, 1, 'AMRAP', amrap('bench', 90), R.comp,
        "AS MANY REPS AS POSSIBLE at 90% 1RM. Use a spotter!", { setType: 'amrap' }),
      ex('Barbell Bench Press — Back Off', 0, 2, '5', pct('bench', 75), R.comp, "Controlled back-off.", { setType: 'backoff' }),
      ex('Dumbbell Incline Press', 1, 3, '12', rpe(9), R.med, "Final session — push hard."),
      ex('Cable Lateral Raise', 0, 4, '15', rpe(8), R.short, "Final session."),
      ex('Overhead Press', 2, 3, '8', pct('ohp', 75), R.med, "Final session."),
      ex('Tricep Pressdown', 0, 3, '15', rpe(9), R.short, "Final session — max squeeze."),
    ],
    // Pull final
    [
      ex('Weighted Pull-Up', 2, 3, '6', rpe(9), R.med, "Final session — heavy and hard."),
      ex('Barbell Bent-Over Row', 2, 4, '8', rpe(9), R.med, "Final session — push hard."),
      ex('Cable Seated Row', 1, 4, '10', rpe(9), R.med, "Final session."),
      ex('Supinated EZ Bar Curl', 1, 3, '10+2', rpe(10), R.short, "Final session — max effort.", { setType: 'dropset' }),
      ex('Hammer Curl', 0, 3, '10', rpe(10), R.short, "Final session — 3-sec eccentric.", { tempo: '3-1-1' }),
    ],
    // Legs B AMRAP
    [
      ex('Deadlift — AMRAP', 3, 1, 'AMRAP', amrap('deadlift', 90), R.heavy,
        "AS MANY REPS AS POSSIBLE at 90% 1RM. Belt if needed!", { setType: 'amrap' }),
      ex('Reset Deadlift — Back Off', 3, 2, '4', pct('deadlift', 75), R.heavy, "Controlled reps.", { setType: 'backoff' }),
      ex('Romanian Deadlift', 2, 3, '10', rpe(8), R.med, "Final session.", { extra: 'legs' }),
      ex('Lying Leg Curl', 1, 3, '12', rpe(9), R.short, "Final session.", { extra: 'legs' }),
      ex('Barbell Hip Thrust', 2, 3, '12', rpe(9), R.med, "Final session — max squeeze.", { extra: 'legs' }),
    ],
    // Upper final
    [
      ex('Overhead Press — AMRAP', 3, 1, 'AMRAP', amrap('ohp', 87.5), R.med,
        "AS MANY REPS AS POSSIBLE at 87.5% 1RM. Final push!", { setType: 'amrap' }),
      ex('Overhead Press — Back Off', 0, 3, '6', pct('ohp', 72.5), R.med, "Controlled back-off.", { setType: 'backoff' }),
      ex('Weighted Chin-Up', 1, 3, '6', rpe(9), R.med, "Final session — heavy."),
      ex('Arnold Press', 0, 3, '10', rpe(9), R.med, "Final session."),
      ex('EZ Bar Curl', 1, 3, '10', rpe(10), R.short, "Final session — max effort."),
      ex('EZ Bar Skull Crusher', 1, 3, '10', rpe(10), R.short, "Final session."),
    ],
  ]
};

// ─── EXPORTS ───────────────────────────────────────────────────────────────
export const PPL_PROGRAM = [
  PPL_W1, PPL_W2, PPL_W3, PPL_W4,
  PPL_W5, PPL_W6, PPL_W7, PPL_W8,
  PPL_W9, PPL_W10,
];

export const PPL_WORKOUT_NAMES = [
  'Legs A — Quad & Glute Focus',
  'Push A — Chest, Shoulders, Triceps',
  'Pull A — Back & Biceps',
  'Legs B — Posterior Chain',
  'Upper — Shoulders, Arms & Back',
];

export function getPPLTodayWorkout(programStartDate) {
  const start = new Date(programStartDate);
  const today = new Date();
  start.setHours(0,0,0,0); today.setHours(0,0,0,0);
  const diffDays = Math.floor((today - start) / 86400000);
  if (diffDays < 0) return null;
  const weekIdx = Math.floor(diffDays / 7);
  if (weekIdx >= PPL_PROGRAM.length) return { finished: true };
  const dayOfWeek = today.getDay();
  if (dayOfWeek >= 5) return { rest: true };
  const weekData = PPL_PROGRAM[weekIdx];
  return {
    weekData,
    workoutIdx: dayOfWeek,
    exercises: weekData.workouts[dayOfWeek],
    name: PPL_WORKOUT_NAMES[dayOfWeek],
    weekNum: weekIdx + 1,
  };
}
