package com.aviation.platform.module.user.dto.request;

import com.aviation.platform.module.user.entity.RoleName;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record UpdateUserRolesRequest(
        @NotEmpty @Schema(example = "[\"USER\", \"AUTHOR\"]") Set<RoleName> roles
) {
}
