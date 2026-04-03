const CACHE_NAME = 'hajj-guide-v11-1';
const ASSETS = [
    'index.html',
    'style.css',
    'script_v3.js',
    'manifest.json',
    'icon-192.png',
    'icon-512.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting(); // Force the waiting service worker to become the active one.
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Service Worker: Caching assets');
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    // Claim any existing clients immediately
    event.waitUntil(clients.claim());
    
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch events
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
