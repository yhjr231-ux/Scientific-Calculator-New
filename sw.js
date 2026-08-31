const CACHE_NAME = "scientific-calculator-v9";

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

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))

                );

            })
            .then(() => self.clients.claim())

    );
});


// ===============================
// FETCH
// ===============================

self.addEventListener("fetch", event => {

    // نسمح فقط بطلبات GET
    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    // ملفات الموقع الأساسية
    const isMainFile =
        url.pathname.endsWith("/") ||
        url.pathname.endsWith("/index.html") ||
        url.pathname.endsWith("/style.css") ||
        url.pathname.endsWith("/app.js") ||
        url.pathname.endsWith("/manifest.json");

    if (isMainFile) {

        event.respondWith(

            fetch(event.request, {
                cache: "no-store"
            })

            .then(response => {

                if (!response || !response.ok) {
                    throw new Error("Network response not OK");
                }

                const copy = response.clone();

                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, copy);
                    })
                    .catch(() => {});

                return response;
            })

            .catch(() => {

                return caches.match(event.request)
                    .then(cached => {

                        if (cached) {
                            return cached;
                        }

                        return new Response(
                            "Offline",
                            {
                                status: 503,
                                statusText: "Offline"
                            }
                        );

                    });

            })

        );

        return;
    }


    // ===============================
    // باقي الملفات
    // ===============================

    event.respondWith(

        caches.match(event.request)
            .then(cachedResponse => {

                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);

            })

            .catch(() => {

                return new Response(
                    "",
                    {
                        status: 503,
                        statusText: "Offline"
                    }
                );

            })

    );

});