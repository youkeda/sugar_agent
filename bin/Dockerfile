FROM maven:3-jdk-8-alpine

COPY --from=node:alpine /usr/local/bin/ /usr/local/bin/
COPY --from=node:alpine /usr/local/lib/ /usr/local/lib/
COPY --from=node:alpine /opt/ /opt/

RUN npm config set registry https://registry.npm.taobao.org ; npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

ADD dist /root/app

ADD settings.xml /root/.m2/

RUN cd /root/app;yarn --production=true



CMD cd /root/app;yarn run start
