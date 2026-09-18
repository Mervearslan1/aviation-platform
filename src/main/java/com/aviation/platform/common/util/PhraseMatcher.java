package com.aviation.platform.common.util;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

public final class PhraseMatcher {

    private static final Set<String> FILLER = Set.of("the", "a", "an", "please", "lutfen", "ok", "okay", "uh", "um");
    private static final int PASS_PERCENT = 50;

    private static final List<List<String>> FAMILIES = List.of(
            List.of("alpha", "alfa", "alfe", "a"),
            List.of("bravo", "brawo", "bravoo", "b"),
            List.of("charlie", "charli", "charley", "carli", "sharli", "sarli", "c"),
            List.of("delta", "delte", "d"),
            List.of("echo", "eko", "eco", "ecko", "e"),
            List.of("foxtrot", "fox", "fokstrot", "f"),
            List.of("golf", "golfu", "g"),
            List.of("hotel", "otel", "h"),
            List.of("india", "indya", "i"),
            List.of("juliet", "juliett", "julie", "julyet", "culiet", "j"),
            List.of("kilo", "killo", "k"),
            List.of("lima", "leema", "lyma", "l"),
            List.of("mike", "mayk", "maik", "m"),
            List.of("november", "novembr", "novembe", "n"),
            List.of("oscar", "oskar", "osker", "o"),
            List.of("papa", "pappa", "p"),
            List.of("quebec", "kebek", "kubek", "q"),
            List.of("romeo", "romyo", "romio", "r"),
            List.of("sierra", "siera", "siyera", "s"),
            List.of("tango", "tengoo", "tengo", "t"),
            List.of("uniform", "unifom", "yuniform", "u"),
            List.of("victor", "viktor", "wiktor", "v"),
            List.of("whiskey", "whisky", "viski", "wiski", "w"),
            List.of("xray", "exray", "eksray", "eksrey", "x"),
            List.of("yankee", "yanki", "yenki", "y"),
            List.of("zulu", "zoolu", "zoulou", "z"),
            List.of("turkish", "thy", "tk"),
            List.of("pegasus", "pgt"),
            List.of("anadolu", "ajet", "anadolujet", "ahi"),
            List.of("sunexpress", "sxs"),
            List.of("approved", "appow", "aprove", "approve", "aproved"),
            List.of("runway", "runwey", "pist"),
            List.of("taxi", "taksi")
    );

    private static final Map<String, String> NUM = Map.ofEntries(
            Map.entry("zero", "0"), Map.entry("one", "1"), Map.entry("two", "2"),
            Map.entry("three", "3"), Map.entry("tree", "3"), Map.entry("four", "4"),
            Map.entry("five", "5"), Map.entry("fife", "5"),
            Map.entry("six", "6"), Map.entry("seven", "7"), Map.entry("eight", "8"),
            Map.entry("nine", "9"), Map.entry("niner", "9")
    );

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
        return needed > 0 && found * 100 / needed >= PASS_PERCENT;
    }

    static boolean close(String spokenToken, String expected) {
        String a = family(spokenToken);
        String b = family(expected);
        if (a.isBlank() || b.isBlank()) {
            return false;
        }
        if (a.equals(b)) {
            return true;
        }
        if ((a.contains(b) || b.contains(a)) && Math.min(a.length(), b.length()) >= 3) {
            return true;
        }
        int allow = Math.max(2, b.length() * 45 / 100);
        return levenshtein(a, b) <= allow;
    }

    static String family(String token) {
        for (List<String> g : FAMILIES) {
            if (g.contains(token)) {
                return g.get(0);
            }
        }
        return NUM.getOrDefault(token, token);
    }

    public static String normalize(String value) {
        if (value == null) {
            return "";
        }
        return value.toLowerCase(Locale.ROOT)
                .replace('ı', 'i')
                .replace('ç', 'c')
                .replace('ş', 's')
                .replace('ğ', 'g')
                .replace('ö', 'o')
                .replace('ü', 'u')
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\bsun express\\b", "sunexpress")
                .replaceAll("\\btriple seven\\b", "777")
                .replaceAll("([a-z]+)(\\d)", "$1 $2")
                .replaceAll("(\\d)([a-z]+)", "$1 $2")
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
