// Service Worker - 用於快取資源，加快載入速度
const CACHE_NAME = 'birthday-surprise-v2';
const urlsToCache = [
    './',
    './index.html',
    './timeline1.mp4',
    './timeline2.mp4',
    './happyBD.mp3',
    './narration.mp3'
];

// 安裝 Service Worker 時快取所有資源
self.addEventListener('install', event => {
    console.log('Service Worker: 安裝中...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: 快取檔案');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('Service Worker: 快取失敗', err);
            })
    );
});

// 攔截網路請求，優先使用快取
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 如果快取中有，直接返回
                if (response) {
                    console.log('Service Worker: 從快取載入', event.request.url);
                    return response;
                }
                // 否則從網路取得
                return fetch(event.request);
            })
    );
});

// 更新 Service Worker 時清除舊快取
self.addEventListener('activate', event => {
    console.log('Service Worker: 啟動中...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: 清除舊快取', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
