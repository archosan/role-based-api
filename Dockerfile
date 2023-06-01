FROM node:18.3.0-alpine3.14
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "run","dev"]