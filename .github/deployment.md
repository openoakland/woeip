# Hosting

## Local
A configuration suitable for development

- All data served on the local machine
- Files saved using Django's file manager
- React uses development build
- Routes traffic only within the local machine

Steps:
1. docker-compose up --build

## Api Docker Build
A basic configuration to allow user to interact with a live site.
API is hosted on Digital Ocean. Front end is hosted on Netlify.
- All data served on an Amazon EC2 machine
- Files saved using Django's file manager
- React uses production build
- Routes traffic from outside the machine

Steps
1. docker-compose -f docker-compose.yml -f docker-compose.api.yml up --build

## WIP: Development
A basic configuration to allow experimental changes to be hosted and testing remotely.

## WIP: Staging
An exact replication of the production configuration.
Exists pending budget allocation.

## WIP: Production
A scalable configuration
- Data spread among several machines
  - Files saved on S3
  - Database served using Aurora 
  - NGINX Server, API, and Site hosted on EC2 machine
- React uses production build
- Designed to handle multiple external users simultaneously

# Workflow for changing and deploying WOAQ
1. Request write access to the GitHub repository
2. Install Docker & Docker-Compose
   - Mac and WSL2 users should install Docker Desktop, which includes Docker-Compose
3. Checkout out a local branch
4. Run a local instance of WOAQ
5. Push the local changes to the repo 
6. Make a pull request against the `develop` branch
7. Once changes have accumulated and stablized on `develop`, there will be a PR to place cumulative changes onto `livewire`
8. Once on `livewire`, the changes will be available for live use.
