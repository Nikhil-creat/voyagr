# 🛰 VOYAGR - AI Travel Planner
**Designed and developed by NIKHIL CHARY SRIRAMOJU** - B.Tech CSE, Vaagdevi College of Engineering (2023-2027)
GitHub https://github.com/Nikhil-creat · LinkedIn https://in.linkedin.com/in/nikhil-chary-sriramoju-95041b38a · sriramojunikhil66@gmail.com

Pick a destination and budget; autonomous agents generate places, restaurants and a day-by-day itinerary.

## Pipeline
Planner → CNN Vision → RAG Retriever → LLM Drafter → Budget Critic (self-revising) → DFS Optimizer → Writer

| Tech | Role |
|---|---|
| Agentic AI | 7-stage agent chain with a budget critic loop (Groq Llama 3.3 / Gemini 2.0, free tiers) |
| RAG | TF-IDF cosine retrieval grounds the prompt and the in-app chat |
| CNN | Sobel conv → ReLU → max-pool feature maps classify an inspiration photo's scene (in-browser, fixed kernels) |
| DFS | Branch-and-bound depth-first search finds the shortest daily route (Haversine) |
| Maps | Google Maps deep links + optional embed; SVG route maps per day |
| Docker | nginx image for containerised hosting |

## Features
Budget breakdown · per-day route maps · live 7-day forecast (Open-Meteo, no key) · packing checklist · Ask-VOYAGR chat · voice destination input · calendar (.ics) export · shareable trip links · PDF/JSON export · saved trips · light/dark theme · installable offline PWA · Demo mode (no key).

## Run
- Local: open `index.html` (or `python3 -m http.server`)
- Docker: `docker compose up --build` → http://localhost:8080
- GitHub Pages: see GITHUB_GUIDE.md
- API keys are pasted in-app and stored only in your browser (never committed).

## Structure
index.html · manifest.json · sw.js · icon.svg · Dockerfile · docker-compose.yml · .nojekyll · LICENSE
