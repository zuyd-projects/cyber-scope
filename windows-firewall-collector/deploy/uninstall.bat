@echo off
:: Check if the script is running with administrator privileges
NET SESSION >nul 2>nul
if %errorlevel% NEQ 0 (
    echo This script requires administrator privileges.

    pause
    exit /b
)

:: If running as administrator, execute the PowerShell script
set INSTALL_PATH=%ProgramFiles%\CyberScope\FirewallCollector
set NSSM_PATH=%INSTALL_PATH%\nssm.exe
set SERVICE_NAME=CyberscopeFirewallCollector

:: Check if the service exists
sc qc %SERVICE_NAME% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Stopping and removing service "%SERVICE_NAME%"...
    
    :: Stop and remove the service using NSSM
    "%NSSM_PATH%" stop %SERVICE_NAME% confirm
    "%NSSM_PATH%" remove %SERVICE_NAME% confirm

    echo Service "%SERVICE_NAME%" stopped and removed.
) else (
    echo Service "%SERVICE_NAME%" is not installed.
)

:: Remove files and installation directory
echo Removing installation files from "%INSTALL_PATH%"...
rmdir /s /q "%INSTALL_PATH%"
echo Installation directory removed.

echo Firewall Collector service uninstalled and files removed.
pause