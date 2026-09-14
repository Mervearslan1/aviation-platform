package com.aviation.platform.module.aircraft.dto;

import jakarta.validation.constraints.NotBlank;

public record SimActionRequest(
        @NotBlank String partCode,
        @NotBlank String value
) {
}
