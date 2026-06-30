export const ROLES = {
    PAGE_TITLE: "Vai trò & Phân quyền",

    PAGE_DESCRIPTION:
        "Quản lý vai trò và phân quyền truy cập trong hệ thống thư viện. Đảm bảo mỗi người dùng chỉ được cấp những quyền cần thiết theo đúng vai trò.",

    CREATE_ROLE: "Tạo vai trò mới",

    ROLE_LIST_TITLE: "Danh sách vai trò",

    EDITING_ROLE: "Đang chỉnh sửa",

    SAVE_CHANGES: "Lưu thay đổi",

    DISCARD_CHANGES: "Hủy",

    EMPTY_PERMISSION: "Không có quyền nào.",

    SECURITY_POLICY_TITLE: "Chính sách bảo mật",

    SECURITY_POLICY_DESCRIPTION:
        "Các vai trò cốt lõi (Quản trị viên, Độc giả) có các quyền mặc định không thể thay đổi nhằm đảm bảo tính ổn định và an toàn của hệ thống.",

    ROLE: {
        ADMINISTRATOR: {
            NAME: "Quản trị viên",
            DESCRIPTION: "Toàn quyền quản lý và cấu hình hệ thống.",
        },

        LIBRARIAN: {
            NAME: "Thủ thư",
            DESCRIPTION: "Quản lý sách và hỗ trợ người dùng.",
        },

        CUSTOMER: {
            NAME: "Độc giả",
            DESCRIPTION: "Quyền truy cập và mượn sách cơ bản.",
        },

        GUEST: {
            NAME: "Khách",
            DESCRIPTION: "Chỉ được xem danh mục sách.",
        },
    },

    MODULE: {
        BOOKS: "Sách & Danh mục",

        BORROWING: "Mượn trả",
    },

    PERMISSION: {
        ADD_BOOK: {
            TITLE: "Thêm sách mới",

            DESCRIPTION: "Cho phép thêm sách mới vào danh mục của thư viện.",
        },

        EDIT_BOOK: {
            TITLE: "Chỉnh sửa thông tin sách",

            DESCRIPTION: "Cho phép chỉnh sửa tiêu đề, tác giả và các thông tin phân loại của sách.",
        },

        DELETE_BOOK: {
            TITLE: "Xóa sách",

            DESCRIPTION: "Cho phép xóa vĩnh viễn sách khỏi danh mục.",
        },

        APPROVE_BORROWS: {
            TITLE: "Phê duyệt yêu cầu mượn",

            DESCRIPTION: "Cho phép phê duyệt hoặc ghi đè các yêu cầu mượn sách đặc biệt.",
        },

        WAIVE_FINES: {
            TITLE: "Miễn phí phạt",

            DESCRIPTION: "Cho phép xóa hoặc miễn các khoản phí phạt trễ hạn cho độc giả.",
        },
    },

    ICON: {
        ADD: "add",

        POLICY: "policy",

        LOCK: "lock",

        BOOK: "library_books",

        BORROW: "sync_alt",

        CHEVRON: "chevron_right",
    },
} as const;
