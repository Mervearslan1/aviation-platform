package com.aviation.platform.module.article.service;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.module.article.dto.request.ArticleFeedbackRequest;
import com.aviation.platform.module.article.dto.response.ArticleFeedbackItemResponse;
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
        boolean liked = false;
        if (actor != null) {
            liked = feedbackRepository.findByArticleSlugAndUser_IdAndKind(slug, actor.id(), ArticleFeedback.INTERESTED).isPresent();
        }
        return new FeedbackCountsResponse(liked ? 1 : 0, 0, liked ? ArticleFeedback.INTERESTED : null);
    }

    public FeedbackCountsResponse vote(String slug, ArticleFeedbackRequest request, CurrentUser actor) {
        if (actor.hasRole(RoleName.AUTHOR) || actor.hasRole(RoleName.EDITOR) || actor.hasRole(RoleName.MENTOR) || actor.hasRole(RoleName.ADMIN)) {
            throw ApiException.forbidden("Bu geri bildirim yalnızca okur (USER) içindir");
        }
        User user = userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
        if (ArticleFeedback.INTERESTED.equals(request.kind())) {
            var existing = feedbackRepository.findByArticleSlugAndUser_IdAndKind(slug, actor.id(), ArticleFeedback.INTERESTED);
            if (existing.isPresent()) {
                return counts(slug, actor);
            }
            feedbackRepository.save(new ArticleFeedback(slug, user, ArticleFeedback.INTERESTED, null, null));
            return counts(slug, actor);
        }
        String quote = request.quote() == null ? "" : request.quote().trim();
        String note = request.note() == null ? "" : request.note().trim();
        if (quote.isBlank() || note.isBlank()) {
            throw ApiException.badRequest("Değişecek parçayı ve notu yaz");
        }
        feedbackRepository.save(new ArticleFeedback(slug, user, ArticleFeedback.NEEDS_REVIEW, quote, note));
        return counts(slug, actor);
    }

    @Transactional(readOnly = true)
    public List<ArticleFeedbackItemResponse> inbox() {
        return feedbackRepository.findByKindOrderByCreatedAtDesc(ArticleFeedback.NEEDS_REVIEW)
                .stream()
                .map(ArticleFeedbackItemResponse::from)
                .toList();
    }
}
