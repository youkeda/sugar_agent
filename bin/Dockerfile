FROM node:lts-alpine


ADD dist /root/app


RUN npm config set registry https://registry.npm.taobao.org ; npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

RUN cd /root/app;yarn --production=true



CMD cd /root/app;yarn run start
