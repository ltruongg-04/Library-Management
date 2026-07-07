package library.service.impl;

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
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;

    @Override
    @Transactional
    public void changePassword(String email, library.dto.request.ChangePasswordRequest request) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy người dùng", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new library.common.exception.CustomBusinessException("Mật khẩu hiện tại không chính xác", HttpStatus.BAD_REQUEST);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new library.common.exception.CustomBusinessException("Mật khẩu mới không được trùng với mật khẩu hiện tại", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public void forgotPassword(library.dto.request.ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy tài khoản với email này", HttpStatus.NOT_FOUND));

        otpService.requestForgotPasswordOtp(request.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(library.dto.request.ResetPasswordRequest request) {
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("Không tìm thấy tài khoản với email này", HttpStatus.NOT_FOUND));

        boolean isValid = otpService.validateOtp(request.getEmail(), request.getOtp());
        if (!isValid) {
            throw new library.common.exception.CustomBusinessException("Mã xác nhận (OTP) không chính xác hoặc đã hết hạn", HttpStatus.BAD_REQUEST);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new library.common.exception.CustomBusinessException("Mật khẩu mới không được trùng với mật khẩu hiện tại", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
