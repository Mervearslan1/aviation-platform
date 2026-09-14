package com.aviation.platform.module.aircraft.service;

import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class SimulationEngineTest {

    @Test
    void crashWhenGearUpOnGroundRuleHits() {
        Map<String, Object> config = Map.of(
                "expected", List.of(Map.of("part", "B737-001", "value", "ON", "hint", "bat")),
                "crash", List.of(Map.of("when", Map.of("B737-039", "UP"), "message", "Yerde gear up"))
        );
        Map<String, Object> result = SimulationEngine.apply(config, Map.of(), "B737-039", "UP");
        assertThat(result.get("status")).isEqualTo("CRASHED");
        assertThat(result.get("message")).isEqualTo("Yerde gear up");
    }

    @Test
    void sequenceCompletes() {
        Map<String, Object> config = Map.of(
                "expected", List.of(Map.of("part", "C172-001", "value", "ON", "hint", "master")),
                "crash", List.of()
        );
        Map<String, Object> result = SimulationEngine.apply(config, Map.of(), "C172-001", "ON");
        assertThat(result.get("status")).isEqualTo("PASSED");
        assertThat(result.get("cursor")).isEqualTo(1);
    }
}
