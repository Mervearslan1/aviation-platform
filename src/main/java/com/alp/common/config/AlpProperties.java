package com.alp.common.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

@ConfigurationProperties(prefix = "alp")
public record AlpProperties(
        Jwt jwt,
        Cors cors,
        Seed seed
) {

    public record Jwt(String secret, Duration accessTokenTtl, Duration refreshTokenTtl) {
    }

    public record Cors(List<String> allowedOrigins) {
    }

    public record Seed(String adminEmail, String adminPassword, String adminUsername) {
    }
}
