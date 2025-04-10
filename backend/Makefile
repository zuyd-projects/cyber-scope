# VERSION defines the version for the docker containers.
# To build a specific set of containers with a version,
# you can use the VERSION as an arg of the docker build command (e.g make docker VERSION=0.0.2)
VERSION ?= latest

# REGISTRY defines the registry where we store our images.
# To push to a specific registry,
# you can use the REGISTRY as an arg of the docker build command (e.g make docker REGISTRY=my_registry.com/username)
# You may also change the default value if you are using a different registry as a default
REGISTRY ?= registry.rickokkersen.nl/cyberscope

# Define the no-cache flag variable
NO_CACHE_FLAG=

# Check if the no-cache flag is set
ifeq ($(no-cache), true)
    NO_CACHE_FLAG=--no-cache
endif


dep: docker deploy

# Commands
deploy: 
	kubectl rollout restart deployment cyberscope --namespace=laravel-applications
	kubectl rollout restart deployment cyberscope-php-fpm --namespace=laravel-applications
	kubectl rollout restart deployment cyberscope-nginx --namespace=laravel-applications
	kubectl rollout restart deployment cyberscope-workers --namespace=laravel-applications
	kubectl rollout restart deployment cyberscope-grpc-workers --namespace=laravel-applications
	kubectl rollout restart deployment cyberscope-ws-workers --namespace=laravel-applications

docker: docker-build docker-push

docker-build:
	docker build . $(NO_CACHE_FLAG) --target cli -t ${REGISTRY}/cli:${VERSION}
	docker build . $(NO_CACHE_FLAG) --target cron -t ${REGISTRY}/cron:${VERSION}
	docker build . $(NO_CACHE_FLAG) --target fpm_server -t ${REGISTRY}/fpm_server:${VERSION}
	docker build . $(NO_CACHE_FLAG) --target web_server -t ${REGISTRY}/web_server:${VERSION}
	docker build . $(NO_CACHE_FLAG) --target queue_worker -t ${REGISTRY}/queue_worker:${VERSION}
	docker build . $(NO_CACHE_FLAG) --target socket_server -t ${REGISTRY}/socket_server:${VERSION}

docker-push:
	docker push ${REGISTRY}/cli:${VERSION}
	docker push ${REGISTRY}/cron:${VERSION}
	docker push ${REGISTRY}/fpm_server:${VERSION}
	docker push ${REGISTRY}/web_server:${VERSION}
	docker push ${REGISTRY}/queue_worker:${VERSION}
	docker push ${REGISTRY}/socket_server:${VERSION}