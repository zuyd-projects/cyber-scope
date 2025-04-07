# install.ps1
$installPath = "$Env:ProgramFiles\CyberScope\FirewallCollector" # C:\Program Files\CyberScope\FirewallCollector\
$nssmPath = "$installPath\nssm.exe"
$scriptPath = "$installPath\MonitorFirewall_Full.ps1"
$serviceName = "CyberscopeFirewallCollector"

# Check if service is already installed
$serviceInstalled = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if ($serviceInstalled) {
    Write-Host "Service '$serviceName' is already installed. Removing old service..."
    
    # Stop and remove the old service
    & $nssmPath stop $serviceName confirm
    & $nssmPath remove $serviceName confirm

    # Optionally, remove the old installation directory
    Remove-Item -Path $installPath -Recurse -Force
    Write-Host "Old service removed and installation directory cleaned."
}

# Ensure the installation directory exists (even if we cleaned up the old version)
if (-not (Test-Path $installPath)) {
    New-Item -ItemType Directory -Path $installPath -Force
}

# Copy script files to the install directory (fresh copy)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Copy-Item "$scriptDir\*" -Destination $installPath -Recurse -Force

# Register the service with NSSM
Write-Host "Installing fresh version of service..."
& $nssmPath install $serviceName "powershell.exe" "-ExecutionPolicy Bypass -File `"$scriptPath`""
& $nssmPath set $serviceName Start SERVICE_AUTO_START

# Start the new service
& $nssmPath start $serviceName

Write-Host "Service '$serviceName' installed and running."

# Generate uninstall script
$uninstallScript = @"
# Uninstall script for CyberScope Firewall Collector

# Stop and remove the service
& '$nssmPath' stop $serviceName confirm
& '$nssmPath' remove $serviceName confirm

# Remove files from Program Files
Remove-Item -Path '$installPath' -Recurse -Force

Write-Host 'Firewall Collector service uninstalled and files removed.'
"@

# Save the uninstall script in the install directory
$uninstallScript | Set-Content "$installPath\uninstall.ps1"

Write-Host "Uninstall script created at $installPath\uninstall.ps1"