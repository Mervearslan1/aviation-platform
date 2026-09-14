package com.alp;

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
                                İstek denemek için:
                                1. Auth → POST /register veya /login çalıştır
                                2. Dönen accessToken değerini kopyala
                                3. Sağ üstteki Authorize butonuna yapıştır (sadece token, Bearer yazmana gerek yok)
                                4. Users / Audit endpoint'lerini Try it out ile dene
                                """))
                .servers(List.of(new Server().url("/").description("Local")))
                .tags(List.of(
                        new Tag().name("Auth").description("Kayıt, login, token yenileme — JWT gerekmez"),
                        new Tag().name("Users").description("Profil ve admin kullanıcı yönetimi — JWT gerekir"),
                        new Tag().name("Audit").description("Audit log listesi — ADMIN JWT gerekir")
                ))
                .components(new Components().addSecuritySchemes(BEARER_AUTH, bearer))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
    }
}
