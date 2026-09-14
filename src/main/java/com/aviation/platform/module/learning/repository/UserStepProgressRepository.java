package com.aviation.platform.module.learning.repository;

import com.aviation.platform.module.learning.entity.UserStepProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserStepProgressRepository extends JpaRepository<UserStepProgress, Long> {

    @Query("SELECT p FROM UserStepProgress p WHERE p.user.id = :userId AND p.step.path.id = :pathId")
    List<UserStepProgress> findByUserAndPath(@Param("userId") Long userId, @Param("pathId") Long pathId);

    Optional<UserStepProgress> findByUserIdAndStepId(Long userId, Long stepId);
}
