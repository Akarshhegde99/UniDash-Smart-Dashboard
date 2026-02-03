const CACHE_NAME = 'unidash-v17';
const ASSETS = [
    './css/style.css',
    './js/app.js',
    './js/storage.js',
    './js/auth.js',
    './js/theme.js',
    './js/tasks.js',
    './js/expenses.js',
    './js/weather.js',
    './js/notes.js',
    './js/profile.js',
    './js/time.js',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event
self.addEventListener('install', event => {
    self.skipWaiting(); // Force the new service worker to become active immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching essential assets');
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim()) // Take control of all open clients immediately
    );
});

// Fetch Event - Network First Strategy
// This ensures that the user always gets the latest version of the app if online.
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
