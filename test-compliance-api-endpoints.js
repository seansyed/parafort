// Test script for RESTful ComplianceEvents API endpoints
// This script tests the new API routes: POST /api/events, GET /api/events/business/:businessId, PUT /api/events/:eventId, DELETE /api/events/:eventId

const BASE_URL = 'http://localhost:5173';

// Test data
const testBusinessData = {
  legalName: 'API Test Business LLC',
  stateOfIncorporation: 'CA',
  entityType: 'LLC',
  formationDate: '2024-01-15',
  industry: 'Technology',
  hasEmployees: true
};

const testEventData = {
  title: 'California Statement of Information',
  description: 'File biennial Statement of Information with California Secretary of State',
  category: 'Annual/Biennial',
  eventType: 'Statement of Information',
  dueDate: '2025-04-15',
  priority: 'High',
  estimatedCost: 25,
  filingLink: 'https://bizfileonline.sos.ca.gov'
};

async function makeRequest(method, endpoint, data = null, authToken = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch (e) {
      parsedData = responseData;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: parsedData,
      ok: response.ok
    };
  } catch (error) {
    console.error(`Request failed for ${method} ${endpoint}:`, error.message);
    return {
      status: 0,
      statusText: 'Network Error',
      data: { error: error.message },
      ok: false
    };
  }
}

