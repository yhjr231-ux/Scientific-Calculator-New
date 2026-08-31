const CACHE_NAME = "scientific-calculator-v11";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {

                for (const file of APP_FILES) {

                    try {
                        const response = await fetch(file, {
                            cache: "no-store"
                        });

                        if (response.ok) {
                            await cache.put(file, response);
                            console.log("Cached:", file);
                        } else {
                            console.warn("Cache skipped:", file);
                        }

                    } catch (error) {
                        console.warn("Cache skipped:", file);
                    }
                }

            })
            .then(() => self.skipWaiting())
    );
});


self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(keys =>
                Promise.all(
                    keys
                        .filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                )
            )
            .then(() => self.clients.claim())

    );
});


self.addEventListener("fetch", event => {

    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    // لا نتدخل في sw.js
    if (url.pathname.endsWith("/sw.js")) {
        return;
    }

    // ملفات الموقع الأساسية
    if (
        url.pathname.endsWith("/") ||
        url.pathname.endsWith("/index.html") ||
        url.pathname.endsWith("/style.css") ||
        url.pathname.endsWith("/app.js")
    ) {

        event.respondWith(

            fetch(request, {
                cache: "no-store"
            })
            .then(response => {

                if (response.ok) {

                    const copy = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => cache.put(request, copy))
                        .catch(() => {});

                }

                return response;

            })
            .catch(() => {

                return caches.match(request)
                    .then(cached => {

                        return cached || new Response(
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


    // باقي الملفات
    event.respondWith(

        caches.match(request)
            .then(cached => {

                return cached || fetch(request);

            })
            .catch(() => {

                return new Response(
                    "",
                    {
                        status: 503
                    }
                );

            })

    );

});