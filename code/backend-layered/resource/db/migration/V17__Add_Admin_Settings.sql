ALTER TABLE borrowing_policies
    ADD COLUMN max_extensions INT DEFAULT 2,
    ADD COLUMN rental_fee_per_day DECIMAL(10, 2) DEFAULT 5000.00;

CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO system_settings (setting_key, setting_value) VALUES
('features.aiSearch', 'true'),
('features.onlinePayments', 'true'),
('features.autoBackup', 'true'),
('localization.language', 'vi'),
('localization.timezone', 'utc-plus-7');
