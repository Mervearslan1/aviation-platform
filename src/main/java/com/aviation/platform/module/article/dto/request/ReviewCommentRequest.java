package com.aviation.platform.module.article.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ReviewCommentRequest(
        @NotBlank String comment
) {
}
