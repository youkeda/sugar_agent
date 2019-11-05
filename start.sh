#!/bin/sh

instance=$(docker ps -a | grep "suagr_agent" | awk '{print $1}')

if[ -n "$instance"];then
    docker rm -f $instance
fi


image=$(docker images | grep 'registry.cn-hangzhou.aliyuncs.com/youkeda/sugar_agent' | awk '{print $3}')
if [ -n "$image" ] ; then
    docker rmi $image
fi

dockerName=registry.cn-hangzhou.aliyuncs.com/youkeda/sugar_agent:$1

echo $dockerName

docker pull $dockerName


docker run --name suagr_agent_$(TZ=CST-8 date '+%Y%m%d-%H%M%S') -v ~/.m2/repository:/root/.m2/repository  --restart=unless-stopped  -d $dockerName