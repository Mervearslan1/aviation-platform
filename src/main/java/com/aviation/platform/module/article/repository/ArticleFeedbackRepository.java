package com.aviation.platform.module.article.repository;

import com.aviation.platform.module.article.entity.ArticleFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ArticleFeedbackRepository extends JpaRepository<ArticleFeedback, Long> {

    List<ArticleFeedback> findByArticleSlug(String articleSlug);

    Optional<ArticleFeedback> findByArticleSlugAndUser_Id(String articleSlug, Long userId);
}
