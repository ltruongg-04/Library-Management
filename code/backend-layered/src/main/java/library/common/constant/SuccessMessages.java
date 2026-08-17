package library.common.constant;

/**
 * Tập trung tất cả success messages dùng trong Controller responses.
 */
public final class SuccessMessages {

    private SuccessMessages() {}

    // --- Auth ---
    public static final String AUTH_REGISTER = "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.";
    public static final String AUTH_ACTIVATE = "Kích hoạt tài khoản thành công";
    public static final String AUTH_RESEND_ACTIVATION = "Đã gửi lại email kích hoạt";
    public static final String AUTH_LOGIN = "Đăng nhập thành công";
    public static final String AUTH_GOOGLE_LOGIN = "Đăng nhập Google thành công";
    public static final String AUTH_LOGOUT = "Đăng xuất thành công";
    public static final String AUTH_TOKEN_REFRESH = "Làm mới token thành công";
    public static final String AUTH_PASSWORD_CHANGED = "Đổi mật khẩu thành công";
    public static final String AUTH_FORGOT_PASSWORD = "Mã xác nhận đã được gửi tới email";
    public static final String AUTH_VERIFY_OTP = "Xác thực OTP thành công";
    public static final String AUTH_RESET_PASSWORD = "Đặt lại mật khẩu thành công";

    // --- Borrow ---
    public static final String BORROW_GUEST_CREATED = "Tạo phiếu mượn cho khách thành công";
    public static final String BORROW_OTP_SENT = "Đã gửi mã OTP tới email của bạn";
    public static final String BORROW_LOOKUP = "Tra cứu phiếu mượn thành công";
    public static final String BORROW_LOOKUP_LIST = "Tra cứu danh sách phiếu mượn thành công";
}
