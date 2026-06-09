// Kegel hold timer — renders special UI for pelvic_floor exercises

export function renderKegelCard(exercise, container) {
  const card = document.createElement('div');
  card.className = 'kegel-card';
  card.innerHTML = `<div class="kegel-title">🧘 ${exercise.name}</div>`;

  exercise.sets.forEach((setDef, idx) => {
    for (let rep = 0; rep < setDef.reps * setDef.rounds; rep++) {
      const row = document.createElement('div');
      row.className = 'kegel-set';

      const repLabel = setDef.rounds > 1
        ? `${setDef.label} — rep ${rep + 1}`
        : `${setDef.label} — hold ${rep + 1}`;

      row.innerHTML = `
        <div class="kegel-set-label">${repLabel}</div>
        <button class="kegel-hold-btn" data-hold="${setDef.holdSec}">Hold ${setDef.holdSec}s</button>
        <button class="kegel-check">✓</button>
      `;

      const holdBtn = row.querySelector('.kegel-hold-btn');
      const checkBtn = row.querySelector('.kegel-check');
      let holdInterval = null;

      holdBtn.addEventListener('click', () => {
        if (holdInterval) { clearInterval(holdInterval); holdInterval = null; holdBtn.textContent = `Hold ${setDef.holdSec}s`; holdBtn.classList.remove('active'); return; }
        let remaining = setDef.holdSec;
        holdBtn.classList.add('active');
        holdBtn.textContent = `${remaining}s`;
        try { navigator.vibrate(50); } catch (_) {}
        holdInterval = setInterval(() => {
          remaining--;
          holdBtn.textContent = remaining > 0 ? `${remaining}s` : 'Done!';
          if (remaining <= 0) {
            clearInterval(holdInterval);
            holdInterval = null;
            holdBtn.classList.remove('active');
            try { navigator.vibrate([200, 100, 200]); } catch (_) {}
            setTimeout(() => { holdBtn.textContent = `Hold ${setDef.holdSec}s`; }, 1500);
          }
        }, 1000);
      });

      checkBtn.addEventListener('click', () => {
        checkBtn.classList.toggle('done');
        if (checkBtn.classList.contains('done')) checkBtn.textContent = '✓';
      });

      card.appendChild(row);
    }
  });

  if (exercise.notes) {
    const notes = document.createElement('div');
    notes.style.cssText = 'font-size:12px;color:var(--text2);padding:8px 0 0;line-height:1.5;';
    notes.textContent = exercise.notes;
    card.appendChild(notes);
  }

  container.appendChild(card);
}
