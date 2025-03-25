#!/bin/bash

set -e

BINARY_NAME="ssh-monitor"
INSTALL_PATH="/usr/local/bin/$BINARY_NAME"
LOG_PATH="/var/log/ssh-monitor.log"
OFFSET_PATH="/var/lib/ssh-monitor/offset.txt"
CRON_LINE="*/5 * * * * $INSTALL_PATH >> $LOG_PATH 2>&1"

echo "📦 Installing SSH Monitor..."

# 1. Copy binary
if [ ! -f "./$BINARY_NAME" ]; then
  echo "❌ Binary '$BINARY_NAME' not found in current directory!"
  exit 1
fi

sudo cp ./$BINARY_NAME $INSTALL_PATH
sudo chmod +x $INSTALL_PATH
echo "✅ Copied binary to $INSTALL_PATH"

# 2. Create offset storage dir
sudo mkdir -p $(dirname "$OFFSET_PATH")
sudo touch "$OFFSET_PATH"
echo "✅ Created offset file at $OFFSET_PATH"

# 3. Create log file
sudo touch "$LOG_PATH"
sudo chmod 664 "$LOG_PATH"
echo "✅ Log file ready at $LOG_PATH"

# 4. Add cron job (idempotent)
( crontab -l 2>/dev/null | grep -v "$BINARY_NAME" ; echo "$CRON_LINE" ) | crontab -
echo "✅ Cron job added to run every 5 minutes"

echo "🎉 SSH Monitor installed and running via cron!"