// Test admin login API to verify OTP email functionality

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login API...');
    
    // Test with a known email (you can change this to your email)
    const testEmail = 'noreply@parafort.com'; // Using the same email from .env
    
    console.log(`📧 Testing admin login for: ${testEmail}`);
    
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail
      })
    });
    
    const result = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response body:', result);
    
    if (response.ok) {
      console.log('✅ Admin login request successful!');
      console.log('📧 Check your email for the OTP code.');
      console.log('💡 If you received the email, the OTP system is working correctly.');
    } else {
      console.log('❌ Admin login request failed:');
      console.log('🔍 This might indicate:');
      console.log('   - No admin user exists with this email');
      console.log('   - Email service configuration issue');
      console.log('   - Server error');
    }
    
  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
    console.log('🔍 Make sure the server is running on http://localhost:3000');
  }
}

testAdminLogin();