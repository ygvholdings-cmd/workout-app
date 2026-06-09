import { LIBRARY, MUSCLE_GROUPS, searchLibrary } from '../data/library.js';
import { getCustomExercises } from '../store.js';

const DIFFICULTY_COLOR = { Beginner: 'var(--green)', Intermediate: 'var(--yellow)', Advanced: 'var(--accent)' };
const EQUIPMENT_ICON = { Barbell: '🏋️', Dumbbell: '💪', Cable: '🔗', Machine: '⚙️', Bodyweight: '🤸', Bands: '🎗️', Kettlebell: '🔔', 'Pull-Up Bar': '🙌', 'Barbell (EZ)': '🏋️', 'Dumbbell/Cable': '🔗' };

let activeFilter = 'All';
let searchQuery = '';
let expandedCard = null;

export function renderLibrary(container) {
  container.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'screen-header';
  header.innerHTML = `
    <div class="screen-title">Movement Library</div>
    <div class="screen-sub">${LIBRARY.length} exercises — tap any for cues & notes</div>
  `;
  container.appendChild(header);

  // Search bar
  const searchWrap = document.createElement('div');
  searchWrap.style.cssText = 'padding:8px 16px 0';
  searchWrap.innerHTML = `<input type="text" id="lib-search" placeholder="🔍  Search exercises, muscles, equipment..." style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:14px;padding:10px 14px;width:100%;outline:none">`;
  container.appendChild(searchWrap);

  // Muscle group filter chips
  const chips = document.createElement('div');
  chips.style.cssText = 'display:flex;gap:6px;padding:10px 16px;overflow-x:auto;scrollbar-width:none';
  chips.id = 'lib-chips';
  MUSCLE_GROUPS.forEach(group => {
    const chip = document.createElement('button');
    chip.dataset.group = group;
    chip.textContent = group;
    chip.style.cssText = `flex-shrink:0;padding:5px 12px;border-radius:999px;border:1px solid ${group === activeFilter ? 'var(--accent)' : 'var(--border)'};background:${group === activeFilter ? 'var(--accent-dim)' : 'var(--surface)'};color:${group === activeFilter ? 'var(--accent)' : 'var(--text2)'};font-size:12px;font-weight:600;cursor:pointer`;
    chip.addEventListener('click', () => {
      activeFilter = group;
      renderExerciseList(container);
      // Update chip styles
      container.querySelectorAll('#lib-chips button').forEach(c => {
        const active = c.dataset.group === activeFilter;
        c.style.borderColor = active ? 'var(--accent)' : 'var(--border)';
        c.style.background = active ? 'var(--accent-dim)' : 'var(--surface)';
        c.style.color = active ? 'var(--accent)' : 'var(--text2)';
      });
    });
    chips.appendChild(chip);
  });
  container.appendChild(chips);

  // Custom exercises section (if any)
  const customs = getCustomExercises();
  if (customs.length) {
    const customLabel = document.createElement('div');
    customLabel.style.cssText = 'font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--accent);padding:4px 16px 2px';
    customLabel.textContent = '⭐ My Exercises';
    container.appendChild(customLabel);
    customs.forEach(ex => {
      const card = createExerciseCard({
        name: ex.name,
        category: 'custom',
        primaryMuscles: [ex.muscleGroup],
        secondaryMuscles: [],
        equipment: ex.equipment || 'Any',
        difficulty: 'Custom',
        cues: ex.notes ? [ex.notes] : [],
        notes: 'Custom exercise added by you.',
      }, container);
      container.appendChild(card);
    });
  }

  // Exercise list
  renderExerciseList(container);

  // Wire search
  container.querySelector('#lib-search').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderExerciseList(container);
  });
}

function renderExerciseList(container) {
  // Remove existing list
  container.querySelector('#lib-list')?.remove();

  const results = searchLibrary(searchQuery, activeFilter);
  const list = document.createElement('div');
  list.id = 'lib-list';
  list.style.cssText = 'padding:4px 16px 24px';

  if (!results.length) {
    list.innerHTML = '<div class="empty" style="padding:32px 0"><div class="empty-icon">🔍</div><p>No exercises found. Try a different search.</p></div>';
    container.appendChild(list);
    return;
  }

  // Count label
  const countEl = document.createElement('div');
  countEl.style.cssText = 'font-size:11px;color:var(--text2);padding:4px 0 8px';
  countEl.textContent = `${results.length} exercise${results.length !== 1 ? 's' : ''}`;
  list.appendChild(countEl);

  results.forEach(ex => {
    list.appendChild(createExerciseCard(ex, container));
  });

  container.appendChild(list);
}

function createExerciseCard(ex, container) {
  const card = document.createElement('div');
  card.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:8px;overflow:hidden;cursor:pointer';

  const diffColor = DIFFICULTY_COLOR[ex.difficulty] || 'var(--text2)';
  const equipIcon = EQUIPMENT_ICON[ex.equipment] || '🏋️';

  card.innerHTML = `
    <div class="ex-card-header" style="padding:12px 14px;display:flex;align-items:center;gap:10px">
      <div style="font-size:22px;flex-shrink:0">${equipIcon}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${ex.name}</div>
        <div style="font-size:11px;color:var(--text2);margin-top:2px">${ex.primaryMuscles.join(' · ')}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0">
        <span style="font-size:10px;color:${diffColor};font-weight:700">${ex.difficulty}</span>
        <span style="font-size:10px;color:var(--text2)">${ex.equipment}</span>
      </div>
      <div class="ex-chevron" style="color:var(--text2);font-size:14px;margin-left:4px">▶</div>
    </div>
    <div class="ex-details" style="display:none;border-top:1px solid var(--border)">
      ${ex.secondaryMuscles.length ? `
        <div style="padding:8px 14px 4px;font-size:11px;color:var(--text2)">
          <span style="font-weight:600">Secondary: </span>${ex.secondaryMuscles.join(' · ')}
        </div>` : ''}
      ${ex.cues.length ? `
        <div style="padding:8px 14px">
          <div style="font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">Cues</div>
          ${ex.cues.map((cue, i) => `
            <div style="display:flex;gap:8px;padding:4px 0;font-size:13px;border-bottom:1px solid var(--border)">
              <span style="color:var(--accent);font-weight:700;flex-shrink:0">${i+1}.</span>
              <span>${cue}</span>
            </div>`).join('')}
        </div>` : ''}
      ${ex.notes ? `
        <div style="padding:8px 14px 12px;font-size:12px;color:var(--text2);line-height:1.5;background:var(--surface2)">
          <span style="font-weight:700">📝 </span>${ex.notes}
        </div>` : ''}
    </div>
  `;

  // Expand/collapse on tap
  const cardHeader = card.querySelector('.ex-card-header');
  const details = card.querySelector('.ex-details');
  const chevron = card.querySelector('.ex-chevron');

  cardHeader.addEventListener('click', () => {
    const isOpen = details.style.display !== 'none';
    // Close all others
    document.querySelectorAll('.ex-details').forEach(d => { d.style.display = 'none'; });
    document.querySelectorAll('.ex-chevron').forEach(c => { c.textContent = '▶'; c.style.transform = ''; });
    if (!isOpen) {
      details.style.display = 'block';
      chevron.textContent = '▼';
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  return card;
}
