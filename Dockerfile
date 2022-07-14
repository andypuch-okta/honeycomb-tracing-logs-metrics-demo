FROM node:18.5.0-alpine3.15

ADD . /opt

WORKDIR /opt 

ENTRYPOINT ["node", "index.js"]