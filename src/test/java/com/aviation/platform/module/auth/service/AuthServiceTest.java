package com.aviation.platform.module.auth.service;

import com.aviation.platform.module.auth.dto.request.LoginRequest;
import com.aviation.platform.module.auth.dto.request.RegisterRequest;
import com.aviation.platform.common.config.AviationProperties;
import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.exception.ErrorCode;
import com.aviation.platform.module.user.entity.Role;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.entity.UserStatus;
import com.aviation.platform.module.audit.service.AuditService;
import com.aviation.platform.module.user.repository.RoleRepository;
import com.aviation.platform.module.user.repository.UserRepository;
import com.aviation.platform.common.security.jwt.JwtService;
import com.aviation.platform.module.auth.repository.RefreshTokenRepository;
import com.aviation.platform.module.auth.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuditService auditService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        AviationProperties properties = new AviationProperties(
                new AviationProperties.Jwt("test-secret-key-must-be-32-bytes-min", Duration.ofMinutes(15), Duration.ofDays(7)),
                new AviationProperties.Cors(List.of()),
                new AviationProperties.Seed(null, null, null),
                null
        );
        authService = new AuthServiceImpl(
                userRepository,
                roleRepository,
                refreshTokenRepository,
                passwordEncoder,
                jwtService,
                auditService,
                properties,
                Clock.fixed(Instant.parse("2026-09-14T12:00:00Z"), ZoneOffset.UTC)
        );
    }

    @Test
    void registerRejectsDuplicateEmail() {
        when(userRepository.existsByUsername("user123")).thenReturn(false);
        when(userRepository.existsByEmailIgnoreCase("user@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(
                new RegisterRequest("user123", "User@example.com", "Password123!", "User"),
                "127.0.0.1"
        ))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.RESOURCE_ALREADY_EXISTS);

        verify(userRepository, never()).save(any());
    }

    @Test
    void loginDoesNotRevealWhetherEmailExists() {
        when(userRepository.findByEmailIgnoreCaseWithRoles("missing@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("missing@example.com", "Password123!"), "127.0.0.1"))
                .isInstanceOf(ApiException.class)
                .satisfies(ex -> {
                    ApiException api = (ApiException) ex;
                    assertThat(api.getCode()).isEqualTo(ErrorCode.INVALID_CREDENTIALS);
                    assertThat(api.getMessage()).isEqualTo("Invalid credentials");
                    assertThat(api.getStatus().value()).isEqualTo(401);
                });
    }

    @Test
    void loginRejectsWrongPasswordWithSameMessage() {
        User user = new User("user123", "user@example.com", "hashed", "User");
        user.addRole(new Role(RoleName.USER));
        when(userRepository.findByEmailIgnoreCaseWithRoles("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(new LoginRequest("user@example.com", "wrong"), "127.0.0.1"))
                .isInstanceOf(ApiException.class)
                .extracting(Throwable::getMessage)
                .isEqualTo("Invalid credentials");
    }

    @Test
    void loginRejectsInactiveAccount() {
        User user = new User("user123", "user@example.com", "hashed", "User");
        user.addRole(new Role(RoleName.USER));
        user.setStatus(UserStatus.SUSPENDED);
        when(userRepository.findByEmailIgnoreCaseWithRoles("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123!", "hashed")).thenReturn(true);

        assertThatThrownBy(() -> authService.login(new LoginRequest("user@example.com", "Password123!"), "127.0.0.1"))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.ACCESS_DENIED);
    }
}
