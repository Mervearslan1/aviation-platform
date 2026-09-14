package com.aviation.platform.common.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    public static final String BEARER_AUTH = "bearerAuth";

    @Bean
    OpenAPI aviationPlatformOpenApi() {
        SecurityScheme bearer = new SecurityScheme()
                .name(BEARER_AUTH)
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("Login veya register response'undaki accessToken. Swagger'da Authorize → Bearer <token>.");
        return new OpenAPI()
                .info(new Info()
                        .title("Aviation Platform API")
                        .version("v1")
                        .description("""
                                Blog yazarı için writer: /writer/index.html
                                1. Auth → login
                                2. Authorize'a accessToken
                                3. Articles / Media dene
                                """))
                .servers(List.of(new Server().url("/").description("Local")))
                .tags(List.of(
                        new Tag().name("Auth").description("Kayıt, login, token yenileme — JWT gerekmez"),
                        new Tag().name("Users").description("Profil ve admin kullanıcı yönetimi — JWT gerekir"),
                        new Tag().name("Audit").description("Audit log listesi — ADMIN JWT gerekir"),
                        new Tag().name("Articles").description("Blog yazıları, workflow ve zengin içerik"),
                        new Tag().name("Categories").description("Kategori ve etiket"),
                        new Tag().name("Media").description("Görsel, video, ses"),
                        new Tag().name("Learning").description("Ortak öğrenme omurgası"),
                        new Tag().name("Tower").description("Kule hattı"),
                        new Tag().name("Pilot").description("Pilot hattı")
                ))
                .components(new Components().addSecuritySchemes(BEARER_AUTH, bearer))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
    }
}
