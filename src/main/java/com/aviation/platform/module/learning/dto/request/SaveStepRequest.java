package com.aviation.platform.module.learning.dto.request;

import com.aviation.platform.module.learning.entity.StepType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

public record SaveStepRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 500) String description,
        StepType stepType,
        String contentHtml,
        Map<String, Object> configuration,
        Integer orderIndex,
        Boolean required
) {
}
