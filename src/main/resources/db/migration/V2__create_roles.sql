CREATE TABLE roles (
    id      BIGSERIAL PRIMARY KEY,
    name    VARCHAR(32) NOT NULL,
    CONSTRAINT uk_roles_name UNIQUE (name),
    CONSTRAINT ck_roles_name CHECK (name IN ('USER', 'AUTHOR', 'EDITOR', 'ADMIN'))
);

CREATE TABLE user_roles (
    user_id     BIGINT NOT NULL REFERENCES users (id),
    role_id     BIGINT NOT NULL REFERENCES roles (id),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

INSERT INTO roles (name) VALUES ('USER'), ('AUTHOR'), ('EDITOR'), ('ADMIN');
