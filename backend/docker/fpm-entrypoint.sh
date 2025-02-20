#!/bin/sh

php artisan config:clear
php artisan event:cache
php artisan view:cache
php artisan route:cache
php artisan cache:clear
php artisan optimize

php-fpm