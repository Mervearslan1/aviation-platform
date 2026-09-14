package com.alp.module.article.entity;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ArticleStatusTest {

    @Test
    void authorWorkflow() {
        assertThat(ArticleStatus.DRAFT.canTransitionTo(ArticleStatus.SUBMITTED)).isTrue();
        assertThat(ArticleStatus.REVISION_REQUIRED.canTransitionTo(ArticleStatus.SUBMITTED)).isTrue();
        assertThat(ArticleStatus.DRAFT.canTransitionTo(ArticleStatus.PUBLISHED)).isFalse();
    }

    @Test
    void editorWorkflow() {
        assertThat(ArticleStatus.SUBMITTED.canTransitionTo(ArticleStatus.IN_REVIEW)).isTrue();
        assertThat(ArticleStatus.IN_REVIEW.canTransitionTo(ArticleStatus.APPROVED)).isTrue();
        assertThat(ArticleStatus.IN_REVIEW.canTransitionTo(ArticleStatus.REVISION_REQUIRED)).isTrue();
        assertThat(ArticleStatus.APPROVED.canTransitionTo(ArticleStatus.PUBLISHED)).isTrue();
        assertThat(ArticleStatus.PUBLISHED.canTransitionTo(ArticleStatus.ARCHIVED)).isTrue();
        assertThat(ArticleStatus.PUBLISHED.canTransitionTo(ArticleStatus.DRAFT)).isFalse();
    }
}
