/**
 * VOYAGR · cnn.js
 * CNN vision: Sobel conv -> ReLU -> max-pool scene classifier
 * Designed & developed by Nikhil Chary Sriramoju
 */
// ---------- CNN: Sobel conv -> ReLU -> maxpool + colour-region statistics ----------
function cnn(file){return new Promise((res,rej)=>{const im=new Image();im.onerror=()=>rej(Error("Could not read that image"));im.onload=()=>{const S=64,n=S*S,c=document.createElement("canvas");c.width=c.height=S;const x=c.getContext("2d");x.drawImage(im,0,0,S,S);const px=x.getImageData(0,0,S,S).data,g=new Float32Array(n);let bl=0,gr=0,sa=0,gy=0,wh=0,wm=0,sky=0;
 for(let i=0;i<n;i++){const r=px[i*4],q=px[i*4+1],b=px[i*4+2],mx=Math.max(r,q,b),mn=Math.min(r,q,b),s=(mx-mn)/(mx||1);g[i]=.299*r+.587*q+.114*b;
  if(mx>215&&s<.12)wh++;else if(s<.14)gy++;else if(b>r+8&&b>=q-6)bl++;else if(q>r&&q>=b)gr++;else if(r>=q&&q>=b&&s<.6&&mx>140)sa++;else if(r>q&&r>b)wm++;
  if(i<n/3&&b>r&&b>=q-6)sky++}
 const kx=[-1,0,1,-2,0,2,-1,0,1],ky=[-1,-2,-1,0,0,0,1,2,1],M=S-2,fm=new Float32Array(M*M);let sum=0;
 for(let y=1;y<S-1;y++)for(let z=1;z<S-1;z++){let sx=0,sy=0;for(let k=0;k<9;k++){const v=g[(y+((k/3)|0)-1)*S+z+k%3-1];sx+=kx[k]*v;sy+=ky[k]*v}const e=Math.hypot(sx,sy);fm[(y-1)*M+z-1]=Math.max(0,e);sum+=e}
 const edge=sum/(M*M)/1020,P=M>>1,pool=new Float32Array(P*P);let mp=1;
 for(let y=0;y<P;y++)for(let z=0;z<P;z++){const v=Math.max(fm[2*y*M+2*z],fm[2*y*M+2*z+1],fm[(2*y+1)*M+2*z],fm[(2*y+1)*M+2*z+1]);pool[y*P+z]=v;if(v>mp)mp=v}
 const o=document.createElement("canvas");o.width=o.height=P;o.className="fm";const ox=o.getContext("2d"),id=ox.createImageData(P,P);for(let i=0;i<P*P;i++){const v=Math.pow(pool[i]/mp,.7)*255;id.data.set([v*.25,v*.85,v,255],i*4)}ox.putImageData(id,0,0);
 const f=v=>v/n,sk=sky/(n/3),sc={beach:1.2*f(bl)+1.4*f(sa)+.6*sk-.8*edge,mountain:f(gy)+.8*f(wh)+4*edge+.3*sk,forest:2.2*f(gr)+.3*edge,"city / urban":.8*f(gy)+6*edge-.4*sk+.3*f(wm),desert:1.8*f(sa)+f(wm)-.5*f(bl)};
 const e=Object.entries(sc).sort((a,b)=>b[1]-a[1]),t=e.reduce((a,b)=>a+Math.exp(b[1]*4),0);res({label:e[0][0],conf:Math.round(Math.exp(e[0][1]*4)/t*100),edge:edge.toFixed(2),canvas:o,top:e.slice(0,3).map(a=>a[0])})};im.src=URL.createObjectURL(file)})}
