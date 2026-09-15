package com.aviation.platform.module.learning.dto.response;

import com.aviation.platform.module.aircraft.dto.AircraftResponse;

import java.util.List;

public record CatalogResponse(
        List<PathResponse> tower,
        List<PathResponse> pilot,
        List<AircraftResponse> aircraft
) {
}
