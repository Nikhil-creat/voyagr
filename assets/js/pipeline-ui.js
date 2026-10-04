/**
 * VOYAGR · pipeline-ui.js
 * Agent pipeline chips + live agent log
 * Designed & developed by Nikhil Chary Sriramoju
 */
// ---------- agent pipeline UI ----------
const AG=["Planner","CNN Vision","RAG Retriever","LLM Drafter","Budget Critic","DFS Optimizer","Writer"];
function pipe(i){$("pipe").innerHTML=AG.map((a,j)=>`<span class="chip ${j<i?"done":j==i?"on":""}">${j<i?"✓ ":""}${a}</span>`).join("")}
function log(a,m){const l=$("log");l.innerHTML+=`<div><i>[${a}]</i> ${m}</div>`;l.scrollTop=1e9}
