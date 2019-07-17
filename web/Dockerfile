FROM node:12.6.0-alpine

WORKDIR /app
COPY . /app

RUN npm install

ENTRYPOINT ["npm", "run", "start"]