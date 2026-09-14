package com.aviation.platform.module.aircraft.dto;

import jakarta.validation.constraints.NotBlank;

public record LearnActionRequest(
        @NotBlank String selectedPartCode
) {
}
