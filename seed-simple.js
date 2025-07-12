import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config();

const sql = neon(process.env.DATABASE_URL);

async function seedSubscriptionPlans() {
  try {
    console.log('🌱 Starting subscription plans seeding...');
    
    // Check if plans already exist
    const existingPlans = await sql`SELECT COUNT(*) as count FROM subscription_plans`;
    
    if (existingPlans[0].count > 0) {
      console.log('✅ Subscription plans already exist, skipping seeding');
      return;
    }
    
    // Insert subscription plans
    await sql`
      INSERT INTO subscription_plans (name, description, yearly_price, features)
      VALUES 
        ('Free', 'Perfect for new entrepreneurs starting their business at no cost with our Free Plan. Get essential business formation support, including company registration and basic compliance support, along with access to our knowledge base and community forums.', 0, ARRAY['Business Formation Filing', 'Email Support']),
        ('Silver', 'Get more than the basics with our Silver Plan. Along with essential business formation services, this plan ensures your company is set up with ongoing compliance support. Perfect for growing businesses, this plan ensures your foundation and ongoing compliance support.', 195, ARRAY['Everything in Starter', 'Registered Agent Service (1 year)', 'Digital Mailbox', 'Business Bank Account Setup', 'Compliance Calendar', 'Priority Support']),
        ('Gold', 'Upgrade to our Gold plan for a comprehensive business formation experience. Ideal for entrepreneurs who want premium features and expert support as they launch and grow their business.', 295, ARRAY['Everything in Professional', 'Dedicated Account Manager', 'Custom Legal Documents', 'Tax Strategy Consultation', 'Multi-state Compliance', '24/7 Phone Support'])
    `;
    
    console.log('✅ Successfully seeded subscription plans!');
    
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
    throw error;
  }
}

// Run the seeding
seedSubscriptionPlans()
  .then(() => {
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  });