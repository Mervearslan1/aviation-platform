package com.aviation.platform.module.learning.repository;

import com.aviation.platform.module.learning.entity.UserPathProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserPathProgressRepository extends JpaRepository<UserPathProgress, Long> {

    Optional<UserPathProgress> findByUserIdAndPathId(Long userId, Long pathId);
}
