package com.aviation.platform.module.user.dto.request;

import com.aviation.platform.module.user.entity.KnowledgeLevel;
import jakarta.validation.constraints.NotNull;

public record UpdateKnowledgeLevelRequest(
        @NotNull KnowledgeLevel knowledgeLevel
) {
}
