# This script build the image of the project for the production

FROM mhart/alpine-node:10.20.1

# Node Alpine doesn't contains bash (/bin/bash). It's required for wait-for-it.sh
RUN apk update && apk add bash && rm -rf /var/cache/apk/*

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

RUN mkdir -p /home/www && chmod -R 777 /home/www

WORKDIR /home/www

COPY build package.json wait-for-it.sh ./

RUN chmod +x wait-for-it.sh && npm install --no-cache --frozen-lockfile --production

EXPOSE 7432

CMD ["./wait-for-it.sh", "mongodb:27017", "-t", "15", "--", "node", "index.js"]
