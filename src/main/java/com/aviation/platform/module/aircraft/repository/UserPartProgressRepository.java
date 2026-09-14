package com.aviation.platform.module.aircraft.repository;

import com.aviation.platform.module.aircraft.entity.UserPartProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserPartProgressRepository extends JpaRepository<UserPartProgress, Long> {

    Optional<UserPartProgress> findByUserIdAndPartId(Long userId, Long partId);

    @Query("SELECT COUNT(p) FROM UserPartProgress p WHERE p.user.id = :userId AND p.part.aircraft.code = :code")
    int countLearned(@Param("userId") Long userId, @Param("code") String code);
}
