# AreaZero API Service Script
# Este script mantiene la API ejecutándose constantemente

$apiPath = "C:\Users\Administrator\Documents\JESUS\AREAZERO-BACK"
$logFile = "$apiPath\service.log"

# Función para escribir logs
function Write-Log {
    param($message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $message" | Out-File -FilePath $logFile -Append
    Write-Host "$timestamp - $message"
}

Write-Log "Iniciando AreaZero API Service..."

# Bucle infinito para mantener la API ejecutándose
while ($true) {
    try {
        Write-Log "Iniciando API en puerto 8129..."
        
        # Cambiar al directorio de la API
        Set-Location $apiPath
        
        # Ejecutar la API
        $process = Start-Process -FilePath "node" -ArgumentList "dist/index.js" -PassThru -NoNewWindow
        
        Write-Log "API iniciada con PID: $($process.Id)"
        
        # Esperar a que el proceso termine
        $process.WaitForExit()
        
        Write-Log "API se detuvo inesperadamente. Reiniciando en 5 segundos..."
        Start-Sleep -Seconds 5
        
    } catch {
        Write-Log "Error: $($_.Exception.Message)"
        Write-Log "Reintentando en 10 segundos..."
        Start-Sleep -Seconds 10
    }
}
