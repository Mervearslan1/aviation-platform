package com.alp.module.article.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SaveCategoryRequest(
        @NotBlank @Size(max = 120) String name,
        @Size(max = 1000) String description
) {
}
