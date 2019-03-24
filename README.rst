West Oakland Air Quality (WOAQ) project  |Travis|_ |Codecov|_
===========================================================================
.. |Travis| image:: https://travis-ci.org/openoakland/woeip.svg?branch=master
.. _Travis: https://travis-ci.org/openoakland/woeip

.. |Codecov| image:: https://codecov.io/gh/openoakland/woeip/branch/master/graph/badge.svg
.. _Codecov: https://codecov.io/gh/openoakland/woeip

WOAQ is a platform for West Oakland residents to collect, visualize, and act on the air quality data which affects their neighborhood.

Organizations
-------------
`OpenOakland <https://www.openoakland.org/>`_ is a brigade in the Code for America network. Our mission is to bridge technology and community for a thriving and equitable Oakland. We are a welcoming and inclusive volunteer group of developers, designers, data geeks, and citizen activists who use creative technology to solve civic and social problems.

`West Oakland Environmental Indicators Project <http://www.woeip.org/>`_ is a resident led, community-based environmental justice organization dedicated to achieving healthy homes, healthy jobs and healthy neighborhoods for all who live, work, learn and play in West Oakland, California. Through our Community-Based Participatory Research projects and our Collaborative Problem-Solving Model we build community empowerment and help local residents to achieve their own vision for healthy neighborhoods.

Project Description
-------------------
WOEIP has collected Air Quality (AQ) data over several years. The original AQ database is no longer accessible to WOEIP, leaving them without access to collected data. As a result, they've suspended their citizen scientist data collection program. team within OpenOakland has partnered with WOEIP in order to build a replacement. The project, known as WOAQ, will allow WOEIP to intuitively store, process, and visualize their data. Ultimately, this will empower local residents to drive change in their community.

How To Contribute
-----------------
There are several ways to contribute to WOAQ, including product design, community engagement, project management, and engineering. Visit `Contributing.md <https://github.com/openoakland/woeip/tree/master/.github/contributing.md>`_ for more information.

Reporting Security Issues
-------------------------
Please do not report security issues in public. Instead, please contact Tim Miller at miller.tim108@gmail.com

Getting Started
---------------
You can quickly get up and running with the included `Docker <https://www.docker.com/>`_ configuration.

1. Build the Docker container::

    make docker.build

2. Run the service locally, along with Nginx and PostgreSQL::

    make local.up


When running the service with this command, it will be configured to run using the code on your local machine,
rather than the code built in the previous step. Additionally, the `gunicorn <https://gunicorn.org/>`_ application
server has been configured to automatically reload when code is changed locally.

3. If you need to run commands inside the container, you can open a shell with the following command::

    make local.shell

If you would prefer not to use Docker, the project can also be run directly on your machine using
`pipenv <https://pipenv.readthedocs.io/en/latest/>`_. If you develop in this manner, you will be responsible for (a) installing
``pipenv`` and (b) configuring PostgreSQL.

1. Install the requirements::

    make requirements

2. Start Django::

    DEBUG=true SECRET_KEY=replace-me DATABASE_URL=psql://<db-user>:<db-password>@<db-host>:<db-port>/<db-name> python manage.py runserver


Deployment
----------
This project is deployed to `AWS Elastic Beanstalk <https://aws.amazon.com/elasticbeanstalk/>`_. Travis has been
configured to deploy the project with every successful build of the **master** branch. Deployment consists of (1)
pushing the Docker image to `Docker Hub <https://hub.docker.com/>`_ and (2) deploying a new application to Elastic
Beanstalk.

Manual
~~~~~~
In the event that you need to manually deploy, you can do so as follows.

1. Ensure you have the `Elastic Beanstalk Command Line Interface (EB CLI) <https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html>`_
installed::

    pip install awsebcli

2. Make sure you have the access keys for an AWS user with the ``AWSElasticBeanstalkService`` policy. You can learn more about access keys and permissions
at the following links::

- `Access Keys <https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html#access-keys-and-secret-access-keys>`_
- `Policies <https://aws.amazon.com/iam/getting-started/>`_

3. Deploy::

    AWS_ACCESS_KEY_ID=<key> AWS_SECRET_ACCESS_KEY=<secret> eb deploy woeip-production

Terraform
---------
Rather than click around in the AWS UI, you should use `Terraform <https://www.terraform.io/>`_ to create and modify the
infrastructure:

- Elastic Beanstalk application
- RDS database
- Security groups
- DNS (Route 53) configuration
- SSL/TLS certificate

Your Terraform user will need the following policies. Additional permissions/policies will be needed, if you choose to
use other AWS functionality. In general, it is a good practice to give your users as few permissions as needed.

- AmazonRoute53FullAccess
- AWSCertificateManagerFullAccess
- AWSElasticBeanstalkFullAccess
- AWSElasticBeanstalkService
- ElasticLoadBalancingFullAccess


Backend Setup
~~~~~~~~~~~~~
Terraform uses an S3 backend to keep track of its state, and a DynamoDB table for locking, to prevent multiple users
from trying to modify infrastructure at the same time. The S3 bucket and DynamoDB are themselves created via Terraform!

1. Follow the steps at https://www.terraform.io/downloads.html to download Terraform. macOS/Homebrew users can simply
run ``brew install terraform``.

2. Ensure ``terraform/backend_setup/main.tf`` has been properly configured.

3. Go to ``terraform/backend_setup``::

    cd terraform/backend_setup

3. Generate an execution plan::

    terraform plan

4. Apply the changes::

    terraform apply

5. Commit ``terraform/backend_setup/terraform.tfstate`` to the repository.

This procedure only needs to be done once.

Applying Changes
~~~~~~~~~~~~~~~~
Once the backend is setup, you can apply the Terraform that creates the infrastructure on which your project will run.

1. Ensure ``terraform/terraform.tfvars`` has been properly configured. See ``terraform/terraform.example.tfvars`` for
an example of what should be in this file.

2. DO NOT commit ``terraform/terraform.tfvars`` to Git!

3. Go to ``terraform``::

    cd terraform

3. Generate an execution plan::

    terraform plan

4. Apply the changes::

    terraform apply

Note that this process will take at least 10 minutes for the initial database setup. The SSL/TLS certificate setup
may also take up to 20 minutes.

The resulting state information will be saved to S3.

