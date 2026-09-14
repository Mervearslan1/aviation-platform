package com.alp.module.article.dto.response;

import com.alp.module.article.entity.ArticleTag;

public record TagResponse(Long id, String name, String slug) {

    public static TagResponse from(ArticleTag tag) {
        return new TagResponse(tag.getId(), tag.getName(), tag.getSlug());
    }
}
