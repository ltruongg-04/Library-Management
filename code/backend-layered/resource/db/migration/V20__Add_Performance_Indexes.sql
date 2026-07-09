SET @idx_exists = (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'books'
      AND INDEX_NAME = 'idx_books_deleted_created_at'
);
SET @ddl = IF(@idx_exists = 0,
    'CREATE INDEX idx_books_deleted_created_at ON books (is_deleted, created_at)',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'books'
      AND INDEX_NAME = 'idx_books_deleted_rating'
);
SET @ddl = IF(@idx_exists = 0,
    'CREATE INDEX idx_books_deleted_rating ON books (is_deleted, rating)',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'books'
      AND INDEX_NAME = 'idx_books_deleted_title'
);
SET @ddl = IF(@idx_exists = 0,
    'CREATE INDEX idx_books_deleted_title ON books (is_deleted, title)',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'book_copies'
      AND INDEX_NAME = 'idx_book_copies_book_status'
);
SET @ddl = IF(@idx_exists = 0,
    'CREATE INDEX idx_book_copies_book_status ON book_copies (book_id, status)',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'borrow_order_details'
      AND INDEX_NAME = 'idx_bod_copy_id'
);
SET @ddl = IF(@idx_exists = 0,
    'CREATE INDEX idx_bod_copy_id ON borrow_order_details (book_copy_id)',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'book_authors'
      AND INDEX_NAME = 'idx_book_authors_author_book'
);
SET @ddl = IF(@idx_exists = 0,
    'CREATE INDEX idx_book_authors_author_book ON book_authors (author_id, book_id)',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @idx_exists = (
    SELECT COUNT(1)
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'book_categories'
      AND INDEX_NAME = 'idx_book_categories_category_book'
);
SET @ddl = IF(@idx_exists = 0,
    'CREATE INDEX idx_book_categories_category_book ON book_categories (category_id, book_id)',
    'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
