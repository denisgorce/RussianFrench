/* FrançaisRU — Service Worker v1 */
const CACHE = 'francaisru-v1';
const STATIC = [
  './', './index.html', './style.css', './app.js', './manifest.json',
  './data/module1.json', './data/level-test.json',
  './icons/icon-192.svg', './icons/icon-512.svg',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Nunito:wght@300;400;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC.filter(u => !u.startsWith('http'))))
      .then(() => self.skipWaiting())
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
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(e.request);
      try {
        const fresh = await fetch(e.request);
        if (fresh.ok) cache.put(e.request, fresh.clone());
        return fresh;
      } catch {
        return cached || new Response('Offline', { status: 503 });
      }
    })
  );
});
