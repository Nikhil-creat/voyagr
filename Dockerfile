FROM nginx:alpine
COPY index.html manifest.json icon.svg sw.js /usr/share/nginx/html/
EXPOSE 80
