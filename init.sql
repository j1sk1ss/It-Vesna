CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE moderators (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_moderator (
    user_id INTEGER NOT NULL,
    moderator_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, moderator_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moderator_id) REFERENCES moderators(id) ON DELETE CASCADE
);


CREATE TABLE nominations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE age_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL,
    email VARCHAR(100) NOT NULL,
    nomination_id INTEGER NOT NULL,
    age_group_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    institution VARCHAR(255) NOT NULL,
    description_path VARCHAR(255) NOT NULL,
    consent_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(100),
    authors JSON,
    external_links JSON,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (nomination_id) REFERENCES nominations(id) ON DELETE CASCADE,
    FOREIGN KEY (age_group_id) REFERENCES age_groups(id) ON DELETE CASCADE
);


CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content_path VARCHAR(255) NOT NULL,
    pin INTEGER NOT NULL
);


CREATE INDEX idx_users_name ON users (name);
CREATE INDEX idx_moderators_name ON moderators (name);
CREATE INDEX idx_nominations_name ON nominations (name);
CREATE INDEX idx_age_groups_name ON age_groups (name);


INSERT INTO users (name, email, password)
VALUES ('Moderator', 'moderator@gmail.com', 'ebMt6MWpDHXj8FSI--9p9KuoWRdMGf8f_En_BILv-Tc=')
ON CONFLICT (email) DO NOTHING 
RETURNING id;

WITH inserted_user AS (
    SELECT id FROM users WHERE email = 'moderator@gmail.com'
)

INSERT INTO moderators (name, email)
SELECT 'Moderator', 'moderator@gmail.com'
FROM inserted_user
ON CONFLICT (email) DO NOTHING 
RETURNING id;

WITH inserted_moderator AS (
    SELECT id FROM moderators WHERE email = 'moderator@gmail.com'
),
inserted_user AS (
    SELECT id FROM users WHERE email = 'moderator@gmail.com'
)

INSERT INTO user_moderator (user_id, moderator_id)
SELECT inserted_user.id, inserted_moderator.id
FROM inserted_user, inserted_moderator
ON CONFLICT (user_id, moderator_id) DO NOTHING;
