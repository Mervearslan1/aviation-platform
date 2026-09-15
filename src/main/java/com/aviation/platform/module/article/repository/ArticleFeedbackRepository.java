package com.aviation.platform.module.article.repository;

import com.aviation.platform.module.article.entity.ArticleFeedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ArticleFeedbackRepository extends JpaRepository<ArticleFeedback, Long> {

    List<ArticleFeedback> findByArticleSlug(String articleSlug);

    Optional<ArticleFeedback> findByArticleSlugAndUser_IdAndKind(String articleSlug, Long userId, String kind);

    @Query("SELECT f FROM ArticleFeedback f JOIN FETCH f.user WHERE f.kind = :kind ORDER BY f.createdAt DESC")
    List<ArticleFeedback> findByKindOrderByCreatedAtDesc(@Param("kind") String kind);
}
