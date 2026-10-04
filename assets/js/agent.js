/**
 * VOYAGR · agent.js
 * Agent orchestrator: Planner > Route > CNN > RAG > Drafter > Critic > DFS > Writer
 * Designed & developed by Nikhil Chary Sriramoju
 */
let cur=null;
async function run(demo){
 const m={dest:$("dest").value.trim(),B:+$("bud").value,C:$("cur").value,D:Math.min(7,+$("days").value||3),P:+$("pax").value||1,S:$("sty").value,from:$("from").value.trim(),tm:$("tmode").value,id:Date.now()};
 if(demo){Object.assign(m,{dest:"Goa, India",B:35000,C:"INR",D:2,P:2,S:"Balanced",from:"Hyderabad, India",tm:"auto"})}else if(!m.dest)return $("st").textContent="Enter a destination.";
 $("go").disabled=$("demo").disabled=true;$("st").textContent="";$("out").innerHTML="";$("cnn").innerHTML="";$("log").innerHTML="";
 try{
  pipe(0);log("Planner",`Mission: ${m.D}-day ${m.S} trip to ${esc(m.dest)}, ${m.B} ${m.C}, ${m.P} pax → ${Math.round(m.B/m.P/m.D)} ${m.C}/person/day`);const trv=await journey(m,demo);m.G=trv?Math.max(0,m.B-trv.cost):m.B;if(trv&&m.G<=0)throw Error("Travel alone ("+trv.cost+" "+m.C+") exceeds your budget — raise the budget or choose a cheaper mode.");const pp=m.G*FX[m.C]/m.P/m.D;m.feas=pp<1500?"⚠ Very tight budget (≈"+Math.round(pp)+" INR/person/day): expect hostels, street food and public transport only.":pp<3500?"Tight but workable budget (≈"+Math.round(pp)+" INR/person/day equivalent).":"Comfortable budget (≈"+Math.round(pp)+" INR/person/day equivalent).";log("Budget Critic","Feasibility: "+m.feas);await sleep(300);
  pipe(1);let scene="";const f=$("img").files[0];
  if(f){const r=await cnn(f);scene=r.label;$("cnn").innerHTML=`<div class="row" style="justify-content:flex-start;margin:8px 0"><div><canvas class="fm" id="cf"></canvas></div><div class="mut">Pooled feature map (Sobel→ReLU→MaxPool)<br><b style="color:var(--a)">Scene: ${esc(r.label)} (${r.conf}%)</b> · edge density ${r.edge}</div></div>`;$("cf").replaceWith(r.canvas);log("CNN",`conv3x3 Sobel → ReLU → maxpool 2x2 → scene = <b>${esc(r.label)}</b> (${r.conf}%)`)}else log("CNN","No photo supplied — skipping vision stage");
  await sleep(200);pipe(2);const hits=rag(`${m.S} ${m.dest} budget transport pacing ${scene} ${m.P>3?"family":""}`);hits.forEach(h=>log("RAG",`${Math.round(h[0]/(hits[0][0]||1)*100)}% relevance · ${esc(h[1].slice(0,70))}…`));await sleep(200);
  pipe(3);let t;
  if(demo){t=DEMO;log("LLM Drafter","Demo mode: using bundled sample plan");await sleep(300)}
  else{const base=`Plan a ${m.D}-day trip to ${m.dest} for ${m.P} traveler(s), on-ground budget ${m.G} ${m.C}${trv?` (round-trip travel of ${trv.cost} ${m.C} is already reserved from the total ${m.B})`:""}, style ${m.S}. ${trv?"Traveller starts from "+m.from+" and arrives by "+trv.opts.find(o=>o.id===trv.chosen).name+"; keep day 1 light.":""} Feasibility: ${m.feas} ${scene?"Photo scene: "+scene+" — favour matching activities.":""}\nRetrieved tips:\n- ${hits.map(h=>h[1]).join("\n- ")}\nAll costs in ${m.C} for the whole group. Use real well-known places with accurate latitude/longitude. 3-5 stops per day, 4-6 places, 4-5 restaurants, 3 stays, 5 dos, 5 donts, 3 scams. If the budget is too low for the destination say so in the summary and choose budget options. Return JSON exactly like: ${SCHEMA}`;
   log("LLM Drafter","Generating structured itinerary…");t=await llm(base);pipe(4);
   for(let i=0;i<2&&(+t.estimated_total||0)>m.G*1.02;i++){log("Budget Critic",`Estimate ${t.estimated_total} > on-ground budget ${m.G}. Requesting revision ${i+1}…`);t=await llm(base+`\nPrevious plan cost ${t.estimated_total}, which exceeds ${m.G}. Cut costs so estimated_total <= ${m.G}. Previous: ${JSON.stringify(t)}`)}
   log("Budget Critic",`Approved: ${t.estimated_total} on-ground + ${trv?trv.cost:0} travel / ${m.B} ${m.C}`)}
  pipe(5);t=JSON.parse(JSON.stringify(t));let saved=0,tot=0;
  (t.days||[]).forEach(d=>{const idx=(d.items||[]).map((it,i)=>[it,i]).filter(a=>isFinite(a[0].lat)&&isFinite(a[0].lng)&&(a[0].lat||a[0].lng));
   if(idx.length>=3&&idx.length<=9){const pts=idx.map(a=>a[0]),r=dfs(pts),times=pts.map(p=>p.time).sort(),ord=r.order.map(i=>({...pts[i]}));ord.forEach((o,i)=>o.time=times[i]);idx.forEach((a,k)=>d.items[a[1]]=ord[k]);d.dfs={km:r.km,orig:r.orig,nodes:r.nodes,pruned:r.pruned};saved+=r.orig-r.km;tot+=r.orig;log("DFS",`Day ${d.day}: ${r.orig.toFixed(1)}km → ${r.km.toFixed(1)}km · ${r.nodes} nodes, ${r.pruned} pruned`)}});
  t.saved=saved;t.meta=m;t.travel=trv;if(trv)t.breakdown={...(t.breakdown||{}),travel:trv.cost};t.grand=(+t.estimated_total||0)+(trv?trv.cost:0);await sleep(200);pipe(6);log("Writer",`Done. Route distance saved: ${saved.toFixed(1)} km`);pipe(7);cur=t;render(t);
 }catch(e){$("st").textContent="⚠ "+e.message;log("ERROR",esc(e.message))}
 $("go").disabled=$("demo").disabled=false}
