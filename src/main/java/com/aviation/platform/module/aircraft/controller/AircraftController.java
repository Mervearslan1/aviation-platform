package com.aviation.platform.module.aircraft.controller;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.aircraft.dto.AircraftResponse;
import com.aviation.platform.module.aircraft.dto.LearnActionRequest;
import com.aviation.platform.module.aircraft.dto.PartResponse;
import com.aviation.platform.module.aircraft.dto.SessionResponse;
import com.aviation.platform.module.aircraft.dto.SimActionRequest;
import com.aviation.platform.module.aircraft.dto.SimulationResponse;
import com.aviation.platform.module.aircraft.service.AircraftService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
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
@RequestMapping("/api/v1")
@Tag(name = "Aircraft", description = "Kokpit tuşları, adım adım öğrenme, eğitim simülasyonları")
public class AircraftController {

    private final AircraftService aircraftService;

    public AircraftController(AircraftService aircraftService) {
        this.aircraftService = aircraftService;
    }

    @GetMapping("/aircraft")
    @SecurityRequirements
    @Operation(summary = "Uçaklar (C172, B737, A350)")
    public ApiResponse<List<AircraftResponse>> list(
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(aircraftService.list(actor));
    }

    @GetMapping("/aircraft/{code}/parts")
    @SecurityRequirements
    @Operation(summary = "Kokpit parçaları")
    public ApiResponse<List<PartResponse>> parts(
            @PathVariable String code,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(aircraftService.parts(code, actor));
    }

    @GetMapping("/aircraft/{code}/learn/next")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Sıradaki tuş dersi")
    public ApiResponse<PartResponse> next(
            @PathVariable String code,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(aircraftService.nextLesson(code, actor));
    }

    @PostMapping("/aircraft/{code}/learn")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Tuşu doğru seçerek öğren")
    public ApiResponse<PartResponse> learn(
            @PathVariable String code,
            @Valid @RequestBody LearnActionRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(aircraftService.learn(code, request, actor));
    }

    @GetMapping("/aircraft/{code}/simulations")
    @SecurityRequirements
    @Operation(summary = "Eğitim simülasyonları")
    public ApiResponse<List<SimulationResponse>> simulations(@PathVariable String code) {
        return ApiResponse.of(aircraftService.simulations(code));
    }

    @PostMapping("/simulations/{id}/start")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Simülasyon başlat")
    public ApiResponse<SessionResponse> start(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(aircraftService.startSim(id, actor));
    }

    @PostMapping("/simulations/sessions/{sessionId}/act")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Kokpit tuşu uygula (yanlışsa CRASH)")
    public ApiResponse<SessionResponse> act(
            @PathVariable Long sessionId,
            @Valid @RequestBody SimActionRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(aircraftService.act(sessionId, request, actor));
    }
}
