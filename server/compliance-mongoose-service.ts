import { Business, ComplianceEvent, complianceTemplates, IBusiness, IComplianceEvent } from '../shared/mongoose-schemas';
import { Types } from 'mongoose';
import { addDays, addMonths, addYears, format, isAfter, isBefore, parseISO } from 'date-fns';

export class ComplianceMongooseService {
  
  /**
   * Generate compliance events for a business based on state-specific templates
   */
  async generateComplianceEvents(businessId: string): Promise<IComplianceEvent[]> {
    try {
      const business = await Business.findById(businessId);
      if (!business) {
        throw new Error('Business not found');
      }

      // Find applicable templates
      const templates = complianceTemplates.filter(
        template => template.state === business.stateOfIncorporation && 
                   template.entityType === business.entityType
      );

      if (templates.length === 0) {
        console.log(`No compliance templates found for ${business.entityType} in ${business.stateOfIncorporation}`);
        return [];
      }

      const generatedEvents: IComplianceEvent[] = [];
      const currentYear = new Date().getFullYear();

      for (const template of templates) {
        for (const eventTemplate of template.events) {
          // Calculate due date based on template
          let dueDate: Date;
          
          if (eventTemplate.daysFromFormation) {
            // Event due X days from formation
            dueDate = addDays(business.formationDate, eventTemplate.daysFromFormation);
          } else if (eventTemplate.monthDue && eventTemplate.dayDue) {
            // Annual event due on specific month/day
            dueDate = new Date(currentYear, eventTemplate.monthDue - 1, eventTemplate.dayDue);
            
            // If the date has passed this year, schedule for next year
            if (isBefore(dueDate, new Date())) {
              dueDate = new Date(currentYear + 1, eventTemplate.monthDue - 1, eventTemplate.dayDue);
            }
          } else {
            // Default to 1 year from formation
            dueDate = addYears(business.formationDate, 1);
          }

          // Check if event already exists
          const existingEvent = await ComplianceEvent.findOne({
            businessId: new Types.ObjectId(businessId),
            eventType: eventTemplate.eventType,
            dueDate: {
              $gte: new Date(dueDate.getFullYear(), 0, 1),
              $lt: new Date(dueDate.getFullYear() + 1, 0, 1)
            }
          });

          if (!existingEvent) {
            const newEvent = new ComplianceEvent({
              businessId: new Types.ObjectId(businessId),
              title: eventTemplate.title,
              description: eventTemplate.description,
              category: eventTemplate.category,
              eventType: eventTemplate.eventType,
              dueDate,
              frequency: eventTemplate.frequency,
              priority: eventTemplate.priority,
              estimatedCost: eventTemplate.estimatedCost,
              filingLink: eventTemplate.filingLink,
              status: isAfter(dueDate, new Date()) ? 'Upcoming' : 'Overdue'
            });

            const savedEvent = await newEvent.save();
            generatedEvents.push(savedEvent);
          }
        }
      }

      console.log(`Generated ${generatedEvents.length} compliance events for business ${businessId}`);
      return generatedEvents;
    } catch (error) {
      console.error('Error generating compliance events:', error);
      throw error;
    }
  }

  /**
   * Get all compliance events for a business
   */
  async getBusinessComplianceEvents(businessId: string): Promise<IComplianceEvent[]> {
    try {
      const events = await ComplianceEvent.find({
        businessId: new Types.ObjectId(businessId)
      }).sort({ dueDate: 1 });

      return events;
    } catch (error) {
      console.error('Error fetching business compliance events:', error);
      throw error;
    }
  }

  /**
   * Get all compliance events for a user across all their businesses
   */
  async getUserComplianceEvents(userId: string): Promise<IComplianceEvent[]> {
    try {
      // First get all businesses for the user
      const businesses = await Business.find({ userId: new Types.ObjectId(userId) });
      const businessIds = businesses.map(b => b._id);

      // Then get all compliance events for those businesses
      const events = await ComplianceEvent.find({
        businessId: { $in: businessIds }
      })
      .populate('businessId', 'legalName stateOfIncorporation entityType')
      .sort({ dueDate: 1 });

      return events;
    } catch (error) {
      console.error('Error fetching user compliance events:', error);
      throw error;
    }
  }

  /**
   * Update compliance event status
   */
  async updateEventStatus(eventId: string, status: 'Upcoming' | 'Completed' | 'Overdue'): Promise<IComplianceEvent | null> {
    try {
      const event = await ComplianceEvent.findByIdAndUpdate(
        eventId,
        { status },
        { new: true }
      ).populate('businessId', 'legalName');

      return event;
    } catch (error) {
      console.error('Error updating event status:', error);
      throw error;
    }
  }

  /**
   * Get events that need reminders
   */
  async getEventsNeedingReminders(): Promise<IComplianceEvent[]> {
    try {
      const now = new Date();
      const in30Days = addDays(now, 30);
      const in14Days = addDays(now, 14);
      const in7Days = addDays(now, 7);
      const in1Day = addDays(now, 1);

      // Find events that are due soon and haven't been reminded recently
      const events = await ComplianceEvent.find({
        status: 'Upcoming',
        dueDate: {
          $gte: now,
          $lte: in30Days
        },
        $or: [
          { lastReminderSent: { $exists: false } },
          { lastReminderSent: null },
          {
            $and: [
              { dueDate: { $lte: in1Day } },
              { lastReminderSent: { $lt: addDays(now, -1) } }
            ]
          },
          {
            $and: [
              { dueDate: { $lte: in7Days, $gt: in1Day } },
              { lastReminderSent: { $lt: addDays(now, -3) } }
            ]
          },
          {
            $and: [
              { dueDate: { $lte: in14Days, $gt: in7Days } },
              { lastReminderSent: { $lt: addDays(now, -7) } }
            ]
          },
          {
            $and: [
              { dueDate: { $lte: in30Days, $gt: in14Days } },
              { lastReminderSent: { $lt: addDays(now, -14) } }
            ]
          }
        ]
      })
      .populate('businessId', 'legalName userId')
      .sort({ dueDate: 1 });

      return events;
    } catch (error) {
      console.error('Error fetching events needing reminders:', error);
      throw error;
    }
  }

