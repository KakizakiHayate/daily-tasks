FROM node:16.14

WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# ソースコードをコピー
COPY . .

# 開発サーバーのポートを公開
EXPOSE 3000

# 環境変数の設定
ENV CI=true
ENV WDS_SOCKET_PORT=0

# 開発サーバーを起動
CMD ["npm", "start"]
