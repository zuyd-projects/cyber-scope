#!/bin/bash

set -e  # Exit on error

echo "Updating system and installing dependencies..."
sudo apt-get update && sudo apt-get -y install golang-go jq wget

echo "Installing grpcurl..."
# Download precompiled binary instead of using 'go install'
wget -q https://github.com/fullstorydev/grpcurl/releases/latest/download/grpcurl-linux-amd64 -O grpcurl
chmod +x grpcurl
sudo mv grpcurl /usr/local/bin/

echo "Creating SSH log monitor script..."
cat << 'EOF' | sudo tee /root/ssh_log_monitor.sh > /dev/null
#!/bin/bash

# Log file to monitor
LOG_FILE="/var/log/auth.log"
LAST_POS_FILE="/tmp/ssh_monitor_lastpos"

# gRPC server details
GRPC_SERVER="grpc-cyberscope.rickokkersen.nl"
DEVICE_ID="ubuntu-vm"

# Ensure log file exists before proceeding
if [ ! -f "$LOG_FILE" ]; then
    echo "Log file not found: $LOG_FILE"
    exit 1
fi

# Read last known log position (fallback to start of file)
if [ -f "$LAST_POS_FILE" ]; then
    LAST_POS=$(cat "$LAST_POS_FILE")
else
    LAST_POS=0
fi

# Get new log lines, ensuring compatibility with rotated logs
NEW_LINES=$(tail -n +$((LAST_POS+1)) "$LOG_FILE" 2>/dev/null || tail -n 50 "$LOG_FILE")

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
EOF

echo "Making script executable..."
sudo chmod +x /root/ssh_log_monitor.sh

echo "Creating systemd service..."
cat << 'EOF' | sudo tee /etc/systemd/system/ssh-log-monitor.service > /dev/null
[Unit]
Description=SSH Log Monitor
After=network.target

[Service]
ExecStart=/root/ssh_log_monitor.sh
Restart=always
User=root
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ssh-log-monitor

[Install]
WantedBy=multi-user.target
EOF

echo "Reloading systemd, enabling, and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable ssh-log-monitor
sudo systemctl start ssh-log-monitor

echo "Installation complete. SSH log monitor is now running!"

# Check status
sudo systemctl status ssh-log-monitor --no-pager