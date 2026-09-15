ALTER TABLE roles DROP CONSTRAINT IF EXISTS ck_roles_name;
ALTER TABLE roles ADD CONSTRAINT ck_roles_name CHECK (name IN ('USER', 'AUTHOR', 'EDITOR', 'ADMIN', 'MENTOR'));
INSERT INTO roles (name) SELECT 'MENTOR' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'MENTOR');

ALTER TABLE team_applications DROP CONSTRAINT IF EXISTS ck_team_applications_role;
UPDATE team_applications SET requested_role = 'MENTOR' WHERE requested_role = 'CONTRIBUTOR';
ALTER TABLE team_applications ADD CONSTRAINT ck_team_applications_role
    CHECK (requested_role IN ('AUTHOR', 'EDITOR', 'MENTOR'));

ALTER TABLE team_applications ADD COLUMN IF NOT EXISTS intro VARCHAR(500);

CREATE TABLE IF NOT EXISTS article_feedback (
    id           BIGSERIAL PRIMARY KEY,
    article_slug VARCHAR(220) NOT NULL,
    user_id      BIGINT NOT NULL REFERENCES users (id),
    kind         VARCHAR(20) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_article_feedback_user UNIQUE (article_slug, user_id),
    CONSTRAINT ck_article_feedback_kind CHECK (kind IN ('INTERESTED', 'NEEDS_REVIEW'))
);

CREATE INDEX IF NOT EXISTS idx_article_feedback_slug ON article_feedback (article_slug);
