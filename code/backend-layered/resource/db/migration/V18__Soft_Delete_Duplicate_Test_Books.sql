-- Soft-delete duplicate test seed books by normalized title.
-- Keep the earliest book id and hide later duplicates from admin/public queries.

SET @books_is_deleted_exists = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'books'
      AND COLUMN_NAME = 'is_deleted'
);

SET @add_books_is_deleted_stmt = IF(
    @books_is_deleted_exists = 0,
    'ALTER TABLE books ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT FALSE',
    'DO 0'
);
PREPARE stmt FROM @add_books_is_deleted_stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

UPDATE books b
JOIN (
    SELECT LOWER(TRIM(title)) AS normalized_title, MIN(id) AS keep_id
    FROM books
    WHERE is_deleted = false
    GROUP BY LOWER(TRIM(title))
    HAVING COUNT(*) > 1
) duplicates
    ON LOWER(TRIM(b.title)) = duplicates.normalized_title
SET b.is_deleted = true
WHERE b.id <> duplicates.keep_id
  AND b.is_deleted = false;
