import fetch from 'node-fetch';

async function testSendLastOrderEmails() {
  try {
    console.log('Calling API to send last order emails...');
    
    const response = await fetch('http://localhost:5000/api/admin/send-last-order-emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    
    // Try to parse as JSON
    try {
      const data = JSON.parse(responseText);
      console.log('Response data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log('Response is not JSON. First 500 chars:', responseText.substring(0, 500));
    }
    
  } catch (error) {
    console.error('Error calling API:', error);
  }
}

testSendLastOrderEmails();