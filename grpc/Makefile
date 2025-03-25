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
	kubectl rollout restart deployment cyberscope-grpc --namespace=laravel-applications
	kubectl rollout restart deployment cyberscope-grpcdev --namespace=laravel-applications

docker: docker-build docker-push

docker-build:
	docker build . $(NO_CACHE_FLAG) --target grpc -t ${REGISTRY}/grpc:${VERSION}

docker-push:
	docker push ${REGISTRY}/grpc:${VERSION}