# Deploy VOYAGR on GitHub Pages
1. github.com → New repository → name `voyagr` → Public → Create.
2. Upload ALL files from the unzipped folder (index.html, manifest.json, sw.js, icon.svg, Dockerfile, docker-compose.yml, README.md, LICENSE, .nojekyll). Files must sit at the repo root, not inside a subfolder.
3. Settings → Pages → Source: "Deploy from a branch" → Branch: main, folder: / (root) → Save.
4. Wait ~1 minute. Live at https://<username>.github.io/voyagr/  (e.g. https://nikhil-creat.github.io/voyagr/)
5. Open it, click Demo to verify, then paste a free Groq (console.groq.com) or Gemini (aistudio.google.com) key.
Updating: re-upload a changed file (same name) and commit; Pages redeploys automatically.
