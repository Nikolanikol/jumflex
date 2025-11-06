-- Migration to support Google OAuth
-- This makes password_hash nullable to allow users to sign in with Google without a password

-- Update users table to make password_hash nullable
ALTER TABLE users
ALTER COLUMN password_hash DROP NOT NULL;

-- Add comment to explain the change
COMMENT ON COLUMN users.password_hash IS 'Password hash for credential-based auth. NULL for OAuth users (Google, etc.)';

-- Optional: Add index on email for faster lookups during OAuth sign-in
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
