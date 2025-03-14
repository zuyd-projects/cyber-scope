# Stage 1: Build the application
FROM node:20 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Stage 2: Create the final image
FROM node:20-alpine AS grpc

WORKDIR /app
COPY --from=build /app .

CMD ["node", "server.js"]