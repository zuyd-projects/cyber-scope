# SSH Log Monitor

This repository contains a Bash script that monitors SSH login attempts on an Ubuntu system by analyzing `/var/log/auth.log` and sends the log data via gRPC to a remote backend (`grpc-cyberscope.rickokkersen.nl`).

## Features
- Monitors SSH login attempts (password and public key authentications)
- Sends log data via gRPC
- Runs as a background service using systemd
- Automatically starts on boot

## Requirements
- Ubuntu system with root access
- Go (`golang-go`) for installing `grpcurl`

## Installation

### 1️⃣ Install Dependencies
Update the package list and install Go:
```bash
sudo apt-get update && sudo apt-get -y install golang-go jq
```

### 2️⃣ Install `grpcurl`
Use the following method to install `grpcurl` properly:
```bash
export GO111MODULE=on

go mod init logmonitor

go mod download github.com/fullstorydev/grpcurl@v1.9.3

sudo mv ~/go/bin/grpcurl /usr/local/bin/
```
Verify installation:
```bash
grpcurl --version
```

### 3️⃣ Create the SSH Log Monitor Script
This script monitors SSH logins and sends logs via gRPC. It runs as a systemd service.

Run the following command to create the script:
```bash
nano /root/ssh_log_monitor.sh
```
Paste the following content:
```bash
#!/bin/bash

# Log file to monitor
LOG_FILE="/var/log/auth.log"
LAST_POS_FILE="/tmp/ssh_monitor_lastpos"

# gRPC server details
GRPC_SERVER="grpc-cyberscope.rickokkersen.nl"
DEVICE_ID="ubuntu-vm"

# Read last known log position
if [ -f "$LAST_POS_FILE" ]; then
    LAST_POS=$(cat "$LAST_POS_FILE")
else
    LAST_POS=0
fi

# Get new log lines
NEW_LINES=$(tail -n +$((LAST_POS+1)) "$LOG_FILE")

# Process and send logins
echo "$NEW_LINES" | while read -r line; do
    if [[ "$line" == *"Accepted password"* || "$line" == *"Accepted publickey"* ]]; then
        TIMESTAMP=$(date +%s)
        LOG_MSG=$(echo "$line" | jq -R -s '.')

        # Send to gRPC
        grpcurl -d '{
            "DeviceId": "'"$DEVICE_ID"'",
            "Log": '"$LOG_MSG"',
            "Timestamp": "'"$TIMESTAMP"'"
        }' -plaintext "$GRPC_SERVER" LogService.LogService/SendLog
    fi
done

# Save new log position
wc -l < "$LOG_FILE" > "$LAST_POS_FILE"
```

Make the script executable:
```bash
chmod +x /root/ssh_log_monitor.sh
```

### 4️⃣ Create a Systemd Service
Create a new systemd service file:
```bash
sudo nano /etc/systemd/system/ssh-log-monitor.service
```
Paste the following content:
```ini
[Unit]
Description=SSH Log Monitor
After=network.target

[Service]
ExecStart=/root/ssh_log_monitor.sh
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

### 5️⃣ Enable and Start the Service
Reload systemd, enable, and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ssh-log-monitor
sudo systemctl start ssh-log-monitor
```

Check the status of the service:
```bash
sudo systemctl status ssh-log-monitor
```

### 6️⃣ Logs & Debugging
To check if logs are being sent:
```bash
journalctl -u ssh-log-monitor -f
```

To restart the service:
```bash
sudo systemctl restart ssh-log-monitor
```

To stop the service:
```bash
sudo systemctl stop ssh-log-monitor
```

## Summary
- Monitors `/var/log/auth.log` for SSH login attempts
- Sends log entries via gRPC
- Runs as a systemd service
- Automatically starts on boot

This setup ensures that all SSH login attempts are logged and securely transmitted to the backend server. 🚀

