package com.aviation.platform.module.learning.dto.response;

import com.aviation.platform.module.learning.entity.LearningStepTerm;

public record GlossaryTermResponse(String term, String meaning) {

    public static GlossaryTermResponse from(LearningStepTerm item) {
        return new GlossaryTermResponse(item.getTerm(), item.getMeaning());
    }
}
