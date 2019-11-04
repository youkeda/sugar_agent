#!/bin/sh

image=$(docker images | grep 'registry.cn-hangzhou.aliyuncs.com/youkeda/sugar_server' | awk '{print $3}')
if [ -n "$image" ]; then
    docker rmi $image
fi

dockerName=registry.cn-hangzhou.aliyuncs.com/youkeda/sugar_server:$(TZ=CST-8 date '+%Y%m%d-%H%M')

docker build --no-cache -t $dockerName .
#docker push $dockerName