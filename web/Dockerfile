FROM node:alpine

WORKDIR /app

COPY package.json package-lock.json /

RUN npm install && npm run build

COPY build /
COPY build/public /public

RUN npm run start:prod
