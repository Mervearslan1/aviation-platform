package com.alp.user.service;

import com.alp.common.exception.ApiException;
import com.alp.common.exception.ErrorCode;
import com.alp.common.security.CurrentUser;
import com.alp.user.entity.RoleName;
import com.alp.user.entity.UserStatus;
import com.alp.audit.service.AuditService;
import com.alp.user.repository.RoleRepository;
import com.alp.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private AuditService auditService;

    private UserService userService;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository, roleRepository, auditService);
    }

    @Test
    void adminCannotChangeOwnStatus() {
        CurrentUser admin = new CurrentUser(1L, "admin", "admin@alp.test", Set.of(RoleName.ADMIN));

        assertThatThrownBy(() -> userService.updateStatus(1L, UserStatus.SUSPENDED, admin, "127.0.0.1"))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.VALIDATION_ERROR);
    }
}
