
CREATE TABLE IF NOT EXISTS listings (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image TEXT NOT NULL,
    price INTEGER NOT NULL DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Trending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id CHAR(36) PRIMARY KEY,
    listing_id CHAR(36) NOT NULL,
    author VARCHAR(100) DEFAULT 'Anonymous Guest',
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

-- 3. Helpful queries:
-- Calculate average rating and review count for all listings:
-- SELECT 
--     l.*, 
--     ROUND(AVG(r.rating), 1) AS avg_rating,
--     COUNT(r.id) AS review_count
-- FROM listings l
-- LEFT JOIN reviews r ON l.id = r.listing_id
-- GROUP BY l.id;
