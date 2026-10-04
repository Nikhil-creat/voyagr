/**
 * VOYAGR · ai.js
 * LLM gateway (Groq/Gemini), model auto-discovery, JSON schema
 * Designed & developed by Nikhil Chary Sriramoju
 */
// ---------- LLM (auto-detects live models) ----------
const GP=[/gpt-oss-120b/,/gpt-oss-20b/,/qwen/,/llama-4/,/kimi/,/llama-3\.3/,/llama/],BAD=/whisper|guard|tts|orpheus|playai|embed|distil|safeguard|compound|speech|allam/;
async function models(){const k=$("key").value.trim(),pv=$("prov").value;if(!k)throw Error("Paste a key first.");let l;
 if(pv==="groq"){const r=await fetch("https://api.groq.com/openai/v1/models",{headers:{Authorization:"Bearer "+k}}),d=await r.json();if(!r.ok)throw Error(d.error?.message||"Invalid Groq key");l=d.data.map(m=>m.id).filter(i=>!BAD.test(i))}
 else{const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=100&key="+k),d=await r.json();if(!r.ok)throw Error(d.error?.message||"Invalid Gemini key");l=d.models.filter(m=>(m.supportedGenerationMethods||[]).includes("generateContent")&&/gemini-[\d.]+-flash/.test(m.name)&&!/lite|image|tts|live|exp|preview|thinking|robotics/.test(m.name)).map(m=>m.name.replace("models/","")).sort((a,b)=>b.localeCompare(a,undefined,{numeric:true}))}
 if(!l.length)throw Error("This key has no usable chat models.");return l}
function pick(l,pv){if(pv==="gemini")return l[0];for(const re of GP){const m=l.find(i=>re.test(i));if(m)return m}return l[0]}
function fillModels(l){const sel=$("mdl"),st=localStorage.getItem("v_mdl_"+$("prov").value);sel.innerHTML='<option value="">Auto-detect (recommended)</option>'+l.map(m=>`<option>${esc(m)}</option>`).join("");sel.value=l.includes(st)?st:""}
async function ensureModel(){if($("mdl").value)return $("mdl").value;const l=await models();fillModels(l);return pick(l,$("prov").value)}
const parseJ=t=>{t=t.replace(/<think>[\s\S]*?<\/think>/g,"");const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a<0)throw Error("Model did not return JSON — try again.");return JSON.parse(t.slice(a,b+1))};
async function llm(prompt){const k=$("key").value.trim(),pv=$("prov").value;if(!k)throw Error("Add an AI API key first (or try Demo).");const m=await ensureModel();
 const call=async(m,json)=>{
  if(pv==="groq"){const b={model:m,temperature:.6,max_completion_tokens:8000,messages:[{role:"system",content:"You are a travel planning agent. Reply with valid JSON only."},{role:"user",content:prompt}]};if(/gpt-oss/.test(m))b.reasoning_effort="low";if(json)b.response_format={type:"json_object"};
   const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+k},body:JSON.stringify(b)}),d=await r.json();if(!r.ok)throw Error(d.error?.message||"Groq error "+r.status);return d.choices[0].message.content||""}
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${k}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{...(json?{responseMimeType:"application/json"}:{}),temperature:.6,maxOutputTokens:8192}})}),d=await r.json();if(!r.ok)throw Error(d.error?.message||"Gemini error "+r.status);return d.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("")||""};
 let txt;try{txt=await call(m,true)}catch(e){
  if(/does not exist|not found|decommission|no longer|access to it/i.test(e.message)){log("LLM",`Model ${esc(m)} unavailable → re-detecting…`);$("mdl").value="";const l=await models();fillModels(l);const alt=pick(l.filter(x=>x!==m),pv);if(!alt)throw e;log("LLM","Switching to <b>"+esc(alt)+"</b>");txt=await call(alt,true)}
  else if(/json|response_format/i.test(e.message))txt=await call(m,false);
  else if(/rate|quota|429|tokens per/i.test(e.message))throw Error("Rate limit reached — wait a minute, or try fewer days / another model. ("+e.message.slice(0,90)+")");else throw e}
 return parseJ(txt)}
const SCHEMA=`{"summary":"","best_time":"","places":[{"name":"","why":"","cost":0,"lat":0,"lng":0}],"restaurants":[{"name":"","cuisine":"","avg_cost_per_person":0}],"stays":[{"name":"","type":"","price_per_night":0}],"getting_there":"","days":[{"day":1,"title":"","items":[{"time":"09:00","activity":"","place":"","cost":0,"lat":0,"lng":0}]}],"breakdown":{"stay":0,"food":0,"activities":0,"transport":0,"misc":0},"estimated_total":0,"essentials":{"packing":[""],"phrases":[{"p":"","m":""}],"emergency":""},"dos":[""],"donts":[""],"scams":[""],"tips":[""]}`;
