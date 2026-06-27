export const PROFILE = {
    LAYOUT: {
        BRAND: "Lumina Library",
    },
    PAGE: {
        HEADING: "Thông tin cá nhân",
        SUBHEADING: "Cập nhật thông tin cá nhân và cách thư viện có thể liên hệ với bạn.",
    },
    SIDEBAR: {
        HEADING: "Cài đặt",
        MENU: {
            PERSONAL_INFO: "Thông tin cá nhân",
            SECURITY: "Bảo mật",
            NOTIFICATIONS: "Thông báo",
            AI_CONFIG: "Cấu hình AI",
        },
    },
    AVATAR: {
        HEADING: "Ảnh đại diện",
        SUBHEADING: "Hỗ trợ JPG, GIF hoặc PNG. Kích thước tối đa 800K.",
        UPLOAD_BTN: "Tải ảnh mới",
        REMOVE_BTN: "Gỡ ảnh",
        IMG_ALT: "Ảnh đại diện",
        UPLOAD_ALERT: "Tải ảnh đại diện",
        REMOVE_ALERT: "Gỡ ảnh đại diện",
    },
    FORM: {
        FULL_NAME_LABEL: "Họ và tên",
        FULL_NAME_PLACEHOLDER: "Nhập họ và tên",
        EMAIL_LABEL: "Địa chỉ email",
        EMAIL_PLACEHOLDER: "Nhập email",
        PHONE_LABEL: "Số điện thoại",
        PHONE_PLACEHOLDER: "Nhập số điện thoại",
        BIO_LABEL: "Giới thiệu",
        BIO_PLACEHOLDER: "Viết đôi dòng về bạn",
        CHAR_COUNT_SUFFIX: "ký tự",
        CANCEL_BTN: "Hủy",
        SAVE_BTN: "Lưu",
        SUCCESS_MSG: "Cập nhật hồ sơ thành công!",
        ERRORS: {
            FULL_NAME_REQUIRED: "Vui lòng nhập họ và tên.",
            EMAIL_REQUIRED: "Vui lòng nhập email.",
            EMAIL_INVALID: "Email không đúng định dạng.",
            PHONE_REQUIRED: "Vui lòng nhập số điện thoại.",
            BIO_MAX_LENGTH: "Giới thiệu không được vượt quá 500 ký tự.",
        },
    },
};

export const SETTINGS_HEADER = {
    BRAND: "Lumina Library",
    NAV_CATALOG: "Danh mục",
    NAV_COLLECTIONS: "Bộ sưu tập",
    NAV_BRANCHES: "Chi nhánh",
    AVATAR_ALT: "Ảnh đại diện người dùng",
};

export const SETTINGS_SIDEBAR = {
    HEADING: "Cài đặt",
    MENU: {
        PERSONAL_INFO: "Thông tin cá nhân",
        SECURITY: "Bảo mật",
        NOTIFICATIONS: "Thông báo",
        AI_CONFIG: "Cấu hình AI",
    },
};

export const SETTINGS_NOTIFICATIONS = {
    PAGE: {
        HEADING: "Cài đặt thông báo",
        SUBHEADING: "Kiểm soát cách Lumina Library liên hệ với bạn. Tùy chỉnh cảnh báo để nhận thông tin cần thiết mà không bị làm phiền.",
        EMAIL_NOTIFICATIONS: "Thông báo qua email",
        PUSH_NOTIFICATIONS: "Thông báo đẩy",
        NEW_ARRIVALS_TITLE: "Sách mới về",
        NEW_ARRIVALS_DESC: "Nhận thông báo khi sách của tác giả bạn yêu thích có trong thư viện.",
        DUE_DATE_TITLE: "Nhắc hạn trả sách",
        DUE_DATE_DESC: "Nhận cảnh báo 3 ngày trước khi tài liệu đến hạn trả.",
        RESERVATION_TITLE: "Thông báo đặt trước",
        RESERVATION_DESC: "Chúng tôi sẽ báo ngay khi sách bạn đặt trước đã sẵn sàng.",
        MOBILE_ALERTS_TITLE: "Cảnh báo trên di động",
        MOBILE_ALERTS_DESC: "Gửi thông báo tức thời đến các thiết bị đã đăng ký.",
        SUCCESS_MSG: "Cài đặt thông báo đã được lưu thành công.",
    },
};

export const SETTINGS_SECURITY = {
    PAGE: {
        HEADING: "Cài đặt bảo mật",
        SUBHEADING: "Quản lý thông tin đăng nhập, bật xác thực hai lớp và theo dõi các phiên đang hoạt động trong hệ thống Lumina.",
        CHANGE_PASSWORD: "Đổi mật khẩu",
        CURRENT_PASSWORD_LABEL: "Mật khẩu hiện tại",
        CURRENT_PASSWORD_PLACEHOLDER: "Nhập mật khẩu hiện tại",
        NEW_PASSWORD_LABEL: "Mật khẩu mới",
        NEW_PASSWORD_PLACEHOLDER: "Tối thiểu 8 ký tự",
        CONFIRM_NEW_LABEL: "Xác nhận mật khẩu mới",
        CONFIRM_NEW_PLACEHOLDER: "Nhập lại mật khẩu mới",
        UPDATE_PASSWORD_BTN: "Cập nhật mật khẩu",
        PASSWORD_ELIGIBLE: "Đủ điều kiện",
        PASSWORD_INELIGIBLE: "Chưa đủ điều kiện",
        PASSWORD_MATCH: "Trùng khớp",
        PASSWORD_MISMATCH: "Chưa trùng khớp",
        TWO_FACTOR_TITLE: "Xác thực hai lớp",
        TWO_FACTOR_DESC: "Thêm một lớp bảo vệ cho tài khoản của bạn. Chúng tôi khuyến nghị bật tính năng này để bảo vệ lịch sử đọc và dữ liệu cá nhân.",
        TWO_FACTOR_ENABLED: "Đang bật",
        TWO_FACTOR_DISABLED: "Đang tắt",
        LOGIN_ACTIVITY: "Hoạt động đăng nhập",
        LOG_OUT_ALL_BTN: "Đăng xuất tất cả",
        EMPTY_SESSIONS: "Không có phiên đăng nhập nào.",
        ACTIVE_NOW: "Đang hoạt động",
        SUCCESS_MESSAGES: {
            PASSWORD_UPDATED: "Mật khẩu đã được cập nhật thành công.",
            TWO_FACTOR_ENABLED: "Xác thực hai lớp đã được bật.",
            TWO_FACTOR_DISABLED: "Xác thực hai lớp đã được tắt.",
            LOGGED_OUT_ALL: "Tất cả phiên đăng nhập khác đã được đăng xuất.",
        },
        SESSIONS: {
            MACBOOK_TITLE: "MacBook Pro - Safari",
            MACBOOK_SUBTITLE: "San Francisco, CA, Hoa Kỳ - 192.168.1.1",
            IPHONE_TITLE: "iPhone 13 - Ứng dụng Lumina",
            IPHONE_SUBTITLE: "San Jose, CA, Hoa Kỳ - Hôm qua, 16:20",
            WINDOWS_TITLE: "Windows PC - Chrome",
            WINDOWS_SUBTITLE: "Seattle, WA, Hoa Kỳ - 12/10, 10:05",
        },
    },
};
