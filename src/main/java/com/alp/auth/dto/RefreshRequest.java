package com.alp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
        @NotBlank @Schema(description = "Login response'taki refreshToken") String refreshToken
) {
}
