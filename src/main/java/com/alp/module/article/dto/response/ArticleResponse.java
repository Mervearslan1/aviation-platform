package com.alp.module.article.dto.response;

import com.alp.module.article.entity.Article;
import com.alp.module.article.entity.ArticleStatus;
import java.time.Instant;
import java.util.List;
import java.util.Map;

public record ArticleResponse(
        Long id,
        Long authorId,
        String authorDisplayName,
        Long categoryId,
        String categoryName,
        String title,
        String slug,
        String summary,
        String contentHtml,
        Map<String, Object> contentDocument,
        String coverImageUrl,
        List<TagResponse> tags,
        ArticleStatus status,
        Instant createdAt,
        Instant updatedAt,
        Instant publishedAt,
        List<ReviewNoteResponse> reviewNotes
) {

    public static ArticleResponse from(Article article, List<ReviewNoteResponse> notes) {
        return new ArticleResponse(
                article.getId(),
                article.getAuthor().getId(),
                article.getAuthor().getDisplayName(),
                article.getCategory() == null ? null : article.getCategory().getId(),
                article.getCategory() == null ? null : article.getCategory().getName(),
                article.getTitle(),
                article.getSlug(),
                article.getSummary(),
                article.getContentHtml(),
                article.getContentDocument(),
                article.getCoverMedia() == null ? null : article.getCoverMedia().publicUrl(),
                article.getTags().stream().map(TagResponse::from).toList(),
                article.getStatus(),
                article.getCreatedAt(),
                article.getUpdatedAt(),
                article.getPublishedAt(),
                notes
        );
    }

    public static ArticleResponse from(Article article) {
        return from(article, List.of());
    }
}
