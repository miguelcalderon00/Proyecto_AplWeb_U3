const CACHE_NAME = 'taskflow-v3';

const ARCHIVOS_CACHE = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/favicon.svg',
    '/taskflow.svg',
    '/taskflow-192.png',
    '/taskflow-512.png'
];
// Instalar Service Worker y guardar recursos básicos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ARCHIVOS_CACHE))
            .then(() => self.skipWaiting())
    );
});

// Activar y limpiar cachés anteriores
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((nombres) =>
            Promise.all(
                nombres
                    .filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
            )
        ).then(() => self.clients.claim())
    );
});

// Servir recursos guardados cuando sea posible
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // No almacenar solicitudes a la API ni peticiones externas
    if (
        event.request.method !== 'GET' ||
        url.origin !== self.location.origin ||
        url.pathname.startsWith('/api/')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.ok) {
                    const copia = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, copia);
                    });
                }

                return response;
            })
            .catch(async () => {
                const recursoGuardado = await caches.match(event.request);

                if (recursoGuardado) {
                    return recursoGuardado;
                }

                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }

                return new Response('Recurso no disponible sin conexión', {
                    status: 503,
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                });
            })
    );
});
