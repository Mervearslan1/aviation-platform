package com.alp.auth.service;

import com.alp.common.config.AlpProperties;
import com.alp.common.exception.ApiException;
import com.alp.common.exception.ErrorCode;
import com.alp.common.security.CurrentUser;
import com.alp.user.entity.Role;
import com.alp.user.entity.RoleName;
import com.alp.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private static final Instant NOW = Instant.parse("2026-09-14T12:00:00Z");

    private JwtService jwtService;
    private Clock clock;

    @BeforeEach
    void setUp() {
        clock = Clock.fixed(NOW, ZoneOffset.UTC);
        AlpProperties properties = new AlpProperties(
                new AlpProperties.Jwt("test-secret-key-must-be-32-bytes-min", Duration.ofMinutes(15), Duration.ofDays(7)),
                new AlpProperties.Cors(List.of()),
                new AlpProperties.Seed(null, null, null)
        );
        jwtService = new JwtService(properties, clock);
    }

    @Test
    void accessTokenContainsUserIdAndRoles() throws Exception {
        User user = userWithId(42L, RoleName.USER, RoleName.AUTHOR);
        String token = jwtService.createAccessToken(user);

        CurrentUser currentUser = jwtService.parseAccessToken(token);

        assertThat(currentUser.id()).isEqualTo(42L);
        assertThat(currentUser.roles()).containsExactlyInAnyOrder(RoleName.USER, RoleName.AUTHOR);
        assertThat(jwtService.accessTokenExpiresInSeconds()).isEqualTo(900);
    }

    @Test
    void expiredTokenIsRejected() throws Exception {
        User user = userWithId(1L, RoleName.USER);
        String token = jwtService.createAccessToken(user);

        JwtService laterService = new JwtService(
                new AlpProperties(
                        new AlpProperties.Jwt("test-secret-key-must-be-32-bytes-min", Duration.ofMinutes(15), Duration.ofDays(7)),
                        new AlpProperties.Cors(List.of()),
                        new AlpProperties.Seed(null, null, null)
                ),
                Clock.fixed(NOW.plus(Duration.ofMinutes(16)), ZoneOffset.UTC)
        );

        assertThatThrownBy(() -> laterService.parseAccessToken(token))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.TOKEN_EXPIRED);
    }

    @Test
    void malformedTokenIsRejected() {
        assertThatThrownBy(() -> jwtService.parseAccessToken("not-a-jwt"))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.INVALID_TOKEN);
    }

    private static User userWithId(Long id, RoleName... roles) throws Exception {
        User user = new User("pilot", "pilot@example.com", "hash", "Pilot");
        for (RoleName role : roles) {
            user.addRole(new Role(role));
        }
        Field idField = User.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(user, id);
        return user;
    }
}
