#stage 1
FROM node:20.5.1 as node
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run generate-version-file
RUN npm run build-imagine-prod
#stage 2
FROM nginx:alpine
RUN apk add --no-cache jq bash
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["sh", "-c", "\
  CLEAN_API_SERVER=$(echo $API_SERVER | sed 's:/*$::') && \
  NOMAD_STATUS=$(if [ -z \"$NOMAD_JOB_ID\" ]; then echo false; else echo true; fi) && \
  jq --arg cleanApi \"$CLEAN_API_SERVER\" \
     --arg deployedInNomad \"$NOMAD_STATUS\" \
     --arg clientId \"$CLIENT_ID\" \
     --arg issuer \"$ISSUER\" \
     --arg dummyClientSecret \"$DUMMY_CLIENT_SECRET\" \
     '.apiURL = $cleanApi | \
      .deployedInNomad = ($deployedInNomad | test(\"true\")) | \
      .clientId = ($clientId // .clientId) | \
      .issuer = ($issuer // .issuer) | \
      .dummyClientSecret = ($dummyClientSecret // .dummyClientSecret)' \
     /usr/share/nginx/html/assets/config.json > /usr/share/nginx/html/assets/config.tmp && \
  mv /usr/share/nginx/html/assets/config.tmp /usr/share/nginx/html/assets/config.json && \
  nginx -g 'daemon off;'"]