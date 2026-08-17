@echo off
title BlueCarbon AI — Unified Permanent Platform Server
color 0A

:SERVER_LOOP
cls
echo =======================================================
echo    BlueCarbon AI — Unified Permanent Platform Server
echo =======================================================
echo.
echo Freeing port 3000 if occupied...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo.
echo Starting Unified Web Server on http://localhost:3000 ...
echo.

start "" "http://localhost:3000"

node server.js

echo.
echo Server stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto SERVER_LOOP
