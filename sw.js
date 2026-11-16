/**
 * Service Worker - DJ Carga
 * Versão 1.5.3 - Ajuste da troca de unidade no aviso de potência e rodapé dinâmico visível
 */

const CACHE_NAME = 'djcarga-v1.5.3';

const STATIC_ASSETS = [
  '/',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon.svg',
  '/LICENSE'
];

// Instalação do Service Worker e pré-cache dos arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação e limpeza imediata de versões antigas do cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[DJ Carga] Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Responde a solicitações da interface com a versão exata do CACHE_NAME
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    const match = CACHE_NAME.match(/djcarga-(v[0-9.]+)/);
    const version = match ? match[1] : CACHE_NAME;
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ version });
    }
  }
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Em desenvolvimento local (localhost / 127.0.0.1), sempre busca da rede para refletir alterações instantaneamente
  const isDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  if (isDev) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // Se for navegação de página (abertura do app ou recarregar página)
  if (event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) {
    event.respondWith(
      caches.match('/').then((cachedPage) => {
        // Se temos a página em cache, retorna ela imediatamente (inclusive offline)
        if (cachedPage) {
          // Atualiza em background se houver conexão
          fetch('/')
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                const clone = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put('/', clone));
              }
            })
            .catch(() => {});

          return cachedPage;
        }

        // Se não estava em cache, tenta buscar na rede
        return fetch(event.request).catch(() => caches.match('/'));
      })
    );
    return;
  }

  // Para assets estáticos (CSS, JS, SVG, JSON)
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não encontrou no cache, busca na rede e salva no cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Caso falhe e seja navegação, retorna a raiz
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
