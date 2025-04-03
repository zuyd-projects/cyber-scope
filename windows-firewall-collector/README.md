Here’s a professional and informative README.md file for your PowerShell script:

⸻

🔐 Firewall IP Monitor Script

This PowerShell script enables Windows Firewall logging and continuously monitors the firewall log file for network activity. It identifies unique source and destination IP addresses (both IPv4 and IPv6), determines their public/private status, and retrieves geolocation data. All newly discovered IPs are logged with timestamps and action types (ALLOW or DROP).

⸻

📦 Features
	•	✅ Unique Device ID Generation
Generates and stores a persistent DeviceKey in the Windows Registry.
	•	🔥 Enables Firewall Logging
Automatically configures Windows Firewall to log allowed and dropped connections.
	•	🌍 Public/Private IP Classification
Detects whether an IP is public or private (e.g., internal network).
	•	🛰️ Geolocation Lookup
Queries ip-api.com to fetch country, region, and city for public IP addresses.
	•	📊 Real-Time Monitoring
Continuously monitors the firewall log and reports newly seen IPs.
	•	📝 Logging to File
Outputs activity to FirewallIPLog.txt on the user’s Desktop.

⸻

⚙️ How It Works
	1.	DeviceKey Check
	•	If a DeviceKey doesn’t exist in the registry, a new one is generated and stored.
	•	Format: xxxx-xxxx-xxxx-xxxx
	2.	Firewall Logging Configuration
	•	Activates logging for all profiles (Domain, Public, Private).
	•	Sets log file location:
C:\Windows\System32\LogFiles\Firewall\pfirewall.log
	3.	Log Monitoring Loop
	•	Reads the last 200 lines of the firewall log.
	•	Extracts source and destination IPs.
	•	Checks whether each IP is new.
	•	Determines location using a public API.
	•	Displays output to the console with color coding:
	•	🔴 Red for dropped connections
	•	🟡 Yellow for allowed connections
	•	Logs all new IPs to a file.

⸻

🛠️ Requirements
	•	Administrator privileges
	•	PowerShell 5.0+
	•	Internet connection (for geolocation API)

⸻

🗂️ Output File
	•	Location: Desktop\FirewallIPLog.txt
	•	Format:

2025-04-03 13:37:42 | DeviceKey: 1234-5678-9012-3456 | ALLOW | Nieuw Publiek IP: 8.8.8.8 (Aantal: 1) => United States, California, Mountain View



⸻

🚀 Running the Script
	1.	Open PowerShell as Administrator.
	2.	Execute the script:

.\Monitor-Firewall.ps1


	3.	Press Ctrl+C to stop monitoring.

⸻

❗ Notes
	•	Make sure firewall logging is not disabled by Group Policy.
	•	IPv6 geolocation may be limited or less reliable.
	•	All logs are stored locally; no sensitive data is transmitted.