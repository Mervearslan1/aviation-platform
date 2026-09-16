package com.aviation.platform.module.learning.repository;

import com.aviation.platform.module.learning.entity.CatalogStatus;
import com.aviation.platform.module.learning.entity.LearningStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningStepRepository extends JpaRepository<LearningStep, Long> {

    List<LearningStep> findByPathIdOrderByOrderIndexAsc(Long pathId);

    List<LearningStep> findByPathIdAndStatusOrderByOrderIndexAsc(Long pathId, CatalogStatus status);

    Optional<LearningStep> findByIdAndPathId(Long id, Long pathId);

    int countByPathId(Long pathId);

    int countByPathIdAndStatus(Long pathId, CatalogStatus status);

    boolean existsByPathIdAndSlug(Long pathId, String slug);
}
