package com.alp.module.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Login")
public record LoginRequest(
        @NotBlank @Email @Schema(example = "pilot01@example.com") String email,
        @NotBlank @Schema(example = "Password123!") String password
) {
}
