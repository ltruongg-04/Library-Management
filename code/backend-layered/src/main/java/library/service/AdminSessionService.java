package library.service;

import library.dto.admin.AdminSessionDto;
import java.util.List;

public interface AdminSessionService {
    List<AdminSessionDto> getUserSessions(Integer userId);
    List<AdminSessionDto> getAllSessions();
    void terminateSession(String sessionId);
    void terminateAllUserSessions(Integer userId);
}
