const CACHE_NAME = 'element-match-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192×192.png',
  './icon-512×512.png'
  // หากมีไฟล์ CSS/JS หรือรูปภาพอื่นๆ ให้ใส่ path เข้ามาที่นี่เพิ่ม เช่น './style.css', './script.js'
];

// ติดตั้ง Service Worker และ Caching ไฟล์
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ดึงข้อมูลจาก Cache เมื่ออยู่ในสถานะ Offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// ลบ Cache เก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});