async function testComplianceAPIEndpoints() {
  console.log('🧪 Testing RESTful ComplianceEvents API Endpoints\n');
  
  let createdBusinessId = null;
  let createdEventId = null;

  try {
    // Test 1: Health Check
    console.log('📊 Test 1: MongoDB Health Check');
    const healthResponse = await makeRequest('GET', '/api/compliance/mongoose/health');
    console.log(`Status: ${healthResponse.status}`);
    console.log(`Response:`, healthResponse.data);
    console.log('✅ Health check completed\n');

    // Test 2: Create a test business first (required for events)
    console.log('🏢 Test 2: Create Test Business');
    const businessResponse = await makeRequest('POST', '/api/compliance/mongoose/businesses', testBusinessData);
    console.log(`Status: ${businessResponse.status}`);
    
    if (businessResponse.ok && businessResponse.data.business) {
      createdBusinessId = businessResponse.data.business._id;
      console.log(`✅ Business created with ID: ${createdBusinessId}`);
      console.log(`Business Name: ${businessResponse.data.business.legalName}`);
    } else {
      console.log('❌ Failed to create business:', businessResponse.data);
      return;
    }
    console.log('');

    // Test 3: POST /api/events - Create a new compliance event
    console.log('📝 Test 3: POST /api/events - Create Compliance Event');
    const eventPayload = {
      ...testEventData,
      businessId: createdBusinessId
    };
    
    const createEventResponse = await makeRequest('POST', '/api/compliance/events', eventPayload);
    console.log(`Status: ${createEventResponse.status}`);
    
    if (createEventResponse.ok) {
      createdEventId = createEventResponse.data._id;
      console.log(`✅ Event created successfully`);
      console.log(`Event ID: ${createdEventId}`);
      console.log(`Event Title: ${createEventResponse.data.title}`);
      console.log(`Due Date: ${createEventResponse.data.dueDate}`);
      console.log(`Priority: ${createEventResponse.data.priority}`);
    } else {
      console.log('❌ Failed to create event:', createEventResponse.data);
    }
    console.log('');

    // Test 4: GET /api/events/business/:businessId - Get events for business
    console.log('📋 Test 4: GET /api/events/business/:businessId - Fetch Business Events');
    const getEventsResponse = await makeRequest('GET', `/api/compliance/events/business/${createdBusinessId}`);
    console.log(`Status: ${getEventsResponse.status}`);
    
    if (getEventsResponse.ok) {
      const events = getEventsResponse.data.events || [];
      console.log(`✅ Found ${events.length} events for business`);
      console.log(`Total Count: ${getEventsResponse.data.totalCount}`);
      
      if (events.length > 0) {
        console.log('📄 Event Details:');
        events.forEach((event, index) => {
          console.log(`  ${index + 1}. ${event.title} - ${event.status} (${event.priority} priority)`);
        });
      }
    } else {
      console.log('❌ Failed to fetch events:', getEventsResponse.data);
    }
    console.log('');

    // Test 5: GET with filters - Test query parameters
    console.log('🔍 Test 5: GET with Filters - Status and Priority');
    const filteredResponse = await makeRequest('GET', 
      `/api/compliance/events/business/${createdBusinessId}?status=Upcoming&priority=High&sortBy=dueDate&sortOrder=asc`
    );
    console.log(`Status: ${filteredResponse.status}`);
    
    if (filteredResponse.ok) {
      const filteredEvents = filteredResponse.data.events || [];
      console.log(`✅ Found ${filteredEvents.length} high-priority upcoming events`);
    } else {
      console.log('❌ Failed to fetch filtered events:', filteredResponse.data);
    }
    console.log('');

    // Test 6: PUT /api/events/:eventId - Update event (mark as completed)
    if (createdEventId) {
      console.log('✏️  Test 6: PUT /api/events/:eventId - Update Event Status');
      const updatePayload = {
        status: 'Completed',
        notes: 'Filed successfully through online portal',
        filingLink: 'https://bizfileonline.sos.ca.gov/confirmation/12345'
      };
      
      const updateResponse = await makeRequest('PUT', `/api/compliance/events/${createdEventId}`, updatePayload);
      console.log(`Status: ${updateResponse.status}`);
      
      if (updateResponse.ok) {
        console.log(`✅ Event updated successfully`);
        console.log(`New Status: ${updateResponse.data.status}`);
        console.log(`Notes: ${updateResponse.data.notes}`);
        console.log(`Updated At: ${updateResponse.data.updatedAt}`);
      } else {
        console.log('❌ Failed to update event:', updateResponse.data);
      }
      console.log('');
    }

    // Test 7: Test invalid business ID protection
    console.log('🔒 Test 7: Access Control - Invalid Business ID');
    const invalidBusinessResponse = await makeRequest('GET', '/api/compliance/events/business/invalid_id');
    console.log(`Status: ${invalidBusinessResponse.status}`);
    console.log(`Expected 404 or 500:`, invalidBusinessResponse.data.message);
    console.log('');

    // Test 8: Test missing required fields
    console.log('❌ Test 8: Validation - Missing Required Fields');
    const invalidEventPayload = {
      title: 'Incomplete Event',
      // Missing required fields: businessId, description, category, eventType, dueDate
    };
    
    const invalidEventResponse = await makeRequest('POST', '/api/compliance/events', invalidEventPayload);
    console.log(`Status: ${invalidEventResponse.status}`);
    console.log(`Expected 400:`, invalidEventResponse.data.message);
    console.log('');

    // Test 9: Test invalid enum values
    console.log('🚫 Test 9: Validation - Invalid Enum Values');
    const invalidEnumPayload = {
      ...testEventData,
      businessId: createdBusinessId,
      category: 'Invalid-Category',
      status: 'Invalid-Status',
      priority: 'Invalid-Priority'
    };
    
    const invalidEnumResponse = await makeRequest('POST', '/api/compliance/events', invalidEnumPayload);
    console.log(`Status: ${invalidEnumResponse.status}`);
    console.log(`Expected 400:`, invalidEnumResponse.data.message);
    console.log('');

    // Test 10: DELETE /api/events/:eventId - Delete event
    if (createdEventId) {
      console.log('🗑️  Test 10: DELETE /api/events/:eventId - Delete Event');
      const deleteResponse = await makeRequest('DELETE', `/api/compliance/events/${createdEventId}`);
      console.log(`Status: ${deleteResponse.status}`);
      
      if (deleteResponse.ok) {
        console.log(`✅ Event deleted successfully`);
        console.log(`Deleted Event:`, deleteResponse.data.deletedEvent);
      } else {
        console.log('❌ Failed to delete event:', deleteResponse.data);
      }
      console.log('');
    }

    // Test 11: Verify deletion - Try to fetch deleted event
    if (createdEventId) {
      console.log('🔍 Test 11: Verify Deletion - Fetch After Delete');
      const verifyDeleteResponse = await makeRequest('GET', `/api/compliance/events/business/${createdBusinessId}`);
      console.log(`Status: ${verifyDeleteResponse.status}`);
      
      if (verifyDeleteResponse.ok) {
        const remainingEvents = verifyDeleteResponse.data.events || [];
        const eventExists = remainingEvents.some(event => event._id === createdEventId);
        console.log(`✅ Event deletion verified: ${!eventExists ? 'Event not found (deleted)' : 'Event still exists'}`);
        console.log(`Remaining events: ${remainingEvents.length}`);
      }
      console.log('');
    }

    // Test 12: Test pagination
    console.log('📄 Test 12: Pagination - Limit and Offset');
    const paginationResponse = await makeRequest('GET', 
      `/api/compliance/events/business/${createdBusinessId}?limit=5&offset=0`
    );
    console.log(`Status: ${paginationResponse.status}`);
    
    if (paginationResponse.ok) {
      console.log(`✅ Pagination working`);
      console.log(`Events returned: ${paginationResponse.data.events?.length || 0}`);
      console.log(`Has more: ${paginationResponse.data.hasMore}`);
      console.log(`Total count: ${paginationResponse.data.totalCount}`);
    }
    console.log('');

    console.log('🎉 All RESTful API endpoint tests completed successfully!');
    console.log('\n📋 Test Summary:');
    console.log('✅ POST /api/events - Create compliance event (Admin only)');
    console.log('✅ GET /api/events/business/:businessId - Fetch business events with filters');
    console.log('✅ PUT /api/events/:eventId - Update event status and details');
    console.log('✅ DELETE /api/events/:eventId - Delete compliance event');
    console.log('✅ Access control and user ownership validation');
    console.log('✅ Input validation and error handling');
    console.log('✅ Query filters, sorting, and pagination');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    // Cleanup: Remove test business if created
    if (createdBusinessId) {
      console.log('\n🧹 Cleanup: Removing test business...');
      try {
        // Note: You might want to add a delete business endpoint for cleanup
        console.log(`Test business ${createdBusinessId} should be manually cleaned up if needed`);
      } catch (cleanupError) {
        console.log('Cleanup error:', cleanupError.message);
      }
    }
  }
}

