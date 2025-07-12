import Stripe from 'stripe';

// Test Stripe connection
async function testStripeConnection() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not found in environment');
      return;
    }

    console.log('Testing Stripe connection...');
    console.log('API Key format:', process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...');
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    // Test basic API call
    const account = await stripe.accounts.retrieve();
    console.log('Stripe connection successful!');
    console.log('Account ID:', account.id);
    console.log('Account type:', account.type);
    
    // Test creating a simple product
    console.log('\nTesting product creation...');
    const testProduct = await stripe.products.create({
      name: 'Test Product',
      description: 'Testing Stripe API connection'
    });
    console.log('Product created:', testProduct.id);
    
    // Clean up - delete test product
    await stripe.products.del(testProduct.id);
    console.log('Test product deleted');
    
  } catch (error) {
    console.error('Stripe connection failed:', error.message);
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
  }
}

testStripeConnection();