/* ================= Оффлайн ажиллагаа (Service Worker) =================
   Анх нээхэд бүх файлыг хадгалж (кэш), дараа нь интернэтгүй үед ч эндээс өгнө.
   Файл өөрчлөх бүрдээ VERSION-ийг нэмэгдүүлбэл хэрэглэгчдэд шинэ хувилбар очно. */
const VERSION = 'anat-v5';                         // кэшийн хувилбар
const FILES = [                                    // урьдчилан хадгалах файлууд
  './', 'index.html', 'manifest.webmanifest',
  'lib/three.min.js', 'lib/OrbitControls.js',
  'learn/learn.css', 'learn/learn.js', 'learn/viewer3d.js',
  'learn/data-1.js', 'learn/data-2.js', 'learn/data-3.js',
  'learn/figs-1.js', 'learn/figs-2.js', 'learn/figs-3.js', 'learn/extra.js',
  'learn/data-2b.js', 'learn/figs-2b.js', 'learn/extra-2b.js',
  'learn/data-3b.js', 'learn/figs-3b.js', 'learn/extra-3b.js',
  'learn/data-4a.js', 'learn/figs-4a.js', 'learn/extra-4a.js',
  'data/manifest.json', 'data/tour.json',
  'data/bone.txt', 'data/muscle.txt', 'data/organ.txt', 'data/skin.txt', 'data/vessel.txt',
  'icons/icon-192.png', 'icons/icon-512.png'
];
// Суулгах үед: бүх файлыг кэшлэх
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
// Идэвхжих үед: хуучин хувилбарын кэшийг устгах
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Хүсэлт бүрт: эхлээд кэшээс, байхгүй бол интернэтээс авч кэшлэнэ
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin) {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy));
    } else if (res.ok && /fonts\.(googleapis|gstatic)\.com/.test(e.request.url)) {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy));   // үсгийн хэвийг ч хадгална
    }
    return res;
  }).catch(() => caches.match('index.html'))));
});
