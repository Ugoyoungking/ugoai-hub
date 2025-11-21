// Choose a cache name
const CACHE_NAME = 'ugo-ai-studio-cache-v1';
// List the files to precache
const PRECACHE_ASSETS = [
  '/',
  '/login',
  '/signup',
  '/dashboard',
  '/faq',
  '/terms',
  '/privacy',
  '/offline.html'
];

// When the service worker is installed, open the cache and add the precache assets
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_ASSETS);
  })());
});

// When there's a fetch request, try to respond with a cached resource
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        console.log('Fetch failed; returning offline page instead.', error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match('/offline.html');
        return cachedResponse;
      }
    })());
  } else if (PRECACHE_ASSETS.includes(new URL(event.request.url).pathname)) {
     event.respondWith(
      caches.match(event.request)
    );
  }
});
