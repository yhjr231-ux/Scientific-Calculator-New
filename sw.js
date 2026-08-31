const CACHE_NAME = "scientific-calculator-v10";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icons/calculator-icon-192.png",
    "./icons/calculator-icon-512.png"
];


// ================================
// INSTALL
// ================================

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .catch(error => {
                console.error("Cache install error:", error);
            })
    );

    self.skipWaiting();
});


// ================================
// ACTIVATE
// ================================

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


// ================================
// FETCH
// ================================

self.addEventListener("fetch", event => {

    const request = event.request;
    const url = new URL(request.url);

    // لا نتدخل في طلبات غير GET
    if (request.method !== "GET") {
        return;
    }

    // لا نتدخل في sw.js نفسه
    if (url.pathname.endsWith("/sw.js")) {
        return;
    }

    // ملفات الموقع المهمة:
    // الشبكة أولًا ثم الكاش
    if (
        url.pathname.endsWith("/index.html") ||
        url.pathname.endsWith("/style.css") ||
        url.pathname.endsWith("/app.js") ||
        url.pathname.endsWith("/")
    ) {

        event.respondWith(

            fetch(request)
                .then(response => {

                    if (response && response.ok) {

                        const copy = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(request, copy);
                            })
                            .catch(() => {});

                    }

                    return response;
                })
                .catch(() => {

                    return caches.match(request)
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


    // باقي الملفات:
    // الكاش أولًا ثم الشبكة

    event.respondWith(

        caches.match(request)
            .then(cached => {

                if (cached) {
                    return cached;
                }

                return fetch(request);

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