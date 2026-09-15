package com.aviation.platform.module.article.controller;

import com.aviation.platform.common.response.ApiResponse;
import com.aviation.platform.common.response.PagedResponse;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.request.ArticleFeedbackRequest;
import com.aviation.platform.module.article.dto.request.ReviewCommentRequest;
import com.aviation.platform.module.article.dto.request.SaveArticleRequest;
import com.aviation.platform.module.article.dto.response.ArticleResponse;
import com.aviation.platform.module.article.dto.response.FeedbackCountsResponse;
import com.aviation.platform.module.article.service.ArticleFeedbackService;
import com.aviation.platform.module.article.entity.ArticleStatus;
import com.aviation.platform.module.article.service.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/articles")
@Tag(name = "Articles", description = "Blog yazıları: taslak, inceleme, yayın")
public class ArticleController {

    private final ArticleService articleService;
    private final ArticleFeedbackService feedbackService;

    public ArticleController(ArticleService articleService, ArticleFeedbackService feedbackService) {
        this.articleService = articleService;
        this.feedbackService = feedbackService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Yeni taslak yazı oluştur")
    public ApiResponse<ArticleResponse> create(
            @Valid @RequestBody SaveArticleRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.create(request, actor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Taslağı güncelle (zengin içerik HTML + document)")
    public ApiResponse<ArticleResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody SaveArticleRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.update(id, request, actor));
    }

    @GetMapping
    @SecurityRequirements
    @Operation(summary = "Yayımlanmış yazılar (herkese açık)")
    public PagedResponse<ArticleResponse> published(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort
    ) {
        return PagedResponse.of(articleService.listPublished(page, size, sort));
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Benim yazılarım")
    public PagedResponse<ArticleResponse> mine(
            @RequestParam(required = false) ArticleStatus status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return PagedResponse.of(articleService.listMine(actor, status, page, size, sort));
    }

    @GetMapping("/queue")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN','MENTOR')")
    @Operation(summary = "Editör kuyruğu")
    public PagedResponse<ArticleResponse> queue(
            @RequestParam(required = false) ArticleStatus status,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) String sort
    ) {
        return PagedResponse.of(articleService.listForEditors(status, page, size, sort));
    }

    @GetMapping("/{id}")
    @SecurityRequirements
    @Operation(summary = "Yazı detayı")
    public ApiResponse<ArticleResponse> get(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.get(id, actor));
    }

    @GetMapping("/slug/{slug}")
    @SecurityRequirements
    @Operation(summary = "Yazı detayı (slug)")
    public ApiResponse<ArticleResponse> getBySlug(
            @PathVariable String slug,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.getBySlug(slug, actor));
    }

    @PostMapping("/{id}/submit")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "İncelemeye gönder")
    public ApiResponse<ArticleResponse> submit(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.submit(id, actor));
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN','MENTOR')")
    @Operation(summary = "İncelemeyi başlat")
    public ApiResponse<ArticleResponse> review(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.startReview(id, actor));
    }

    @PostMapping("/{id}/request-revision")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN','MENTOR')")
    @Operation(summary = "Revizyon iste")
    public ApiResponse<ArticleResponse> requestRevision(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCommentRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.requestRevision(id, request, actor));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN','MENTOR')")
    @Operation(summary = "Onayla")
    public ApiResponse<ArticleResponse> approve(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.approve(id, actor));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN','MENTOR')")
    @Operation(summary = "Reddet")
    public ApiResponse<ArticleResponse> reject(
            @PathVariable Long id,
            @Valid @RequestBody ReviewCommentRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.reject(id, request, actor));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN','MENTOR')")
    @Operation(summary = "Yayımla")
    public ApiResponse<ArticleResponse> publish(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.publish(id, actor));
    }

    @GetMapping("/slug/{slug}/feedback")
    @SecurityRequirements
    @Operation(summary = "Yazı geri bildirim sayıları")
    public ApiResponse<FeedbackCountsResponse> feedbackCounts(
            @PathVariable String slug,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(feedbackService.counts(slug, actor));
    }

    @PostMapping("/slug/{slug}/feedback")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Okur geri bildirimi: ilgimi çekti / yeniden değerlendirilmeli")
    public ApiResponse<FeedbackCountsResponse> feedbackVote(
            @PathVariable String slug,
            @Valid @RequestBody ArticleFeedbackRequest request,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(feedbackService.vote(slug, request, actor));
    }

    @PostMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('EDITOR','ADMIN','MENTOR')")
    @Operation(summary = "Arşivle")
    public ApiResponse<ArticleResponse> archive(
            @PathVariable Long id,
            @Parameter(hidden = true) @AuthenticationPrincipal CurrentUser actor
    ) {
        return ApiResponse.of(articleService.archive(id, actor));
    }
}
