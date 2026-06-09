let _timeout = null;

export function showPR(exerciseName, weight, reps, newOrm) {
  const banner = document.getElementById('pr-banner');
  if (!banner) return;

  const title = banner.querySelector('.pr-text h3');
  const sub = banner.querySelector('.pr-text p');
  if (title) title.textContent = `New PR — ${exerciseName}!`;
  if (sub) sub.textContent = `${weight} kg × ${reps} reps · Est. 1RM: ${Math.round(newOrm)} kg`;

  banner.classList.add('show');
  if (_timeout) clearTimeout(_timeout);
  _timeout = setTimeout(() => banner.classList.remove('show'), 4000);
}
