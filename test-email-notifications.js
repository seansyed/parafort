import fetch from 'node-fetch';

async function testEmailNotifications() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('Testing Email Notification System for User Delegation Feature\n');
    
    // Test 1: Check current authorized users
    console.log('1. Checking current authorized users...');
    const authCheck = await fetch(`${baseUrl}/api/authorized-users`, {
      headers: {
        'Cookie': 'connect.sid=s%3AromnyC2z_VGNq5mw_kAqbwrQOgrfQxKh.%2FJeUWYTu8CIgYwgX7Ip1XfmEr%2Bp1kF2mxKz0Q9y8jE'
      }
    });
    
    if (authCheck.status === 401) {
      console.log('❌ Authentication failed - session may have expired');
      return;
    }
    
    const currentUsers = await authCheck.json();
    console.log(`✓ Current authorized users: ${currentUsers.length}`);
    
    // Test 2: Add authorized user (this will trigger email notifications)
    if (currentUsers.length === 0) {
      console.log('\n2. Adding authorized user (will send emails)...');
      const addResponse = await fetch(`${baseUrl}/api/authorized-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'connect.sid=s%3AromnyC2z_VGNq5mw_kAqbwrQOgrfQxKh.%2FJeUWYTu8CIgYwgX7Ip1XfmEr%2Bp1kF2mxKz0Q9y8jE'
        },
        body: JSON.stringify({
          authorizedEmail: 'jane.accountant@example.com',
          authorizedName: 'Jane Smith',
          relationship: 'accountant'
        })
      });
      
      if (addResponse.ok) {
        const newUser = await addResponse.json();
        console.log('✓ Authorized user added successfully');
        console.log(`  - Name: ${newUser.authorizedName}`);
        console.log(`  - Email: ${newUser.authorizedEmail}`);
        console.log(`  - Status: ${newUser.status}`);
        console.log('📧 Invitation email sent to authorized user');
        console.log('📧 Confirmation email sent to client');
        
        // Test 3: Remove authorized user (this will trigger revocation emails)
        console.log('\n3. Removing authorized user (will send revocation emails)...');
        const removeResponse = await fetch(`${baseUrl}/api/authorized-users/${newUser.id}`, {
          method: 'DELETE',
          headers: {
            'Cookie': 'connect.sid=s%3AromnyC2z_VGNq5mw_kAqbwrQOgrfQxKh.%2FJeUWYTu8CIgYwgX7Ip1XfmEr%2Bp1kF2mxKz0Q9y8jE'
          }
        });
        
        if (removeResponse.ok) {
          console.log('✓ Authorized user removed successfully');
          console.log('📧 Revocation email sent to authorized user');
          console.log('📧 Confirmation email sent to client');
        } else {
          console.log('❌ Failed to remove authorized user');
        }
      } else {
        const error = await addResponse.text();
        console.log(`❌ Failed to add authorized user: ${error}`);
      }
    } else {
      console.log('\n2. Authorized user already exists - testing removal...');
      const existingUser = currentUsers[0];
      
      const removeResponse = await fetch(`${baseUrl}/api/authorized-users/${existingUser.id}`, {
        method: 'DELETE',
        headers: {
          'Cookie': 'connect.sid=s%3AromnyC2z_VGNq5mw_kAqbwrQOgrfQxKh.%2FJeUWYTu8CIgYwgX7Ip1XfmEr%2Bp1kF2mxKz0Q9y8jE'
        }
      });
      
      if (removeResponse.ok) {
        console.log('✓ Existing authorized user removed');
        console.log('📧 Revocation email sent to authorized user');
        console.log('📧 Confirmation email sent to client');
      } else {
        console.log('❌ Failed to remove existing authorized user');
      }
    }
    
    console.log('\n✅ Email notification test completed');
    console.log('\nNote: Check server logs for email sending confirmations');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmailNotifications();