package com.alp.module.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "JWT token çifti")
public record TokenResponse(
        @Schema(description = "Authorize'a yapıştırılacak access token") String accessToken,
        String refreshToken,
        @Schema(example = "Bearer") String tokenType,
        @Schema(example = "900", description = "Access token süresi (saniye)") long expiresIn
) {
}
