# SSH Log Monitor (gRPC + Go)

A NodeJS implementation for a gRPC server

---

## 📦 Features

- gRPC server on port 50051
- Inserts incoming requests into a database for processing by Laravel Queue workers

---

## 📁 Project Structure

```
grpc/
├── proto/           # Proto definition files
├── server.js        # gRPC server
├── Dockerfile       # Docker image for gRPC server
├── Makefile         # Commands for deployment
```

---

## 🚀 Requirements

- NodeJS (v20 recommended)

---

## 🛠 Setup Instructions

### 1. Clone the repo and enter the folder

```bash
git clone https://github.com/zuyd-projects/cyber-scope/grpc.git
cd grpc
```

### 2. Install dependencies

```bash
npm i
```

---

## 🛠 Building the docker image

### ✅ With Make installed

```bash
make docker-build
```

### ✅ Using docker

```bash
docker build .  --target grpc -t grpc-server:latest
```

---

## ⚙️ Running the App

### 1. Set environment variables

```bash
# Use the .env file or set the environment variables directly
cp .env.example .env
```

### 2. Start the server

```bash
node server
```

### Or using the docker image

```bash
docker run -e DB_HOST=<your-db-host> \
           -e DB_PORT=<your-db-port> \
           -e DB_DATABASE=<your-db-database> \
           -e DB_USERNAME=<your-db-username> \
           -e DB_PASSWORD=<your-db-password> \
           -p 50051:50051 \
           grpc-server:latest
```

---

## 🧾 License

MIT — free for commercial and personal use.
