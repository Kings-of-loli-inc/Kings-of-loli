FROM node:lts-alpine

ENV HOST=0.0.0.0

WORKDIR /web

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "pnpm", "dev" ]
