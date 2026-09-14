package com.alp.auth.service;

import com.alp.audit.service.AuditService;
import com.alp.auth.dto.LoginRequest;
import com.alp.auth.dto.RegisterRequest;
import com.alp.auth.dto.TokenResponse;
import com.alp.auth.entity.RefreshToken;
import com.alp.auth.repository.RefreshTokenRepository;
import com.alp.common.config.AlpProperties;
import com.alp.common.exception.ApiException;
import com.alp.common.exception.ErrorCode;
import com.alp.common.util.TokenHasher;
import com.alp.user.dto.UserResponse;
import com.alp.user.entity.Role;
import com.alp.user.entity.RoleName;
import com.alp.user.entity.User;
import com.alp.user.repository.RoleRepository;
import com.alp.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final String INVALID_CREDENTIALS = "Invalid credentials";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditService auditService;
    private final AlpProperties properties;
    private final Clock clock;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuditService auditService,
            AlpProperties properties,
            Clock clock
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.auditService = auditService;
        this.properties = properties;
        this.clock = clock;
    }

    @Override
    public UserResponse register(RegisterRequest request, String ipAddress) {
        PasswordPolicy.validate(request.password());

        String username = request.username().trim();
        String email = User.normalizeEmail(request.email());
        String displayName = request.displayName() == null || request.displayName().isBlank()
                ? username
                : request.displayName().trim();

        if (userRepository.existsByUsername(username)) {
            throw ApiException.conflict("Username already exists");
        }
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw ApiException.conflict("Email already exists");
        }

        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new IllegalStateException("USER role is not seeded"));

        User user = new User(username, email, passwordEncoder.encode(request.password()), displayName);
        user.addRole(userRole);
        userRepository.save(user);

        auditService.record(user.getId(), "USER_REGISTERED", "User", user.getId(), Map.of("username", username), ipAddress);
        return UserResponse.from(user);
    }

    @Override
    public TokenResponse login(LoginRequest request, String ipAddress) {
        String email = User.normalizeEmail(request.email());
        User user = userRepository.findByEmailIgnoreCaseWithRoles(email)
                .orElseThrow(() -> ApiException.unauthorized(ErrorCode.INVALID_CREDENTIALS, INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized(ErrorCode.INVALID_CREDENTIALS, INVALID_CREDENTIALS);
        }
        if (!user.isActive()) {
            throw ApiException.forbidden("Account is not active");
        }

        user.setLastLoginAt(Instant.now(clock));
        return issueTokens(user, ipAddress, "USER_LOGIN");
    }

    @Override
    public TokenResponse refresh(String refreshTokenValue, String ipAddress) {
        RefreshToken stored = findUsableRefreshToken(refreshTokenValue);
        stored.revoke(Instant.now(clock));

        User user = stored.getUser();
        if (!user.isActive()) {
            throw ApiException.forbidden("Account is not active");
        }
        return issueTokens(user, ipAddress, "TOKEN_REFRESHED");
    }

    @Override
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByTokenHashWithUser(TokenHasher.sha256(refreshTokenValue))
                .filter(token -> !token.isRevoked())
                .ifPresent(token -> token.revoke(Instant.now(clock)));
    }

    private TokenResponse issueTokens(User user, String ipAddress, String auditAction) {
        Instant now = Instant.now(clock);
        String refreshTokenValue = generateRefreshTokenValue();
        RefreshToken refreshToken = new RefreshToken(
                user,
                TokenHasher.sha256(refreshTokenValue),
                now.plus(properties.jwt().refreshTokenTtl()),
                now
        );
        refreshTokenRepository.save(refreshToken);
        auditService.record(user.getId(), auditAction, "User", user.getId(), Map.of(), ipAddress);
        return new TokenResponse(
                jwtService.createAccessToken(user),
                refreshTokenValue,
                "Bearer",
                jwtService.accessTokenExpiresInSeconds()
        );
    }

    private RefreshToken findUsableRefreshToken(String refreshTokenValue) {
        RefreshToken stored = refreshTokenRepository.findByTokenHashWithUser(TokenHasher.sha256(refreshTokenValue))
                .orElseThrow(() -> ApiException.unauthorized(ErrorCode.INVALID_TOKEN, "Invalid token"));
        if (!stored.isUsable(Instant.now(clock))) {
            throw ApiException.unauthorized(ErrorCode.INVALID_TOKEN, "Invalid token");
        }
        return stored;
    }

    private String generateRefreshTokenValue() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
