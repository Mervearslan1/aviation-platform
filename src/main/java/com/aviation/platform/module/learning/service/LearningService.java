package com.aviation.platform.module.learning.service;

import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.learning.dto.request.CompleteStepRequest;
import com.aviation.platform.module.learning.dto.request.SavePathRequest;
import com.aviation.platform.module.learning.dto.request.SaveStepRequest;
import com.aviation.platform.module.learning.dto.response.PathResponse;
import com.aviation.platform.module.learning.dto.response.StepResponse;

import java.util.List;

public interface LearningService {

    PathResponse createPath(SavePathRequest request);

    PathResponse updatePath(Long id, SavePathRequest request);

    PathResponse publishPath(Long id);

    StepResponse addStep(Long pathId, SaveStepRequest request);

    List<PathResponse> listPublished(com.aviation.platform.module.learning.entity.TrainingTrack track);

    PathResponse getPublished(String slug, CurrentUser actor);

    PathResponse enroll(Long pathId, CurrentUser actor);

    StepResponse openStep(Long pathId, Long stepId, CurrentUser actor);

    PathResponse completeStep(Long pathId, Long stepId, CompleteStepRequest request, CurrentUser actor);
}
