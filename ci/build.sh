#!/bin/sh
# This script will be executed in a Docker container where the /home folder is mounted somewhere on the host.
# The container is created in stage of the build pipeline. The goal is to build the project for production and
# send the output in the hosts where a docker-compose.yml will build the image and run it

BUILD_FOLDER='./build'

if [[ -d ${BUILD_FOLDER} ]]; then
    rm -rf ${BUILD_FOLDER}
fi

# Install dependencies
yarn

# Compile the file from Typescript to ES5
yarn tsc -p tsconfig.json

cp -r ./package.json /home
cp -rf ${BUILD_FOLDER} /home
