@echo off
title Poly Study Portal - Server Management
color 0B
cls

:menu
echo.
echo ===============================================
echo     POLY STUDY PORTAL - SERVER MANAGEMENT
echo ===============================================
echo.
echo Choose your server startup method:
echo.
echo 1. 🔄 Auto-Restart Server (Simple)
echo 2. 🚀 PM2 Process Manager (Recommended)
echo 3. 🖥️ Windows Service (Professional)
echo 4. 💻 Development Mode (Nodemon)
echo 5. 📊 Check Server Status
echo 6. 🛑 Stop All Servers
echo 7. 📖 Help Guide
echo 8. ❌ Exit
echo.
set /p choice="Enter your choice (1-8): "

if "%choice%"=="1" goto auto_restart
if "%choice%"=="2" goto pm2_setup
if "%choice%"=="3" goto service_setup
if "%choice%"=="4" goto dev_mode
if "%choice%"=="5" goto check_status
if "%choice%"=="6" goto stop_all
if "%choice%"=="7" goto help_guide
if "%choice%"=="8" goto exit
goto invalid

:auto_restart
echo.
echo 🔄 Starting Auto-Restart Server...
call auto-restart-server.bat
goto menu

:pm2_setup
echo.
echo 🚀 Setting up PM2 Process Manager...
call setup-pm2.bat
goto menu

:service_setup
echo.
echo 🖥️ Installing Windows Service...
echo Note: This requires Administrator privileges
pause
call install-windows-service.bat
goto menu

:dev_mode
echo.
echo 💻 Starting Development Mode...
npm run dev
goto menu

:check_status
echo.
echo 📊 Checking Server Status...
echo.
echo PM2 Processes:
pm2 list 2>nul
echo.
echo Windows Services:
sc query PolyStudyPortal 2>nul
echo.
echo Port 3000 Status:
netstat -an | find ":3000"
echo.
pause
goto menu

:stop_all
echo.
echo 🛑 Stopping All Servers...
echo.
echo Stopping PM2 processes...
pm2 stop all 2>nul
echo Stopping Windows service...
net stop PolyStudyPortal 2>nul
echo Killing port 3000 processes...
npx kill-port 3000 2>nul
echo.
echo ✅ All servers stopped
pause
goto menu

:help_guide
echo.
echo 📖 Opening Help Guide...
start SERVER-AUTO-START-GUIDE.md
goto menu

:invalid
echo.
echo ❌ Invalid choice! Please enter 1-8
timeout /t 2 >nul
goto menu

:exit
echo.
echo 👋 Goodbye!
timeout /t 1 >nul
exit
