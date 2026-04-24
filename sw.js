const CACHE_NAME = 'pxl95-v5'; // Bump version
const ASSETS = [
  './',
  './index.html',
  './src/layout.css',
  './src/app.js',
  './src/theme-win95.css',
  './src/theme-win31.css',
  './src/theme-haiku.css',
  './src/theme-macos8.css',
  './src/theme-motif.css',
  './src/theme-amiga.css',
  './src/theme-ncurses.css',
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
