"""Move aviation sources to crmpanel1-style common/ + module/ layout."""
from pathlib import Path
import shutil

ROOT = Path(r"C:\Users\merve.arslan\IdeaProjects\aviation-learning-platform")
SRC = ROOT / "src"

MOVES = {
    "src/main/java/com/alp/AppConfig.java": ("com.alp.common.config", "src/main/java/com/alp/common/config/AppConfig.java"),
    "src/main/java/com/alp/OpenApiConfig.java": ("com.alp.common.config", "src/main/java/com/alp/common/config/OpenApiConfig.java"),
    "src/main/java/com/alp/SecurityConfig.java": ("com.alp.common.config", "src/main/java/com/alp/common/config/SecurityConfig.java"),
    "src/main/java/com/alp/common/exception/GlobalExceptionHandler.java": ("com.alp.common.exception.handler", "src/main/java/com/alp/common/exception/handler/GlobalExceptionHandler.java"),
    "src/main/java/com/alp/common/security/CurrentUser.java": ("com.alp.common.security.principal", "src/main/java/com/alp/common/security/principal/CurrentUser.java"),
    "src/main/java/com/alp/common/security/RestAuthenticationEntryPoint.java": ("com.alp.common.security.entrypoint", "src/main/java/com/alp/common/security/entrypoint/RestAuthenticationEntryPoint.java"),
    "src/main/java/com/alp/common/security/RestAccessDeniedHandler.java": ("com.alp.common.security.entrypoint", "src/main/java/com/alp/common/security/entrypoint/RestAccessDeniedHandler.java"),
    "src/main/java/com/alp/auth/security/JwtAuthenticationFilter.java": ("com.alp.common.security.jwt", "src/main/java/com/alp/common/security/jwt/JwtAuthenticationFilter.java"),
    "src/main/java/com/alp/auth/service/JwtService.java": ("com.alp.common.security.jwt", "src/main/java/com/alp/common/security/jwt/JwtService.java"),
    "src/main/java/com/alp/auth/service/PasswordPolicy.java": ("com.alp.common.validation", "src/main/java/com/alp/common/validation/PasswordPolicy.java"),
    "src/main/java/com/alp/auth/controller/AuthController.java": ("com.alp.module.auth.controller", "src/main/java/com/alp/module/auth/controller/AuthController.java"),
    "src/main/java/com/alp/auth/dto/LoginRequest.java": ("com.alp.module.auth.dto.request", "src/main/java/com/alp/module/auth/dto/request/LoginRequest.java"),
    "src/main/java/com/alp/auth/dto/LogoutRequest.java": ("com.alp.module.auth.dto.request", "src/main/java/com/alp/module/auth/dto/request/LogoutRequest.java"),
    "src/main/java/com/alp/auth/dto/RefreshRequest.java": ("com.alp.module.auth.dto.request", "src/main/java/com/alp/module/auth/dto/request/RefreshRequest.java"),
    "src/main/java/com/alp/auth/dto/RegisterRequest.java": ("com.alp.module.auth.dto.request", "src/main/java/com/alp/module/auth/dto/request/RegisterRequest.java"),
    "src/main/java/com/alp/auth/dto/TokenResponse.java": ("com.alp.module.auth.dto.response", "src/main/java/com/alp/module/auth/dto/response/TokenResponse.java"),
    "src/main/java/com/alp/auth/entity/RefreshToken.java": ("com.alp.module.auth.entity", "src/main/java/com/alp/module/auth/entity/RefreshToken.java"),
    "src/main/java/com/alp/auth/dto/repository/RefreshTokenRepository.java": ("com.alp.module.auth.repository", "src/main/java/com/alp/module/auth/repository/RefreshTokenRepository.java"),
    "src/main/java/com/alp/auth/service/AuthService.java": ("com.alp.module.auth.service", "src/main/java/com/alp/module/auth/service/AuthService.java"),
    "src/main/java/com/alp/auth/service/AuthServiceImpl.java": ("com.alp.module.auth.service.impl", "src/main/java/com/alp/module/auth/service/impl/AuthServiceImpl.java"),
    "src/main/java/com/alp/user/AdminSeedRunner.java": ("com.alp.module.user.config", "src/main/java/com/alp/module/user/config/AdminSeedRunner.java"),
    "src/main/java/com/alp/user/controller/UserController.java": ("com.alp.module.user.controller", "src/main/java/com/alp/module/user/controller/UserController.java"),
    "src/main/java/com/alp/user/dto/UpdateUserRolesRequest.java": ("com.alp.module.user.dto.request", "src/main/java/com/alp/module/user/dto/request/UpdateUserRolesRequest.java"),
    "src/main/java/com/alp/user/dto/UpdateUserStatusRequest.java": ("com.alp.module.user.dto.request", "src/main/java/com/alp/module/user/dto/request/UpdateUserStatusRequest.java"),
    "src/main/java/com/alp/user/dto/UserResponse.java": ("com.alp.module.user.dto.response", "src/main/java/com/alp/module/user/dto/response/UserResponse.java"),
    "src/main/java/com/alp/user/entity/User.java": ("com.alp.module.user.entity", "src/main/java/com/alp/module/user/entity/User.java"),
    "src/main/java/com/alp/user/entity/Role.java": ("com.alp.module.user.entity", "src/main/java/com/alp/module/user/entity/Role.java"),
    "src/main/java/com/alp/user/entity/RoleName.java": ("com.alp.module.user.entity", "src/main/java/com/alp/module/user/entity/RoleName.java"),
    "src/main/java/com/alp/user/entity/UserStatus.java": ("com.alp.module.user.entity", "src/main/java/com/alp/module/user/entity/UserStatus.java"),
    "src/main/java/com/alp/user/repository/UserRepository.java": ("com.alp.module.user.repository", "src/main/java/com/alp/module/user/repository/UserRepository.java"),
    "src/main/java/com/alp/user/repository/RoleRepository.java": ("com.alp.module.user.repository", "src/main/java/com/alp/module/user/repository/RoleRepository.java"),
    "src/main/java/com/alp/user/service/UserService.java": ("com.alp.module.user.service", "src/main/java/com/alp/module/user/service/UserService.java"),
    "src/main/java/com/alp/user/service/UserServiceImpl.java": ("com.alp.module.user.service.impl", "src/main/java/com/alp/module/user/service/impl/UserServiceImpl.java"),
    "src/main/java/com/alp/audit/controller/AuditLogController.java": ("com.alp.module.audit.controller", "src/main/java/com/alp/module/audit/controller/AuditLogController.java"),
    "src/main/java/com/alp/audit/dto/AuditLogResponse.java": ("com.alp.module.audit.dto.response", "src/main/java/com/alp/module/audit/dto/response/AuditLogResponse.java"),
    "src/main/java/com/alp/audit/entity/AuditLog.java": ("com.alp.module.audit.entity", "src/main/java/com/alp/module/audit/entity/AuditLog.java"),
    "src/main/java/com/alp/audit/repository/AuditLogRepository.java": ("com.alp.module.audit.repository", "src/main/java/com/alp/module/audit/repository/AuditLogRepository.java"),
    "src/main/java/com/alp/audit/service/AuditService.java": ("com.alp.module.audit.service", "src/main/java/com/alp/module/audit/service/AuditService.java"),
    "src/main/java/com/alp/audit/service/AuditServiceImpl.java": ("com.alp.module.audit.service.impl", "src/main/java/com/alp/module/audit/service/impl/AuditServiceImpl.java"),
    "src/test/java/com/alp/auth/service/AuthServiceTest.java": ("com.alp.module.auth.service", "src/test/java/com/alp/module/auth/service/AuthServiceTest.java"),
    "src/test/java/com/alp/auth/service/JwtServiceTest.java": ("com.alp.common.security.jwt", "src/test/java/com/alp/common/security/jwt/JwtServiceTest.java"),
    "src/test/java/com/alp/auth/service/PasswordPolicyTest.java": ("com.alp.common.validation", "src/test/java/com/alp/common/validation/PasswordPolicyTest.java"),
    "src/test/java/com/alp/auth/AuthIntegrationTest.java": ("com.alp.module.auth", "src/test/java/com/alp/module/auth/AuthIntegrationTest.java"),
    "src/test/java/com/alp/user/service/UserServiceTest.java": ("com.alp.module.user.service", "src/test/java/com/alp/module/user/service/UserServiceTest.java"),
}

