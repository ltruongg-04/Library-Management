param(
    [string]$DbUrl = $env:DB_URL,
    [string]$DbUsername = $env:DB_USERNAME,
    [string]$DbPassword = $env:DB_PASSWORD,
    [string]$LocalEndpoint = $env:LOCAL_MINIO_ENDPOINT,
    [string]$LocalAccessKey = $env:LOCAL_MINIO_ACCESS_KEY,
    [string]$LocalSecretKey = $env:LOCAL_MINIO_SECRET_KEY,
    [string]$LocalBucket = $env:LOCAL_MINIO_BUCKET,
    [string]$GcsEndpoint = $env:GCS_S3_ENDPOINT,
    [string]$GcsAccessKey = $env:GCS_ACCESS_KEY,
    [string]$GcsSecretKey = $env:GCS_SECRET_KEY,
    [string]$GcsBucket = $env:GCS_BUCKET,
    [string]$McConfigDir = $env:MC_CONFIG_DIR,
    [string]$OutputSql = "scripts\update-db-minio-image-urls.generated.sql",
    [switch]$DryRun,
    [switch]$SkipDbUpdate
)

$ErrorActionPreference = "Stop"

if (-not $LocalEndpoint) { $LocalEndpoint = "http://localhost:9000" }
if (-not $LocalBucket) { $LocalBucket = "library-bucket" }
if (-not $GcsEndpoint) { $GcsEndpoint = "https://storage.googleapis.com" }
if (-not $McConfigDir) { $McConfigDir = Join-Path (Split-Path -Parent $PSScriptRoot) ".tmp\mc-config" }

function Require-Value {
    param([string]$Name, [string]$Value)
    if ([string]::IsNullOrWhiteSpace($Value)) {
        throw "Missing required value: $Name. Pass it as a parameter or environment variable."
    }
}

function Convert-JdbcUrlToMysqlArgs {
    param([string]$JdbcUrl)

    if ($JdbcUrl -notmatch "^jdbc:mysql://([^/:?]*)(?::([0-9]+))?/([^?]+)") {
        throw "DB_URL must be a host-based MySQL JDBC URL for this script, for example jdbc:mysql://127.0.0.1:3306/librarydb. For Cloud SQL socketFactory URLs, run this script through Cloud SQL Auth Proxy and pass its local JDBC URL."
    }

    $hostName = $Matches[1]
    $port = $Matches[2]
    $database = $Matches[3]

    if ([string]::IsNullOrWhiteSpace($hostName)) {
        $hostName = "127.0.0.1"
    }
    if ([string]::IsNullOrWhiteSpace($port)) {
        $port = "3306"
    }

    return @{
        Host = $hostName
        Port = $port
        Database = $database
    }
}

function Get-MinIOObjectKey {
    param([string]$Url)

    if ([string]::IsNullOrWhiteSpace($Url)) {
        return $null
    }

    $prefixes = @(
        "$LocalEndpoint/$LocalBucket/",
        "http://localhost:9000/$LocalBucket/",
        "http://127.0.0.1:9000/$LocalBucket/",
        "http://minio:9000/$LocalBucket/"
    )

    foreach ($prefix in $prefixes) {
        if ($Url.StartsWith($prefix, [System.StringComparison]::OrdinalIgnoreCase)) {
            return [System.Uri]::UnescapeDataString($Url.Substring($prefix.Length))
        }
    }

    return $null
}

function Escape-SqlLiteral {
    param([string]$Value)
    return $Value.Replace("\", "\\").Replace("'", "''")
}

Require-Value "DbUrl / DB_URL" $DbUrl
Require-Value "DbUsername / DB_USERNAME" $DbUsername
Require-Value "DbPassword / DB_PASSWORD" $DbPassword
Require-Value "LocalAccessKey / LOCAL_MINIO_ACCESS_KEY" $LocalAccessKey
Require-Value "LocalSecretKey / LOCAL_MINIO_SECRET_KEY" $LocalSecretKey
Require-Value "GcsAccessKey / GCS_ACCESS_KEY" $GcsAccessKey
Require-Value "GcsSecretKey / GCS_SECRET_KEY" $GcsSecretKey
Require-Value "GcsBucket / GCS_BUCKET" $GcsBucket

$mysqlCommand = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysqlCommand) {
    throw "MySQL client was not found in PATH. Install MySQL client, or run the generated SQL manually after copying objects."
}

