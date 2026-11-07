# Math Brain Test: a static web game served by nginx.
#
# Stage 1 builds every question in the bank and fails the build if any is broken.
# Stage 2 serves the game. It copies the scripts from stage 1, so the check always runs.

FROM node:24-bookworm-slim AS check
WORKDIR /app
COPY index.html ./
COPY js ./js
COPY tests ./tests
RUN node tests/check-bank.cjs

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html /usr/share/nginx/html/index.html
COPY css /usr/share/nginx/html/css
COPY img /usr/share/nginx/html/img
COPY --from=check /app/js /usr/share/nginx/html/js
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
