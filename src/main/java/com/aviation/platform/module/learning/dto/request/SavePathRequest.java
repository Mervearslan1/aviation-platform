package com.aviation.platform.module.learning.dto.request;

import com.aviation.platform.module.learning.entity.CatalogStatus;
import com.aviation.platform.module.learning.entity.Difficulty;
import com.aviation.platform.module.learning.entity.TrainingTrack;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SavePathRequest(
        @NotBlank @Size(max = 200) String title,
        @Size(max = 4000) String description,
        Difficulty difficulty,
        CatalogStatus status,
        TrainingTrack track
) {
}
