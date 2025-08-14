@echo off
echo.
echo ===============================================
echo    WINDOWS SERVICE SETUP - POLY PORTAL
echo ===============================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ This script requires Administrator privileges
    echo Right-click and select "Run as Administrator"
    pause
    exit /b 1
)

echo ✅ Running with Administrator privileges
echo.

REM Check if NSSM is available
nssm version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing NSSM (Non-Sucking Service Manager)...
    echo.
    
    REM Download NSSM if not available
    if not exist "nssm.exe" (
        echo Please download NSSM from: https://nssm.cc/download
        echo Extract nssm.exe to this folder and run again
        pause
        exit /b 1
    )
)

echo ✅ NSSM found
echo.

REM Stop and remove existing service
echo 🛑 Removing any existing service...
nssm stop PolyStudyPortal 2>nul
nssm remove PolyStudyPortal confirm 2>nul

REM Install new service
echo 🚀 Installing Poly Study Portal as Windows Service...
set SERVICE_PATH=%~dp0server.js
set NODE_PATH=%ProgramFiles%\nodejs\node.exe

if not exist "%NODE_PATH%" (
    set NODE_PATH=node.exe
)

nssm install PolyStudyPortal "%NODE_PATH%" "%SERVICE_PATH%"
nssm set PolyStudyPortal AppDirectory "%~dp0"
nssm set PolyStudyPortal DisplayName "Polytechnic Study Portal"
nssm set PolyStudyPortal Description "Educational portal backend server"
nssm set PolyStudyPortal Start SERVICE_AUTO_START
nssm set PolyStudyPortal AppStdout "%~dp0logs\service.log"
nssm set PolyStudyPortal AppStderr "%~dp0logs\service_error.log"
nssm set PolyStudyPortal AppRotateFiles 1
nssm set PolyStudyPortal AppRotateOnline 1
nssm set PolyStudyPortal AppRotateBytes 1048576

REM Create logs directory
if not exist "logs" mkdir logs

REM Start the service
echo 🔄 Starting service...
nssm start PolyStudyPortal

if %errorlevel% equ 0 (
    echo.
    echo ✅ Service installed and started successfully!
    echo.
    echo 📋 Service Details:
    echo    Name: PolyStudyPortal
    echo    Status: Running
    echo    Startup: Automatic
    echo    Logs: %~dp0logs\
    echo.
    echo 🌐 Portal URL: http://localhost:3000
    echo.
    echo 💡 Service Management:
    echo    Start:   nssm start PolyStudyPortal
    echo    Stop:    nssm stop PolyStudyPortal
    echo    Restart: nssm restart PolyStudyPortal
    echo    Remove:  nssm remove PolyStudyPortal
    echo.
    echo 🎉 Server will now start automatically with Windows!
) else (
    echo ❌ Failed to start service!
    echo Check logs in: %~dp0logs\
)

echo.
pause
