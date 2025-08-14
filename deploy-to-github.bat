@echo off
echo.
echo ==========================================
echo    GITHUB DEPLOYMENT - POLY STUDY PORTAL
echo ==========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed!
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git found
echo.

REM Initialize git if not already done
if not exist ".git" (
    echo 📦 Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo 📁 Adding files to Git...
git add .
echo.

REM Commit changes
echo 💾 Committing changes...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Polytechnic Study Portal - Initial Commit

git commit -m "%commit_message%"
echo.

REM GitHub repository setup
echo 🌐 GitHub Repository Setup
echo.
echo Please follow these steps:
echo.
echo 1. Go to https://github.com/new
echo 2. Create a new repository named: poly-study-portal
echo 3. Do NOT initialize with README (we already have files)
echo 4. Copy the repository URL
echo.
set /p repo_url="Paste your GitHub repository URL here: "

if "%repo_url%"=="" (
    echo ❌ Repository URL is required!
    pause
    exit /b 1
)

REM Add remote origin
echo 🔗 Adding remote repository...
git remote remove origin 2>nul
git remote add origin %repo_url%
echo.

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ Successfully uploaded to GitHub!
    echo.
    echo 🌐 Next Steps for Cloud Deployment:
    echo.
    echo 📋 VERCEL DEPLOYMENT:
    echo    1. Go to https://vercel.com/new
    echo    2. Import your GitHub repository
    echo    3. Deploy automatically
    echo.
    echo 📋 NETLIFY DEPLOYMENT:
    echo    1. Go to https://netlify.com/
    echo    2. Connect GitHub repository
    echo    3. Auto-deploy setup
    echo.
    echo 📋 RAILWAY DEPLOYMENT:
    echo    1. Go to https://railway.app/
    echo    2. Deploy from GitHub
    echo    3. Environment variables setup
    echo.
    echo Your repository: %repo_url%
) else (
    echo ❌ Failed to push to GitHub!
    echo Check your repository URL and try again.
)

echo.
pause
