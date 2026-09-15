package com.aviation.platform.module.learning.controller;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.learning.dto.request.CompleteStepRequest;
import com.aviation.platform.module.learning.dto.request.SavePathRequest;
import com.aviation.platform.module.learning.dto.request.SaveStepRequest;
import com.aviation.platform.module.learning.dto.response.PathResponse;
import com.aviation.platform.module.learning.dto.response.StepResponse;
import com.aviation.platform.module.learning.entity.TrainingTrack;
import com.aviation.platform.module.learning.service.LearningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/learning-paths")
@Tag(name = "Learning", description = "Tüm adımlar açık. Yeni başlayan sırayla gider, bilen istediği adıma atlar.")
public class LearningController {

    private final LearningService learningService;

    public LearningController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping
    @SecurityRequirements
    @Operation(summary = "Yayımlanmış öğrenme yolları")
    public ApiResponse<List<PathResponse>> list(@RequestParam(required = false) TrainingTrack track) {
        return ApiResponse.of(learningService.listPublished(track));
    }

    @GetMapping("/{slug}")
    @SecurityRequirements
    @Operation(summary = "Yol detayı — tüm adımlar okunabilir, sıra öneridir")
    public ApiResponse<PathResponse> get(
            @PathVariable String slug,
            @RequestParam(required = false) TrainingTrack track,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.getPublished(slug, actor, track));
    }

    @PostMapping("/{id}/enroll")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Yola katıl — tüm adımlar açık, önerilen adım işaretlenir")
    public ApiResponse<PathResponse> enroll(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.enroll(id, actor, null));
    }

    @PostMapping("/{pathId}/steps/{stepId}/open")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Adımı aç")
    public ApiResponse<StepResponse> open(
            @PathVariable Long pathId,
            @PathVariable Long stepId,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.openStep(pathId, stepId, actor));
    }

    @PostMapping("/{pathId}/steps/{stepId}/complete")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Adımı tamamla (practice ise answer gerekir)")
    public ApiResponse<PathResponse> complete(
            @PathVariable Long pathId,
            @PathVariable Long stepId,
            @RequestBody(required = false) CompleteStepRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(learningService.completeStep(pathId, stepId, request, actor));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Yeni öğrenme yolu")
    public ApiResponse<PathResponse> create(@Valid @RequestBody SavePathRequest request) {
        return ApiResponse.of(learningService.createPath(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Yolu güncelle")
    public ApiResponse<PathResponse> update(@PathVariable Long id, @Valid @RequestBody SavePathRequest request) {
        return ApiResponse.of(learningService.updatePath(id, request));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Yolu yayımla")
    public ApiResponse<PathResponse> publish(@PathVariable Long id) {
        return ApiResponse.of(learningService.publishPath(id));
    }

    @PostMapping("/{id}/steps")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN')")
    @Operation(summary = "Yola adım ekle (CONTENT / PRACTICE / SIMULATION)")
    public ApiResponse<StepResponse> addStep(@PathVariable Long id, @Valid @RequestBody SaveStepRequest request) {
        return ApiResponse.of(learningService.addStep(id, request));
    }
}
