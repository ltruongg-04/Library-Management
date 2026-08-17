package library.service.impl;

import library.common.constant.ErrorMessages;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.OtpService;
import library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    @Override
    @Transactional
    public void changePassword(String email, library.dto.request.ChangePasswordRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException(ErrorMessages.NOT_FOUND_USER, HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new library.common.exception.CustomBusinessException(ErrorMessages.AUTH_PASSWORD_INCORRECT, HttpStatus.BAD_REQUEST);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new library.common.exception.CustomBusinessException(ErrorMessages.AUTH_PASSWORD_SAME_AS_CURRENT, HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void forgotPassword(library.dto.request.ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new library.common.exception.CustomBusinessException(ErrorMessages.NOT_FOUND_USER_BY_EMAIL, HttpStatus.NOT_FOUND));

        otpService.requestForgotPasswordOtp(request.getEmail());
    }

    @Override
    public library.dto.response.VerifyOtpResponse verifyForgotPasswordOtp(library.dto.request.VerifyOtpRequest request) {
        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            throw new library.common.exception.CustomBusinessException(ErrorMessages.AUTH_OTP_INVALID, HttpStatus.BAD_REQUEST);
        }

        // OTP is valid, we can clear it and issue a reset token
        otpService.clearOtp(request.getEmail());
        String resetToken = otpService.generateResetToken(request.getEmail());
        
        return library.dto.response.VerifyOtpResponse.builder()
                .resetToken(resetToken)
                .build();
    }

    @Override
    @Transactional
    public void resetPassword(library.dto.request.ResetPasswordRequest request) {
        String email = otpService.validateAndGetEmailFromResetToken(request.getResetToken());
        if (email == null) {
            throw new library.common.exception.CustomBusinessException(ErrorMessages.AUTH_RESET_TOKEN_INVALID, HttpStatus.BAD_REQUEST);
        }

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException(ErrorMessages.NOT_FOUND_USER_BY_EMAIL, HttpStatus.NOT_FOUND));

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new library.common.exception.CustomBusinessException(ErrorMessages.AUTH_PASSWORD_SAME_AS_CURRENT, HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // Remove reset token after successful reset
        otpService.clearResetToken(request.getResetToken());
    }
}
