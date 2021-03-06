FROM mhart/alpine-node:14

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package.json .
COPY build ./build

RUN yarn install --frozen-lockfile --production

EXPOSE 7432

ENTRYPOINT ["yarn", "prod"]