$mcCommand = Get-Command mc -ErrorAction SilentlyContinue
if ($mcCommand) {
    $mc = $mcCommand.Source
} elseif (Test-Path -LiteralPath "C:\tmp\mc.exe") {
    $mc = "C:\tmp\mc.exe"
} else {
    throw "MinIO Client 'mc' was not found in PATH or C:\tmp\mc.exe."
}

$db = Convert-JdbcUrlToMysqlArgs $DbUrl
$env:MYSQL_PWD = $DbPassword

try {
    Write-Host "Reading MinIO image URLs from books.cover_image..."
    $query = "SELECT id, cover_image FROM books WHERE cover_image LIKE 'http://localhost:9000/%' OR cover_image LIKE 'http://127.0.0.1:9000/%' OR cover_image LIKE 'http://minio:9000/%' OR cover_image LIKE '$LocalEndpoint/%';"
    $rows = & $mysqlCommand.Source --batch --raw --skip-column-names `
        -h $db.Host -P $db.Port -u $DbUsername $db.Database `
        -e $query

    if ($LASTEXITCODE -ne 0) {
        throw "mysql failed while reading books.cover_image."
    }
} finally {
    Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
}

$items = @()
foreach ($row in $rows) {
    if ([string]::IsNullOrWhiteSpace($row)) {
        continue
    }

    $parts = $row -split "`t", 2
    if ($parts.Length -ne 2) {
        continue
    }

    $key = Get-MinIOObjectKey $parts[1]
    if ($key) {
        $items += [pscustomobject]@{
            Id = $parts[0]
            OldUrl = $parts[1]
            Key = $key
            NewUrl = "$GcsEndpoint/$GcsBucket/$key"
        }
    }
}

$items = $items | Sort-Object Key -Unique
Write-Host "Found $($items.Count) database image object(s) to copy."

if ($items.Count -eq 0) {
    Write-Host "No MinIO image URLs found in books.cover_image."
    exit 0
}

New-Item -ItemType Directory -Force -Path $McConfigDir | Out-Null

function Invoke-Mc {
    param([string[]]$Arguments)

    & $mc --config-dir $McConfigDir @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "mc failed with exit code ${LASTEXITCODE}: $($Arguments -join ' ')"
    }
}

Write-Host "Configuring MinIO aliases..."
Invoke-Mc @("alias", "set", "local-minio", $LocalEndpoint, $LocalAccessKey, $LocalSecretKey)
Invoke-Mc @("alias", "set", "gcs-storage", $GcsEndpoint, $GcsAccessKey, $GcsSecretKey)

& $mc --config-dir $McConfigDir mb --ignore-existing "gcs-storage/$GcsBucket"
if ($LASTEXITCODE -ne 0) {
    Invoke-Mc @("ls", "gcs-storage/$GcsBucket")
}

foreach ($item in $items) {
    $source = "local-minio/$LocalBucket/$($item.Key)"
    $target = "gcs-storage/$GcsBucket/$($item.Key)"
    if ($DryRun) {
        Write-Host "[dry-run] copy $source -> $target"
    } else {
        Invoke-Mc @("cp", "--preserve", $source, $target)
    }
}

$sqlLines = @(
    "-- Generated by scripts/migrate-db-minio-images-to-gcs.ps1",
    "START TRANSACTION;"
)
foreach ($item in $items) {
    $sqlLines += "UPDATE books SET cover_image = '$(Escape-SqlLiteral $item.NewUrl)' WHERE cover_image = '$(Escape-SqlLiteral $item.OldUrl)';"
}
$sqlLines += "COMMIT;"

$outputPath = Join-Path (Split-Path -Parent $PSScriptRoot) $OutputSql
Set-Content -Path $outputPath -Value $sqlLines -Encoding UTF8
Write-Host "Generated SQL: $outputPath"

if (-not $SkipDbUpdate -and -not $DryRun) {
    $env:MYSQL_PWD = $DbPassword
    try {
        Write-Host "Updating books.cover_image to GCS URLs..."
        & $mysqlCommand.Source -h $db.Host -P $db.Port -u $DbUsername $db.Database -e "source $outputPath"
        if ($LASTEXITCODE -ne 0) {
            throw "mysql failed while applying generated SQL."
        }
    } finally {
        Remove-Item Env:\MYSQL_PWD -ErrorAction SilentlyContinue
    }
}

Write-Host "Done."
