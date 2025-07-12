import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as mainSchema from "@shared/schema";
import * as analyticsSchema from "@shared/analyticsSchema";

neonConfig.webSocketConstructor = ws;

// Database connection configuration
interface DatabaseConfig {
  url: string;
  maxConnections?: number;
  idleTimeout?: number;
  region?: string;
}

// Main database for core business data
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const mainConfig: DatabaseConfig = {
  url: process.env.DATABASE_URL,
  maxConnections: 20,
  idleTimeout: 30000,
  region: 'us-east'
};

export const mainPool = new Pool({ 
  connectionString: mainConfig.url,
  max: mainConfig.maxConnections,
  idleTimeoutMillis: mainConfig.idleTimeout
});
export const mainDb = drizzle({ client: mainPool, schema: mainSchema });

// Analytics database for reporting and analytics
let analyticsDb: any = null;
let analyticsPool: Pool | null = null;

const analyticsConfig: DatabaseConfig = {
  url: process.env.ANALYTICS_DATABASE_URL || process.env.DATABASE_URL,
  maxConnections: 15,
  idleTimeout: 45000,
  region: 'us-east'
};

if (process.env.ANALYTICS_DATABASE_URL) {
  analyticsPool = new Pool({ 
    connectionString: analyticsConfig.url,
    max: analyticsConfig.maxConnections,
    idleTimeoutMillis: analyticsConfig.idleTimeout
  });
  analyticsDb = drizzle({ client: analyticsPool, schema: analyticsSchema });
} else {
  console.log('Analytics database URL not configured, using main database');
  analyticsDb = mainDb;
}

// Document storage database for large file metadata
let documentsDb: any = null;
let documentsPool: Pool | null = null;

const documentsConfig: DatabaseConfig = {
  url: process.env.DOCUMENTS_DATABASE_URL || process.env.DATABASE_URL,
  maxConnections: 25,
  idleTimeout: 60000,
  region: 'us-east'
};

if (process.env.DOCUMENTS_DATABASE_URL) {
  documentsPool = new Pool({ 
    connectionString: documentsConfig.url,
    max: documentsConfig.maxConnections,
    idleTimeoutMillis: documentsConfig.idleTimeout
  });
  documentsDb = drizzle({ client: documentsPool, schema: mainSchema });
} else {
  console.log('Documents database URL not configured, using main database');
  documentsDb = mainDb;
}

// Compliance database for regulatory data
let complianceDb: any = null;
let compliancePool: Pool | null = null;

const complianceConfig: DatabaseConfig = {
  url: process.env.COMPLIANCE_DATABASE_URL || process.env.DATABASE_URL,
  maxConnections: 10,
  idleTimeout: 30000,
  region: 'us-east'
};

if (process.env.COMPLIANCE_DATABASE_URL) {
  compliancePool = new Pool({ 
    connectionString: complianceConfig.url,
    max: complianceConfig.maxConnections,
    idleTimeoutMillis: complianceConfig.idleTimeout
  });
  complianceDb = drizzle({ client: compliancePool, schema: mainSchema });
} else {
  console.log('Compliance database URL not configured, using main database');
  complianceDb = mainDb;
}

// Read replica for performance optimization
let readReplicaDbMain: any = null;
let readReplicaPoolMain: Pool | null = null;

const readReplicaConfig: DatabaseConfig = {
  url: process.env.READ_REPLICA_DATABASE_URL || process.env.DATABASE_URL,
  maxConnections: 30,
  idleTimeout: 20000,
  region: 'us-west'
};

if (process.env.READ_REPLICA_DATABASE_URL) {
  readReplicaPoolMain = new Pool({ 
    connectionString: readReplicaConfig.url,
    max: readReplicaConfig.maxConnections,
    idleTimeoutMillis: readReplicaConfig.idleTimeout
  });
  readReplicaDbMain = drizzle({ client: readReplicaPoolMain, schema: mainSchema });
} else {
  console.log('Read replica URL not configured, using main database for reads');
  readReplicaDbMain = mainDb;
}

