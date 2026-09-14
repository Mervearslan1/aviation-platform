package com.aviation.platform.module.aircraft.service;

import org.junit.jupiter.api.Test;

import java.util.HashMap;
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
        @SuppressWarnings("unchecked")
        Map<String, Object> flight = (Map<String, Object>) result.get("flight");
        assertThat(flight.get("phase")).isEqualTo("CRASHED");
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

    @Test
    void seedStartsParkedOnGround() {
        Map<String, Object> state = SimulationEngine.seed(Map.of("expected", List.of(), "flight", Map.of("heading", 270)));
        @SuppressWarnings("unchecked")
        Map<String, Object> flight = (Map<String, Object>) state.get("flight");
        assertThat(flight.get("phase")).isEqualTo("PARKED");
        assertThat(flight.get("onGround")).isEqualTo(true);
        assertThat(flight.get("heading")).isEqualTo(270);
        assertThat(flight.get("phaseLabel")).isEqualTo("Park");
    }

    @Test
    void successfulStepAppliesTaxiThenRotateFlight() {
        Map<String, Object> config = Map.of(
                "flight", Map.of("phase", "PARKED", "onGround", true, "ias", 0, "gear", "DOWN"),
                "expected", List.of(
                        Map.of("part", "B737-032", "value", "OFF", "hint", "taksi",
                                "flight", Map.of("phase", "TAXI", "ias", 16, "onGround", true)),
                        Map.of("part", "B737-035", "value", "BACK", "hint", "rotate",
                                "flight", Map.of("phase", "ROTATE", "ias", 145, "pitch", 10, "onGround", false, "altitude", 30))
                ),
                "crash", List.of()
        );
        Map<String, Object> afterTaxi = SimulationEngine.apply(config, SimulationEngine.seed(config), "B737-032", "OFF");
        @SuppressWarnings("unchecked")
        Map<String, Object> taxiFlight = (Map<String, Object>) afterTaxi.get("flight");
        assertThat(taxiFlight.get("phase")).isEqualTo("TAXI");
        assertThat(taxiFlight.get("phaseLabel")).isEqualTo("Taksi");
        assertThat(taxiFlight.get("ias")).isEqualTo(16);
        assertThat(taxiFlight.get("onGround")).isEqualTo(true);

        Map<String, Object> afterRotate = SimulationEngine.apply(config, afterTaxi, "B737-035", "BACK");
        @SuppressWarnings("unchecked")
        Map<String, Object> rotateFlight = (Map<String, Object>) afterRotate.get("flight");
        assertThat(rotateFlight.get("phase")).isEqualTo("ROTATE");
        assertThat(rotateFlight.get("onGround")).isEqualTo(false);
        assertThat(rotateFlight.get("pitch")).isEqualTo(10);
        assertThat(afterRotate.get("status")).isEqualTo("PASSED");
    }

    @Test
    void gearUpCrashesOnGroundButNotAfterRotate() {
        Map<String, Object> crash = Map.of(
                "when", Map.of("B737-039", "UP", "onGround", true),
                "message", "Yerde gear up",
                "flight", Map.of("phase", "CRASHED", "pitch", -8)
        );
        Map<String, Object> config = new HashMap<>();
        config.put("flight", Map.of("phase", "PARKED", "onGround", true, "gear", "DOWN"));
        config.put("expected", List.of(
                Map.of("part", "B737-035", "value", "BACK", "hint", "rotate",
                        "flight", Map.of("phase", "ROTATE", "onGround", false, "altitude", 30, "pitch", 10)),
                Map.of("part", "B737-039", "value", "UP", "hint", "gear up",
                        "flight", Map.of("phase", "CLIMB", "gear", "UP", "altitude", 1500))
        ));
        config.put("crash", List.of(crash));

        Map<String, Object> tooEarly = SimulationEngine.apply(config, SimulationEngine.seed(config), "B737-039", "UP");
        assertThat(tooEarly.get("status")).isEqualTo("CRASHED");
        @SuppressWarnings("unchecked")
        Map<String, Object> crashed = (Map<String, Object>) tooEarly.get("flight");
        assertThat(crashed.get("phase")).isEqualTo("CRASHED");

        Map<String, Object> airborne = SimulationEngine.apply(config, SimulationEngine.seed(config), "B737-035", "BACK");
        Map<String, Object> gearUp = SimulationEngine.apply(config, airborne, "B737-039", "UP");
        assertThat(gearUp.get("status")).isEqualTo("PASSED");
        @SuppressWarnings("unchecked")
        Map<String, Object> climb = (Map<String, Object>) gearUp.get("flight");
        assertThat(climb.get("phase")).isEqualTo("CLIMB");
        assertThat(climb.get("gear")).isEqualTo("UP");
    }

    @Test
    void seedCopiesInitialControls() {
        Map<String, Object> state = SimulationEngine.seed(Map.of(
                "controls", Map.of("B737-032", "ON"),
                "expected", List.of()
        ));
        @SuppressWarnings("unchecked")
        Map<String, String> controls = (Map<String, String>) state.get("controls");
        assertThat(controls.get("B737-032")).isEqualTo("ON");
    }

    @Test
    void flareStepSetsLowAltitudeNoseUp() {
        Map<String, Object> config = Map.of(
                "expected", List.of(Map.of(
                        "part", "C172-004",
                        "value", "IDLE",
                        "hint", "flare",
                        "flight", Map.of("phase", "FLARE", "ias", 52, "altitude", 15, "pitch", 6, "vs", -150)
                )),
                "crash", List.of()
        );
        Map<String, Object> result = SimulationEngine.apply(config, SimulationEngine.seed(config), "C172-004", "IDLE");
        @SuppressWarnings("unchecked")
        Map<String, Object> flight = (Map<String, Object>) result.get("flight");
        assertThat(flight.get("phase")).isEqualTo("FLARE");
        assertThat(flight.get("phaseLabel")).isEqualTo("Flare");
        assertThat(flight.get("pitch")).isEqualTo(6);
        assertThat(flight.get("altitude")).isEqualTo(15);
    }
}
