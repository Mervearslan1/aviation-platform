CREATE TABLE team_applications (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(120) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    profession      VARCHAR(32)  NOT NULL,
    requested_role  VARCHAR(32)  NOT NULL,
    experience      VARCHAR(1000),
    message         VARCHAR(2000) NOT NULL,
    status          VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ,
    reviewer_id     BIGINT REFERENCES users (id)
);

CREATE INDEX idx_team_applications_status ON team_applications (status, created_at DESC);

ALTER TABLE team_applications ADD CONSTRAINT ck_team_applications_profession
    CHECK (profession IN ('PILOT', 'ATC', 'STUDENT', 'OTHER'));
ALTER TABLE team_applications ADD CONSTRAINT ck_team_applications_role
    CHECK (requested_role IN ('AUTHOR', 'EDITOR', 'CONTRIBUTOR'));
ALTER TABLE team_applications ADD CONSTRAINT ck_team_applications_status
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'));
