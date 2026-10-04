/**
 * VOYAGR · maps.js
 * Leaflet/OpenStreetMap map, geocoding, Wikipedia place guide
 * Designed & developed by Nikhil Chary Sriramoju
 */
// ---------- maps ----------
let LM,dayL={},VB={j:[],s:[]};
const geo=q=>fetch("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+encodeURIComponent(q)).then(r=>r.json()).then(a=>a[0]?[+a[0].lat,+a[0].lon]:null).catch(()=>null);
const gdir=its=>{const p=(its||[]).filter(i=>i.lat||i.lng).map(i=>i.lat+","+i.lng);return p.length<2?"":"https://www.google.com/maps/dir/?api=1&travelmode=driving&origin="+p[0]+"&destination="+p[p.length-1]+(p.length>2?"&waypoints="+encodeURIComponent(p.slice(1,-1).join("|")):"")};
function initMap(t){const el=$("lmap");if(!window.L){if(document.readyState!=="complete"){addEventListener("load",()=>initMap(t),{once:true});return}el.innerHTML='<p class="mut" style="padding:12px">Map library did not load — check your internet.</p>';return}
 if(LM){LM.remove();LM=null}LM=L.map("lmap",{scrollWheelZoom:false});L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap contributors"}).addTo(LM);
 const cols=["#22d3ee","#a78bfa","#f472b6","#facc15","#4ade80","#fb923c","#60a5fa"],all=[];dayL={};
 (t.days||[]).forEach((d,di)=>{const g=L.layerGroup(),pts=[];(d.items||[]).forEach((i,k)=>{if(!(i.lat||i.lng))return;const ll=[+i.lat,+i.lng];pts.push(ll);all.push(ll);L.marker(ll,{icon:L.divIcon({className:"",iconSize:[26,26],html:`<div style="background:${cols[di%7]};color:#050a1c;font-weight:700;border-radius:50%;width:26px;height:26px;line-height:22px;text-align:center;border:2px solid #fff;box-shadow:0 0 10px ${cols[di%7]}">${k+1}</div>`})}).bindPopup(`<b>${esc(i.place)}</b><br>Day ${esc(d.day)} · ${esc(i.time)}<br>${esc(i.activity)}`).addTo(g)});if(pts.length>1)L.polyline(pts,{color:cols[di%7],weight:3,dashArray:"6 6"}).addTo(g);g.addTo(LM);dayL[di]=g});
 const stops=all.slice(),v=t.travel;
 if(v){const pin=e=>L.divIcon({className:"",iconSize:[30,30],html:`<div style="font-size:22px;filter:drop-shadow(0 0 6px #4ade80)">${e}</div>`}),ln=v.line&&v.line.length>1;
  L.marker(v.o,{icon:pin("📍")}).bindPopup("<b>Start</b><br>"+esc(v.from)).addTo(LM);L.marker(v.d,{icon:pin("🏁")}).bindPopup("<b>Destination</b><br>"+esc(t.meta.dest)).addTo(LM);
  L.polyline(ln?v.line:[v.o,v.d],{color:"#4ade80",weight:4,opacity:.85,dashArray:ln?null:"2 8"}).addTo(LM).bindPopup(Math.round(v.road)+" km");all.push(v.o,v.d)}
 VB={j:all.slice(),s:stops};
 if(all.length)LM.fitBounds(all,{padding:[30,30]});else{LM.setView([20,78],4);geo(t.meta.dest).then(c=>c&&LM.setView(c,11))}
 setTimeout(()=>LM.invalidateSize(),300)}
function fitView(k){const b=k?VB.s:VB.j;if(LM&&b.length)LM.fitBounds(b,{padding:[30,30]})}
function togDay(i){const g=dayL[i],c=$("dc"+i);if(!g||!LM)return;if(LM.hasLayer(g)){LM.removeLayer(g);c.classList.remove("on")}else{g.addTo(LM);c.classList.add("on")}}
async function gallery(t){const g=$("gal");g.innerHTML="";let n=0;await Promise.all([...new Set((t.places||[]).map(p=>p.name))].slice(0,6).map(async nm=>{try{const r=await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(nm.replace(/ /g,"_")));if(!r.ok)return;const j=await r.json();if(j.type==="disambiguation"||!j.extract)return;n++;g.insertAdjacentHTML("beforeend",`<div>${j.thumbnail?`<img loading="lazy" alt="" src="${esc(j.thumbnail.source)}">`:""}<p><b style="color:var(--ink)">${esc(nm)}</b><br>${esc(j.extract.slice(0,150))}…<br><a target="_blank" href="${esc(j.content_urls.desktop.page)}">Wikipedia ↗</a></p></div>`)}catch{}}));if(!n)g.innerHTML='<span class="mut">No Wikipedia entries found (or offline).</span>'}
