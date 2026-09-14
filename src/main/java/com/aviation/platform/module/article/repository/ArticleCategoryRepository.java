package com.aviation.platform.module.article.repository;

import com.aviation.platform.module.article.entity.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleCategoryRepository extends JpaRepository<ArticleCategory, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);

    Optional<ArticleCategory> findBySlug(String slug);
}
