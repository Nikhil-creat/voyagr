// VOYAGR service worker: network-first with offline fallback
const C="voyagr-v4",F=["./","index.html","manifest.json","assets/css/styles.css","assets/img/icon.svg","assets/js/agent.js","assets/js/ai.js","assets/js/background.js","assets/js/cnn.js","assets/js/config.js","assets/js/demo-data.js","assets/js/dfs.js","assets/js/features.js","assets/js/maps.js","assets/js/pipeline-ui.js","assets/js/rag.js","assets/js/render.js","assets/js/storage.js","assets/js/travel.js","assets/js/ui.js","assets/js/utils.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener("fetch",e=>{if(new URL(e.request.url).origin!==location.origin)return;e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
