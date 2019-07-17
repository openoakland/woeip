FROM node:alpine

WORKDIR /app

COPY build package.json package-lock.json /
COPY build/public /public

RUN npm install && npm run start:prod

