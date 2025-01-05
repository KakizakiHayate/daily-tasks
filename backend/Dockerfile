FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    net-tools \
    procps \
    && docker-php-ext-install pdo_mysql \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install

RUN chmod -R 777 /var/www/html/storage /var/www/html/bootstrap/cache

# Xdebugのインストール
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Xdebugの設定
COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

CMD ["php", "-S", "0.0.0.0:8001", "-t", "public"]
