package com.alp.common.response;

import com.alp.common.exception.ErrorCode;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        ErrorCode code,
        String message,
        List<FieldErrorResponse> errors,
        String path
) {
}
