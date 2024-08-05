FROM node:20.16.0 AS builder

WORKDIR /app

COPY ./src/frontend /app

RUN npm install

RUN npm run generate


FROM nginx:1.27-alpine

COPY --from=builder /app/.output/public /usr/share/nginx/html
