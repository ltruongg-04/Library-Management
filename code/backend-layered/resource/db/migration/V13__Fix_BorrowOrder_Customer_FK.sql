-- V13__Fix_BorrowOrder_Customer_FK.sql
-- Mục đích: Sửa lỗi khóa ngoại của bảng borrow_orders đang trỏ nhầm sang bảng users thay vì bảng customers.
-- Lỗi này do Hibernate tự sinh ra trước đây khi mapping bị sai.

-- 1. Tìm và xóa khóa ngoại bị sai (trỏ sang users)
SET @fk_name = (
    SELECT CONSTRAINT_NAME
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'borrow_orders'
      AND COLUMN_NAME = 'customer_id'
      AND REFERENCED_TABLE_NAME = 'users'
    LIMIT 1
);

SET @drop_fk_stmt = IF(@fk_name IS NOT NULL, CONCAT('ALTER TABLE borrow_orders DROP FOREIGN KEY ', @fk_name), 'DO 0');
PREPARE stmt FROM @drop_fk_stmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2. Thêm lại khóa ngoại đúng (trỏ sang customers)
-- Trước khi thêm, kiểm tra xem khóa ngoại đúng đã tồn tại chưa để tránh lỗi duplicate
SET @correct_fk_exists = (
    SELECT COUNT(*)
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'borrow_orders'
      AND COLUMN_NAME = 'customer_id'
      AND REFERENCED_TABLE_NAME = 'customers'
);

SET @add_fk_stmt = IF(@correct_fk_exists = 0, 'ALTER TABLE borrow_orders ADD CONSTRAINT fk_borrow_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id)', 'DO 0');
PREPARE stmt2 FROM @add_fk_stmt;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;
