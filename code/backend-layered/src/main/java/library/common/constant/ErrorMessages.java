package library.common.constant;

/**
 * Tập trung tất cả error messages dùng trong ứng dụng.
 * Ctrl+Click vào constant để xem nội dung.
 */
public final class ErrorMessages {

    private ErrorMessages() {}

    // --- System ---
    public static final String SYSTEM_ERROR = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";
    public static final String UNAUTHORIZED = "Bạn chưa được xác thực";
    public static final String FORBIDDEN = "Bạn không có quyền thực hiện thao tác này";
    public static final String ACCOUNT_LOCKED = "Tài khoản đã bị khóa hoặc không tồn tại";
    public static final String DATA_INTEGRITY_VIOLATION = "Dữ liệu bị trùng lặp hoặc vi phạm ràng buộc dữ liệu";
    public static final String INVALID_DATA = "Dữ liệu không hợp lệ: ";
    public static final String GOOGLE_AUTH_FAILED = "Xác thực tài khoản Google thất bại. Vui lòng thử lại.";
    public static final String GOOGLE_TOKEN_INVALID = "Google ID Token không hợp lệ hoặc đã hết hạn";
    public static final String FILE_UPLOAD_FAILED = "Đã xảy ra lỗi khi tải tệp lên. Vui lòng thử lại.";

    // --- Not Found ---
    public static final String NOT_FOUND_USER = "Không tìm thấy người dùng";
    public static final String NOT_FOUND_USER_BY_EMAIL = "Không tìm thấy tài khoản với email này";
    public static final String NOT_FOUND_ACCOUNT = "Không tìm thấy tài khoản";
    public static final String NOT_FOUND_BOOK = "Không tìm thấy sách";
    public static final String NOT_FOUND_BOOK_BY_ID = "Không tìm thấy sách với ID: ";
    public static final String NOT_FOUND_BOOK_COPY = "Không tìm thấy bản sao sách";
    public static final String NOT_FOUND_BOOK_COPY_BY_ID = "Không tìm thấy bản sao sách: ";
    public static final String NOT_FOUND_BOOK_COPY_IN_ORDER = "Không tìm thấy bản sao sách trong phiếu mượn này";
    public static final String NOT_FOUND_BORROW_ORDER = "Không tìm thấy phiếu mượn";
    public static final String NOT_FOUND_BORROW_ORDER_BY_ID = "Không tìm thấy phiếu mượn: ";
    public static final String NOT_FOUND_BORROW_ORDER_NO_PERMISSION = "Không tìm thấy phiếu mượn hoặc bạn không có quyền xem phiếu này";
    public static final String NOT_FOUND_BORROW_ORDER_CHECK_INFO = "Không tìm thấy phiếu mượn. Vui lòng kiểm tra lại thông tin.";
    public static final String NOT_FOUND_BORROW_ORDER_NO_MATCH = "Không tìm thấy đơn mượn nào khớp với thông tin cung cấp.";
    public static final String NOT_FOUND_REVIEW = "Không tìm thấy đánh giá";
    public static final String NOT_FOUND_CATEGORY = "Không tìm thấy thể loại";
    public static final String NOT_FOUND_AUTHOR = "Không tìm thấy tác giả";
    public static final String NOT_FOUND_NOTIFICATION = "Không tìm thấy thông báo";
    public static final String NOT_FOUND_CUSTOMER = "Không tìm thấy khách hàng";
    public static final String NOT_FOUND_RESERVATION = "Không tìm thấy đặt giữ sách";
    public static final String NOT_FOUND_BOOK_VISIT = "Không tìm thấy lượt hẹn";
    public static final String NOT_FOUND_BOOK_RETURN = "Không tìm thấy lượt trả sách";
    public static final String NOT_FOUND_FINE = "Không tìm thấy khoản phạt: ";
    public static final String NOT_FOUND_ASSISTANT = "Không tìm thấy người dùng: ";
    public static final String NOT_FOUND_ASSISTANT_PROFILE = "Không tìm thấy hồ sơ trợ lý cho người dùng: ";

