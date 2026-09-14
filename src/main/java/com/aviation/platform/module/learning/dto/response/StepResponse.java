package com.aviation.platform.module.learning.dto.response;

import com.aviation.platform.module.learning.entity.LearningStep;
import com.aviation.platform.module.learning.entity.StepProgressStatus;
import com.aviation.platform.module.learning.entity.StepType;

import java.util.Map;

public record StepResponse(
        Long id,
        String title,
        String slug,
        String description,
        StepType stepType,
        int orderIndex,
        boolean required,
        StepProgressStatus progressStatus,
        String contentHtml,
        Map<String, Object> configuration
) {

    public static StepResponse outline(LearningStep step, StepProgressStatus progress) {
        return new StepResponse(
                step.getId(),
                step.getTitle(),
                step.getSlug(),
                step.getDescription(),
                step.getStepType(),
                step.getOrderIndex(),
                step.isRequired(),
                progress,
                null,
                null
        );
    }

    public static StepResponse unlocked(LearningStep step, StepProgressStatus progress) {
        Map<String, Object> config = step.getConfiguration();
        if (config != null && config.containsKey("correctOption")) {
            config = new java.util.LinkedHashMap<>(config);
            config.remove("correctOption");
        }
        return new StepResponse(
                step.getId(),
                step.getTitle(),
                step.getSlug(),
                step.getDescription(),
                step.getStepType(),
                step.getOrderIndex(),
                step.isRequired(),
                progress,
                step.getContentHtml(),
                config
        );
    }
}
