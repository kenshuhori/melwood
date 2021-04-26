FROM node:14-alpine

WORKDIR /app

COPY ./app/package.json app/package.json

RUN yarn install
