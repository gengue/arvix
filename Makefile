.PHONY: all build run test clean

include .env

all: build

server-dev:
	@go run main.go serve 

ui-dev:
	@cd ui && npm run dev

build:
	@cd ui && npm run build && cd .. && go build

gen-types:
	npx pocketbase-typegen --db ./pb_data/data.db --out ui/app/pb.types.ts

db-snapshot:
	@go run . migrate collections

db-migrate:
	@go run . migrate

db-squash:
	# first, delete the unncessary migration files
	@go run . migrate history-sync 
