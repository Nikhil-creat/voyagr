/**
 * VOYAGR · utils.js
 * Shared helpers (DOM shortcut, escaping, sleep, file download)
 * Designed & developed by Nikhil Chary Sriramoju
 */
const $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms)),mq=n=>"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(n);
function file(n,t,c){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([c],{type:t}));a.download=n;a.click()}
