const CACHE_NAME = 'trackr-cache-v1';
const FILES_TO_CACHE = [
  './',
  './tracker.html'
];

self.addEventListener('install', evt => {
  console.log('[SW] Install');
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  console.log('[SW] Activate');
  evt.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET') return;
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request).catch(() => caches.match('./tracker.html'));
    })
  );
});