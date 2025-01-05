# 環境切り替えと Docker コンテナの起動
.PHONY: local local-build production production-build

# ローカル環境に切り替えてビルドなしでコンテナを起動
local:
	@./scripts/switch-env.sh local
	@echo "Starting Docker containers for local environment without build..."
	docker-compose up -d

# ローカル環境に切り替えてビルドしてコンテナを起動
local-build:
	@./scripts/switch-env.sh local
	@echo "Building and starting Docker containers for local environment..."
	docker-compose up --build -d

# 本番環境に切り替えてビルドなしでコンテナを起動
production:
	@./scripts/switch-env.sh production
	@echo "Starting Docker containers for production environment without build..."
	docker-compose up -d

# 本番環境に切り替えてビルドしてコンテナを起動
production-build:
	@./scripts/switch-env.sh production
	@echo "Building and starting Docker containers for production environment..."
	docker-compose up --build -d

# Docker コンテナの停止と削除
.PHONY: down

down:
	@echo "Stopping and removing Docker containers..."
	docker-compose down
