# Migrate Local MinIO Images To GCS

This project stores uploaded book cover images through the MinIO SDK. In production, use the GCS S3-compatible endpoint:

```env
MINIO_URL=https://storage.googleapis.com
MINIO_BUCKET_NAME=lms1-bucket
MINIO_ACCESS_KEY=<gcs-hmac-access-key>
MINIO_SECRET_KEY=<gcs-hmac-secret-key>
```

The backend returns uploaded image URLs as:

```text
https://storage.googleapis.com/lms1-bucket/<object-name>
```

## 1. Create GCS HMAC keys

In Google Cloud Storage, create an HMAC access key for the service account that owns the target bucket. Use that access key and secret as `GCS_ACCESS_KEY` and `GCS_SECRET_KEY`.

## 2. Mirror objects from local MinIO to GCS

Install MinIO Client `mc`, then run from the repository root:

```powershell
$env:LOCAL_MINIO_ENDPOINT = "http://localhost:9000"
$env:LOCAL_MINIO_ACCESS_KEY = "<local-minio-access-key>"
$env:LOCAL_MINIO_SECRET_KEY = "<local-minio-secret-key>"
$env:LOCAL_MINIO_BUCKET = "library-bucket"

$env:GCS_S3_ENDPOINT = "https://storage.googleapis.com"
$env:GCS_ACCESS_KEY = "<gcs-hmac-access-key>"
$env:GCS_SECRET_KEY = "<gcs-hmac-secret-key>"
$env:GCS_BUCKET = "lms1-bucket"

.\scripts\migrate-minio-to-gcs.ps1 -DryRun
.\scripts\migrate-minio-to-gcs.ps1
```

## 3. Update existing image URLs in DB

After the mirror succeeds, update DB rows that still point to local MinIO:

```sql
-- See scripts/update-minio-image-urls.sql
```

Run the SQL against the production database only after confirming the objects exist in GCS.

## 4. Make bucket objects readable

If images must be public, grant read access to the bucket or objects. For public buckets, `https://storage.googleapis.com/lms1-bucket/<object-name>` should open directly in a browser.
