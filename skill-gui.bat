@echo off
title Skill Switcher Web GUI — Port 7891
echo.
echo  ==============================================
echo   Skill Switcher — Local Web Dashboard
echo  ==============================================
netstat -ano | findstr ":7891 " >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Skill Switcher server is already running on port 7891.
    start http://localhost:7891
    exit /b 0
)
netstat -ano | findstr ":7892 " >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Skill Switcher server is already running on port 7892.
    start http://localhost:7892
    exit /b 0
)

echo   URL: http://localhost:7891
echo   Opening dashboard in your browser...
echo   Keep this terminal open while using the GUI.
echo   Press Ctrl+C to stop.
echo  ==============================================
echo.
start http://localhost:7891
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0skill-gui-server.ps1" -Port 7891
pause
