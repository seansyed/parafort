import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { userSubscriptions, formationOrders, users } from './shared/schema.js';
import { eq, and } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const sql = postgres(connectionString);
const db = drizzle(sql);

async function fixMissingSubscriptions() {
  try {
    console.log('Searching for formation orders with subscription plans but no user subscriptions...');
    
    // Get all formation orders with subscription plan IDs
    const orders = await db
      .select()
      .from(formationOrders)
      .where(and(
        // Has a subscription plan ID
        sql`${formationOrders.formData}::jsonb->>'subscriptionPlanId' IS NOT NULL`,
        // Has a user ID
        sql`${formationOrders.userId} IS NOT NULL`
      ));
    
    console.log(`Found ${orders.length} formation orders with subscription plans`);
    
    for (const order of orders) {
      try {
        // Parse form data to get subscription plan ID
        const formData = typeof order.formData === 'string' ? JSON.parse(order.formData) : order.formData;
        const subscriptionPlanId = formData.subscriptionPlanId || formData.planId;
        
        if (!subscriptionPlanId) {
          console.log(`Order ${order.orderId} has no subscription plan ID in form data`);
          continue;
        }
        
        console.log(`\nProcessing order ${order.orderId}:`);
        console.log(`- User ID: ${order.userId}`);
        console.log(`- Subscription Plan ID: ${subscriptionPlanId}`);
        console.log(`- Business: ${order.businessName}`);
        
        // Check if user already has this subscription
        const existingSubscription = await db
          .select()
          .from(userSubscriptions)
          .where(and(
            eq(userSubscriptions.userId, order.userId),
            eq(userSubscriptions.planId, parseInt(subscriptionPlanId)),
            eq(userSubscriptions.status, 'active')
          ))
          .limit(1);
        
        if (existingSubscription.length > 0) {
          console.log(`✓ User already has active subscription for plan ${subscriptionPlanId}`);
          continue;
        }
        
        // Create the missing subscription
        const [newSubscription] = await db
          .insert(userSubscriptions)
          .values({
            userId: order.userId,
            planId: parseInt(subscriptionPlanId),
            status: 'active',
            startDate: order.createdAt,
            autoRenew: true,
            createdAt: order.createdAt,
            updatedAt: new Date()
          })
          .returning();
        
        console.log(`✅ Created subscription ${newSubscription.id} for user ${order.userId}`);
        
      } catch (error) {
        console.error(`Error processing order ${order.orderId}:`, error);
      }
    }
    
    console.log('\nSubscription fix complete!');
    
  } catch (error) {
    console.error('Error fixing subscriptions:', error);
  } finally {
    await sql.end();
  }
}

// Run the fix
fixMissingSubscriptions();