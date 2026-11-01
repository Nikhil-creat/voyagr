/* VOYAGR v5 – header/footer behaviour + Travel toolbox. Additive: does not touch core agents. */
(function(){'use strict';
var $=function(i){return document.getElementById(i)};
var LS={get:function(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
function toast(m){var t=$('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('on')},2400)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
if($('yr'))$('yr').textContent=new Date().getFullYear();

/* offline banner, back-to-top, install prompt, "/" shortcut */
function net(){$('offline').hidden=navigator.onLine}addEventListener('online',net);addEventListener('offline',net);net();
var up=$('top-btn');addEventListener('scroll',function(){up.hidden=scrollY<500},{passive:true});up.onclick=function(){scrollTo({top:0})};
var dp;addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;$('inst').hidden=false});
$('inst').onclick=function(){if(!dp)return;dp.prompt();dp.userChoice.then(function(){dp=null;$('inst').hidden=true})};
addEventListener('appinstalled',function(){toast('VOYAGR installed')});
addEventListener('keydown',function(e){if(e.key==='/'&&!/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();$('dest').focus()}});

/* toolbox */
var box=$('toolbox');if(!box)return;
function tool(id,title,html){var d=document.createElement('article');d.className='card v5tool';d.id=id;d.innerHTML='<b>'+title+'</b>'+html;box.appendChild(d);return d}

/* 1. currency converter (Frankfurter, free, no key) */
var C=tool('t-cur','💱 Currency converter','<div class="row2"><input id="c-amt" type="number" value="1000" min="0" aria-label="Amount"><select id="c-from" aria-label="From currency"></select><select id="c-to" aria-label="To currency"></select></div><button class="s" id="c-go" type="button">Convert</button><div class="v5out" id="c-out" aria-live="polite"></div>');
['INR','USD','EUR','GBP','JPY','AED','SGD','THB','AUD','CAD'].forEach(function(c){['c-from','c-to'].forEach(function(s,i){var o=document.createElement('option');o.textContent=c;if((i==0&&c=='INR')||(i==1&&c=='USD'))o.selected=true;$(s).appendChild(o)})});
$('c-go').onclick=function(){var a=+$('c-amt').value,f=$('c-from').value,t=$('c-to').value,o=$('c-out');if(!(a>0)){o.textContent='Enter an amount above 0.';return}if(f===t){o.textContent=a.toLocaleString()+' '+t;return}
 o.textContent='Fetching rate…';fetch('https://api.frankfurter.app/latest?amount='+a+'&from='+f+'&to='+t).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){o.textContent=a.toLocaleString()+' '+f+' ≈ '+d.rates[t].toLocaleString(undefined,{maximumFractionDigits:2})+' '+t+' (rate date '+d.date+')'}).catch(function(){o.textContent='Could not fetch rates. Check your connection and try again.'})};

/* 2. smart packing list (uses your Style + Days; saved on this device) */
var base=['Phone + charger','Power bank','ID / passport copy','Cash + cards','Medicines','Water bottle','Toiletries'];
var by={Adventure:['Trekking shoes','First-aid kit','Rain jacket','Headlamp'],Culture:['Modest clothing','Comfortable shoes','Day bag','Offline maps'],Relaxation:['Swimwear','Sunscreen','Light book','Sandals'],Foodie:['Stomach-safe tablets','Wet wipes','Reusable cutlery','Snack bag'],Balanced:['Sunglasses','Light jacket','Umbrella','Walking shoes']};
var P=tool('t-pack','🎒 Packing list','<button class="s" id="p-gen" type="button">Build for my trip</button> <button class="s" id="p-clr" type="button">Reset</button><ul id="p-list"></ul><div class="mut" id="p-note"></div>');
var items=LS.get('v5pack',[]);
function drawPack(){var u=$('p-list');u.innerHTML=items.map(function(it,i){return'<li class="'+(it.d?'done':'')+'"><label><input type="checkbox" data-i="'+i+'"'+(it.d?' checked':'')+'> <span>'+esc(it.t)+'</span></label></li>'}).join('');var n=items.filter(function(x){return x.d}).length;$('p-note').textContent=items.length?n+' of '+items.length+' packed':''}
$('p-list').onchange=function(e){var i=e.target.dataset.i;if(i!=null){items[i].d=e.target.checked;LS.set('v5pack',items);drawPack()}};
$('p-gen').onclick=function(){var s=$('sty').value,d=Math.max(1,Math.min(7,+$('days').value||3)),l=base.concat(by[s]||by.Balanced);l.push(d+' day'+(d>1?'s':'')+' of clothes ('+Math.min(d,4)+' sets + laundry bag if over 4)');items=l.map(function(t){return{t:t,d:false}});LS.set('v5pack',items);drawPack();toast('Packing list ready')};
$('p-clr').onclick=function(){items=[];LS.set('v5pack',items);drawPack()};drawPack();

/* 3. trip countdown (reads the Start date field) */
var K=tool('t-cd','⏳ Trip countdown','<div class="v5out" id="cd-out">Pick a start date in the planner.</div><button class="s" id="cd-go" type="button">Update</button>');
function cd(){var v=$('sd').value,o=$('cd-out');if(!v){o.textContent='Pick a start date in the planner.';return}var n=Math.ceil((new Date(v+'T00:00:00')-new Date())/864e5);o.textContent=n>1?n+' days to go':n===1?'Tomorrow. Time to pack.':n===0?'Today. Safe travels!':'This trip started '+(-n)+' day(s) ago.'}
$('cd-go').onclick=cd;$('sd').addEventListener('change',cd);cd();

/* 4. emergency numbers */
tool('t-sos','🚨 Emergency numbers','<ul><li><b>India:</b> 112 (all emergencies)</li><li>Police 100 · Ambulance 108 · Women 1091</li><li>Tourist helpline 1363</li><li><b>EU:</b> 112 · <b>UK:</b> 999 · <b>US/Canada:</b> 911</li></ul><div class="mut">Save your hotel address and one local contact offline.</div>');

/* 5. share the app / current page */
var S=tool('t-share','🔗 Share VOYAGR','<button class="s" id="sh" type="button">Share link</button><div class="mut" style="margin-top:6px">Shares the app. Use the trip card’s own share button for a specific trip.</div>');
$('sh').onclick=function(){var d={title:'VOYAGR',text:'Plan a whole trip with AI, from your door to the destination.',url:location.origin+location.pathname};if(navigator.share)navigator.share(d).catch(function(){});else if(navigator.clipboard){navigator.clipboard.writeText(d.url).then(function(){toast('Link copied')},function(){toast('Copy failed')})}else toast(d.url)};
})();
