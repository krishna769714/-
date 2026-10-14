// यह फाइल ऐप को मोबाइल में ऑफलाइन और तेज़ चलाने में मदद करती है
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
    e.respondWith(fetch(e.request));
});