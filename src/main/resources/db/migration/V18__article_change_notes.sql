ALTER TABLE article_feedback DROP CONSTRAINT IF EXISTS uk_article_feedback_user;
ALTER TABLE article_feedback ADD COLUMN IF NOT EXISTS quote TEXT;
ALTER TABLE article_feedback ADD COLUMN IF NOT EXISTS note VARCHAR(1000);
CREATE UNIQUE INDEX IF NOT EXISTS uk_article_like
    ON article_feedback (article_slug, user_id)
    WHERE kind = 'INTERESTED';
