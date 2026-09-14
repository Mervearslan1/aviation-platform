package com.aviation.platform.module.audit.service;

import com.aviation.platform.module.audit.dto.response.AuditLogResponse;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface AuditService {

    void record(
            Long userId,
            String action,
            String entityType,
            Long entityId,
            Map<String, Object> metadata,
            String ipAddress
    );

    Page<AuditLogResponse> list(Integer page, Integer size, String sort);
}
