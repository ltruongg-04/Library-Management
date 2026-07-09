param(
    [string]$LocalEndpoint = $env:LOCAL_MINIO_ENDPOINT,
    [string]$LocalAccessKey = $env:LOCAL_MINIO_ACCESS_KEY,
    [string]$LocalSecretKey = $env:LOCAL_MINIO_SECRET_KEY,
    [string]$LocalBucket = $env:LOCAL_MINIO_BUCKET,
    [string]$GcsEndpoint = $env:GCS_S3_ENDPOINT,
    [string]$GcsAccessKey = $env:GCS_ACCESS_KEY,
    [string]$GcsSecretKey = $env:GCS_SECRET_KEY,
    [string]$GcsBucket = $env:GCS_BUCKET,
    [string]$McConfigDir = $env:MC_CONFIG_DIR,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (-not $LocalEndpoint) { $LocalEndpoint = "http://localhost:9000" }
if (-not $LocalAccessKey) { $LocalAccessKey = "minioadmin" }
if (-not $LocalSecretKey) { $LocalSecretKey = "minioadmin" }
if (-not $LocalBucket) { $LocalBucket = "library-bucket" }
if (-not $GcsEndpoint) { $GcsEndpoint = "https://storage.googleapis.com" }
if (-not $McConfigDir) { $McConfigDir = Join-Path (Split-Path -Parent $PSScriptRoot) ".tmp\mc-config" }

function Require-Value {
    param([string]$Name, [string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) {
        throw "Missing required value: $Name. Pass it as a parameter or environment variable."
    }
}

Require-Value "GcsAccessKey / GCS_ACCESS_KEY" $GcsAccessKey
Require-Value "GcsSecretKey / GCS_SECRET_KEY" $GcsSecretKey
Require-Value "GcsBucket / GCS_BUCKET" $GcsBucket

$mcCommand = Get-Command mc -ErrorAction SilentlyContinue
if ($mcCommand) {
    $mc = $mcCommand.Source
} elseif (Test-Path -LiteralPath "C:\tmp\mc.exe") {
    $mc = "C:\tmp\mc.exe"
} else {
    throw "MinIO Client 'mc' was not found in PATH or C:\tmp\mc.exe. Install it first: https://min.io/docs/minio/windows/reference/minio-mc.html"
}

New-Item -ItemType Directory -Force -Path $McConfigDir | Out-Null

function Invoke-Mc {
    param([string[]]$Arguments)

    & $mc --config-dir $McConfigDir @Arguments
    if ($LASTEXITCODE -ne 0) {
        $safeArguments = $Arguments
        if ($Arguments.Length -ge 4 -and $Arguments[0] -eq "alias" -and $Arguments[1] -eq "set") {
            $safeArguments = @($Arguments[0], $Arguments[1], $Arguments[2], $Arguments[3], "<redacted-access-key>", "<redacted-secret-key>")
        }
        throw "mc failed with exit code ${LASTEXITCODE}: $($safeArguments -join ' ')"
    }
}

Write-Host "Configuring MinIO aliases..."
Invoke-Mc @("alias", "set", "local-minio", $LocalEndpoint, $LocalAccessKey, $LocalSecretKey)
Invoke-Mc @("alias", "set", "gcs-storage", $GcsEndpoint, $GcsAccessKey, $GcsSecretKey)

Write-Host "Checking buckets..."
Invoke-Mc @("ls", "local-minio/$LocalBucket")
& $mc --config-dir $McConfigDir mb --ignore-existing "gcs-storage/$GcsBucket"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Bucket create/check via mb failed; checking whether target bucket already exists..."
    Invoke-Mc @("ls", "gcs-storage/$GcsBucket")
}

$mirrorArgs = @("mirror", "--overwrite", "--preserve")
if ($DryRun) {
    $mirrorArgs += "--dry-run"
}
$mirrorArgs += "local-minio/$LocalBucket"
$mirrorArgs += "gcs-storage/$GcsBucket"

Write-Host "Mirroring local-minio/$LocalBucket -> gcs-storage/$GcsBucket"
Invoke-Mc $mirrorArgs

Write-Host "Done."
Write-Host "Public URL base: $GcsEndpoint/$GcsBucket"
