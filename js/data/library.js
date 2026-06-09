// Gym Movement Library — searchable exercise database
// Each entry: name, category, primaryMuscles, secondaryMuscles, equipment, difficulty, cues

export const LIBRARY = [
  // ─── LOWER BODY ──────────────────────────────────────────────────────────
  {
    name: 'Back Squat', category: 'compound',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core', 'Spinal Erectors'],
    equipment: 'Barbell', difficulty: 'Advanced',
    cues: ['Sit back and down, 15° toe flare', 'Drive knees out over toes', 'Chest tall throughout', 'Hip crease below knee at bottom', 'Explode up — drive floor away'],
    notes: 'The king of lower body movements. High bar = more upright torso, quad dominant. Low bar = more hip hinge, glute/hamstring dominant. Use whichever fits your mobility best.',
  },
  {
    name: 'Hack Squat', category: 'compound',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    equipment: 'Machine', difficulty: 'Intermediate',
    cues: ['Feet shoulder-width, toes slightly out', 'Full depth — thighs past parallel', '3-second eccentric for max tension', 'Knees track over toes', 'Drive through entire foot'],
    notes: 'Excellent squat alternative that removes spinal loading. Great for isolating quads. Sit low in the machine for full ROM.',
  },
  {
    name: 'Leg Press', category: 'compound',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Calves'],
    equipment: 'Machine', difficulty: 'Beginner',
    cues: ['Low foot = quad dominant', 'High foot = glute/ham dominant', 'Wide stance = inner quad + adductors', "Don't let lower back round at bottom", 'Full ROM — don\'t lock knees at top'],
    notes: 'Vary foot placement across sets to hit different emphasis. Keep tension — never fully lock out.',
  },
  {
    name: 'Romanian Deadlift', category: 'compound',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Spinal Erectors', 'Lats'],
    equipment: 'Barbell', difficulty: 'Intermediate',
    cues: ['Hip hinge — push hips back, not down', 'Soft knees throughout', 'Bar stays close to legs', 'Feel hamstring stretch at bottom', '3-second eccentric for max hypertrophy'],
    notes: 'Most effective hamstring exercise. The stretch position drives hypertrophy. Go as low as your hamstring flexibility allows while keeping a flat back.',
  },
  {
    name: 'Deadlift', category: 'compound',
    primaryMuscles: ['Hamstrings', 'Glutes', 'Back'],
    secondaryMuscles: ['Quads', 'Traps', 'Core', 'Forearms'],
    equipment: 'Barbell', difficulty: 'Advanced',
    cues: ['Pull the slack out before lifting', 'Brace lats — "protect your armpits"', 'Hips high, chest tall', 'Bar over mid-foot', 'Drive floor away, then hips through at top'],
    notes: 'Full-body strength movement. Setup is everything — take time to position before each rep. Reset deadlifts (touch-and-go from floor) maintain tension better for hypertrophy.',
  },
  {
    name: 'Bulgarian Split Squat', category: 'compound',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Dumbbell', difficulty: 'Intermediate',
    cues: ['Rear foot elevated on bench', 'Front foot far enough forward', 'Torso upright for quad focus', 'Forward lean for glute focus', 'Knee tracks over toe throughout'],
    notes: 'Arguably the best unilateral leg exercise. Reveals and fixes side-to-side imbalances. Very fatiguing — keep RPE honest.',
  },
  {
    name: 'Barbell Hip Thrust', category: 'compound',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Barbell', difficulty: 'Intermediate',
    cues: ['Shoulder blades on bench edge', 'Bar in hip crease (use pad)', 'Drive hips up to full extension', 'Squeeze glutes hard at top — 1 sec hold', 'Chin tucked, ribs down'],
    notes: 'Best glute exercise by activation. The hip flexion-to-extension arc maximally loads glutes. Heavier is better here — build up the weight.',
  },
  {
    name: 'Lying Leg Curl', category: 'isolation',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: [],
    equipment: 'Machine', difficulty: 'Beginner',
    cues: ['Hips flat against pad', 'Curl fully — heels to glutes', '3-second eccentric down', 'Squeeze at top for 1 second', "Don't let hips rise"],
    notes: 'Best hamstring isolation. The shortened position (top of curl) drives metabolic stress. Pair with RDLs for full hamstring development (stretch + contraction).',
  },
  {
    name: 'Seated Leg Curl', category: 'isolation',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: [],
    equipment: 'Machine', difficulty: 'Beginner',
    cues: ['Knee slightly off seat edge for full ROM', 'Full stretch at top', 'Curl all the way down', '3-second eccentric', 'Foot dorsiflexed (toes up) for more stretch'],
    notes: 'Hits hamstrings in a stretched position, which is the most effective for hypertrophy. Some research suggests it outperforms lying leg curl for growth.',
  },
  {
    name: 'Leg Extension', category: 'isolation',
    primaryMuscles: ['Quads'],
    secondaryMuscles: [],
    equipment: 'Machine', difficulty: 'Beginner',
    cues: ['Sit fully back in seat', 'Full extension at top — squeeze hard', '3-second eccentric for max TUT', 'Toes slightly outward to hit VMO', 'Avoid jerking — controlled throughout'],
    notes: 'Best quad isolation. Excellent finishing exercise after compounds. The contracted position (full extension) is key — squeeze and hold briefly.',
  },
  {
    name: 'Standing Calf Raise', category: 'isolation',
    primaryMuscles: ['Calves (Gastrocnemius)'],
    secondaryMuscles: [],
    equipment: 'Machine', difficulty: 'Beginner',
    cues: ['Full stretch at bottom — pause 1-2 sec', 'Rise fully onto toes', 'Single leg = more stretch and load', 'Straight knee targets gastrocnemius', 'Bent knee targets soleus more'],
    notes: 'Calves are notoriously stubborn. Full range of motion is critical — most people bounce at the bottom. Slow eccentrics and a deep stretch drive growth.',
  },
  {
    name: 'Seated Calf Raise', category: 'isolation',
    primaryMuscles: ['Calves (Soleus)'],
    secondaryMuscles: [],
    equipment: 'Machine', difficulty: 'Beginner',
    cues: ['Bent knee maximally loads soleus', 'Full stretch at bottom', 'Rise fully to toes', '3-second eccentric', 'Heavier loads than standing — soleus is strong'],
    notes: 'The soleus (deeper calf muscle) is undertrained. Pair with standing calf raises for complete calf development.',
  },
  {
    name: 'Nordic Curl', category: 'compound',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Glutes', 'Core'],
    equipment: 'Bodyweight', difficulty: 'Advanced',
    cues: ['Anchor feet under bench or partner', 'Lower body as slowly as possible', 'Hamstrings doing the braking', 'Push up with hands to assist return', 'Progress: assisted → bodyweight → weighted'],
    notes: 'Single best eccentric hamstring exercise — significantly reduces hamstring injury risk. Incredibly hard. Expect to start with heavy assistance and build up over months.',
  },
  {
    name: 'Glute Ham Raise', category: 'compound',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Calves', 'Spinal Erectors'],
    equipment: 'Machine', difficulty: 'Advanced',
    cues: ['Feet secured in footplate', 'Start with straight body', 'Use hamstrings to curl body upward', 'Keep back straight throughout', 'Slow controlled descent'],
    notes: 'Trains hamstrings through full range — both knee flexion and hip extension simultaneously. One of the most complete posterior chain exercises available.',
  },

  // ─── PUSH ─────────────────────────────────────────────────────────────────
  {
    name: 'Barbell Bench Press', category: 'compound',
    primaryMuscles: ['Chest', 'Triceps'],
    secondaryMuscles: ['Front Delts', 'Serratus'],
    equipment: 'Barbell', difficulty: 'Intermediate',
    cues: ['Retract and depress shoulder blades', 'Elbows at 45° — not flared', '1-2 sec pause on chest', 'Leg drive — push floor away', 'Explode off chest with max intent'],
    notes: 'The primary horizontal push movement. Proper setup is critical — arch the back to retract scapulae and create a stable pressing base. Bar path: slight diagonal from chest to over eyes.',
  },
  {
    name: 'Dumbbell Incline Press', category: 'compound',
    primaryMuscles: ['Chest (Upper)', 'Triceps'],
    secondaryMuscles: ['Front Delts'],
    equipment: 'Dumbbell', difficulty: 'Intermediate',
    cues: ['30-45° bench angle', 'Press from lower chest toward ceiling', 'Elbows at 45-60°', 'Full stretch at bottom', 'Control the dumbbells — don\'t drop'],
    notes: 'Superior to barbell incline for upper chest development. The dumbbells allow a more natural pressing path and greater stretch at the bottom.',
  },
  {
    name: 'Low to High Cable Flye', category: 'isolation',
    primaryMuscles: ['Chest (Upper)'],
    secondaryMuscles: ['Front Delts'],
    equipment: 'Cable', difficulty: 'Beginner',
    cues: ['Cables start at hip level', 'Pull elbows up and in — arc motion', 'Rotate palms from facing floor to ceiling', 'Squeeze at top of movement', 'Constant tension — don\'t lock elbows'],
    notes: 'Best exercise for upper chest isolation. The cable keeps tension through full ROM unlike dumbbells. Squeeze at the top and control the eccentric.',
  },
  {
    name: 'Dip', category: 'compound',
    primaryMuscles: ['Chest (Lower)', 'Triceps'],
    secondaryMuscles: ['Front Delts'],
    equipment: 'Bodyweight', difficulty: 'Intermediate',
    cues: ['Lean forward 10-15° for chest emphasis', 'Elbows at 45°', 'Descend until upper arms parallel', 'Full extension at top', 'Add weight once bodyweight is easy'],
    notes: 'Upright torso = tricep dominant. Forward lean = chest dominant. Excellent compound for lower chest development that\'s hard to hit otherwise.',
  },
  {
    name: 'Overhead Press', category: 'compound',
    primaryMuscles: ['Shoulders (Front & Side Delts)', 'Triceps'],
    secondaryMuscles: ['Traps', 'Core'],
    equipment: 'Barbell', difficulty: 'Intermediate',
    cues: ['Grip slightly wider than shoulder-width', 'Squeeze glutes and abs before pressing', 'Bar clears head — slight layback then straight up', 'Active traps — shrug bar overhead at top', 'Elbows slightly forward of bar'],
    notes: 'The most complete shoulder developer. The layback (slight hip extension) at the bottom is technique, not cheating — it allows a more efficient pressing angle.',
  },
  {
    name: 'Arnold Press', category: 'compound',
    primaryMuscles: ['Shoulders (All Heads)'],
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    equipment: 'Dumbbell', difficulty: 'Intermediate',
    cues: ['Start: palms facing you, elbows forward', 'Rotate palms outward as you press up', 'Full rotation by the time arms are extended', 'Controlled rotation back on descent', 'Elbows never drop below 90°'],
    notes: 'The rotation recruits all three delt heads. Front delts at the bottom, side and rear as arms rotate. Great for full delt development in one movement.',
  },
  {
    name: 'Cable Lateral Raise', category: 'isolation',
    primaryMuscles: ['Shoulders (Side Delts)'],
    secondaryMuscles: ['Traps'],
    equipment: 'Cable', difficulty: 'Beginner',
    cues: ['Cable at hip height or lower', 'Raise arm out — not forward, not up', 'Pinky slightly higher than thumb', '2-second eccentric', 'Slight forward lean enhances ROM'],
    notes: 'Cable provides constant tension throughout the movement unlike dumbbells (which are hardest at the top). Egyptian lateral raise (leaning away from cable) provides even greater stretch.',
  },
  {
    name: 'Egyptian Lateral Raise', category: 'isolation',
    primaryMuscles: ['Shoulders (Side Delts)'],
    secondaryMuscles: [],
    equipment: 'Cable', difficulty: 'Intermediate',
    cues: ['Lean away from cable — grab upright for support', 'This increases the stretch on the delt', 'Raise out to side — lead with elbow', '2-second eccentric', 'Start from fully stretched position'],
    notes: 'Jeff Nippard\'s preferred lateral raise variation. The lean stretches the side delt at the bottom, increasing the range of motion and stimulus. Superior to standard lateral raises for hypertrophy.',
  },
  {
    name: 'Rope Face Pull', category: 'isolation',
    primaryMuscles: ['Rear Delts', 'Rotator Cuff'],
    secondaryMuscles: ['Rhomboids', 'Mid Traps'],
    equipment: 'Cable', difficulty: 'Beginner',
    cues: ['Cable at forehead height', 'Pull elbows up and out — not straight back', 'External rotation at the end of pull', 'Squeeze rear delts and rhomboids', 'High reps, moderate weight'],
    notes: 'Essential for shoulder health and posture. Counteracts all the internal rotation from pressing. Every gym session should include some form of face pull.',
  },
  {
    name: 'Tricep Pressdown', category: 'isolation',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    equipment: 'Cable', difficulty: 'Beginner',
    cues: ['Elbows pinned at sides — don\'t let them flare', 'Full extension at bottom — squeeze', 'Allow elbows to come up slightly at top for stretch', '2-second eccentric', 'Control — no momentum'],
    notes: 'Best cable tricep exercise. The angled cable provides better tension than free weights. The rope version allows wrists to rotate for a stronger squeeze at the bottom.',
  },
  {
    name: 'EZ Bar Skull Crusher', category: 'isolation',
    primaryMuscles: ['Triceps (Long Head)'],
    secondaryMuscles: [],
    equipment: 'Barbell (EZ)', difficulty: 'Intermediate',
    cues: ['Arc bar back BEHIND head — not straight down to forehead', 'This maximally stretches the long head', 'Elbows pointing at ceiling throughout', 'Control the eccentric — don\'t bounce', 'Keep upper arms vertical'],
    notes: 'The "behind the head" arc is what makes this exercise special — it stretches the long head of the tricep which is the largest head and most important for size.',
  },
  {
    name: 'Overhead Tricep Extension', category: 'isolation',
    primaryMuscles: ['Triceps (Long Head)'],
    secondaryMuscles: [],
    equipment: 'Dumbbell/Cable', difficulty: 'Beginner',
    cues: ['Arms extended overhead fully', 'Lower weight behind head — full stretch', 'Elbows pointing up, close to ears', 'Extend arms fully at top', 'Don\'t let elbows flare'],
    notes: 'The overhead position puts the long head of the tricep on maximum stretch — this is where hypertrophic stimulus is highest. Long head makes up ~65% of tricep mass.',
  },

  // ─── PULL ─────────────────────────────────────────────────────────────────
  {
    name: 'Weighted Pull-Up', category: 'compound',
    primaryMuscles: ['Lats', 'Biceps'],
    secondaryMuscles: ['Mid Back', 'Rear Delts', 'Core'],
    equipment: 'Bodyweight', difficulty: 'Advanced',
    cues: ['1.5× shoulder-width pronated grip', 'Dead hang at bottom — full stretch', 'Pull chest to bar — not chin over bar', 'Drive elbows down and back', 'Squeeze lats at top'],
    notes: 'The best back width exercise. The dead hang at the bottom is crucial — it ensures full range of motion and maximum lat stretch. Progress with a dip belt.',
  },
  {
    name: 'Chin-Up', category: 'compound',
    primaryMuscles: ['Lats', 'Biceps'],
    secondaryMuscles: ['Mid Back', 'Core'],
    equipment: 'Bodyweight', difficulty: 'Intermediate',
    cues: ['Shoulder-width supinated grip', 'Full dead hang at bottom', 'Drive elbows down to pull up', 'Chest toward bar', 'Fully extend at bottom each rep'],
    notes: 'The supinated grip recruits biceps more than pull-ups, making chin-ups the best combination back + bicep exercise. Many find them easier than pull-ups due to bicep assistance.',
  },
  {
    name: 'Lat Pulldown', category: 'compound',
    primaryMuscles: ['Lats', 'Biceps'],
    secondaryMuscles: ['Mid Back', 'Rear Delts'],
    equipment: 'Cable', difficulty: 'Beginner',
    cues: ['Wide grip: 1.5-2× shoulder width', 'Slight layback — 10-15°', 'Drive elbows down and in', 'Pull bar to upper chest', 'Full stretch at top — don\'t shorten ROM'],
    notes: 'The beginner-friendly pull-up alternative. Use it to build lat strength before progressing to pull-ups. Close grip variation increases bicep involvement.',
  },
  {
    name: 'Barbell Bent-Over Row', category: 'compound',
    primaryMuscles: ['Mid Back', 'Lats'],
    secondaryMuscles: ['Biceps', 'Rear Delts', 'Spinal Erectors'],
    equipment: 'Barbell', difficulty: 'Advanced',
    cues: ['Hip hinge ~45° — not standing upright', 'Brace core before each rep', 'Pull bar to lower chest/upper abs', 'Drive elbows back and up', 'Retract shoulder blades at top'],
    notes: 'The best overall back thickness exercise. The horizontal loading angle works mid-back and rhomboids that vertical pulling misses. Lower back fatigue can limit performance — keep reps controlled.',
  },
  {
    name: 'Pendlay Row', category: 'compound',
    primaryMuscles: ['Mid Back', 'Lats'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Barbell', difficulty: 'Advanced',
    cues: ['Bar returns to floor each rep — dead stop', 'Back parallel to floor', 'Explosive pull to chest', 'Elbows at 45°', 'Full dead stop between reps removes momentum'],
    notes: 'The bar returning to the floor eliminates momentum and ensures each rep starts fresh. More demanding than regular rows. Excellent for building raw pulling strength.',
  },
  {
    name: 'Dumbbell Row', category: 'compound',
    primaryMuscles: ['Lats', 'Mid Back'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Dumbbell', difficulty: 'Beginner',
    cues: ['Brace on bench — flat back', 'Pull dumbbell to hip — not to shoulder', 'Lead with elbow, not bicep', 'Full stretch at bottom', 'Avoid rotating torso'],
    notes: 'Allows heavier loads than cable rows. The single-arm nature ensures each side works equally. Go heavy — the grip often fails before the back.',
  },
  {
    name: 'Cable Seated Row', category: 'compound',
    primaryMuscles: ['Mid Back', 'Rhomboids'],
    secondaryMuscles: ['Biceps', 'Rear Delts', 'Lats'],
    equipment: 'Cable', difficulty: 'Beginner',
    cues: ['Full protraction at front — lean into stretch', 'Pull with elbows — not hands', 'Squeeze shoulder blades together at back', 'Slight lean back at finish (10°)', 'Control the return — don\'t let weight pull you forward'],
    notes: 'Excellent for mid-back thickness. The seated position removes lower back strain. The full protraction at the front of the movement provides a deep lat stretch.',
  },
  {
    name: 'Humble Row', category: 'compound',
    primaryMuscles: ['Mid Back', 'Rear Delts'],
    secondaryMuscles: ['Biceps', 'Rhomboids'],
    equipment: 'Barbell', difficulty: 'Advanced',
    cues: ['Pin LOWER CHEST against top of incline bench', 'Let chest be supported — not hips', 'Pull bar toward belly button', 'This removes all cheating/momentum', 'Full range of motion'],
    notes: 'Jeff Nippard\'s speciality row. The chest support eliminates ALL body English — every pound lifted is pure back work. Forces you to use a weight your back can actually move.',
  },
  {
    name: 'Cable Pull-Over', category: 'isolation',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Serratus', 'Core'],
    equipment: 'Cable', difficulty: 'Intermediate',
    cues: ['Cable at top — lean torso at 45° forward', 'Pull cable straight down — not in an arc', 'Arms slightly bent throughout', 'Feel lats contract at bottom', 'Stretch arms fully overhead for lat stretch'],
    notes: 'Excellent lat isolation that doesn\'t fatigue biceps. The 45° lean creates a long range of motion. Focuses purely on lat function (shoulder extension) without bicep assistance.',
  },

  // ─── BICEPS ────────────────────────────────────────────────────────────────
  {
    name: 'EZ Bar Curl', category: 'isolation',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Brachialis', 'Forearms'],
    equipment: 'Barbell (EZ)', difficulty: 'Beginner',
    cues: ['Slight supination — press pinky into bar', 'Full extension at bottom — don\'t cut ROM', 'Squeeze hard at top', 'Elbows stay at sides', 'No swinging — strict form'],
    notes: 'The EZ bar reduces wrist strain vs straight bar. Full extension at the bottom is critical for bicep length development. Lower reps = more load; higher reps = more metabolic stress.',
  },
  {
    name: 'Incline Dumbbell Curl', category: 'isolation',
    primaryMuscles: ['Biceps (Long Head)'],
    secondaryMuscles: [],
    equipment: 'Dumbbell', difficulty: 'Intermediate',
    cues: ['45° incline — shoulders behind hips', 'Arms hang fully extended at bottom', 'This stretches the long head maximally', 'Curl without moving upper arm forward', 'Supinate (twist) as you curl up'],
    notes: 'The stretched position (arms behind body) at the bottom uniquely targets the long head. Research shows stretched-position exercises produce more hypertrophy. One of the best bicep exercises for size.',
  },
  {
    name: 'Hammer Curl', category: 'isolation',
    primaryMuscles: ['Brachialis', 'Brachioradialis'],
    secondaryMuscles: ['Biceps'],
    equipment: 'Dumbbell', difficulty: 'Beginner',
    cues: ['Neutral grip — thumbs up throughout', 'Arch the dumbbell OUT, not straight up', '3-second eccentric — squeeze forearm on descent', 'Elbows stay at sides', 'No supination — neutral throughout'],
    notes: 'Targets the brachialis (under the bicep) which pushes the bicep up when developed, creating a more peaked look. Also critical for forearm/elbow health. Heavy hammer curls are underrated.',
  },

  // ─── CORE ─────────────────────────────────────────────────────────────────
  {
    name: 'Hanging Leg Raise', category: 'isolation',
    primaryMuscles: ['Abs (Lower)'],
    secondaryMuscles: ['Hip Flexors', 'Core'],
    equipment: 'Pull-Up Bar', difficulty: 'Intermediate',
    cues: ['Dead hang at bottom', 'Roll hips UP at the top — not just lifting legs', 'This spinal flexion is what targets lower abs', 'Control the descent — no swinging', 'Keep legs straight for maximum difficulty'],
    notes: 'The hip roll at the top is what separates this from a hip flexor exercise. The spinal flexion motion is what actually trains the abs. Many people do this wrong — just raising legs without the roll.',
  },
  {
    name: 'AB Wheel Rollout', category: 'compound',
    primaryMuscles: ['Core (Anti-Extension)'],
    secondaryMuscles: ['Lats', 'Shoulders', 'Triceps'],
    equipment: 'AB Wheel', difficulty: 'Advanced',
    cues: ['Squeeze glutes and abs before starting', 'Roll out slowly — don\'t let hips sag', 'Go as far as control allows', 'Pull back using lats and abs', 'Neutral spine throughout'],
    notes: 'One of the most effective core exercises — trains anti-extension (core stability). The glute squeeze is critical to protect the lower back. Start with partial ROM and build up.',
  },
  {
    name: 'Cable Crunch', category: 'isolation',
    primaryMuscles: ['Abs'],
    secondaryMuscles: ['Obliques'],
    equipment: 'Cable', difficulty: 'Beginner',
    cues: ['Kneel facing cable', 'Focus on SPINAL FLEXION — not hip flexion', 'Pull elbows toward knees by rounding spine', 'Don\'t use arms to pull — abs do the work', 'Hold contraction at bottom briefly'],
    notes: 'The resistance cable provides much better tension than bodyweight crunches. The key is flexing the SPINE, not just hinging at the hips. Think of bringing your ribs to your hips.',
  },
];

export const MUSCLE_GROUPS = [
  'All', 'Quads', 'Hamstrings', 'Glutes', 'Calves',
  'Chest', 'Shoulders', 'Triceps',
  'Lats', 'Back', 'Biceps', 'Core',
];

export function searchLibrary(query, muscleFilter) {
  let results = LIBRARY;
  if (muscleFilter && muscleFilter !== 'All') {
    results = results.filter(ex =>
      ex.primaryMuscles.some(m => m.includes(muscleFilter)) ||
      ex.secondaryMuscles.some(m => m.includes(muscleFilter))
    );
  }
  if (query && query.trim()) {
    const q = query.toLowerCase();
    results = results.filter(ex =>
      ex.name.toLowerCase().includes(q) ||
      ex.primaryMuscles.some(m => m.toLowerCase().includes(q)) ||
      ex.equipment.toLowerCase().includes(q)
    );
  }
  return results;
}
