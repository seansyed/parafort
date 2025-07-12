const mongoose = require('mongoose');

// Connect to MongoDB (using local MongoDB for testing)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parafort-compliance';

// Define schemas for testing
const BusinessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  legalName: { type: String, required: true },
  stateOfIncorporation: { type: String, required: true },
  entityType: { type: String, enum: ['LLC', 'S-Corp', 'C-Corp', 'Sole Proprietorship'], required: true },
  formationDate: { type: Date, required: true },
  industry: { type: String, required: true },
  hasEmployees: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ComplianceEventSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['Annual/Biennial', 'Tax-Related', 'Industry-Specific', 'Registered Agent Notice'], required: true },
  eventType: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Upcoming', 'Completed', 'Overdue'], default: 'Upcoming' },
  frequency: { type: String, enum: ['One-Time', 'Annual', 'Quarterly', 'Monthly'], default: 'One-Time' },
  filingLink: { type: String },
  notes: { type: String },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  estimatedCost: { type: Number },
  lastReminderSent: { type: Date },
  remindersSent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Business = mongoose.model('Business', BusinessSchema);
const ComplianceEvent = mongoose.model('ComplianceEvent', ComplianceEventSchema);

// Test data
const testUserId = new mongoose.Types.ObjectId();

async function runComplianceTests() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully');

    // Clean up existing test data
    console.log('🧹 Cleaning up existing test data...');
    await Business.deleteMany({ userId: testUserId });
    await ComplianceEvent.deleteMany({});

    // Test 1: Create Test Business
    console.log('\n📋 Test 1: Creating test business...');
    const testBusiness = new Business({
      userId: testUserId,
      legalName: 'Test Tech Solutions LLC',
      stateOfIncorporation: 'DE',
      entityType: 'LLC',
      formationDate: new Date('2024-01-15'),
      industry: 'Technology',
      hasEmployees: true
    });

    const savedBusiness = await testBusiness.save();
    console.log('✅ Business created:', {
      id: savedBusiness._id,
      name: savedBusiness.legalName,
      state: savedBusiness.stateOfIncorporation,
      type: savedBusiness.entityType
    });

    // Test 2: Generate Compliance Events
    console.log('\n📅 Test 2: Generating compliance events...');
    const complianceEvents = [
      {
        businessId: savedBusiness._id,
        title: 'Delaware Annual Report',
        description: 'Submit annual report to Delaware Division of Corporations',
        category: 'Annual/Biennial',
        eventType: 'Annual Report Filing',
        dueDate: new Date('2025-03-01'),
        priority: 'High',
        estimatedCost: 50,
        filingLink: 'https://corp.delaware.gov'
      },
      {
        businessId: savedBusiness._id,
        title: 'Federal Tax Return (Form 1065)',
        description: 'File partnership tax return with IRS',
        category: 'Tax-Related',
        eventType: 'Tax Filing',
        dueDate: new Date('2025-03-15'),
        priority: 'High',
        estimatedCost: 200,
        frequency: 'Annual'
      },
      {
        businessId: savedBusiness._id,
        title: 'Quarterly Payroll Tax Filing',
        description: 'Submit quarterly payroll tax returns',
        category: 'Tax-Related',
        eventType: 'Payroll Tax',
        dueDate: new Date('2025-01-31'),
        priority: 'Medium',
        estimatedCost: 150,
        frequency: 'Quarterly'
      },
      {
        businessId: savedBusiness._id,
        title: 'Business License Renewal',
        description: 'Renew general business license',
        category: 'Industry-Specific',
        eventType: 'License Renewal',
        dueDate: new Date('2025-06-30'),
        priority: 'Medium',
        estimatedCost: 100
      }
    ];

    const savedEvents = await ComplianceEvent.insertMany(complianceEvents);
    console.log(`✅ Created ${savedEvents.length} compliance events`);

    // Test 3: Query Events by Status
    console.log('\n🔍 Test 3: Querying events by status...');
    const upcomingEvents = await ComplianceEvent.find({ 
      businessId: savedBusiness._id, 
      status: 'Upcoming' 
    }).sort({ dueDate: 1 });
    
    console.log(`📊 Found ${upcomingEvents.length} upcoming events:`);
    upcomingEvents.forEach(event => {
      const daysUntilDue = Math.ceil((event.dueDate - new Date()) / (1000 * 60 * 60 * 24));
      console.log(`  • ${event.title} - Due in ${daysUntilDue} days (${event.priority} priority)`);
    });

    // Test 4: Find Events Needing Reminders
    console.log('\n⏰ Test 4: Finding events needing reminders...');
    const today = new Date();
    const reminderThreshold = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now
    
    const eventsNeedingReminders = await ComplianceEvent.find({
      businessId: savedBusiness._id,
      status: 'Upcoming',
      dueDate: { $lte: reminderThreshold },
      $or: [
        { lastReminderSent: { $exists: false } },
        { lastReminderSent: null },
        { lastReminderSent: { $lt: new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000)) } }
      ]
    });

    console.log(`📧 Found ${eventsNeedingReminders.length} events needing reminders:`);
    eventsNeedingReminders.forEach(event => {
      const daysUntilDue = Math.ceil((event.dueDate - new Date()) / (1000 * 60 * 60 * 24));
      console.log(`  • ${event.title} - Due in ${daysUntilDue} days`);
    });

    // Test 5: Update Event Status
    console.log('\n✏️  Test 5: Updating event status...');
    const eventToUpdate = savedEvents[0];
    await ComplianceEvent.findByIdAndUpdate(
      eventToUpdate._id,
      { 
        status: 'Completed',
        notes: 'Filed online via Delaware Division of Corporations portal',
        updatedAt: new Date()
      }
    );
    
    const updatedEvent = await ComplianceEvent.findById(eventToUpdate._id);
    console.log(`✅ Updated event status: ${updatedEvent.title} -> ${updatedEvent.status}`);

    // Test 6: Mark Reminder as Sent
    console.log('\n📤 Test 6: Marking reminder as sent...');
    const eventForReminder = savedEvents[1];
    await ComplianceEvent.findByIdAndUpdate(
      eventForReminder._id,
      {
        lastReminderSent: new Date(),
        remindersSent: 1,
        updatedAt: new Date()
      }
    );
    
    const reminderEvent = await ComplianceEvent.findById(eventForReminder._id);
    console.log(`✅ Marked reminder sent for: ${reminderEvent.title}`);

    // Test 7: Dashboard Data Aggregation
    console.log('\n📊 Test 7: Generating dashboard data...');
    const dashboardData = await generateDashboardData(testUserId);
    console.log('✅ Dashboard Data:', dashboardData);

    // Test 8: Check Overdue Events
    console.log('\n⚠️  Test 8: Checking for overdue events...');
    // Create an overdue event for testing
    const overdueEvent = new ComplianceEvent({
      businessId: savedBusiness._id,
      title: 'Past Due Test Event',
      description: 'This event is overdue for testing purposes',
      category: 'Tax-Related',
      eventType: 'Test',
      dueDate: new Date('2024-12-01'), // Past date
      priority: 'High',
      status: 'Upcoming'
    });
    
    await overdueEvent.save();
    
    // Update overdue events
    const overdueCount = await ComplianceEvent.updateMany(
      { 
        status: 'Upcoming',
        dueDate: { $lt: new Date() }
      },
      { 
        status: 'Overdue',
        updatedAt: new Date()
      }
    );
    
    console.log(`✅ Updated ${overdueCount.modifiedCount} events to overdue status`);

    // Test 9: Business Statistics
    console.log('\n📈 Test 9: Generating business statistics...');
    const stats = await generateBusinessStatistics();
    console.log('✅ Business Statistics:', stats);

    console.log('\n🎉 All Mongoose compliance tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up and disconnect
    console.log('\n🧹 Cleaning up test data...');
    await Business.deleteMany({ userId: testUserId });
    await ComplianceEvent.deleteMany({ businessId: { $exists: true } });
    
    console.log('🔌 Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
  }
}

