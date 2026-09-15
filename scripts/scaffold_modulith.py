"""Create module POMs, package-info, events, and skeleton bounded contexts."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LIB_POM = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.alp</groupId>
    <artifactId>aviation-learning-platform</artifactId>
    <version>0.0.1-SNAPSHOT</version>
  </parent>
  <artifactId>{artifact}</artifactId>
  <name>{artifact}</name>
  <dependencies>
{deps}
  </dependencies>
</project>
"""

DEP = "    <dependency>\n      <groupId>{g}</groupId>\n      <artifactId>{a}</artifactId>{extra}\n    </dependency>"


def dep(g, a, extra=""):
    return DEP.format(g=g, a=a, extra=extra)


def write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


COMMON_DEPS = "\n".join([
    dep("org.springframework.boot", "spring-boot-starter-webmvc"),
    dep("org.springframework.boot", "spring-boot-starter-validation"),
    dep("org.springframework.boot", "spring-boot-starter-security"),
    dep("org.springframework.boot", "spring-boot-starter-data-jpa"),
    dep("org.springframework.boot", "spring-boot-starter-validation-test", "\n      <scope>test</scope>"),
])

IDENTITY_DEPS = "\n".join([
    dep("com.alp", "alp-common"),
    dep("org.springframework.boot", "spring-boot-starter-webmvc"),
    dep("org.springframework.boot", "spring-boot-starter-security"),
    dep("org.springframework.boot", "spring-boot-starter-validation"),
    dep("org.springframework.boot", "spring-boot-starter-data-jpa"),
    dep("io.jsonwebtoken", "jjwt-api"),
    dep("io.jsonwebtoken", "jjwt-impl", "\n      <scope>runtime</scope>"),
    dep("io.jsonwebtoken", "jjwt-orgjson", "\n      <scope>runtime</scope>"),
    dep("org.springframework.boot", "spring-boot-starter-security-test", "\n      <scope>test</scope>"),
    dep("org.springframework.boot", "spring-boot-starter-data-jpa-test", "\n      <scope>test</scope>"),
    dep("org.springframework.boot", "spring-boot-starter-webmvc-test", "\n      <scope>test</scope>"),
])

AUDIT_DEPS = "\n".join([
    dep("com.alp", "alp-common"),
    dep("com.alp", "alp-identity"),
    dep("org.springframework.boot", "spring-boot-starter-webmvc"),
    dep("org.springframework.boot", "spring-boot-starter-data-jpa"),
    dep("org.springframework.boot", "spring-boot-starter-security"),
    dep("org.springframework.modulith", "spring-modulith-starter-core"),
])

SKELETON_DEPS = "\n".join([
    dep("com.alp", "alp-common"),
    dep("com.alp", "alp-identity"),
])

APP_POM = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>com.alp</groupId>
    <artifactId>aviation-learning-platform</artifactId>
    <version>0.0.1-SNAPSHOT</version>
  </parent>
  <artifactId>alp-app</artifactId>
  <name>alp-app</name>
  <dependencies>
    <dependency><groupId>com.alp</groupId><artifactId>alp-common</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-identity</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-audit</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-content</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-catalog</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-assessment</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-progress</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-simulation</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-community</artifactId></dependency>
    <dependency><groupId>com.alp</groupId><artifactId>alp-gamification</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-flyway</artifactId></dependency>
    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-database-postgresql</artifactId></dependency>
    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>org.springdoc</groupId><artifactId>springdoc-openapi-starter-webmvc-ui</artifactId></dependency>
    <dependency><groupId>org.springframework.modulith</groupId><artifactId>spring-modulith-starter-core</artifactId></dependency>
    <dependency><groupId>org.springframework.modulith</groupId><artifactId>spring-modulith-starter-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-flyway-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-testcontainers</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.testcontainers</groupId><artifactId>testcontainers-junit-jupiter</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.testcontainers</groupId><artifactId>testcontainers-postgresql</artifactId><scope>test</scope></dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
"""

PACKAGE_INFOS = {
    "alp-common/src/main/java/com/alp/common/package-info.java": """
@org.springframework.modulith.ApplicationModule(type = org.springframework.modulith.ApplicationModule.Type.OPEN)
package com.alp.common;
""",
    "alp-identity/src/main/java/com/alp/identity/package-info.java": """
@org.springframework.modulith.ApplicationModule(allowedDependencies = "common")
package com.alp.identity;
""",
    "alp-identity/src/main/java/com/alp/identity/api/package-info.java": """
@org.springframework.modulith.NamedInterface("api")
package com.alp.identity.api;
""",
    "alp-audit/src/main/java/com/alp/audit/package-info.java": """
