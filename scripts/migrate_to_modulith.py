"""One-shot layout migration: single module → modular monolith."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OLD_MAIN = ROOT / "src" / "main" / "java"
OLD_RES = ROOT / "src" / "main" / "resources"
OLD_TEST = ROOT / "src" / "test" / "java"
OLD_TEST_RES = ROOT / "src" / "test" / "resources"

IMPORT_REPLACEMENTS = [
    ("com.alp.user.entity.RoleName", "com.alp.identity.api.RoleName"),
    ("com.alp.user.entity.UserStatus", "com.alp.identity.api.UserStatus"),
    ("com.alp.common.security.CurrentUser", "com.alp.identity.api.CurrentUser"),
    ("com.alp.common.validation.PasswordPolicy", "com.alp.identity.domain.PasswordPolicy"),
    ("com.alp.common.util.TokenHasher", "com.alp.identity.domain.TokenHasher"),
    ("com.alp.user.entity", "com.alp.identity.domain"),
    ("com.alp.user.repository", "com.alp.identity.infrastructure.persistence"),
    ("com.alp.user.dto", "com.alp.identity.infrastructure.web.dto"),
    ("com.alp.user.mapper", "com.alp.identity.application"),
    ("com.alp.user.service", "com.alp.identity.application"),
    ("com.alp.user.controller", "com.alp.identity.infrastructure.web"),
    ("com.alp.user.config", "com.alp.identity.infrastructure.seed"),
    ("com.alp.auth.dto", "com.alp.identity.infrastructure.web.dto"),
    ("com.alp.auth.entity", "com.alp.identity.domain"),
    ("com.alp.auth.repository", "com.alp.identity.infrastructure.persistence"),
    ("com.alp.auth.service", "com.alp.identity.application"),
    ("com.alp.auth.controller", "com.alp.identity.infrastructure.web"),
    ("com.alp.audit.entity", "com.alp.audit.domain"),
    ("com.alp.audit.repository", "com.alp.audit.infrastructure.persistence"),
    ("com.alp.audit.dto", "com.alp.audit.infrastructure.web.dto"),
    ("com.alp.audit.service", "com.alp.audit.application"),
    ("com.alp.audit.controller", "com.alp.audit.infrastructure.web"),
    ("com.alp.common.config.SecurityConfig", "com.alp.SecurityConfig"),
    ("com.alp.common.config.OpenApiConfig", "com.alp.OpenApiConfig"),
    ("com.alp.common.config.AppConfig", "com.alp.AppConfig"),
]


def java_path(module: str, package: str, name: str) -> Path:
    return ROOT / module / "src" / "main" / "java" / package.replace(".", "/") / name


def test_path(module: str, package: str, name: str) -> Path:
    return ROOT / module / "src" / "test" / "java" / package.replace(".", "/") / name


def rewrite(text: str, new_package: str) -> str:
    text = text.replace(text.split(";", 1)[0] + ";", f"package {new_package};", 1)
    for old, new in IMPORT_REPLACEMENTS:
        text = text.replace(old, new)
    return text


def copy_java(src: Path, module: str, new_package: str, filename: str | None = None) -> Path:
    dest = java_path(module, new_package, filename or src.name)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(rewrite(src.read_text(encoding="utf-8"), new_package), encoding="utf-8")
    return dest


def copy_test(src: Path, module: str, new_package: str) -> Path:
    dest = test_path(module, new_package, src.name)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(rewrite(src.read_text(encoding="utf-8"), new_package), encoding="utf-8")
    return dest


def copy_resource(src: Path, module: str, relative: str) -> None:
    dest = ROOT / module / "src" / "main" / "resources" / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)


MOVES = [
    # common (same packages)
    ("com/alp/common/exception/ErrorCode.java", "alp-common", "com.alp.common.exception"),
    ("com/alp/common/exception/ApiException.java", "alp-common", "com.alp.common.exception"),
    ("com/alp/common/exception/GlobalExceptionHandler.java", "alp-common", "com.alp.common.exception"),
    ("com/alp/common/response/FieldErrorResponse.java", "alp-common", "com.alp.common.response"),
    ("com/alp/common/response/ApiErrorResponse.java", "alp-common", "com.alp.common.response"),
    ("com/alp/common/response/ApiResponse.java", "alp-common", "com.alp.common.response"),
    ("com/alp/common/response/PagedResponse.java", "alp-common", "com.alp.common.response"),
    ("com/alp/common/pagination/PageParams.java", "alp-common", "com.alp.common.pagination"),
    ("com/alp/common/util/ClientIp.java", "alp-common", "com.alp.common.util"),
    ("com/alp/common/config/AlpProperties.java", "alp-common", "com.alp.common.config"),
    ("com/alp/common/security/ErrorResponseWriter.java", "alp-common", "com.alp.common.security"),
    ("com/alp/common/security/RestAuthenticationEntryPoint.java", "alp-common", "com.alp.common.security"),
    ("com/alp/common/security/RestAccessDeniedHandler.java", "alp-common", "com.alp.common.security"),
    # identity api / domain
    ("com/alp/common/security/CurrentUser.java", "alp-identity", "com.alp.identity.api"),
    ("com/alp/user/entity/RoleName.java", "alp-identity", "com.alp.identity.api"),
    ("com/alp/user/entity/UserStatus.java", "alp-identity", "com.alp.identity.api"),
    ("com/alp/common/validation/PasswordPolicy.java", "alp-identity", "com.alp.identity.domain"),
    ("com/alp/common/util/TokenHasher.java", "alp-identity", "com.alp.identity.domain"),
    ("com/alp/user/entity/User.java", "alp-identity", "com.alp.identity.domain"),
    ("com/alp/user/entity/Role.java", "alp-identity", "com.alp.identity.domain"),
    ("com/alp/auth/entity/RefreshToken.java", "alp-identity", "com.alp.identity.domain"),
    ("com/alp/user/repository/UserRepository.java", "alp-identity", "com.alp.identity.infrastructure.persistence"),
    ("com/alp/user/repository/RoleRepository.java", "alp-identity", "com.alp.identity.infrastructure.persistence"),
    ("com/alp/auth/repository/RefreshTokenRepository.java", "alp-identity", "com.alp.identity.infrastructure.persistence"),
    ("com/alp/user/mapper/UserMapper.java", "alp-identity", "com.alp.identity.application"),
    ("com/alp/user/service/UserService.java", "alp-identity", "com.alp.identity.application"),
    ("com/alp/auth/service/AuthService.java", "alp-identity", "com.alp.identity.application"),
    ("com/alp/auth/service/JwtService.java", "alp-identity", "com.alp.identity.application"),
    ("com/alp/user/dto/UserResponse.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/user/dto/UpdateUserStatusRequest.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/user/dto/UpdateUserRolesRequest.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/auth/dto/RegisterRequest.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/auth/dto/LoginRequest.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/auth/dto/RefreshRequest.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/auth/dto/LogoutRequest.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/auth/dto/TokenResponse.java", "alp-identity", "com.alp.identity.infrastructure.web.dto"),
    ("com/alp/auth/controller/AuthController.java", "alp-identity", "com.alp.identity.infrastructure.web"),
    ("com/alp/user/controller/UserController.java", "alp-identity", "com.alp.identity.infrastructure.web"),
    ("com/alp/common/security/JwtAuthenticationFilter.java", "alp-identity", "com.alp.identity.infrastructure.security"),
    ("com/alp/user/config/AdminSeedRunner.java", "alp-identity", "com.alp.identity.infrastructure.seed"),
    # audit
    ("com/alp/audit/entity/AuditLog.java", "alp-audit", "com.alp.audit.domain"),
    ("com/alp/audit/repository/AuditLogRepository.java", "alp-audit", "com.alp.audit.infrastructure.persistence"),
    ("com/alp/audit/dto/AuditLogResponse.java", "alp-audit", "com.alp.audit.infrastructure.web.dto"),
    ("com/alp/audit/service/AuditService.java", "alp-audit", "com.alp.audit.application"),
    ("com/alp/audit/controller/AuditLogController.java", "alp-audit", "com.alp.audit.infrastructure.web"),
    # app composition root
    ("com/alp/AviationLearningPlatformApplication.java", "alp-app", "com.alp"),
    ("com/alp/common/config/AppConfig.java", "alp-app", "com.alp"),
    ("com/alp/common/config/OpenApiConfig.java", "alp-app", "com.alp"),
    ("com/alp/common/config/SecurityConfig.java", "alp-app", "com.alp"),
]

TESTS = [
    ("com/alp/common/validation/PasswordPolicyTest.java", "alp-identity", "com.alp.identity.domain"),
    ("com/alp/auth/service/JwtServiceTest.java", "alp-identity", "com.alp.identity.application"),
    ("com/alp/auth/service/AuthServiceTest.java", "alp-identity", "com.alp.identity.application"),
    ("com/alp/user/service/UserServiceTest.java", "alp-identity", "com.alp.identity.application"),
    ("com/alp/auth/AuthIntegrationTest.java", "alp-app", "com.alp.identity"),
    ("com/alp/AviationLearningPlatformApplicationTests.java", "alp-app", "com.alp"),
    ("com/alp/TestcontainersConfiguration.java", "alp-app", "com.alp"),
    ("com/alp/DockerAvailability.java", "alp-app", "com.alp"),
]


def main() -> None:
    for rel, module, package in MOVES:
        copy_java(OLD_MAIN / rel, module, package)
    for rel, module, package in TESTS:
        copy_test(OLD_TEST / rel, module, package)

    copy_resource(OLD_RES / "application.yml", "alp-app", "application.yml")
    copy_resource(OLD_RES / "db/migration/V1__create_users.sql", "alp-identity", "db/migration/V1__create_users.sql")
    copy_resource(OLD_RES / "db/migration/V2__create_roles.sql", "alp-identity", "db/migration/V2__create_roles.sql")
    copy_resource(OLD_RES / "db/migration/V3__create_refresh_tokens.sql", "alp-identity", "db/migration/V3__create_refresh_tokens.sql")
    copy_resource(OLD_RES / "db/migration/V4__create_audit_logs.sql", "alp-audit", "db/migration/V4__create_audit_logs.sql")

    dest = ROOT / "alp-app" / "src" / "test" / "resources" / "application.yml"
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(OLD_TEST_RES / "application.yml", dest)

    print("copied sources")


if __name__ == "__main__":
    main()
