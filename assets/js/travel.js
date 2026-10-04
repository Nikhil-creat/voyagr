/**
 * VOYAGR · travel.js
 * Journey agent: geolocation, geocoding, OSRM road routing, multi-modal cost model
 * Designed & developed by Nikhil Chary Sriramoju
 */
let ORIGIN = null; // {lat,lng,name} when set via the 📍 button

const fmtH = h => { let H = Math.floor(h), M = Math.round((h - H) * 60); if (M === 60) { H++; M = 0; } return H + "h" + (M ? " " + M + "m" : ""); };

function locate() {
  return new Promise((ok, no) => {
    if (!navigator.geolocation) return no(Error("Geolocation not supported — type your city"));
    navigator.geolocation.getCurrentPosition(p => ok([p.coords.latitude, p.coords.longitude]),
      e => no(Error(e.code === 1 ? "Location permission denied — allow it in browser settings or type your city" : "Could not get your location")),
      { enableHighAccuracy: false, timeout: 12000 });
  });
}

async function revGeo(lat, lng) {
  try {
    const j = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&zoom=10&lat=${lat}&lon=${lng}`)).json(), a = j.address || {};
    return [a.city || a.town || a.village || a.county || a.state_district, a.state, a.country].filter(Boolean).join(", ") || j.display_name;
  } catch { return lat.toFixed(3) + ", " + lng.toFixed(3); }
}

// Real road route from OSRM (free). Returns {km,hrs,line} | {none:true} | null (service unreachable)
async function roadRoute(a, b) {
  try {
    const c = new AbortController(), t = setTimeout(() => c.abort(), 9000);
    const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=simplified&geometries=geojson`, { signal: c.signal });
    clearTimeout(t); const j = await r.json();
    if (j.code === "Ok") {
      const co = j.routes[0].geometry.coordinates, st = Math.ceil(co.length / 150);
      return { km: j.routes[0].distance / 1000, hrs: j.routes[0].duration / 3600, line: co.filter((_, i) => i % st === 0 || i === co.length - 1).map(c => [c[1], c[0]]) };
    }
    if (j.code === "NoRoute") return { none: true };
  } catch {}
  return null;
}

// Pure cost model (unit-tested). km = straight-line, road = road km (or null). Money returned in group currency C.
function planModes({ km, road, noRoad, P, C, pref }) {
  const R = road || km * 1.3, fx = FX[C] || 1, veh = Math.ceil(P / 4), out = [], by = id => MODES.find(m => m.id === id);
  const push = (m, hours, oneInr) => out.push({ id: m.id, icon: m.icon, name: m.name, hours, one: Math.round(oneInr / fx), round: Math.round(oneInr * 2 * P / fx) });
  const fl = by("flight");
  if (km >= fl.minKm || noRoad || R > 2800) push(fl, fl.overhead + km / fl.speed, fl.fixed + fl.perKm * km * (km > 3500 ? 1.3 : 1));
  if (!noRoad) {
    for (const id of ["train", "bus"]) { const m = by(id); if (R <= m.maxKm) push(m, m.overhead + R / m.speed, m.fixed + m.perKm * R); }
    const c = by("car"); if (R <= c.maxKm) push(c, R / c.speed, c.perVehicle * R * 1.07 * veh / P);
  }
  const ok = out.filter(o => o.hours <= 18), pool = ok.length ? ok : out, want = out.find(o => o.id === pref);
  const chosen = (want || pool.slice().sort((a, b) => a.round - b.round)[0]).id;
  out.sort((a, b) => a.round - b.round);
  return { opts: out, chosen, cost: out.find(o => o.id === chosen).round, road: R };
}

// Agent stage: resolve origin + destination, route, price every mode
async function journey(m, demo) {
  if (!m.from) { log("Route", "No starting point given — planning destination only"); return null; }
  let o;
  if (ORIGIN && ORIGIN.name === m.from) o = [ORIGIN.lat, ORIGIN.lng];
  else if (demo && m.from === "Hyderabad, India") o = [17.385, 78.4867];
  else { log("Route", "Geocoding start: " + esc(m.from)); o = await geo(m.from); await sleep(1100); }
  const d = demo ? [15.4989, 73.8278] : await geo(m.dest);
  if (!o || !d) { log("Route", "⚠ Could not locate start or destination — skipping travel costs"); return null; }
  const km = hav({ lat: o[0], lng: o[1] }, { lat: d[0], lng: d[1] });
  log("Route", `Straight-line ${km.toFixed(0)} km — requesting road route (OSRM)…`);
  const r = await roadRoute(o, d), live = !!(r && r.km);
  const p = planModes({ km, road: live ? r.km : null, noRoad: !!(r && r.none), P: m.P, C: m.C, pref: m.tm });
  const best = p.opts.find(x => x.id === p.chosen);
  log("Route", `Road ${Math.round(p.road)} km (${live ? "live" : "estimated"}) · best: ${best.icon} ${best.name} · ${p.cost} ${m.C} round trip for ${m.P}`);
  return { from: m.from, o, d, km, road: p.road, line: live ? r.line : null, live, opts: p.opts, chosen: p.chosen, cost: p.cost };
}

function journeyCard(t, ins) {
  const v = t.travel, m = t.meta; if (!v) return;
  const best = v.opts.find(o => o.id === v.chosen), mx = Math.max(...v.opts.map(o => o.round));
  const dirs = `https://www.google.com/maps/dir/?api=1&origin=${v.o[0]},${v.o[1]}&destination=${v.d[0]},${v.d[1]}&travelmode=driving`;
  const book = { flight: ["Skyscanner", "https://www.skyscanner.co.in"], train: ["IRCTC", "https://www.irctc.co.in"], bus: ["redBus", "https://www.redbus.in"], car: ["Google route", dirs] };
  ins(`<div class="card"><b>🧭 Your journey</b>
<div class="row" style="justify-content:flex-start;margin:8px 0"><span class="tag">📍 ${esc(v.from)}</span><span>→</span><span class="tag">🏁 ${esc(m.dest)}</span><span class="tag">${Math.round(v.road)} km by road${v.live ? "" : " (est.)"}</span></div>
${v.opts.map(o => `<div class="it ${o.id === v.chosen ? "best" : ""}"><b>${o.icon} ${esc(o.name)}</b>${o.id === v.chosen ? ' <span class="tag">selected</span>' : ""}<br><span class="mut">${fmtH(o.hours)} one-way · ${o.one} ${m.C}/person · round trip for ${m.P}: <b style="color:var(--ink)">${o.round} ${m.C}</b></span><div class="mt"><i style="width:${o.round / mx * 100}%"></i></div><a class="chip btn" target="_blank" href="${book[o.id][1]}">Check: ${book[o.id][0]} ↗</a></div>`).join("")}
<p class="mut">Distance-based estimates, not live fares — verify before booking. The selected mode (${best.round} ${m.C} round trip) is included in your totals.</p></div>`);
}

function initTravel() {
  const f = $("from"); f.value = localStorage.getItem("v_from") || "";
  f.addEventListener("input", () => { localStorage.setItem("v_from", f.value); if (ORIGIN && ORIGIN.name !== f.value) ORIGIN = null; });
  $("loc").onclick = async () => {
    const b = $("loc"); b.textContent = "⏳";
    try { const [la, ln] = await locate(), name = await revGeo(la, ln); ORIGIN = { lat: la, lng: ln, name }; f.value = name; localStorage.setItem("v_from", name); $("st").textContent = "📍 Start set to " + name; }
    catch (e) { $("st").textContent = "⚠ " + e.message; }
    b.textContent = "📍";
  };
}
