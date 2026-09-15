package com.aviation.platform.module.learning.controller;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.module.learning.dto.response.CatalogResponse;
import com.aviation.platform.module.learning.service.LearningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/catalog")
@Tag(name = "Catalog", description = "Kule, pilot ve uçak adımlarının açık haritası (bilgi seviyesi ile)")
public class CatalogController {

    private final LearningService learningService;

    public CatalogController(LearningService learningService) {
        this.learningService = learningService;
    }

    @GetMapping
    @SecurityRequirements
    @Operation(summary = "Tüm hatlar ve uçaklar — adımlar kilitli değil, seviye görünür")
    public ApiResponse<CatalogResponse> catalog() {
        return ApiResponse.of(learningService.catalog());
    }
}
