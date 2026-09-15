package com.aviation.platform.module.user.dto.response;

import com.aviation.platform.module.user.entity.KnowledgeLevel;
import com.aviation.platform.module.user.entity.Role;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.entity.UserStatus;

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
        KnowledgeLevel knowledgeLevel,
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
                user.getKnowledgeLevel() == null ? KnowledgeLevel.BEGINNER : user.getKnowledgeLevel(),
                roles,
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getLastLoginAt()
        );
    }
}
