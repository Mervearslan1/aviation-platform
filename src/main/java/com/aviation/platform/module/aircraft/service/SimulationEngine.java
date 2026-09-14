package com.aviation.platform.module.aircraft.service;

import com.aviation.platform.module.aircraft.dto.FlightInstruments;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class SimulationEngine {

    private SimulationEngine() {
    }

    public static Map<String, Object> seed(Map<String, Object> config) {
        Map<String, Object> state = new HashMap<>();
        Map<String, String> controls = new HashMap<>();
        Object raw = config == null ? null : config.get("controls");
        if (raw instanceof Map<?, ?> map) {
            map.forEach((k, v) -> controls.put(String.valueOf(k), String.valueOf(v)));
        }
        state.put("controls", controls);
        state.put("cursor", 0);
        state.put("status", "IN_PROGRESS");
        state.put("message", currentHint(config, 0));
        state.put("flight", initialFlight(config));
        return state;
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> apply(Map<String, Object> config, Map<String, Object> state, String part, String value) {
        Map<String, Object> next = new HashMap<>(state == null ? Map.of() : state);
        Map<String, String> controls = new HashMap<>();
        Object raw = next.get("controls");
        if (raw instanceof Map<?, ?> map) {
            map.forEach((k, v) -> controls.put(String.valueOf(k), String.valueOf(v)));
        }
        controls.put(part, value);
        next.put("controls", controls);

        Map<String, Object> flight = copyMap(next.get("flight"));
        if (flight.isEmpty()) {
            flight.putAll(initialFlight(config));
        }

        int cursor = next.get("cursor") instanceof Number n ? n.intValue() : 0;
        List<Map<String, Object>> expected = (List<Map<String, Object>>) config.getOrDefault("expected", List.of());
        List<Map<String, Object>> crash = (List<Map<String, Object>>) config.getOrDefault("crash", List.of());

        for (Map<String, Object> rule : crash) {
            Map<String, Object> when = (Map<String, Object>) rule.getOrDefault("when", Map.of());
            if (matches(when, controls, flight)) {
                mergeFlight(flight, (Map<String, Object>) rule.get("flight"));
                if (!"CRASHED".equals(String.valueOf(flight.get("phase")))) {
                    flight.put("phase", "CRASHED");
                }
                flight.put("phaseLabel", FlightInstruments.phaseLabel(String.valueOf(flight.get("phase"))));
                next.put("flight", flight);
                next.put("status", "CRASHED");
                next.put("message", String.valueOf(rule.getOrDefault("message", "CRASH")));
                next.put("cursor", cursor);
                return next;
            }
        }

        if (cursor < expected.size()) {
            Map<String, Object> step = expected.get(cursor);
            if (part.equals(String.valueOf(step.get("part"))) && value.equals(String.valueOf(step.get("value")))) {
                mergeFlight(flight, (Map<String, Object>) step.get("flight"));
                cursor++;
                next.put("message", cursor >= expected.size()
                        ? "Senaryo tamam. Uçuş/başarı."
                        : "Doğru. " + expected.get(cursor).getOrDefault("hint", ""));
            } else if (part.equals(String.valueOf(step.get("part")))) {
                next.put("message", "Bu tuş doğru ama değer yanlış. " + step.getOrDefault("hint", ""));
            } else {
                next.put("message", "Beklenen tuş değil. " + step.getOrDefault("hint", "İpucuna bak."));
            }
        } else {
            next.put("message", "Senaryo zaten bitti.");
        }
        flight.put("phaseLabel", FlightInstruments.phaseLabel(String.valueOf(flight.getOrDefault("phase", "PARKED"))));
        next.put("flight", flight);
        next.put("cursor", cursor);
        if (cursor >= expected.size()) {
            next.put("status", "PASSED");
        } else {
            next.put("status", "IN_PROGRESS");
        }
        return next;
    }

    @SuppressWarnings("unchecked")
    public static String currentHint(Map<String, Object> config, int cursor) {
        Map<String, Object> step = currentStep(config, cursor);
        if (step == null) {
            return "Tamamlandı.";
        }
        return String.valueOf(step.getOrDefault("hint", ""));
    }

    public static String expectedPart(Map<String, Object> config, int cursor) {
        Map<String, Object> step = currentStep(config, cursor);
        return step == null ? null : String.valueOf(step.get("part"));
    }

    public static String expectedValue(Map<String, Object> config, int cursor) {
        Map<String, Object> step = currentStep(config, cursor);
        return step == null ? null : String.valueOf(step.get("value"));
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> currentStep(Map<String, Object> config, int cursor) {
        List<Map<String, Object>> expected = (List<Map<String, Object>>) config.getOrDefault("expected", List.of());
        if (cursor < 0 || cursor >= expected.size()) {
            return null;
        }
        return expected.get(cursor);
    }

    @SuppressWarnings("unchecked")
    static Map<String, Object> initialFlight(Map<String, Object> config) {
        Map<String, Object> flight = FlightInstruments.parked().asMap();
        Object raw = config == null ? null : config.get("flight");
        if (raw instanceof Map<?, ?> map) {
            mergeFlight(flight, (Map<String, Object>) map);
        }
        flight.put("phaseLabel", FlightInstruments.phaseLabel(String.valueOf(flight.getOrDefault("phase", "PARKED"))));
        return flight;
    }

    private static boolean matches(Map<String, Object> when, Map<String, String> controls, Map<String, Object> flight) {
        for (Map.Entry<String, Object> e : when.entrySet()) {
            String expected = String.valueOf(e.getValue());
            String key = e.getKey();
            if (flight.containsKey(key) && !controls.containsKey(key)) {
                if (!expected.equals(String.valueOf(flight.get(key)))) {
                    return false;
                }
            } else if (!expected.equals(controls.get(key))) {
                return false;
            }
        }
        return true;
    }

    private static void mergeFlight(Map<String, Object> flight, Map<String, Object> overlay) {
        if (overlay == null) {
            return;
        }
        overlay.forEach((k, v) -> {
            if (v != null) {
                flight.put(k, v);
            }
        });
        if (flight.get("phase") != null) {
            flight.put("phaseLabel", FlightInstruments.phaseLabel(String.valueOf(flight.get("phase"))));
        }
    }

    private static Map<String, Object> copyMap(Object raw) {
        Map<String, Object> copy = new HashMap<>();
        if (raw instanceof Map<?, ?> map) {
            map.forEach((k, v) -> copy.put(String.valueOf(k), v));
        }
        return copy;
    }
}
