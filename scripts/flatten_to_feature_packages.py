"""Collapse Maven modules into one Spring Boot app with package-by-feature."""
from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src" / "main" / "java"
TEST = ROOT / "src" / "test" / "java"
RES = ROOT / "src" / "main" / "resources"
TEST_RES = ROOT / "src" / "test" / "resources"

REPLACEMENTS = [
    ("com.alp.identity.api.CurrentUser", "com.alp.common.security.CurrentUser"),
    ("com.alp.identity.api.RoleName", "com.alp.user.entity.RoleName"),
    ("com.alp.identity.api.UserStatus", "com.alp.user.entity.UserStatus"),
    ("com.alp.identity.domain.PasswordPolicy", "com.alp.auth.service.PasswordPolicy"),
    ("com.alp.identity.domain.TokenHasher", "com.alp.common.util.TokenHasher"),
    ("com.alp.identity.domain.RefreshToken", "com.alp.auth.entity.RefreshToken"),
    ("com.alp.identity.domain", "com.alp.user.entity"),
    ("com.alp.identity.infrastructure.persistence.RefreshTokenRepository", "com.alp.auth.repository.RefreshTokenRepository"),
    ("com.alp.identity.infrastructure.persistence", "com.alp.user.repository"),
    ("com.alp.identity.infrastructure.web.dto.UserResponse", "com.alp.user.dto.UserResponse"),
    ("com.alp.identity.infrastructure.web.dto.UpdateUserStatusRequest", "com.alp.user.dto.UpdateUserStatusRequest"),
    ("com.alp.identity.infrastructure.web.dto.UpdateUserRolesRequest", "com.alp.user.dto.UpdateUserRolesRequest"),
    ("com.alp.identity.infrastructure.web.dto", "com.alp.auth.dto"),
    ("com.alp.identity.infrastructure.web.AuthController", "com.alp.auth.controller.AuthController"),
    ("com.alp.identity.infrastructure.web.UserController", "com.alp.user.controller.UserController"),
    ("com.alp.identity.infrastructure.security", "com.alp.auth.security"),
    ("com.alp.identity.infrastructure.seed", "com.alp.user"),
    ("com.alp.identity.application.JwtService", "com.alp.auth.service.JwtService"),
    ("com.alp.identity.application.UserMapper", "com.alp.user.service.UserMapper"),
    ("com.alp.identity.application.AuthService", "com.alp.auth.service.AuthService"),
    ("com.alp.identity.application.UserService", "com.alp.user.service.UserService"),
    ("com.alp.audit.domain", "com.alp.audit.entity"),
    ("com.alp.audit.infrastructure.persistence", "com.alp.audit.repository"),
    ("com.alp.audit.infrastructure.web.dto", "com.alp.audit.dto"),
    ("com.alp.audit.infrastructure.web", "com.alp.audit.controller"),
    ("com.alp.audit.application", "com.alp.audit.service"),
]


def rewrite(text: str, new_package: str) -> str:
    first_semi = text.find(";")
    text = f"package {new_package};" + text[first_semi + 1 :]
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def copy_java(src: Path, package: str, name: str | None = None, test: bool = False) -> None:
    dest_root = TEST if test else SRC
    dest = dest_root / package.replace(".", "/") / (name or src.name)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(rewrite(src.read_text(encoding="utf-8"), package), encoding="utf-8")


def copy_res(src: Path, relative: str, test: bool = False) -> None:
    dest = (TEST_RES if test else RES) / relative
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)


