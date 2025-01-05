#!/bin/bash

# 引数チェック
if [ "$1" != "local" ] && [ "$1" != "production" ]; then
    echo "Usage: $0 [local|production]"
    exit 1
fi

ENV_TYPE=$1

# フロントエンドの.envファイルを切り替え
echo "Switching frontend .env to $ENV_TYPE..."
cp frontend/.env.$ENV_TYPE frontend/.env

# バックエンドの.envファイルを切り替え
echo "Switching backend .env to $ENV_TYPE..."
cp backend/.env.$ENV_TYPE backend/.env

echo "Environment switched to $ENV_TYPE successfully!"
