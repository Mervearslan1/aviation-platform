package com.aviation.platform.module.article.entity;

import com.aviation.platform.module.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "article_versions")
public class ArticleVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @Column(name = "version_number", nullable = false)
    private int versionNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String summary;

    @Column(name = "content_html", columnDefinition = "TEXT")
    private String contentHtml;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "content_document", columnDefinition = "jsonb")
    private Map<String, Object> contentDocument;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected ArticleVersion() {
    }

    public ArticleVersion(Article article, int versionNumber, User createdBy) {
        this.article = article;
        this.versionNumber = versionNumber;
        this.title = article.getTitle();
        this.summary = article.getSummary();
        this.contentHtml = article.getContentHtml();
        this.contentDocument = article.getContentDocument();
        this.createdBy = createdBy;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public int getVersionNumber() {
        return versionNumber;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public String getContentHtml() {
        return contentHtml;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
