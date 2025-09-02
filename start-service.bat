@echo off
title AreaZero API Service
cd /d "C:\Logiciel\APIv3-2"

:start
echo [%date% %time%] Iniciando AreaZero API...
node dist/index.js

echo [%date% %time%] API se detuvo. Reiniciando en 5 segundos...
timeout /t 5 /nobreak >nul
goto start
