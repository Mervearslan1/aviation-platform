package com.aviation.platform.module.learning.dto.response;

import com.aviation.platform.module.learning.entity.CatalogStatus;
import com.aviation.platform.module.learning.entity.Difficulty;
import com.aviation.platform.module.learning.entity.LearningPath;
import com.aviation.platform.module.learning.entity.PathProgressStatus;
import com.aviation.platform.module.learning.entity.TrainingTrack;

import java.time.Instant;
import java.util.List;

public record PathResponse(
        Long id,
        String title,
        String slug,
        String description,
        Difficulty difficulty,
        CatalogStatus status,
        TrainingTrack track,
        int stepCount,
        Integer progressPercent,
        PathProgressStatus enrollmentStatus,
        List<StepResponse> steps,
        Instant createdAt
) {

    public static PathResponse summary(LearningPath path, int stepCount) {
        return new PathResponse(
                path.getId(),
                path.getTitle(),
                path.getSlug(),
                path.getDescription(),
                path.getDifficulty(),
                path.getStatus(),
                path.getTrack(),
                stepCount,
                null,
                null,
                List.of(),
                path.getCreatedAt()
        );
    }

    public static PathResponse detail(
            LearningPath path,
            List<StepResponse> steps,
            Integer progressPercent,
            PathProgressStatus enrollmentStatus
    ) {
        return new PathResponse(
                path.getId(),
                path.getTitle(),
                path.getSlug(),
                path.getDescription(),
                path.getDifficulty(),
                path.getStatus(),
                path.getTrack(),
                steps.size(),
                progressPercent,
                enrollmentStatus,
                steps,
                path.getCreatedAt()
        );
    }
}
