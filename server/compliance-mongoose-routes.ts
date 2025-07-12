import { Router } from 'express';
import { complianceMongooseService } from './compliance-mongoose-service';
import { mongoDb } from './mongoose-db';
import { Business, ComplianceEvent } from '../shared/mongoose-schemas';
import { isAuthenticated } from './replitAuth';

const router = Router();

// Initialize MongoDB connection
mongoDb.connect().catch(console.error);

// Get user's compliance dashboard data
router.get('/mongoose/dashboard', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const dashboardData = await complianceMongooseService.getComplianceDashboardData(userId);
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching compliance dashboard:', error);
    res.status(500).json({ message: 'Failed to fetch compliance dashboard' });
  }
});

// Get all businesses for a user
router.get('/mongoose/businesses', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const businesses = await Business.find({ userId }).sort({ createdAt: -1 });
    res.json(businesses);
  } catch (error) {
    console.error('Error fetching businesses:', error);
    res.status(500).json({ message: 'Failed to fetch businesses' });
  }
});

// Create a new business with compliance events
router.post('/mongoose/businesses', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { legalName, stateOfIncorporation, entityType, formationDate, industry, hasEmployees } = req.body;

    if (!legalName || !stateOfIncorporation || !entityType || !formationDate || !industry) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await complianceMongooseService.createBusinessWithCompliance({
      userId,
      legalName,
      stateOfIncorporation: stateOfIncorporation.toUpperCase(),
      entityType,
      formationDate: new Date(formationDate),
      industry,
      hasEmployees: hasEmployees || false
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating business:', error);
    res.status(500).json({ message: 'Failed to create business' });
  }
});

// Get compliance events for a specific business
router.get('/mongoose/businesses/:businessId/events', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { businessId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify user owns the business
    const business = await Business.findOne({ _id: businessId, userId });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const events = await complianceMongooseService.getBusinessComplianceEvents(businessId);
    res.json(events);
  } catch (error) {
    console.error('Error fetching business events:', error);
    res.status(500).json({ message: 'Failed to fetch business events' });
  }
});

// Get all compliance events for a user
router.get('/mongoose/events', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const events = await complianceMongooseService.getUserComplianceEvents(userId);
    res.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Failed to fetch user events' });
  }
});

// Generate compliance events for a business
router.post('/mongoose/generate-events/:businessId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { businessId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify user owns the business
    const business = await Business.findOne({ _id: businessId, userId });
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const events = await complianceMongooseService.generateComplianceEvents(businessId);
    res.json({ message: `Generated ${events.length} compliance events`, events });
  } catch (error) {
    console.error('Error generating compliance events:', error);
    res.status(500).json({ message: 'Failed to generate compliance events' });
  }
});

// Update compliance event status
router.patch('/mongoose/events/:eventId/status', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { eventId } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!['Upcoming', 'Completed', 'Overdue'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Verify user owns the event through business ownership
    const event = await ComplianceEvent.findById(eventId).populate('businessId');
    if (!event || (event.businessId as any).userId.toString() !== userId) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await complianceMongooseService.updateEventStatus(eventId, status);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event status:', error);
    res.status(500).json({ message: 'Failed to update event status' });
  }
});

// Update compliance event details
router.patch('/mongoose/events/:eventId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { eventId } = req.params;
    const updates = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify user owns the event through business ownership
    const event = await ComplianceEvent.findById(eventId).populate('businessId');
    if (!event || (event.businessId as any).userId.toString() !== userId) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only allow updating certain fields
    const allowedUpdates = ['notes', 'filingLink', 'estimatedCost', 'priority'];
    const filteredUpdates: any = {};
    
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const updatedEvent = await ComplianceEvent.findByIdAndUpdate(
      eventId,
      filteredUpdates,
      { new: true }
    ).populate('businessId', 'legalName');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Get events needing reminders (admin only)
router.get('/mongoose/reminders', isAuthenticated, async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const events = await complianceMongooseService.getEventsNeedingReminders();
    res.json(events);
  } catch (error) {
    console.error('Error fetching reminder events:', error);
    res.status(500).json({ message: 'Failed to fetch reminder events' });
  }
});

