package com.aviation.platform.module.learning.repository;

import com.aviation.platform.module.learning.entity.LearningStepTerm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface LearningStepTermRepository extends JpaRepository<LearningStepTerm, Long> {

    List<LearningStepTerm> findByStepIdInOrderBySortIndexAsc(Collection<Long> stepIds);
}
