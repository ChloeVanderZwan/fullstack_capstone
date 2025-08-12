-- Add submitted_by columns to existing tables
ALTER TABLE ballets ADD COLUMN IF NOT EXISTS submitted_by INTEGER REFERENCES users(id);
ALTER TABLE steps ADD COLUMN IF NOT EXISTS submitted_by INTEGER REFERENCES users(id);
ALTER TABLE equipment ADD COLUMN IF NOT EXISTS submitted_by INTEGER REFERENCES users(id); 