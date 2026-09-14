package com.aviation.platform.common.response;

import org.springframework.data.domain.Page;

import java.util.List;

public record PagedResponse<T>(List<T> data, PaginationMeta pagination) {

    public static <T> PagedResponse<T> of(Page<T> page) {
        return new PagedResponse<>(
                page.getContent(),
                new PaginationMeta(page.getNumber(), page.getSize(), page.getTotalElements(), page.getTotalPages())
        );
    }

    public record PaginationMeta(int page, int size, long totalElements, int totalPages) {
    }
}
