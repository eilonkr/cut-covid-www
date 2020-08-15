const cacheName = 'cut-covid'

// Cache all the files to make a PWA
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        './',
        './hub.html',
        './hub_manifest.json',
        './img/icon-512.png',
        './img/icon-192.png',
        './css/theme.css',
        './css/pure-min.css',
      ])
    })
  )
})

// Our service worker will intercept all fetch requests
// and check if we have cached the file
// if so it will serve the cached file
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName)
      .then(cache => cache.match(event.request, { ignoreSearch: true }))
      .then(response => {
        return response || fetch(event.request)
      })
  )
})
