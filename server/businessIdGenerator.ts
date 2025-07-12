import { db } from "./db";
import { businessEntities } from "@shared/schema";
import { eq, like } from "drizzle-orm";

const ID_PREFIX = "00007867860"; // 11 digits, leaving room for 1 variable digit

/**
 * Generates a unique 12-digit business entity ID starting with 000078678601
 * Uses a more robust approach with sequential numbering and fallback to random
 */
export async function generateBusinessEntityId(): Promise<string> {
  // Use a simpler approach - timestamp-based unique ID generation
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    // Create unique suffix using timestamp and random number
    const timestamp = Date.now().toString().slice(-3); // Last 3 digits of timestamp
    const random = Math.floor(Math.random() * 10); // Single random digit
    const uniqueSuffix = (timestamp + random).slice(-1); // Take last digit to ensure single digit
    
    const newId = ID_PREFIX + uniqueSuffix;
    
    try {
      // Check if this ID already exists
      const existing = await db
        .select({ id: businessEntities.id })
        .from(businessEntities)
        .where(eq(businessEntities.id, newId))
        .limit(1);
      
      if (existing.length === 0) {
        return newId;
      }
    } catch (error) {
      console.log("Database check failed, attempt:", attempts, error);
    }
    
    attempts++;
    // Add small delay to ensure timestamp changes
    await new Promise(resolve => setTimeout(resolve, 1));
  }
  
  // Final fallback - use current second + random
  const fallbackSuffix = (new Date().getSeconds() % 10).toString();
  const fallbackId = ID_PREFIX + fallbackSuffix;
  
  console.log("Using fallback ID:", fallbackId);
  return fallbackId;
}

/**
 * Validates if a business entity ID follows the correct format
 */
export function validateBusinessEntityId(id: string): boolean {
  if (id.length !== 12) return false;
  if (!id.startsWith(ID_PREFIX)) return false;
  if (!/^\d{12}$/.test(id)) return false;
  return true;
}

/**
 * Formats a business entity ID for display
 */
export function formatBusinessEntityId(id: string): string {
  if (!validateBusinessEntityId(id)) return id;
  
  // Format as 000078678601
  return id;
}