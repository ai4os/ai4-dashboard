#stage 1
FROM node:20.5.1 as node
WORKDIR /app
COPY . .
RUN --mount=type=secret,id=npmrc,target=/app/.npmrc npm ci
RUN npm run generate-version-file
RUN npm run build-ai4eosc-ai4life
#stage 2
FROM nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/ai4-dashboard /usr/share/nginx/html