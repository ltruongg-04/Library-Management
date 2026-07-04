-- =============================================
-- WIPE OUT ALL MOCK DATA (BOOKS, CATEGORIES, AUTHORS, ORDERS)
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;

-- Wipe out all library data
TRUNCATE TABLE book_copies;
TRUNCATE TABLE book_categories;
TRUNCATE TABLE book_authors;
TRUNCATE TABLE books;
TRUNCATE TABLE authors;
TRUNCATE TABLE categories;

-- Wipe out all orders and interactions that might reference mock books
TRUNCATE TABLE borrow_order_details;
TRUNCATE TABLE borrow_orders;
TRUNCATE TABLE favourites;
TRUNCATE TABLE reservations;
TRUNCATE TABLE payments;

SET FOREIGN_KEY_CHECKS = 1;
