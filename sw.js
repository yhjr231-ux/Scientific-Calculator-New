const CACHE_NAME = "scientific-calculator-v6";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icons/calculator-icon-192.png",
    "./icons/calculator-icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {

    // الملفات المهمة: هات أحدث نسخة من السيرفر
    if (
        event.request.url.includes("app.js") ||
        event.request.url.includes("style.css") ||
        event.request.url.includes("index.html")
    ) {
        event.respondWith(
            fetch(event.request)
                .then(response => {

                    const copy = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, copy));

                    return response;
                })
                .catch(() => caches.match(event.request))
        );

        return;
    }

    // باقي الملفات: Cache أولًا
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );

});