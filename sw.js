self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                './index.html',
                './page.css',
                './uomTrack.js',
                './assets/CHN.gif',
                './assets/copy-icon.png',
                './assets/delete-icon.png',
                './assets/ITA.gif',
                './assets/KEN.gif',
                './assets/RSA.gif',
                './assets/track.jpg',
                './assets/track2.jpg',
                './assets/USA.gif',
                './img/logo192.png',
                './img/logo512.png'
            ]);
        })
    );
});

// https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith
self.addEventListener('fetch', function (event) {
    event.respondWith(async function() {
        let res = await caches.match(event.request);
        if(res) return res;
        else return fetch(event.request);
    }());
});