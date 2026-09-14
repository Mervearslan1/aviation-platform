package com.aviation.platform.common.security.entrypoint;

import com.aviation.platform.common.exception.ErrorCode;
import com.aviation.platform.common.security.ErrorResponseWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private final ErrorResponseWriter writer;

    public RestAccessDeniedHandler(ErrorResponseWriter writer) {
        this.writer = writer;
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException {
        writer.write(request, response, HttpServletResponse.SC_FORBIDDEN, ErrorCode.ACCESS_DENIED, "Access denied");
    }
}
