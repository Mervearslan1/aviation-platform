CREATE TABLE learning_paths (
    id              BIGSERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(220) NOT NULL,
    description     TEXT,
    difficulty      VARCHAR(20) NOT NULL,
    status          VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_learning_paths_slug UNIQUE (slug),
    CONSTRAINT ck_learning_paths_difficulty CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    CONSTRAINT ck_learning_paths_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

CREATE TABLE learning_steps (
    id              BIGSERIAL PRIMARY KEY,
    path_id         BIGINT NOT NULL REFERENCES learning_paths (id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    slug            VARCHAR(220) NOT NULL,
    description     VARCHAR(500),
    step_type       VARCHAR(20) NOT NULL,
    content_html    TEXT,
    configuration   JSONB,
    order_index     INTEGER NOT NULL,
    required        BOOLEAN NOT NULL DEFAULT TRUE,
    status          VARCHAR(20) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_learning_steps_path_order UNIQUE (path_id, order_index),
    CONSTRAINT uk_learning_steps_path_slug UNIQUE (path_id, slug),
    CONSTRAINT ck_learning_steps_type CHECK (step_type IN ('CONTENT', 'PRACTICE', 'SIMULATION')),
    CONSTRAINT ck_learning_steps_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED'))
);

CREATE INDEX idx_learning_steps_path ON learning_steps (path_id);

CREATE TABLE user_path_progress (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users (id),
    path_id         BIGINT NOT NULL REFERENCES learning_paths (id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL,
    progress_percent INTEGER NOT NULL DEFAULT 0,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_path_progress UNIQUE (user_id, path_id),
    CONSTRAINT ck_user_path_progress_status CHECK (status IN ('IN_PROGRESS', 'COMPLETED'))
);

CREATE TABLE user_step_progress (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users (id),
    step_id         BIGINT NOT NULL REFERENCES learning_steps (id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_user_step_progress UNIQUE (user_id, step_id),
    CONSTRAINT ck_user_step_progress_status CHECK (status IN ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'))
);

INSERT INTO learning_paths (title, slug, description, difficulty, status) VALUES
    (
        'Temel Havacılık',
        'temel-havacilik',
        'Udemy tarzı kurs kataloğu değil; sırayla ilerlenen ilk öğrenme yolu. Okuma, kısa alıştırma ve simülasyon görevi.',
        'BEGINNER',
        'PUBLISHED'
    );

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, order_index, required, status)
SELECT id, 'Uçağın üç ekseni', 'ucagin-uc-ekseni', 'Pitch, roll, yaw nedir?', 'CONTENT',
       '<p>Bir uçak üç eksende hareket eder:</p><ul><li><strong>Pitch</strong> — burun yukarı/aşağı (elevator)</li><li><strong>Roll</strong> — kanat yatışı (aileron)</li><li><strong>Yaw</strong> — burun sağa/sola (rudder)</li></ul>',
       0, TRUE, 'PUBLISHED'
FROM learning_paths WHERE slug = 'temel-havacilik';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Kontrol yüzeyleri', 'kontrol-yuzeyleri', 'Kısa alıştırma', 'PRACTICE',
       '<p>Önceki adımı okuduktan sonra bu alıştırmayı tamamla.</p>',
       '{"question":"Rudder hangi hareketi kontrol eder?","options":["Pitch","Roll","Yaw"],"correctOption":"Yaw"}'::jsonb,
       1, TRUE, 'PUBLISHED'
FROM learning_paths WHERE slug = 'temel-havacilik';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, order_index, required, status)
SELECT id, 'Simülatörde yaw', 'simulatorde-yaw', 'MSFS veya benzeri simülatörde rudder ile yaw dene.', 'SIMULATION',
       '<p>Simülatörde düz uçuşta rudder ver. Burnun yaw yaptığını gözle. Görevi bitince tamamla.</p>',
       2, TRUE, 'PUBLISHED'
FROM learning_paths WHERE slug = 'temel-havacilik';
