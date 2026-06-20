CREATE TABLE `users` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`username` varchar(255),
`email` varchar(255) UNIQUE,
`password` varchar(255),
`created_at` timestamp,
`updated_at` timestamp
);

CREATE TABLE `roles` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`role_name` enum(ADMIN,ASSISTANT,CUSTOMER),
`created_at` timestamp,
`updated_at` timestamp
);

CREATE TABLE `user_roles` (
`user_id` int,
`role_id` int,
PRIMARY KEY (`user_id`, `role_id`)
);

CREATE TABLE `user_profiles` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`user_id` int UNIQUE,
`full_name` varchar(255),
`date_of_birth` date,
`gender` bit(1),
`phone` varchar(11),
`avatar_url` varchar(255),
`created_at` timestamp,
`updated_at` timestamp
);

CREATE TABLE `assistants` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`user_id` int UNIQUE,
`employee_code` varchar(50) UNIQUE,
`hire_date` date,
`status` enum(ACTIVE,INACTIVE),
`created_at` timestamp,
`updated_at` timestamp
);

CREATE TABLE `borrowing_policies` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`max_borrow_days` int,
`max_books` int,
`overdue_fine_per_day` decimal,
`damage_fee_percent` decimal,
`lost_book_multiplier` decimal,
`created_at` timestamp,
`updated_at` timestamp
);

CREATE TABLE `membership_tiers` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`borrowing_policy_id` int,
`tier_name` varchar(100),
`description` text,
`discount_percent` decimal,
`priority_reservation` boolean,
`created_at` timestamp,
`updated_at` timestamp
);

CREATE TABLE `customers` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`user_id` int UNIQUE,
`full_name` varchar(255) NOT NULL,
`phone` varchar(15) NOT NULL,
`email` varchar(255),
`address` varchar(500) NOT NULL,
`identity_card` varchar(20) UNIQUE,
`library_card_no` varchar(50) UNIQUE,
`membership_tier_id` int,
`created_at` timestamp,
`updated_at` timestamp
);

CREATE TABLE `books` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`isbn` varchar(50) UNIQUE,
`title` varchar(500),
`description` text,
`publication_date` date,
`cover_image` varchar(500),
`publisher_id` int,
`category_id` int,
`shelf_location` varchar(100),
`deposit_price` decimal,
`rental_fee` decimal,
`total_quantity` int,
`available_quantity` int,
`status` varchar(20),
`average_rating` decimal(2,1),
`created_at` timestamp
);

CREATE TABLE `book_copies` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`book_id` int,
`barcode` varchar(50) UNIQUE,
`status` enum(AVAILABLE,BORROWED,MAINTENANCE,LOST),
`created_at` timestamp
);

CREATE TABLE `authors` (
`author_id` int PRIMARY KEY AUTO_INCREMENT,
`author_name` varchar(255),
`biography` text
);

CREATE TABLE `publishers` (
`publisher_id` int PRIMARY KEY AUTO_INCREMENT,
`publisher_name` varchar(255),
`address` text,
`phone` varchar(20)
);

CREATE TABLE `categories` (
`category_id` int PRIMARY KEY AUTO_INCREMENT,
`category_name` varchar(255),
`description` text
);

CREATE TABLE `tags` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`tag_name` varchar(100) UNIQUE,
`description` text
);

CREATE TABLE `book_tags` (
`book_id` int,
`tag_id` int,
PRIMARY KEY (`book_id`, `tag_id`)
);

CREATE TABLE `book_authors` (
`book_id` int,
`author_id` int,
PRIMARY KEY (`book_id`, `author_id`)
);

CREATE TABLE `borrow_orders` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`order_code` varchar(50),
`customer_id` int,
`membership_tier_id` int,
`borrow_date` date,
`pickup_date` date,
`due_date` date,
`status` enum(PENDING,BORROWED,RETURNED,OVERDUE,CANCELLED),
`subtotal_fee` decimal,
`discount_percent` decimal,
`discount_amount` decimal,
`total_fee` decimal,
`total_deposit` decimal,
`borrowing_policy_id` int,
`created_at` timestamp
);

CREATE TABLE `borrow_order_details` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`borrow_order_id` int,
`book_copy_id` int,
`rental_fee` decimal,
`deposit_price` decimal,
`status` enum(BORROWING,RETURNED,LOST,DAMAGED) DEFAULT 'BORROWING'
);

CREATE TABLE `borrow_extensions` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`borrow_order_id` int,
`requested_due_date` date,
`approved_by` int,
`status` varchar(20),
`note` text,
`requested_at` timestamp,
`approved_at` timestamp
);

CREATE TABLE `book_returns` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`borrow_order_id` int,
`assistant_id` int,
`return_date` datetime,
`overdue_days` int,
`total_fine_amount` decimal,
`note` text,
`created_at` timestamp
);

CREATE TABLE `book_return_details` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`book_return_id` int,
`book_copy_id` int,
`condition_status` enum(NORMAL,DAMAGED,LOST),
`fine_amount` decimal,
`note` text
);

