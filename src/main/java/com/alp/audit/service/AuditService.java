package com.alp.audit.service;

import com.alp.audit.dto.AuditLogResponse;
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
