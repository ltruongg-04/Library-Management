package library.common.constant;

public class SystemLogConstants {

    // Statuses
    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_FAILED = "FAILED";

    // Actions
    public static final String ACTION_LOGOUT = "Đăng xuất";
    public static final String ACTION_GUEST_CREATE_ORDER = "Khách tạo đơn mượn";
    public static final String ACTION_VNPAY_IPN = "Thanh toán VNPay (IPN)";
    public static final String ACTION_VNPAY_RETURN = "Thanh toán VNPay (Return)";
    public static final String ACTION_VNPAY_FAIL = "Thanh toán VNPay";

    // Detail Templates
    public static final String DETAIL_LOGOUT_SUCCESS = "Người dùng %s đã đăng xuất khỏi hệ thống.";
    public static final String DETAIL_GUEST_ORDER_SUCCESS = "Khách vãng lai (%s - %s) đã tạo đơn mượn: %s";
    public static final String DETAIL_VNPAY_IPN_SUCCESS = "Giao dịch thanh toán tự động qua VNPay THÀNH CÔNG cho đơn: %s";
    public static final String DETAIL_VNPAY_RETURN_SUCCESS = "Giao dịch thanh toán qua VNPay THÀNH CÔNG cho đơn: %s";
    public static final String DETAIL_VNPAY_FAIL = "Giao dịch thanh toán qua VNPay THẤT BẠI cho đơn: %s";
}
