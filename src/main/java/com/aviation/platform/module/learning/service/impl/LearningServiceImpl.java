package com.aviation.platform.module.learning.service.impl;

import com.aviation.platform.common.exception.ApiException;
import com.aviation.platform.common.security.principal.CurrentUser;
import com.aviation.platform.common.util.SlugUtil;
import com.aviation.platform.module.audit.service.AuditService;
import com.aviation.platform.module.learning.dto.request.CompleteStepRequest;
import com.aviation.platform.module.learning.dto.request.SavePathRequest;
import com.aviation.platform.module.learning.dto.request.SaveStepRequest;
import com.aviation.platform.module.learning.dto.response.PathResponse;
import com.aviation.platform.module.learning.dto.response.StepResponse;
import com.aviation.platform.module.learning.entity.CatalogStatus;
import com.aviation.platform.module.learning.entity.Difficulty;
import com.aviation.platform.module.learning.entity.LearningPath;
import com.aviation.platform.module.learning.entity.LearningStep;
import com.aviation.platform.module.learning.entity.PathProgressStatus;
import com.aviation.platform.module.learning.entity.StepProgressStatus;
import com.aviation.platform.common.util.PhraseMatcher;
import com.aviation.platform.module.learning.entity.StepType;
import com.aviation.platform.module.learning.entity.TrainingTrack;
import com.aviation.platform.module.learning.entity.UserPathProgress;
import com.aviation.platform.module.learning.entity.UserStepProgress;
import com.aviation.platform.module.learning.repository.LearningPathRepository;
import com.aviation.platform.module.learning.repository.LearningStepRepository;
import com.aviation.platform.module.learning.repository.UserPathProgressRepository;
import com.aviation.platform.module.learning.repository.UserStepProgressRepository;
import com.aviation.platform.module.learning.service.LearningService;
import com.aviation.platform.module.user.entity.User;
import com.aviation.platform.module.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class LearningServiceImpl implements LearningService {

    private final LearningPathRepository pathRepository;
    private final LearningStepRepository stepRepository;
    private final UserPathProgressRepository pathProgressRepository;
    private final UserStepProgressRepository stepProgressRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public LearningServiceImpl(
            LearningPathRepository pathRepository,
            LearningStepRepository stepRepository,
            UserPathProgressRepository pathProgressRepository,
            UserStepProgressRepository stepProgressRepository,
            UserRepository userRepository,
            AuditService auditService
    ) {
        this.pathRepository = pathRepository;
        this.stepRepository = stepRepository;
        this.pathProgressRepository = pathProgressRepository;
        this.stepProgressRepository = stepProgressRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Override
    public PathResponse createPath(SavePathRequest request) {
        String slug = uniquePathSlug(request.title());
        LearningPath path = new LearningPath(
                request.title().trim(),
                slug,
                request.description(),
                request.difficulty() == null ? Difficulty.BEGINNER : request.difficulty()
        );
        if (request.status() != null) {
            path.setStatus(request.status());
        }
        if (request.track() != null) {
            path.setTrack(request.track());
        }
        pathRepository.save(path);
        return PathResponse.summary(path, 0);
    }

    @Override
    public PathResponse updatePath(Long id, SavePathRequest request) {
        LearningPath path = pathRepository.findById(id).orElseThrow(() -> ApiException.notFound("Learning path not found"));
        path.setTitle(request.title().trim());
        path.setDescription(request.description());
        if (request.difficulty() != null) {
            path.setDifficulty(request.difficulty());
        }
        if (request.status() != null) {
            path.setStatus(request.status());
        }
        if (request.track() != null) {
            path.setTrack(request.track());
        }
        return PathResponse.summary(path, stepRepository.countByPathId(path.getId()));
    }

    @Override
    public PathResponse publishPath(Long id) {
        LearningPath path = pathRepository.findById(id).orElseThrow(() -> ApiException.notFound("Learning path not found"));
        path.setStatus(CatalogStatus.PUBLISHED);
        return PathResponse.summary(path, stepRepository.countByPathId(path.getId()));
    }

    @Override
    public StepResponse addStep(Long pathId, SaveStepRequest request) {
        LearningPath path = pathRepository.findById(pathId).orElseThrow(() -> ApiException.notFound("Learning path not found"));
        int order = request.orderIndex() == null ? stepRepository.countByPathId(pathId) : request.orderIndex();
        String slug = uniqueStepSlug(pathId, request.title());
        LearningStep step = new LearningStep(
                path,
                request.title().trim(),
                slug,
                request.stepType() == null ? StepType.CONTENT : request.stepType(),
                order
        );
        step.setDescription(request.description());
        step.setContentHtml(request.contentHtml());
        step.setConfiguration(request.configuration());
        if (request.required() != null) {
            step.setRequired(request.required());
        }
        stepRepository.save(step);
        return StepResponse.unlocked(step, StepProgressStatus.AVAILABLE);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PathResponse> listPublished(TrainingTrack track) {
        List<LearningPath> paths = track == null
                ? pathRepository.findByStatusOrderByCreatedAtDesc(CatalogStatus.PUBLISHED)
                : pathRepository.findByStatusAndTrackOrderByCreatedAtDesc(CatalogStatus.PUBLISHED, track);
        return paths.stream()
                .map(path -> PathResponse.summary(path, stepRepository.countByPathId(path.getId())))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PathResponse getPublished(String slug, CurrentUser actor) {
        LearningPath path = pathRepository.findBySlugWithSteps(slug)
                .orElseThrow(() -> ApiException.notFound("Learning path not found"));
        if (!path.getStatus().isPublic()) {
            throw ApiException.notFound("Learning path not found");
        }
        List<LearningStep> steps = path.getSteps().stream()
                .sorted(Comparator.comparingInt(LearningStep::getOrderIndex))
                .toList();
        if (actor == null) {
            List<StepResponse> outline = steps.stream()
                    .map(step -> StepResponse.outline(step, StepProgressStatus.LOCKED))
                    .toList();
            return PathResponse.detail(path, outline, null, null);
        }
        return detailForUser(path, steps, actor.id());
    }

    @Override
    public PathResponse enroll(Long pathId, CurrentUser actor) {
        LearningPath path = pathRepository.findByIdWithSteps(pathId)
                .orElseThrow(() -> ApiException.notFound("Learning path not found"));
        if (!path.getStatus().isPublic()) {
            throw ApiException.notFound("Learning path not found");
        }
        User user = userRepository.findById(actor.id()).orElseThrow(() -> ApiException.notFound("User not found"));
        if (pathProgressRepository.findByUserIdAndPathId(actor.id(), pathId).isPresent()) {
            return detailForUser(path, stepRepository.findByPathIdOrderByOrderIndexAsc(pathId), actor.id());
        }
        pathProgressRepository.save(new UserPathProgress(user, path));
        List<LearningStep> steps = stepRepository.findByPathIdOrderByOrderIndexAsc(pathId);
        for (int i = 0; i < steps.size(); i++) {
            StepProgressStatus status = i == 0 ? StepProgressStatus.AVAILABLE : StepProgressStatus.LOCKED;
            stepProgressRepository.save(new UserStepProgress(user, steps.get(i), status));
        }
        auditService.record(actor.id(), "LEARNING_ENROLLED", "LearningPath", pathId, Map.of(), null);
        return detailForUser(path, steps, actor.id());
    }

    @Override
    public StepResponse openStep(Long pathId, Long stepId, CurrentUser actor) {
        UserStepProgress progress = requireProgress(actor.id(), stepId);
        LearningStep step = progress.getStep();
        if (!step.getPath().getId().equals(pathId)) {
            throw ApiException.notFound("Step not found");
        }
        if (progress.getStatus() == StepProgressStatus.LOCKED) {
            throw ApiException.invalidState("Previous required step is not completed");
        }
        if (progress.getStatus() == StepProgressStatus.AVAILABLE) {
            progress.setStatus(StepProgressStatus.IN_PROGRESS);
            progress.setStartedAt(Instant.now());
        }
        return StepResponse.unlocked(step, progress.getStatus());
    }

    @Override
    public PathResponse completeStep(Long pathId, Long stepId, CompleteStepRequest request, CurrentUser actor) {
        UserStepProgress progress = requireProgress(actor.id(), stepId);
        LearningStep step = progress.getStep();
        if (!step.getPath().getId().equals(pathId)) {
            throw ApiException.notFound("Step not found");
        }
        if (progress.getStatus() == StepProgressStatus.LOCKED) {
            throw ApiException.invalidState("Previous required step is not completed");
        }
        if (step.getStepType() == StepType.PRACTICE || step.getStepType() == StepType.LISTEN
                || step.getStepType() == StepType.SCENARIO) {
            assertPracticeAnswer(step, request);
        }
        if (step.getStepType() == StepType.SPEAK) {
            assertSpokenPhrase(step, request);
        }
        if (progress.getStatus() != StepProgressStatus.COMPLETED) {
            progress.setStatus(StepProgressStatus.COMPLETED);
            progress.setCompletedAt(Instant.now());
            unlockNext(actor.id(), pathId, step);
        }
        LearningPath path = pathRepository.findByIdWithSteps(pathId)
                .orElseThrow(() -> ApiException.notFound("Learning path not found"));
        List<LearningStep> steps = stepRepository.findByPathIdOrderByOrderIndexAsc(pathId);
        refreshPathPercent(actor.id(), path, steps);
        auditService.record(actor.id(), "LEARNING_STEP_COMPLETED", "LearningStep", stepId, Map.of(), null);
        return detailForUser(path, steps, actor.id());
    }

    private PathResponse detailForUser(LearningPath path, List<LearningStep> steps, Long userId) {
        UserPathProgress enrollment = pathProgressRepository.findByUserIdAndPathId(userId, path.getId()).orElse(null);
        Map<Long, StepProgressStatus> byStep = new HashMap<>();
        if (enrollment != null) {
            for (UserStepProgress item : stepProgressRepository.findByUserAndPath(userId, path.getId())) {
                byStep.put(item.getStep().getId(), item.getStatus());
            }
        }
        List<StepResponse> responses = steps.stream().map(step -> {
            StepProgressStatus status = byStep.getOrDefault(step.getId(), StepProgressStatus.LOCKED);
            if (enrollment == null || status == StepProgressStatus.LOCKED) {
                return StepResponse.outline(step, status);
            }
            return StepResponse.unlocked(step, status);
        }).toList();
        Integer percent = enrollment == null ? null : enrollment.getProgressPercent();
        PathProgressStatus enrollmentStatus = enrollment == null ? null : enrollment.getStatus();
        return PathResponse.detail(path, responses, percent, enrollmentStatus);
    }

    private void unlockNext(Long userId, Long pathId, LearningStep completed) {
        List<LearningStep> steps = stepRepository.findByPathIdOrderByOrderIndexAsc(pathId);
        boolean unlock = false;
        for (LearningStep step : steps) {
            if (unlock) {
                stepProgressRepository.findByUserIdAndStepId(userId, step.getId()).ifPresent(next -> {
                    if (next.getStatus() == StepProgressStatus.LOCKED) {
                        next.setStatus(StepProgressStatus.AVAILABLE);
                    }
                });
                if (step.isRequired()) {
                    break;
                }
            }
            if (step.getId().equals(completed.getId())) {
                unlock = true;
            }
        }
    }

    private void refreshPathPercent(Long userId, LearningPath path, List<LearningStep> steps) {
        if (steps.isEmpty()) {
            return;
        }
        long done = stepProgressRepository.findByUserAndPath(userId, path.getId()).stream()
                .filter(item -> item.getStatus() == StepProgressStatus.COMPLETED)
                .count();
        int percent = (int) Math.round((done * 100.0) / steps.size());
        pathProgressRepository.findByUserIdAndPathId(userId, path.getId()).ifPresent(enrollment -> {
            enrollment.setProgressPercent(percent);
            if (percent == 100) {
                enrollment.setStatus(PathProgressStatus.COMPLETED);
                enrollment.setCompletedAt(Instant.now());
            }
        });
    }

    private void assertPracticeAnswer(LearningStep step, CompleteStepRequest request) {
        Map<String, Object> config = step.getConfiguration();
        if (config == null || !config.containsKey("correctOption")) {
            return;
        }
        if (request == null || request.answer() == null || request.answer().isBlank()) {
            throw ApiException.badRequest("Answer is required");
        }
        if (!String.valueOf(config.get("correctOption")).equalsIgnoreCase(request.answer().trim())) {
            throw ApiException.badRequest("Incorrect answer");
        }
    }

    @SuppressWarnings("unchecked")
    private void assertSpokenPhrase(LearningStep step, CompleteStepRequest request) {
        Map<String, Object> config = step.getConfiguration();
        if (config == null) {
            return;
        }
        String spoken = request == null ? null : request.transcript();
        if (spoken == null || spoken.isBlank()) {
            throw ApiException.badRequest("Speak the tower phrase");
        }
        String expected = String.valueOf(config.getOrDefault("expectedPhrase", ""));
        List<String> accepted = config.get("acceptedPhrases") instanceof List<?> list
                ? (List<String>) list
                : List.of();
        if (!PhraseMatcher.matches(spoken, expected, accepted)) {
            throw ApiException.badRequest("Phrase not accepted. Try again like a tower.");
        }
    }

    private UserStepProgress requireProgress(Long userId, Long stepId) {
        return stepProgressRepository.findByUserIdAndStepId(userId, stepId)
                .orElseThrow(() -> ApiException.forbidden("Enroll in the learning path first"));
    }

    private String uniquePathSlug(String title) {
        String base = SlugUtil.slugify(title);
        String slug = base;
        int i = 2;
        while (pathRepository.existsBySlug(slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }

    private String uniqueStepSlug(Long pathId, String title) {
        String base = SlugUtil.slugify(title);
        String slug = base;
        int i = 2;
        while (stepRepository.existsByPathIdAndSlug(pathId, slug)) {
            slug = base + "-" + i++;
        }
        return slug;
    }
}
