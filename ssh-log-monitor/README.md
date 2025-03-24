# SSH Log Monitor (gRPC + Go)

A Linux-compatible Go application that monitors `/var/log/auth.log` for SSH login attempts, geolocates the source IPs, and sends the results to a gRPC server.

---

## 📦 Features

- Monitors SSH failed login attempts in `/var/log/auth.log`
- Extracts attacker IP addresses
- Geolocates IPs using `ip-api.com`
- Sends structured logs to a gRPC server
- Remembers the last processed line via an offset file
- Can be run manually, as a cron job, or as a background service

---

## 📁 Project Structure

```
ssh-log-monitor/
├── geo/             # Geolocation lookup code
├── grpcclient/      # gRPC client logic
├── parser/          # SSH log parsing logic
├── state/           # Offset tracking
├── proto/           # Proto definition and generated gRPC files
├── main.go          # Main application entry point
├── go.mod / go.sum  # Module definitions
```

---

## 🚀 Requirements

- Go 1.20+ (recommended)
- `protoc` compiler
- Ubuntu (or any Linux system with `/var/log/auth.log`)

---

## 🛠 Setup Instructions

### 1. Clone the repo and enter the folder

```bash
git clone https://github.com/zuyd-projects/cyber-scope/ssh-log-monitor.git
cd ssh-log-monitor
```

### 2. Install dependencies

```bash
go mod tidy
```

### 3. Generate gRPC code (if not yet done)

```bash
protoc --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. proto/logs.proto
```

Make sure the `proto/` folder contains `logs.pb.go` and `logs_grpc.pb.go`.

---

## 🛠 Building the Binary

### ✅ For macOS (local dev test):

```bash
go build -o ssh-monitor
./ssh-monitor
```

### ✅ For Linux server:

```bash
GOOS=linux GOARCH=amd64 go build -o ssh-monitor
```

Copy to your Linux system:

```bash
scp ssh-monitor user@your-server:/home/user/
```

---

## ⚙️ Running the App

```bash
sudo ./ssh-monitor
```

It will:

- Read `/var/log/auth.log`
- Skip lines it already processed
- Geolocate any new IPs found
- Send them to your gRPC server
- Track progress in `offset.txt`

---

## 💡 gRPC Server Config (Expected)

Your gRPC server should expose:

```proto
service LogService {
    rpc SendLog (LogRequest) returns (LogResponse);
}
```

You must replace this line in `main.go` with your server IP:

```go
const grpcAddress = "https://grpc-cyberscope.rickokkersen.nl"
```

---

## 📌 Offset Tracking

A file called `offset.txt` is written in the same directory to keep track of the last-read line of the log. If deleted, parsing restarts from the top.

---

## Build and use new version

```bash
GOOS=linux GOARCH=amd64 go build -o ssh-monitor
scp ssh-monitor cyberscope@ubuntu.rickokkersen.nl:/home/cyberscope/
ssh cyberscope@ubuntu.rickokkersen.nl
sudo ./ssh-monitor
```

## 🛡️ Optional: Run as systemd service

Create a systemd unit file `/etc/systemd/system/ssh-monitor.service`:

```ini
[Unit]
Description=SSH Monitor
After=network.target

[Service]
ExecStart=/home/user/ssh-monitor
Restart=always
User=root
WorkingDirectory=/home/user

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reexec
sudo systemctl enable --now ssh-monitor
```

---

## 🧪 Testing

You can simulate a failed SSH login (from another machine or manually) and check if it gets picked up and sent to your gRPC backend.

Also check logs:

```bash
journalctl -u ssh-monitor.service -f
```

---

## 🧾 License

MIT — free for commercial and personal use.

---

## ✨ Credits

- Built with ❤️ using Go, gRPC, and `ip-api.com
