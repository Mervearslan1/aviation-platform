package com.aviation.platform.module.article.repository;

import com.aviation.platform.module.article.entity.ArticleReviewNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleReviewNoteRepository extends JpaRepository<ArticleReviewNote, Long> {

    List<ArticleReviewNote> findByArticleIdOrderByCreatedAtDesc(Long articleId);
}
