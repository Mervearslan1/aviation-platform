package com.alp.common.security.jwt;

import com.alp.common.exception.ApiException;
import com.alp.common.security.ErrorResponseWriter;
import com.alp.common.security.principal.CurrentUser;
import com.alp.module.user.entity.RoleName;
import com.alp.common.security.jwt.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;
    private final ErrorResponseWriter errorResponseWriter;

    public JwtAuthenticationFilter(JwtService jwtService, ErrorResponseWriter errorResponseWriter) {
        this.jwtService = jwtService;
        this.errorResponseWriter = errorResponseWriter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || header.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }
        if (!header.startsWith(BEARER_PREFIX)) {
            errorResponseWriter.write(request, response, HttpServletResponse.SC_UNAUTHORIZED,
                    com.alp.common.exception.ErrorCode.INVALID_TOKEN, "Invalid token");
            return;
        }

        String token = header.substring(BEARER_PREFIX.length()).trim();
        if (token.isEmpty()) {
            errorResponseWriter.write(request, response, HttpServletResponse.SC_UNAUTHORIZED,
                    com.alp.common.exception.ErrorCode.INVALID_TOKEN, "Invalid token");
            return;
        }

        try {
            CurrentUser currentUser = jwtService.parseAccessToken(token);
            List<SimpleGrantedAuthority> authorities = currentUser.roles().stream()
                    .map(RoleName::name)
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .toList();
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(currentUser, null, authorities);
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            filterChain.doFilter(request, response);
        } catch (ApiException ex) {
            errorResponseWriter.write(request, response, ex.getStatus().value(), ex.getCode(), ex.getMessage());
        }
    }
}
