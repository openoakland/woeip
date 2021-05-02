## Checklist
- [ ] Add description
- [ ] Reference the open issue that the pull request addresses
- [ ] Pass code quality checks
  - spin up docker `docker-compose up -d --build`
  - enter api container `docker-compose exec api /bin/bash`
  - run api tests `make validate`
  - exit container `ctrl/command+D` or `exit`
  - enter web container `docker-compose exec web /bin/sh`
  - run front-end tests `npm run test` or `npx jest`
  - run a specific front end test `npm run test src/[sub-path-to-file]/[name of file]`
  - lint `npm run lint-fix`
  - exit container as above
- [ ] Request code review
  - Please allow **36 hours** from opening a pull request before merging a pull request- even if it has already received an approving review.
- [ ] Address comments on code and resolve requested changes
- [ ] Merge own code

## Description
Issue: #

*Brief description of solution*
