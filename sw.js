// Project A1 - Lightweight PWA Service Worker
const CACHE_NAME = 'project-a1-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let network handle API requests directly
  if (event.request.url.includes('/api/')) {
    return;
  }
  // Network first with fallback to cache for offline resilience
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
