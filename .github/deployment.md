# Hosting

## Local
A configuration suitable for development

- All data served on the local machine
- Files saved using Django's file manager
- React uses development build
- Routes traffic only within the local machine

Steps:
1. docker-compose up --build

## Livewire
A basic configuration to allow user to interact with a live site
- All data served on an Amazon EC2 machine
- Files saved using Django's file manager
- React uses production build
- Routes traffic from outside the machine

Steps
1. docker-compose -f docker-compose.yml -f docker-compose.livewire.yml up --build

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
7. Once changes have accumulated and stablized on `develop`, there will be a PR to place cumulative changes onto `main` branch
8. Cumulative changes pushed to `main` branch will consequently be deployed to DigitalOcean (see next section on how to)
9. Once on DigitalOcean, the changes will be available for live use.

# Deploying to DigitalOcean Using the Terminal
1. Open your terminal
2. Run the `ssh root@<ipaddress>` command, then enter the password when prompted to gain access into the WOAQ server
> :memo: **Note**: Contact the admins for the WOAQ Anchor IP address and password.
3. Navigate into woeip directory
> :bulb: **Info**: Use the `git status` command to confirm you are in the `main branch`. Use the `git checkout main` command to switch to `main branch` if you are not in the `main branch`.
> :bulb: **Info**: Use the `docker ps` command to view all the running containers.
4. Run the `docker-compose -f docker-compose.yml -f docker-compose.livewire.yml down` command to stop the running of the production environment.
> :memo: **Note**: The WOAQ website would be inaccessible after running this command (except a cached version).
5. Run the `git fetch origin main` command
6. Run the `git pull origin main` command
7. Run the `docker-compose -f docker-compose.yml -f docker-compose.livewire.yml build` command to rebuild the production environment incorporating the new changes from the `main branch`
8. Run the `docker-compose -f docker-compose.yml -f docker-compose.livewire.yml up -d` to bring back up the production environment 
9. The WOAQ website should now be live and accessible