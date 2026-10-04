# 🛰 VOYAGR - AI Travel Planner
**Designed and developed by NIKHIL CHARY SRIRAMOJU** - B.Tech CSE, Vaagdevi College of Engineering (2023-2027)
GitHub https://github.com/Nikhil-creat · LinkedIn https://in.linkedin.com/in/nikhil-chary-sriramoju-95041b38a · sriramojunikhil66@gmail.com

Pick a destination and budget; autonomous agents generate places, restaurants and a day-by-day itinerary.

## Pipeline
Planner → CNN Vision → RAG Retriever → LLM Drafter → Budget Critic (self-revising) → DFS Optimizer → Writer

| Tech | Role |
|---|---|
| Agentic AI | 7-stage agent chain with a budget critic loop (Groq / Gemini free tiers - models auto-detected, so retired models never break it) |
| RAG | TF-IDF cosine retrieval grounds the prompt and the in-app chat |
| CNN | Sobel conv → ReLU → max-pool feature maps classify an inspiration photo's scene (in-browser, fixed kernels) |
| DFS | Branch-and-bound depth-first search finds the shortest daily route (Haversine) |
| Maps | Leaflet + OpenStreetMap interactive route map (no key), Google route links, SVG day maps |
| Docker | nginx image for containerised hosting |

## Features
Trip Intelligence Score · interactive map with per-day routes · Wikipedia place guide with photos · stays & how to get there · Do's & Don'ts + scams to avoid · expense tracker (planned vs actual) · API key tester with model auto-detect · Budget breakdown · per-day route maps · live 7-day forecast (Open-Meteo, no key) · packing checklist · Ask-VOYAGR chat · voice destination input · calendar (.ics) export · shareable trip links · PDF/JSON export · saved trips · light/dark theme · installable offline PWA · Demo mode (no key).

## Run
- Local: open `index.html` (or `python3 -m http.server`)
- Docker: `docker compose up --build` → http://localhost:8080
- GitHub Pages: see GITHUB_GUIDE.md
- API keys are pasted in-app and stored only in your browser (never committed).

## Structure
index.html · manifest.json · sw.js · icon.svg · Dockerfile · docker-compose.yml · .nojekyll · LICENSE
