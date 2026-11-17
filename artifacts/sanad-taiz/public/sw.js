const VERSION = 'sanad-v74';
const SHELL = VERSION + '-shell';
const API = VERSION + '-api';
const IMG = VERSION + '-img';
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/favicon.svg', '/logo.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then(c => c.addAll(PRECACHE).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;
  const same = url.origin === self.location.origin;
  const font = url.hostname.includes('fonts.googleapis') || url.hostname.includes('fonts.gstatic');
  const image = req.destination === 'image' || url.hostname.includes('unsplash.com');

  if (same && (url.pathname.startsWith('/api/admin') || url.pathname.startsWith('/api/auth'))) return;

  if (same && url.pathname.startsWith('/api/public')) {
    e.respondWith(fetch(req).then(r => {
      if (r.status === 200) caches.open(API).then(c => c.put(req, r.clone()));
      return r;
    }).catch(() => caches.match(req).then(c => c || new Response(JSON.stringify({ error: 'offline' }), { status: 503, headers: { 'Content-Type': 'application/json' } }))));
    return;
  }

  if (font || image) {
    e.respondWith(caches.match(req).then(c => c || fetch(req).then(r => {
      if (r.status === 200) caches.open(IMG).then(cc => cc.put(req, r.clone()));
      return r;
    })));
    return;
  }

  if (same) {
    e.respondWith(fetch(req).then(r => {
      if (r.status === 200) caches.open(SHELL).then(c => c.put(req, r.clone()));
      return r;
    }).catch(() => caches.match(req).then(c => c || (req.mode === 'navigate' ? caches.match('/index.html') : new Response('Offline', { status: 503 })))));
  }
});

self.addEventListener('message', (e) => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });
