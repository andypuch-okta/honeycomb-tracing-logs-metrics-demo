clean:
	docker-compose down -v

build:
	docker-compose build
	
up: clean build
	docker-compose up
