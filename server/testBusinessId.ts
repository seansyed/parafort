import { db } from "./db";
import { businessEntities } from "@shared/schema";

const ID_PREFIX = "000078678601";

/**
 * Simple test function to create a business entity with 12-digit ID
 */
export async function createTestBusinessEntity(userId: string, businessName: string): Promise<any> {
  // Generate unique 12-digit ID
  let attempts = 0;
  let newId = "";
  
  while (attempts < 10) {
    const lastDigit = Math.floor(Math.random() * 10);
    newId = ID_PREFIX + lastDigit;
    
    // Check if ID exists
    const existing = await db
      .select()
      .from(businessEntities)
      .where(`id = '${newId}'`);
    
    if (existing.length === 0) {
      break;
    }
    attempts++;
  }
  
  if (attempts >= 10) {
    throw new Error("Could not generate unique ID");
  }
  
  // Create business entity with raw SQL to avoid type issues
  const result = await db.execute(`
    INSERT INTO business_entities (id, user_id, name, entity_type, state, status, created_at, updated_at)
    VALUES ('${newId}', '${userId}', '${businessName}', 'LLC', 'CA', 'draft', NOW(), NOW())
    RETURNING *
  `);
  
  return {
    id: newId,
    userId,
    name: businessName,
    entityType: 'LLC',
    state: 'CA',
    status: 'draft'
  };
}