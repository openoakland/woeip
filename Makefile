.DEFAULT_GOAL := test

.PHONY: help

help: ## Display this help message
	@echo "Please use \`make <target>\` where <target> is one of"
	@perl -nle'print $& if m{^[\.a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

docker.build: ## Build the Docker containers
	docker-compose build

docker.pull: ## Pull the Docker containers
	docker-compose pull

%.down: ## Stop the (local|production) Docker containers
	docker-compose -f docker-compose.yml -f docker-compose.$*.yml down

%.restart: ## Restart the (local|production) Docker containers
	docker-compose -f docker-compose.yml -f docker-compose.$*.yml restart

%.shell: ## Open a shell into the (local|production) app Docker container
	docker-compose -f docker-compose.yml -f docker-compose.$*.yml exec app /bin/bash

%.up: ## Start the (local|production) Docker containers
	docker-compose -f docker-compose.yml -f docker-compose.$*.yml up -d	