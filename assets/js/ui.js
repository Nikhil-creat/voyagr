/**
 * VOYAGR · ui.js
 * Page behaviour: theme, voice input, key manager, boot sequence
 * Designed & developed by Nikhil Chary Sriramoju
 */
$("mic").onclick=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R)return alert("Voice input is not supported in this browser.");const r=new R();r.onresult=e=>$("dest").value=e.results[0][0].transcript.replace(/\.$/,"");r.start()};
$("th").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("v_th",document.body.classList.contains("light")?1:0)};
if(localStorage.getItem("v_th")==="1")document.body.classList.add("light");
if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});

// ---------- key manager ----------
function ks(){const k=$("key").value.trim();$("ks").textContent=k?`· saved ✓ (…${k.slice(-4)})`:"· no key yet"}
function initKeys(){ks();["key","mkey"].forEach(i=>$(i).addEventListener("input",()=>{localStorage.setItem(i==="key"?"v_key":"v_mkey",$(i).value.trim());ks()}));
 $("prov").onchange=()=>{localStorage.setItem("v_prov",$("prov").value);$("mdl").innerHTML='<option value="">Auto-detect (recommended)</option>';$("kmsg").textContent="Provider changed — paste its key and tap Test."};
 $("mdl").onchange=()=>localStorage.setItem("v_mdl_"+$("prov").value,$("mdl").value);
 $("tk").onclick=async()=>{const k=$("key").value.trim();if(!k)return $("kmsg").textContent="Paste a key first.";localStorage.setItem("v_key",k);localStorage.setItem("v_prov",$("prov").value);$("kmsg").textContent="Testing…";try{const l=await models();fillModels(l);$("kmsg").innerHTML=`✅ Key works &amp; is saved · ${l.length} models found · auto-using <b>${esc(pick(l,$("prov").value))}</b>`;ks()}catch(e){$("kmsg").textContent="❌ "+e.message}};
 $("ck").onclick=()=>{["v_key","v_mkey"].forEach(x=>localStorage.removeItem(x));$("key").value=$("mkey").value="";ks();$("kmsg").textContent="Keys cleared."};
 if($("key").value)$("kp").open=false}
$("go").onclick=()=>run(false);$("demo").onclick=()=>run(true);
$("key").value=localStorage.getItem("v_key")||"";$("mkey").value=localStorage.getItem("v_mkey")||"";$("prov").value=localStorage.getItem("v_prov")||"groq";pipe(-1);list();initKeys();initTravel();try{if(location.hash.startsWith("#t=")){cur=JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(3)))));render(cur)}}catch{}
