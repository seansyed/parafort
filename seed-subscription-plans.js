// Simple script to seed subscription plans using direct database connection
import { db } from './server/db.js';

async function seedSubscriptionPlans() {
  try {
    console.log('Seeding subscription plans...');
    
    // Check if plans already exist
    const existingPlans = await db.query.subscriptionPlans.findMany();
    
    if (existingPlans.length > 0) {
      console.log(`Found ${existingPlans.length} existing subscription plans. Skipping seed.`);
      return;
    }
    
    // Create the three main subscription plans
    const plans = [
      {
        name: 'Free',
        description: 'Perfect for new entrepreneurs. Start your business at no cost with our Free Plan. Get essential business formation support, including company registration and basic compliance support, all with no upfront fees.',
        yearlyPrice: '0.00',
        isActive: true,
        features: [
          'Business Formation Filing',
          'Email Support'
        ]
      },
      {
        name: 'Silver',
        description: 'Get more than the basics with our Silver Plan. Along with essential business formation support, Perfect for growing businesses, this plan ensures your company is set up with a solid foundation and ongoing compliance support.',
        yearlyPrice: '195.00',
        isActive: true,
        features: [
          'Everything in Starter',
          'Registered Agent Service (1 year)',
          'Digital Mailbox',
          'Business Bank Account Setup',
          'Compliance Calendar',
          'Priority Support'
        ]
      },
      {
        name: 'Gold',
        description: 'Upgrade to our Gold Plan for the most comprehensive business formation experience. Ideal for entrepreneurs who want premium features and expert support as they launch and grow their business.',
        yearlyPrice: '295.00',
        isActive: true,
        features: [
          'Everything in Professional',
          'Dedicated Account Manager',
          'Custom Legal Documents',
          'Tax Strategy Consultation',
          'Multi-state Compliance',
          '24/7 Phone Support'
        ]
      }
    ];
    
    // Insert the plans using raw SQL
    for (const plan of plans) {
      await db.execute(`
        INSERT INTO subscription_plans (name, description, yearly_price, is_active, features, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      `, [
        plan.name,
        plan.description,
        plan.yearlyPrice,
        plan.isActive,
        JSON.stringify(plan.features)
      ]);
    }
    
    console.log(`Successfully seeded ${plans.length} subscription plans:`);
    plans.forEach(plan => {
      console.log(`- ${plan.name}: $${plan.yearlyPrice}/year`);
    });
    
  } catch (error) {
    console.error('Error seeding subscription plans:', error);
    throw error;
  }
}

// Run the seeding function
seedSubscriptionPlans()
  .then(() => {
    console.log('Subscription plans seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed subscription plans:', error);
    process.exit(1);
  });