@org.springframework.modulith.ApplicationModule(allowedDependencies = {"common", "identity :: api"})
package com.alp.audit;
""",
}

SKELETONS = [
    ("alp-content", "content", "Content (CMS / articles)", '{"common", "identity :: api"}', "Phase 2 — Article CMS"),
    ("alp-catalog", "catalog", "Catalog (learning paths)", '{"common", "identity :: api"}', "Phase 3 — Learning catalog"),
    ("alp-assessment", "assessment", "Assessment (quiz)", '{"common", "identity :: api"}', "Phase 4 — Quiz"),
    ("alp-progress", "progress", "Progress", '{"common", "identity :: api"}', "Phase 5 — Progress"),
    ("alp-simulation", "simulation", "Simulation", '{"common", "identity :: api"}', "Phase 6 — Simulation tasks"),
    ("alp-community", "community", "Community", '{"common", "identity :: api"}', "Phase 7 — Comments / favorites / notifications"),
    ("alp-gamification", "gamification", "Gamification", '{"common", "identity :: api"}', "Phase 8 — Achievements"),
]


def main():
    write(ROOT / "alp-common/pom.xml", LIB_POM.format(artifact="alp-common", deps=COMMON_DEPS))
    write(ROOT / "alp-identity/pom.xml", LIB_POM.format(artifact="alp-identity", deps=IDENTITY_DEPS))
    write(ROOT / "alp-audit/pom.xml", LIB_POM.format(artifact="alp-audit", deps=AUDIT_DEPS))
    write(ROOT / "alp-app/pom.xml", APP_POM)
    for path, content in PACKAGE_INFOS.items():
        write(ROOT / path, content)

    for artifact, pkg, display, deps, phase in SKELETONS:
        write(ROOT / f"{artifact}/pom.xml", LIB_POM.format(artifact=artifact, deps=SKELETON_DEPS))
        write(ROOT / f"{artifact}/src/main/java/com/alp/{pkg}/package-info.java", f'''
@org.springframework.modulith.ApplicationModule(
        displayName = "{display}",
        allowedDependencies = {deps})
package com.alp.{pkg};
''')
        write(ROOT / f"{artifact}/src/main/java/com/alp/{pkg}/api/package-info.java", f'''
@org.springframework.modulith.NamedInterface("api")
package com.alp.{pkg}.api;
''')
        write(ROOT / f"{artifact}/src/main/java/com/alp/{pkg}/ModuleMarker.java", f'''
package com.alp.{pkg};

/** Reserved bounded context. {phase}. */
public final class ModuleMarker {{
    private ModuleMarker() {{}}
}}
''')

    write(ROOT / "alp-identity/src/main/java/com/alp/identity/api/UserRegisteredEvent.java", '''
package com.alp.identity.api;

import java.time.Instant;

public record UserRegisteredEvent(Long userId, String username, String ipAddress, Instant occurredAt) {
}
''')
    write(ROOT / "alp-identity/src/main/java/com/alp/identity/api/UserAuthenticatedEvent.java", '''
package com.alp.identity.api;

import java.time.Instant;

public record UserAuthenticatedEvent(Long userId, String action, String ipAddress, Instant occurredAt) {
}
''')
    write(ROOT / "alp-identity/src/main/java/com/alp/identity/api/UserStatusChangedEvent.java", '''
package com.alp.identity.api;

import java.time.Instant;

public record UserStatusChangedEvent(Long actorId, Long userId, String from, String to, String ipAddress, Instant occurredAt) {
}
''')
    write(ROOT / "alp-identity/src/main/java/com/alp/identity/api/UserRolesChangedEvent.java", '''
package com.alp.identity.api;

import java.time.Instant;
import java.util.Set;

public record UserRolesChangedEvent(Long actorId, Long userId, Set<String> from, Set<String> to, String ipAddress, Instant occurredAt) {
}
''')
    write(ROOT / "alp-audit/src/main/java/com/alp/audit/application/IdentityAuditListener.java", '''
package com.alp.audit.application;

import com.alp.identity.api.UserAuthenticatedEvent;
import com.alp.identity.api.UserRegisteredEvent;
import com.alp.identity.api.UserRolesChangedEvent;
import com.alp.identity.api.UserStatusChangedEvent;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class IdentityAuditListener {

    private final AuditService auditService;

    public IdentityAuditListener(AuditService auditService) {
        this.auditService = auditService;
    }

    @ApplicationModuleListener
    void onRegistered(UserRegisteredEvent event) {
        auditService.record(event.userId(), "USER_REGISTERED", "User", event.userId(),
                Map.of("username", event.username()), event.ipAddress());
    }

    @ApplicationModuleListener
    void onAuthenticated(UserAuthenticatedEvent event) {
        auditService.record(event.userId(), event.action(), "User", event.userId(), Map.of(), event.ipAddress());
    }

    @ApplicationModuleListener
    void onStatusChanged(UserStatusChangedEvent event) {
        auditService.record(event.actorId(), event.to().equals("ACTIVE") ? "USER_ENABLED" : "USER_DISABLED",
                "User", event.userId(), Map.of("from", event.from(), "to", event.to()), event.ipAddress());
    }

    @ApplicationModuleListener
    void onRolesChanged(UserRolesChangedEvent event) {
        auditService.record(event.actorId(), "USER_ROLE_CHANGED", "User", event.userId(),
                Map.of("from", event.from(), "to", event.to()), event.ipAddress());
    }
}
''')
    write(ROOT / "alp-app/src/test/java/com/alp/ModularityTest.java", '''
package com.alp;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ModularityTest {

    @Test
    void modulesAreBounded() {
        ApplicationModules.of(AviationLearningPlatformApplication.class).verify();
    }
}
''')
    print("scaffold written")


if __name__ == "__main__":
    main()
