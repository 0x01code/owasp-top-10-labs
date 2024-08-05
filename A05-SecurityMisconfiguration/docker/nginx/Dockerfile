FROM node:20.16.0 AS builder

WORKDIR /app

COPY ./src/frontend /app

RUN npm install

RUN npm run generate


FROM nginx:1.27

COPY ./docker/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/.output/public /usr/share/nginx/html

RUN apt update -y && apt install -y openssl

RUN echo "web{$(openssl rand -hex 6)}" > /usr/share/nginx/html/_nuxt/flag.txt