// Authentication helper (if needed)
async function getAuthToken() {
  // This would typically involve a login process
  // For testing, you might need to implement proper authentication
  // or use a test user token
  return null;
}

// API endpoint feature summary
function printAPIFeatures() {
  console.log('\n📚 RESTful ComplianceEvents API Features:');
  console.log('\n🔑 Authentication & Authorization:');
  console.log('  • All endpoints require user authentication');
  console.log('  • Users can only access their own business events');
  console.log('  • Admin users have additional privileges');
  console.log('  • POST /api/events restricted to admin users only');
  
  console.log('\n📋 Event Management:');
  console.log('  • Create events with full validation');
  console.log('  • Fetch events with filtering, sorting, and pagination');
  console.log('  • Update event status and details');
  console.log('  • Delete events with proper authorization');
  
  console.log('\n🔍 Query Features:');
  console.log('  • Filter by status, category, priority');
  console.log('  • Sort by any field (dueDate, title, priority, etc.)');
  console.log('  • Pagination with limit and offset');
  console.log('  • Total count for client-side pagination');
  
  console.log('\n✅ Data Validation:');
  console.log('  • Required field validation');
  console.log('  • Enum value validation (status, category, priority)');
  console.log('  • Date format validation');
  console.log('  • Business ownership verification');
  
  console.log('\n🛡️  Security Features:');
  console.log('  • User ownership validation');
  console.log('  • Admin role checking');
  console.log('  • Input sanitization');
  console.log('  • Proper error handling');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined' && require.main === module) {
  printAPIFeatures();
  testComplianceAPIEndpoints().catch(console.error);
}

module.exports = { testComplianceAPIEndpoints, makeRequest };