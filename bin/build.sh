#!/bin/sh
basepath=$(cd `dirname $0`;cd ..; pwd)

cd $basepath

rm -rf dist
rm -rf bin/dist

yarn run build-ts

cp package.json dist/
cp yarn.lock dist/
cp .env dist/

cp -r dist bin/dist

cd bin

image=$(docker images | grep 'registry.cn-hangzhou.aliyuncs.com/youkeda/sugar_agent' | awk '{print $3}')
if [ -n "$image" ]; then
    docker rmi $image
fi

dockerName=registry.cn-hangzhou.aliyuncs.com/youkeda/sugar_agent:$(TZ=CST-8 date '+%Y%m%d-%H%M')

docker build --no-cache -t $dockerName .
#docker push $dockerName