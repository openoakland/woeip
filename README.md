West Oakland Air Quality Project (WOAQ) [![TravisCI](https://travis-ci.org/openoakland/woeip.svg?branch=master)](https://travis-ci.org/openoakland/woeip) [![Codecov](https://codecov.io/gh/openoakland/woeip/branch/master/graph/badge.svg)](https://codecov.io/gh/openoakland/woeip)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/ambv/black)
===========================================================================

West Oakland Air Quality (WOAQ) aims to help West Oaklanders fight for better air by making their local air quality data more accessible and meaningful, and providing the digital advocacy tools needed to drive change in their neighborhood.

WOAQ partners with [West Oakland Environmental Indicators Project](https://www.woeip.org) (WOEIP), a community-based environmental justice organization that has been collecting air quality data for over a decade. WOEIP is dedicated to achieving healthy homes, healthy jobs and healthy neighborhoods for all who live, work, learn and play in West Oakland, California.

# Readme contents

- [Code of conduct and values](#code-of-conduct-and-values)
- [Quickstart for developers](#quickstart-for-developers)
- [Contributing as a non-developer](#contributing-as-a-non-developer)
- [Project documentation](#project-documentation)
- [Contact](#contact)
- [License](#license)

# Code of conduct and values

To participate in this project, we ask you to abide by the OpenOakland [Code of Conduct](https://github.com/openoakland/woeip/blob/master/.github/code_of_conduct.md), and honor the [17 Principles of Environmental Justice](https://www.ejnet.org/ej/principles.html).

# Quickstart for developers

Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)  
### Run locally  

```
git clone https://github.com/openoakland/woeip.git
cd woeip
docker-compose up -d --build
```
## To update the front-end locally
Create and check out new branch based on an existing branch

```
git status
git checkout {existing-branch}
git pull origin develop
git checkout -b {new-branch-name}
```
### Navigate to front-end directory

```
cd {directory path}
```

### Open text editor
File `package.json` contains npm commands under "scripts"

### Run front-end via command line

`npm install` installs all needed libraries

`npm run start` should open in web browser

### In text editor

Make desired changes to files in `/src` folder

### Stage, commit and push changes

`git add .` (don't forget that period!)

```
git commit -m "{message text}"
git push origin {new-branch-name}
```

### Open pull request (PR) in WOEIP repo

Request review from team member(s)

## To access the back-end database

Please refer to the **[database schema (1/8/2020)](https://drive.google.com/file/d/1U5tIkROnRMZkQJXmoQan81WKCapi7fOy/view)**

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

You can now open your web browser and access the services at the following [lvh](https://www.quora.com/What-is-lvh-me?share=1) domains:  

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
We use [Trello](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) for project management:
- [ ] Review and add a comment to any light blue “Design & Research” card currently sitting in the [In QA](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) column. Or;
- [ ] Grab any card tagged with the light blue “Design & Research” label in the [Ready to Work On](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) column and get started. 

## Data science/analysis options
---------------
We use [Trello](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) to document and discuss data decisions:
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