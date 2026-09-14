package com.aviation.platform.module.user.dto.request;

import com.aviation.platform.module.user.entity.UserStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
        @NotNull @Schema(example = "SUSPENDED", allowableValues = {"ACTIVE", "INACTIVE", "SUSPENDED"}) UserStatus status
) {
}
