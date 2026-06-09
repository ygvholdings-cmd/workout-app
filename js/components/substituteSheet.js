import { SUBSTITUTIONS } from '../data/substitutions.js';
import { setSubstitution, getCustomExercises } from '../store.js';

let _onSelect = null;

export function openSubSheet(originalName, onSelect) {
  _onSelect = onSelect;
  const sheet = document.getElementById('sub-sheet');
  if (!sheet) return;

  const title = sheet.querySelector('.sub-title');
  if (title) title.textContent = `Swap: ${originalName}`;

  const list = sheet.querySelector('.sub-list');
  if (!list) return;
  list.innerHTML = '';

  const builtIn = SUBSTITUTIONS[originalName] || [];
  const custom = getCustomExercises().map(e => ({ name: e.name, muscle: e.muscleGroup + (e.equipment ? ' · ' + e.equipment : ''), isCustom: true }));
  const alts = [...builtIn, ...custom];

  if (!alts.length) {
    list.innerHTML = '<p style="padding:16px;color:var(--text2);font-size:14px">No alternatives listed. Add your own in Settings → My Exercises.</p>';
  } else {
    alts.forEach(alt => {
      const btn = document.createElement('button');
      btn.className = 'sub-option';
      btn.innerHTML = `
        <div class="sub-option-name">${alt.name}${alt.isCustom ? ' <span style="font-size:10px;color:var(--accent)">MY EXERCISE</span>' : ''}</div>
        <div class="sub-option-muscle">${alt.muscle}</div>
      `;
      btn.addEventListener('click', () => {
        setSubstitution(originalName, alt.name);
        if (_onSelect) _onSelect(alt.name);
        closeSubSheet();
      });
      list.appendChild(btn);
    });

    // Option to revert to original
    const revert = document.createElement('button');
    revert.className = 'sub-option';
    revert.innerHTML = `<div class="sub-option-name" style="color:var(--text2)">↩ Use original: ${originalName}</div>`;
    revert.addEventListener('click', () => {
      setSubstitution(originalName, null);
      if (_onSelect) _onSelect(null);
      closeSubSheet();
    });
    list.appendChild(revert);
  }

  sheet.classList.add('show');
}

export function closeSubSheet() {
  document.getElementById('sub-sheet')?.classList.remove('show');
}

export function initSubSheet() {
  const sheet = document.getElementById('sub-sheet');
  sheet?.querySelector('.sub-backdrop')?.addEventListener('click', closeSubSheet);
}
