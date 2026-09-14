package com.alp.user.dto;

import com.alp.user.entity.Role;
import com.alp.user.entity.RoleName;
import com.alp.user.entity.User;
import com.alp.user.entity.UserStatus;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

public record UserResponse(
        Long id,
        String username,
        String email,
        String displayName,
        String biography,
        String profileImageUrl,
        UserStatus status,
        Set<RoleName> roles,
        Instant createdAt,
        Instant updatedAt,
        Instant lastLoginAt
) {

    public static UserResponse from(User user) {
        Set<RoleName> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toUnmodifiableSet());
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getBiography(),
                user.getProfileImageUrl(),
                user.getStatus(),
                roles,
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastLoginAt()
        );
    }
}