// Database connection manager
export class DatabaseManager {
  // Main database (always available)
  get main() {
    return mainDb;
  }

  // Analytics database (optional)
  get analytics() {
    if (!analyticsDb) {
      console.warn('Analytics database not configured, falling back to main database');
      return mainDb;
    }
    return analyticsDb;
  }

  // Documents database (optional)
  get documents() {
    if (!documentsDb) {
      console.warn('Documents database not configured, falling back to main database');
      return mainDb;
    }
    return documentsDb;
  }

  // Compliance database (optional)
  get compliance() {
    if (!complianceDb) {
      console.warn('Compliance database not configured, falling back to main database');
      return mainDb;
    }
    return complianceDb;
  }

  // Health check for all databases
  async healthCheck() {
    const results = {
      main: false,
      analytics: false,
      documents: false,
      audit: false
    };

    try {
      await mainPool.query('SELECT 1');
      results.main = true;
    } catch (error) {
      console.error('Main database health check failed:', error);
    }

    if (analyticsPool) {
      try {
        await analyticsPool.query('SELECT 1');
        results.analytics = true;
      } catch (error) {
        console.error('Analytics database health check failed:', error);
      }
    }

    if (documentsPool) {
      try {
        await documentsPool.query('SELECT 1');
        results.documents = true;
      } catch (error) {
        console.error('Documents database health check failed:', error);
      }
    }

    if (auditPool) {
      try {
        await auditPool.query('SELECT 1');
        results.audit = true;
      } catch (error) {
        console.error('Audit database health check failed:', error);
      }
    }

    return results;
  }

  // Close all database connections
  async closeAll() {
    const promises = [];

    promises.push(mainPool.end());
    
    if (analyticsPool) promises.push(analyticsPool.end());
    if (documentsPool) promises.push(documentsPool.end());
    if (auditPool) promises.push(auditPool.end());

    await Promise.all(promises);
  }

  // Transaction across multiple databases (if needed)
  async executeDistributedTransaction(operations: Array<{
    database: 'main' | 'analytics' | 'documents' | 'audit';
    operation: () => Promise<any>;
  }>) {
    const results = [];
    const rollbackOperations = [];

    try {
      for (const { database, operation } of operations) {
        const db = this[database];
        const result = await operation();
        results.push(result);
        // Store rollback operation if needed
      }
      return results;
    } catch (error) {
      // Attempt to rollback completed operations
      console.error('Distributed transaction failed, attempting rollback:', error);
      // Implement rollback logic if needed
      throw error;
    }
  }
}

export const dbManager = new DatabaseManager();

// Export individual databases for direct access
export { mainDb as db }; // Keep existing db export for compatibility
export { analyticsDb, documentsDb, auditDb };

// Database routing based on data type
export function getDbForDataType(dataType: string) {
  switch (dataType) {
    case 'analytics':
    case 'metrics':
    case 'reports':
      return dbManager.analytics;
    
    case 'documents':
    case 'files':
    case 'attachments':
      return dbManager.documents;
    
    case 'audit':
    case 'logs':
    case 'security':
      return dbManager.audit;
    
    default:
      return dbManager.main;
  }
}

// Read replica configuration (if available)
let readReplicaDb: any = null;
let readReplicaPool: Pool | null = null;

if (process.env.READ_REPLICA_DATABASE_URL) {
  readReplicaPool = new Pool({ connectionString: process.env.READ_REPLICA_DATABASE_URL });
  readReplicaDb = drizzle({ client: readReplicaPool, schema: mainSchema });
}

// Smart database selection for read operations
export function getReadDb() {
  // Use read replica for read operations if available
  if (readReplicaDb) {
    return readReplicaDb;
  }
  // Fall back to main database
  return mainDb;
}

// Write operations always go to main database
export function getWriteDb() {
  return mainDb;
}