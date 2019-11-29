# docker build . -t host_web

FROM node:stretch-slim as build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm config set registry https://registry.npm.taobao.org/
RUN yarn config set registry https://registry.npm.taobao.org/
RUN yarn
COPY ./ .
RUN yarn build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf