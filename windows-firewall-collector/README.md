# 🔐 Windows Firewall IP Monitor

A PowerShell script to enable Windows Firewall logging and monitor network activity in real time. It identifies source and destination IPs, classifies them as public or private, and logs all activity with timestamps, connection actions (ALLOW or DROP), and the local computer name.

---

## 📦 Features
- **Automatic Computer Name Identification**  
  Tags log entries with the computer’s name (`$env:COMPUTERNAME`).
- **Firewall Logging Activation**  
  Enables logging for all firewall profiles (Domain, Private, Public).
- **Public/Private IP Classification**  
  Differentiates between public internet IPs and private/local network IPs.
- **Real-Time Monitoring**  
  Continuously monitors the firewall log for new activity.
- **File Logging**  
  Saves all activity to a log file on the user’s Desktop.

---

## ⚙️ How It Works
1. **Firewall Logging Configuration**  
   - Enables logging for allowed and dropped connections.  
   - Log file location:  
     `C:\Windows\System32\LogFiles\Firewall\pfirewall.log`
2. **Monitoring Loop**  
   - Reads the last 200 lines of the firewall log repeatedly.  
   - Extracts source and destination IPs.  
   - Classifies IPs as public or private.  
   - Logs each entry with a timestamp, action type (ALLOW or DROP), IP classification, and computer name.
3. **Color-Coded Console Output**  
   - 🔴 Red: Dropped connections  
   - 🟡 Yellow: Allowed connections  

---

## 🛠️ Requirements
- **Administrator Privileges**  
- **PowerShell 5.0 or Higher**  
- **No Internet Connection Required**

---

## 🗂️ Output File
- **Location**:  
  `Desktop\FirewallIPLog.txt`
- **Example Format**:  
  ```
  2025-04-07 09:15:32 | Computer: MY-PC | DROP | Public IP: 8.8.8.8
  ```

---

## 🚀 Running the Script
1. Open PowerShell as Administrator.
2. Navigate to the script’s directory.
3. Run the script:  
   ```powershell
   .\MonitorFirewall.ps1
   ```
4. Press `Ctrl + C` to stop monitoring.

---

## ❗ Notes
- Ensure firewall logging is not restricted by Group Policy.
- The script reads only the last 200 log entries per cycle for performance.
- All log data is stored locally and does not leave the system.

---

## 📦 Build Instructions (Optional)
To publish the script as a standalone executable:
```bash
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./publish

# 🚀 Deployment Scripts for Windows Firewall Collector

This folder contains scripts to install, run, and uninstall the Windows Firewall Collector service.

---

## 📂 Scripts Overview

### 1. `install.bat`
- **Purpose**: Installs the Firewall Collector as a Windows service.
- **Usage**:
  1. Run the script as an administrator.
  2. It will:
     - Copy necessary files to the installation directory (`%ProgramFiles%\CyberScope\FirewallCollector`).
     - Register the service using `nssm.exe`.
     - Start the service automatically.

### 2. `run.ps1`
- **Purpose**: Executes the Firewall Collector script to monitor and log firewall activity.
- **Usage**:
  1. This script is executed by the installed service.
  2. It enables firewall logging, monitors the log file, and sends public IP activity to the gRPC client.

### 3. `uninstall.bat`
- **Purpose**: Uninstalls the Firewall Collector service and removes all associated files.
- **Usage**:
  1. Run the script as an administrator.
  2. It will:
     - Stop and remove the service.
     - Delete the installation directory and all files.

---

## ⚠️ Notes
- **Administrator Privileges**: All scripts require administrator privileges to execute.
- **Dependencies**:
  - `nssm.exe` is used to manage the Windows service.
  - Ensure `run.ps1` and `GrpcClient.exe` are present in the same directory as the scripts.
- **Service Name**: The service is registered as `CyberscopeFirewallCollector`.

---

## 🛠️ Example Usage

### Install the Service
```cmd
cd deploy
install.bat
```

### Uninstall the Service
```cmd
cd deploy
uninstall.bat
```

### Manually Run the Script
```powershell
cd deploy
.\run.ps1
```
