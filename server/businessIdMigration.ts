import { db } from "./db";
import { businessEntities, userMailboxSubscriptions } from "@shared/schema";
import { eq } from "drizzle-orm";

const ID_PREFIX = "00007867860"; // 11 digits, leaving room for 1 variable digit

/**
 * Migration utility to handle the transition from integer IDs to 12-digit string IDs
 */
export class BusinessIdMigration {
  
  /**
   * Generates a unique 12-digit business entity ID starting with 000078678601
   */
  async generateBusinessEntityId(): Promise<string> {
    // Import and use the improved ID generation function
    const { generateBusinessEntityId } = await import('./businessIdGenerator');
    return await generateBusinessEntityId();
  }

  /**
   * Creates a new business entity with 12-digit ID
   */
  async createNewBusinessEntity(entityData: any, userId: string): Promise<any> {
    const id = await this.generateBusinessEntityId();
    
    const [newEntity] = await db
      .insert(businessEntities)
      .values({ 
        ...entityData, 
        id,
        userId 
      })
      .returning();
    
    return newEntity;
  }

  /**
   * Gets business entity by ID (handles both old integer and new string formats)
   */
  async getBusinessEntity(id: string | number, userId: string): Promise<any> {
    const searchId = typeof id === 'number' ? id.toString() : id;
    
    const [entity] = await db
      .select()
      .from(businessEntities)
      .where(eq(businessEntities.id, searchId))
      .limit(1);
    
    // Verify ownership if entity found
    if (entity && entity.userId !== userId) {
      return undefined;
    }
    
    return entity;
  }

  /**
   * Updates business entity by ID (handles both old integer and new string formats)
   */
  async updateBusinessEntity(id: string | number, userId: string, updates: any): Promise<any> {
    const searchId = typeof id === 'number' ? id.toString() : id;
    
    // First verify ownership
    const existing = await this.getBusinessEntity(searchId, userId);
    if (!existing) {
      return undefined;
    }
    
    const [updatedEntity] = await db
      .update(businessEntities)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(businessEntities.id, searchId))
      .returning();
    
    return updatedEntity;
  }

  /**
   * Migrates mailbox subscription to use new business entity ID format
   */
  async linkMailboxToBusinessEntity(businessEntityId: string, subscriptionId: number): Promise<void> {
    await db
      .update(userMailboxSubscriptions)
      .set({ businessEntityId })
      .where(eq(userMailboxSubscriptions.id, subscriptionId));
  }

  /**
   * Validates if a business entity ID follows the correct 12-digit format
   */
  validateBusinessEntityId(id: string): boolean {
    if (id.length !== 12) return false;
    if (!id.startsWith(ID_PREFIX)) return false;
    if (!/^\d{12}$/.test(id)) return false;
    return true;
  }

  /**
   * Formats a business entity ID for display
   */
  formatBusinessEntityId(id: string): string {
    if (!this.validateBusinessEntityId(id)) return id;
    
    // Format as 000078678601 (already in correct format)
    return id;
  }
}

export const businessIdMigration = new BusinessIdMigration();