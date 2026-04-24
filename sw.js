const CACHE_NAME = 'pxl95-v2'; // Bump version
const ASSETS = [
  './',
  './index.html',
  './src/style.css',
  './src/app.js',
  './src/theme-win31.css',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
