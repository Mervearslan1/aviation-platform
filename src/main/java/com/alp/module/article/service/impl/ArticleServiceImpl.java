package com.alp.module.article.service.impl;

import com.alp.common.exception.ApiException;
import com.alp.common.pagination.PageParams;
import com.alp.common.security.principal.CurrentUser;
import com.alp.common.util.SlugUtil;
import com.alp.module.article.dto.request.ReviewCommentRequest;
import com.alp.module.article.dto.request.SaveArticleRequest;
import com.alp.module.article.dto.response.ArticleResponse;
import com.alp.module.article.dto.response.ReviewNoteResponse;
import com.alp.module.article.entity.Article;
import com.alp.module.article.entity.ArticleCategory;
import com.alp.module.article.entity.ArticleReviewNote;
import com.alp.module.article.entity.ArticleStatus;
import com.alp.module.article.entity.ArticleTag;
import com.alp.module.article.entity.ArticleVersion;
import com.alp.module.article.entity.MediaAsset;
import com.alp.module.article.repository.ArticleCategoryRepository;
import com.alp.module.article.repository.ArticleRepository;
import com.alp.module.article.repository.ArticleReviewNoteRepository;
import com.alp.module.article.repository.ArticleTagRepository;
import com.alp.module.article.repository.ArticleVersionRepository;
import com.alp.module.article.repository.MediaAssetRepository;
import com.alp.module.article.service.ArticleService;
import com.alp.module.audit.service.AuditService;
import com.alp.module.user.entity.RoleName;
import com.alp.module.user.entity.User;
import com.alp.module.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@Transactional
public class ArticleServiceImpl implements ArticleService {

    private static final Set<String> SORT_FIELDS = Set.of("createdAt", "updatedAt", "publishedAt", "title", "id");

    private final ArticleRepository articleRepository;
    private final ArticleCategoryRepository categoryRepository;
    private final ArticleTagRepository tagRepository;
    private final ArticleVersionRepository versionRepository;
    private final ArticleReviewNoteRepository reviewNoteRepository;
    private final MediaAssetRepository mediaAssetRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final Clock clock;

    public ArticleServiceImpl(
            ArticleRepository articleRepository,
            ArticleCategoryRepository categoryRepository,
            ArticleTagRepository tagRepository,
            ArticleVersionRepository versionRepository,
            ArticleReviewNoteRepository reviewNoteRepository,
            MediaAssetRepository mediaAssetRepository,
            UserRepository userRepository,
            AuditService auditService,
            Clock clock
    ) {
        this.articleRepository = articleRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.versionRepository = versionRepository;
        this.reviewNoteRepository = reviewNoteRepository;
        this.mediaAssetRepository = mediaAssetRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.clock = clock;
    }