CREATE TABLE `payments` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`borrow_order_id` int,
`fine_id` int,
`payment_method` enum(CASH,MASTER_CARD,BANK_TRANSFER,E_WALLET),
`transaction_code` varchar(255),
`amount` decimal,
`payment_type` enum(RENTAL_FEE,DEPOSIT,FINE,REFUND),
`payment_status` enum(PENDING,SUCCESS,FAILED,REFUNDED),
`processed_by` int,
`payment_date` datetime,
`created_at` timestamp
);

CREATE TABLE `fines` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`customer_id` int,
`book_return_id` int,
`amount` decimal,
`status` enum(UNPAID,PAID,CANCELLED),
`created_at` timestamp,
`paid_at` datetime,
`processed_by` int
);

CREATE TABLE `favourites` (
`customer_id` int,
`book_id` int,
`created_at` timestamp,
PRIMARY KEY (`customer_id`, `book_id`)
);

CREATE TABLE `reviews` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`customer_id` int,
`book_id` int,
`rating` int,
`comment` text,
`status` varchar(20),
`updated_at` timestamp,
`created_at` timestamp
);

CREATE TABLE `user_book_interactions` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`customer_id` int,
`book_id` int,
`interaction_type` varchar(50),
`created_at` timestamp
);

CREATE TABLE `reservations` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`customer_id` int,
`book_id` int,
`reservation_date` datetime,
`status` varchar(20),
`created_at` timestamp
);

CREATE TABLE `notifications` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`customer_id` int,
`title` varchar(255),
`content` text,
`type` varchar(50),
`is_read` boolean,
`read_at` datetime,
`created_at` timestamp
);

CREATE TABLE `support_requests` (
`id` int PRIMARY KEY AUTO_INCREMENT,
`assigned_assistant_id` int,
`resolved_at` datetime,
`customer_id` int,
`full_name` varchar(255),
`email` varchar(255),
`phone` varchar(20),
`subject` varchar(255),
`message` text,
`status` varchar(20),
`created_at` timestamp
);

ALTER TABLE `user_roles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `user_roles` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

ALTER TABLE `user_profiles` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `assistants` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `membership_tiers` ADD FOREIGN KEY (`borrowing_policy_id`) REFERENCES `borrowing_policies` (`id`);

ALTER TABLE `customers` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `customers` ADD FOREIGN KEY (`membership_tier_id`) REFERENCES `membership_tiers` (`id`);

ALTER TABLE `books` ADD FOREIGN KEY (`publisher_id`) REFERENCES `publishers` (`publisher_id`);

ALTER TABLE `books` ADD FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

ALTER TABLE `book_copies` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

ALTER TABLE `book_tags` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

ALTER TABLE `book_tags` ADD FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);

ALTER TABLE `book_authors` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

ALTER TABLE `book_authors` ADD FOREIGN KEY (`author_id`) REFERENCES `authors` (`author_id`);

ALTER TABLE `borrow_orders` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `borrow_orders` ADD FOREIGN KEY (`membership_tier_id`) REFERENCES `membership_tiers` (`id`);

ALTER TABLE `borrow_orders` ADD FOREIGN KEY (`borrowing_policy_id`) REFERENCES `borrowing_policies` (`id`);

ALTER TABLE `borrow_order_details` ADD FOREIGN KEY (`borrow_order_id`) REFERENCES `borrow_orders` (`id`);

ALTER TABLE `borrow_order_details` ADD FOREIGN KEY (`book_copy_id`) REFERENCES `book_copies` (`id`);

ALTER TABLE `borrow_extensions` ADD FOREIGN KEY (`borrow_order_id`) REFERENCES `borrow_orders` (`id`);

ALTER TABLE `borrow_extensions` ADD FOREIGN KEY (`approved_by`) REFERENCES `assistants` (`id`);

ALTER TABLE `book_returns` ADD FOREIGN KEY (`borrow_order_id`) REFERENCES `borrow_orders` (`id`);

ALTER TABLE `book_returns` ADD FOREIGN KEY (`assistant_id`) REFERENCES `assistants` (`id`);

ALTER TABLE `book_return_details` ADD FOREIGN KEY (`book_return_id`) REFERENCES `book_returns` (`id`);

ALTER TABLE `book_return_details` ADD FOREIGN KEY (`book_copy_id`) REFERENCES `book_copies` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`borrow_order_id`) REFERENCES `borrow_orders` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`fine_id`) REFERENCES `fines` (`id`);

ALTER TABLE `fines` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `fines` ADD FOREIGN KEY (`book_return_id`) REFERENCES `book_returns` (`id`);

ALTER TABLE `fines` ADD FOREIGN KEY (`processed_by`) REFERENCES `assistants` (`id`);

ALTER TABLE `favourites` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `favourites` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

ALTER TABLE `user_book_interactions` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `user_book_interactions` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

ALTER TABLE `reservations` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `reservations` ADD FOREIGN KEY (`book_id`) REFERENCES `books` (`id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `support_requests` ADD FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

ALTER TABLE `support_requests` ADD FOREIGN KEY (`assigned_assistant_id`) REFERENCES `assistants` (`id`);
