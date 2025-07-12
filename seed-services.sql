-- Seed services for ParaFort
-- This script creates essential services including BOIR Filing (ID: 11)

-- Insert services if they don't exist
INSERT INTO services (id, name, description, category, one_time_price, recurring_price, recurring_interval, is_active, is_popular, sort_order, created_at, updated_at)
VALUES 
  (1, 'Business Formation', 'Complete business formation services including LLC and Corporation setup', 'formation', 299.00, NULL, NULL, true, true, 1, NOW(), NOW()),
  (2, 'EIN Application', 'Federal Tax ID (EIN) application service', 'tax', 99.00, NULL, NULL, true, false, 2, NOW(), NOW()),
  (3, 'Registered Agent', 'Professional registered agent service', 'compliance', 149.00, 149.00, 'yearly', true, false, 3, NOW(), NOW()),
  (5, 'Annual Report Filing', 'Annual report filing service for business compliance', 'compliance', 199.00, NULL, NULL, true, false, 5, NOW(), NOW()),
  (6, 'Operating Agreement', 'Custom operating agreement drafting service', 'legal', 299.00, NULL, NULL, true, false, 6, NOW(), NOW()),
  (9, 'Legal Documents', 'Various legal document preparation services', 'legal', 199.00, NULL, NULL, true, false, 9, NOW(), NOW()),
  (10, 'S-Corp Election', 'S-Corporation tax election filing service', 'tax', 149.00, NULL, NULL, true, false, 10, NOW(), NOW()),
  (11, 'BOIR Filing', 'Beneficial Ownership Information Report filing service', 'compliance', 199.00, NULL, NULL, true, true, 11, NOW(), NOW()),
  (16, 'Business Formation', 'Comprehensive business formation package', 'formation', 399.00, NULL, NULL, true, false, 16, NOW(), NOW()),
  (17, 'EIN Service', 'Federal Employer Identification Number service', '', 99.00, NULL, NULL, true, false, 17, NOW(), NOW()),
  (30, 'Documents', 'Document management and filing services', 'documents', 99.00, NULL, NULL, true, false, 30, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;