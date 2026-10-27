/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const CACHE_NAME = 'snake-game-gh-v2';

// Dynamically determine the base path (e.g. '/' or '/my-repo/' on GitHub Pages)
const BASE_PATH = self.location.pathname.replace(/service-worker\.js$/, '');

const ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'icon.svg',
  BASE_PATH + 'pwa-192x192.png',
  BASE_PATH + 'pwa-512x512.png',
  BASE_PATH + 'pwa-maskable-512x512.png',
  BASE_PATH + 'apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('Some static assets could not be cached immediately:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // HTML navigation requests
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          return caches.match(BASE_PATH + 'index.html') || caches.match(BASE_PATH);
        })
    );
    return;
  }

  // Assets: cache first with network fallback and background refresh
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) {
        fetch(req)
          .then((networkRes) => {
            if (networkRes && networkRes.status === 200) {
              caches.open(CACHE_NAME).then((c) => c.put(req, networkRes));
            }
          })
          .catch(() => {});
        return cached;
      }

      return fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200 && networkRes.type === 'basic') {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => cached);
    })
  );
});
