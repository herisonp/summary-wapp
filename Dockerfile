FROM node:20.18.0

RUN apt-get update -y && apt-get install -y openssl
RUN ln -snf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && echo America/Sao_Paulo > /etc/timezone

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

ARG DATABASE_URL

ENV NODE_ENV production

USER node

CMD [ "npm", "run", "start" ]