CREATE TABLE users(
id BIGSERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
full_name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
roles TEXT[] NOT NULL DEFAULT ARRAY['creator'],
plan VARCHAR(30) NOT NULL DEFAULT 'free',
is_verified BOOLEAN DEFAULT FALSE,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE posts(
id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
topic VARCHAR(255) NOT NULL,
content TEXT NOT NULL,
call_to_action TEXT,
platforms TEXT[] NOT NULL,
status VARCHAR(30) DEFAULT 'draft',
is_saved BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE promotion_links(
id BIGSERIAL PRIMARY KEY,
post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
platform VARCHAR(50) NOT NULL,
slug VARCHAR(100) UNIQUE NOT NULL,
destination_url TEXT NOT NULL,
click_count INTEGER DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE analytics_events(
id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
promotion_link_id BIGINT REFERENCES promotion_links(id) ON DELETE CASCADE,
event_type VARCHAR(50) NOT NULL,
platform VARCHAR(50),
country VARCHAR(100),
device_type VARCHAR(50),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscriptions(
id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
plan_name VARCHAR(30) NOT NULL DEFAULT 'free',
billing_cycle VARCHAR(20),
status VARCHAR(20) NOT NULL DEFAULT 'active',
starts_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ends_at TIMESTAMP,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_promotion_links_post_id ON promotion_links(post_id);
CREATE INDEX idx_analytics_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_post_id ON analytics_events(post_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
