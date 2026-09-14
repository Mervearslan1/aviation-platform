package com.alp.module.article.dto.response;

import com.alp.module.article.entity.ArticleCategory;
import com.alp.module.article.entity.CategoryStatus;

import java.time.Instant;

public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        CategoryStatus status,
        Instant createdAt
) {

    public static CategoryResponse from(ArticleCategory category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getStatus(),
                category.getCreatedAt()
        );
    }
}
