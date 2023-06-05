#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-ai4eosc-dev
#stage 2
FROM nginx:alpine
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/ai4-dashboard /usr/share/nginx/html