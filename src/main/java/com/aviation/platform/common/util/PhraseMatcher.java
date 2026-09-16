package com.aviation.platform.common.util;

import java.util.List;
import java.util.Locale;
import java.util.Set;

public final class PhraseMatcher {

    private static final Set<String> FILLER = Set.of("the", "a", "an", "please", "lutfen", "ok", "okay", "uh", "um");

    private PhraseMatcher() {
    }

    public static boolean matches(String spoken, String expected, List<String> accepted) {
        if (closeEnough(spoken, expected)) {
            return true;
        }
        if (accepted != null) {
            for (String variant : accepted) {
                if (closeEnough(spoken, variant)) {
                    return true;
                }
            }
        }
        return false;
    }

    static boolean closeEnough(String spoken, String expected) {
        String[] spokenTokens = normalize(spoken).split(" ");
        String[] tokens = normalize(expected).split(" ");
        int needed = 0;
        int found = 0;
        for (String token : tokens) {
            if (token.isBlank() || FILLER.contains(token)) {
                continue;
            }
            needed++;
            for (String s : spokenTokens) {
                if (close(s, token)) {
                    found++;
                    break;
                }
            }
        }
        return needed > 0 && found * 100 / needed >= 70;
    }

    static boolean close(String spokenToken, String expected) {
        if (spokenToken.isBlank() || expected.isBlank()) {
            return false;
        }
        if (spokenToken.equals(expected)) {
            return true;
        }
        if ((spokenToken.contains(expected) || expected.contains(spokenToken))
                && Math.min(spokenToken.length(), expected.length()) >= 3) {
            return true;
        }
        int allow = Math.max(2, expected.length() * 45 / 100);
        return levenshtein(spokenToken, expected) <= allow;
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

    static int levenshtein(String a, String b) {
        int m = a.length();
        int n = b.length();
        int[] prev = new int[n + 1];
        int[] cur = new int[n + 1];
        for (int j = 0; j <= n; j++) {
            prev[j] = j;
        }
        for (int i = 1; i <= m; i++) {
            cur[0] = i;
            for (int j = 1; j <= n; j++) {
                int cost = a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1;
                cur[j] = Math.min(Math.min(cur[j - 1] + 1, prev[j] + 1), prev[j - 1] + cost);
            }
            int[] tmp = prev;
            prev = cur;
            cur = tmp;
        }
        return prev[n];
    }
}
