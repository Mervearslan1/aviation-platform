package com.aviation.platform.module.aircraft.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class SimulationEngine {

    private SimulationEngine() {
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

        int cursor = next.get("cursor") instanceof Number n ? n.intValue() : 0;
        List<Map<String, Object>> expected = (List<Map<String, Object>>) config.getOrDefault("expected", List.of());
        List<Map<String, Object>> crash = (List<Map<String, Object>>) config.getOrDefault("crash", List.of());

        for (Map<String, Object> rule : crash) {
            Map<String, Object> when = (Map<String, Object>) rule.getOrDefault("when", Map.of());
            boolean hit = true;
            for (Map.Entry<String, Object> e : when.entrySet()) {
                if (!String.valueOf(e.getValue()).equals(controls.get(e.getKey()))) {
                    hit = false;
                    break;
                }
            }
            if (hit) {
                next.put("status", "CRASHED");
                next.put("message", String.valueOf(rule.getOrDefault("message", "CRASH")));
                next.put("cursor", cursor);
                return next;
            }
        }

        if (cursor < expected.size()) {
            Map<String, Object> step = expected.get(cursor);
            if (part.equals(String.valueOf(step.get("part"))) && value.equals(String.valueOf(step.get("value")))) {
                cursor++;
                next.put("message", cursor >= expected.size() ? "Senaryo tamam. Uçuş/başarı." : "Doğru. " + expected.get(cursor).getOrDefault("hint", ""));
            } else if (part.equals(String.valueOf(step.get("part")))) {
                next.put("message", "Bu tuş doğru ama değer yanlış. " + step.getOrDefault("hint", ""));
            } else {
                next.put("message", "Beklenen tuş değil. " + step.getOrDefault("hint", "İpucuna bak."));
            }
        } else {
            next.put("message", "Senaryo zaten bitti.");
        }
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
        List<Map<String, Object>> expected = (List<Map<String, Object>>) config.getOrDefault("expected", List.of());
        if (cursor < 0 || cursor >= expected.size()) {
            return "Tamamlandı.";
        }
        return String.valueOf(expected.get(cursor).getOrDefault("hint", ""));
    }
}
