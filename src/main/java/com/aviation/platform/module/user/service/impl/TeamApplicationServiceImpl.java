package com.aviation.platform.module.user.service.impl;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.pagination.PageParams;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.user.dto.request.CreateTeamApplicationRequest;
import com.aviation.platform.module.user.dto.request.ReviewTeamApplicationRequest;
import com.aviation.platform.module.user.dto.response.TeamApplicationResponse;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.TeamApplication;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.repository.RoleRepository;
import com.aviation.platform.module.user.repository.TeamApplicationRepository;
import com.aviation.platform.module.user.repository.UserRepository;
import com.aviation.platform.module.user.service.TeamApplicationService;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@Transactional
public class TeamApplicationServiceImpl implements TeamApplicationService {

    private static final Set<String> SORT = Set.of("createdAt", "id", "status");

    private final TeamApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public TeamApplicationServiceImpl(
            TeamApplicationRepository applicationRepository,
            UserRepository userRepository,
            RoleRepository roleRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public TeamApplicationResponse submit(CreateTeamApplicationRequest request) {
        TeamApplication app = new TeamApplication(
                request.fullName().trim(),
                request.email().trim().toLowerCase(),
                request.profession(),
                request.requestedRole(),
                request.experience(),
                request.message().trim()
        );
        return TeamApplicationResponse.from(applicationRepository.save(app));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamApplicationResponse> list(Integer page, Integer size, String sort) {
        return applicationRepository.findAll(PageParams.of(page, size, sort, SORT, "createdAt"))
                .map(TeamApplicationResponse::from);
    }

    @Override
    public TeamApplicationResponse review(Long id, ReviewTeamApplicationRequest request, CurrentUser actor) {
        if (request.status() == TeamApplication.Status.PENDING) {
            throw ApiException.badRequest("PENDING geçerli bir inceleme sonucu değil");
        }
        TeamApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Başvuru yok"));
        User reviewer = userRepository.findById(actor.id())
                .orElseThrow(() -> ApiException.notFound("User not found"));
        app.review(request.status(), reviewer);
        if (request.status() == TeamApplication.Status.APPROVED) {
            assignRoleIfUserExists(app);
        }
        return TeamApplicationResponse.from(app);
    }

    private void assignRoleIfUserExists(TeamApplication app) {
        RoleName roleName = switch (app.getRequestedRole()) {
            case AUTHOR -> RoleName.AUTHOR;
            case EDITOR -> RoleName.EDITOR;
            case CONTRIBUTOR -> null;
        };
        if (roleName == null) {
            return;
        }
        userRepository.findByEmailIgnoreCaseWithRoles(app.getEmail()).ifPresent(user -> {
            roleRepository.findByName(roleName).ifPresent(user::addRole);
        });
    }
}
