package com.aviation.platform.module.auth.service;

import com.aviation.platform.module.auth.dto.request.LoginRequest;
import com.aviation.platform.module.auth.dto.request.RegisterRequest;
import com.aviation.platform.module.auth.dto.response.TokenResponse;
import com.aviation.platform.module.user.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request, String ipAddress);

    TokenResponse login(LoginRequest request, String ipAddress);

    TokenResponse refresh(String refreshToken, String ipAddress);

    void logout(String refreshToken);
}
