#!/bin/sh

# Stop the container and dependencies if they are running
docker-compose -f ${ENV_FOLDER}/docker-compose.yml down

# Build a new image of the project and run it
docker-compose -f ${ENV_FOLDER}/docker-compose.yml up -d --build
