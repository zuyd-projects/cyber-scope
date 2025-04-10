# Globe (NodeJS)

A NodeJS implementation based on the Globe.gl project to show real-time data on a virtual globe.

---

## 📦 Features

- Shows the last 20 IP address locations
- Shows live connections with arcs
- On location hover, the corresponding IP address is shown
- On arc hover, the connection source and target is shown
- Data is streamed from a WebSocket connection

---

## 📁 Project Structure

```
globe/
├── dist/            # Output folder
├── public/          # Static assets
├── src/             # JS files 
├── index.html       # Main application entry point
├── Dockerfile       # Docker image definition
├── Makefile         # Deployment scripts
├── package*.json    # NPM files
```

## 🚀 Quickstart (no build needed)

You can run the application on your own machine:

```bash
npm i
npm run dev
```

This will:

- Download the NPM packages
- Run vite dev and host the application on port 5173
NOTE: the WebSocket server should be set up externally

---

## 🛠 Build Instructions (Docker)

### 1. Clone the repo

```bash
git clone https://github.com/zuyd-projects/cyber-scope.git
cd cyber-scope/globe
```

### 2. Build the image

```bash
docker build -t globe --target production .
```

---

## 🧾 License

MIT — free for commercial and personal use.

---

## ✨ Credits

- Built with ❤️ using NodeJS, Globe.gl, solar-calculator and laravel-echo.
