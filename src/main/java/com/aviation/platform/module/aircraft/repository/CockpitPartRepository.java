package com.aviation.platform.module.aircraft.repository;

import com.aviation.platform.module.aircraft.entity.CockpitPart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CockpitPartRepository extends JpaRepository<CockpitPart, Long> {

    @Query("SELECT p FROM CockpitPart p WHERE p.aircraft.code = :code ORDER BY p.sortIndex")
    List<CockpitPart> findByAircraftCodeOrderBySortIndexAsc(@Param("code") String code);

    @Query("SELECT p FROM CockpitPart p JOIN FETCH p.aircraft WHERE p.code = :code")
    Optional<CockpitPart> findByCode(@Param("code") String code);

    @Query("SELECT COUNT(p) FROM CockpitPart p WHERE p.aircraft.code = :code")
    int countByAircraftCode(@Param("code") String code);
}
