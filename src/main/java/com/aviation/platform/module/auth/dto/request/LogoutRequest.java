package com.aviation.platform.module.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LogoutRequest(
        @NotBlank @Schema(description = "İptal edilecek refreshToken") String refreshToken
) {
}
