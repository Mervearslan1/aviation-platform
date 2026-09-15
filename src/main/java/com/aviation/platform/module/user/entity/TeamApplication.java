package com.aviation.platform.module.user.entity;

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
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "team_applications")
public class TeamApplication {

    public enum Profession { PILOT, ATC, STUDENT, OTHER }
    public enum RequestedRole { AUTHOR, EDITOR, CONTRIBUTOR }
    public enum Status { PENDING, APPROVED, REJECTED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Profession profession;

    @Enumerated(EnumType.STRING)
    @Column(name = "requested_role", nullable = false, length = 32)
    private RequestedRole requestedRole;

    @Column(length = 1000)
    private String experience;

    @Column(nullable = false, length = 2000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    protected TeamApplication() {
    }

    public TeamApplication(
            String fullName,
            String email,
            Profession profession,
            RequestedRole requestedRole,
            String experience,
            String message
    ) {
        this.fullName = fullName;
        this.email = email;
        this.profession = profession;
        this.requestedRole = requestedRole;
        this.experience = experience;
        this.message = message;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        if (status == null) {
            status = Status.PENDING;
        }
    }

    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public Profession getProfession() { return profession; }
    public RequestedRole getRequestedRole() { return requestedRole; }
    public String getExperience() { return experience; }
    public String getMessage() { return message; }
    public Status getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getReviewedAt() { return reviewedAt; }

    public void review(Status status, User reviewer) {
        this.status = status;
        this.reviewer = reviewer;
        this.reviewedAt = Instant.now();
    }
}
