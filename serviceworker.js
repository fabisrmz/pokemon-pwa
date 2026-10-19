const CACHE_NAME = "pokemon-pwa-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./detalle.html",
    "./css/style.css",
    "./css/detalle.css",
    "./js/app.js",
    "./js/detalle.js",
    "./manifest.json"
];

// Instalación: Precarga de archivos locales estáticos
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Activación: Limpieza de cachés antiguas si cambia la versión
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch: Intercepta peticiones y guarda en caché dinámicamente las respuestas de la PokéAPI
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(networkResponse => {
                // Guardar en caché una copia de la respuesta recibida (imágenes y respuestas API)
                if (event.request.method === "GET" && networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            }).catch(() => {
                // En caso de fallar y no estar en caché
                console.log("Error de conexión y recurso no disponible en caché.");
            });
        })
    );
});