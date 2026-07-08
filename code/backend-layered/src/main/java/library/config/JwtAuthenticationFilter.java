package library.config;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;

import library.repository.UserRepository;
import library.service.AdminRoleService;
import library.entity.UserEntity;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final AdminRoleService adminRoleService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            if (jwtUtil.isTokenValid(jwt) && SecurityContextHolder.getContext().getAuthentication() == null) {
                userEmail = jwtUtil.extractEmail(jwt);
                // Check if user exists and is active
                UserEntity user = userRepository.findByEmail(userEmail).orElse(null);
                if (user == null || !user.isActive()) {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.getWriter().write("User account is locked or deleted");
                    return;
                }

                Claims claims = jwtUtil.extractAllClaims(jwt);
                
                // Spring Security expects roles to start with ROLE_
                String roleString = claims.get("role", String.class);
                String role = roleString != null && !roleString.startsWith("ROLE_") 
                              ? "ROLE_" + roleString 
                              : roleString;

                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority(role));
                adminRoleService.getPermissionIds(user.getRole()).stream()
                        .map(SimpleGrantedAuthority::new)
                        .forEach(authorities::add);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userEmail,
                        null,
                        authorities
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Invalid token, do nothing, the user will be anonymous
        }

        filterChain.doFilter(request, response);
    }
}
