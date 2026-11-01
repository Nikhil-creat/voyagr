/* VOYAGR service worker v5: network-first pages, cache-first static, offline fallback */
const V='voyagr-v7';
const CORE=['./','index.html','manifest.json','404.html','privacy.html','terms.html','assets/css/styles.css','assets/css/v5.css','assets/css/v6.css','assets/img/icon.svg'].concat(['config','utils','background','pipeline-ui','rag','cnn','dfs','ai','travel','maps','render','storage','demo-data','features','agent','ui','v5','v6','v6-ai'].map(n=>'assets/js/'+n+'.js'));
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>0)))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));return}
 e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c))}return x})))});
