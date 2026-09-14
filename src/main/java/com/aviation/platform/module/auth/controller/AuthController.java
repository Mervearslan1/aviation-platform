package com.aviation.platform.module.auth.controller;

import com.aviation.platform.module.auth.dto.request.LoginRequest;
import com.aviation.platform.module.auth.dto.request.LogoutRequest;
import com.aviation.platform.module.auth.dto.request.RefreshRequest;
import com.aviation.platform.module.auth.dto.request.RegisterRequest;
import com.aviation.platform.module.auth.dto.response.TokenResponse;
import com.aviation.platform.module.auth.service.AuthService;
import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.common.util.ClientIp;
import com.aviation.platform.module.user.dto.response.UserResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth", description = "Kayıt ve JWT. Authorize gerektirmez.")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @SecurityRequirements
    @Operation(summary = "Yeni kullanıcı kaydı", description = "Kullanıcı USER rolü ve ACTIVE status ile oluşur.")
    public ApiResponse<UserResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        return ApiResponse.of(authService.register(request, ClientIp.from(httpRequest)));
    }

    @PostMapping("/login")
    @SecurityRequirements
    @Operation(summary = "Login", description = "accessToken'ı kopyalayıp Authorize'a yapıştır.")
    public ApiResponse<TokenResponse> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        return ApiResponse.of(authService.login(request, ClientIp.from(httpRequest)));
    }

    @PostMapping("/refresh")
    @SecurityRequirements
    @Operation(summary = "Access token yenile")
    public ApiResponse<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request, HttpServletRequest httpRequest) {
        return ApiResponse.of(authService.refresh(request.refreshToken(), ClientIp.from(httpRequest)));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @SecurityRequirements
    @Operation(summary = "Refresh token iptal et")
    public void logout(@Valid @RequestBody LogoutRequest request) {
        authService.logout(request.refreshToken());
    }
}
