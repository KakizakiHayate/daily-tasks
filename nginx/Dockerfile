FROM nginx:1.26.2

# 必要なツールをインストール
RUN apt-get update && apt-get install -y \
    curl \
    procps \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Nginxの設定ファイルをコピー
COPY default.conf /etc/nginx/conf.d/default.conf
