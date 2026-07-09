-- Update book cover URLs after mirroring objects from local MinIO to GCS.
-- Replace bucket names/hosts if your environment uses different values.

UPDATE books
SET cover_image = REPLACE(
    cover_image,
    'http://localhost:9000/library-bucket/',
    'https://storage.googleapis.com/lms1-bucket/'
)
WHERE cover_image LIKE 'http://localhost:9000/library-bucket/%';

UPDATE books
SET cover_image = REPLACE(
    cover_image,
    'http://127.0.0.1:9000/library-bucket/',
    'https://storage.googleapis.com/lms1-bucket/'
)
WHERE cover_image LIKE 'http://127.0.0.1:9000/library-bucket/%';

UPDATE books
SET cover_image = REPLACE(
    cover_image,
    'http://minio:9000/library-bucket/',
    'https://storage.googleapis.com/lms1-bucket/'
)
WHERE cover_image LIKE 'http://minio:9000/library-bucket/%';
