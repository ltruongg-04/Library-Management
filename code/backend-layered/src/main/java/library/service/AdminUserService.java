package library.service;

import library.dto.admin.AdminUserResponseDto;
import library.dto.admin.AdminUpdateUserDto;

import java.util.List;

public interface AdminUserService {
    List<AdminUserResponseDto> getAllUsers();
    void updateUserStatus(Integer userId, boolean isActive);
    void updateUser(Integer userId, AdminUpdateUserDto request);
    void createUser(library.dto.admin.AdminCreateUserDto request);
}
