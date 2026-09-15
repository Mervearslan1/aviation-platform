package com.aviation.platform.module.user.controller;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.common.response.PagedResponse;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.user.dto.request.CreateTeamApplicationRequest;
import com.aviation.platform.module.user.dto.request.ReviewTeamApplicationRequest;
import com.aviation.platform.module.user.dto.response.TeamApplicationResponse;
import com.aviation.platform.module.user.service.TeamApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/team-applications")
@Tag(name = "Team applications", description = "Bize katıl formu. İnceleme ADMIN.")
public class TeamApplicationController {

    private final TeamApplicationService teamApplicationService;

    public TeamApplicationController(TeamApplicationService teamApplicationService) {
        this.teamApplicationService = teamApplicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirements
    @Operation(summary = "Ekibe katıl başvurusu (herkese açık)")
    public ApiResponse<TeamApplicationResponse> submit(@Valid @RequestBody CreateTeamApplicationRequest request) {
        return ApiResponse.of(teamApplicationService.submit(request));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Başvuruları listele (ADMIN)")
    public PagedResponse<TeamApplicationResponse> list(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort
    ) {
        return PagedResponse.of(teamApplicationService.list(page, size, sort));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Başvuruyu onayla veya reddet. Onayda e-posta eşleşirse AUTHOR/EDITOR verilir.")
    public ApiResponse<TeamApplicationResponse> review(
            @PathVariable Long id,
            @Valid @RequestBody ReviewTeamApplicationRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(teamApplicationService.review(id, request, actor));
    }
}