// Mark reminder as sent (admin only)
router.post('/mongoose/reminders/:eventId/sent', isAuthenticated, async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { eventId } = req.params;
    await complianceMongooseService.markReminderSent(eventId);
    res.json({ message: 'Reminder marked as sent' });
  } catch (error) {
    console.error('Error marking reminder as sent:', error);
    res.status(500).json({ message: 'Failed to mark reminder as sent' });
  }
});

// Update overdue events (admin only)
router.post('/mongoose/update-overdue', isAuthenticated, async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const count = await complianceMongooseService.updateOverdueEvents();
    res.json({ message: `Updated ${count} events to overdue status`, count });
  } catch (error) {
    console.error('Error updating overdue events:', error);
    res.status(500).json({ message: 'Failed to update overdue events' });
  }
});

// Generate recurring events (admin only)
router.post('/mongoose/generate-recurring', isAuthenticated, async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await complianceMongooseService.generateRecurringEvents();
    res.json({ message: 'Recurring events generation completed' });
  } catch (error) {
    console.error('Error generating recurring events:', error);
    res.status(500).json({ message: 'Failed to generate recurring events' });
  }
});

// Get compliance statistics (admin only)
router.get('/mongoose/statistics', isAuthenticated, async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

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

    const statistics = {
      totalBusinesses,
      totalEvents,
      upcomingEvents,
      overdueEvents,
      completedEvents,
      eventsByState,
      eventsByEntityType
    };

    res.json(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// RESTful API routes for ComplianceEvents management

// POST /api/events - Create a new compliance event (Admin/System use)
router.post('/events', isAuthenticated, async (req: any, res) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.claims?.sub;

    // Only admins or system processes can create events directly
    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required to create events' });
    }

    const {
      businessId,
      title,
      description,
      category,
      eventType,
      dueDate,
      status = 'Upcoming',
      frequency = 'One-Time',
      filingLink,
      notes,
      priority = 'Medium',
      estimatedCost
    } = req.body;

    // Validate required fields
    if (!businessId || !title || !description || !category || !eventType || !dueDate) {
      return res.status(400).json({ 
        message: 'Missing required fields: businessId, title, description, category, eventType, dueDate' 
      });
    }

    // Verify business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Validate enum values
    const validCategories = ['Annual/Biennial', 'Tax-Related', 'Industry-Specific', 'Registered Agent Notice'];
    const validStatuses = ['Upcoming', 'Completed', 'Overdue'];
    const validFrequencies = ['One-Time', 'Annual', 'Quarterly', 'Monthly'];
    const validPriorities = ['High', 'Medium', 'Low'];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    if (!validFrequencies.includes(frequency)) {
      return res.status(400).json({ message: 'Invalid frequency' });
    }
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    const newEvent = new ComplianceEvent({
      businessId,
      title,
      description,
      category,
      eventType,
      dueDate: new Date(dueDate),
      status,
      frequency,
      filingLink,
      notes,
      priority,
      estimatedCost,
      remindersSent: 0
    });

    const savedEvent = await newEvent.save();
    const populatedEvent = await ComplianceEvent.findById(savedEvent._id).populate('businessId', 'legalName');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating compliance event:', error);
    res.status(500).json({ message: 'Failed to create compliance event' });
  }
});

