FROM node:20.18.0

RUN apt-get update -y && apt-get install -y openssl
RUN ln -snf /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && echo America/Sao_Paulo > /etc/timezone

WORKDIR /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]