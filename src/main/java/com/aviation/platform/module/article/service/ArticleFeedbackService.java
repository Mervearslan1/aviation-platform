package com.aviation.platform.module.article.service;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.request.ArticleFeedbackRequest;
import com.aviation.platform.module.article.dto.response.FeedbackCountsResponse;
import com.aviation.platform.module.article.entity.ArticleFeedback;
import com.aviation.platform.module.article.repository.ArticleFeedbackRepository;
import com.aviation.platform.module.user.entity.RoleName;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ArticleFeedbackService {

    private final ArticleFeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public ArticleFeedbackService(ArticleFeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public FeedbackCountsResponse counts(String slug, CurrentUser actor) {
        List<ArticleFeedback> all = feedbackRepository.findByArticleSlug(slug);
        long interested = all.stream().filter(f -> ArticleFeedback.INTERESTED.equals(f.getKind())).count();
        long needs = all.stream().filter(f -> ArticleFeedback.NEEDS_REVIEW.equals(f.getKind())).count();
        String mine = null;
        if (actor != null) {
            mine = all.stream().filter(f -> actor.id().equals(f.getUserId())).map(ArticleFeedback::getKind).findFirst().orElse(null);
        }
        return new FeedbackCountsResponse(interested, needs, mine);
    }

    public FeedbackCountsResponse vote(String slug, ArticleFeedbackRequest request, CurrentUser actor) {
        if (actor.hasRole(RoleName.AUTHOR) || actor.hasRole(RoleName.EDITOR) || actor.hasRole(RoleName.MENTOR) || actor.hasRole(RoleName.ADMIN)) {
            throw ApiException.forbidden("Bu geri bildirim yalnızca okur (USER) içindir");
        }
        User user = userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
        ArticleFeedback row = feedbackRepository.findByArticleSlugAndUser_Id(slug, actor.id())
                .orElseGet(() -> new ArticleFeedback(slug, user, request.kind()));
        row.setKind(request.kind());
        feedbackRepository.save(row);
        return counts(slug, actor);
    }
}
