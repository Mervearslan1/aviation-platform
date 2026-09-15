package com.aviation.platform.module.learning.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "learning_paths")
public class LearningPath {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Difficulty difficulty = Difficulty.BEGINNER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CatalogStatus status = CatalogStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TrainingTrack track = TrainingTrack.TOWER;

    @Column(name = "related_aircraft", length = 120)
    private String relatedAircraft;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "path")
    @OrderBy("orderIndex ASC")
    private List<LearningStep> steps = new ArrayList<>();

    protected LearningPath() {
    }

    public LearningPath(String title, String slug, String description, Difficulty difficulty) {
        this.title = title;
        this.slug = slug;
        this.description = description;
        this.difficulty = difficulty == null ? Difficulty.BEGINNER : difficulty;
        this.status = CatalogStatus.DRAFT;
        this.track = TrainingTrack.TOWER;
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

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public CatalogStatus getStatus() {
        return status;
    }

    public void setStatus(CatalogStatus status) {
        this.status = status;
    }

    public TrainingTrack getTrack() {
        return track;
    }

    public void setTrack(TrainingTrack track) {
        this.track = track;
    }

    public String getRelatedAircraft() {
        return relatedAircraft;
    }

    public void setRelatedAircraft(String relatedAircraft) {
        this.relatedAircraft = relatedAircraft;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public List<LearningStep> getSteps() {
        return steps;
    }
}
