-- =============================================
-- DỮ LIỆU MẪU CHO BẢNG BOOKS VÀ CÁC BẢNG LIÊN QUAN
-- =============================================

-- 1. Thêm Tác giả (Authors)
INSERT IGNORE INTO authors (author_id, author_name) VALUES
(1, 'Dr. Elena Rostova'),
(2, 'Marcus Thorne'),
(3, 'Sarah Jenkins'),
(4, 'Alex Rivera'),
(5, 'Marcus Vance'),
(6, 'Dr. Sarah Jenkins'),
(7, 'A.J. Thorne'),
(8, 'L. Chen');

-- 2. Thêm Thể loại (Categories)
INSERT IGNORE INTO categories (category_id, category_name, created_at, updated_at) VALUES
(1, 'Artificial Intelligence', NOW(), NOW()),
(2, 'Cognitive Science', NOW(), NOW()),
(3, 'Technology', NOW(), NOW()),
(4, 'Machine Learning', NOW(), NOW()),
(5, 'Fiction', NOW(), NOW()),
(6, 'Novel', NOW(), NOW()),
(7, 'Literary Fiction', NOW(), NOW()),
(8, 'History', NOW(), NOW()),
(9, 'Futurism', NOW(), NOW()),
(10, 'Science', NOW(), NOW()),
(11, 'Design', NOW(), NOW()),
(12, 'UX', NOW(), NOW()),
(13, 'Software Engineering', NOW(), NOW()),
(14, 'Robotics', NOW(), NOW()),
(15, 'Philosophy', NOW(), NOW()),
(16, 'Computer Science', NOW(), NOW()),
(17, 'Programming', NOW(), NOW()),
(18, 'Science Fiction', NOW(), NOW()),
(19, 'NLP', NOW(), NOW()),
(20, 'Chatbots', NOW(), NOW());

