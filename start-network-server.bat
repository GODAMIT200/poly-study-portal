@echo off
echo.
echo ========================================
echo    POLY STUDY PORTAL - NETWORK SHARING
echo ========================================
echo.

REM Get local IP address
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| find "IPv4"') do set IP=%%i
set IP=%IP: =%

echo 🌐 Starting server for network access...
echo.
echo 📋 Access URLs:
echo    • Local: http://localhost:3000
echo    • Network: http://%IP%:3000
echo    • Mobile: http://%IP%:3000
echo.
echo 📱 Mobile से access करने के लिए:
echo    Same WiFi network पर होना चाहिए
echo    Phone browser में: http://%IP%:3000
echo.
echo 🔒 Admin Login: admin / admin123
echo 👨‍🎓 Student Login: student / student123
echo.
echo Press Ctrl+C to stop server
echo.

node server.js

pause
