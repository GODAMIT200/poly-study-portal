@echo off
echo.
echo =====================================================
echo    POLY STUDY PORTAL - BACKEND SERVER STARTUP
echo =====================================================
echo.
echo 🚀 Starting Polytechnic Study Portal...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    echo This may take a few minutes...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully!
    echo.
)

echo 🔧 Starting server...
echo.
echo 📋 Server Information:
echo    • Frontend: http://localhost:3000
echo    • Backend API: http://localhost:3000/api
echo    • Admin Login: AMIT@POLY / AMIT@POLY
echo    • Student Login: STUDENT@POLY / POLY@1122
echo.
echo 💡 Server will auto-open in browser
echo    Press Ctrl+C to stop the server
echo.

REM Start the server
start http://localhost:3000/login.html
node server.js

pause
