package com.aviation.platform.common.util;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PhraseMatcherTest {

    @Test
    void acceptsTowerReadback() {
        assertThat(PhraseMatcher.matches(
                "okay turkish 123 push and start approved",
                "Turkish 123 push and start approved",
                List.of()
        )).isTrue();
    }

    @Test
    void rejectsUnrelatedPhrase() {
        assertThat(PhraseMatcher.matches(
                "cleared to land",
                "Turkish 123 push and start approved",
                List.of()
        )).isFalse();
    }

    @Test
    void acceptsCharlieSpelling() {
        assertThat(PhraseMatcher.matches(
                "taxi via charli",
                "taxi via Charlie",
                List.of()
        )).isTrue();
    }

    @Test
    void acceptsAccentedApproved() {
        assertThat(PhraseMatcher.matches(
                "turkish 123 push start appow",
                "Turkish 123 push and start approved",
                List.of()
        )).isTrue();
    }

    @Test
    void acceptsCharlieAloneAgainstAccepted() {
        assertThat(PhraseMatcher.matches(
                "charli",
                "Turkish 102J taxi via Charlie hold short runway 03",
                List.of("taxi via charlie", "charli", "charlie")
        )).isTrue();
    }

    @Test
    void acceptsJulietCallsign() {
        assertThat(PhraseMatcher.matches(
                "ground turkish 102 juliet request taxi via charli",
                "Ground Turkish 102J request taxi via Charlie",
                List.of()
        )).isTrue();
    }
}