// GET /api/events/business/:businessId - Get all compliance events for a specific business
router.get('/events/business/:businessId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { businessId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify user owns the business or is admin
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const userRole = req.user?.role;
    if (userRole !== 'admin' && business.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied - not your business' });
    }

    // Get query parameters for filtering and sorting
    const {
      status,
      category,
      priority,
      sortBy = 'dueDate',
      sortOrder = 'asc',
      limit,
      offset = 0
    } = req.query;

    // Build query
    let query: any = { businessId };

    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (priority) {
      query.priority = priority;
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    let eventsQuery = ComplianceEvent.find(query)
      .populate('businessId', 'legalName stateOfIncorporation entityType')
      .sort(sortObj)
      .skip(parseInt(offset as string) || 0);

    if (limit) {
      eventsQuery = eventsQuery.limit(parseInt(limit as string));
    }

    const events = await eventsQuery;

    // Get total count for pagination
    const totalCount = await ComplianceEvent.countDocuments(query);

    res.json({
      events,
      totalCount,
      hasMore: limit ? (parseInt(offset as string) || 0) + events.length < totalCount : false
    });
  } catch (error) {
    console.error('Error fetching business events:', error);
    res.status(500).json({ message: 'Failed to fetch business events' });
  }
});

// PUT /api/events/:eventId - Update an event (primarily for marking as completed)
router.put('/events/:eventId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { eventId } = req.params;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the event and populate business info
    const event = await ComplianceEvent.findById(eventId).populate('businessId');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify user owns the business or is admin
    const business = event.businessId as any;
    if (userRole !== 'admin' && business.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied - not your event' });
    }

    // Define allowed updates for regular users vs admins
    const {
      status,
      notes,
      filingLink,
      priority,
      estimatedCost,
      title,
      description,
      category,
      eventType,
      dueDate,
      frequency
    } = req.body;

    const updates: any = {
      updatedAt: new Date()
    };

    // Regular users can update these fields
    if (status !== undefined) {
      const validStatuses = ['Upcoming', 'Completed', 'Overdue'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      updates.status = status;
    }

    if (notes !== undefined) updates.notes = notes;
    if (filingLink !== undefined) updates.filingLink = filingLink;

    // Admins can update additional fields
    if (userRole === 'admin') {
      if (priority !== undefined) {
        const validPriorities = ['High', 'Medium', 'Low'];
        if (!validPriorities.includes(priority)) {
          return res.status(400).json({ message: 'Invalid priority' });
        }
        updates.priority = priority;
      }

      if (estimatedCost !== undefined) updates.estimatedCost = estimatedCost;
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;

      if (category !== undefined) {
        const validCategories = ['Annual/Biennial', 'Tax-Related', 'Industry-Specific', 'Registered Agent Notice'];
        if (!validCategories.includes(category)) {
          return res.status(400).json({ message: 'Invalid category' });
        }
        updates.category = category;
      }

      if (eventType !== undefined) updates.eventType = eventType;
      if (dueDate !== undefined) updates.dueDate = new Date(dueDate);

      if (frequency !== undefined) {
        const validFrequencies = ['One-Time', 'Annual', 'Quarterly', 'Monthly'];
        if (!validFrequencies.includes(frequency)) {
          return res.status(400).json({ message: 'Invalid frequency' });
        }
        updates.frequency = frequency;
      }
    }

    const updatedEvent = await ComplianceEvent.findByIdAndUpdate(
      eventId,
      updates,
      { new: true }
    ).populate('businessId', 'legalName stateOfIncorporation entityType');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// DELETE /api/events/:eventId - Delete an event (Admin or user for their own events)
router.delete('/events/:eventId', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user?.claims?.sub;
    const { eventId } = req.params;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the event and populate business info
    const event = await ComplianceEvent.findById(eventId).populate('businessId');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify user owns the business or is admin
    const business = event.businessId as any;
    if (userRole !== 'admin' && business.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied - not your event' });
    }

    // Store event details for response
    const deletedEventInfo = {
      id: event._id,
      title: event.title,
      businessName: business.legalName,
      status: event.status
    };

    await ComplianceEvent.findByIdAndDelete(eventId);

    res.json({
      message: 'Event deleted successfully',
      deletedEvent: deletedEventInfo
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

// Health check for MongoDB connection
router.get('/mongoose/health', async (req, res) => {
  try {
    const isConnected = mongoDb.getConnectionStatus();
    res.json({ 
      mongodb: isConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      mongodb: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export { router as complianceMongooseRouter };