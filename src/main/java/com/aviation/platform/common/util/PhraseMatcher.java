package com.aviation.platform.common.util;

import java.util.List;
import java.util.Locale;
import java.util.Set;

public final class PhraseMatcher {

    private static final Set<String> FILLER = Set.of("the", "a", "an", "please", "lutfen");

    private PhraseMatcher() {
    }

    public static boolean matches(String spoken, String expected, List<String> accepted) {
        String normalizedSpoken = normalize(spoken);
        if (normalizedSpoken.isBlank()) {
            return false;
        }
        if (containsAllTokens(normalizedSpoken, normalize(expected))) {
            return true;
        }
        if (accepted != null) {
            for (String variant : accepted) {
                if (containsAllTokens(normalizedSpoken, normalize(variant))) {
                    return true;
                }
            }
        }
        return false;
    }

    public static String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase(Locale.ROOT)
                .replace('ı', 'i')
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private static boolean containsAllTokens(String spoken, String expected) {
        if (expected.isBlank()) {
            return false;
        }
        String[] tokens = expected.split(" ");
        int needed = 0;
        int found = 0;
        for (String token : tokens) {
            if (token.isBlank() || FILLER.contains(token)) {
                continue;
            }
            needed++;
            if (spoken.contains(token)) {
                found++;
            }
        }
        return needed > 0 && found * 100 / needed >= 70;
    }
}
