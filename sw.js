const cacheName = 'v2';

const cacheAssets = [
    'index.html',
    'style.css',
    '/js/index.js'
];

//call install event
self.addEventListener('install', (event) => {
    console.log('Service worker: installed');
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log("Service worker: caching files");
                cache.addAll(cacheAssets);
            })
            .then(() => self.skipWaiting())
    );
});

//call activate event
self.addEventListener('activate', (event) => {
    console.log('Service worker: activated');
    // remove unwanted caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log('Service worker: clearing old cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

//call fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service worker: fetching');
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    )
});