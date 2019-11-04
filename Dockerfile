FROM node:lts-alpine


ADD src/ /root/app/
ADD .env /root/app/
ADD package.json /root/app/
ADD package-lock.json /root/app/
ADD tsconfig.json /root/app/
ADD yarn.lock /root/app/

RUN npm config set registry https://registry.npm.taobao.org ; npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

RUN cd app;yarn



CMD yarn run start
