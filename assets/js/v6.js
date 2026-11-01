/* VOYAGR v6 hero: scroll drives a journey scene. Pure vanilla, one rAF loop. */
(function(){'use strict';
var $=function(i){return document.getElementById(i)},cl=function(v,a,b){return Math.min(b==null?1:b,Math.max(a==null?0:a,v))};
var trk=$('trk');if(!trk)return;
var sc=$('scene'),band=$('band'),strip=$('strip'),L=$('letters'),sv=$('sv'),tr=$('trail'),mk=$('mk'),ro=$('ro'),pO=$('pO'),pD=$('pD');
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,A=2.4,B=1,W,H,U,ph,sw=0,lw=0,E0=.829,E1=.448,vis=true;
function lay(){W=innerWidth;H=innerHeight;ph=W<768||W<=H;U=ph?Math.min(W/430,1.4):Math.min(W/1440,H/960);document.documentElement.style.setProperty('--u',U+'px');sv.setAttribute('viewBox','0 0 '+W+' '+H);sc.style.height=H+'px';sw=strip.scrollWidth;lw=L.scrollWidth;B=(sw+.45*W)/W*1.1;trk.style.height=(1+A+B)*H+'px';L.style.top=(H*E1-L.offsetHeight)+'px';labels()}
function nm(id,d){var v=($(id)||{}).value||'';v=v.split(',')[0].trim().toUpperCase().slice(0,16);return v||d}
function labels(){$('lO').textContent=nm('from','YOU');$('lD').textContent=nm('dest','ANYWHERE')}
['from','dest'].forEach(function(i){var e=$(i);e&&e.addEventListener('input',labels)});
addEventListener('resize',lay);addEventListener('load',lay);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(lay);
if('IntersectionObserver'in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(trk);
var cur=0,ly=scrollY,lt=performance.now(),sp=0,cards=[].slice.call(document.querySelectorAll('.card6'));
function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2}
function frame(now){requestAnimationFrame(frame);if(!vis)return;
 var y=-trk.getBoundingClientRect().top,q0=cl(y/(A*H));cur+=(q0-cur)*(reduce?1:.2);if(Math.abs(q0-cur)<.0005)cur=q0;var q=cur;
 var edge=H*(E0+(E1-E0)*ease(q));band.style.top=edge+'px';
 var sx=W*(ph?.14:.16),ex=W*(ph?.78:.66),ah=H*(ph?.16:.22),by=edge-20*U;
 function P(t){return[sx+(ex-sx)*t,by-Math.sin(Math.PI*t)*ah]}
 var d='',n=Math.max(1,Math.round(q*40));for(var i=0;i<=n;i++){var p=P(q*i/n);d+=(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)}tr.setAttribute('d',d);
 var m=P(q),ang=Math.atan2(-Math.PI*Math.cos(Math.PI*q)*ah,ex-sx)*180/Math.PI+90;
 mk.setAttribute('transform','translate('+m[0]+' '+m[1]+') rotate('+ang+') scale('+(U*1.5)+')');
 var o=P(0),e2=P(1);pO.setAttribute('transform','translate('+o[0]+' '+(edge)+')');pD.setAttribute('transform','translate('+e2[0]+' '+(edge)+')');
 var r=cl((y-A*H)/(B*H));strip.style.transform='translateX('+(W-r*(sw+.45*W))+'px)';L.style.transform='translateX('+(W-r*(lw+W))+'px)';
 cards.forEach(function(c){var s=cl((.98-c.getBoundingClientRect().left/W)/.3,-.4,1.6)*100;c.style.setProperty('--s',s+'%')});
 sc.classList.toggle('settled',q>=.94);
 var dt=Math.max(1,now-lt),v=Math.abs(scrollY-ly)/dt*1000/32;sp+=(Math.min(99,v)-sp)*.15;ly=scrollY;lt=now;ro.textContent=('0'+Math.round(sp)).slice(-2)+' KM/H'}
requestAnimationFrame(frame);lay();
})();
