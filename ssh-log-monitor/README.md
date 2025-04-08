# SSH Log Monitor (gRPC + Go)

A Linux-compatible Go application that monitors `/var/log/auth.log` for SSH login attempts and sends the results to a gRPC server.

---

## 📦 Features

- Monitors SSH login attempts in `/var/log/auth.log`
- Extracts source IP addresses (from failed or accepted attempts)
- Sends structured logs to a gRPC backend via TLS
- Tracks last-read log position using an offset file
- Lightweight and cron-compatible
- Installable in 1 command using `curl`

---

## 📁 Project Structure

```
ssh-log-monitor/
├── grpcclient/      # gRPC client logic
├── parser/          # SSH log parsing logic
├── state/           # Offset tracking
├── proto/           # Proto definition and generated gRPC files
├── main.go          # Main application entry point
├── install.sh       # Auto-install script
├── go.mod / go.sum  # Go module files
```

## 🚀 Quick Install (no build needed)

You can install the binary and set up everything (cron, logs, offset) in **one command**:

```bash
curl -sSL https://raw.githubusercontent.com/zuyd-projects/cyber-scope/main/ssh-log-monitor/install.sh | sudo bash
```

This will:

- Download the latest `ssh-monitor` binary from GitHub Releases
- Install it to `/usr/local/bin/ssh-monitor`
- Set up a cron job to run it every 5 minutes
- Log output to `/var/log/ssh-monitor.log`
- Track progress in `/var/lib/ssh-monitor/offset.txt`

---

## 🛠 Manual Build Instructions (Dev)

### 1. Clone the repo

```bash
git clone https://github.com/zuyd-projects/cyber-scope.git
cd cyber-scope/ssh-log-monitor
```

### 2. Install dependencies

```bash
go mod tidy
```

### 3. Generate gRPC code (if needed)

```bash
protoc --go_out=paths=source_relative:. --go-grpc_out=paths=source_relative:. proto/cyberscope.proto
```

### 4. Build for your platform

#### For Linux (server)

```bash
GOOS=linux GOARCH=amd64 go build -o ssh-monitor
```

#### Send the binary to your server

```bash
 scp ssh-monitor cyberscope@ubuntu.rickokkersen.nl:/home/cyberscope/
```

#### For macOS (local testing)

```bash
go build -o ssh-monitor
```

---

## ⚙️ Manual Execution

```bash
sudo ./ssh-monitor
```

It will:

- Parse `/var/log/auth.log`
- Skip previously seen lines (based on offset)
- Extract IPs from SSH login attempts
- Send logs to the gRPC server defined in `main.go`

---

## 🕒 Automatisch uitvoeren met Cron

Om de SSH-monitor automatisch elke 5 minuten te laten draaien, wordt tijdens installatie deze cronregel toegevoegd:

```cron
*/5 * * * * /usr/local/bin/ssh-monitor >> /var/log/ssh-monitor.log 2>&1
```

Bekijk live de logoutput met:

```bash
tail -f /var/log/ssh-monitor.log
```

---

## 🧾 License

MIT — free for commercial and personal use.

---

## ✨ Credits

- Built with ❤️ using Go, gRPC, and system-level Linux logs.
