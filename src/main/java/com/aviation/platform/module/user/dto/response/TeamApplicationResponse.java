package com.aviation.platform.module.user.dto.response;

import com.aviation.platform.module.user.entity.TeamApplication;

import java.time.Instant;

public record TeamApplicationResponse(
        Long id,
        String fullName,
        String email,
        TeamApplication.Profession profession,
        TeamApplication.RequestedRole requestedRole,
        String experience,
        String message,
        TeamApplication.Status status,
        Instant createdAt
) {
    public static TeamApplicationResponse from(TeamApplication app) {
        return new TeamApplicationResponse(
                app.getId(),
                app.getFullName(),
                app.getEmail(),
                app.getProfession(),
                app.getRequestedRole(),
                app.getExperience(),
                app.getMessage(),
                app.getStatus(),
                app.getCreatedAt()
        );
    }
}
