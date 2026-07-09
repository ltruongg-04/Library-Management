param(
    [string]$EnvFile = "code\backend-layered\.env",
    [string]$BackendDir = "code\backend-layered",
    [string]$Port = "8080"
)

$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $workspace $EnvFile
$backendPath = Join-Path $workspace $BackendDir

if (-not (Test-Path -LiteralPath $envPath)) {
    throw "Environment file not found: $envPath"
}

Get-Content -LiteralPath $envPath | ForEach-Object {
    $line = $_.Trim()
    if (-not $line -or $line.StartsWith("#") -or -not $line.Contains("=")) {
        return
    }

    $parts = $line.Split("=", 2)
    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"')

    [Environment]::SetEnvironmentVariable($name, $value, "Process")
}

if ($Port) {
    $env:PORT = $Port
}

if ($env:GOOGLE_APPLICATION_CREDENTIALS -and -not (Test-Path -LiteralPath $env:GOOGLE_APPLICATION_CREDENTIALS)) {
    throw "GOOGLE_APPLICATION_CREDENTIALS points to a missing file: $env:GOOGLE_APPLICATION_CREDENTIALS"
}

Push-Location $backendPath
try {
    mvn spring-boot:run
} finally {
    Pop-Location
}