    @Override
    public ArticleResponse create(SaveArticleRequest request, CurrentUser actor) {
        requireAuthor(actor);
        User author = userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
        String title = blankToDefault(request.title(), "Başlıksız taslak");
        Article article = new Article(author, title, uniqueSlug(title));
        applyContent(article, request);
        articleRepository.save(article);
        auditService.record(actor.id(), "ARTICLE_CREATED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    @Override
    public ArticleResponse update(Long id, SaveArticleRequest request, CurrentUser actor) {
        Article article = load(id);
        assertCanEdit(article, actor);
        if (!article.getStatus().isEditableByAuthor() && !isEditor(actor)) {
            throw ApiException.invalidState("Article can only be edited in DRAFT or REVISION_REQUIRED");
        }
        if (request.title() != null && !request.title().isBlank() && !request.title().equals(article.getTitle())) {
            article.setTitle(request.title().trim());
            article.setSlug(uniqueSlug(request.title()));
        }
        applyContent(article, request);
        auditService.record(actor.id(), "ARTICLE_UPDATED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    @Override
    @Transactional(readOnly = true)
    public ArticleResponse get(Long id, CurrentUser actor) {
        Article article = load(id);
        assertCanRead(article, actor);
        return toResponse(article);
    }

    @Override
    @Transactional(readOnly = true)
    public ArticleResponse getBySlug(String slug, CurrentUser actor) {
        Article article = articleRepository.findBySlugWithDetails(slug)
                .orElseThrow(() -> ApiException.notFound("Article not found"));
        assertCanRead(article, actor);
        return toResponse(article);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleResponse> listPublished(Integer page, Integer size, String sort) {
        Pageable pageable = PageParams.of(page, size, sort, SORT_FIELDS, "publishedAt");
        return articleRepository.findByStatus(ArticleStatus.PUBLISHED, pageable).map(ArticleResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleResponse> listMine(CurrentUser actor, ArticleStatus status, Integer page, Integer size, String sort) {
        Pageable pageable = PageParams.of(page, size, sort, SORT_FIELDS, "updatedAt");
        Page<Article> articles = status == null
                ? articleRepository.findByAuthorId(actor.id(), pageable)
                : articleRepository.findByAuthorIdAndStatus(actor.id(), status, pageable);
        return articles.map(ArticleResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ArticleResponse> listForEditors(ArticleStatus status, Integer page, Integer size, String sort) {
        Pageable pageable = PageParams.of(page, size, sort, SORT_FIELDS, "updatedAt");
        if (status == null) {
            return articleRepository.findAll(pageable).map(ArticleResponse::from);
        }
        return articleRepository.findByStatus(status, pageable).map(ArticleResponse::from);
    }

    @Override
    public ArticleResponse submit(Long id, CurrentUser actor) {
        Article article = load(id);
        assertOwner(article, actor);
        if (article.getTitle() == null || article.getTitle().isBlank()) {
            throw ApiException.badRequest("Title is required to submit");
        }
        if (!article.hasContent()) {
            throw ApiException.badRequest("Content is required to submit");
        }
        transition(article, ArticleStatus.SUBMITTED);
        auditService.record(actor.id(), "ARTICLE_SUBMITTED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    @Override
    public ArticleResponse startReview(Long id, CurrentUser actor) {
        requireEditor(actor);
        Article article = load(id);
        transition(article, ArticleStatus.IN_REVIEW);
        auditService.record(actor.id(), "ARTICLE_REVIEW_STARTED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    @Override
    public ArticleResponse requestRevision(Long id, ReviewCommentRequest request, CurrentUser actor) {
        requireEditor(actor);
        Article article = load(id);
        transition(article, ArticleStatus.REVISION_REQUIRED);
        reviewNoteRepository.save(new ArticleReviewNote(article, reviewer(actor), "REVISION_REQUESTED", request.comment()));
        auditService.record(actor.id(), "ARTICLE_REVISION_REQUESTED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    @Override
    public ArticleResponse approve(Long id, CurrentUser actor) {
        requireEditor(actor);
        Article article = load(id);
        transition(article, ArticleStatus.APPROVED);
        reviewNoteRepository.save(new ArticleReviewNote(article, reviewer(actor), "APPROVED", "Approved"));
        auditService.record(actor.id(), "ARTICLE_APPROVED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    @Override
    public ArticleResponse reject(Long id, ReviewCommentRequest request, CurrentUser actor) {
        requireEditor(actor);
        Article article = load(id);
        transition(article, ArticleStatus.REJECTED);
        reviewNoteRepository.save(new ArticleReviewNote(article, reviewer(actor), "REJECTED", request.comment()));
        auditService.record(actor.id(), "ARTICLE_REJECTED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    @Override
    public ArticleResponse publish(Long id, CurrentUser actor) {
        requireEditor(actor);
        Article article = load(id);
        transition(article, ArticleStatus.PUBLISHED);
        article.setPublishedAt(Instant.now(clock));
        int next = versionRepository.countByArticleId(article.getId()) + 1;
        versionRepository.save(new ArticleVersion(article, next, reviewer(actor)));
        auditService.record(actor.id(), "ARTICLE_PUBLISHED", "Article", article.getId(), Map.of("version", next), null);
        return toResponse(article);
    }

    @Override
    public ArticleResponse archive(Long id, CurrentUser actor) {
        requireEditor(actor);
        Article article = load(id);
        transition(article, ArticleStatus.ARCHIVED);
        auditService.record(actor.id(), "ARTICLE_ARCHIVED", "Article", article.getId(), Map.of(), null);
        return toResponse(article);
    }

    private void applyContent(Article article, SaveArticleRequest request) {
        if (request.summary() != null) {
            article.setSummary(request.summary());
        }
        if (request.contentHtml() != null) {
            article.setContentHtml(request.contentHtml());
        }
        if (request.contentDocument() != null) {
            article.setContentDocument(request.contentDocument());
        }
        if (request.categoryId() != null) {
            article.setCategory(categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> ApiException.notFound("Category not found")));
        }
        if (request.coverMediaId() != null) {
            MediaAsset cover = mediaAssetRepository.findById(request.coverMediaId())
                    .orElseThrow(() -> ApiException.notFound("Cover media not found"));
            article.setCoverMedia(cover);
        }
        if (request.tagNames() != null) {
            Set<ArticleTag> tags = new HashSet<>();
            for (String raw : request.tagNames()) {
                if (raw == null || raw.isBlank()) {
                    continue;
                }
                String name = raw.trim();
                ArticleTag tag = tagRepository.findByNameIgnoreCase(name)
                        .orElseGet(() -> tagRepository.save(new ArticleTag(name, uniqueTagSlug(name))));
                tags.add(tag);
            }
            article.setTags(tags);
        }
    }

    private void transition(Article article, ArticleStatus target) {
        if (!article.getStatus().canTransitionTo(target)) {
            throw ApiException.invalidState("Cannot transition from " + article.getStatus() + " to " + target);
        }
        article.setStatus(target);
    }

    private Article load(Long id) {
        return articleRepository.findByIdWithDetails(id)
                .orElseThrow(() -> ApiException.notFound("Article not found"));
    }

    private ArticleResponse toResponse(Article article) {
        List<ReviewNoteResponse> notes = reviewNoteRepository.findByArticleIdOrderByCreatedAtDesc(article.getId())
                .stream()
                .map(ReviewNoteResponse::from)
                .toList();
        return ArticleResponse.from(article, notes);
    }

    private String uniqueSlug(String title) {
        String base = SlugUtil.slugify(title);
        String slug = base;
        int i = 2;
        while (articleRepository.existsBySlug(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }

    private String uniqueTagSlug(String name) {
        String base = SlugUtil.slugify(name);
        String slug = base;
        int i = 2;
        while (tagRepository.existsBySlug(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }

    private void assertCanRead(Article article, CurrentUser actor) {
        if (article.getStatus().isPublic()) {
            return;
        }
        if (actor == null) {
            throw ApiException.notFound("Article not found");
        }
        if (article.getAuthor().getId().equals(actor.id()) || isEditor(actor)) {
            return;
        }
        throw ApiException.notFound("Article not found");
    }

    private void assertCanEdit(Article article, CurrentUser actor) {
        if (isEditor(actor)) {
            return;
        }
        assertOwner(article, actor);
    }

    private void assertOwner(Article article, CurrentUser actor) {
        if (!article.getAuthor().getId().equals(actor.id())) {
            throw ApiException.articleNotOwned();
        }
    }

    private void requireAuthor(CurrentUser actor) {
        if (!actor.hasRole(RoleName.AUTHOR) && !isEditor(actor)) {
            throw ApiException.forbidden("AUTHOR role is required");
        }
    }

    private void requireEditor(CurrentUser actor) {
        if (!isEditor(actor)) {
            throw ApiException.forbidden("EDITOR role is required");
        }
    }

    private boolean isEditor(CurrentUser actor) {
        return actor.hasRole(RoleName.EDITOR) || actor.hasRole(RoleName.ADMIN);
    }

    private User reviewer(CurrentUser actor) {
        return userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
    }

    private static String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
