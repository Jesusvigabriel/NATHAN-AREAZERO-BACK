# AreaZero API - Instalador de Servicio PowerShell
# Este script crea un servicio de Windows para la API AreaZero

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AreaZero API - Instalador de Servicio" -ForegroundColor Cyan  
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar permisos de administrador
$currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
$isAdmin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: Este script debe ejecutarse como Administrador." -ForegroundColor Red
    Write-Host "Haz clic derecho en PowerShell y selecciona 'Ejecutar como administrador'" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Configuración del servicio
$serviceName = "AreaZeroAPI"
$serviceDisplayName = "AreaZero API Service"
$serviceDescription = "Servicio de API para AreaZero Backend"
$servicePath = "C:\Logiciel\APIv3-2"
$serviceExecutable = "$servicePath\service-wrapper.bat"

Write-Host "Verificando si el servicio ya existe..." -ForegroundColor Yellow

# Verificar si el servicio existe
$existingService = Get-Service -Name $serviceName -ErrorAction SilentlyContinue

if ($existingService) {
    Write-Host "El servicio $serviceName ya existe. Eliminando servicio anterior..." -ForegroundColor Yellow
    
    # Detener el servicio si está ejecutándose
    if ($existingService.Status -eq 'Running') {
        Stop-Service -Name $serviceName -Force
        Start-Sleep -Seconds 3
    }
    
    # Eliminar el servicio
    & sc.exe delete $serviceName
    Start-Sleep -Seconds 3
}

Write-Host "Creando servicio $serviceName..." -ForegroundColor Green

# Crear el servicio usando New-Service (más confiable que sc.exe)
try {
    New-Service -Name $serviceName `
                -BinaryPathName $serviceExecutable `
                -DisplayName $serviceDisplayName `
                -Description $serviceDescription `
                -StartupType Automatic `
                -ErrorAction Stop
    
    Write-Host "Servicio creado exitosamente!" -ForegroundColor Green
    
    # Configurar reinicio automático en caso de fallo
    Write-Host "Configurando reinicio automático en caso de fallo..." -ForegroundColor Yellow
    & sc.exe failure $serviceName reset= 86400 actions= restart/5000/restart/10000/restart/20000
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "   SERVICIO INSTALADO EXITOSAMENTE!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos disponibles:" -ForegroundColor Cyan
    Write-Host "  Iniciar servicio:    Start-Service $serviceName" -ForegroundColor White
    Write-Host "  Detener servicio:    Stop-Service $serviceName" -ForegroundColor White
    Write-Host "  Estado del servicio: Get-Service $serviceName" -ForegroundColor White
    Write-Host "  Desinstalar:         Remove-Service $serviceName" -ForegroundColor White
    Write-Host ""
    
    # Preguntar si iniciar el servicio
    $choice = Read-Host "¿Desea iniciar el servicio ahora? (S/N)"
    if ($choice -eq 'S' -or $choice -eq 's') {
        Write-Host "Iniciando servicio..." -ForegroundColor Yellow
        Start-Service -Name $serviceName
        
        Start-Sleep -Seconds 3
        $service = Get-Service -Name $serviceName
        
        if ($service.Status -eq 'Running') {
            Write-Host "Servicio iniciado correctamente!" -ForegroundColor Green
            Write-Host "La API debería estar disponible en http://localhost:8000" -ForegroundColor Cyan
        } else {
            Write-Host "Error al iniciar el servicio. Estado: $($service.Status)" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "ERROR: No se pudo crear el servicio." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifique que:" -ForegroundColor Yellow
    Write-Host "1. Está ejecutando como Administrador" -ForegroundColor White
    Write-Host "2. El archivo service-wrapper.bat existe en $servicePath" -ForegroundColor White
    Write-Host "3. No hay otro servicio con el mismo nombre" -ForegroundColor White
}

Write-Host ""
Read-Host "Presiona Enter para salir"
