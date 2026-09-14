package com.aviation.platform.module.article.repository;

import com.aviation.platform.module.article.entity.ArticleVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleVersionRepository extends JpaRepository<ArticleVersion, Long> {

    int countByArticleId(Long articleId);
}
