@echo off
:: Check if the script is running with administrator privileges
NET SESSION >nul 2>nul
if %errorlevel% NEQ 0 (
    echo This script requires administrator privileges.

    pause
    exit /b
)

:: If running as administrator, execute the script
@echo off
:: Define variables for the installation path and service name
set INSTALL_PATH=%ProgramFiles%\Cyberscope\FirewallCollector
set NSSM_PATH=%INSTALL_PATH%\nssm.exe
set SCRIPT_PATH=run.ps1
set SERVICE_NAME=CyberscopeFirewallCollector

:: Check if the service is already installed
sc qc %SERVICE_NAME% >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Service "%SERVICE_NAME%" is already installed. Removing old service...
    
    :: Stop and remove the old service
    "%NSSM_PATH%" stop %SERVICE_NAME% confirm
    "%NSSM_PATH%" remove %SERVICE_NAME% confirm

    :: Optionally, remove the old installation directory
    rmdir /s /q "%INSTALL_PATH%"
    echo Old service removed and installation directory cleaned.
)

:: Ensure the installation directory exists
if not exist "%INSTALL_PATH%" (
    mkdir "%INSTALL_PATH%"
)

:: Copy script files to the install directory
xcopy /s /y "%~dp0*" "%INSTALL_PATH%"

:: Register the service with NSSM
echo Installing fresh version of service...
"%NSSM_PATH%" install %SERVICE_NAME% "powershell.exe" "-ExecutionPolicy Bypass -File %SCRIPT_PATH%"
"%NSSM_PATH%" set %SERVICE_NAME% Start SERVICE_AUTO_START
"%NSSM_PATH%" set %SERVICE_NAME% AppDirectory %INSTALL_PATH%

:: Start the new service
"%NSSM_PATH%" start %SERVICE_NAME%

echo Service "%SERVICE_NAME%" installed and running.
pause