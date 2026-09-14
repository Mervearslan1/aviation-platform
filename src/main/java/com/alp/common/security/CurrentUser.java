package com.alp.common.security;

import com.alp.user.entity.RoleName;

import java.util.Set;

public record CurrentUser(
        Long id,
        String username,
        String email,
        Set<RoleName> roles
) {

    public boolean hasRole(RoleName role) {
        return roles != null && roles.contains(role);
    }
}
