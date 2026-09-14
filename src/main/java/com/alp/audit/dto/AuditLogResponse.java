package com.alp.audit.dto;

import com.alp.audit.entity.AuditLog;

import java.time.Instant;
import java.util.Map;

public record AuditLogResponse(
        Long id,
        Long userId,
        String action,
        String entityType,
        Long entityId,
        Map<String, Object> metadata,
        String ipAddress,
        Instant createdAt
) {

    public static AuditLogResponse from(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getUserId(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getMetadata(),
                log.getIpAddress(),
                log.getCreatedAt()
        );
    }
}
