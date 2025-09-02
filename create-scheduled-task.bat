@echo off
echo Creando tarea programada para AreaZero API...

REM Crear la tarea programada que se ejecuta al iniciar el sistema
schtasks /create /tn "AreaZeroAPI" /tr "C:\Logiciel\APIv3-2\start-service.bat" /sc onstart /ru SYSTEM /rl HIGHEST /f

echo.
echo Tarea programada creada exitosamente!
echo La API se iniciará automáticamente cuando Windows arranque.
echo.
echo Para administrar la tarea:
echo - Ver tareas: schtasks /query /tn "AreaZeroAPI"
echo - Ejecutar ahora: schtasks /run /tn "AreaZeroAPI"
echo - Detener: schtasks /end /tn "AreaZeroAPI"
echo - Eliminar: schtasks /delete /tn "AreaZeroAPI" /f
echo.
pause
