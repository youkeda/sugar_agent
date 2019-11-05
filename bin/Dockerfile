FROM maven:3-jdk-8-alpine

COPY --from=node:alpine /usr/local/bin/ /usr/local/bin/
COPY --from=node:alpine /usr/local/lib/ /usr/local/lib/
COPY --from=node:alpine /opt/ /opt/

RUN npm config set registry https://registry.npm.taobao.org ; npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
# 设置时区为上海
RUN apk add tzdata && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && apk del tzdata
RUN apk add git

ADD bashrc /root/.bashrc
ADD dist /root/app
ADD settings.xml /root/.m2/
ADD id_rsa.pub .ssh/id_rsa.pub
RUN cd /root/app;yarn --production=true


CMD cd /root/app;yarn run start
