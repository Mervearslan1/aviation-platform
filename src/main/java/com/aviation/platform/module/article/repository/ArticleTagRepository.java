package com.aviation.platform.module.article.repository;

import com.aviation.platform.module.article.entity.ArticleTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleTagRepository extends JpaRepository<ArticleTag, Long> {

    Optional<ArticleTag> findByNameIgnoreCase(String name);

    boolean existsBySlug(String slug);
}
