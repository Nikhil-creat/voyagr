/**
 * VOYAGR · storage.js
 * Saved trips (localStorage)
 * Designed & developed by Nikhil Chary Sriramoju
 */
const ld=()=>{try{return JSON.parse(localStorage.getItem("v_trips")||"[]")}catch{return[]}};
function save(){if(!cur)return;localStorage.setItem("v_trips",JSON.stringify([cur,...ld().filter(x=>x.meta.id!==cur.meta.id)]));list()}
function list(){const a=ld();$("cnt").textContent=a.length+" saved";$("saved").innerHTML=a.map((t,i)=>`<div class="row it"><span>${esc(t.meta.dest)} · ${t.meta.D}d · ${t.meta.B} ${t.meta.C}</span><span><button class="s" onclick="openT(${i})">Open</button> <button class="s" onclick="delT(${i})">✕</button></span></div>`).join("")||'<p class="mut">No trips saved yet.</p>'}
const openT=i=>{cur=ld()[i];render(cur)},delT=i=>{const a=ld();a.splice(i,1);localStorage.setItem("v_trips",JSON.stringify(a));list()};
function dl(){file("trip.json","application/json",JSON.stringify(cur,null,2))}
