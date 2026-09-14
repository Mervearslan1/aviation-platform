package com.alp.common.security.entrypoint;

import com.alp.common.exception.ErrorCode;
import com.alp.common.security.ErrorResponseWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ErrorResponseWriter writer;

    public RestAuthenticationEntryPoint(ErrorResponseWriter writer) {
        this.writer = writer;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        writer.write(request, response, HttpServletResponse.SC_UNAUTHORIZED, ErrorCode.INVALID_TOKEN, "Authentication required");
    }
}
