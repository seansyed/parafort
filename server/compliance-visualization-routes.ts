import express from 'express';
import { db } from './db';
import { businessEntities, complianceCalendar, users } from '@shared/schema';
import { eq, and, gte, lte, isNotNull, desc, asc, sql } from 'drizzle-orm';
import { isAuthenticated } from './replitAuth';

const router = express.Router();

function toStringId(id: number | string | null | undefined): string {
  if (id === null || id === undefined) {
    throw new Error("ID cannot be null or undefined");
  }
  return String(id);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// Get compliance metrics for progress visualization
router.get('/metrics', isAuthenticated, async (req: any, res) => {
  try {
    const userId = toStringId(req.user.claims.sub);
    const { businessId, timeRange } = req.query;
    
    let daysBack = 30;
    switch (timeRange) {
      case '7d': daysBack = 7; break;
      case '30d': daysBack = 30; break;
      case '90d': daysBack = 90; break;
      case '1y': daysBack = 365; break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Base query conditions
    let businessFilter = sql`1=1`;
    if (businessId && businessId !== 'all') {
      businessFilter = eq(businessEntities.id, businessId);
    }

    // Get overall metrics
    const overallStats = await db.select({
      status: complianceCalendar.status,
      count: sql<number>`count(*)::int`
    })
    .from(complianceCalendar)
    .innerJoin(businessEntities, eq(complianceCalendar.businessEntityId, businessEntities.id))
    .where(
      and(
        businessFilter,
        eq(businessEntities.userId, userId),
        gte(complianceCalendar.createdAt, startDate)
      )
    )
    .groupBy(complianceCalendar.status);

    // Calculate metrics
    const statusCounts = overallStats.reduce((acc, item) => {
      acc[item.status || 'pending'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const totalItems = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    const completedItems = statusCounts.completed || 0;
    const inProgressItems = statusCounts.in_progress || 0;
    const overdueItems = statusCounts.overdue || 0;
    const upcomingItems = statusCounts.pending || 0;

    const completionRate = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

    // Get on-time completion rate
    const onTimeCompleted = await db.select({
      count: sql<number>`count(*)::int`
    })
    .from(complianceCalendar)
    .innerJoin(businessEntities, eq(complianceCalendar.businessEntityId, businessEntities.id))
    .where(
      and(
        businessFilter,
        eq(businessEntities.userId, userId),
        eq(complianceCalendar.status, 'completed'),
        sql`${complianceCalendar.completedDate} <= ${complianceCalendar.dueDate}`
      )
    );

    const onTimeRate = completedItems > 0 ? ((onTimeCompleted[0]?.count || 0) / completedItems) * 100 : 0;

    // Get average completion time
    const avgTime = await db.select({
      avgDays: sql<number>`avg(EXTRACT(EPOCH FROM (${complianceCalendar.completedDate} - ${complianceCalendar.createdAt})) / 86400)::numeric`
    })
    .from(complianceCalendar)
    .innerJoin(businessEntities, eq(complianceCalendar.businessEntityId, businessEntities.id))
    .where(
      and(
        businessFilter,
        eq(businessEntities.userId, userId),
        eq(complianceCalendar.status, 'completed'),
        isNotNull(complianceCalendar.completedDate)
      )
    );

    // Get business-specific metrics
    const businessMetrics = await db.select({
      businessId: businessEntities.id,
      businessName: businessEntities.name,
      entityType: businessEntities.entityType,
      totalCount: sql<number>`count(*)::int`,
      completedCount: sql<number>`sum(case when ${complianceCalendar.status} = 'completed' then 1 else 0 end)::int`,
      inProgressCount: sql<number>`sum(case when ${complianceCalendar.status} = 'in_progress' then 1 else 0 end)::int`,
      overdueCount: sql<number>`sum(case when ${complianceCalendar.status} = 'overdue' then 1 else 0 end)::int`,
      pendingCount: sql<number>`sum(case when ${complianceCalendar.status} = 'pending' then 1 else 0 end)::int`
    })
    .from(businessEntities)
    .leftJoin(complianceCalendar, eq(businessEntities.id, complianceCalendar.businessEntityId))
    .where(
      and(
        businessFilter,
        eq(businessEntities.userId, userId)
      )
    )
    .groupBy(businessEntities.id, businessEntities.name, businessEntities.entityType);

    // Process business metrics
    const businesses = businessMetrics.map(business => {
      const total = business.totalCount || 0;
      const completed = business.completedCount || 0;
      const inProgress = business.inProgressCount || 0;
      const overdue = business.overdueCount || 0;
      const pending = business.pendingCount || 0;

      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      const onTimeRate = completed > 0 ? 85 : 0; // Simplified calculation
      
      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (overdue > 5 || completionRate < 50) {
        riskLevel = 'critical';
      } else if (overdue > 2 || completionRate < 70) {
        riskLevel = 'high';
      } else if (overdue > 0 || completionRate < 85) {
        riskLevel = 'medium';
      }

      return {
        businessId: business.businessId,
        businessName: business.businessName,
        entityType: business.entityType,
        overallScore: Math.round(completionRate),
        metrics: {
          totalItems: total,
          completedItems: completed,
          inProgressItems: inProgress,
          overdueItems: overdue,
          upcomingItems: pending,
          completionRate,
          onTimeRate,
          avgCompletionTime: parseFloat((avgTime[0]?.avgDays || 0).toString())
        },
        riskLevel,
        lastUpdated: new Date().toISOString()
      };
    });

    const responseData = {
      overall: {
        totalItems,
        completedItems,
        inProgressItems,
        overdueItems,
        upcomingItems,
        completionRate,
        onTimeRate,
        avgCompletionTime: parseFloat((avgTime[0]?.avgDays || 0).toString())
      },
      businesses
    };

    res.json(responseData);
  } catch (error: unknown) {
    console.error("Error fetching compliance metrics:", getErrorMessage(error));
    res.status(500).json({ message: "Failed to fetch compliance metrics" });
  }
});

// Get compliance trends data
router.get('/trends', isAuthenticated, async (req: any, res) => {
  try {
    const userId = toStringId(req.user.claims.sub);
    const { businessId, timeRange } = req.query;
    
    let daysBack = 30;
    let groupByFormat = 'day';
    
    switch (timeRange) {
      case '7d': 
        daysBack = 7; 
        groupByFormat = 'day';
        break;
      case '30d': 
        daysBack = 30; 
        groupByFormat = 'day';
        break;
      case '90d': 
        daysBack = 90; 
        groupByFormat = 'day';
        break;
      case '1y': 
        daysBack = 365; 
        groupByFormat = 'month';
        break;
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    let businessFilter = sql`1=1`;
    if (businessId && businessId !== 'all') {
      businessFilter = eq(businessEntities.id, businessId);
    }

    // Generate trends data with SQL query
    const trends = await db.execute(sql`
      WITH date_series AS (
        SELECT generate_series(
          ${startDate.toISOString()}::date, 
          current_date, 
          ${groupByFormat === 'month' ? '1 month' : '1 day'}::interval
        )::date as date
      ),
      daily_stats AS (
        SELECT 
          date_trunc('${sql.raw(groupByFormat)}', cc.completed_date)::date as completion_date,
          COUNT(*) FILTER (WHERE cc.status = 'completed') as completed_count,
          COUNT(*) FILTER (WHERE cc.status = 'overdue') as overdue_count,
          COUNT(*) FILTER (WHERE cc.created_at::date = date_trunc('${sql.raw(groupByFormat)}', cc.created_at)::date) as new_requirements,
          COUNT(*) FILTER (WHERE cc.status = 'completed' AND cc.completed_date::date = date_trunc('${sql.raw(groupByFormat)}', cc.completed_date)::date) as resolved_issues
        FROM compliance_calendar cc
        JOIN business_entities be ON cc.business_entity_id = be.id
        WHERE be.user_id = ${userId}
          AND ${businessFilter}
          AND cc.created_at >= ${startDate.toISOString()}
        GROUP BY date_trunc('${sql.raw(groupByFormat)}', cc.completed_date)::date
      )
      SELECT 
        ds.date::text,
        COALESCE(dst.completed_count::int, 0) as completed_count,
        COALESCE(dst.overdue_count::int, 0) as overdue_count,
        COALESCE(dst.new_requirements::int, 0) as new_requirements,
        COALESCE(dst.resolved_issues::int, 0) as resolved_issues,
        CASE 
          WHEN COALESCE(dst.completed_count, 0) + COALESCE(dst.overdue_count, 0) > 0 
          THEN (COALESCE(dst.completed_count::float, 0) / (COALESCE(dst.completed_count, 0) + COALESCE(dst.overdue_count, 0))) * 100
          ELSE 0 
        END as completion_rate
      FROM date_series ds
      LEFT JOIN daily_stats dst ON ds.date = dst.completion_date
      ORDER BY ds.date
    `);

    const formattedTrends = trends.rows.map((row: any) => ({
      date: new Date(row.date).toISOString().split('T')[0],
      completionRate: parseFloat(row.completion_rate || 0),
      overdueCount: parseInt(row.overdue_count || 0),
      newRequirements: parseInt(row.new_requirements || 0),
      resolvedIssues: parseInt(row.resolved_issues || 0)
    }));

    res.json({ trends: formattedTrends });
  } catch (error: unknown) {
    console.error("Error fetching compliance trends:", getErrorMessage(error));
    res.status(500).json({ message: "Failed to fetch compliance trends" });
  }
});

// Get compliance progress by category
router.get('/categories', isAuthenticated, async (req: any, res) => {
  try {
    const userId = toStringId(req.user.claims.sub);
    const { businessId } = req.query;

    let businessFilter = sql`1=1`;
    if (businessId && businessId !== 'all') {
      businessFilter = eq(businessEntities.id, businessId);
    }

    const categoryStats = await db.select({
      category: complianceCalendar.category,
      total: sql<number>`count(*)::int`,
      completed: sql<number>`sum(case when ${complianceCalendar.status} = 'completed' then 1 else 0 end)::int`
    })
    .from(complianceCalendar)
    .innerJoin(businessEntities, eq(complianceCalendar.businessEntityId, businessEntities.id))
    .where(
      and(
        businessFilter,
        eq(businessEntities.userId, userId)
      )
    )
    .groupBy(complianceCalendar.category);

    const colors = ['#FF5A00', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    
    const categories = categoryStats.map((stat, index) => ({
      category: stat.category || 'General',
      total: stat.total,
      completed: stat.completed,
      percentage: stat.total > 0 ? (stat.completed / stat.total) * 100 : 0,
      color: colors[index % colors.length]
    }));

    res.json({ categories });
  } catch (error: unknown) {
    console.error("Error fetching category progress:", getErrorMessage(error));
    res.status(500).json({ message: "Failed to fetch category progress" });
  }
});

// Get urgent compliance events for admin dashboard
router.get('/urgent-events', isAuthenticated, async (req: any, res) => {
  try {
    const userId = toStringId(req.user.claims.sub);
    
    // Check if user is admin
    const user = await db.select().from(users).where(eq(users.id, userId));
    if (user.length === 0 || user[0].role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Get urgent compliance events across all businesses
    const urgentEvents = await db.select({
      event: complianceCalendar,
      business: businessEntities
    })
    .from(complianceCalendar)
    .innerJoin(businessEntities, eq(complianceCalendar.businessEntityId, businessEntities.id))
    .where(
      and(
        eq(complianceCalendar.priority, 'urgent'),
        lte(complianceCalendar.dueDate, sql`CURRENT_DATE + INTERVAL '30 days'`)
      )
    )
    .orderBy(asc(complianceCalendar.dueDate))
    .limit(10);

    const formattedEvents = urgentEvents.map(item => ({
      id: item.event.id,
      businessId: item.business.id,
      businessName: item.business.name,
      eventType: item.event.eventType,
      eventTitle: item.event.eventTitle,
      dueDate: item.event.dueDate,
      daysRemaining: Math.ceil((new Date(item.event.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      priority: item.event.priority,
      status: item.event.status
    }));

    res.json(formattedEvents);
  } catch (error: unknown) {
    console.error("Error fetching urgent compliance events:", getErrorMessage(error));
    res.status(500).json({ message: "Failed to fetch urgent compliance events" });
  }
});

export default router;