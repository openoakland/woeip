#!/bin/bash

set -e

wget https://releases.hashicorp.com/terraform/0.11.10/terraform_0.11.10_linux_amd64.zip
sudo unzip -o terraform_0.11.10_linux_amd64.zip -d /usr/local/bin/
rm terraform_0.11.10_linux_amd64.zip
terraform --version
