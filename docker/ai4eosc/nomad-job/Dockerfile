#stage 1
FROM node:20.5.1 as node
WORKDIR /app
COPY . .
# RUN --mount=type=secret,id=npmrc,target=/app/.npmrc npm ci
# RUN npm run generate-version-file
# RUN npm run build-ai4eosc-nomad-job
# #stage 2
FROM nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf.template
# COPY --from=node /app/dist/ai4-dashboard /usr/share/nginx/html

CMD ["/bin/sh", "-c", "envsubst '$API_SERVER' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
# CMD ["/bin/sh", "-c", "nginx -g 'daemon off;'"]
