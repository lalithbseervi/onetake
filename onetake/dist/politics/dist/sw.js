var cacheName = 'pwa';
var filesToCache = [
    '/',
    '/index.html',
    '/sw.js',
    '/manifest.json',
    '/css/main.css',
    '/js/main.js',
    '/win/farmer-protest/index.html',
    '/win/farmer-protest/css/main.css',
    '/anti_national/sabchangasi/index.html',
    '/anti_national/sabchangasi/css/main.css',
    '/anti_national/hatespeech/index.html',
    '/anti_national/hatespeech/css/main.css',
    '/anit_national/sedition/index.html',
    '/anit_national/sedition/css/main.css'
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