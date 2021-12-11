var cacheName = 'pwa';
var filesToCache = [
    '/',
    '/index.html',
    '/css/main.css',
    '/manifest.json',
    '/js/sw.js',
    '/js/main.js',
];

self.addEventListener('install', function(e){
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});