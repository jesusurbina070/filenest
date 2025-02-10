FROM node:22.13-alpine3.20 AS base

ENV DIR /app
WORKDIR $DIR
ARG NPM_TOKEN

FROM base AS dev

ENV NODE_ENV=development

RUN npm install -g @nestjs/cli

COPY package*.json $DIR

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    npm install --frozen-lockfile && \
    rm -f .npmrc

COPY tsconfig*.json $DIR
COPY src $DIR/src

EXPOSE $PORT

CMD [ "npm", "run", "start:dev"]


FROM base AS build

RUN apk update && apk add --no-cache dumb-init


COPY package*.json ./

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
    npm install --frozen-lockfile && \
    rm -f .npmrc

COPY tsconfig*.json $DIR
COPY src $DIR/src

RUN npm run build && \ 
    npm prune --production

FROM base AS production

ENV USER node 

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/node_modules $DIR/node_modules
COPY --from=build $DIR/dist $DIR/dist

ENV NODE_ENV=production

EXPOSE $PORT

USER $USER

CMD [ "dumb-init", "node", "dist/main.js"]
