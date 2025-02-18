#stage 1
FROM node:20.5.1 AS node
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run generate-version-file
RUN npm run build-ai4eosc-prod
#stage 2
FROM nginx:alpine 
RUN apk add --no-cache jq bash
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/ai4-dashboard /usr/share/nginx/html
CMD ["sh", "-c", "CLEAN_API_SERVER=$(echo $API_SERVER | sed 's:/*$::') && jq --arg cleanApi \"$CLEAN_API_SERVER\" '.apiURL = $cleanApi' /usr/share/nginx/html/assets/config.json > /usr/share/nginx/html/assets/config.tmp && mv /usr/share/nginx/html/assets/config.tmp /usr/share/nginx/html/assets/config.json && nginx -g 'daemon off;'"]