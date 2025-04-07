# -------------------- CONFIGURATIE --------------------

$logPath = "C:\Windows\System32\LogFiles\Firewall\pfirewall.log"
$interval = 60
$desktop = [Environment]::GetFolderPath("Desktop")
$outputLog = "$desktop\FirewallIPLog.txt"
$computerName = $env:COMPUTERNAME

# -------------------- LOGGING ACTIVEREN --------------------

Write-Host "Zet firewall logging aan..." -ForegroundColor Cyan

Set-NetFirewallProfile -Profile Domain,Public,Private `
    -LogAllowed true `
    -LogFileName $logPath `
    -LogMaxSizeKilobytes 4096

Write-Host "Firewall logging geactiveerd. Logbestand: $logPath" -ForegroundColor Green
Write-Host "IP-log wordt opgeslagen in: $outputLog`n" -ForegroundColor Green

# -------------------- HULPFUNCTIES --------------------

function Is-PublicIP {
    param ([string]$ip)
    return $ip -notmatch '^10\.|^192\.168\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^127\.|^169\.254\.|^224\.|^239\.|^255\.|^0\.|^fe80|^::|:ffff:'
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
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

            foreach ($ip in @($src, $dst)) {
                $type = if (Is-PublicIP $ip) { "Publiek" } else { "Lokaal" }
                $output = "$timestamp | Computer: $computerName | $action | $type IP: $ip"

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

# -------------------- HOOFDLUS --------------------

Write-Host "Monitoring gestart. Druk op Ctrl+C om te stoppen.`n" -ForegroundColor Green

while ($true) {
    Find-AllIPs
    Start-Sleep -Seconds $interval
}