CREATE TABLE IF NOT EXISTS role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(20) NOT NULL,
    permission_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_role_permission (role_name, permission_id)
);

INSERT IGNORE INTO role_permissions (role_name, permission_id) VALUES
('ADMIN', 'books.add-book'),
('ADMIN', 'books.edit-book'),
('ADMIN', 'books.delete-book'),
('ADMIN', 'borrow.approve'),
('ADMIN', 'borrow.fine'),
('ADMIN', 'reviews.moderate'),
('ADMIN', 'settings.manage'),
('ADMIN', 'roles.manage'),
('LIBRARIAN', 'books.add-book'),
('LIBRARIAN', 'books.edit-book'),
('LIBRARIAN', 'borrow.approve'),
('LIBRARIAN', 'reviews.moderate');
