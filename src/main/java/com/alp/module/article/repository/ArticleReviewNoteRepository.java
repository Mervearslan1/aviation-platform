package com.alp.module.article.repository;

import com.alp.module.article.entity.ArticleReviewNote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleReviewNoteRepository extends JpaRepository<ArticleReviewNote, Long> {

    List<ArticleReviewNote> findByArticleIdOrderByCreatedAtDesc(Long articleId);
}
