#!/bin/sh

php artisan config:clear
php artisan event:cache
php artisan view:cache
php artisan route:cache
php artisan cache:clear
php artisan optimize

# Download IP2Location database
FILE_URL="https://cdn.rickokkersen.nl/IP2LOCATION.BIN"
# Ensure the destination directory exists
mkdir -p /opt/apps/laravel/database/ip2location
# Set the destination path for the downloaded file
DESTINATION_PATH="/opt/apps/laravel/database/ip2location/IP2LOCATION.BIN"

echo "⬇️ Downloading file from $FILE_URL..."
curl -fsSL "$FILE_URL" -o "$DESTINATION_PATH"

if [ $? -eq 0 ]; then
    echo "✅ File downloaded successfully to $DESTINATION_PATH"
else
    echo "❌ Failed to download file from $FILE_URL"
    exit 1
fi

php-fpm