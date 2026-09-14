package com.alp.user.controller;

import com.alp.common.response.ApiResponse;
import com.alp.common.response.PagedResponse;
import com.alp.common.security.CurrentUser;
import com.alp.common.util.ClientIp;
import com.alp.user.dto.UpdateUserRolesRequest;
import com.alp.user.dto.UpdateUserStatusRequest;
import com.alp.user.dto.UserResponse;
import com.alp.user.entity.UserStatus;
import com.alp.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Users", description = "JWT gerekir. Listeleme ve rol/status ADMIN.")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Giriş yapmış kullanıcı")
    public ApiResponse<UserResponse> me(@Parameter(hidden = true) @AuthenticationPrincipal CurrentUser currentUser) {
        return ApiResponse.of(userService.getById(currentUser.id()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kullanıcı listesi (ADMIN)")
    public PagedResponse<UserResponse> list(
            @Parameter(description = "ACTIVE, INACTIVE, SUSPENDED") @RequestParam(required = false) UserStatus status,
            @Parameter(description = "Sayfa, 0'dan başlar") @RequestParam(required = false) Integer page,
            @Parameter(description = "Sayfa boyutu, max 100") @RequestParam(required = false) Integer size,
            @Parameter(description = "Örn. createdAt,desc") @RequestParam(required = false) String sort
    ) {
        return PagedResponse.of(userService.list(status, page, size, sort));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kullanıcı status güncelle (ADMIN)")
    public ApiResponse<UserResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser currentUser,
            @Parameter(hidden = true) HttpServletRequest httpRequest
    ) {
        return ApiResponse.of(userService.updateStatus(id, request.status(), currentUser, ClientIp.from(httpRequest)));
    }

    @PutMapping("/{id}/roles")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Kullanıcı rollerini değiştir (ADMIN)")
    public ApiResponse<UserResponse> updateRoles(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRolesRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser currentUser,
            @Parameter(hidden = true) HttpServletRequest httpRequest
    ) {
        return ApiResponse.of(userService.updateRoles(id, request.roles(), currentUser, ClientIp.from(httpRequest)));
    }
}
