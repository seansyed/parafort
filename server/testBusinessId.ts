import { businessEntities } from "@shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";

/**
 * Simple test function to create a business entity
 */
export async function createTestBusinessEntity(userId: string, businessName: string): Promise<any> {
  // Create business entity using Drizzle ORM
  const result = await db
    .insert(businessEntities)
    .values({
      userId: parseInt(userId, 10),
      name: businessName,
      entityType: 'LLC',
      state: 'CA',
      status: 'draft',
      createdAt: sql`NOW()`,
      updatedAt: sql`NOW()`
    })
    .returning();
  
  return result[0];
}