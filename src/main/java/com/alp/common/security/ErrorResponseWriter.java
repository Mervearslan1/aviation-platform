package com.alp.common.security;

import com.alp.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.Instant;

@Component
public class ErrorResponseWriter {

    private final Clock clock;

    public ErrorResponseWriter(Clock clock) {
        this.clock = clock;
    }

    public void write(HttpServletRequest request, HttpServletResponse response, int status, ErrorCode code, String message)
            throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        String json = """
                {"timestamp":"%s","status":%d,"code":"%s","message":"%s","path":"%s"}
                """.formatted(
                Instant.now(clock),
                status,
                code.name(),
                escape(message),
                escape(request.getRequestURI())
        );
        response.getOutputStream().write(json.getBytes(StandardCharsets.UTF_8));
    }

    private static String escape(String value) {
        if (value == null) {
            return "";
        }
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
