package com.aviation.platform.module.audit.repository;

import com.aviation.platform.module.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
