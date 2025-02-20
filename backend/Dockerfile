# ARG PHP_EXTS="bcmath ctype fileinfo mbstring pdo pdo_mysql tokenizer dom pcntl"
ARG PHP_EXTS="pdo_mysql mbstring exif pcntl bcmath gd zip"
ARG PHP_PECL_EXTS="redis"

# BUILDING COMPOSER BASE
FROM composer:latest AS composer_base

ARG PHP_EXTS
ARG PHP_PECL_EXTS

RUN mkdir -p /opt/apps/laravel /opt/apps/laravel/bin

WORKDIR /opt/apps/laravel

RUN apk add --virtual build-dependencies --no-cache ${PHPIZE_DEPS} openssl ca-certificates libxml2-dev oniguruma-dev libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev && \
    apk add --no-cache libzip && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) ${PHP_EXTS} && \
    pecl install ${PHP_PECL_EXTS} && \
    docker-php-ext-enable ${PHP_PECL_EXTS} && \
    apk del build-dependencies && \
    apk add --no-cache libpng libjpeg-turbo freetype

RUN addgroup -S composer && adduser -S composer -G composer

COPY --chown=composer composer.json composer.lock ./

RUN chown -R composer:composer /opt/apps/laravel

USER composer

RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY --chown=composer . .

RUN composer install --no-dev --prefer-dist




# BUILD FRONTEND
FROM node:18 AS frontend

COPY --from=composer_base /opt/apps/laravel /opt/apps/laravel

WORKDIR /opt/apps/laravel

RUN npm install
# RUN npm install && \
# npm run build



# BUILD CLI
FROM php:8.3-alpine AS cli

ARG PHP_EXTS
ARG PHP_PECL_EXTS

WORKDIR /opt/apps/laravel

RUN apk add --virtual build-dependencies --no-cache ${PHPIZE_DEPS} openssl ca-certificates libxml2-dev oniguruma-dev libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev && \
    apk add --no-cache libzip && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) ${PHP_EXTS} && \
    pecl install ${PHP_PECL_EXTS} && \
    docker-php-ext-enable ${PHP_PECL_EXTS} && \
    apk del build-dependencies && \
    apk add --no-cache libpng libjpeg-turbo freetype

COPY --from=composer_base /opt/apps/laravel /opt/apps/laravel

COPY docker/php.ini /usr/local/etc/php/php.ini

# Copy the cacert.pem file
COPY docker/cacert.pem /etc/ssl/certs/cacert.pem

RUN chown www-data:www-data /etc/ssl/certs/cacert.pem




# BUILD FPM
FROM php:8.3-fpm-alpine AS fpm_server

ARG PHP_EXTS
ARG PHP_PECL_EXTS

WORKDIR /opt/apps/laravel

RUN apk add --virtual build-dependencies --no-cache ${PHPIZE_DEPS} openssl ca-certificates libxml2-dev oniguruma-dev libpng-dev libjpeg-turbo-dev freetype-dev libzip-dev && \
    apk add --no-cache libzip && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) ${PHP_EXTS} && \
    pecl install ${PHP_PECL_EXTS} && \
    docker-php-ext-enable ${PHP_PECL_EXTS} && \
    apk del build-dependencies && \
    apk add --no-cache libpng libjpeg-turbo freetype

COPY docker/fpm-entrypoint.sh /opt/apps/laravel/entrypoint.sh
RUN chmod +x /opt/apps/laravel/entrypoint.sh

# Copy the php.ini file
COPY docker/php.ini /usr/local/etc/php/php.ini

# Copy the cacert.pem file
COPY docker/cacert.pem /etc/ssl/certs/cacert.pem

RUN chown www-data:www-data /etc/ssl/certs/cacert.pem

USER  www-data

COPY --from=composer_base --chown=www-data /opt/apps/laravel /opt/apps/laravel
COPY --from=frontend /opt/apps/laravel/public /opt/apps/laravel/public

ENTRYPOINT ["./entrypoint.sh"]




# BUILD NGINX
FROM nginx:1.20-alpine AS web_server

WORKDIR /opt/apps/laravel

COPY docker/nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=frontend /opt/apps/laravel/public /opt/apps/laravel/public




# BUILD CRON
FROM cli AS cron

WORKDIR /opt/apps/laravel

RUN touch laravel.cron && \
    echo "* * * * * cd /opt/apps/laravel && php artisan schedule:run" >> laravel.cron && \
    crontab laravel.cron

CMD ["crond", "-l", "2", "-f"]




# BUILD QUEUE WORKER
FROM cli AS queue_worker

WORKDIR /opt/apps/laravel

USER www-data

COPY --from=composer_base --chown=www-data /opt/apps/laravel /opt/apps/laravel
COPY --from=frontend --chown=www-data /opt/apps/laravel/public /opt/apps/laravel/public

CMD ["php", "artisan", "queue:work", "--verbose", "--tries=3", "--timeout=90"]




# BUILD SOCKET_SERVER
FROM cli AS socket_server

WORKDIR /opt/apps/laravel

CMD ["php", "artisan", "reverb:start"]




# DEFAULT STAGE
FROM cli