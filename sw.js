var cacheName = 'hello-world-page';
var filesToCache = [
	'/',
	'/index.html',
	'/js/drawingPadInit.js',
	'/js/drawing.js',
	"/style/css/main.css",
	"/style/css/toolbar.css",
	"/style/css/drawingPad.css",
	"/style/css/prompt.css", 
  "/style/css/fontawesome-all.min.css",
  "/style/css/prompt.css",
  "/style/webfonts/fa-brands-400.eot",
  "/style/webfonts/fa-brands-400.svg",
  "/style/webfonts/fa-brands-400.ttf",
  "/style/webfonts/fa-brands-400.woff",
  "/style/webfonts/fa-brands-400.woff2",
  "/style/webfonts/fa-regular-400.eot",
  "/style/webfonts/fa-regular-400.svg",
  "/style/webfonts/fa-regular-400.ttf",
  "/style/webfonts/fa-regular-400.woff",
  "/style/webfonts/fa-regular-400.woff2",
  "/style/webfonts/fa-solid-900.svg",
  "/style/webfonts/fa-solid-900.ttf",
  "/style/webfonts/fa-solid-900.woff",
  "/style/webfonts/fa-solid-900.woff2"
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});