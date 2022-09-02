#!/bin/sh
echo "Deployment started!"

REG_IP="100871073111.dkr.ecr.us-east-2.amazonaws.com"
IMAGE_NAME="peplink-forum"
VER="stag_v1.0.22"

echo "login to ECR"
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 100871073111.dkr.ecr.us-east-2.amazonaws.com

yarn run build:staging

# push to registry
# below command is for Windows/ MacOS Intel CPU
# docker build -t $REG_IP/$IMAGE_NAME:$VER .

# below command is for MacOS M1 CPU
docker buildx build --platform linux/amd64 -t $REG_IP/$IMAGE_NAME:$VER .
docker push $REG_IP/$IMAGE_NAME:$VER

# remove image
#docker rmi $(docker images '${REG_IP}/${$IMAGE_NAME}' -a -q)