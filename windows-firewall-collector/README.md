🔐 Firewall IP Monitor Script

This PowerShell script enables Windows Firewall logging and continuously monitors the firewall log file for network activity. It identifies source and destination IP addresses (IPv4 and IPv6), determines whether they’re public or private, and logs all activity with timestamps, connection actions (ALLOW or DROP), and the local computer name.

⸻

📦 Features
	•	✅ Automatic Computer Name Identification
Uses the computer’s name ($env:COMPUTERNAME) to tag log entries.
	•	🔥 Enables Firewall Logging
Automatically activates logging for all firewall profiles (Domain, Private, Public).
	•	🌐 Public/Private IP Classification
Distinguishes between public IPs (e.g., internet addresses) and private/local network IPs.
	•	📊 Real-Time Monitoring
Continuously watches the firewall log and outputs newly detected IPs in real time.
	•	📝 Logs to File
Writes all relevant activity to a log file located on the user’s Desktop.

⸻

⚙️ How It Works
	1.	Firewall Logging Configuration
	•	Enables firewall logging for allowed and dropped connections.
	•	Log location:
C:\Windows\System32\LogFiles\Firewall\pfirewall.log
	2.	Monitoring Loop
	•	Reads the last 200 lines of the firewall log repeatedly.
	•	Extracts source and destination IPs.
	•	Determines whether each IP is public or private.
	•	Logs each IP with a timestamp, action type (ALLOW or DROP), IP classification, and the computer name.
	3.	Color-Coded Console Output
	•	🔴 Red for dropped connections
	•	🟡 Yellow for allowed connections

⸻

🛠️ Requirements
	•	⚠️ Administrator privileges
	•	💻 PowerShell 5.0 or higher
	•	❌ No internet connection required

⸻

🗂️ Output File
	•	Location:
Desktop\FirewallIPLog.txt
	•	Format Example:

2025-04-07 09:15:32 | Computer: MY-PC | DROP | Public IP: 8.8.8.8



⸻

🚀 Running the Script
	1.	Open PowerShell as Administrator.
	2.	Navigate to the script’s location.
	3.	Run the script:

.\MonitorFirewall.ps1


	4.	Press Ctrl + C to stop monitoring.

⸻

❗ Notes
	•	Make sure firewall logging is not restricted by Group Policy.
	•	The script only reads the last 200 log entries each cycle for performance.
	•	All log data is stored locally and does not leave the system.

⸻



dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o ./publish

