@echo off
title Skill Switcher Web GUI — Port 7891
echo.
echo  ==============================================
echo   Skill Switcher — Local Web Dashboard
echo  ==============================================
echo   URL: http://localhost:7891
echo   Opening dashboard in your browser...
echo   Keep this terminal open while using the GUI.
echo   Press Ctrl+C to stop.
echo  ==============================================
echo.
start http://localhost:7891
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0skill-gui-server.ps1" -Port 7891
pause
