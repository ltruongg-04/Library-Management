package library.service;

import library.dto.request.ChangePasswordRequest;
import library.dto.request.ForgotPasswordRequest;

public interface UserService {
    void changePassword(String email, ChangePasswordRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(library.dto.request.ResetPasswordRequest request);
    library.dto.response.VerifyOtpResponse verifyForgotPasswordOtp(library.dto.request.VerifyOtpRequest request);
}
