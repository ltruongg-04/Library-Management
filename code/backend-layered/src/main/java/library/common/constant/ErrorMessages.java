package library.common.constant;

public final class ErrorMessages {

    private ErrorMessages() {}

    public static final String SYSTEM_ERROR = "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";
    public static final String UNAUTHORIZED = "Bạn chưa được xác thực";
    public static final String FORBIDDEN = "Bạn không có quyền thực hiện thao tác này";
    public static final String ACCOUNT_LOCKED = "Tài khoản đã bị khóa hoặc không tồn tại";
    public static final String DATA_INTEGRITY_VIOLATION = "Dữ liệu bị trùng lặp hoặc vi phạm ràng buộc dữ liệu";
    public static final String INVALID_DATA = "Dữ liệu không hợp lệ: ";
    public static final String GOOGLE_AUTH_FAILED = "Xác thực tài khoản Google thất bại. Vui lòng thử lại.";
    public static final String GOOGLE_TOKEN_INVALID = "Google ID Token không hợp lệ hoặc đã hết hạn";
    public static final String FILE_UPLOAD_FAILED = "Đã xảy ra lỗi khi tải tệp lên. Vui lòng thử lại.";
}
