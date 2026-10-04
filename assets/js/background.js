/**
 * VOYAGR · background.js
 * Animated particle-network background
 * Designed & developed by Nikhil Chary Sriramoju
 */
// ---------- animated background ----------
(()=>{const c=$("bg"),x=c.getContext("2d");let P=[];const r=()=>{c.width=innerWidth;c.height=innerHeight;P=Array.from({length:60},()=>({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}))};r();onresize=r;
(function f(){x.clearRect(0,0,c.width,c.height);P.forEach((p,i)=>{p.x=(p.x+p.vx+c.width)%c.width;p.y=(p.y+p.vy+c.height)%c.height;x.fillStyle="#22d3ee";x.fillRect(p.x,p.y,2,2);for(let j=i+1;j<P.length;j++){const d=Math.hypot(p.x-P[j].x,p.y-P[j].y);if(d<110){x.strokeStyle=`rgba(167,139,250,${.25-d/450})`;x.beginPath();x.moveTo(p.x,p.y);x.lineTo(P[j].x,P[j].y);x.stroke()}}});requestAnimationFrame(f)})()})();
