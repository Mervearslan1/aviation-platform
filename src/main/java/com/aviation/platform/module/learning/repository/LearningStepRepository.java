package com.aviation.platform.module.learning.repository;

import com.aviation.platform.module.learning.entity.LearningStep;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LearningStepRepository extends JpaRepository<LearningStep, Long> {

    List<LearningStep> findByPathIdOrderByOrderIndexAsc(Long pathId);

    Optional<LearningStep> findByIdAndPathId(Long id, Long pathId);

    int countByPathId(Long pathId);

    boolean existsByPathIdAndSlug(Long pathId, String slug);
}