  /**
   * Mark reminder as sent for an event
   */
  async markReminderSent(eventId: string): Promise<void> {
    try {
      await ComplianceEvent.findByIdAndUpdate(eventId, {
        lastReminderSent: new Date(),
        $inc: { remindersSent: 1 }
      });
    } catch (error) {
      console.error('Error marking reminder as sent:', error);
      throw error;
    }
  }

  /**
   * Update overdue events
   */
  async updateOverdueEvents(): Promise<number> {
    try {
      const now = new Date();
      
      const result = await ComplianceEvent.updateMany(
        {
          status: 'Upcoming',
          dueDate: { $lt: now }
        },
        {
          status: 'Overdue'
        }
      );

      console.log(`Updated ${result.modifiedCount} events to overdue status`);
      return result.modifiedCount;
    } catch (error) {
      console.error('Error updating overdue events:', error);
      throw error;
    }
  }

  /**
   * Create a new business and generate compliance events
   */
  async createBusinessWithCompliance(businessData: {
    userId: string;
    legalName: string;
    stateOfIncorporation: string;
    entityType: 'LLC' | 'S-Corp' | 'C-Corp' | 'Sole Proprietorship';
    formationDate: Date;
    industry: string;
    hasEmployees?: boolean;
  }): Promise<{ business: IBusiness; events: IComplianceEvent[] }> {
    try {
      // Create business
      const business = new Business({
        userId: new Types.ObjectId(businessData.userId),
        legalName: businessData.legalName,
        stateOfIncorporation: businessData.stateOfIncorporation.toUpperCase(),
        entityType: businessData.entityType,
        formationDate: businessData.formationDate,
        industry: businessData.industry,
        hasEmployees: businessData.hasEmployees || false
      });

      const savedBusiness = await business.save();

      // Generate compliance events
      const events = await this.generateComplianceEvents(savedBusiness._id.toString());

      return { business: savedBusiness, events };
    } catch (error) {
      console.error('Error creating business with compliance:', error);
      throw error;
    }
  }

  /**
   * Get compliance dashboard data for a user
   */
  async getComplianceDashboardData(userId: string) {
    try {
      const businesses = await Business.find({ userId: new Types.ObjectId(userId) });
      const businessIds = businesses.map(b => b._id);

      const events = await ComplianceEvent.find({
        businessId: { $in: businessIds }
      }).populate('businessId', 'legalName');

      const now = new Date();
      const in30Days = addDays(now, 30);

      const dashboard = {
        totalBusinesses: businesses.length,
        totalEvents: events.length,
        upcomingEvents: events.filter(e => e.status === 'Upcoming').length,
        overdueEvents: events.filter(e => e.status === 'Overdue').length,
        completedEvents: events.filter(e => e.status === 'Completed').length,
        eventsNext30Days: events.filter(e => 
          e.status === 'Upcoming' && 
          isAfter(e.dueDate, now) && 
          isBefore(e.dueDate, in30Days)
        ).length,
        recentEvents: events
          .filter(e => e.status === 'Upcoming')
          .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
          .slice(0, 5),
        businesses: businesses.map(b => ({
          _id: b._id,
          legalName: b.legalName,
          stateOfIncorporation: b.stateOfIncorporation,
          entityType: b.entityType,
          eventsCount: events.filter(e => e.businessId._id.toString() === b._id.toString()).length
        }))
      };

      return dashboard;
    } catch (error) {
      console.error('Error fetching compliance dashboard data:', error);
      throw error;
    }
  }

  /**
   * Generate recurring events (run periodically)
   */
  async generateRecurringEvents(): Promise<void> {
    try {
      const currentYear = new Date().getFullYear();
      const businesses = await Business.find();

      for (const business of businesses) {
        // Find events that should recur
        const recurringEvents = await ComplianceEvent.find({
          businessId: business._id,
          frequency: { $in: ['Annual', 'Quarterly', 'Monthly'] },
          status: 'Completed'
        });

        for (const event of recurringEvents) {
          let nextDueDate: Date;
          
          switch (event.frequency) {
            case 'Annual':
              nextDueDate = addYears(event.dueDate, 1);
              break;
            case 'Quarterly':
              nextDueDate = addMonths(event.dueDate, 3);
              break;
            case 'Monthly':
              nextDueDate = addMonths(event.dueDate, 1);
              break;
            default:
              continue;
          }

          // Check if next occurrence already exists
          const existingNext = await ComplianceEvent.findOne({
            businessId: business._id,
            eventType: event.eventType,
            dueDate: nextDueDate
          });

          if (!existingNext && isAfter(nextDueDate, new Date())) {
            const newEvent = new ComplianceEvent({
              businessId: business._id,
              title: event.title,
              description: event.description,
              category: event.category,
              eventType: event.eventType,
              dueDate: nextDueDate,
              frequency: event.frequency,
              priority: event.priority,
              estimatedCost: event.estimatedCost,
              filingLink: event.filingLink,
              status: 'Upcoming'
            });

            await newEvent.save();
            console.log(`Generated recurring event: ${event.title} for ${business.legalName}`);
          }
        }
      }
    } catch (error) {
      console.error('Error generating recurring events:', error);
      throw error;
    }
  }
}

export const complianceMongooseService = new ComplianceMongooseService();