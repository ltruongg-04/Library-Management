package library.service.impl;

import library.dto.admin.AdminSessionDto;
import library.repository.UserRepository;
import library.service.AdminSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminSessionServiceImpl implements AdminSessionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final UserRepository userRepository;

    private static final String SESSION_PREFIX = "session:";
    private static final String USER_SESSIONS_PREFIX = "user_sessions:";

    @Override
    public List<AdminSessionDto> getUserSessions(Integer userId) {
        String userSessionsKey = USER_SESSIONS_PREFIX + userId;
        Set<Object> tokens = redisTemplate.opsForSet().members(userSessionsKey);
        
        List<AdminSessionDto> sessions = new ArrayList<>();
        if (tokens != null) {
            for (Object tokenObj : tokens) {
                String token = (String) tokenObj;
                AdminSessionDto sessionInfo = (AdminSessionDto) redisTemplate.opsForValue().get(SESSION_PREFIX + token);
                if (sessionInfo != null) {
                    sessions.add(sessionInfo);
                } else {
                    // Clean up expired tokens
                    redisTemplate.opsForSet().remove(userSessionsKey, token);
                }
            }
        }
        return sessions;
    }

    @Override
    public List<AdminSessionDto> getAllSessions() {
        // Warning: keys() should be avoided in production if Redis is large, but for this project it's okay.
        Set<String> keys = redisTemplate.keys(SESSION_PREFIX + "*");
        List<AdminSessionDto> allSessions = new ArrayList<>();
        
        if (keys != null) {
            for (String key : keys) {
                AdminSessionDto session = (AdminSessionDto) redisTemplate.opsForValue().get(key);
                if (session != null) {
                    allSessions.add(session);
                }
            }
        }
        return allSessions;
    }

    @Override
    public void terminateSession(String sessionId) {
        AdminSessionDto session = (AdminSessionDto) redisTemplate.opsForValue().get(SESSION_PREFIX + sessionId);
        if (session != null) {
            redisTemplate.delete(SESSION_PREFIX + sessionId);
            redisTemplate.opsForSet().remove(USER_SESSIONS_PREFIX + session.getUserId(), sessionId);
        }
    }

    @Override
    public void terminateAllUserSessions(Integer userId) {
        String userSessionsKey = USER_SESSIONS_PREFIX + userId;
        Set<Object> tokens = redisTemplate.opsForSet().members(userSessionsKey);
        if (tokens != null) {
            for (Object tokenObj : tokens) {
                String token = (String) tokenObj;
                redisTemplate.delete(SESSION_PREFIX + token);
            }
            redisTemplate.delete(userSessionsKey);
        }
    }
}
