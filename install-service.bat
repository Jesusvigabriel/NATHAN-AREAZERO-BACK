@echo off
echo ========================================
echo   AreaZero API - Instalador de Servicio
echo ========================================
echo.

REM Verificar permisos de administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: Este script debe ejecutarse como Administrador.
    echo Haz clic derecho en el archivo y selecciona "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

echo Verificando si el servicio ya existe...
sc query "AreaZeroAPI" >nul 2>&1
if %errorLevel% equ 0 (
    echo El servicio AreaZeroAPI ya existe. Eliminando servicio anterior...
    sc stop "AreaZeroAPI" >nul 2>&1
    sc delete "AreaZeroAPI" >nul 2>&1
    timeout /t 3 /nobreak >nul
)

echo Creando servicio AreaZeroAPI...

REM Crear el servicio usando el wrapper
sc.exe create AreaZeroAPI ^
  binPath= "C:\Logiciel\APIv3-2\service-wrapper.bat" ^
  start= auto ^
  DisplayName= "AreaZero API Service" ^
  description= "Servicio de API para AreaZero Backend"

if %errorLevel% neq 0 (
    echo ERROR: No se pudo crear el servicio.
    echo Verifique que:
    echo 1. Está ejecutando como Administrador
    echo 2. El archivo service-wrapper.bat existe
    echo 3. No hay otro servicio con el mismo nombre
    echo.
    pause
    exit /b 1
)

echo Configurando reinicio automático en caso de fallo...
sc.exe failure "AreaZeroAPI" reset= 86400 actions= restart/5000/restart/10000/restart/20000

echo.
echo ========================================
echo   SERVICIO INSTALADO EXITOSAMENTE!
echo ========================================
echo.
echo Comandos disponibles:
echo   Iniciar servicio:    sc start AreaZeroAPI
echo   Detener servicio:    sc stop AreaZeroAPI
echo   Estado del servicio: sc query AreaZeroAPI
echo   Desinstalar:         sc delete AreaZeroAPI
echo.
echo ¿Desea iniciar el servicio ahora? (S/N)
set /p choice=
if /i "%choice%"=="S" (
    echo Iniciando servicio...
    sc start "AreaZeroAPI"
    if %errorLevel% equ 0 (
        echo Servicio iniciado correctamente!
        echo La API debería estar disponible en http://localhost:8000
    ) else (
        echo Error al iniciar el servicio. Revise los logs.
    )
)
echo.
pause
