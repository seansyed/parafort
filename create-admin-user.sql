-- SQL script to create an admin user for testing OTP email functionality
-- Run this directly in your database to create a test admin user

-- Insert a test admin user
INSERT INTO users (
  email,
  password,
  "firstName",
  "lastName",
  role,
  "isEmailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  'noreply@parafort.com',
  '$2a$10$REPLACE_WITH_ACTUAL_HASHED_PASSWORD', -- Replace with actual hashed password
  'Admin',
  'User',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  "updatedAt" = NOW();

-- Verify the user was created
SELECT id, email, "firstName", "lastName", role, "isEmailVerified" 
FROM users 
WHERE email = 'noreply@parafort.com';