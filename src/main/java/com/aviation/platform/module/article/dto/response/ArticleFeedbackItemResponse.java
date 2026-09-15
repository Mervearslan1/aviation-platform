package com.aviation.platform.module.article.dto.response;

import com.aviation.platform.module.article.entity.ArticleFeedback;

import java.time.Instant;

public record ArticleFeedbackItemResponse(
        Long id,
        String articleSlug,
        String kind,
        String quote,
        String note,
        String userEmail,
        Instant createdAt
) {
    public static ArticleFeedbackItemResponse from(ArticleFeedback row) {
        return new ArticleFeedbackItemResponse(
                row.getId() == null ? 0L : row.getId(),
                row.getArticleSlug(),
                row.getKind(),
                row.getQuote(),
                row.getNote(),
                row.getUserEmail(),
                row.getCreatedAt()
        );
    }
}
