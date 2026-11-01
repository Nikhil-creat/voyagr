/* VOYAGR v6: local AI trip parser, prompt-injection shield, input guards, encrypted key vault. No data leaves the device. */
(function(){'use strict';
var $=function(i){return document.getElementById(i)};
function toast(m){var t=$('toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('on')},2800)}
function fire(el){['input','change'].forEach(function(n){el.dispatchEvent(new Event(n,{bubbles:true}))})}
function set(id,v){var e=$(id);if(e&&v!=null&&v!==''){e.value=v;fire(e)}}
var host=document.querySelector('.w'),after=host&&host.querySelector('.mut');if(!host)return;
function mk(html){var d=document.createElement('div');d.className='card v6card noprint';d.innerHTML=html;after.insertAdjacentElement('afterend',d);return d}

/* 1. Describe-your-trip: local natural-language parser */
var P=mk('<b>✨ Describe your trip</b><textarea id="nl" maxlength="300" placeholder="e.g. Goa from Hyderabad, 3 days, 2 people, under 25k, foodie, by train"></textarea><button class="s" id="nlgo" type="button">Fill the form</button> <span class="mut" id="nlm"></span>');
function parse(t){var o={},m;t=t.replace(/\s+/g,' ');
 if(m=t.match(/from ([a-z .'-]{2,40}?) to ([a-z .'-]{2,40}?)(?= under| for| with| by| budget|,|\.|\d|$)/i)){o.from=m[1];o.dest=m[2]}
 else if(m=t.match(/^([a-z .'-]{2,40}?) from ([a-z .'-]{2,40}?)(?=,|\.| for| under| with| by|\d|$)/i)){o.dest=m[1];o.from=m[2]}
 else if(m=t.match(/\bto ([a-z .'-]{2,40}?)(?=,|\.| for| under| with| by|\d|$)/i))o.dest=m[1];
 if(m=t.match(/(?:under|budget|within|upto|up to|below|₹|rs\.?|inr|\$|usd|€|£)\s*([\d,.]+)\s*(k|l|lakh|lac)?/i)){var n=parseFloat(m[1].replace(/,/g,''));if(m[2]){n*=/^k/i.test(m[2])?1e3:1e5}o.bud=Math.round(n)}
 o.cur=/\$|usd/i.test(t)?'USD':/€|eur/i.test(t)?'EUR':/£|gbp/i.test(t)?'GBP':'';
 if(m=t.match(/(\d+)\s*(?:day|night)/i))o.days=Math.min(7,Math.max(1,+m[1]));
 if(m=t.match(/(\d+)\s*(?:people|persons|travell?ers|pax|friends|adults)/i))o.pax=+m[1];else if(/couple|honeymoon/i.test(t))o.pax=2;else if(/solo|alone/i.test(t))o.pax=1;else if(/family/i.test(t))o.pax=4;
 o.sty=/trek|advent|hike|dive/i.test(t)?'Adventure':/cultur|heritage|temple|museum|histor/i.test(t)?'Culture':/relax|beach|chill|spa/i.test(t)?'Relaxation':/food|eat|cuisine/i.test(t)?'Foodie':'';
 o.mode=/flight|fly|plane/i.test(t)?'flight':/train/i.test(t)?'train':/\bbus\b/i.test(t)?'bus':/cab|car|drive/i.test(t)?'car':'';
 return o}
$('nlgo').onclick=function(){var t=$('nl').value.trim(),o=$('nlm');if(t.length<6){o.textContent='Write a sentence about your trip first.';return}
 var r=parse(t);set('from',r.from);set('dest',r.dest);set('bud',r.bud);set('cur',r.cur);set('days',r.days);set('pax',r.pax);set('sty',r.sty);set('tmode',r.mode);
 var got=Object.keys(r).filter(function(k){return r[k]}).length;o.textContent=got?'Filled '+got+' field'+(got>1?'s':'')+'. Check them, then launch.':'Could not find trip details. Try “Goa from Hyderabad, 3 days, under 25k”.';if(got)toast('Trip details filled')};

/* 2. Shield: block prompt-injection text and out-of-range input before agents run; 4s cooldown */
var BAD=/ignore (all |any )?(previous|prior|above)|system prompt|you are now|reveal .{0,20}(key|prompt)|developer mode|jailbreak|<\s*script|javascript:|on\w+\s*=|\bDAN\b/i,last=0;
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#go');if(!b)return;
 var why='',f=$('from').value,d=$('dest').value,nl=($('nl')||{}).value||'';
 [f,d,nl].forEach(function(v){if(BAD.test(v))why='Remove instruction-like text from your inputs.'});
 if(f.length>80||d.length>80)why='Place names must be under 80 characters.';
 var bud=+$('bud').value,days=+$('days').value,pax=+$('pax').value;
 if(!(bud>0&&bud<=1e9))why='Budget must be a positive number.';else if(!(days>=1&&days<=7))why='Days must be 1 to 7.';else if(!(pax>=1&&pax<=20))why='Travelers must be 1 to 20.';
 if(!why&&Date.now()-last<4000)why='Please wait a few seconds between launches.';
 if(why){e.stopImmediatePropagation();e.preventDefault();var s=$('st');if(s)s.textContent='🛡 '+why;toast('🛡 '+why);return}last=Date.now()},true);

/* 3. Key vault: PBKDF2 (250k) + AES-256-GCM, stored locally; wipes plaintext copies; auto-clears fields when idle */
var V=mk('<b>🔐 Key vault</b><div class="mut">Encrypts your AI and Maps keys with a passphrase you choose. We cannot recover it.</div><input id="vp" type="password" autocomplete="new-password" placeholder="Passphrase (8+ characters)" style="margin:8px 0"><button class="s" id="vl" type="button">Lock keys</button> <button class="s" id="vu" type="button">Unlock</button> <span class="mut" id="vm" aria-live="polite"></span>');
var enc=new TextEncoder(),dec=new TextDecoder();function b64(a){return btoa(String.fromCharCode.apply(0,new Uint8Array(a)))}function ub(s){return Uint8Array.from(atob(s),function(c){return c.charCodeAt(0)})}
function kd(p,salt){return crypto.subtle.importKey('raw',enc.encode(p),'PBKDF2',false,['deriveKey']).then(function(m){return crypto.subtle.deriveKey({name:'PBKDF2',salt:salt,iterations:250000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])})}
function msg(t,ok){var m=$('vm');m.textContent=t;m.className='mut '+(ok?'v6ok':'v6bad')}
if(!(window.crypto&&crypto.subtle)){msg('Vault needs HTTPS and a modern browser.',false);$('vl').disabled=$('vu').disabled=true}
$('vl').onclick=function(){var p=$('vp').value,k=$('key').value,g=$('mkey').value;if(p.length<8){msg('Use a passphrase of 8+ characters.',false);return}if(!k&&!g){msg('Enter a key first.',false);return}
 var salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12)),data=JSON.stringify({prov:$('prov').value,key:k,mkey:g});
 kd(p,salt).then(function(x){return crypto.subtle.encrypt({name:'AES-GCM',iv:iv},x,enc.encode(data))}).then(function(c){
  try{Object.keys(localStorage).slice().forEach(function(n){var v=localStorage.getItem(n)||'';if((k&&v.indexOf(k)>-1)||(g&&v.indexOf(g)>-1))localStorage.removeItem(n)});localStorage.setItem('v6vault',JSON.stringify({s:b64(salt),i:b64(iv),c:b64(c)}))}catch(e){}
  $('key').value=$('mkey').value=$('vp').value='';msg('Locked. Plaintext copies removed from this browser.',true)}).catch(function(){msg('Lock failed.',false)})};
$('vu').onclick=function(){var p=$('vp').value,r;try{r=JSON.parse(localStorage.getItem('v6vault')||'')}catch(e){}if(!r){msg('No vault saved yet.',false);return}
 kd(p,ub(r.s)).then(function(x){return crypto.subtle.decrypt({name:'AES-GCM',iv:ub(r.i)},x,ub(r.c))}).then(function(b){var o=JSON.parse(dec.decode(b));set('prov',o.prov);set('key',o.key);set('mkey',o.mkey);$('vp').value='';msg('Unlocked for this session.',true);idle()}).catch(function(){msg('Wrong passphrase.',false)})};
var it;function idle(){clearTimeout(it);it=setTimeout(function(){if(localStorage.getItem('v6vault')){$('key').value=$('mkey').value='';toast('🔐 Keys cleared after 10 minutes idle')}},6e5)}
['click','keydown','scroll'].forEach(function(n){addEventListener(n,function(){if($('key')&&$('key').value)idle()},{passive:true})});
})();
