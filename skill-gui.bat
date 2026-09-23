@echo off
title EKA Skill Switcher — Antigravity IDE
echo.
echo  EKA Skill Switcher
echo  ──────────────────────────────────────
echo  GUI will open at http://localhost:7891
echo  Press Ctrl+C in this window to stop.
echo.
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "%~dp0skill-gui-server.ps1"
pause
