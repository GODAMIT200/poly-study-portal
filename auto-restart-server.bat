@echo off
title Poly Study Portal - Auto Restart Server
color 0A
echo.
echo ================================================
echo    POLY STUDY PORTAL - AUTO RESTART SERVER
echo ================================================
echo.
echo 🔄 Server will automatically restart if it crashes
echo 🚀 Server will start on system boot (optional)
echo 💡 Close this window to stop the server
echo.

:start_server
echo.
echo [%date% %time%] 🚀 Starting Poly Study Portal Server...
echo.

REM Start server and capture exit code
node server.js
set exit_code=%errorlevel%

echo.
echo [%date% %time%] ⚠️ Server stopped with exit code: %exit_code%

REM If server crashed (exit code not 0), restart it
if %exit_code% neq 0 (
    echo [%date% %time%] 🔄 Server crashed! Restarting in 3 seconds...
    timeout /t 3 /nobreak >nul
    goto start_server
) else (
    echo [%date% %time%] ✅ Server stopped normally
    echo Press any key to restart, or close window to exit
    pause >nul
    goto start_server
)

pause
