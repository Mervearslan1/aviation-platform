package com.aviation.platform.module.article.entity;

import com.aviation.platform.module.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "article_feedback")
public class ArticleFeedback {

    public static final String INTERESTED = "INTERESTED";
    public static final String NEEDS_REVIEW = "NEEDS_REVIEW";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "article_slug", nullable = false, length = 220)
    private String articleSlug;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String kind;

    @Column(columnDefinition = "TEXT")
    private String quote;

    @Column(length = 1000)
    private String note;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected ArticleFeedback() {
    }

    public ArticleFeedback(String articleSlug, User user, String kind, String quote, String note) {
        this.articleSlug = articleSlug;
        this.user = user;
        this.kind = kind;
        this.quote = quote;
        this.note = note;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public Long getUserId() {
        return user.getId();
    }

    public String getArticleSlug() {
        return articleSlug;
    }

    public String getQuote() {
        return quote;
    }

    public String getNote() {
        return note;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public String getUserEmail() {
        return user.getEmail();
    }
}
