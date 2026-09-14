CREATE TABLE article_categories (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(120) NOT NULL,
    slug            VARCHAR(140) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_article_categories_name UNIQUE (name),
    CONSTRAINT uk_article_categories_slug UNIQUE (slug),
    CONSTRAINT ck_article_categories_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE TABLE article_tags (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(64) NOT NULL,
    slug        VARCHAR(80) NOT NULL,
    CONSTRAINT uk_article_tags_name UNIQUE (name),
    CONSTRAINT uk_article_tags_slug UNIQUE (slug)
);

CREATE TABLE media_assets (
    id                  BIGSERIAL PRIMARY KEY,
    uploader_id         BIGINT NOT NULL REFERENCES users (id),
    media_type          VARCHAR(16) NOT NULL,
    original_filename   VARCHAR(255) NOT NULL,
    content_type        VARCHAR(120) NOT NULL,
    size_bytes          BIGINT NOT NULL,
    storage_key         VARCHAR(255) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_media_assets_storage_key UNIQUE (storage_key),
    CONSTRAINT ck_media_assets_type CHECK (media_type IN ('IMAGE', 'VIDEO', 'AUDIO'))
);

CREATE INDEX idx_media_assets_uploader ON media_assets (uploader_id);

CREATE TABLE articles (
    id                  BIGSERIAL PRIMARY KEY,
    author_id           BIGINT NOT NULL REFERENCES users (id),
    category_id         BIGINT REFERENCES article_categories (id),
    title               VARCHAR(200) NOT NULL,
    slug                VARCHAR(220) NOT NULL,
    summary             VARCHAR(500),
    content_html        TEXT,
    content_document    JSONB,
    cover_media_id      BIGINT REFERENCES media_assets (id),
    status              VARCHAR(32) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at        TIMESTAMPTZ,
    CONSTRAINT uk_articles_slug UNIQUE (slug),
    CONSTRAINT ck_articles_status CHECK (status IN (
        'DRAFT', 'SUBMITTED', 'IN_REVIEW', 'REVISION_REQUIRED',
        'APPROVED', 'PUBLISHED', 'REJECTED', 'ARCHIVED'
    ))
);

CREATE INDEX idx_articles_author ON articles (author_id);
CREATE INDEX idx_articles_status ON articles (status);
CREATE INDEX idx_articles_category ON articles (category_id);
CREATE INDEX idx_articles_published_at ON articles (published_at);

CREATE TABLE article_tag_map (
    article_id  BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    tag_id      BIGINT NOT NULL REFERENCES article_tags (id),
    PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE article_versions (
    id              BIGSERIAL PRIMARY KEY,
    article_id      BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    version_number  INTEGER NOT NULL,
    title           VARCHAR(200) NOT NULL,
    summary         VARCHAR(500),
    content_html    TEXT,
    content_document JSONB,
    created_by      BIGINT NOT NULL REFERENCES users (id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_article_versions UNIQUE (article_id, version_number)
);

CREATE TABLE article_review_notes (
    id              BIGSERIAL PRIMARY KEY,
    article_id      BIGINT NOT NULL REFERENCES articles (id) ON DELETE CASCADE,
    author_id       BIGINT NOT NULL REFERENCES users (id),
    action          VARCHAR(32) NOT NULL,
    comment         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_article_review_notes_action CHECK (action IN ('REVISION_REQUESTED', 'REJECTED', 'APPROVED'))
);

CREATE INDEX idx_article_review_notes_article ON article_review_notes (article_id);

INSERT INTO article_categories (name, slug, description, status) VALUES
    ('Meteoroloji', 'meteoroloji', 'METAR, TAF ve hava yorumları', 'ACTIVE'),
    ('Seyrüsefer', 'seyrusefer', 'Navigasyon ve usul', 'ACTIVE'),
    ('Uçuş Operasyonu', 'ucus-operasyonu', 'SOP, brifing, emniyet', 'ACTIVE'),
    ('Eğitim Notları', 'egitim-notlari', 'Genel havacılık yazıları', 'ACTIVE');
