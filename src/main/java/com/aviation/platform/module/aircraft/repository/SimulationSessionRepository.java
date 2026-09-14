package com.aviation.platform.module.aircraft.repository;

import com.aviation.platform.module.aircraft.entity.SimulationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SimulationSessionRepository extends JpaRepository<SimulationSession, Long> {

    @Query("SELECT s FROM SimulationSession s JOIN FETCH s.simulation sim JOIN FETCH sim.aircraft WHERE s.id = :id")
    Optional<SimulationSession> findByIdWithSim(@Param("id") Long id);
}
