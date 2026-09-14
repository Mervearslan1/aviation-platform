package com.aviation.platform.module.aircraft.repository;

import com.aviation.platform.module.aircraft.entity.TrainingSimulation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrainingSimulationRepository extends JpaRepository<TrainingSimulation, Long> {

    @Query("SELECT s FROM TrainingSimulation s JOIN FETCH s.aircraft WHERE s.aircraft.code = :code ORDER BY s.id")
    List<TrainingSimulation> findByAircraftCodeOrderByIdAsc(@Param("code") String code);

    Optional<TrainingSimulation> findByCode(String code);
}
