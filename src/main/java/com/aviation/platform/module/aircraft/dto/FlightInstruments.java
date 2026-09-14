package com.aviation.platform.module.aircraft.dto;

import java.util.HashMap;
import java.util.Map;

public record FlightInstruments(
        String phase,
        String phaseLabel,
        int ias,
        int altitude,
        double pitch,
        double roll,
        int vs,
        int heading,
        String gear,
        boolean onGround,
        int n1
) {

    public static FlightInstruments parked() {
        return from(Map.of());
    }

    public static FlightInstruments from(Object raw) {
        Map<String, Object> m = new HashMap<>();
        if (raw instanceof Map<?, ?> map) {
            map.forEach((k, v) -> m.put(String.valueOf(k), v));
        }
        String phase = str(m.get("phase"), "PARKED");
        return new FlightInstruments(
                phase,
                str(m.get("phaseLabel"), phaseLabel(phase)),
                num(m.get("ias"), 0).intValue(),
                num(m.get("altitude"), 0).intValue(),
                num(m.get("pitch"), 0).doubleValue(),
                num(m.get("roll"), 0).doubleValue(),
                num(m.get("vs"), 0).intValue(),
                num(m.get("heading"), 90).intValue(),
                str(m.get("gear"), "DOWN"),
                bool(m.get("onGround"), true),
                num(m.get("n1"), 20).intValue()
        );
    }

    public Map<String, Object> asMap() {
        Map<String, Object> m = new HashMap<>();
        m.put("phase", phase);
        m.put("phaseLabel", phaseLabel);
        m.put("ias", ias);
        m.put("altitude", altitude);
        m.put("pitch", pitch);
        m.put("roll", roll);
        m.put("vs", vs);
        m.put("heading", heading);
        m.put("gear", gear);
        m.put("onGround", onGround);
        m.put("n1", n1);
        return m;
    }

    public static String phaseLabel(String phase) {
        if (phase == null) {
            return "Park";
        }
        return switch (phase) {
            case "TAXI" -> "Taksi";
            case "LINEUP" -> "Pist hizası";
            case "TAKEOFF_ROLL" -> "Kalkış koşusu";
            case "ROTATE" -> "Rotate";
            case "CLIMB" -> "Tırmanış";
            case "DOWNWIND" -> "Rüzgar altı";
            case "APPROACH" -> "Yaklaşma";
            case "FLARE" -> "Flare";
            case "LANDING" -> "İniş";
            case "CRASHED" -> "Çarpışma";
            default -> "Park";
        };
    }

    private static String str(Object v, String fallback) {
        return v == null ? fallback : String.valueOf(v);
    }

    private static Number num(Object v, Number fallback) {
        return v instanceof Number n ? n : fallback;
    }

    private static boolean bool(Object v, boolean fallback) {
        if (v instanceof Boolean b) {
            return b;
        }
        if (v == null) {
            return fallback;
        }
        return Boolean.parseBoolean(String.valueOf(v));
    }
}
