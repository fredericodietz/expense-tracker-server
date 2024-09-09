-- pg-init.sql
CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    amount_due VARCHAR(10) NOT NULL,
    due_day INT NOT NULL,  -- Day of the month (1-31)
    is_paid BOOLEAN DEFAULT FALSE
);