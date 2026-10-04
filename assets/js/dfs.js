/**
 * VOYAGR · dfs.js
 * DFS branch-and-bound route optimiser + Haversine distance
 * Designed & developed by Nikhil Chary Sriramoju
 */
// ---------- DFS branch & bound route optimizer ----------
const hav=(a,b)=>{const r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lng-a.lng)*r,h=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2;return 12742*Math.asin(Math.sqrt(h))};
function dfs(pts){const n=pts.length,d=pts.map(a=>pts.map(b=>hav(a,b)));let best=1e9,bp=[...pts.keys()],nodes=0,pr=0;const orig=[...pts.keys()].reduce((s,i,k,a)=>k?s+d[a[k-1]][i]:0,0);
 (function go(p,u,L){nodes++;if(L>=best){pr++;return}if(p.length==n){best=L;bp=[...p];return}for(let i=0;i<n;i++)if(!u[i]){u[i]=1;p.push(i);go(p,u,L+d[p[p.length-2]][i]);p.pop();u[i]=0}})([0],pts.map((_,i)=>i==0),0);
 return{order:bp,km:best,orig,nodes,pruned:pr}}