MOVES = [
    ("alp-app/src/main/java/com/alp/AviationLearningPlatformApplication.java", "com.alp"),
    ("alp-app/src/main/java/com/alp/AppConfig.java", "com.alp"),
    ("alp-app/src/main/java/com/alp/OpenApiConfig.java", "com.alp"),
    ("alp-app/src/main/java/com/alp/SecurityConfig.java", "com.alp"),
    ("alp-common/src/main/java/com/alp/common/exception/ErrorCode.java", "com.alp.common.exception"),
    ("alp-common/src/main/java/com/alp/common/exception/ApiException.java", "com.alp.common.exception"),
    ("alp-common/src/main/java/com/alp/common/exception/GlobalExceptionHandler.java", "com.alp.common.exception"),
    ("alp-common/src/main/java/com/alp/common/response/FieldErrorResponse.java", "com.alp.common.response"),
    ("alp-common/src/main/java/com/alp/common/response/ApiErrorResponse.java", "com.alp.common.response"),
    ("alp-common/src/main/java/com/alp/common/response/ApiResponse.java", "com.alp.common.response"),
    ("alp-common/src/main/java/com/alp/common/response/PagedResponse.java", "com.alp.common.response"),
    ("alp-common/src/main/java/com/alp/common/pagination/PageParams.java", "com.alp.common.pagination"),
    ("alp-common/src/main/java/com/alp/common/util/ClientIp.java", "com.alp.common.util"),
    ("alp-common/src/main/java/com/alp/common/config/AlpProperties.java", "com.alp.common.config"),
    ("alp-common/src/main/java/com/alp/common/security/ErrorResponseWriter.java", "com.alp.common.security"),
    ("alp-common/src/main/java/com/alp/common/security/RestAuthenticationEntryPoint.java", "com.alp.common.security"),
    ("alp-common/src/main/java/com/alp/common/security/RestAccessDeniedHandler.java", "com.alp.common.security"),
    ("alp-identity/src/main/java/com/alp/identity/api/CurrentUser.java", "com.alp.common.security"),
    ("alp-identity/src/main/java/com/alp/identity/api/RoleName.java", "com.alp.user.entity"),
    ("alp-identity/src/main/java/com/alp/identity/api/UserStatus.java", "com.alp.user.entity"),
    ("alp-identity/src/main/java/com/alp/identity/domain/User.java", "com.alp.user.entity"),
    ("alp-identity/src/main/java/com/alp/identity/domain/Role.java", "com.alp.user.entity"),
    ("alp-identity/src/main/java/com/alp/identity/domain/PasswordPolicy.java", "com.alp.auth.service"),
    ("alp-identity/src/main/java/com/alp/identity/domain/TokenHasher.java", "com.alp.common.util"),
    ("alp-identity/src/main/java/com/alp/identity/domain/RefreshToken.java", "com.alp.auth.entity"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/persistence/UserRepository.java", "com.alp.user.repository"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/persistence/RoleRepository.java", "com.alp.user.repository"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/persistence/RefreshTokenRepository.java", "com.alp.auth.repository"),
    ("alp-identity/src/main/java/com/alp/identity/application/UserMapper.java", "com.alp.user.service"),
    ("alp-identity/src/main/java/com/alp/identity/application/JwtService.java", "com.alp.auth.service"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/UserResponse.java", "com.alp.user.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/UpdateUserStatusRequest.java", "com.alp.user.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/UpdateUserRolesRequest.java", "com.alp.user.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/RegisterRequest.java", "com.alp.auth.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/LoginRequest.java", "com.alp.auth.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/RefreshRequest.java", "com.alp.auth.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/LogoutRequest.java", "com.alp.auth.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/dto/TokenResponse.java", "com.alp.auth.dto"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/AuthController.java", "com.alp.auth.controller"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/web/UserController.java", "com.alp.user.controller"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/security/JwtAuthenticationFilter.java", "com.alp.auth.security"),
    ("alp-identity/src/main/java/com/alp/identity/infrastructure/seed/AdminSeedRunner.java", "com.alp.user"),
    ("alp-audit/src/main/java/com/alp/audit/domain/AuditLog.java", "com.alp.audit.entity"),
    ("alp-audit/src/main/java/com/alp/audit/infrastructure/persistence/AuditLogRepository.java", "com.alp.audit.repository"),
    ("alp-audit/src/main/java/com/alp/audit/infrastructure/web/dto/AuditLogResponse.java", "com.alp.audit.dto"),
]

TESTS = [
    ("alp-identity/src/test/java/com/alp/identity/domain/PasswordPolicyTest.java", "com.alp.auth.service"),
    ("alp-identity/src/test/java/com/alp/identity/application/JwtServiceTest.java", "com.alp.auth.service"),
    ("alp-identity/src/test/java/com/alp/identity/application/AuthServiceTest.java", "com.alp.auth.service"),
    ("alp-identity/src/test/java/com/alp/identity/application/UserServiceTest.java", "com.alp.user.service"),
    ("alp-app/src/test/java/com/alp/AviationLearningPlatformApplicationTests.java", "com.alp"),
    ("alp-app/src/test/java/com/alp/TestcontainersConfiguration.java", "com.alp"),
    ("alp-app/src/test/java/com/alp/DockerAvailability.java", "com.alp"),
    ("alp-app/src/test/java/com/alp/identity/AuthIntegrationTest.java", "com.alp.auth"),
]


def main() -> None:
    if SRC.exists():
        shutil.rmtree(SRC.parent)
    for rel, package in MOVES:
        copy_java(ROOT / rel, package)
    for rel, package in TESTS:
        copy_java(ROOT / rel, package, test=True)

    copy_res(ROOT / "alp-app/src/main/resources/application.yml", "application.yml")
    copy_res(ROOT / "alp-identity/src/main/resources/db/migration/V1__create_users.sql", "db/migration/V1__create_users.sql")
    copy_res(ROOT / "alp-identity/src/main/resources/db/migration/V2__create_roles.sql", "db/migration/V2__create_roles.sql")
    copy_res(ROOT / "alp-identity/src/main/resources/db/migration/V3__create_refresh_tokens.sql", "db/migration/V3__create_refresh_tokens.sql")
    copy_res(ROOT / "alp-audit/src/main/resources/db/migration/V4__create_audit_logs.sql", "db/migration/V4__create_audit_logs.sql")
    copy_res(ROOT / "alp-app/src/test/resources/application.yml", "application.yml", test=True)
    print("flattened")


if __name__ == "__main__":
    main()
