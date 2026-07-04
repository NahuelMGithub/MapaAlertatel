@echo off
title Alertatel - Centro de Operaciones

cd /d "D:\JULASOFT\ALERTATEL\Mapa Alertatel"

echo Iniciando backend...
start "Alertatel Backend" cmd /k "cd /d D:\JULASOFT\ALERTATEL\Mapa Alertatel\server && npm start"

echo Iniciando frontend...
start "Alertatel Frontend" cmd /k "cd /d D:\JULASOFT\ALERTATEL\Mapa Alertatel && python -m http.server 8001 --bind 127.0.0.1"

timeout /t 3 > nul

start http://127.0.0.1:8001/public/trabajo-diario.html

exit
