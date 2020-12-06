# Hosting

## Local
A configuration suitable for development

- All data served on the local machine
- Files saved using Django's file manager
- React uses development build
- Routes traffic only within the local machine

Steps:
1. docker-compose up --build

## Develop

## Livewire
A basic configuration to allow user to interact with a live site
- All data served on an Amazon EC2 machine
- Files saved using Django's file manager
- React uses production build
- Routes traffic from outside the machine

Steps
1. docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build

## Staging
An exact replication of the production configuration.
Exists pending budget allocation.

## Production
A scalable configuration
- Data spread among several machines
  - Files saved on S3
  - Database served using Aurora 
  - NGINX Server, API, and Site hosted on EC2 machine
- React uses production build
- Designed to handle multiple external users simultaneously
