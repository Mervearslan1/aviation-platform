package com.alp.common.security.jwt;

import com.alp.common.config.AlpProperties;
import com.alp.common.exception.ApiException;
import com.alp.common.exception.ErrorCode;
import com.alp.common.security.principal.CurrentUser;
import com.alp.module.user.entity.Role;
import com.alp.module.user.entity.RoleName;
import com.alp.module.user.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class JwtService {

    public static final String CLAIM_ROLES = "roles";
    public static final String CLAIM_TYPE = "typ";
    public static final String TOKEN_TYPE_ACCESS = "access";

    private final AlpProperties properties;
    private final Clock clock;
    private final SecretKey key;

    public JwtService(AlpProperties properties, Clock clock) {
        this.properties = properties;
        this.clock = clock;
        byte[] secretBytes = properties.jwt().secret().getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalStateException("alp.jwt.secret must be at least 32 bytes");
        }
        this.key = Keys.hmacShaKeyFor(secretBytes);
    }

    public String createAccessToken(User user) {
        Instant now = Instant.now(clock);
        Instant expiresAt = now.plus(properties.jwt().accessTokenTtl());
        List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();
        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .claim(CLAIM_TYPE, TOKEN_TYPE_ACCESS)
                .claim(CLAIM_ROLES, roles)
                .signWith(key)
                .compact();
    }

    public long accessTokenExpiresInSeconds() {
        return properties.jwt().accessTokenTtl().toSeconds();
    }

    public CurrentUser parseAccessToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .clock(() -> Date.from(Instant.now(clock)))
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            if (!TOKEN_TYPE_ACCESS.equals(claims.get(CLAIM_TYPE, String.class))) {
                throw ApiException.unauthorized(ErrorCode.INVALID_TOKEN, "Invalid token");
            }

            Long userId = Long.valueOf(claims.getSubject());
            @SuppressWarnings("unchecked")
            List<String> rawRoles = claims.get(CLAIM_ROLES, List.class);
            Set<RoleName> roles = rawRoles == null
                    ? Set.of()
                    : rawRoles.stream().map(RoleName::valueOf).collect(Collectors.toUnmodifiableSet());
            return new CurrentUser(userId, null, null, roles);
        } catch (ExpiredJwtException ex) {
            throw ApiException.unauthorized(ErrorCode.TOKEN_EXPIRED, "Token expired");
        } catch (JwtException | IllegalArgumentException ex) {
            throw ApiException.unauthorized(ErrorCode.INVALID_TOKEN, "Invalid token");
        }
    }

    public Set<RoleName> roleNames(User user) {
        return user.getRoles().stream().map(Role::getName).collect(Collectors.toUnmodifiableSet());
    }
}
