/**
 * Test Order Completion Workflow
 * This script tests the complete order completion process including:
 * - AI-generated compliance due dates
 * - Completion certificate generation
 * - Email notifications
 * - Document delivery setup
 * - Follow-up workflow creation
 */

async function testOrderCompletion() {
  console.log('🧪 Testing Order Completion Workflow...');
  
  // Test data for the existing formation order
  const testOrderData = {
    orderId: 'PF-1751851203618',
    orderType: 'formation',
    userId: 'user_0522e2033cd38aad',
    businessName: 'Bookkeeping Services',
    entityType: 'Corporation',
    state: 'DE',
    customerEmail: 'test@parafort.com',
    customerName: 'Test Customer'
  };
  
  try {
    console.log('📋 Order Details:');
    console.log(`  - Order ID: ${testOrderData.orderId}`);
    console.log(`  - Business: ${testOrderData.businessName}`);
    console.log(`  - Entity Type: ${testOrderData.entityType}`);
    console.log(`  - State: ${testOrderData.state}`);
    console.log(`  - Customer: ${testOrderData.customerName}`);
    console.log('');
    
    console.log('🚀 Starting completion workflow...');
    
    // Make API call to trigger completion workflow
    const response = await fetch('http://localhost:5000/api/test-order-completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrderData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Order completion workflow executed successfully!');
      console.log('');
      console.log('📊 What was created:');
      console.log('  ✓ AI-generated compliance due dates');
      console.log('  ✓ Professional completion certificate (PDF)');
      console.log('  ✓ Customer notification email');
      console.log('  ✓ Document delivery setup');
      console.log('  ✓ Follow-up workflow entries');
      console.log('');
      console.log('🎯 Next steps:');
      console.log('  1. Check compliance calendar for new due dates');
      console.log('  2. Verify completion certificate was generated');
      console.log('  3. Confirm email notification was sent');
      console.log('  4. Review order workflows created');
    } else {
      console.error('❌ Error testing order completion:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing order completion:', error);
    console.error('Full error details:', error.stack);
  }
}

// Run the test
testOrderCompletion().catch(console.error);

// Run the test
testOrderCompletion().catch(console.error);