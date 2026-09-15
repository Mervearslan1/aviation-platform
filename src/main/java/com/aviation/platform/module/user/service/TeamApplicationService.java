package com.aviation.platform.module.user.service;

import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.user.dto.request.CreateTeamApplicationRequest;
import com.aviation.platform.module.user.dto.request.ReviewTeamApplicationRequest;
import com.aviation.platform.module.user.dto.response.TeamApplicationResponse;
import org.springframework.data.domain.Page;

public interface TeamApplicationService {

    TeamApplicationResponse submit(CreateTeamApplicationRequest request);

    Page<TeamApplicationResponse> list(Integer page, Integer size, String sort);

    TeamApplicationResponse review(Long id, ReviewTeamApplicationRequest request, CurrentUser actor);
}