    // --- Auth ---
    public static final String AUTH_EMAIL_EXISTS = "Email đã được sử dụng";
    public static final String AUTH_PASSWORD_INCORRECT = "Mật khẩu hiện tại không chính xác";
    public static final String AUTH_PASSWORD_SAME_AS_CURRENT = "Mật khẩu mới không được trùng với mật khẩu hiện tại";
    public static final String AUTH_OTP_INVALID = "Mã xác nhận (OTP) không chính xác hoặc đã hết hạn";
    public static final String AUTH_RESET_TOKEN_INVALID = "Token đổi mật khẩu không hợp lệ hoặc đã hết hạn";
    public static final String AUTH_ACCOUNT_LOCKED = "Tài khoản đã bị khoá";
    public static final String AUTH_REFRESH_TOKEN_INVALID = "Refresh Token không hợp lệ";
    public static final String AUTH_REFRESH_TOKEN_EXPIRED = "Refresh Token đã hết hạn, vui lòng đăng nhập lại";
    public static final String AUTH_LOGIN_FAILED = "Sai tài khoản hoặc mật khẩu";
    public static final String AUTH_ACCOUNT_NOT_ACTIVE = "Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.";
    public static final String AUTH_ACTIVATION_TOKEN_INVALID = "Token kích hoạt không hợp lệ hoặc đã hết hạn.";
    public static final String AUTH_ACCOUNT_ALREADY_ACTIVE = "Tài khoản đã được kích hoạt.";

    // --- Book ---
    public static final String BOOK_ISBN_DUPLICATE = "Sách với mã ISBN này đã tồn tại trong thư viện";
    public static final String BOOK_TITLE_DUPLICATE = "Sách với tiêu đề này đã tồn tại. Vui lòng quản lý số lượng bằng bản sao sách thay vì tạo đầu sách trùng.";
    public static final String BOOK_COPY_NOT_AVAILABLE = "Bản sao sách không sẵn sàng để mượn: ";

    // --- Borrow ---
    public static final String BORROW_PICKUP_DATE_PAST = "Ngày nhận sách không được ở quá khứ";
    public static final String BORROW_RETURN_DATE_BEFORE_PICKUP = "Ngày trả sách phải sau ngày nhận sách";
    public static final String BORROW_ORDER_NOT_ACTIVE = "Phiếu mượn không ở trạng thái đang hoạt động (đang mượn, quá hạn hoặc trả một phần)";
    public static final String BORROW_BARCODE_REQUIRED = "Vui lòng nhập ít nhất một mã vạch sách";
    public static final String BORROW_PHONE_REQUIRED = "Số điện thoại là bắt buộc";
    public static final String BORROW_PAYMENT_ALREADY_DONE = "Thanh toán hoặc hoàn tiền cho lượt trả sách này đã được xác nhận";
    public static final String BORROW_NO_CANCEL_PERMISSION = "Bạn không có quyền hủy phiếu mượn này";
    public static final String BORROW_CANCEL_INVALID_STATUS = "Chỉ có thể hủy phiếu đang chờ duyệt hoặc chờ lấy sách";

    // --- Review ---
    public static final String REVIEW_NOT_OWNER_EDIT = "Bạn chỉ có thể chỉnh sửa đánh giá của chính mình";
    public static final String REVIEW_NOT_OWNER_DELETE = "Bạn chỉ có thể xóa đánh giá của chính mình";

    // --- Notification ---
    public static final String NOTIFICATION_NO_PERMISSION = "Không có quyền cập nhật thông báo này";

    // --- Category ---
    public static final String CATEGORY_ALREADY_EXISTS = "Thể loại đã tồn tại";
    public static final String CATEGORY_NAME_EXISTS = "Tên thể loại đã tồn tại";

    // --- Reservation ---
    public static final String RESERVATION_BOOK_AVAILABLE = "Sách hiện còn bản có thể mượn. Vui lòng mượn trực tiếp.";
    public static final String RESERVATION_ALREADY_ACTIVE = "Bạn đã có lượt đặt giữ sách đang hoạt động cho sách này";
    public static final String RESERVATION_NO_PERMISSION = "Bạn không có quyền hủy đặt giữ sách này";
    public static final String RESERVATION_INVALID_STATUS = "Chỉ có thể hủy đặt giữ sách đang chờ lấy hoặc đã được thông báo";

    // --- Favourite ---
    public static final String FAVOURITE_ALREADY_EXISTS = "Sách đã có trong danh sách yêu thích";
    public static final String FAVOURITE_NOT_FOUND = "Sách không có trong danh sách yêu thích";
}
