package com.aviation.platform.module.learning.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "learning_steps")
public class LearningStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "path_id", nullable = false)
    private LearningPath path;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 220)
    private String slug;

    @Column(length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "step_type", nullable = false, length = 20)
    private StepType stepType = StepType.CONTENT;

    @Column(name = "content_html", columnDefinition = "TEXT")
    private String contentHtml;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> configuration;

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(name = "required", nullable = false)
    private boolean required = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "knowledge_level", nullable = false, length = 20)
    private Difficulty knowledgeLevel = Difficulty.BEGINNER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CatalogStatus status = CatalogStatus.PUBLISHED;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected LearningStep() {
    }

    public LearningStep(LearningPath path, String title, String slug, StepType stepType, int orderIndex) {
        this.path = path;
        this.title = title;
        this.slug = slug;
        this.stepType = stepType;
        this.orderIndex = orderIndex;
        this.status = CatalogStatus.PUBLISHED;
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public LearningPath getPath() {
        return path;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public StepType getStepType() {
        return stepType;
    }

    public void setStepType(StepType stepType) {
        this.stepType = stepType;
    }

    public String getContentHtml() {
        return contentHtml;
    }

    public void setContentHtml(String contentHtml) {
        this.contentHtml = contentHtml;
    }

    public Map<String, Object> getConfiguration() {
        return configuration;
    }

    public void setConfiguration(Map<String, Object> configuration) {
        this.configuration = configuration;
    }

    public int getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }

    public boolean isRequired() {
        return required;
    }

    public void setRequired(boolean required) {
        this.required = required;
    }

    public Difficulty getKnowledgeLevel() {
        return knowledgeLevel == null ? Difficulty.BEGINNER : knowledgeLevel;
    }

    public void setKnowledgeLevel(Difficulty knowledgeLevel) {
        this.knowledgeLevel = knowledgeLevel == null ? Difficulty.BEGINNER : knowledgeLevel;
    }

    public CatalogStatus getStatus() {
        return status;
    }

    public void setStatus(CatalogStatus status) {
        this.status = status;
    }
}
