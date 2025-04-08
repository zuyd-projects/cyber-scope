#!/bin/sh

# Replace placeholders in config.js.template with environment variables
envsubst '${REVERB_APP_KEY} ${REVERB_HOST} ${REVERB_PORT} ${REVERB_SCHEME}' < /usr/share/nginx/html/config.js.template > /usr/share/nginx/html/config.js

rm /usr/share/nginx/html/config.js.template

# Start NGINX
nginx -g "daemon off;"