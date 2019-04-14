# Contributing
Welcome to the WOAQ Contributing document!

## Code of Conduct
Please review the Open Oakland [Code of Conduct](https://github.com/openoakland/woeip/tree/master/.github/code_of_conduct.md)

## Communication
WOAQ communinicates primarily through the [OpenOakland Slack Workspace](https://openoakland.slack.com), in the #woaq channel. Access to the Slack Workspace is granted by attending an [OpenOakland Hacknight](http://openoakland.org/) and onboarding with the community organizers. Alternatively, complete this [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSee_qdE0qCmhufJC94MmSRVDLPAhhFJO4QMzuC31Kh0lxI_Mg/viewform) to join the OpenOakland community and request access to the Slack. Once a member of the Slack Workspace, you may navigate to the #woaq channel.

## Documentation
Please reach out in the #woaq Slack Channel or at an OpenOakland Hacknight to request access to any private documents
- [Project Outline](https://bit.ly/WOAQoverview) for long term strategy
- [Trello Board](https://trello.com/b/EBnxZHmx/west-oakland-air-quality) for project management
- [GitHub Issues](https://github.com/openoakland/woeip/issues) for code management
- [Google Drive](https://drive.google.com/drive/folders/1XQ9ckXD4z3G6NWXcd2PO8GtK7zcucBfx) to preserve historical documents

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

## Code Development

Start by cloning this repository:

```bash
git clone git@github.com:openoakland/woeip.git
cd woeip
```

### Running the site locally (Docker)

We recommend running the site using our [Docker](https://www.docker.com/) setup. Docker allows full control of the software versions by running everything in containers, which you can think of as virtual machines isolated from your host machine. You can quickly get up and running with the included configuration. First, build the Docker container:

```bash
make docker.build
```

Start the containers that run the web app and server services:

```bash
make local.up
```

When running the service with this command, it will be configured to run using the code on your local machine, rather than the code built in the previous step. Additionally, the [gunicorn](https://gunicorn.org/) application server has been configured to automatically reload when code is changed locally.

Enter the web app container (`app`). The shell prompt changes indicating subsequent commands will run in the container:

```
root@<container ID>:/app/woeip# make local.shell
```

Create a Django superuser:

```
root@<container ID>:/app/woeip#	./manage.py createsuperuser 
```

Exit the container by pressing `ctrl-d`.

### Running the site locally (host machine)

If you would prefer not to use Docker, you also be run the project directly on your machine using [pipenv](https://pipenv.readthedocs.io/en/latest/). If you develop in this manner, you will be responsible for (a) installing ``pipenv`` and (b) configuring PostgreSQL.

1. Install the requirements:

```bash
make requirements
```

2. Start Django:

```bash
DEBUG=true SECRET_KEY=replace-me DATABASE_URL=psql://<db-user>:<db-password>@<db-host>:<db-port>/<db-name> python manage.py runserver
```

### Forks and Branches
Developers generally work on the original OpenOakland WOEIP repository, rather than creating personal forks.

Some developers identify their branches with a personal code, followed by a slash, and then the branch name. This practice is encouraged but not enforced.
- ie) [initials of developer]/[branch name] 
- ex) ty/add-index

### Repository Permissions
Write permissions can be requested by contacting the development team at an OpenOakland hack night. Contributors without a code review, discussion in an issue, or commit in past 60 days will have their write permissions rescinded.


### Issues
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


### Pull Requests
A pull request should simply implement a solution that was already established in an issue, rather than include discussions on how to implement the project design. To the maximum extent possible, it should address only one bug or feature. Limiting the scope of pull requests simplifies the review process and accelerates development.

Pull requests must pass the Travis checks before merging into the `master` branch. These checks are a linting check and code tests. They can be accomplished locally by entering the project shell (`make local.shell`) and running them separately (`make quality` and `make test`) or together (`make validate`). Please pass these checks locally, before making a pull request. Other contributors will gladly help with any tests you are struggling to pass.

Only one approving review is required to merge into the `master` branch. However, please leave the pull request open for at least **36 hrs**. As a volunteer project, contributors may not be able to immediately make comments. Adding a slight delay allows for multiple reviewers to provide input. However, this is a soft rule. It is not meant to be applied so rigidly applied that it creates unnecessary delays and inefficient code development.

Once the Travis checks are passing, any requested code changes are resolved, and **36 hours** have passed, the developer who opened the pull request should merge their own code.

### Style Guidelines
Please follow these guidelines during development:
- [PEP 8](https://www.python.org/dev/peps/pep-0008/) enforced by [pylint]
- Docstrings in [Numpy Stlye](https://sphinxcontrib-napoleon.readthedocs.io/en/latest/example_numpy.html#example-numpy)
- [Django Templating](https://oncampus.oberlin.edu/webteam/2012/09/architecture-django-templates)

### Testing
As the codebase develops, robust testing techniques ensure code integrity. With each new feature, we design and implement
appropriate tests.

Testing resources include:
- [Django Testing](https://docs.djangoproject.com/en/2.2/topics/testing/overview/)
- [Python Faker](https://faker.readthedocs.io/en/master/)
- [Pytest](https://docs.pytest.org/en/latest/)

### Reporting Bugs and Security Concerns
Please open an issue to report any bugs.<br>
To report or discuss a security concern,
please send an email to the WOAQ team at:
[woaq@openoakland.org](mailto:woaq@openoakland.org>).
Or reach out to the #woaq Slack channel
