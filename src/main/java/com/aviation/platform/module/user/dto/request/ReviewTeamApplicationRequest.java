package com.aviation.platform.module.user.dto.request;

import com.aviation.platform.module.user.entity.TeamApplication;
import jakarta.validation.constraints.NotNull;

public record ReviewTeamApplicationRequest(
        @NotNull TeamApplication.Status status
) {
}
