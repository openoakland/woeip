FROM node:14-alpine

# set working directory
WORKDIR /usr/src/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH usr/src/app/node_modules/.bin:$PATH

# install app dependencies
COPY package*.json ./
RUN npm i
RUN npm i react-scripts@4.0.3 -g

# add app
COPY . .

EXPOSE 3000
# start app
CMD ["npm", "start"]
