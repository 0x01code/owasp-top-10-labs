FROM node:20.16.0

WORKDIR /app

COPY ./src/api /app

RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]