-- 3. Thêm Tựa Sách (Books)
INSERT IGNORE INTO books (id, title, isbn, publisher, publication_date, pages, description, cover_image, rating, review_count, shelf_location, deposit_price, created_at, updated_at) VALUES
(1, 'The Algorithmic Mind', '978-1-234-5678', 'Nexus Press', '2023-01-01', 342, 'An illuminating journey into the intersection of human cognition and artificial intelligence. Dr. Rostova deconstructs complex machine learning models to reveal how they parallel, and diverge from, the neurological pathways of the human brain. Essential reading for understanding the future of cognitive technology.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYlDKQmIuqCq-tqTicaKu3Yo3_ZJmzdJmUd9f-5laODWr7iO_6xc5MGw7pBqlgzRYgcmDnPSFJdaSQ3MLmMUdLvZApaDzJS-TC6acVDF90OSsK_8LtBKzFL35XNAECxSEWm4HUfIfhYYYxEGYODvnwWmAhjiZO6N81ta8KxdlnyML3EM3wR7ueblXUxAjcmEZ3JSB0PBWmD6t2M3D7scUBUCwuT4qbfHz6BPkcunChaopBdvaWcadTSqOFQ1KeOwkl_PcFdxndQ-vo', 4.9, 128, 'A3-12', 50000.00, NOW(), NOW()),
(2, 'Echoes of Silence', '978-2-345-6789', 'Horizon Books', '2022-01-01', 298, 'A hauntingly beautiful novel that explores the depths of human connection in an increasingly digital world. Marcus Thorne weaves a narrative that is both intimate and expansive, questioning what it means to truly be heard in the modern age.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA0ugb2mtgwGdYen2kuKtDcr1SgH90WiQ4t-vHPzsDIm0zDpqfLep6XfQ9Av8c80v2tgU3rhAirV116cp4WU6vxAaqbvxP-LsurS-EuqR5nwMDP0bi-oalR1xxqoIp915o3WniSMrmFkdIpZviFowlkY21DMtY0dWHCZoMw8-Iwu0CwAaEL7Dy47Wx-SwJalcesh2S3c5KnGe6KXqBDuo31QzsGJyd6YIyNeROWuCYvY5TvzGIBKEjA4lTGx4c13ZZ_i20rbfPxd7m', 4.7, 95, 'B1-05', 45000.00, NOW(), NOW()),
(3, 'A Brief History of Tomorrow', '978-3-456-7890', 'Cambridge University Press', '2021-01-01', 456, 'Dr. Jenkins takes readers on a sweeping journey through the patterns of history to illuminate possible futures. Drawing on decades of research, she reveals how understanding the past can help us navigate the uncertainties ahead.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBehlRBluY2H86XNuf3iXURag8OtXWdzR6luPuT4-Rz95fi7OdFVShqx6GzXoQL_1TxeQ1eJgUhzMsiMr0qvszKS-w-TRgLwxnEx1m_QW7uo0-Tsc3nx4LKefihl3fK67GYd90rW2TPNHUbOQ76xNdBMxgtPYfYkH37Kh32ujcSJHGthQAh_Yg4MmvfBOaxWRWETJHWKRqOT1CZ8ngmnJSn3tkL5ctkWxrvLIjrphtCon2lbuI_CZrArUWwhI64ltwT-_Z5rq-J0R2x', 4.5, 72, 'C2-18', 55000.00, NOW(), NOW()),
(4, 'Design Systems', '978-4-567-8901', 'O''Reilly Media', '2023-01-01', 280, 'The definitive guide to building and maintaining design systems at scale. Alex Rivera shares practical insights from leading tech companies on how to create cohesive, efficient, and beautiful user interfaces.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV7DbciVnkrS3xPbNq6UHVgda6vZZl5njAKfTRjjTA4_tVAYoxD5hVSN6qghwyj6UDqfkCAbldQhcpQQUfTvt0Kj-yXaFnuzdsuRDAymk9draKu64TLo4MUOQDKNr6WAm7dT-cfnzXfsjcHbVLssYz2g8EDY-3rqN3O3vkf8zzSSvcBir9sb4oWihUCvGb8JHIdDJQoBdNN-RVoGOxkeI6_JmWdPugeZD2ahUxc54v9h9weUoW31mHaqCB2O6Vs6OB7PDckAR1aL23', 4.8, 110, 'D1-03', 60000.00, NOW(), NOW()),
(5, 'Sentient Systems', '978-5-678-9012', 'MIT Press', '2024-01-01', 410, 'An exploration of autonomous systems that blur the line between programmed behavior and genuine sentience. Vance challenges our understanding of consciousness through the lens of cutting-edge robotics and AI research.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMmCiisoJSpv4dvhtaCdcoE1uS_CBtUC8kwsFUNxhgnupzh2gwqkc6Y61JxPoMMe0t1hLC4S9Fc8AOG56NdzVsft_J2ipvPnX6C33CeHDKy52GPyZqEVLz6lu_dZsDLLY2itV8C5MLT15dj45eRZ0J81iwUfWxdKAeiCE-xUwDW8rGHqtvIb08Zg-4B-e_bPNOvXGM_HPoopmXuUMpyNxcCk6oPfjU30Z2uZXIL8IiztciFMYH8PPFcNUkuJG83f6ivzfK5E-N2qRn', 4.6, 88, 'A3-14', 65000.00, NOW(), NOW()),
(6, 'Code & Cognition', '978-6-789-0123', 'Springer', '2023-01-01', 380, 'A groundbreaking interdisciplinary work that explores the cognitive processes behind software development. Dr. Jenkins reveals how understanding the brain can make us better programmers and how coding shapes our thinking.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw80Sw2BU5XvcHA7V09zy6UirEiamVjKAyEZ8laM82itQA-nmvRR5bVmwqL_RncEl3k9MnuPi8hQM1nhdxPaSe8HcpVT50_mAlPN5VIA6iuBd1Fd_wd8pZgE_jTxDq7QZzb4wp-wMQ-swOURcipKmxWZ5CS4ZrMpl2NSgVaxEjJOLq0omNKzLmHZbjjRFGDdZkRe9bZrqfLpnK1Ff3pT2yidmLlg8iK8x4FfTaUtz6x1PQ47VnvDky9wFccasiJAm8rPWq8b_s8Oth', 4.4, 63, 'A3-16', 48000.00, NOW(), NOW()),
(7, 'The Silicon Soul', '978-7-890-1234', 'Penguin Random House', '2024-01-01', 320, 'A philosophical thriller that asks: if we can create a mind indistinguishable from a human one, does it deserve the same rights? Thorne crafts a narrative that is as intellectually stimulating as it is emotionally gripping.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0mQ_hKe7HgA6DuFUeKSc5FwhnUnb_Lj2tn4J0fS-alLeC6U0VBshQ9_WjDjmS4HZzeTkhNbWoOYfnD603hc2gTmAMcXOIF-06YF69D-gi56--JWqYA42lnvnvXmPefVyhF_8k0LwhB_5qAVuIQwwLZttvh4S8CKBxEzDjm46Y6r8z0TYl_XPjmXFS_xI2E7NiTIU0GshppAXbtC5f4Ep75lilbj8Oiykjq_gKWh4Wqgrv_oi3ZUg6qgVJzRizMewoa_-YUNkXRHES', 4.3, 57, 'B2-08', 42000.00, NOW(), NOW()),
(8, 'Conversational AI', '978-8-901-2345', 'ACM Press', '2024-01-01', 265, 'The comprehensive guide to building intelligent conversational systems. From rule-based chatbots to large language models, Chen covers the full spectrum of conversational AI with practical examples and industry case studies.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMQZBwRZKLiwS6s_Ghy2_0232U4u8yrVt0UoLSfqDN1CsrwPHmS4Kd3UrRaqEu5cFueLAfwFeL3RtxDYO7mBdlOrBmIzg1LAifXS5Ke852HdIZXRvjSe4ILboN6D9bnTPk2oVp8CcdJHT_g9gFy4fKK7fq14vo4smnYqVAjuCZEztGQohjl9HlXhovVOfuT65lwKU7ToahWuCAmutimIZCyfsJRzk_ai_vPVd5iaGoXpNl0KfkXbDYOMAEMBlDryuGgvAuZWKCZdpM', 4.2, 45, 'A4-02', 52000.00, NOW(), NOW());

