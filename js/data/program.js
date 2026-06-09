// Full Body 5x/Week — Jeff Nippard (10 weeks)
// Recovery fix: Leg Press removed from B days (too close to Sunday squats),
// Bulgarian Split Squat removed from E days (day after deadlifts).
// Extra leg volume kept only on C (Tue = 2 days after squats). Kegel warmup on A/D.
// Week starts Sunday. Days: 0=Sun(A), 1=Mon(B), 2=Tue(C), 3=Wed(D), 4=Thu(E)

// Intensity helpers
const pct = (lift, p) => ({ type: 'pct', lift, p });
const rpe = v => ({ type: 'rpe', v });
const amrap = (lift, p) => ({ type: 'amrap', lift, p });

// Rest helpers (seconds)
const R = { short: 90, med: 120, comp: 180, heavy: 240 };

// --- EXERCISE BUILDERS ---
function ex(name, wu, sets, reps, intensity, rest, notes, opts = {}) {
  return { name, wu, sets, reps, intensity, rest, notes, ...opts };
}

// Kegel warmup (added to workouts A and D)
const KEGEL_WARMUP = {
  name: 'Core Activation / Pelvic Floor',
  category: 'pelvic_floor',
  wu: 0,
  sets: [
    { label: 'Kegels 3×10 × 3s hold', holdSec: 3, reps: 10, rounds: 3 },
    { label: 'Reverse Kegels 3×10 × 3s', holdSec: 3, reps: 10, rounds: 3 },
    { label: 'Long holds 1×5 × 10s', holdSec: 10, reps: 5, rounds: 1 },
  ],
  notes: 'Contract PC muscle as if stopping urination (kegel), then bear down / push out (reverse kegel). Do before squatting — activates pelvic floor and core.'
};

// --- WEEK 1 ---
const W1_A = [
  KEGEL_WARMUP,
  ex('Back Squat', 3, 4, '4', pct('squat', 77.5), R.comp, "Sit back and down, 15° toe flare, drive your knees out laterally"),
  ex('Dumbbell Incline Press', 2, 3, '8', rpe(8), R.med, "~45° incline, mind muscle connection with upper pecs"),
  ex('Lying Leg Curl', 1, 3, '10', rpe(6), R.short, "Focus on squeezing your hamstrings to move the weight", { tempo: '3-1-1' }),
  ex('Pronated Pulldown', 1, 3, '10', rpe(7), R.med, "Pull your elbows down and in"),
  ex('Supinated EZ Bar Curl', 1, 3, '15+15', rpe(9), R.short, "Dropset: drop weight ~50% on second 15 reps. 30 reps total.", { setType: 'dropset' }),
  ex('Hanging Leg Raise', 1, 3, '12', rpe(7), R.short, "Roll hips up as you squeeze lower abs, avoid swinging"),
];

