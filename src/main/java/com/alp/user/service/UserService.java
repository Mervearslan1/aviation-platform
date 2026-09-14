package com.alp.user.service;

import com.alp.common.security.CurrentUser;
import com.alp.user.dto.UserResponse;
import com.alp.user.entity.RoleName;
import com.alp.user.entity.UserStatus;
import org.springframework.data.domain.Page;

import java.util.Set;

public interface UserService {

    UserResponse getById(Long id);

    Page<UserResponse> list(UserStatus status, Integer page, Integer size, String sort);

    UserResponse updateStatus(Long targetUserId, UserStatus status, CurrentUser actor, String ipAddress);

    UserResponse updateRoles(Long targetUserId, Set<RoleName> roleNames, CurrentUser actor, String ipAddress);
}
