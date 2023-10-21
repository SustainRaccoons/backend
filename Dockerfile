FROM node:alpine

WORKDIR /app

COPY . .

RUN yarn

ENTRYPOINT ["yarn", "start"]