-- 4. Liên kết Sách và Tác giả (book_authors)
INSERT IGNORE INTO book_authors (book_id, author_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8);

-- 5. Liên kết Sách và Thể loại (book_categories)
INSERT IGNORE INTO book_categories (book_id, category_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 6), (2, 7),
(3, 8), (3, 9), (3, 10),
(4, 11), (4, 12), (4, 3), (4, 13),
(5, 1), (5, 14), (5, 15),
(6, 16), (6, 2), (6, 17),
(7, 18), (7, 15), (7, 3),
(8, 1), (8, 19), (8, 20);

-- 6. Tạo các cuốn sách vật lý mẫu (book_copies)
INSERT IGNORE INTO book_copies (book_id, barcode, status, condition_note, created_at, updated_at) VALUES
-- Sách 1 (3 quyển AVAILABLE)
(1, 'BC-10001', 'AVAILABLE', '', NOW(), NOW()),
(1, 'BC-10002', 'AVAILABLE', '', NOW(), NOW()),
(1, 'BC-10003', 'AVAILABLE', '', NOW(), NOW()),
(1, 'BC-10004', 'BORROWED', '', NOW(), NOW()),
(1, 'BC-10005', 'BORROWED', '', NOW(), NOW()),

-- Sách 2 (2 quyển AVAILABLE)
(2, 'BC-20001', 'AVAILABLE', '', NOW(), NOW()),
(2, 'BC-20002', 'AVAILABLE', '', NOW(), NOW()),
(2, 'BC-20003', 'LOST', '', NOW(), NOW()),
(2, 'BC-20004', 'BORROWED', '', NOW(), NOW()),

-- Sách 3 (1 quyển AVAILABLE)
(3, 'BC-30001', 'AVAILABLE', '', NOW(), NOW()),
(3, 'BC-30002', 'BORROWED', '', NOW(), NOW()),
(3, 'BC-30003', 'BORROWED', '', NOW(), NOW()),

-- Các cuốn còn lại có 1 quyển mẫu
(4, 'BC-40001', 'AVAILABLE', '', NOW(), NOW()),
(5, 'BC-50001', 'AVAILABLE', '', NOW(), NOW()),
(6, 'BC-60001', 'AVAILABLE', '', NOW(), NOW()),
(7, 'BC-70001', 'AVAILABLE', '', NOW(), NOW()),
(8, 'BC-80001', 'AVAILABLE', '', NOW(), NOW());
