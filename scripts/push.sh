#!/data/data/com.termux/files/usr/bin/bash
# Usage: bash scripts/push.sh "commit message"
set -e
git add -A
git commit -m "${1:-update}" || echo "Nothing new to commit"
git pull --rebase origin main
git push origin main
echo "Pushed. GitHub Pages and Vercel will redeploy automatically."
