package com.alp.auth.service;

import com.alp.auth.dto.LoginRequest;
import com.alp.auth.dto.RegisterRequest;
import com.alp.auth.dto.TokenResponse;
import com.alp.user.dto.UserResponse;

public interface AuthService {

    UserResponse register(RegisterRequest request, String ipAddress);

    TokenResponse login(LoginRequest request, String ipAddress);

    TokenResponse refresh(String refreshToken, String ipAddress);

    void logout(String refreshToken);
}
