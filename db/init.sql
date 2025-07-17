CREATE DATABASE jaimervq_xyz_db;

CREATE TABLE content_likes (
    id SERIAL PRIMARY KEY,
    content_id TEXT NOT NULL,
    hashed_ip TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(content_id, hashed_ip)
);