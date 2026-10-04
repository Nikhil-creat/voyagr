// VOYAGR unit + smoke tests — run with: npm test  (Node >= 18, no dependencies)
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const ORDER = ["config","utils","background","pipeline-ui","rag","cnn","dfs","ai","travel","maps","render","storage","demo-data","features","agent","ui"];
const src = f => fs.readFileSync(new URL(`../assets/js/${f}.js`, import.meta.url), "utf8");
const dummy = () => new Proxy(function () { return dummy(); }, {
  get: (t, k) => k === "value" || k === "textContent" || k === "innerHTML" ? "" : k === "files" ? [] : k === "open" ? false
    : k === "classList" ? { add() {}, remove() {}, toggle() {}, contains() { return false; } } : k === Symbol.toPrimitive ? () => "" : dummy(),
  set: () => true, apply: () => dummy(),
});
function load(files) {
  const c = vm.createContext({ console, Math, JSON, Set, Date, Promise, Object, Array, Number, String, Error, isFinite, setTimeout, clearTimeout,
    encodeURIComponent, decodeURIComponent, escape, unescape, URL, AbortController, Blob, alert() {}, prompt() {}, Image: class {}, FileReader: class {},
    btoa: s => Buffer.from(s, "binary").toString("base64"), atob: s => Buffer.from(s, "base64").toString("binary"),
    document: { getElementById: () => dummy(), createElement: () => dummy(), body: dummy(), readyState: "loading" }, window: {}, navigator: {},
    location: { hash: "", protocol: "https:", href: "https://x/" }, localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    innerWidth: 800, innerHeight: 600, requestAnimationFrame() {}, addEventListener() {}, fetch: () => Promise.reject(new Error("offline")) });
  vm.runInContext(files.map(src).join("\n"), c); return c;
}
const api = load(["config","utils","rag","dfs","ai","travel"]);
const { hav, dfs, rag, planModes, parseJ } = vm.runInContext("({hav,dfs,rag,planModes,parseJ})", api);

test("haversine: Hyderabad -> Goa is ~540 km", () => {
  const d = hav({ lat: 17.385, lng: 78.4867 }, { lat: 15.4989, lng: 73.8278 }); assert.ok(d > 500 && d < 600, d);
});
test("DFS branch-and-bound finds optimal order on a line", () => {
  const r = dfs([0, 3, 1, 2].map(lat => ({ lat, lng: 0 })));
  assert.equal(r.order.join(), "0,2,3,1"); assert.ok(r.km < r.orig); assert.ok(r.nodes > 0);
});
test("RAG retrieves the beach tip for a beach query", () => {
  assert.match(rag("beach coast sunrise", 1)[0][1], /beaches/);
});
test("parseJ strips <think> blocks and code fences", () => {
  assert.equal(parseJ('<think>{x}</think>```json\n{"a":1}\n```').a, 1);
});
test("planModes: auto picks cheapest sensible mode; preference is respected", () => {
  const base = { km: 540, road: 700, P: 2, C: "INR" };
  const a = planModes({ ...base, pref: "auto" });
  assert.equal(a.opts.length, 4); assert.equal(a.chosen, "train");
  for (const o of a.opts) assert.ok(Math.abs(o.round - o.one * 4) <= 2, o.id);
  assert.equal(planModes({ ...base, pref: "flight" }).chosen, "flight");
});
test("planModes: no road route => flight only", () => {
  const p = planModes({ km: 8000, road: null, noRoad: true, P: 1, C: "USD", pref: "auto" });
  assert.equal(p.opts.length, 1); assert.equal(p.chosen, "flight");
});
test("boot: all modules load in order without ReferenceErrors", () => { assert.doesNotThrow(() => load(ORDER)); });
test("end-to-end demo run: journey cost is added to totals and DFS ran", async () => {
  const c = load(ORDER);
  const t = await vm.runInContext("run(true).then(()=>cur)", c);
  assert.ok(t.travel && t.travel.cost > 0); assert.equal(t.grand, t.estimated_total + t.travel.cost);
  assert.equal(t.breakdown.travel, t.travel.cost); assert.ok(t.days[0].dfs);
});
