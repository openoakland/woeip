# Hosting

## Local (Development)
A configuration suitable for development

- All data served on the local machine
- Files saved using Django's file manager
- React uses development build
- Routes traffic only within the local machine
- See `/README.md` for setup and development instructions

## Production
A configuration suitable for serving the app to multiple users over the Internet
- All services centralized to one Digital Ocean machine
  - Database
  - NGINX server
  - Django API
  - React frontend
- React uses production build
- Designed to handle multiple external users simultaneously

# Workflow for changing and deploying WOAQ
1. Once changes tested and written locally have accumulated and stablized on `develop` (see `/README.md` for setup and development instructions), make a pull request to place cumulative changes onto `main` branch
2. Cumulative changes pushed to `main` branch can then be deployed from DigitalOcean (see next section)
3. Once deployed from DigitalOcean, the changes will be available for live use.

# Deploying to DigitalOcean Using the Terminal
1. Open your terminal
2. Run the `ssh root@<ipaddress>` command, then enter the password when prompted to gain access into the WOAQ server
> :information_source: **Info**: Contact the admins for the WOAQ IP address and password. Alternatively, you can log into the WOAQ dashboard. The IP address can be optained from Droplets. It is labeled "IPv4" in the Droplets interface.
3. Navigate into woeip directory
> :information_source: **Info**: Use the `git status` command to confirm you are in the `main` branch. Use the `git checkout main` command to switch to `main` branch if you are not in the `main` branch.

> :information_source: **Info**: Use the `docker ps` command to view all the running containers.
4. Run the `docker-compose -f docker-compose.yml -f docker-compose.livewire.yml down` command to stop the running of the production environment.
> :notebook: **Note**: The WOAQ website will be inaccessible after running this command (except a cached version).
5. Run the `git fetch origin main` command
6. Run the `git pull origin main` command
7. Run the `docker-compose -f docker-compose.yml -f docker-compose.livewire.yml build` command to rebuild the production environment incorporating the new changes from the `main` branch
8. Run the `docker-compose -f docker-compose.yml -f docker-compose.livewire.yml up -d` command to bring back up the production environment
9. The WOAQ website should now be live and accessible.