IMPORTS = [
    ("com.alp.auth.dto.repository", "com.alp.module.auth.repository"),
    ("com.alp.auth.security", "com.alp.common.security.jwt"),
    ("com.alp.auth.service.JwtService", "com.alp.common.security.jwt.JwtService"),
    ("com.alp.auth.service.PasswordPolicy", "com.alp.common.validation.PasswordPolicy"),
    ("com.alp.auth.service.impl", "com.alp.module.auth.service.impl"),
    ("com.alp.auth.service", "com.alp.module.auth.service"),
    ("com.alp.auth.controller", "com.alp.module.auth.controller"),
    ("com.alp.auth.dto.TokenResponse", "com.alp.module.auth.dto.response.TokenResponse"),
    ("com.alp.auth.dto", "com.alp.module.auth.dto.request"),
    ("com.alp.auth.entity", "com.alp.module.auth.entity"),
    ("com.alp.auth.repository", "com.alp.module.auth.repository"),
    ("com.alp.user.service.impl", "com.alp.module.user.service.impl"),
    ("com.alp.user.service", "com.alp.module.user.service"),
    ("com.alp.user.controller", "com.alp.module.user.controller"),
    ("com.alp.user.dto.UserResponse", "com.alp.module.user.dto.response.UserResponse"),
    ("com.alp.user.dto", "com.alp.module.user.dto.request"),
    ("com.alp.user.entity", "com.alp.module.user.entity"),
    ("com.alp.user.repository", "com.alp.module.user.repository"),
    ("com.alp.audit.service.impl", "com.alp.module.audit.service.impl"),
    ("com.alp.audit.service", "com.alp.module.audit.service"),
    ("com.alp.audit.controller", "com.alp.module.audit.controller"),
    ("com.alp.audit.dto", "com.alp.module.audit.dto.response"),
    ("com.alp.audit.entity", "com.alp.module.audit.entity"),
    ("com.alp.audit.repository", "com.alp.module.audit.repository"),
    ("com.alp.common.exception.GlobalExceptionHandler", "com.alp.common.exception.handler.GlobalExceptionHandler"),
    ("com.alp.common.security.CurrentUser", "com.alp.common.security.principal.CurrentUser"),
    ("com.alp.common.security.RestAuthenticationEntryPoint", "com.alp.common.security.entrypoint.RestAuthenticationEntryPoint"),
    ("com.alp.common.security.RestAccessDeniedHandler", "com.alp.common.security.entrypoint.RestAccessDeniedHandler"),
    ("com.alp.common.config.OpenApiConfig", "com.alp.common.config.OpenApiConfig"),
]


