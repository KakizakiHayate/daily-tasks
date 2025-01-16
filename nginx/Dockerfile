FROM nginx:1.26.2

RUN apt-get update && apt-get install -y \
    curl \
    vim \
    procps \
    ca-certificates \
    openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY default.conf /etc/nginx/conf.d/default.conf
