const cacheName = 'v3';

//call install event
self.addEventListener('install', (event) => {
    console.log('Service worker: installed');
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
        fetch(event.request)
            .then(res => {
                //make clone of response
                const resClone = res.clone();
                //open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        // add response to cache
                        cache.put(event.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(event.request).then(res => res))
    );
});