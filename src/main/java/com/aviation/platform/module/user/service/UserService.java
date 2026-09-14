package com.aviation.platform.module.user.service;

import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.user.dto.response.UserResponse;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.UserStatus;
import org.springframework.data.domain.Page;

import java.util.Set;

public interface UserService {

    UserResponse getById(Long id);

    Page<UserResponse> list(UserStatus status, Integer page, Integer size, String sort);

    UserResponse updateStatus(Long targetUserId, UserStatus status, CurrentUser actor, String ipAddress);

    UserResponse updateRoles(Long targetUserId, Set<RoleName> roleNames, CurrentUser actor, String ipAddress);
}
