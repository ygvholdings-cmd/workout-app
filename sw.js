const CACHE = 'workout-v7';
const ASSETS = [
  'index.html',
  'css/main.css',
  'css/components.css',
  'css/screens.css',
  'js/app.js',
  'js/store.js',
  'js/data/program.js',
  'js/data/ppl.js',
  'js/data/substitutions.js',
  'js/screens/today.js',
  'js/screens/schedule.js',
  'js/screens/history.js',
  'js/screens/records.js',
  'js/screens/stats.js',
  'js/screens/library.js',
  'js/data/library.js',
  'js/screens/calculator.js',
  'js/components/timer.js',
  'js/components/setLogger.js',
  'js/components/prBanner.js',
  'js/components/substituteSheet.js',
  'js/components/kegelTimer.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Always fetch sw.js fresh from network — never serve from cache
  if (e.request.url.includes('sw.js')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Allow pages to trigger immediate SW activation
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
