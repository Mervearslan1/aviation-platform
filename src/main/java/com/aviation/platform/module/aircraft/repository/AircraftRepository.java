package com.aviation.platform.module.aircraft.repository;

import com.aviation.platform.module.aircraft.entity.Aircraft;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AircraftRepository extends JpaRepository<Aircraft, Long> {

    Optional<Aircraft> findByCode(String code);

    List<Aircraft> findAllByOrderBySortIndexAsc();
}