def rewrite(text: str, new_pkg: str) -> str:
    i = text.find(";")
    text = f"package {new_pkg};" + text[i + 1 :]
    for old, new in IMPORTS:
        text = text.replace(old, new)
    return text


def main():
    written = []
    for src_rel, (pkg, dest_rel) in MOVES.items():
        src = ROOT / src_rel
        if not src.exists():
            print("missing", src_rel)
            continue
        dest = ROOT / dest_rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(rewrite(src.read_text(encoding="utf-8"), pkg), encoding="utf-8")
        written.append(dest)
        if src.resolve() != dest.resolve():
            src.unlink()

    keep = {
        ROOT / "src/main/java/com/alp/AviationPlatformApplication.java",
        ROOT / "src/test/java/com/alp/AviationPlatformApplicationTests.java",
        ROOT / "src/test/java/com/alp/DockerAvailability.java",
        ROOT / "src/test/java/com/alp/TestcontainersConfiguration.java",
        ROOT / "src/main/java/com/alp/common/config/AlpProperties.java",
        ROOT / "src/main/java/com/alp/common/exception/ApiException.java",
        ROOT / "src/main/java/com/alp/common/exception/ErrorCode.java",
        ROOT / "src/main/java/com/alp/common/pagination/PageParams.java",
        ROOT / "src/main/java/com/alp/common/response/ApiErrorResponse.java",
        ROOT / "src/main/java/com/alp/common/response/ApiResponse.java",
        ROOT / "src/main/java/com/alp/common/response/FieldErrorResponse.java",
        ROOT / "src/main/java/com/alp/common/response/PagedResponse.java",
        ROOT / "src/main/java/com/alp/common/security/ErrorResponseWriter.java",
        ROOT / "src/main/java/com/alp/common/util/ClientIp.java",
        ROOT / "src/main/java/com/alp/common/util/TokenHasher.java",
    }
    keep.update(written)

    for p in (ROOT / "src").rglob("*.java"):
        if p in keep:
            continue
        # leftover empty feature roots
        if any(part in {"auth", "user", "audit"} and "module" not in p.parts for part in p.parts):
            p.unlink()
            print("removed leftover", p)

    # rewrite remaining files' imports (application + common that stayed)
    for p in (ROOT / "src").rglob("*.java"):
        text = p.read_text(encoding="utf-8")
        orig = text
        for old, new in IMPORTS:
            text = text.replace(old, new)
        if text != orig:
            p.write_text(text, encoding="utf-8")

    print("done")


if __name__ == "__main__":
    main()
