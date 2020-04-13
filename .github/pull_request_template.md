---
name: Pull Request
about: Request merging changes into the code base
title: ''
labels: ''
reviewers: ''

---

## Checklist
- [ ] Add description
- [ ] Reference open issue pull request addresses
- [ ] Pass functional tests
  - spin up docker container service `docker up -d --build`
  - enter api container `docker-compose exec api /bin/bash`
  - run api tests `make test`
  - exit container `ctrl/command+D` or `exit`
  - enter web container `docker-compose exec web /bin/sh`
  - run front-end tests `npm test` or `jest`
  - exit container `ctrl/command+D` or `exit`
- [ ] Request code review
  - Please allow **36 hours** from opening a pull request before merging a pull request- even if it has already recieved an approving review.
- [ ] Address comments on code and resolve requested changes
- [ ] Merge own code

## Description
Issue: #

*Brief description of solution*
