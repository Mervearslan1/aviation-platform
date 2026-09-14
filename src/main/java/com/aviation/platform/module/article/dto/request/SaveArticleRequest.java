package com.aviation.platform.module.article.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;

@Schema(description = "Yazı kaydı. contentHtml Word benzeri editör HTML'i, contentDocument yapısal bloklardır.")
public record SaveArticleRequest(
        @Size(max = 200) String title,
        @Size(max = 500) String summary,
        Long categoryId,
        List<String> tagNames,
        Long coverMediaId,
        String contentHtml,
        Map<String, Object> contentDocument
) {
}
