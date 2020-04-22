# Contributing
Welcome to the WOAQ Contributing document! Thanks for your desire to contribute to WOAQ. By participating in this project, you agree to abide by the Open Oakland [Code of Conduct](https://github.com/openoakland/woeip/blob/master/.github/code_of_conduct.md) and the [17 Principles of Environmental Justice](https://www.ejnet.org/ej/principles.html).

## Workflow
These are general guidelines on the flow from design to implementation
1. Product needs are identified by consulting with WOEIP and its citizen scientists.
   - Notes are generally kept in the Google Drive. More refined thoughts are moved into the Project Outline
2. Product needs are translated into project requirements and documented in the Trello Board.
   - Guidance on contributing to the Trello Board are available on the [Instructions Card](https://trello.com/c/msbASe3F)
3. The project requirements are translated into wireframe designs
4. GitHub issues are used to translate project requirements and wireframes into actionable code
   - Relevant wireframes attached to the GitHub Issue
5. Github pull requests implement the code agreed upon in the GitHub issues

# Development
- Add a comment to any [open issue](https://github.com/openoakland/woeip/issues?utf8=%E2%9C%93&q=is%3Aopen++). Or;
- Work on any open issue labelled MVP and Ready

```bash
  # 1. Clone and enter the repo
  git clone https://github.com/openoakland/woeip.git
  cd woeip

  # 2. Instead of forking the repo, create a feature branch with your initials and a description, e.g. ty/add-index
  git checkout -b ty/add-index

  # 3. Build and spin up the docker services
  docker-compose up -d --build

  # 4. Add your changes

  # 5. Run tests as described below

  # 6. Create a pull request
```

## Issues
---------------
Issues are the primary means of coordinating code implementation. We use issue comments to explicitly document implementation discussions and decision-making. This allows us to vet our individual assumptions, clarify a shared mental model of the code, outline pseudo-code and other solutions, and pair program. It also documents the design process for future developers. [More Context](https://medium.com/@copyconstruct/effective-mental-models-for-code-and-systems-7c55918f1b3e) <br>
Issues will have one of four status labels:
1. `backlog`: The feature is not currently needed or its application is not fully defined
2. `discussing`: The feature is fully defined and its code design is being outlined
3. `ready`: The code design is outlined. It needs to be assigned a developer
4. `implementing`: The code is actively being written

Status labels can be combined with feature labels:
1. `bug`
2. `testing`
3. etc

Status and bug labels are mandatory. Other labels are optional.<br>
Developers looking to make code contributions should assign `ready` issues to themselves and change the label to `implementing`.


## Pull requests
---------------
A pull request should simply implement a solution that was already established in an issue, rather than include discussions on how to implement the project design. To the maximum extent possible, it should address only one bug or feature. Limiting the scope of pull requests simplifies the review process and accelerates development.

Pull requests must pass the Travis checks before merging into the `master` branch. These involve code tests. They can be accomplished by running the testing script listed below. Please pass these checks locally, before making a pull request. Other contributors will gladly help with any tests you are struggling to pass.

Only one approving review is required to merge into the `master` branch. However, please leave the pull request open for at least **36 hrs**. As a volunteer project, contributors may not be able to immediately make comments. Adding a slight delay allows for multiple reviewers to provide input. However, this is a soft rule. It is not meant to be applied so rigidly applied that it creates unnecessary delays and inefficient code development.

Once the Travis checks are passing, any requested code changes are resolved, and **36 hours** have passed, the developer who opened the pull request should merge their own code.

## Style guidelines
---------------
Please follow these guidelines during development:
- Docstrings in [Numpy Style](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_numpy.html#example-numpy)
- Python stylized and enforced with [Black](https://github.com/ambv/black)
- Visual/CSS styling: [Foundation 6 Global Styles](https://foundation.zurb.com/sites/docs/global.html)
- Typescript linted with [tslint](https://www.npmjs.com/package/tslint) in the style of [Prettier](https://prettier.io/)

## Testing
---------------
As the codebase develops, robust testing techniques ensure code integrity. With each new feature, we design and implement
appropriate tests. Minimum test coverage is 90%.

### Testing resources include-  
#### API:
- [Django Testing](https://docs.djangoproject.com/en/3.0/topics/testing/)
- [Python Faker](https://faker.readthedocs.io/en/master/)
- [Pytest](https://docs.pytest.org/en/latest/)

Run migrations and code tests inside running [docker container/service](#development)
```bash
  docker-compose exec api /bin/bash  
  root@<container_id>:/usr/src/app  make validate
```
#### Front End:
- [Jest](https://jestjs.io/)

Run tests and linter inside running [docker container](#development)
```bash
  docker-compose exec web /bin/sh  
  /usr/src/app npm test
  /usr/src/app npm run lint
```
alternatively...
```
/usr/src/app jest
/usr/src/app tslint -p . [--fix optional]
```

### Reporting bugs and security concerns
---------------
- Please [open an issue](https://github.com/openoakland/woeip/issues/new?assignees=&labels=&template=bug_report.md&title=) to report any bugs.<br>
- To report or discuss a security concern,
please send an email to the WOAQ team at:
[woaq@openoakland.org](mailto:woaq@openoakland.org), or reach out on the [#woaq Slack channel](https://openoakland.slack.com/) (complete [this form](https://docs.google.com/forms/d/e/1FAIpQLSee_qdE0qCmhufJC94MmSRVDLPAhhFJO4QMzuC31Kh0lxI_Mg/viewform) for access).
