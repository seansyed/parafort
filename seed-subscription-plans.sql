-- Seed subscription plans for ParaFort
-- This script creates the Free, Silver, and Gold subscription plans

-- Check if subscription_plans table exists and has data
DO $$
BEGIN
    -- Only insert if no plans exist
    IF NOT EXISTS (SELECT 1 FROM subscription_plans LIMIT 1) THEN
        
        -- Insert Free Plan
        INSERT INTO subscription_plans (name, description, yearly_price, is_active, features, created_at, updated_at)
        VALUES (
            'Free',
            'Perfect for new entrepreneurs. Start your business at no cost with our Free Plan. Get essential business formation support, including company registration and basic compliance support, all with no upfront fees.',
            0.00,
            true,
            ARRAY['Business Formation Filing', 'Email Support'],
            NOW(),
            NOW()
        );
        
        -- Insert Silver Plan
        INSERT INTO subscription_plans (name, description, yearly_price, is_active, features, created_at, updated_at)
        VALUES (
            'Silver',
            'Get more than the basics with our Silver Plan. Along with essential business formation support, Perfect for growing businesses, this plan ensures your company is set up with a solid foundation and ongoing compliance support.',
            195.00,
            true,
            ARRAY['Everything in Starter', 'Registered Agent Service (1 year)', 'Digital Mailbox', 'Business Bank Account Setup', 'Compliance Calendar', 'Priority Support'],
            NOW(),
            NOW()
        );
        
        -- Insert Gold Plan
        INSERT INTO subscription_plans (name, description, yearly_price, is_active, features, created_at, updated_at)
        VALUES (
            'Gold',
            'Upgrade to our Gold Plan for the most comprehensive business formation experience. Ideal for entrepreneurs who want premium features and expert support as they launch and grow their business.',
            295.00,
            true,
            ARRAY['Everything in Professional', 'Dedicated Account Manager', 'Custom Legal Documents', 'Tax Strategy Consultation', 'Multi-state Compliance', '24/7 Phone Support'],
            NOW(),
            NOW()
        );
        
        RAISE NOTICE 'Successfully seeded 3 subscription plans: Free ($0/year), Silver ($195/year), Gold ($295/year)';
        
    ELSE
        RAISE NOTICE 'Subscription plans already exist. Skipping seed.';
    END IF;
END
$$;