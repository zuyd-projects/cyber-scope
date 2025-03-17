#!/bin/bash

set -e  # Exit on error

echo "Updating system and installing dependencies..."
sudo apt-get update && sudo apt-get -y install golang-go jq

echo "Installing grpcurl..."
# TODO: cant seem to install grpcurl using any of the methods below
#FIXME: METHOD 1(https://github.com/fullstorydev/grpcurl) 
# go get github.com/fullstorydev/grpcurl/cmd/grpcurl@latest 
#FIXME: METHOD 2(https://stackoverflow.com/questions/54415733/getting-gopath-error-go-cannot-use-pathversion-syntax-in-gopath-mode-in-ubun)
#  go get github.com/fullstorydev/grpcurl@v1.9.3
#FIXME: METHOD 3(https://stackoverflow.com/questions/54415733/getting-gopath-error-go-cannot-use-pathversion-syntax-in-gopath-mode-in-ubun)
# export GO111MODULE=on
# go mod init logmonitor
# go mod download github.com/fullstorydev/grpcurl@v1.9.3


sudo mv ~/go/bin/grpcurl /usr/local/bin/

echo "Creating SSH log monitor script..."
cat << 'EOF' | sudo tee /root/ssh_log_monitor.sh > /dev/null
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

[Install]
WantedBy=multi-user.target
EOF

echo "Reloading systemd, enabling, and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable ssh-log-monitor
sudo systemctl start ssh-log-monitor

echo "Installation complete. SSH log monitor is now running!"