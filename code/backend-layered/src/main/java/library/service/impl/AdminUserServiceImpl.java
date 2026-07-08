package library.service.impl;

import library.dto.admin.AdminUserResponseDto;
import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.AdminUserService;
import library.service.SystemLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final library.repository.CustomerRepository customerRepository;
    private final library.repository.AssistantRepository assistantRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemLogService systemLogService;
    private final library.mapper.UserMapper userMapper;

    @Override
    public List<AdminUserResponseDto> getAllUsers() {
        List<UserEntity> users = userRepository.findAll();
        return users.stream().map(userMapper::toAdminUserResponseDto).collect(Collectors.toList());
    }

    @Override
    public void updateUserStatus(Integer userId, boolean isActive) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("User not found", org.springframework.http.HttpStatus.NOT_FOUND));
        
        user.setActive(isActive);
        userRepository.save(user);
        
        systemLogService.logAction("Cập nhật trạng thái người dùng", 
            "Admin đã " + (isActive ? "mở khóa" : "khóa") + " tài khoản: " + user.getEmail());
    }

    @Override
    public void updateUser(Integer userId, library.dto.admin.AdminUpdateUserDto request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new library.common.exception.CustomBusinessException("User not found", org.springframework.http.HttpStatus.NOT_FOUND));
        
        user.setFullName(request.getFullName());

        if (request.getRole() != null && !request.getRole().isEmpty()) {
            if (user.getRole() == UserEntity.Role.ADMIN && !request.getRole().equalsIgnoreCase("ADMIN")) {
                throw new library.common.exception.CustomBusinessException("Không thể thay đổi quyền của Admin", org.springframework.http.HttpStatus.FORBIDDEN);
            }
            if (user.getRole() != UserEntity.Role.ADMIN && request.getRole().equalsIgnoreCase("ADMIN")) {
                throw new library.common.exception.CustomBusinessException("Không được cấp quyền Admin", org.springframework.http.HttpStatus.FORBIDDEN);
            }
            
            try {
                String roleStr = request.getRole().toUpperCase();
                if ("USER".equals(roleStr)) roleStr = "CUSTOMER";
                UserEntity.Role newRole = UserEntity.Role.valueOf(roleStr);
                
                // If role actually changed
                if (user.getRole() != newRole) {
                    // Changing to Librarian
                    if (newRole == UserEntity.Role.LIBRARIAN) {
                        // Delete Customer if exists
                        customerRepository.findByUserId(user.getId()).ifPresent(customerRepository::delete);
                        
                        // Create Assistant if not exists
                        if (assistantRepository.findByUserId(user.getId()).isEmpty()) {
                            library.entity.AssistantEntity assistant = library.entity.AssistantEntity.builder()
                                    .user(user)
                                    .employeeCode("LIB-" + java.util.UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                                    .hireDate(java.time.LocalDate.now())
                                    .status(library.entity.AssistantEntity.Status.ACTIVE)
                                    .build();
                            assistantRepository.save(assistant);
                        }
                    } 
                    // Changing to Customer
                    else if (newRole == UserEntity.Role.CUSTOMER || newRole == UserEntity.Role.USER) {
                        // Delete Assistant if exists
                        assistantRepository.findByUserId(user.getId()).ifPresent(assistantRepository::delete);
                        
                        // Create Customer if not exists
                        if (customerRepository.findByUserId(user.getId()).isEmpty()) {
                            library.entity.CustomerEntity customer = library.entity.CustomerEntity.builder()
                                    .user(user)
                                    .fullName(user.getFullName())
                                    .phone(user.getPhone() != null ? user.getPhone() : "0000000000")
                                    .email(user.getEmail())
                                    .address("Chưa cập nhật")
                                    .build();
                            customerRepository.save(customer);
                        }
                    }
                }
                
                user.setRole(newRole);
            } catch (IllegalArgumentException e) {
                // Ignore invalid roles
            }
        }
        
        userRepository.save(user);
        systemLogService.logAction("Cập nhật người dùng", "Admin đã cập nhật thông tin người dùng: " + user.getEmail());
    }

    @Override
    public void createUser(library.dto.admin.AdminCreateUserDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new library.common.exception.CustomBusinessException("Email đã được sử dụng", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        UserEntity.Role role;
        try {
            String roleStr = request.getRole().toUpperCase();
            if ("CUSTOMER".equals(roleStr)) {
                roleStr = "CUSTOMER";
            }
            role = UserEntity.Role.valueOf(roleStr);
            if (role == UserEntity.Role.ADMIN) {
                throw new library.common.exception.CustomBusinessException("Không được phép tạo tài khoản có quyền Admin", org.springframework.http.HttpStatus.FORBIDDEN);
            }
        } catch (IllegalArgumentException e) {
            role = UserEntity.Role.CUSTOMER;
        }

        UserEntity user = UserEntity.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .active(true)
                .build();

        UserEntity savedUser = userRepository.save(user);

        if (role == UserEntity.Role.CUSTOMER || role == UserEntity.Role.USER) {
            library.entity.CustomerEntity customer = library.entity.CustomerEntity.builder()
                    .user(savedUser)
                    .fullName(savedUser.getFullName())
                    .phone(savedUser.getPhone() != null ? savedUser.getPhone() : "0000000000")
                    .email(savedUser.getEmail())
                    .address("Chưa cập nhật")
                    .build();
            customerRepository.save(customer);
        } else if (role == UserEntity.Role.LIBRARIAN) {
            library.entity.AssistantEntity assistant = library.entity.AssistantEntity.builder()
                    .user(savedUser)
                    .employeeCode("LIB-" + java.util.UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                    .hireDate(java.time.LocalDate.now())
                    .status(library.entity.AssistantEntity.Status.ACTIVE)
                    .build();
            assistantRepository.save(assistant);
        }
        
        systemLogService.logAction("Tạo người dùng mới", "Admin đã tạo tài khoản mới: " + savedUser.getEmail() + " với quyền " + role.name());
    }
}
