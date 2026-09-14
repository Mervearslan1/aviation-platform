package com.aviation.platform.common.pagination;

import com.aviation.platform.common.exception.ApiException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Locale;
import java.util.Set;

public final class PageParams {

    public static final int DEFAULT_PAGE = 0;
    public static final int DEFAULT_SIZE = 20;
    public static final int MAX_SIZE = 100;

    private PageParams() {
    }

    public static Pageable of(Integer page, Integer size, String sort, Set<String> allowedSortFields, String defaultSort) {
        int resolvedPage = page == null || page < 0 ? DEFAULT_PAGE : page;
        int resolvedSize = size == null || size < 1 ? DEFAULT_SIZE : Math.min(size, MAX_SIZE);

        Sort springSort = parseSort(sort, allowedSortFields, defaultSort);
        return PageRequest.of(resolvedPage, resolvedSize, springSort);
    }

    private static Sort parseSort(String sort, Set<String> allowedSortFields, String defaultSort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.DESC, defaultSort);
        }

        String[] parts = sort.split(",", 2);
        String field = parts[0].trim();
        if (!allowedSortFields.contains(field)) {
            throw ApiException.badRequest("Unsupported sort field: " + field);
        }

        Sort.Direction direction = Sort.Direction.DESC;
        if (parts.length == 2) {
            String rawDirection = parts[1].trim().toLowerCase(Locale.ROOT);
            if ("asc".equals(rawDirection)) {
                direction = Sort.Direction.ASC;
            } else if (!"desc".equals(rawDirection)) {
                throw ApiException.badRequest("Sort direction must be asc or desc");
            }
        }
        return Sort.by(direction, field);
    }
}
