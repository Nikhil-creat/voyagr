# 🛰 VOYAGR — Door-to-Door AI Travel Planner
**Designed & developed by NIKHIL CHARY SRIRAMOJU** · B.Tech CSE, Vaagdevi College of Engineering (2023–2027)
[GitHub](https://github.com/Nikhil-creat) · [LinkedIn](https://in.linkedin.com/in/nikhil-chary-sriramoju-95041b38a) · sriramojunikhil66@gmail.com

Enter **where you are**, **where you're going** and a **budget**. VOYAGR plans the journey (route + cost by flight/train/bus/cab), then the whole trip: places, restaurants, stays, day-by-day itinerary, do's & don'ts, weather, maps and expenses.

## Highlights
| Area | What it does |
|---|---|
| Journey | Start (typed or 📍 GPS) → destination, live road route (OSRM), fare model for 4 modes, selected travel cost deducted from budget |
| Agentic AI | Planner → Route → CNN → RAG → Drafter → Budget Critic (self-revising) → DFS → Writer |
| RAG | TF-IDF cosine retrieval grounds prompts and chat |
| CNN | Sobel conv → ReLU → max-pool scene analysis of an inspiration photo |
| DFS | Branch-and-bound shortest daily route, pruning stats shown |
| Maps | Leaflet/OpenStreetMap journey + per-day routes, Google route links |
| Extras | Trip Intelligence Score, Wikipedia place guide, 7-day forecast, checklist, expense tracker, Ask-VOYAGR chat, .ics / PDF / JSON / share link, PWA, light/dark |
| Reliability | Groq/Gemini **model auto-discovery**, key tester, demo mode, 8 automated tests |

## Quick start
1. Open the site → **▶ Demo** (no key). 2. For live trips get a free key (console.groq.com / aistudio.google.com), paste it, tap **Test & save key**.
3. Fill From / Destination / Budget → **Launch agents**.

## Structure
```
index.html  manifest.json  sw.js
assets/css/styles.css   assets/img/icon.svg
assets/js/  config utils background pipeline-ui rag cnn dfs ai travel maps render storage demo-data features agent ui
tests/core.test.mjs     docs/ARCHITECTURE.md  docs/DEPLOYMENT.md
Dockerfile  docker-compose.yml  nginx.conf  package.json  CHANGELOG.md  LICENSE
```
Deploy: see `docs/DEPLOYMENT.md` · Design: `docs/ARCHITECTURE.md` · Tests: `npm test`.
