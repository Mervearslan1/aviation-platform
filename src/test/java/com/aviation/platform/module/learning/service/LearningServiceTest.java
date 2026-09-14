package com.aviation.platform.module.learning.service;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.exception.ErrorCode;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.audit.service.AuditService;
import com.aviation.platform.module.learning.dto.request.CompleteStepRequest;
import com.aviation.platform.module.learning.entity.LearningPath;
import com.aviation.platform.module.learning.entity.LearningStep;
import com.aviation.platform.module.learning.entity.StepProgressStatus;
import com.aviation.platform.module.learning.entity.StepType;
import com.aviation.platform.module.learning.entity.UserStepProgress;
import com.aviation.platform.module.learning.repository.LearningPathRepository;
import com.aviation.platform.module.learning.repository.LearningStepRepository;
import com.aviation.platform.module.learning.repository.LearningStepTermRepository;
import com.aviation.platform.module.learning.repository.UserPathProgressRepository;
import com.aviation.platform.module.learning.repository.UserStepProgressRepository;
import com.aviation.platform.module.learning.service.impl.LearningServiceImpl;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LearningServiceTest {

    @Mock
    private LearningPathRepository pathRepository;
    @Mock
    private LearningStepRepository stepRepository;
    @Mock
    private UserPathProgressRepository pathProgressRepository;
    @Mock
    private UserStepProgressRepository stepProgressRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AuditService auditService;
    @Mock
    private LearningStepTermRepository termRepository;

    private LearningService learningService;

    @BeforeEach
    void setUp() {
        learningService = new LearningServiceImpl(
                pathRepository,
                stepRepository,
                pathProgressRepository,
                stepProgressRepository,
                userRepository,
                auditService,
                termRepository
        );
    }

    @Test
    void lockedStepCannotBeCompleted() throws Exception {
        CurrentUser user = new CurrentUser(2L, "pilot", "p@x.com", Set.of(RoleName.USER));
        LearningPath path = new LearningPath("Temel", "temel", "desc", null);
        setId(path, 1L);
        LearningStep step = new LearningStep(path, "İkinci", "ikinci", StepType.CONTENT, 1);
        setId(step, 20L);
        User owner = new User("pilot", "p@x.com", "hash", "Pilot");
        UserStepProgress progress = new UserStepProgress(owner, step, StepProgressStatus.LOCKED);
        when(stepProgressRepository.findByUserIdAndStepId(2L, 20L)).thenReturn(Optional.of(progress));

        assertThatThrownBy(() -> learningService.completeStep(1L, 20L, new CompleteStepRequest(null, null), user))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.INVALID_STATE_TRANSITION);
    }

    @Test
    void mustEnrollBeforeOpeningStep() {
        CurrentUser user = new CurrentUser(2L, "pilot", "p@x.com", Set.of(RoleName.USER));
        when(stepProgressRepository.findByUserIdAndStepId(2L, 20L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> learningService.openStep(1L, 20L, user))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.ACCESS_DENIED);
    }

    private static void setId(Object entity, Long id) throws Exception {
        Field field = entity.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(entity, id);
    }
}
