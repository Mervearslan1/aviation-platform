package com.aviation.platform.module.article.entity;

public enum ArticleStatus {
    DRAFT,
    SUBMITTED,
    IN_REVIEW,
    REVISION_REQUIRED,
    APPROVED,
    PUBLISHED,
    REJECTED,
    ARCHIVED;

    public boolean canTransitionTo(ArticleStatus target) {
        return switch (this) {
            case DRAFT, REVISION_REQUIRED -> target == SUBMITTED;
            case SUBMITTED -> target == IN_REVIEW;
            case IN_REVIEW -> target == REVISION_REQUIRED || target == APPROVED || target == REJECTED;
            case APPROVED -> target == PUBLISHED;
            case PUBLISHED -> target == ARCHIVED;
            case REJECTED, ARCHIVED -> false;
        };
    }

    public boolean isEditableByAuthor() {
        return this == DRAFT || this == REVISION_REQUIRED;
    }

    public boolean isPublic() {
        return this == PUBLISHED;
    }
}
