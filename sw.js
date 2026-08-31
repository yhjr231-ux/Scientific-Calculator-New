const CACHE_NAME = "scientific-calculator-v8";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icons/calculator-icon-192.png",
    "./icons/calculator-icon-512.png"
];

// ===============================
// INSTALL
// ===============================

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    );

    self.skipWaiting();
});


// ===============================
// ACTIVATE
// ===============================

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});


// ===============================
// FETCH
// ===============================

self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // لا تجعل Service Worker يمسك طلب sw.js نفسه
    if (url.pathname.endsWith("/sw.js")) {
        return;
    }

    // الملفات المهمة:
    // الإنترنت أولاً ثم الكاش
    if (
        url.pathname.endsWith("/index.html") ||
        url.pathname.endsWith("/style.css") ||
        url.pathname.endsWith("/app.js")
    ) {

        event.respondWith(
            fetch(event.request, {
                cache: "no-store"
            })
            .then(response => {

                if (response && response.ok) {
                    const copy = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(event.request, copy));
                }

                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
        );

        return;
    }


    // باقي الملفات:
    // الكاش أولاً ثم الإنترنت
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);
            })
    );
});