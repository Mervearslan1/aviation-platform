package com.aviation.platform.module.article.service;

import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.request.ReviewCommentRequest;
import com.aviation.platform.module.article.dto.request.SaveArticleRequest;
import com.aviation.platform.module.article.dto.response.ArticleResponse;
import com.aviation.platform.module.article.entity.ArticleStatus;
import org.springframework.data.domain.Page;

public interface ArticleService {

    ArticleResponse create(SaveArticleRequest request, CurrentUser actor);

    ArticleResponse update(Long id, SaveArticleRequest request, CurrentUser actor);

    ArticleResponse get(Long id, CurrentUser actor);

    ArticleResponse getBySlug(String slug, CurrentUser actor);

    Page<ArticleResponse> listPublished(Integer page, Integer size, String sort);

    Page<ArticleResponse> listMine(CurrentUser actor, ArticleStatus status, Integer page, Integer size, String sort);

    Page<ArticleResponse> listForEditors(ArticleStatus status, Integer page, Integer size, String sort);

    ArticleResponse submit(Long id, CurrentUser actor);

    ArticleResponse startReview(Long id, CurrentUser actor);

    ArticleResponse requestRevision(Long id, ReviewCommentRequest request, CurrentUser actor);

    ArticleResponse approve(Long id, CurrentUser actor);

    ArticleResponse reject(Long id, ReviewCommentRequest request, CurrentUser actor);

    ArticleResponse publish(Long id, CurrentUser actor);

    ArticleResponse archive(Long id, CurrentUser actor);
}
