package com.aviation.platform.module.audit.controller;

import com.aviation.platform.module.audit.dto.response.AuditLogResponse;
import com.aviation.platform.module.audit.service.AuditService;
import com.aviation.platform.common.response.PagedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit-logs")
@Tag(name = "Audit", description = "ADMIN JWT gerekir.")
public class AuditLogController {

    private final AuditService auditService;

    public AuditLogController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Audit log listesi (ADMIN)")
    public PagedResponse<AuditLogResponse> list(
            @Parameter(description = "Sayfa, 0'dan başlar") @RequestParam(required = false) Integer page,
            @Parameter(description = "Sayfa boyutu, max 100") @RequestParam(required = false) Integer size,
            @Parameter(description = "Örn. createdAt,desc") @RequestParam(required = false) String sort
    ) {
        return PagedResponse.of(auditService.list(page, size, sort));
    }
}
