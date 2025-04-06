#!/bin/bash

# Ensure a fresh start by stopping and removing all running containers, networks, and volumes defined in the docker-compose.yml file.
docker-compose down -v

# Update to the latest versions by pulling the most recent images specified in the docker-compose.yml file from the Docker registry.
docker-compose pull

# Rebuild and start the containers using the updated images and configurations defined in the docker-compose.yml file.
docker-compose up --build