const W1_B = [
  ex('Barbell Bench Press', 3, 3, '3', pct('bench', 85), R.comp, "Set up a comfortable arch, 1-2 second pause on chest, explode off chest with max force"),
  ex('Low to High Cable Flye', 0, 3, '15', rpe(8), R.short, "Palms facing ceiling → rotate to floor as you pull elbows up and in"),
  ex('Barbell Hip Thrust or RDL', 2, 3, '12', rpe(6), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority. Mind muscle connection."),
  ex('Chest-Supported T-Bar Row', 1, 3, '15', rpe(6), R.med, "Squeeze shoulder blades together at top, let them round forward at bottom"),
  ex('Arnold Press', 0, 3, '10', rpe(7), R.med, "Start elbows in front, palms in. Rotate palms forward as you press."),
  ex('Tricep Pressdown', 0, 3, '15', rpe(7), R.short, "Focus on squeezing your triceps to move the weight"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(6), R.short, "Shrug up and in, pull shoulders up to ears!"),
];

const W1_C = [
  ex('Weighted Pull-Up', 2, 3, '6', rpe(8), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Humble Row', 1, 3, '10', rpe(8), R.med, "Pin your lower chest against the top of an incline bench. Full protraction at bottom."),
  ex('Leg Press', 2, 4, '15', rpe(6), R.med, "LEGS FOCUS: vary foot placement each set (low/mid/high). Don't let lower back round.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(7), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Standing Calf Raise', 1, 4, '8', rpe(7), R.short, "1-2 second pause at the bottom of each rep"),
  ex('Cable Rope Upright Row', 0, 3, '10', rpe(7), R.short, "Focus on squeezing the upper traps at the top"),
  ex('Hammer Curl', 0, 3, '8', rpe(9), R.short, "3-second eccentric. Arch the dumbbell out not up, focus on squeezing forearms", { tempo: '3-1-1' }),
];

const W1_D = [
  KEGEL_WARMUP,
  ex('Deadlift', 3, 4, '2', pct('deadlift', 85), R.heavy, "Brace your lats, chest tall, hips high, pull the slack out of the bar prior to moving"),
  ex('Dip', 2, 3, '10', rpe(8), R.med, "Tuck elbows at 45°, lean torso forward 15°, shoulder-width or slightly wider grip"),
  ex('Glute Ham Raise', 0, 3, '10', rpe(6), R.short, "Keep lower back straight, use hamstrings to curl your body up"),
  ex('Leg Extension', 1, 3, '15', rpe(7), R.short, "Focus on squeezing your quads to move the weight", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(7), R.med, "Lean torso at 45°, focus on pulling weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(7), R.short, "Raise dumbbell out not up, mind muscle connection with middle fibers"),
  ex('Rope Face Pull', 1, 3, '20', rpe(7), R.short, "Pull elbows up and out, squeeze shoulder blades together"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(7), R.short, "Arc the bar back behind your head, keep constant tension on triceps"),
];

const W1_E = [
  ex('Overhead Press', 3, 4, '6', pct('ohp', 75), R.med, "Squeeze glutes to keep torso upright, clear head out of the way, press up and slightly back"),
  ex('Egyptian Lateral Raise', 1, 3, '8', rpe(8), R.short, "2-second eccentric. Lean away from the cable, focus on squeezing your delts", { tempo: '2-0-1' }),
  ex('Cable Seated Row', 1, 3, '12', rpe(7), R.med, "Focus on squeezing shoulder blades together, pull with elbows down and in"),
  ex('Seated Hip Abduction', 1, 3, '20', rpe(7), R.short, "Focus on driving your knees out"),
  ex('Incline Dumbbell Curl', 1, 2, '10', rpe(8), R.short, "Brace upper back against bench, 45° incline, keep shoulders back as you curl"),
  ex('Bicycle Crunch', 1, 3, '15', rpe(7), R.short, "Focus on flexing and rotating your spine, left elbow to right knee and vice versa"),
  ex('Standing Calf Raise', 1, 4, '12', rpe(7), R.short, "Press onto your toes"),
  ex('Push Up', 0, 2, 'RPE only', rpe(6), R.short, "Perform as many reps as you can to hit target RPE"),
];

// --- WEEK 2 ---
const W2_A = [
  KEGEL_WARMUP,
  ex('Back Squat', 3, 3, '6', pct('squat', 77.5), R.comp, "Sit back and down, 15° toe flare, drive your knees out laterally"),
  ex('Dumbbell Incline Press', 2, 3, '8', rpe(8), R.med, "~45° incline, mind muscle connection with upper pecs"),
  ex('Lying Leg Curl', 1, 3, '10', rpe(6), R.short, "Focus on squeezing your hamstrings to move the weight", { tempo: '3-1-1' }),
  ex('Pronated Pulldown', 1, 3, '10', rpe(7), R.med, "Pull your elbows down and in"),
  ex('Supinated EZ Bar Curl', 1, 3, '15+15', rpe(9), R.short, "Dropset. Drop weight ~50% on second 15 reps.", { setType: 'dropset' }),
  ex('Hanging Leg Raise', 1, 3, '12', rpe(7), R.short, "Roll hips up as you squeeze lower abs, avoid swinging"),
];

const W2_B = [
  ex('Barbell Bench Press', 3, 3, '5', pct('bench', 80), R.comp, "Set up a comfortable arch, 1-2 second pause on chest, explode off chest with max force"),
  ex('Low to High Cable Flye', 0, 3, '15', rpe(8), R.short, "Palms facing ceiling → rotate to floor as you pull elbows up and in"),
  ex('Barbell Hip Thrust or RDL', 2, 3, '12', rpe(6), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority."),
  ex('Chest-Supported T-Bar Row', 1, 3, '15', rpe(6), R.med, "Squeeze shoulder blades at top, round forward at bottom"),
  ex('Arnold Press', 0, 3, '10', rpe(7), R.med, "Start elbows in front, palms in. Rotate palms forward as you press."),
  ex('Tricep Pressdown', 0, 3, '15', rpe(7), R.short, "Focus on squeezing your triceps to move the weight"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(6), R.short, "Shrug up and in, pull shoulders up to ears!"),
];

const W2_C = [
  ex('Weighted Pull-Up', 2, 3, '6', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Humble Row', 1, 3, '10', rpe(8), R.med, "Pin lower chest against incline bench. Full protraction at bottom."),
  ex('Leg Press', 2, 4, '15', rpe(6), R.med, "LEGS FOCUS: vary foot placement. Don't let lower back round.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(7), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Standing Calf Raise', 1, 4, '8', rpe(7), R.short, "1-2 second pause at the bottom of each rep"),
  ex('Cable Rope Upright Row', 0, 3, '10', rpe(7), R.short, "Focus on squeezing the upper traps at the top"),
  ex('Hammer Curl', 0, 3, '8', rpe(9), R.short, "3-second eccentric. Arch dumbbell out not up.", { tempo: '3-1-1' }),
];

const W2_D = [
  KEGEL_WARMUP,
  ex('Reset Deadlift', 3, 3, '5', pct('deadlift', 80), R.heavy, "Reset each rep from the floor. Brace lats, chest tall, hips high."),
  ex('Dip', 2, 3, '10', rpe(8), R.med, "Tuck elbows at 45°, lean torso forward 15°"),
  ex('Glute Ham Raise', 0, 3, '10', rpe(7), R.short, "Keep lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 3, '15', rpe(7), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(7), R.med, "Lean torso at 45°, pull weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(7), R.short, "Raise dumbbell out not up, mind muscle connection with middle fibers"),
  ex('Rope Face Pull', 1, 3, '20', rpe(7), R.short, "Pull elbows up and out, squeeze shoulder blades together"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(7), R.short, "Arc bar back behind your head, keep constant tension on triceps"),
];

const W2_E = [
  ex('Overhead Press', 3, 4, '10', pct('ohp', 65), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Egyptian Lateral Raise', 1, 3, '8', rpe(8), R.short, "2-second eccentric. Lean away from cable.", { tempo: '2-0-1' }),
  ex('Cable Seated Row', 1, 3, '12', rpe(7), R.med, "Squeeze shoulder blades together, pull with elbows down and in"),
  ex('Seated Hip Abduction', 1, 3, '20', rpe(7), R.short, "Focus on driving your knees out"),
  ex('Incline Dumbbell Curl', 1, 2, '10', rpe(8), R.short, "Brace upper back against bench, 45° incline, keep shoulders back"),
  ex('Bicycle Crunch', 1, 3, '15', rpe(7), R.short, "Focus on flexing and rotating your spine"),
  ex('Standing Calf Raise', 1, 4, '12', rpe(7), R.short, "Press onto your toes"),
  ex('Push Up', 0, 2, 'RPE only', rpe(6), R.short, "Perform as many reps as you can to hit target RPE"),
];

// --- WEEK 3 ---
const W3_A = [
  KEGEL_WARMUP,
  ex('Back Squat', 3, 4, '4', pct('squat', 80), R.comp, "Sit back and down, 15° toe flare, drive your knees out laterally"),
  ex('Dumbbell Incline Press', 2, 3, '8', rpe(9), R.med, "~45° incline, mind muscle connection with upper pecs"),
  ex('Lying Leg Curl', 1, 3, '10', rpe(7), R.short, "Focus on squeezing your hamstrings to move the weight", { tempo: '3-1-1' }),
  ex('Pronated Pulldown', 1, 3, '10', rpe(7), R.med, "Pull your elbows down and in"),
  ex('Supinated EZ Bar Curl', 1, 3, '15+15', rpe(10), R.short, "Dropset. Drop weight ~50% on second 15 reps.", { setType: 'dropset' }),
  ex('Hanging Leg Raise', 1, 3, '12', rpe(7), R.short, "Roll hips up as you squeeze lower abs, avoid swinging"),
];

const W3_B = [
  ex('Barbell Bench Press', 3, 3, '3', pct('bench', 85), R.comp, "Set up comfortable arch, 1-2 second pause on chest, explode off chest"),
  ex('Low to High Cable Flye', 0, 3, '15', rpe(9), R.short, "Palms facing ceiling → rotate to floor as you pull elbows up and in"),
  ex('Barbell Hip Thrust or RDL', 2, 3, '12', rpe(7), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority."),
  ex('Chest-Supported T-Bar Row', 1, 3, '15', rpe(7), R.med, "Squeeze shoulder blades at top, round forward at bottom"),
  ex('Arnold Press', 0, 3, '10', rpe(7), R.med, "Start elbows in front, palms in. Rotate palms forward as you press."),
  ex('Tricep Pressdown', 0, 3, '15', rpe(7), R.short, "Focus on squeezing your triceps to move the weight"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(7), R.short, "Shrug up and in, pull shoulders up to ears!"),
];

const W3_C = [
  ex('Weighted Pull-Up', 2, 3, '6', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Humble Row', 1, 3, '10', rpe(9), R.med, "Pin lower chest against incline bench. Drive elbows back hard."),
  ex('Leg Press', 2, 4, '15', rpe(7), R.med, "LEGS FOCUS: vary foot placement. Don't let lower back round.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(7), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Standing Calf Raise', 1, 4, '8', rpe(7), R.short, "1-2 second pause at the bottom of each rep"),
  ex('Cable Rope Upright Row', 0, 3, '10', rpe(7), R.short, "Focus on squeezing the upper traps at the top"),
  ex('Hammer Curl', 0, 3, '8', rpe(9), R.short, "3-second eccentric. Arch dumbbell out not up.", { tempo: '3-1-1' }),
];

const W3_D = [
  KEGEL_WARMUP,
  ex('Deadlift', 3, 4, '2', pct('deadlift', 87.5), R.heavy, "Brace your lats, chest tall, hips high, pull the slack out of the bar"),
  ex('Dip', 2, 3, '10', rpe(9), R.med, "Tuck elbows at 45°, lean torso forward 15°"),
  ex('Glute Ham Raise', 0, 3, '10', rpe(7), R.short, "Keep lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 3, '15', rpe(7), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(7), R.med, "Lean torso at 45°, pull weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(7), R.short, "Raise dumbbell out not up, mind muscle connection with middle fibers"),
  ex('Rope Face Pull', 1, 3, '20', rpe(7), R.short, "Pull elbows up and out, squeeze shoulder blades together"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(7), R.short, "Arc bar back behind your head, keep constant tension on triceps"),
];

const W3_E = [
  ex('Overhead Press', 3, 4, '6', pct('ohp', 77.5), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Egyptian Lateral Raise', 1, 3, '8', rpe(9), R.short, "2-second eccentric. Lean away from cable.", { tempo: '2-0-1' }),
  ex('Cable Seated Row', 1, 3, '12', rpe(7), R.med, "Squeeze shoulder blades together, pull with elbows down and in"),
  ex('Seated Hip Abduction', 1, 3, '20', rpe(7), R.short, "Focus on driving your knees out"),
  ex('Incline Dumbbell Curl', 1, 2, '10', rpe(7), R.short, "Brace upper back against bench, 45° incline, keep shoulders back"),
  ex('Bicycle Crunch', 1, 3, '15', rpe(7), R.short, "Focus on flexing and rotating your spine"),
  ex('Standing Calf Raise', 1, 4, '12', rpe(7), R.short, "Press onto your toes"),
  ex('Push Up', 0, 2, 'RPE only', rpe(7), R.short, "Perform as many reps as you can to hit target RPE"),
];

// --- WEEK 4 ---
const W4_A = [
  KEGEL_WARMUP,
  ex('Back Squat', 3, 3, '5', pct('squat', 80), R.comp, "Sit back and down, 15° toe flare, drive your knees out laterally"),
  ex('Dumbbell Incline Press', 2, 3, '8', rpe(9), R.med, "~45° incline, mind muscle connection with upper pecs"),
  ex('Lying Leg Curl', 1, 3, '10', rpe(8), R.short, "Focus on squeezing your hamstrings to move the weight", { tempo: '3-1-1' }),
  ex('Pronated Pulldown', 1, 3, '10', rpe(8), R.med, "Pull your elbows down and in"),
  ex('Supinated EZ Bar Curl', 1, 3, '15+15', rpe(10), R.short, "Dropset. Drop weight ~50% on second 15 reps.", { setType: 'dropset' }),
  ex('Hanging Leg Raise', 1, 3, '12', rpe(8), R.short, "Roll hips up as you squeeze lower abs, avoid swinging"),
];

const W4_B = [
  ex('Barbell Bench Press', 3, 3, '5', pct('bench', 80), R.comp, "Set up comfortable arch, 1-2 second pause on chest, explode off chest"),
  ex('Low to High Cable Flye', 0, 3, '15', rpe(9), R.short, "Palms facing ceiling → rotate to floor as you pull elbows up and in"),
  ex('Barbell Hip Thrust or RDL', 2, 3, '12', rpe(8), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority."),
  ex('Chest-Supported T-Bar Row', 1, 3, '15', rpe(8), R.med, "Squeeze shoulder blades at top, round forward at bottom"),
  ex('Arnold Press', 0, 3, '10', rpe(8), R.med, "Start elbows in front, palms in. Rotate palms forward as you press."),
  ex('Tricep Pressdown', 0, 3, '15', rpe(8), R.short, "Focus on squeezing your triceps to move the weight"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(8), R.short, "Shrug up and in, pull shoulders up to ears!"),
];

const W4_C = [
  ex('Weighted Pull-Up', 2, 3, '6', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Humble Row', 1, 3, '10', rpe(9), R.med, "Pin lower chest against incline bench. Be explosive at bottom."),
  ex('Leg Press', 2, 4, '15', rpe(8), R.med, "LEGS FOCUS: vary foot placement. Don't let lower back round.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(8), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { tempo: '3-1-1', extra: 'legs' }),
  ex('Standing Calf Raise', 1, 4, '8', rpe(8), R.short, "1-2 second pause at the bottom of each rep"),
  ex('Cable Rope Upright Row', 0, 3, '10', rpe(8), R.short, "Focus on squeezing the upper traps at the top"),
  ex('Hammer Curl', 0, 3, '8', rpe(9), R.short, "3-second eccentric. Arch dumbbell out not up.", { tempo: '3-1-1' }),
];

const W4_D = [
  KEGEL_WARMUP,
  ex('Reset Deadlift', 3, 3, '5', pct('deadlift', 80), R.heavy, "Reset each rep from the floor. Brace lats, chest tall, hips high."),
  ex('Dip', 2, 3, '10', rpe(9), R.med, "Tuck elbows at 45°, lean torso forward 15°"),
  ex('Glute Ham Raise', 0, 3, '10', rpe(8), R.short, "Keep lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 3, '15', rpe(8), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(8), R.med, "Lean torso at 45°, pull weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(8), R.short, "Raise dumbbell out not up, mind muscle connection with middle fibers"),
  ex('Rope Face Pull', 1, 3, '20', rpe(8), R.short, "Pull elbows up and out, squeeze shoulder blades together"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(8), R.short, "Arc bar back behind your head, keep constant tension on triceps"),
];

const W4_E = [
  ex('Overhead Press', 3, 4, '10', pct('ohp', 67.5), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Egyptian Lateral Raise', 1, 3, '8', rpe(9), R.short, "2-second eccentric. Lean away from cable.", { tempo: '2-0-1' }),
  ex('Cable Seated Row', 1, 3, '12', rpe(8), R.med, "Squeeze shoulder blades together, pull with elbows down and in"),
  ex('Seated Hip Abduction', 1, 3, '20', rpe(8), R.short, "Focus on driving your knees out"),
  ex('Incline Dumbbell Curl', 1, 2, '10', rpe(8), R.short, "Brace upper back against bench, 45° incline, keep shoulders back"),
  ex('Bicycle Crunch', 1, 3, '15', rpe(8), R.short, "Focus on flexing and rotating your spine"),
  ex('Standing Calf Raise', 1, 4, '12', rpe(8), R.short, "Press onto your toes"),
  ex('Push Up', 0, 2, 'RPE only', rpe(8), R.short, "Perform as many reps as you can to hit target RPE"),
];

// --- BLOCK 2 (Weeks 5-8) — Top Set + Back-Off ---
// Week 5
const W5_A = [
  KEGEL_WARMUP,
  ex('Back Squat — TOP SET', 3, 1, '3-5', pct('squat', 87.5), R.comp, "Sit back and down, 15° toe flare, drive your knees out laterally. Push for a NEW PR!", { setType: 'topset' }),
  ex('Back Squat — Back Off', 0, 2, '5', pct('squat', 75), R.comp, "Same technique, lighter weight, controlled reps", { setType: 'backoff' }),
  ex('Barbell Overhead Press', 2, 4, '6', pct('ohp', 80), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Swiss Ball Leg Curl', 1, 3, '10', rpe(7), R.short, "Prevent hips from touching the ground. Dig heels into the ball.", { tempo: '3-1-1' }),
  ex('Chin-Up', 1, 4, '8', rpe(7), R.med, "1.5× shoulder width grip, pull with lats"),
  ex('Supinated EZ Bar Curl', 1, 3, '10+2', rpe(10), R.short, "10 reps good control + 2 reps with moderate cheating. Push hard.", { setType: 'dropset' }),
  ex('AB Wheel Rollout', 1, 3, '6', rpe(7), R.short, "Squeeze your glutes, don't pull from your arms"),
];

const W5_B = [
  ex('Barbell Bench Press', 3, 3, '3', pct('bench', 87.5), R.comp, "Elbows at 45°. Squeeze shoulder blades and stay firm on bench."),
  ex('Low Incline Dumbbell Press', 0, 3, '15', rpe(8), R.short, "15° bench angle. Tuck your elbows. Constant tension."),
  ex('Barbell Hip Thrust or RDL', 2, 4, '12', rpe(7), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority."),
  ex('Dumbbell Row', 1, 4, '12', rpe(7), R.med, "Pull the dumbbell to your hip"),
  ex('Dumbbell Lateral Raise', 0, 4, '15', rpe(7), R.med, "Tilt dumbbell so pinky comes up first"),
  ex('Overhead Tricep Extension', 0, 3, '15', rpe(7), R.short, "Focus on squeezing your triceps to move the weight"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(7), R.short, "Shrug up and in, pull shoulders up to ears!"),
];

const W5_C = [
  ex('Weighted Pull-Up', 2, 3, '6', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Banded Chest-Supported T-Bar Row', 1, 4, '10', rpe(8), R.med, "Be explosive at the bottom, drive elbows back hard!"),
  ex('Single-Leg Leg Press', 2, 4, '15/15', rpe(7), R.med, "LEGS FOCUS: one leg at a time, full range of motion. Drive through heel.", { extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(7), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { extra: 'legs' }),
  ex('Eccentric-Accentuated Standing Calf Raise', 1, 4, '8', rpe(7), R.short, "Press onto your toes. 4-second eccentric down.", { tempo: '4-0-1' }),
  ex('Cable Rope Upright Row', 0, 4, '10', rpe(7), R.short, "Focus on squeezing the upper traps at the top"),
  ex('Cable Single-Arm Curl', 0, 4, '8', rpe(7), R.short, "Keep shoulder joint hyperextended (elbow behind torso)"),
];

const W5_D = [
  KEGEL_WARMUP,
  ex('Deadlift — TOP SET', 3, 1, '2', pct('deadlift', 90), R.heavy, "Brace lats, chest tall, hips high, pull the slack out of the bar. Push for a PR!", { setType: 'topset' }),
  ex('Reset Deadlift — Back Off', 0, 3, '2', pct('deadlift', 80), R.heavy, "Reset from floor. Controlled reps.", { setType: 'backoff' }),
  ex('Decline Bench Press', 2, 4, '8', rpe(7), R.med, "Constant tension reps, touch bar to chest"),
  ex('Glute Ham Raise', 0, 4, '10', rpe(7), R.short, "Keep lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 4, '12', rpe(7), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(7), R.med, "Lean torso at 45°, pull weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(7), R.short, "Raise dumbbell out not up, mind muscle connection with middle fibers"),
  ex('Reverse Pec Deck', 1, 3, '20', rpe(7), R.short, "Swing the weight out, not back"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(7), R.short, "Arc bar back behind your head, keep constant tension on triceps"),
];

const W5_E = [
  ex('Overhead Press', 3, 3, '8', pct('ohp', 80), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Cable Lateral Raise', 1, 3, '8', rpe(8), R.short, "Swing the weight out, not up"),
  ex('Pendlay Row', 1, 4, '10', rpe(7), R.med, "Keep flat back, pull elbows back at 45° angle. Bar returns to floor each rep."),
  ex('Seated Hip Abduction', 1, 4, '20', rpe(7), R.short, "Focus on driving your knees out"),
  ex('EZ Bar Curl 21s', 1, 2, '7/7/7', rpe(7), R.short, "First 7 bottom half ROM, next 7 top half, last 7 full ROM"),
  ex('Cable Crunch', 1, 4, '15', rpe(7), R.short, "Focus on flexing your spine. Avoid yanking with your arms."),
  ex('Standing Calf Raise', 1, 4, '12', rpe(7), R.short, "1-2 second pause at the bottom"),
  ex('Push Up', 0, 2, 'AMRAP', rpe(7), R.short, "Squeeze your pecs"),
];

// Week 6
const W6_A = [
  KEGEL_WARMUP,
  ex('Back Squat — TOP SET', 3, 1, '2', pct('squat', 90), R.comp, "Max effort set. Perfect technique. Use a spotter.", { setType: 'topset' }),
  ex('Back Squat — Back Off', 0, 2, '3', pct('squat', 85), R.comp, "Controlled reps with excellent technique.", { setType: 'backoff' }),
  ex('Barbell Overhead Press', 2, 4, '8', pct('ohp', 75), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Swiss Ball Leg Curl', 1, 3, '10', rpe(7), R.short, "Prevent hips from touching the ground. Dig heels into the ball.", { tempo: '3-1-1' }),
  ex('Chin-Up', 1, 4, '8', rpe(7), R.med, "Supinated (underhand) shoulder-width grip, pull with lats"),
  ex('Supinated EZ Bar Curl', 1, 3, '10+2', rpe(10), R.short, "10 reps good control + 2 reps with moderate cheating.", { setType: 'dropset' }),
  ex('AB Wheel Rollout', 1, 3, '12', rpe(7), R.short, "Squeeze your glutes, don't pull from your arms"),
];

const W6_B = [
  ex('Barbell Bench Press', 3, 3, '5', pct('bench', 85), R.comp, "Elbows at 45°. Squeeze shoulder blades and stay firm on bench."),
  ex('Low Incline Dumbbell Press', 0, 3, '15', rpe(8), R.short, "15° bench angle. Tuck your elbows. Constant tension."),
  ex('Barbell Hip Thrust or RDL', 2, 4, '12', rpe(7), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority."),
  ex('Dumbbell Row', 1, 4, '12', rpe(7), R.med, "Pull the dumbbell to your hip"),
  ex('Dumbbell Lateral Raise', 0, 4, '15', rpe(7), R.med, "Raise dumbbell out not up, mind muscle connection with middle fibers"),
  ex('Overhead Tricep Extension', 0, 3, '15', rpe(7), R.short, "Focus on squeezing your triceps to move the weight"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(7), R.short, "Shrug up and in, pull shoulders up to ears!"),
];

const W6_C = [
  ex('Weighted Pull-Up', 2, 4, '3', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Banded Chest-Supported T-Bar Row', 1, 4, '10', rpe(8), R.med, "Be explosive at the bottom, drive elbows back hard!"),
  ex('Single-Leg Leg Press', 2, 4, '15/15', rpe(7), R.med, "LEGS FOCUS: one leg at a time, full range of motion. Drive through heel.", { extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(7), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { extra: 'legs' }),
  ex('Eccentric-Accentuated Standing Calf Raise', 1, 4, '8', rpe(7), R.short, "Press onto your toes. 4-second eccentric down.", { tempo: '4-0-1' }),
  ex('Cable Rope Upright Row', 0, 4, '10', rpe(7), R.short, "Focus on squeezing the upper traps at the top"),
  ex('Cable Single-Arm Curl', 0, 4, '8', rpe(7), R.short, "Keep shoulder joint hyperextended (elbow behind torso)"),
];

const W6_D = [
  KEGEL_WARMUP,
  ex('Deadlift — TOP SET', 3, 1, '4', pct('deadlift', 85), R.heavy, "Brace lats, chest tall, hips high. Strong and controlled.", { setType: 'topset' }),
  ex('Reset Deadlift — Back Off', 0, 3, '4', pct('deadlift', 75), R.heavy, "Reset from floor. Controlled technique.", { setType: 'backoff' }),
  ex('Decline Bench Press', 2, 4, '8', rpe(7), R.med, "Constant tension reps, touch bar to chest"),
  ex('Glute Ham Raise', 0, 4, '10', rpe(7), R.short, "Keep lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 4, '12', rpe(7), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(7), R.med, "Lean torso at 45°, pull weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(7), R.short, "Raise dumbbell out not up"),
  ex('Reverse Pec Deck', 1, 3, '20', rpe(7), R.short, "Swing the weight out, not back"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(7), R.short, "Arc bar back behind head, keep constant tension on triceps"),
];

const W6_E = [
  ex('Overhead Press', 3, 4, '4', pct('ohp', 82.5), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Cable Lateral Raise', 1, 3, '8', rpe(8), R.short, "Swing the weight out, not up"),
  ex('Pendlay Row', 1, 4, '12', rpe(7), R.med, "Keep flat back, pull elbows back at 45°. Bar returns to floor each rep."),
  ex('Seated Hip Abduction', 1, 4, '20', rpe(7), R.short, "Focus on driving your knees out"),
  ex('EZ Bar Curl 21s', 1, 2, '10', rpe(7), R.short, "First 7 bottom half, next 7 top half, last 7 full ROM"),
  ex('Cable Crunch', 1, 4, '15', rpe(7), R.short, "Focus on flexing your spine. Avoid yanking with arms."),
  ex('Standing Calf Raise', 1, 4, '12', rpe(7), R.short, "1-2 second pause at the bottom"),
  ex('Push Up', 0, 2, 'AMRAP', rpe(7), R.short, "Squeeze your pecs"),
];

// Week 7
const W7_A = [
  KEGEL_WARMUP,
  ex('Back Squat — TOP SET', 3, 1, '6-8', pct('squat', 80), R.comp, "Moderate weight, high reps. Controlled technique, push for reps.", { setType: 'topset' }),
  ex('Back Squat — Back Off', 0, 2, '8', pct('squat', 70), R.comp, "Light and controlled. Focus on depth and technique.", { setType: 'backoff' }),
  ex('Barbell Overhead Press', 2, 4, '10', pct('ohp', 65), R.med, "Squeeze glutes, press up and slightly back"),
  ex('Swiss Ball Leg Curl', 1, 3, '10', rpe(8), R.short, "Prevent hips from touching ground. Dig heels into ball.", { tempo: '3-1-1' }),
  ex('Chin-Up', 1, 4, '8', rpe(8), R.med, "Supinated shoulder-width grip, pull with lats"),
  ex('Supinated EZ Bar Curl', 1, 3, '10+2', rpe(10), R.short, "10 good reps + 2 cheat reps.", { setType: 'dropset' }),
  ex('AB Wheel Rollout', 1, 3, '12', rpe(8), R.short, "Squeeze glutes, don't pull from arms"),
];

const W7_B = [
  ex('Barbell Bench Press', 3, 3, '10', pct('bench', 75), R.comp, "Elbows at 45°. Squeeze shoulder blades, stay firm on bench."),
  ex('Low Incline Dumbbell Press', 0, 3, '15', rpe(8), R.short, "15° bench angle. Tuck elbows."),
  ex('Barbell Hip Thrust or RDL', 2, 4, '12', rpe(8), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority."),
  ex('Dumbbell Row', 1, 4, '12', rpe(8), R.med, "Pull the dumbbell to your hip"),
  ex('Dumbbell Lateral Raise', 0, 4, '15', rpe(8), R.med, "Raise dumbbell out not up"),
  ex('Overhead Tricep Extension', 0, 3, '15', rpe(8), R.short, "Focus on squeezing your triceps to move the weight"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(8), R.short, "Shrug up and in"),
];

const W7_C = [
  ex('Weighted Pull-Up', 2, 3, '10', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Banded Chest-Supported T-Bar Row', 1, 4, '10', rpe(8), R.med, "Be explosive at the bottom, drive elbows back hard!"),
  ex('Single-Leg Leg Press', 2, 4, '15/15', rpe(8), R.med, "LEGS FOCUS: one leg at a time, full range of motion.", { extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(8), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { extra: 'legs' }),
  ex('Eccentric-Accentuated Standing Calf Raise', 1, 4, '8', rpe(8), R.short, "Press onto toes. 4-second eccentric down.", { tempo: '4-0-1' }),
  ex('Cable Rope Upright Row', 0, 4, '10', rpe(8), R.short, "Focus on squeezing upper traps at the top"),
  ex('Cable Single-Arm Curl', 0, 4, '8', rpe(8), R.short, "Keep shoulder joint hyperextended (elbow behind torso)"),
];

const W7_D = [
  KEGEL_WARMUP,
  ex('Deadlift — TOP SET', 3, 1, '6', pct('deadlift', 80), R.heavy, "Moderate weight, high reps. Controlled technique.", { setType: 'topset' }),
  ex('Reset Deadlift — Back Off', 0, 3, '6', pct('deadlift', 70), R.heavy, "Reset from floor. Focus on perfect form.", { setType: 'backoff' }),
  ex('Decline Bench Press', 2, 4, '8', rpe(7), R.med, "Constant tension reps, touch bar to chest"),
  ex('Glute Ham Raise', 0, 4, '10', rpe(8), R.short, "Keep lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 4, '12', rpe(8), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(8), R.med, "Lean torso at 45°, pull weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(8), R.short, "Raise dumbbell out not up"),
  ex('Reverse Pec Deck', 1, 3, '20', rpe(8), R.short, "Swing the weight out, not back"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(8), R.short, "Arc bar back behind head, keep constant tension on triceps"),
];

const W7_E = [
  ex('Overhead Press', 3, 4, '6', pct('ohp', 80), R.med, "Squeeze glutes to keep torso upright, press up and slightly back"),
  ex('Cable Lateral Raise', 1, 3, '8', rpe(8), R.short, "Swing the weight out, not up"),
  ex('Pendlay Row', 1, 4, '12', rpe(8), R.med, "Keep flat back, pull elbows back at 45°. Bar returns to floor each rep."),
  ex('Seated Hip Abduction', 1, 4, '20', rpe(8), R.short, "Focus on driving your knees out"),
  ex('EZ Bar Curl 21s', 1, 2, '10', rpe(8), R.short, "First 7 bottom half, next 7 top half, last 7 full ROM"),
  ex('Cable Crunch', 1, 4, '15', rpe(8), R.short, "Focus on flexing your spine. Avoid yanking with arms."),
  ex('Standing Calf Raise', 1, 4, '12', rpe(8), R.short, "1-2 second pause at the bottom"),
  ex('Push Up', 0, 2, 'AMRAP', rpe(8), R.short, "Squeeze your pecs"),
];

// Week 8 — Peak intensity
const W8_A = [
  KEGEL_WARMUP,
  ex('Back Squat — TOP SET', 3, 1, '2', pct('squat', 92.5), R.comp, "Near maximal effort. Perfect technique. Use a spotter.", { setType: 'topset' }),
  ex('Back Squat — Back Off', 0, 2, '2', pct('squat', 85), R.comp, "Heavy but controlled. Perfect technique.", { setType: 'backoff' }),
  ex('Barbell Overhead Press', 2, 4, '5', pct('ohp', 80), R.med, "Squeeze glutes, press up and slightly back"),
  ex('Swiss Ball Leg Curl', 1, 3, '10', rpe(8), R.short, "Prevent hips from touching ground. Dig heels into ball.", { tempo: '3-1-1' }),
  ex('Chin-Up', 1, 4, '8', rpe(8), R.med, "Supinated shoulder-width grip, pull with lats"),
  ex('Supinated EZ Bar Curl', 1, 3, '10+2', rpe(10), R.short, "10 good reps + 2 cheat reps.", { setType: 'dropset' }),
  ex('AB Wheel Rollout', 1, 3, '12', rpe(8), R.short, "Squeeze glutes, don't pull from arms"),
];

const W8_B = [
  ex('Barbell Bench Press', 3, 4, '2', pct('bench', 90), R.comp, "Elbows at 45°. Near maximal effort. Squeeze shoulder blades."),
  ex('Low Incline Dumbbell Press', 0, 3, '15', rpe(8), R.short, "15° bench angle. Tuck elbows."),
  ex('Barbell Hip Thrust or RDL', 2, 4, '12', rpe(8), R.med, "Hip thrust if glutes priority, RDL if hamstrings priority."),
  ex('Dumbbell Row', 1, 4, '12', rpe(8), R.med, "Pull the dumbbell to your hip"),
  ex('Dumbbell Lateral Raise', 0, 4, '15', rpe(8), R.med, "Raise dumbbell out not up"),
  ex('Overhead Tricep Extension', 0, 3, '15', rpe(8), R.short, "Focus on squeezing your triceps"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(8), R.short, "Shrug up and in"),
];

const W8_C = [
  ex('Weighted Pull-Up', 2, 4, '6', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Banded Chest-Supported T-Bar Row', 1, 4, '10', rpe(8), R.med, "Be explosive at the bottom, drive elbows back hard!"),
  ex('Single-Leg Leg Press', 2, 4, '15/15', rpe(8), R.med, "LEGS FOCUS: one leg at a time, full range of motion.", { extra: 'legs' }),
  ex('Seated Leg Curl', 1, 3, '12', rpe(8), R.short, "LEGS FOCUS: full stretch at bottom, strong contraction at top.", { extra: 'legs' }),
  ex('Eccentric-Accentuated Standing Calf Raise', 1, 4, '8', rpe(8), R.short, "Press onto toes. 4-second eccentric.", { tempo: '4-0-1' }),
  ex('Cable Rope Upright Row', 0, 4, '10', rpe(8), R.short, "Focus on squeezing upper traps at the top"),
  ex('Cable Single-Arm Curl', 0, 4, '8', rpe(8), R.short, "Keep shoulder joint hyperextended (elbow behind torso)"),
];

const W8_D = [
  KEGEL_WARMUP,
  ex('Deadlift — TOP SET', 3, 1, '2', pct('deadlift', 95), R.heavy, "Near maximal load. Brace everything. Use belt if needed.", { setType: 'topset' }),
  ex('Reset Deadlift — Back Off', 0, 1, '3', pct('deadlift', 85), R.heavy, "Reset from floor. Maintain perfect form.", { setType: 'backoff' }),
  ex('Decline Bench Press', 2, 4, '8', rpe(8), R.med, "Constant tension reps, touch bar to chest"),
  ex('Glute Ham Raise', 0, 4, '10', rpe(8), R.short, "Keep lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 4, '12', rpe(8), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(8), R.med, "Lean torso at 45°, pull weight straight down not in"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(8), R.short, "Raise dumbbell out not up"),
  ex('Reverse Pec Deck', 1, 3, '20', rpe(8), R.short, "Swing weight out, not back"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(8), R.short, "Arc bar back behind head, keep constant tension on triceps"),
];

const W8_E = [
  ex('Overhead Press', 3, 5, '3', pct('ohp', 87.5), R.med, "Near maximal effort. Squeeze glutes, press up and slightly back."),
  ex('Cable Lateral Raise', 1, 3, '8', rpe(8), R.short, "Swing the weight out, not up"),
  ex('Pendlay Row', 1, 4, '12', rpe(8), R.med, "Keep flat back, pull elbows back at 45°. Bar returns to floor each rep."),
  ex('Seated Hip Abduction', 1, 4, '20', rpe(8), R.short, "Focus on driving your knees out"),
  ex('EZ Bar Curl 21s', 1, 2, '10', rpe(8), R.short, "First 7 bottom half, next 7 top half, last 7 full ROM"),
  ex('Cable Crunch', 1, 4, '15', rpe(8), R.short, "Focus on flexing your spine. Avoid yanking with arms."),
  ex('Standing Calf Raise', 1, 4, '12', rpe(8), R.short, "1-2 second pause at the bottom"),
  ex('Push Up', 0, 2, 'RPE only', rpe(8), R.short, "Perform as many reps as you can to hit target RPE"),
];

// --- BLOCK 3 — WEEK 9: DELOAD ---
const W9_A = [
  KEGEL_WARMUP,
  ex('Back Squat', 3, 4, '4', pct('squat', 75), R.comp, "DELOAD: Light and fast. Focus on technique. Should feel easy."),
  ex('Barbell Bench Press', 2, 3, '4', pct('bench', 70), R.med, "DELOAD: Speed reps — press bar explosively off chest"),
  ex('Lying Leg Curl', 1, 3, '10', rpe(6), R.short, "DELOAD: Light weight, focus on feel"),
  ex('Pronated Pulldown', 1, 3, '10', rpe(6), R.med, "DELOAD: Pull your elbows down and in"),
  ex('Supinated EZ Bar Curl', 1, 3, '10', rpe(6), R.short, "DELOAD: Light weight, press pinky into bar"),
  ex('Cable Crunch', 1, 3, '12', rpe(6), R.short, "DELOAD: Focus on flexing your spine"),
];

const W9_B = [
  ex('Barbell Bench Press', 3, 3, '3', pct('bench', 80), R.comp, "DELOAD: Elbows at 45°. Practice explosive technique for AMRAPs next week."),
  ex('Low to High Cable Flye', 0, 3, '15', rpe(6), R.short, "DELOAD: Light. Focus on stretch and feel."),
  ex('Deadlift', 2, 3, '3', pct('deadlift', 75), R.med, "DELOAD: Explosive reps off the floor — should feel light and fast"),
  ex('Chest-Supported T-Bar Row', 1, 3, '15', rpe(6), R.med, "DELOAD: Fully protract at bottom, retract at top"),
  ex('Dumbbell Lateral Raise', 0, 3, '10', rpe(6), R.med, "DELOAD: Light weight, mind-muscle connection"),
  ex('Tricep Pressdown', 0, 3, '15', rpe(6), R.short, "DELOAD: Focus on squeezing your triceps"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(6), R.short, "DELOAD: Shrug up and in"),
];

const W9_C = [
  ex('Wide Grip Lat Pulldown', 2, 3, '6', rpe(6), R.med, "DELOAD: Pull with chest to the bar"),
  ex('Chest-Supported T-Bar Row', 1, 3, '10', rpe(6), R.med, "DELOAD: Squeeze shoulder blades together at top"),
  ex('Leg Press', 2, 3, '12', rpe(6), R.med, "DELOAD: Foot placement varied. Don't let lower back round."),
  ex('Standing Calf Raise', 1, 4, '8', rpe(6), R.short, "DELOAD: 1-2 second pause at bottom"),
  ex('Cable Rope Upright Row', 0, 3, '10', rpe(6), R.short, "DELOAD: Focus on squeezing upper traps at top"),
  ex('Hammer Curl', 0, 3, '8', rpe(6), R.short, "DELOAD: 3-second eccentric. Light weight."),
];

const W9_D = [
  KEGEL_WARMUP,
  ex('Deadlift', 3, 3, '2', pct('deadlift', 80), R.heavy, "DELOAD: Brace lats, chest tall, hips high. Light and crisp."),
  ex('Decline Bench Press', 2, 3, '8', rpe(7), R.med, "DELOAD: Constant tension reps, touch bar to chest"),
  ex('Glute Ham Raise', 0, 3, '10', rpe(6), R.short, "DELOAD: Lower back straight, use hamstrings to curl body up"),
  ex('Leg Extension', 1, 3, '15', rpe(6), R.short, "DELOAD: Light, focus on quad squeeze"),
  ex('Cable Pull-Over', 1, 3, '15', rpe(6), R.med, "DELOAD: Lean torso at 45°, pull weight straight down"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(6), R.short, "DELOAD: Raise dumbbell out not up"),
  ex('Rope Face Pull', 1, 3, '20', rpe(6), R.short, "DELOAD: Pull elbows up and out"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(6), R.short, "DELOAD: Arc bar back behind head"),
];

const W9_E = [
  ex('Overhead Press', 3, 4, '6', pct('ohp', 75), R.med, "DELOAD: Squeeze glutes, press up and slightly back"),
  ex('Barbell Bench Press', 1, 3, '2', pct('bench', 85), R.short, "DELOAD: Practice setup and explosive technique for AMRAPs next week"),
  ex('Cable Seated Row', 1, 3, '12', rpe(6), R.med, "DELOAD: Squeeze shoulder blades, pull with elbows down and in"),
  ex('Seated Hip Abduction', 1, 3, '20', rpe(6), R.short, "DELOAD: Focus on driving your knees out"),
  ex('Incline Dumbbell Curl', 1, 2, '10', rpe(6), R.short, "DELOAD: Brace upper back against bench, 45° incline"),
  ex('Bicycle Crunch', 1, 3, '15', rpe(6), R.short, "DELOAD: Focus on flexing and rotating your spine"),
  ex('Standing Calf Raise', 1, 4, '12', rpe(6), R.short, "DELOAD: 1-2 second pause at bottom"),
  ex('Push Up', 0, 2, 'RPE only', rpe(6), R.short, "DELOAD: Perform as many reps as you can to hit target RPE"),
];

// --- BLOCK 3 — WEEK 10: AMRAPs ---
const W10_A = [
  KEGEL_WARMUP,
  ex('Back Squat — AMRAP', 3, 1, 'AMRAP', amrap('squat', 90), R.comp, "AS MANY REPS AS POSSIBLE at 90% 1RM. Use a spotter! Gives you new estimated 1RM.", { setType: 'amrap' }),
  ex('Back Squat — Back Off', 0, 2, '6', pct('squat', 75), R.comp, "Controlled back-off sets after AMRAP.", { setType: 'backoff' }),
  ex('Dumbbell Incline Press', 2, 3, '8', rpe(5), R.med, "Very light — avoid interference with bench AMRAP tomorrow"),
  ex('Lying Leg Curl', 1, 3, '10', rpe(8), R.short, "Push hard now that deload is over", { tempo: '3-1-1' }),
  ex('Pronated Pulldown', 1, 3, '10', rpe(8), R.med, "Pull your elbows down and in"),
  ex('Supinated EZ Bar Curl', 1, 3, '10', rpe(9), R.short, "Press pinky into bar harder than pointer finger"),
  ex('Cable Crunch', 1, 3, '12', rpe(6), R.short, "Focus on flexing your spine"),
];

const W10_B = [
  ex('Barbell Bench Press — AMRAP', 3, 1, 'AMRAP', amrap('bench', 90), R.comp, "AS MANY REPS AS POSSIBLE at 90% 1RM. Use a spotter! Gives you new estimated 1RM.", { setType: 'amrap' }),
  ex('Barbell Bench Press — Back Off', 0, 2, '5', pct('bench', 75), R.comp, "Controlled back-off sets after AMRAP."),
  ex('Low to High Cable Flye', 0, 3, '15', rpe(9), R.short, "Push hard now — this is your final session"),
  ex('Barbell Hip Thrust or RDL', 2, 3, '12', rpe(5), R.med, "Very light — avoid interference with deadlift AMRAP on Day D"),
  ex('Chest-Supported T-Bar Row', 1, 3, '15', rpe(8), R.med, "Squeeze shoulder blades at top"),
  ex('Arnold Press', 0, 3, '10', rpe(8), R.med, "Start elbows in front, rotate palms forward as you press"),
  ex('Tricep Pressdown', 0, 3, '15', rpe(9), R.short, "Push hard — final session!"),
  ex('Hex Bar / Smith Machine Shrug', 1, 3, '12', rpe(10), R.short, "Go heavy — final week!"),
];

const W10_C = [
  ex('Weighted Pull-Up', 2, 3, '6', rpe(9), R.med, "1.5× shoulder width grip, pull your chest to the bar"),
  ex('Humble Row', 1, 3, '10', rpe(8), R.med, "Pin lower chest against incline bench. Full protraction at bottom."),
  ex('Leg Press', 2, 3, '15', rpe(8), R.med, "LEGS FOCUS: vary foot placement. Push hard — final session.", { extra: 'legs' }),
  ex('Standing Calf Raise', 1, 4, '8', rpe(8), R.short, "1-2 second pause at bottom"),
  ex('Cable Rope Upright Row', 0, 3, '10', rpe(8), R.short, "Focus on squeezing upper traps at top"),
  ex('Hammer Curl', 0, 3, '8', rpe(10), R.short, "Final session — go hard! 3-second eccentric.", { tempo: '3-1-1' }),
];

const W10_D = [
  KEGEL_WARMUP,
  ex('Deadlift — AMRAP', 3, 1, 'AMRAP', amrap('deadlift', 90), R.heavy, "AS MANY REPS AS POSSIBLE at 90% 1RM. Use belt if needed. Gives you new estimated 1RM.", { setType: 'amrap' }),
  ex('Reset Deadlift — Back Off', 3, 2, '5', pct('deadlift', 75), R.heavy, "Controlled reps after AMRAP.", { setType: 'backoff' }),
  ex('Decline Bench Press', 2, 3, '8', rpe(7), R.med, "Constant tension reps, touch bar to chest"),
  ex('Glute Ham Raise', 0, 3, '10', rpe(8), R.short, "Final session — keep lower back straight, use hamstrings"),
  ex('Leg Extension', 1, 3, '15', rpe(8), R.short, "Focus on squeezing your quads", { tempo: '3-1-1' }),
  ex('Cable Pull-Over', 1, 3, '15', rpe(8), R.med, "Lean torso at 45°"),
  ex('Dumbbell Lateral Raise', 1, 3, '20', rpe(8), R.short, "Raise dumbbell out not up"),
  ex('Rope Face Pull', 1, 3, '20', rpe(8), R.short, "Pull elbows up and out"),
  ex('EZ Bar Skull Crusher', 1, 3, '15', rpe(8), R.short, "Arc bar back behind head"),
];

const W10_E = [
  ex('Overhead Press', 3, 4, '10', pct('ohp', 77.5), R.med, "Squeeze glutes, press up and slightly back"),
  ex('Egyptian Lateral Raise', 1, 3, '8', rpe(9), R.short, "2-second eccentric. Lean away from cable.", { tempo: '2-0-1' }),
  ex('Cable Seated Row', 1, 3, '12', rpe(8), R.med, "Squeeze shoulder blades, pull with elbows down and in"),
  ex('Seated Hip Abduction', 1, 3, '20', rpe(8), R.short, "Focus on driving your knees out"),
  ex('Incline Dumbbell Curl', 1, 2, '10', rpe(10), R.short, "Final session — brace upper back against bench, 45° incline"),
  ex('Bicycle Crunch', 1, 3, '15', rpe(8), R.short, "Focus on flexing and rotating your spine"),
  ex('Standing Calf Raise', 1, 4, '12', rpe(8), R.short, "Press onto your toes"),
  ex('Push Up', 0, 2, 'AMRAP', rpe(10), R.short, "Final session — max reps! Squeeze your pecs."),
];

// --- PROGRAM ASSEMBLY ---
// Week starts Sunday. dayOfWeek: 0=Sun(A), 1=Mon(B), 2=Tue(C), 3=Wed(D), 4=Thu(E)
export const PROGRAM = [
  { week: 1, block: 1, label: 'Week 1', workouts: [W1_A, W1_B, W1_C, W1_D, W1_E] },
  { week: 2, block: 1, label: 'Week 2', workouts: [W2_A, W2_B, W2_C, W2_D, W2_E] },
  { week: 3, block: 1, label: 'Week 3', workouts: [W3_A, W3_B, W3_C, W3_D, W3_E] },
  { week: 4, block: 1, label: 'Week 4', workouts: [W4_A, W4_B, W4_C, W4_D, W4_E] },
  { week: 5, block: 2, label: 'Week 5 — Block 2', workouts: [W5_A, W5_B, W5_C, W5_D, W5_E] },
  { week: 6, block: 2, label: 'Week 6 — Block 2', workouts: [W6_A, W6_B, W6_C, W6_D, W6_E] },
  { week: 7, block: 2, label: 'Week 7 — Block 2', workouts: [W7_A, W7_B, W7_C, W7_D, W7_E] },
  { week: 8, block: 2, label: 'Week 8 — Block 2', workouts: [W8_A, W8_B, W8_C, W8_D, W8_E] },
  { week: 9, block: 3, label: 'Week 9 — Deload', workouts: [W9_A, W9_B, W9_C, W9_D, W9_E] },
  { week: 10, block: 3, label: 'Week 10 — AMRAPs', workouts: [W10_A, W10_B, W10_C, W10_D, W10_E] },
];

export const WORKOUT_NAMES = [
  'Lower-Focused Full Body',
  'Chest-Focused Full Body',
  'Back-Focused Full Body',
  'Lower-Focused Full Body 2',
  'Deltoid-Focused Full Body',
];

export const WORKOUT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

// Get today's workout given program start date and current date
export function getTodayWorkout(programStartDate) {
  const start = new Date(programStartDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - start) / 86400000);
  if (diffDays < 0) return null;
  const weekIdx = Math.floor(diffDays / 7);
  if (weekIdx >= PROGRAM.length) return { finished: true };
  const dayOfWeek = today.getDay(); // 0=Sun
  if (dayOfWeek >= 5) return { rest: true }; // Fri/Sat
  const weekData = PROGRAM[weekIdx];
  return {
    weekData,
    workoutIdx: dayOfWeek,
    exercises: weekData.workouts[dayOfWeek],
    name: WORKOUT_NAMES[dayOfWeek],
    weekNum: weekIdx + 1,
  };
}

export function getWeekWorkouts(programStartDate) {
  const start = new Date(programStartDate);
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - start) / 86400000);
  if (diffDays < 0) return null;
  const weekIdx = Math.min(Math.floor(diffDays / 7), PROGRAM.length - 1);
  return PROGRAM[weekIdx];
}

// Compute load in kg given user 1RMs and intensity object
export function computeLoad(intensity, orms) {
  if (!intensity) return null;
  if (intensity.type === 'pct' || intensity.type === 'amrap') {
    const base = orms[intensity.lift];
    if (!base) return null;
    return Math.round((base * intensity.p / 100) / 2.5) * 2.5;
  }
  return null; // RPE-based: user decides weight
}
