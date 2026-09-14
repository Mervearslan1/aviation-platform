package com.alp.module.auth;

import com.alp.TestcontainersConfiguration;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(TestcontainersConfiguration.class)
@AutoConfigureMockMvc
@EnabledIf("com.alp.DockerAvailability#isAvailable")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerLoginAndReadCurrentUser() throws Exception {
        String email = "pilot-" + UUID.randomUUID() + "@example.com";
        String username = "u" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "email": "%s",
                                  "password": "Password123!",
                                  "displayName": "Pilot"
                                }
                                """.formatted(username, email)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.username").value(username))
                .andExpect(jsonPath("$.data.email").value(email.toLowerCase()))
                .andExpect(jsonPath("$.data.roles", org.hamcrest.Matchers.hasItem("USER")))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));

        MvcResult login = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "Password123!"
                                }
                                """.formatted(email.toUpperCase())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.data.expiresIn").value(900))
                .andReturn();

        JsonNode tokens = objectMapper.readTree(login.getResponse().getContentAsString()).get("data");
        String accessToken = tokens.get("accessToken").asText();

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value(username))
                .andExpect(jsonPath("$.data.email").value(email.toLowerCase()));
    }

    @Test
    void loginFailureDoesNotRevealEmailExistence() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "nobody@example.com",
                                  "password": "Password123!"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"))
                .andExpect(jsonPath("$.message").value("Invalid credentials"));
    }

    @Test
    void anonymousCannotAccessProtectedEndpoint() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidJwtIsRejected() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer not-a-real-token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("INVALID_TOKEN"));
    }

    @Test
    void userCannotListUsers() throws Exception {
        String email = "crew-" + UUID.randomUUID() + "@example.com";
        String username = "c" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "%s",
                                  "email": "%s",
                                  "password": "Password123!"
                                }
                                """.formatted(username, email)))
                .andExpect(status().isCreated());

        MvcResult login = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "%s",
                                  "password": "Password123!"
                                }
                                """.formatted(email)))
                .andExpect(status().isOk())
                .andReturn();

        String accessToken = objectMapper.readTree(login.getResponse().getContentAsString())
                .get("data").get("accessToken").asText();

        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("ACCESS_DENIED"));
    }

    @Test
    void adminCanListUsersAndRefreshRotatesToken() throws Exception {
        MvcResult adminLogin = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "email": "admin@alp.test",
                                  "password": "Admin123!"
                                }
                                """))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode adminTokens = objectMapper.readTree(adminLogin.getResponse().getContentAsString()).get("data");
        String adminAccess = adminTokens.get("accessToken").asText();
        String refreshToken = adminTokens.get("refreshToken").asText();

        mockMvc.perform(get("/api/v1/users")
                        .header("Authorization", "Bearer " + adminAccess))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pagination.page").value(0))
                .andExpect(jsonPath("$.data").isArray());

        MvcResult refreshed = mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "refreshToken": "%s"
                                }
                                """.formatted(refreshToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isString())
                .andReturn();

        String newRefresh = objectMapper.readTree(refreshed.getResponse().getContentAsString())
                .get("data").get("refreshToken").asText();
        assertThat(newRefresh).isNotEqualTo(refreshToken);

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "refreshToken": "%s"
                                }
                                """.formatted(refreshToken)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void duplicateEmailIsConflict() throws Exception {
        String email = "dup-" + UUID.randomUUID() + "@example.com";
        String username1 = "a" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String username2 = "b" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String body = """
                {
                  "username": "%s",
                  "email": "%s",
                  "password": "Password123!"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body.formatted(username1, email)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body.formatted(username2, email.toUpperCase())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESOURCE_ALREADY_EXISTS"));
    }
}
