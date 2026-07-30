FROM node:12.13-alpine

RUN mkdir /frontend
WORKDIR /frontend

COPY . .

RUN npm i
RUN node_modules/.bin/env-cmd -f .env.prod npm run build
EXPOSE 80
CMD ["node","server.js"]