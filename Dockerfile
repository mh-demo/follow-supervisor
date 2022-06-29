FROM node:18.4-alpine

ARG NODE_PORT
EXPOSE ${NODE_PORT}
WORKDIR /usr/src/app

COPY --chown=node:node . ./

RUN apk add dumb-init
RUN npm ci
RUN npm run build

USER node
CMD ["dumb-init", "npm", "start"]