async function generateDashboardData(userId) {
  const businesses = await Business.find({ userId }).lean();
  const businessIds = businesses.map(b => b._id);
  
  const allEvents = await ComplianceEvent.find({ 
    businessId: { $in: businessIds } 
  }).populate('businessId', 'legalName').lean();
  
  const upcomingEvents = allEvents.filter(e => e.status === 'Upcoming').length;
  const overdueEvents = allEvents.filter(e => e.status === 'Overdue').length;
  const completedEvents = allEvents.filter(e => e.status === 'Completed').length;
  
  const urgentEvents = allEvents.filter(e => {
    if (e.status !== 'Upcoming') return false;
    const daysUntilDue = Math.ceil((new Date(e.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilDue <= 7;
  }).length;
  
  return {
    totalBusinesses: businesses.length,
    totalEvents: allEvents.length,
    upcomingEvents,
    overdueEvents,
    completedEvents,
    urgentEvents,
    recentEvents: allEvents
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(e => ({
        title: e.title,
        businessName: e.businessId?.legalName,
        dueDate: e.dueDate,
        status: e.status,
        priority: e.priority
      }))
  };
}

async function generateBusinessStatistics() {
  const totalBusinesses = await Business.countDocuments();
  const totalEvents = await ComplianceEvent.countDocuments();
  const upcomingEvents = await ComplianceEvent.countDocuments({ status: 'Upcoming' });
  const overdueEvents = await ComplianceEvent.countDocuments({ status: 'Overdue' });
  const completedEvents = await ComplianceEvent.countDocuments({ status: 'Completed' });

  // Events by state
  const eventsByState = await Business.aggregate([
    {
      $lookup: {
        from: 'complianceevents',
        localField: '_id',
        foreignField: 'businessId',
        as: 'events'
      }
    },
    {
      $group: {
        _id: '$stateOfIncorporation',
        businessCount: { $sum: 1 },
        eventCount: { $sum: { $size: '$events' } }
      }
    },
    {
      $sort: { businessCount: -1 }
    }
  ]);

  // Events by entity type
  const eventsByEntityType = await Business.aggregate([
    {
      $lookup: {
        from: 'complianceevents',
        localField: '_id',
        foreignField: 'businessId',
        as: 'events'
      }
    },
    {
      $group: {
        _id: '$entityType',
        businessCount: { $sum: 1 },
        eventCount: { $sum: { $size: '$events' } }
      }
    }
  ]);

  return {
    totalBusinesses,
    totalEvents,
    upcomingEvents,
    overdueEvents,
    completedEvents,
    eventsByState,
    eventsByEntityType
  };
}

// Run the tests
if (require.main === module) {
  runComplianceTests().catch(console.error);
}

module.exports = { runComplianceTests };