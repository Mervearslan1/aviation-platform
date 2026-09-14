package com.aviation.platform.module.aircraft.dto;

import com.aviation.platform.module.aircraft.entity.Aircraft;

public record AircraftResponse(
        Long id,
        String code,
        String name,
        String manufacturer,
        String philosophy,
        int partCount,
        Integer learnedCount
) {

    public static AircraftResponse from(Aircraft aircraft, int partCount, Integer learned) {
        return new AircraftResponse(
                aircraft.getId(),
                aircraft.getCode(),
                aircraft.getName(),
                aircraft.getManufacturer(),
                aircraft.getPhilosophy(),
                partCount,
                learned
        );
    }
}
