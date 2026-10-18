/* Deckel – offline-fähig: alle Dateien beim Installieren zwischenspeichern */
const CACHE='deckel-v13';
const FILES=['./','index.html','manifest.webmanifest',
 'icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png',
 'fonts/barlow-condensed-latin-500-normal.woff2','fonts/barlow-condensed-latin-600-normal.woff2','fonts/barlow-condensed-latin-700-normal.woff2','fonts/barlow-condensed-latin-800-normal.woff2',
 'fonts/figtree-latin-400-normal.woff2','fonts/figtree-latin-500-normal.woff2','fonts/figtree-latin-600-normal.woff2','fonts/figtree-latin-700-normal.woff2'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
/* Seite: erst Netz (für Updates), sonst Zwischenspeicher. Rest: erst Zwischenspeicher. */
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  if(r.mode==='navigate'){ e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{ const c=res.clone(); caches.open(CACHE).then(x=>x.put('index.html',c)); return res; }).catch(()=>caches.match('index.html'))); return; }
  e.respondWith(caches.match(r).then(m=>m||fetch(r)));
});
