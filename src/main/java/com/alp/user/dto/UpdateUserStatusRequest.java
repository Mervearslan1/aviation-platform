package com.alp.user.dto;

import com.alp.user.entity.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull @Schema(example = "SUSPENDED", allowableValues = {"ACTIVE", "INACTIVE", "SUSPENDED"}) UserStatus status
) {
}
