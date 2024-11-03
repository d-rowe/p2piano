# Base image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY src .

RUN npm run build

CMD [ "node", "dist/main.js" ]
