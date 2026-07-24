// hort_url_id  SERIAL PRIMARY KEY
// code          VARCHAR(10) UNIQUE NOT NULL   -- indexed, this is your hot lookup path
// long_url      TEXT NOT NULL
// user_id       INT NULL                      -- nullable = anonymous shortens allowed
// created_at    TIMESTAMP DEFAULT now()
// expires_at    TIMESTAMP NULL
// click_count   INT DEFAULT 0

