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
    void acceptsAccentedApproved() {
        assertThat(PhraseMatcher.matches(
                "turkish 123 push start appow",
                "Turkish 123 push and start approved",
                List.of()
        )).isTrue();
    }
}
