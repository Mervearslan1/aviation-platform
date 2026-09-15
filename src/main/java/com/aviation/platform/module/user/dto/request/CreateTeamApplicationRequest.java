package com.aviation.platform.module.user.dto.request;

import com.aviation.platform.module.user.entity.TeamApplication;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTeamApplicationRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Email @Size(max = 255) String email,
        @NotNull TeamApplication.Profession profession,
        @NotNull TeamApplication.RequestedRole requestedRole,
        @Size(max = 1000) String experience,
        @NotBlank @Size(max = 2000) String message
) {
}
