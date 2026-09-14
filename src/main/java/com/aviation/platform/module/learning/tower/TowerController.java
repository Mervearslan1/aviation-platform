package com.aviation.platform.module.learning.tower;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.learning.dto.request.CompleteStepRequest;
import com.aviation.platform.module.learning.dto.response.PathResponse;
import com.aviation.platform.module.learning.dto.response.StepResponse;
import com.aviation.platform.module.learning.entity.TrainingTrack;
import com.aviation.platform.module.learning.service.LearningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tower")
@Tag(name = "Tower", description = "Kule hattı — dinle, konuş, senaryo, sözlük, IVAO")
public class TowerController {

    private final LearningService learningService;

    public TowerController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping("/paths")
    @SecurityRequirements
    @Operation(summary = "Kule öğrenme yolları")
    public ApiResponse<List<PathResponse>> list() {
        return ApiResponse.of(learningService.listPublished(TrainingTrack.TOWER));
    }

    @GetMapping("/paths/{slug}")
    @SecurityRequirements
    @Operation(summary = "Kule yolu")
    public ApiResponse<PathResponse> get(
            @PathVariable String slug,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.getPublished(slug, actor, TrainingTrack.TOWER));
    }

    @PostMapping("/paths/{id}/enroll")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Kule yoluna katıl")
    public ApiResponse<PathResponse> enroll(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.enroll(id, actor, TrainingTrack.TOWER));
    }

    @PostMapping("/paths/{pathId}/steps/{stepId}/open")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<StepResponse> open(
            @PathVariable Long pathId,
            @PathVariable Long stepId,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.openStep(pathId, stepId, actor));
    }

    @PostMapping("/paths/{pathId}/steps/{stepId}/complete")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<PathResponse> complete(
            @PathVariable Long pathId,
            @PathVariable Long stepId,
            @RequestBody(required = false) CompleteStepRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.completeStep(pathId, stepId, request, actor));
    }
}
