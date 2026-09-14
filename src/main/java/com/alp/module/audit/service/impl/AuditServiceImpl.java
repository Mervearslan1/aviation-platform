package com.alp.module.audit.service.impl;

import com.alp.module.audit.dto.response.AuditLogResponse;
import com.alp.module.audit.entity.AuditLog;
import com.alp.module.audit.repository.AuditLogRepository;
import com.alp.module.audit.service.AuditService;
import com.alp.common.pagination.PageParams;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.Map;
import java.util.Set;

@Service
public class AuditServiceImpl implements AuditService {

    private static final Set<String> SORT_FIELDS = Set.of("createdAt", "action", "entityType", "id");

    private final AuditLogRepository auditLogRepository;
    private final Clock clock;

    public AuditServiceImpl(AuditLogRepository auditLogRepository, Clock clock) {
        this.auditLogRepository = auditLogRepository;
        this.clock = clock;
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(
            Long userId,
            String action,
            String entityType,
            Long entityId,
            Map<String, Object> metadata,
            String ipAddress
    ) {
        auditLogRepository.save(new AuditLog(
                userId,
                action,
                entityType,
                entityId,
                metadata,
                ipAddress,
                Instant.now(clock)
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLogResponse> list(Integer page, Integer size, String sort) {
        return auditLogRepository
                .findAll(PageParams.of(page, size, sort, SORT_FIELDS, "createdAt"))
                .map(AuditLogResponse::from);
    }
}
