package com.alp.module.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Schema(description = "Yeni kullanıcı kaydı")
public record RegisterRequest(
        @NotBlank
        @Size(min = 3, max = 32)
        @Pattern(regexp = "^[A-Za-z0-9_]+$", message = "Username may contain only letters, digits, and underscore")
        @Schema(example = "pilot01")
        String username,

        @NotBlank
        @Email
        @Size(max = 255)
        @Schema(example = "pilot01@example.com")
        String email,

        @NotBlank
        @Size(min = 8, max = 72)
        @Schema(example = "Password123!", description = "En az 8 karakter; büyük harf, küçük harf, rakam ve özel karakter")
        String password,

        @Size(max = 100)
        @Schema(example = "Pilot One")
        String displayName
) {
}
