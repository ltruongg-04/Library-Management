package library.service;

import library.dto.request.ChangePasswordRequest;
import library.dto.request.ForgotPasswordRequest;
import library.dto.request.ResetPasswordRequest;

public interface UserService {
    void changePassword(String email, ChangePasswordRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
