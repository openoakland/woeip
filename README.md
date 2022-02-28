West Oakland Air Quality Project (WOAQ) [![TravisCI](https://travis-ci.org/openoakland/woeip.svg?branch=master)](https://travis-ci.org/openoakland/woeip) [![Codecov](https://codecov.io/gh/openoakland/woeip/branch/master/graph/badge.svg)](https://codecov.io/gh/openoakland/woeip)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/ambv/black)
===========================================================================

West Oakland Air Quality (WOAQ) aims to help West Oaklanders fight for better air by making their local air quality data more accessible and meaningful, and providing the digital advocacy tools needed to drive change in their neighborhood.

WOAQ is an [OpenOakland](https://openoakland.org/) project, co-created with the [West Oakland Environmental Indicators Project (WOEIP)](https://www.woeip.org), a community-based environmental justice organization that has been collecting air quality data for over a decade.  WOEIP is dedicated to achieving healthy homes, healthy jobs and healthy neighborhoods for all who live, work, learn and play in West Oakland, California.

# Readme contents

- [Code of conduct and values](#code-of-conduct-and-values)
- [Quickstart for developers and designers](#quickstart-for-developers-and-designers)
- [Contributing as a non-developer](#contributing-as-a-non-developer)
- [Project documentation](#project-documentation)
- [Contact](#contact)
- [License](#license)

# Code of conduct and values

To participate in this project, we ask you to abide by the OpenOakland [Code of Conduct](https://github.com/openoakland/woeip/blob/master/.github/code_of_conduct.md), and honor the [17 Principles of Environmental Justice](https://www.ejnet.org/ej/principles.html).

# Quickstart for developers and designers

Once you download the WOAP codebase from GitHub, there are two methods to allow you to run the application locally in your browser.

#### Node.js
The code you download from GitHub does not contain the Node.js libraries needed to run the site locally.  You can install Node.js if you don't already have it installed and then run a command to get the needed Node.js libraries.  This method allows you to run the front-end but does not install the back-end database.  With this method, you can make and submit front-end edits to the project, but you won't be able to upload GPS and datalogger files nor see these data on the map.  This is a good method for designers and folks with computers with 4GB or less of available memory.

#### Docker
Alternatively, you can install Docker which allows creation of virtual machine instances within your computer configured to run the app.  Running the Docker configuration files in the WOAP codebase, all four needed instances are created -- the front-end and Node libraries, the database back-end, the API, and the proxy to manage all the connections between them -- allowing you to use the application locally as if you were using it in production, and to make and submit edits to the project.  Docker uses more active memory (4GB typically) and disk space (60GB) than running the app with Node.js only.  See the Docker requirements for [Mac](https://docs.docker.com/desktop/mac/install/) or [Windows](https://docs.docker.com/desktop/windows/install/) for more information.

## Getting the project code

The starting point for either of the two install methods is to get the current WOAQ project code.

```
git clone https://github.com/openoakland/woeip.git
cd woeip
```
This will pull in the current project code from the `develop` branch and bring you into the installed directory, setting it up with **git** to allow you to manage versions, push edits, etc.

Next, to start the app, use either Method 1 or Method 2 to get the project running locally.

## Starting the app locally with NPM (Method 1)

The current recommendation to avoid compatibilty issues is to use Node.js version **16.14.0**.  Check to see if already have it installed.  

```
node --version
```
* If you get no response, Node.js is not yet on your system; see [Node Downloads](https://nodejs.org/en/download/) to download and install Node.js and the Node Package Manager (NPM).  
* If you get a number lower than 16.14.0, please upgrade to the version recommended for our project: `nvm install 16.14.0`
* If you get a number higher than 16.14.0, you may wish to switch to this version: `nvm use 16.14.0` See above to install if necessary.
* If you get a response of 16.14.0, you have the correct version of Node.js and NPM installed; continue below.

Once Node.js and NPM are installed, simply do the following to go to the `..\web` front-end directory, install all the needed libraries the app requires as listed in `package.json`, and then open up the app in a web browser locally with a script also defined in `package.json`

```
cd web
npm install
npm run start
```

Your browser should now open, navigating to the app running at [http://localhost:3000/]().  Note that you won't be able to upload data files to the app or see them mapped, but you can see and interact with the front-end.  You can now skip down to the section [To update the front-end locally](#to-update-the-front-end-locally) to learn about making and submitting changes to the code.  See also the section [Contributing as a non-developer](#contributing-as-a-non-developer) if preferred.

## Starting the app locally with Docker (Method 2)

Install [Docker](https://www.docker.com/), if needed, then issue the Docker command while in the `woeip` directory to build the four instances needed to create the app.

```
docker-compose up -d --build
```
All the images will start downloading and the containers will start automatically.  When complete, you can browse to [http://localhost:3000/]() to see the running app.

Go to the [http://localhost:3000/upload]() page to upload a pair of data files that you can then view in the map.  Load data files from one of the dated folders within the [AQ Join Data](https://drive.google.com/drive/folders/1vJ141wxf-OBwwhf4_Jc1TtT5BJw7p6SU) folder in the WOAQ Google Drive collection.  Load a \*.csv and a \*.log file.  Note the date of the collection and then click Save.  The Map page should then open showing your loaded data, or use the calendar interface to switch to the date of your uploaded collection.

With Docker Dashboard, you can start and stop the instances as needed.  With any restart of the instances, you'll need to load data files again to see them on the map.


## To update the front-end locally
After using either of the above two methods to install the code, you can make edits by the following method.

Create and check out new branch based on an existing branch

```
git status
git checkout {existing-branch, e.g. develop}
git pull origin develop
git checkout -b {new-branch-name}
```
### Navigate to front-end directory

```
cd {directory path, e.g. web/src}
```

### In text editor

Make desired changes to files in `/src` folder

### Stage, commit and push changes

```
git add .
```
Don't forget that period!


```
git commit -m "{message text}"
git push origin {new-branch-name}
```

### Open pull request (PR) in WOEIP repo

Go to [https://github.com/openoakland/woeip/pulls]().  Create a new pull request to ask that your code be incorporated into the general codebase.  Be sure to include a request for review from team member(s).

## To access the back-end database

Please refer to the **[database schema (1/8/2020)](https://drive.google.com/file/d/1U5tIkROnRMZkQJXmoQan81WKCapi7fOy/view)**

If you have Docker installed and have the WOAQ instances running, you can do the following to access the Postgres database.

`docker-compose exec db bash` enters the docker container, a mini-linux machine

`psql -U postgres` logs in to the database that is running on the mini-linux machine

`\c woaq` enters the woaq database

`\dn` list all schemas

`\dt` list all tables

Run any needed SQL commands here, like

`SELECT * from air_quality_device;`

`\q` to quit postgres database

`exit` to exit container and get back to shell

## Services  

- woaq-proxy: [nginx-proxy](https://github.com/jwilder/nginx-proxy), [ssl-autogen](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion)   
- woaq-web:
[typescript](https://www.typescriptlang.org/), [react](https://reactjs.org/), [razzle](https://github.com/jaredpalmer/razzle), [semantic UI](https://react.semantic-ui.com/)  
- woaq-api: [python](https://www.python.org/), [django-rest-framework](https://www.django-rest-framework.org/)
- woaq-db: [postgis](https://postgis.net/)

## Domains  

With Docker installed and WOAP instances running, you can now open your web browser and access the services at the following [lvh](https://www.quora.com/What-is-lvh-me?share=1) domains:  

### Front-end  

- Homepage: [lvh.me](http://lvh.me)

### Back-end  

- API: [api.lvh.me](http://api.lvh.me)
- API Documentation: [api.lvh.me/swagger](http://api.lvh.me/swagger)

## Code Quality Checks

Follow testing and linting instructions in the [Pull Request Template](/.github/pull_request_template.md)

# Contributing as a non-developer

## Design & research options
---------------
We use [Trello](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) for project management (note that after February 2022, this may change):
- [ ] Review and add a comment to any light blue “Design & Research” card currently sitting in the [In QA](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) column. Or;
- [ ] Grab any card tagged with the light blue “Design & Research” label in the [Ready to Work On](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) column and get started. 

## Data science/analysis options
---------------
We use [Trello](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) to document and discuss data decisions (note that after February 2022, this may change):
- [ ] Review and add a comment to any yellow “Data Q” card currently sitting in the [Qs About Data Analysis](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) column. Or;
- [ ] Add a new yellow “Data Q” card to the [Qs About Data Analysis](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) column for any new questions you think of that might be important to answer. 

# Project documentation
---------------
- [Project Overview](https://drive.google.com/open?id=1nMpRN8zOn-Sq9ocrVcOY0HZI2JnL5R7wEKje_YgVwRk)
- [Product Requirements](https://docs.google.com/document/d/1j-R9CQt6dnBwGTDSExlIN68vCmtqXtPMpH2fP5cYSOo/edit?usp=sharing)
- [Design Research Plan](https://drive.google.com/open?id=1Es6k_gOF0qDgkdEJzhj_3ZBMEkRsVg3ecsRSCqThURs)
- [Accessibility Guidelines](https://drive.google.com/open?id=1CKf6g1nd_pxdAKHI-9gbqEGoKWdSAW1PrpC1FTiXEUk)

# Contact

- Email: [woaq@openoakland.org](mailto:woaq@openoakland.org)
- Slack: [#WOAQ channel](https://openoakland.slack.com/) (complete [this form](https://docs.google.com/forms/d/e/1FAIpQLSee_qdE0qCmhufJC94MmSRVDLPAhhFJO4QMzuC31Kh0lxI_Mg/viewform) for access)
- In person: Join us [Tuesday evenings at Oakland City Hall](https://www.meetup.com/OpenOakland/).

Reporting security issues
-------------------------
Please do not report security issues in public. Instead, send an email to the WOAQ team at [woaq@openoakland.org](mailto:woaq@openoakland.org). Or reach out via the [#woaq Slack channel](https://openoakland.slack.com/) (complete [this form](https://docs.google.com/forms/d/e/1FAIpQLSee_qdE0qCmhufJC94MmSRVDLPAhhFJO4QMzuC31Kh0lxI_Mg/viewform) for access).

# License

[MIT](https://github.com/openoakland/woeip/blob/master/LICENSE)