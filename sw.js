const CACHE_NAME = "scientific-calculator-v7";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {

            for (const file of FILES_TO_CACHE) {
                try {
                    const response = await fetch(file, {
                        cache: "no-store"
                    });

                    if (response.ok) {
                        await cache.put(file, response);
                    }

                } catch (error) {
                    console.log("Cache skipped:", file);
                }
            }

        }).then(() => self.skipWaiting())
    );
});


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


self.addEventListener("fetch", event => {

    const url = new URL(event.request.url);

    // ملفات المشروع الأساسية:
    // حاول دائمًا تجيب أحدث نسخة
    if (
        url.pathname.endsWith("/app.js") ||
        url.pathname.endsWith("/style.css") ||
        url.pathname.endsWith("/index.html") ||
        url.pathname.endsWith("/")
    ) {

        event.respondWith(

            fetch(event.request, {
                cache: "no-store"
            })

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


    // باقي الملفات
    event.respondWith(

        caches.match(event.request)
            .then(cached => cached || fetch(event.request))

    );

});