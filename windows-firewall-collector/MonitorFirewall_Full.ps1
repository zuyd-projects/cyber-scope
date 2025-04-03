# -------------------- DEVICE ID CHECK --------------------

$registryPath = "HKLM:\SOFTWARE\CyberscopeAnalyzer"
$deviceKeyName = "DeviceKey"

# Kijk of de key bestaat
if (-Not (Test-Path $registryPath)) {
    New-Item -Path $registryPath -Force | Out-Null
}

$deviceKey = Get-ItemProperty -Path $registryPath -Name $deviceKeyName -ErrorAction SilentlyContinue | Select-Object -ExpandProperty $deviceKeyName -ErrorAction SilentlyContinue

if (-not $deviceKey) {
    # Genereer een nieuwe DeviceKey in het formaat xxxx-xxxx-xxxx-xxxx
    $deviceKey = -join ((1..4) | ForEach-Object { -join ((1..4) | ForEach-Object { Get-Random -Minimum 0 -Maximum 10 }) }) -replace '(.{4})(?=.)', '$1-'
    Set-ItemProperty -Path $registryPath -Name $deviceKeyName -Value $deviceKey
    Write-Host "Nieuw DeviceKey gegenereerd: $deviceKey" -ForegroundColor Cyan
} else {
    Write-Host "Bestaande DeviceKey gevonden: $deviceKey" -ForegroundColor Cyan
}

# -------------------- CONFIGURATIE --------------------

$logPath = "C:\Windows\System32\LogFiles\Firewall\pfirewall.log"
$interval = 60
$desktop = [Environment]::GetFolderPath("Desktop")
$outputLog = "$desktop\FirewallIPLog.txt"

# -------------------- LOGGING ACTIVEREN --------------------

Write-Host "Zet firewall logging aan..." -ForegroundColor Cyan

Set-NetFirewallProfile -Profile Domain,Public,Private `
    -LogAllowed true `
    -LogFileName $logPath `
    -LogMaxSizeKilobytes 4096

Write-Host "Firewall logging geactiveerd. Logbestand: $logPath" -ForegroundColor Green
Write-Host "IP-log wordt opgeslagen in: $outputLog`n" -ForegroundColor Green

# -------------------- HULPFUNCTIES --------------------

$ipCounts = @{}

function Is-PublicIP {
    param ([string]$ip)
    return $ip -notmatch '^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^127\.|^169\.254\.|^224\.|^239\.|^255\.|^0\.|^fe80|^::|:ffff:'
}

function Get-IPLocation($ip) {
    if ($ip -match ':') {
        try {
            $response = Invoke-RestMethod -Uri "http://ip-api.com/json/$ip" -ErrorAction Stop
            return "$($response.country), $($response.regionName), $($response.city)"
        } catch {
            return "IPv6-adres, locatie onbekend"
        }
    }

    if (Is-PublicIP $ip) {
        try {
            $response = Invoke-RestMethod -Uri "http://ip-api.com/json/$ip" -ErrorAction Stop
            return "$($response.country), $($response.regionName), $($response.city)"
        }
        catch {
            return "Locatie niet gevonden"
        }
    } else {
        return "Lokaal IP-adres"
    }
}

function Find-AllIPs {
    if (-Not (Test-Path $logPath)) {
        Write-Warning "Logbestand niet gevonden: $logPath"
        return
    }

    Get-Content $logPath -Tail 200 | ForEach-Object {
        if ($_ -match '(ALLOW|DROP)\s+\w+\s+([\da-fA-F\.:]+)\s+([\da-fA-F\.:]+)') {
            $action = $matches[1]
            $src = $matches[2]
            $dst = $matches[3]

            foreach ($ip in @($src, $dst)) {
                if ($ipCounts.ContainsKey($ip)) {
                    $ipCounts[$ip]++
                } else {
                    $ipCounts[$ip] = 1
                    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                    $location = Get-IPLocation $ip
                    $type = if (Is-PublicIP $ip) { "Publiek" } else { "Lokaal" }
                    $output = "$timestamp | DeviceKey: $deviceKey | $action | Nieuw $type IP: $ip (Aantal: $($ipCounts[$ip])) => $location"

                    if ($action -eq "DROP") {
                        Write-Host $output -ForegroundColor Red
                    } else {
                        Write-Host $output -ForegroundColor Yellow
                    }

                    Add-Content -Path $outputLog -Value $output
                }
            }
        }
    }
}

# -------------------- HOOFDLUS --------------------

Write-Host "Monitoring gestart. Druk op Ctrl+C om te stoppen.`n" -ForegroundColor Green

while ($true) {
    Find-AllIPs
    Start-Sleep -Seconds $interval
}