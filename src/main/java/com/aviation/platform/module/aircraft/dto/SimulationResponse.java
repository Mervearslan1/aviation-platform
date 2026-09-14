package com.aviation.platform.module.aircraft.dto;

import com.aviation.platform.module.aircraft.entity.TrainingSimulation;

public record SimulationResponse(
        Long id,
        String code,
        String title,
        String description,
        String simType,
        String aircraftCode
) {

    public static SimulationResponse from(TrainingSimulation sim) {
        return new SimulationResponse(
                sim.getId(),
                sim.getCode(),
                sim.getTitle(),
                sim.getDescription(),
                sim.getSimType(),
                sim.getAircraft().getCode()
        );
    }
}
