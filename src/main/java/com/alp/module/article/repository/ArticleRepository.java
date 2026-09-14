package com.alp.module.article.repository;

import com.alp.module.article.entity.Article;
import com.alp.module.article.entity.ArticleStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    boolean existsBySlug(String slug);

    @Query("""
            SELECT a FROM Article a
            LEFT JOIN FETCH a.author
            LEFT JOIN FETCH a.category
            LEFT JOIN FETCH a.coverMedia
            LEFT JOIN FETCH a.tags
            WHERE a.id = :id
            """)
    Optional<Article> findByIdWithDetails(@Param("id") Long id);

    @Query("""
            SELECT a FROM Article a
            LEFT JOIN FETCH a.author
            LEFT JOIN FETCH a.category
            LEFT JOIN FETCH a.coverMedia
            LEFT JOIN FETCH a.tags
            WHERE a.slug = :slug
            """)
    Optional<Article> findBySlugWithDetails(@Param("slug") String slug);

    Page<Article> findByStatus(ArticleStatus status, Pageable pageable);

    Page<Article> findByAuthorId(Long authorId, Pageable pageable);

    Page<Article> findByAuthorIdAndStatus(Long authorId, ArticleStatus status, Pageable pageable);
}
