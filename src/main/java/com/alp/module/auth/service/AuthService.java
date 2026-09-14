package com.alp.module.auth.service;

import com.alp.module.auth.dto.request.LoginRequest;
import com.alp.module.auth.dto.request.RegisterRequest;
import com.alp.module.auth.dto.response.TokenResponse;
import com.alp.module.user.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request, String ipAddress);

    TokenResponse login(LoginRequest request, String ipAddress);

    TokenResponse refresh(String refreshToken, String ipAddress);

    void logout(String refreshToken);
}
