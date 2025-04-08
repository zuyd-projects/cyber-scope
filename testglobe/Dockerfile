# First stage: Build the app with Vite
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Second stage: Serve with NGINX
FROM nginx:alpine AS production

# Copy custom NGINX config (optional)
COPY default.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy custom NGINX config
COPY default.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy the built files from the first stage to the NGINX html folder
COPY --from=build /app/dist /usr/share/nginx/html

COPY config.js.template /usr/share/nginx/html/config.js.template

# Expose port
EXPOSE 80

# Start nginx
ENTRYPOINT ["/entrypoint.sh"]