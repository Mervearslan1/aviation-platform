package com.aviation.platform.module.aircraft.dto;

import java.util.Map;

public record SessionResponse(
        Long sessionId,
        String status,
        String message,
        String hint,
        Map<String, Object> controls,
        int cursor,
        int totalSteps,
        FlightInstruments instruments,
        String expectedPart,
        String expectedValue
) {
}
