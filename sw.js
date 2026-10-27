// Ashley-s-Spot service worker
// v2 (2026-10-26): the stale-page gremlin fix. Page navigations always fetch
// fresh from the network, bypassing the browser's stored copy, so site
// updates show up immediately. Other requests keep the plain pass-through.
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  var isPage = req.mode === 'navigate' ||
    (req.method === 'GET' && (req.headers.get('accept') || '').indexOf('text/html') !== -1);
  if (isPage) {
    e.respondWith(
      fetch(req, { cache: 'no-store' }).catch(function () { return fetch(req); })
    );
    return;
  }
  e.respondWith(fetch(req));
});
