#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build-ai4eosc
#stage 2
FROM nginx:alpine
RUN apk add certbot certbot-nginx
RUN mkdir -p /var/www/certbot
COPY ./docker/ai4eosc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/ai4-dashboard /usr/share/nginx/html