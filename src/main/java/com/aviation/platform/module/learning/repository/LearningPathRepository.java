package com.aviation.platform.module.learning.repository;

import com.aviation.platform.module.learning.entity.CatalogStatus;
import com.aviation.platform.module.learning.entity.LearningPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LearningPathRepository extends JpaRepository<LearningPath, Long> {

    boolean existsBySlug(String slug);

    List<LearningPath> findByStatusOrderByCreatedAtDesc(CatalogStatus status);

    @Query("SELECT p FROM LearningPath p LEFT JOIN FETCH p.steps WHERE p.id = :id")
    Optional<LearningPath> findByIdWithSteps(@Param("id") Long id);

    @Query("SELECT p FROM LearningPath p LEFT JOIN FETCH p.steps WHERE p.slug = :slug")
    Optional<LearningPath> findBySlugWithSteps(@Param("slug") String slug);
}
