// Optional server-side AI proxy (Vercel). Keeps the key off the device: set GROQ_API_KEY in Vercel > Settings > Environment Variables.
const hits=new Map(),LIMIT=20,WINDOW=60000,MODELS=/^[\w.\-:/]{3,60}$/;
module.exports=async(req,res)=>{
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'POST only'});
  const key=process.env.GROQ_API_KEY;if(!key)return res.status(503).json({error:'Proxy not configured'});
  const origin=req.headers.origin||'',host=req.headers.host||'';
  if(origin&&!origin.endsWith('//'+host))return res.status(403).json({error:'Origin not allowed'});
  const ip=(req.headers['x-forwarded-for']||'').split(',')[0].trim()||'x',now=Date.now(),h=(hits.get(ip)||[]).filter(t=>now-t<WINDOW);
  if(h.length>=LIMIT)return res.status(429).json({error:'Too many requests. Try again in a minute.'});
  h.push(now);hits.set(ip,h);
  const b=req.body||{};
  if(!MODELS.test(b.model||'')||!Array.isArray(b.messages)||b.messages.length>20||JSON.stringify(b.messages).length>20000)return res.status(400).json({error:'Invalid request'});
  try{
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model:b.model,messages:b.messages,temperature:Math.min(1,+b.temperature||.4),max_tokens:Math.min(2048,+b.max_tokens||1024)})});
    res.status(r.status).json(await r.json());
  }catch(e){res.status(502).json({error:'Upstream error'})}
};
