# Deployment
## GitHub Pages (from Termux)
```
cd ~/zephyron
unzip -o /sdcard/Download/voyagr-master.zip -d ~/v
cp -r ~/v/voyagr-master/. .
git rm -q --ignore-unmatch GITHUB_GUIDE.md icon.svg
git add . && git commit -m "VOYAGR v4" && git push
```
Repo → Settings → Pages → Deploy from branch → `main` `/ (root)`. Site: https://nikhil-creat.github.io/voyagr/
After each deploy reload the page twice (service worker cache).
## Docker
`docker compose up --build` → http://localhost:8080
## Local
`npm start` → http://localhost:8080 (ES/network features need http, not file://)
## Tests
`npm test` (Node 18+, zero dependencies)
