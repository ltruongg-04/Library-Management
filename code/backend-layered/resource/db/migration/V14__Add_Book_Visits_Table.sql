CREATE TABLE `book_visits` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `book_id` INT,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20),
  `visit_date` DATE NOT NULL,
  `visit_time` VARCHAR(50) NOT NULL,
  `purpose` VARCHAR(255),
  `confirmation_code` VARCHAR(50) UNIQUE,
  `status` VARCHAR(20) DEFAULT 'PENDING',
  `is_reminded` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
);
