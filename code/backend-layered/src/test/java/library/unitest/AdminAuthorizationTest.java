package library.unitest;

import library.common.exception.GlobalExceptionHandler;
import library.config.JwtAuthenticationFilter;
import library.config.JwtUtil;
import library.config.RateLimitFilter;
import library.config.SecurityConfig;
import library.controller.AuthorController;
import library.controller.BookCopyController;
import library.controller.CategoryController;
import library.controller.FileController;
import library.controller.PublicPolicyController;
import library.controller.admin.AdminBookReturnController;
import library.controller.admin.AdminBorrowController;
import library.controller.admin.AdminPolicyController;
import library.controller.admin.AdminRoleController;
import library.controller.pub.PublicSupportController;
import library.controller.user.EbookController;
import library.repository.SupportRequestRepository;
import library.repository.UserRepository;
import library.service.AdminBorrowService;
import library.service.AdminRoleService;
import library.service.AuthorService;
import library.service.BookCopyService;
import library.service.BookReturnService;
import library.service.CategoryService;
import library.service.EbookService;
import library.service.FeeCalculatorService;
import library.service.FileStorageService;
import library.service.RateLimitService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.annotation.AnnotatedElementUtils;
import org.springframework.core.type.filter.AnnotationTypeFilter;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.request.RequestPostProcessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest
@ContextConfiguration(classes = {
        SecurityConfig.class,
        JwtAuthenticationFilter.class,
        RateLimitFilter.class,
        GlobalExceptionHandler.class,
        AdminBookReturnController.class,
        AdminBorrowController.class,
        AdminPolicyController.class,
        AdminRoleController.class,
        AuthorController.class,
        BookCopyController.class,
        CategoryController.class,
        EbookController.class,
        FileController.class,
        PublicPolicyController.class,
        PublicSupportController.class
})
class AdminAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RateLimitService rateLimitService;
    @MockitoBean
    private JwtUtil jwtUtil;
    @MockitoBean
    private UserRepository userRepository;
    @MockitoBean
    private RedisTemplate<String, Object> redisTemplate;
    @MockitoBean
    private AdminRoleService adminRoleService;
    @MockitoBean
    private AdminBorrowService adminBorrowService;
    @MockitoBean
    private BookReturnService bookReturnService;
    @MockitoBean
    private FeeCalculatorService feeCalculatorService;
    @MockitoBean
    private AuthorService authorService;
    @MockitoBean
    private CategoryService categoryService;
    @MockitoBean
    private BookCopyService bookCopyService;
    @MockitoBean
    private EbookService ebookService;
    @MockitoBean
    private FileStorageService fileStorageService;
    @MockitoBean
    private SupportRequestRepository supportRequestRepository;

    @BeforeEach
    void allowAllRequestsThroughRateLimit() {
        when(rateLimitService.tryAcquire(anyString(), anyInt(), any())).thenReturn(true);
    }

    @ParameterizedTest
    @CsvSource({
            "GET,/api/admin/borrows",
            "GET,/api/admin/borrows/BO-1",
            "POST,/api/admin/borrows/returns/1/cash",
            "POST,/api/admin/borrows/returns/1/vnpay",
            "GET,/api/admin/policies/active",
            "PUT,/api/admin/policies/active",
            "GET,/api/admin/authors",
            "DELETE,/api/admin/authors/1",
            "GET,/api/admin/categories",
            "DELETE,/api/admin/categories/1",
            "GET,/api/admin/books/1/copies",
            "POST,/api/files/upload-url"
    })
    void customerAndAnonymousAreDeniedOnAdminEndpoints(String method, String path) throws Exception {
        mockMvc.perform(request(method, path)).andExpect(status().isUnauthorized());
        mockMvc.perform(request(method, path).with(customer())).andExpect(status().isForbidden());
    }

    @Test
    void anyLoggedInUserCanReadOwnPermissions() throws Exception {
        mockMvc.perform(request("GET", "/api/admin/roles/me/permissions").with(customer()))
                .andExpect(status().isOk());
        mockMvc.perform(request("GET", "/api/admin/roles/me/permissions"))
                .andExpect(status().isUnauthorized());
    }

    @ParameterizedTest
    @CsvSource({
            "GET,/api/admin/borrows",
            "GET,/api/admin/authors",
            "GET,/api/admin/books/1/copies",
            "GET,/api/admin/policies/active"
    })
    void librarianCanReadManagementData(String method, String path) throws Exception {
        assertNotDenied(request(method, path).with(librarian()));
    }

    @ParameterizedTest
    @CsvSource({
            "PUT,/api/admin/policies/active",
            "POST,/api/admin/borrows/returns/1/cash",
            "DELETE,/api/admin/authors/1",
            "DELETE,/api/admin/categories/1"
    })
    void librarianWithoutGrantedPermissionCannotWrite(String method, String path) throws Exception {
        mockMvc.perform(request(method, path).with(librarian())).andExpect(status().isForbidden());
    }

    @ParameterizedTest
    @CsvSource({
            "POST,/api/admin/borrows/returns/1/cash,borrow.approve",
            "DELETE,/api/admin/authors/1,books.edit-book",
            "DELETE,/api/admin/categories/1,books.edit-book",
            "PUT,/api/admin/policies/active,settings.manage"
    })
    void librarianWithGrantedPermissionCanWrite(String method, String path, String permission) throws Exception {
        assertNotDenied(request(method, path).with(librarian(permission)));
    }

    @ParameterizedTest
    @CsvSource({
            "PUT,/api/admin/policies/active",
            "POST,/api/admin/borrows/returns/1/cash",
            "DELETE,/api/admin/authors/1",
            "POST,/api/files/upload-url"
    })
    void adminCanAccessManagementEndpoints(String method, String path) throws Exception {
        assertNotDenied(request(method, path).with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")));
    }

    @Test
    void publicEndpointsStayOpenForAnonymous() throws Exception {
        assertNotDenied(request("POST", "/api/public/support-requests"));
        assertNotDenied(request("GET", "/api/policies/active"));
        assertNotDenied(request("GET", "/api/books/1/ebook/stream"));
    }

    @Test
    void publicPolicyPathOnlyAllowsReading() throws Exception {
        mockMvc.perform(request("PUT", "/api/policies/active")).andExpect(status().isUnauthorized());
    }

    /**
     * Chặn tái phạm: endpoint quản trị mới phải khai báo rõ quyền, không chỉ dựa vào lớp chặn theo URL.
     */
    @Test
    void everyManagementHandlerDeclaresPreAuthorize() throws Exception {
        ClassPathScanningCandidateComponentProvider scanner = new ClassPathScanningCandidateComponentProvider(false);
        scanner.addIncludeFilter(new AnnotationTypeFilter(RestController.class));

        List<String> unprotected = new ArrayList<>();
        int checkedHandlers = 0;
        for (var candidate : scanner.findCandidateComponents("library.controller")) {
            Class<?> controller = Class.forName(candidate.getBeanClassName());
            RequestMapping mapping = AnnotatedElementUtils.findMergedAnnotation(controller, RequestMapping.class);
            if (mapping == null || mapping.value().length == 0 || !isManagementPath(mapping.value()[0])) {
                continue;
            }
            for (Method method : controller.getDeclaredMethods()) {
                if (!AnnotatedElementUtils.hasAnnotation(method, RequestMapping.class)
                        || "getMyPermissions".equals(method.getName())) {
                    continue;
                }
                checkedHandlers++;
                if (!method.isAnnotationPresent(PreAuthorize.class) && !controller.isAnnotationPresent(PreAuthorize.class)) {
                    unprotected.add(controller.getSimpleName() + "#" + method.getName());
                }
            }
        }

        assertThat(checkedHandlers).isGreaterThan(50);
        assertThat(unprotected).isEmpty();
    }

    private boolean isManagementPath(String path) {
        return path.startsWith("/api/admin") || path.startsWith("/api/files");
    }

    private MockHttpServletRequestBuilder request(String method, String path) {
        return MockMvcRequestBuilders.request(HttpMethod.valueOf(method), path)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}");
    }

    private RequestPostProcessor customer() {
        return SecurityMockMvcRequestPostProcessors.user("customer").roles("CUSTOMER");
    }

    private RequestPostProcessor librarian(String... permissions) {
        List<org.springframework.security.core.GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_LIBRARIAN"));
        for (String permission : permissions) {
            authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(permission));
        }
        return SecurityMockMvcRequestPostProcessors.user("librarian").authorities(authorities);
    }

    /**
     * Service là mock nên handler có thể trả lỗi nghiệp vụ; ở đây chỉ kiểm tra request đã vượt qua lớp phân quyền.
     */
    private void assertNotDenied(MockHttpServletRequestBuilder builder) throws Exception {
        int responseStatus = mockMvc.perform(builder).andReturn().getResponse().getStatus();
        assertThat(responseStatus).isNotIn(401, 403);
    }
}
