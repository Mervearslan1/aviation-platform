package com.alp.user.service;

import com.alp.audit.service.AuditService;
import com.alp.common.exception.ApiException;
import com.alp.common.pagination.PageParams;
import com.alp.common.security.CurrentUser;
import com.alp.user.dto.UserResponse;
import com.alp.user.entity.Role;
import com.alp.user.entity.RoleName;
import com.alp.user.entity.User;
import com.alp.user.entity.UserStatus;
import com.alp.user.repository.RoleRepository;
import com.alp.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private static final Set<String> SORT_FIELDS = Set.of("createdAt", "username", "email", "id");

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuditService auditService;

    public UserServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            AuditService auditService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.auditService = auditService;
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return UserResponse.from(loadWithRoles(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> list(UserStatus status, Integer page, Integer size, String sort) {
        Pageable pageable = PageParams.of(page, size, sort, SORT_FIELDS, "createdAt");
        Page<User> users = status == null
                ? userRepository.findAll(pageable)
                : userRepository.findAllByStatus(status, pageable);
        return users.map(UserResponse::from);
    }

    @Override
    public UserResponse updateStatus(Long targetUserId, UserStatus status, CurrentUser actor, String ipAddress) {
        if (actor.id().equals(targetUserId)) {
            throw ApiException.badRequest("You cannot change your own status");
        }
        User user = loadWithRoles(targetUserId);
        UserStatus previous = user.getStatus();
        user.setStatus(status);
        String action = status == UserStatus.ACTIVE ? "USER_ENABLED" : "USER_DISABLED";
        auditService.record(
                actor.id(),
                action,
                "User",
                user.getId(),
                Map.of("from", previous.name(), "to", status.name()),
                ipAddress
        );
        return UserResponse.from(user);
    }

    @Override
    public UserResponse updateRoles(Long targetUserId, Set<RoleName> roleNames, CurrentUser actor, String ipAddress) {
        User user = loadWithRoles(targetUserId);
        Set<Role> roles = roleRepository.findByNameIn(roleNames);
        if (roles.size() != roleNames.size()) {
            throw ApiException.badRequest("One or more roles are invalid");
        }
        Set<String> previous = user.getRoles().stream().map(role -> role.getName().name()).collect(Collectors.toSet());
        user.setRoles(roles);
        auditService.record(
                actor.id(),
                "USER_ROLE_CHANGED",
                "User",
                user.getId(),
                Map.of("from", previous, "to", roleNames.stream().map(Enum::name).collect(Collectors.toSet())),
                ipAddress
        );
        return UserResponse.from(user);
    }

    private User loadWithRoles(Long id) {
        return userRepository.findByIdWithRoles(id)
                .orElseThrow(() -> ApiException.notFound("User not found"));
    }
}
