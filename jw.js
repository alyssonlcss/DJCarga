const CACHE_NAME = 'djcarga-cache-v1';
const urlsToCache = [
  './',
  './index.html'
];

// Instala o Service Worker e salva os arquivos na memória do celular
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Quando o usuário estiver sem internet, busca os arquivos da memória
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrar, senão tenta baixar da rede
        return response || fetch(event.request);
      })
  );
});