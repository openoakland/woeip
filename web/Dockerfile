FROM node:12.6.0-alpine

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json package-lock.json ./
RUN npm ci

COPY razzle.config.js tsconfig.json tslint.json ./
COPY typings ./typings
COPY public ./public

ENTRYPOINT ["npm", "start"]