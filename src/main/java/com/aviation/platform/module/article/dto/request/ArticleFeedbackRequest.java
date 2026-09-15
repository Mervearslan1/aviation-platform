package com.aviation.platform.module.article.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ArticleFeedbackRequest(
        @NotBlank
        @Pattern(regexp = "INTERESTED|NEEDS_REVIEW")
        String kind,
        String quote,
        String note
) {
}
