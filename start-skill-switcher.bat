@echo off
setlocal enabledelayedexpansion
title Skill Switcher Hub - Launcher

:: Determine project directory
set "PROJECT_DIR=%~dp0"
if "%PROJECT_DIR:~-1%"=="\" set "PROJECT_DIR=%PROJECT_DIR:~0,-1%"

echo =====================================================================
echo           SKILL SWITCHER - AI AGENT AND TOKEN HUB
echo =====================================================================
echo.

:: Check if port 7891 is already in use
netstat -ano | findstr ":7891 " >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Skill Switcher server is already running on port 7891.
    echo [INFO] Opening dashboard in your default browser...
    start http://localhost:7891
    echo.
    echo Dashboard active at: http://localhost:7891
    ping 127.0.0.1 -n 3 >nul
    exit /b 0
)

echo [INFO] Starting background server daemon on port 7891...

:: Start the PowerShell server in background without blocking
start "" /b powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "%PROJECT_DIR%\skill-gui-server.ps1" -Port 7891

:: Wait 2 seconds for server socket initialization
ping 127.0.0.1 -n 3 >nul

:: Verify port is listening
netstat -ano | findstr ":7891 " >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Backend daemon listening on http://localhost:7891
) else (
    echo [NOTE] Server starting up, launching browser...
)

echo [INFO] Launching dashboard in browser...
start http://localhost:7891

echo.
echo =====================================================================
echo   Skill Switcher is active! You can minimize or close this window.
echo   URL: http://localhost:7891
echo =====================================================================
ping 127.0.0.1 -n 3 >nul
exit /b 0
