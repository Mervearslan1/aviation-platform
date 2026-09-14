package com.aviation.platform.module.article.dto.response;

import com.aviation.platform.module.article.entity.ArticleReviewNote;

import java.time.Instant;

public record ReviewNoteResponse(
        Long id,
        String action,
        String comment,
        Long authorId,
        Instant createdAt
) {

    public static ReviewNoteResponse from(ArticleReviewNote note) {
        return new ReviewNoteResponse(
                note.getId(),
                note.getAction(),
                note.getComment(),
                note.getAuthorId(),
                note.getCreatedAt()
        );
    }
}
