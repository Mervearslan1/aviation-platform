package com.aviation.platform.module.article.service;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.exception.ErrorCode;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.request.SaveArticleRequest;
import com.aviation.platform.module.article.entity.Article;
import com.aviation.platform.module.article.entity.ArticleStatus;
import com.aviation.platform.module.article.repository.ArticleCategoryRepository;
import com.aviation.platform.module.article.repository.ArticleRepository;
import com.aviation.platform.module.article.repository.ArticleReviewNoteRepository;
import com.aviation.platform.module.article.repository.ArticleTagRepository;
import com.aviation.platform.module.article.repository.ArticleVersionRepository;
import com.aviation.platform.module.article.repository.MediaAssetRepository;
import com.aviation.platform.module.article.service.impl.ArticleServiceImpl;
import com.aviation.platform.module.audit.service.AuditService;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;
    @Mock
    private ArticleCategoryRepository categoryRepository;
    @Mock
    private ArticleTagRepository tagRepository;
    @Mock
    private ArticleVersionRepository versionRepository;
    @Mock
    private ArticleReviewNoteRepository reviewNoteRepository;
    @Mock
    private MediaAssetRepository mediaAssetRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AuditService auditService;

    private ArticleService articleService;

    @BeforeEach
    void setUp() {
        articleService = new ArticleServiceImpl(
                articleRepository,
                categoryRepository,
                tagRepository,
                versionRepository,
                reviewNoteRepository,
                mediaAssetRepository,
                userRepository,
                auditService,
                Clock.fixed(Instant.parse("2026-09-14T12:00:00Z"), ZoneOffset.UTC)
        );
    }

    @Test
    void userCannotCreateArticle() {
        CurrentUser user = new CurrentUser(2L, "reader", "r@x.com", Set.of(RoleName.USER));
        assertThatThrownBy(() -> articleService.create(new SaveArticleRequest("T", null, null, null, null, "<p>x</p>", null), user))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.ACCESS_DENIED);
    }

    @Test
    void authorCannotEditSomeoneElsesArticle() throws Exception {
        CurrentUser author = new CurrentUser(2L, "pilot", "p@x.com", Set.of(RoleName.AUTHOR));
        User owner = new User("other", "o@x.com", "hash", "Other");
        setId(owner, 9L);
        Article article = new Article(owner, "Title", "title");
        setId(article, 1L);
        when(articleRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(article));

        assertThatThrownBy(() -> articleService.update(1L, new SaveArticleRequest("Yeni", null, null, null, null, "<p>y</p>", null), author))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.ARTICLE_NOT_OWNED);
    }

    @Test
    void cannotPublishFromDraft() throws Exception {
        CurrentUser editor = new CurrentUser(1L, "ed", "e@x.com", Set.of(RoleName.EDITOR));
        User owner = new User("pilot", "p@x.com", "hash", "Pilot");
        setId(owner, 2L);
        Article article = new Article(owner, "Title", "title");
        article.setStatus(ArticleStatus.DRAFT);
        setId(article, 1L);
        when(articleRepository.findByIdWithDetails(1L)).thenReturn(Optional.of(article));

        assertThatThrownBy(() -> articleService.publish(1L, editor))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.INVALID_STATE_TRANSITION);
    }

    private static void setId(Object entity, Long id) throws Exception {
        Field field = entity.getClass().getDeclaredField("id");
        field.setAccessible(true);
        field.set(entity, id);
    }
}
