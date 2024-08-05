FROM node:20.16.0

WORKDIR /app

RUN apt update -y && apt install -y iputils-ping

COPY ./src/api /app

RUN npm install

ENTRYPOINT [ "npm", "run", "dev" ]
