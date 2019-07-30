.DEFAULT_GOAL := test

.PHONY: help

help: ## Display this help message
	@echo "Please use \`make <target>\` where <target> is one of"
	@perl -nle'print $& if m{^[\.a-zA-Z_-]+:.*?## .*$$}' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m  %-25s\033[0m %s\n", $$1, $$2}'

prod.pull: ## Pull the production Docker services
	docker-compose pull

local.build: # Build the local Docker services
	docker-compose build

local.up: ## Start the local Docker services
	docker-compose up -d	

local.down: ## Stop the local Docker services
	docker-compose down

%.build: ## Build specific production service
	docker-compose build $*		

%.shell: ## Open a shell into specific local Docker service
	docker-compose exec $* /bin/bash		

local.restart: ## Restart the local Docker services
	docker-compose restart