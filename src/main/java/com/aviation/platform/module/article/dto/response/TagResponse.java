package com.aviation.platform.module.article.dto.response;

import com.aviation.platform.module.article.entity.ArticleTag;

public record TagResponse(Long id, String name, String slug) {

    public static TagResponse from(ArticleTag tag) {
        return new TagResponse(tag.getId(), tag.getName(), tag.getSlug());
    }
}
