package library.unitest;

import library.entity.UserEntity;
import library.repository.UserRepository;
import library.service.LoginAttemptService;
import library.service.SystemLogService;
import library.service.impl.LoginAttemptServiceImpl;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Chạy trên H2 trong bộ nhớ vì điểm cần kiểm tra là dữ liệu có thực sự được commit hay không.
 */
@DataJpaTest(properties = {
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
@Import(LoginAttemptServiceImpl.class)
@Transactional(propagation = Propagation.NOT_SUPPORTED)
class LoginAttemptServiceTest {

    private static final int MAX_ATTEMPTS = 5;

    @Autowired
    private LoginAttemptService loginAttemptService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PlatformTransactionManager transactionManager;
    @MockitoBean
    private SystemLogService systemLogService;

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }

    @Test
    void failedAttemptSurvivesRollbackOfOuterTransaction() {
        Integer userId = createUser(0, null);

        assertThatThrownBy(() -> new TransactionTemplate(transactionManager).executeWithoutResult(status -> {
            loginAttemptService.recordFailedLogin(userId);
            throw new IllegalStateException("đăng nhập sai");
        })).isInstanceOf(IllegalStateException.class);

        assertThat(userRepository.findById(userId).orElseThrow().getFailedLoginAttempts()).isEqualTo(1);
    }

    @Test
    void accountIsLockedAfterMaxFailedAttempts() {
        Integer userId = createUser(0, null);

        for (int i = 0; i < MAX_ATTEMPTS - 1; i++) {
            loginAttemptService.recordFailedLogin(userId);
        }
        assertThat(userRepository.findById(userId).orElseThrow().getLockedUntil()).isNull();

        loginAttemptService.recordFailedLogin(userId);
        assertThat(userRepository.findById(userId).orElseThrow().getLockedUntil()).isAfter(LocalDateTime.now());
    }

    @Test
    void countRestartsAfterLockHasExpired() {
        Integer userId = createUser(MAX_ATTEMPTS, LocalDateTime.now().minusMinutes(1));

        loginAttemptService.recordFailedLogin(userId);

        UserEntity user = userRepository.findById(userId).orElseThrow();
        assertThat(user.getFailedLoginAttempts()).isEqualTo(1);
        assertThat(user.getLockedUntil()).isNull();
    }

    private Integer createUser(int failedAttempts, LocalDateTime lockedUntil) {
        return userRepository.save(UserEntity.builder()
                .fullName("Reader")
                .email("reader@example.com")
                .password("hash")
                .failedLoginAttempts(failedAttempts)
                .lockedUntil(lockedUntil)
                .build()).getId();
    }
}
