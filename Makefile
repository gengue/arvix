.PHONY: all build 

include .env

all: build

server-dev:
	@go run main.go serve 

ui-dev:
	@cd ui && npm run dev

build:
	@cd ui && npm run build && cd .. && go build

types:
	npx pocketbase-typegen --db ./pb_data/data.db --out ui/app/lib/pb.types.ts

deploy:
	@echo "Building UI"
	@cd ui && npm run build && cd ..
	@echo "Building GO server for linux"
	@GOOS=linux GOARCH=amd64 go build main.go &
	@echo "Executing deployment script"
	./deployment/manual-dist.sh 

db-snapshot:
	@go run . migrate collections

db-migrate:
	@go run . migrate

db-squash:
	# first, delete the unncessary migration files
	@go run . migrate history-sync 

# make path=snap.zip restore-backup
restore-backup:
	@rsync pb_data/backups/$(path) $(SERVER_USER)@$(SERVER_IP):$(REMOTE_APP_DIR)/pb_data/backups/$(path)
