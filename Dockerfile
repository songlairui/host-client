# docker build . -t host_web

FROM node:stretch-slim as build-stage
WORKDIR /app
RUN npm config set registry https://registry.npm.taobao.org/
RUN yarn config set registry https://registry.npm.taobao.org/
COPY package-docker-web.json ./package.json
COPY yarn.lock ./
RUN yarn
COPY ./ .

# 覆盖 package.json
COPY package-docker-web.json ./package.json 

RUN yarn build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf