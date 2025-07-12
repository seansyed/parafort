import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as mainSchema from "@shared/schema";
import * as analyticsSchema from "@shared/analyticsSchema";

neonConfig.webSocketConstructor = ws;

interface DatabaseConfig {
  url: string;
  maxConnections: number;
  idleTimeout: number;
  region: string;
  purpose: string;
}

interface DatabaseHealth {
  main: boolean;
  analytics: boolean;
  documents: boolean;
  compliance: boolean;
  readReplica: boolean;
}

class MultiDatabaseManager {
  private mainPool: Pool;
  private mainDb: any;
  
  private analyticsPool: Pool | null = null;
  private analyticsDb: any = null;
  
  private documentsPool: Pool | null = null;
  private documentsDb: any = null;
  
  private compliancePool: Pool | null = null;
  private complianceDb: any = null;
  
  private readReplicaPool: Pool | null = null;
  private readReplicaDb: any = null;
  
  private auditPool: Pool | null = null;
  private auditDb: any = null;
  
  private sessionPool: Pool | null = null;
  private sessionDb: any = null;
  
  private notificationPool: Pool | null = null;
  private notificationDb: any = null;
  
  private payrollPool: Pool | null = null;
  private payrollDb: any = null;
  
  private bookkeepingPool: Pool | null = null;
  private bookkeepingDb: any = null;
  
  private fileStoragePool: Pool | null = null;
  private fileStorageDb: any = null;

  constructor() {
    // Initialize properties first
    this.mainPool = null as any;
    this.mainDb = null as any;
    
    this.initializeDatabases();
  }

  private initializeDatabases() {
    // Main database - Always required
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be set for main database");
    }

    const mainConfig: DatabaseConfig = {
      url: process.env.DATABASE_URL,
      maxConnections: 20,
      idleTimeout: 30000,
      region: 'us-east',
      purpose: 'Core business operations'
    };

    this.mainPool = new Pool({
      connectionString: mainConfig.url,
      max: mainConfig.maxConnections,
      idleTimeoutMillis: mainConfig.idleTimeout
    });
    this.mainDb = drizzle({ client: this.mainPool, schema: mainSchema });

    // Analytics database - Optional
    if (process.env.ANALYTICS_DATABASE_URL) {
      const analyticsConfig: DatabaseConfig = {
        url: process.env.ANALYTICS_DATABASE_URL,
        maxConnections: 15,
        idleTimeout: 45000,
        region: 'us-east',
        purpose: 'Analytics and reporting'
      };

      this.analyticsPool = new Pool({
        connectionString: analyticsConfig.url,
        max: analyticsConfig.maxConnections,
        idleTimeoutMillis: analyticsConfig.idleTimeout
      });
      this.analyticsDb = drizzle({ client: this.analyticsPool, schema: analyticsSchema });
    } else {
      console.log('Analytics database not configured, using main database');
      this.analyticsDb = this.mainDb;
    }

    // Documents database - Optional
    if (process.env.DOCUMENTS_DATABASE_URL) {
      const documentsConfig: DatabaseConfig = {
        url: process.env.DOCUMENTS_DATABASE_URL,
        maxConnections: 25,
        idleTimeout: 60000,
        region: 'us-east',
        purpose: 'Document storage and metadata'
      };

      this.documentsPool = new Pool({
        connectionString: documentsConfig.url,
        max: documentsConfig.maxConnections,
        idleTimeoutMillis: documentsConfig.idleTimeout
      });
      this.documentsDb = drizzle({ client: this.documentsPool, schema: mainSchema });
    } else {
      console.log('Documents database not configured, using main database');
      this.documentsDb = this.mainDb;
    }

    // Compliance database - Optional
    if (process.env.COMPLIANCE_DATABASE_URL) {
      const complianceConfig: DatabaseConfig = {
        url: process.env.COMPLIANCE_DATABASE_URL,
        maxConnections: 10,
        idleTimeout: 30000,
        region: 'us-east',
        purpose: 'Compliance and regulatory data'
      };

      this.compliancePool = new Pool({
        connectionString: complianceConfig.url,
        max: complianceConfig.maxConnections,
        idleTimeoutMillis: complianceConfig.idleTimeout
      });
      this.complianceDb = drizzle({ client: this.compliancePool, schema: mainSchema });
    } else {
      console.log('Compliance database not configured, using main database');
      this.complianceDb = this.mainDb;
    }

    // Read replica - Optional
    if (process.env.READ_REPLICA_DATABASE_URL) {
      const readReplicaConfig: DatabaseConfig = {
        url: process.env.READ_REPLICA_DATABASE_URL,
        maxConnections: 30,
        idleTimeout: 20000,
        region: 'us-west',
        purpose: 'Read operations and reporting'
      };

      this.readReplicaPool = new Pool({
        connectionString: readReplicaConfig.url,
        max: readReplicaConfig.maxConnections,
        idleTimeoutMillis: readReplicaConfig.idleTimeout
      });
      this.readReplicaDb = drizzle({ client: this.readReplicaPool, schema: mainSchema });
    } else {
      console.log('Read replica not configured, using main database for reads');
      this.readReplicaDb = this.mainDb;
    }
  }

  // Database getters
  get main() {
    return this.mainDb;
  }

  get analytics() {
    return this.analyticsDb;
  }

  get documents() {
    return this.documentsDb;
  }

  get compliance() {
    return this.complianceDb;
  }

  get readReplica() {
    return this.readReplicaDb;
  }

  // Smart database routing
  getDbForOperation(operation: 'read' | 'write', dataType?: string) {
    if (operation === 'read' && this.readReplicaDb !== this.mainDb) {
      return this.readReplicaDb;
    }

    switch (dataType) {
      case 'analytics':
      case 'metrics':
      case 'reports':
        return this.analyticsDb;
      
      case 'documents':
      case 'files':
      case 'attachments':
        return this.documentsDb;
      
      case 'compliance':
      case 'regulatory':
      case 'boir':
        return this.complianceDb;
      
      default:
        return this.mainDb;
    }
  }

  // Health check for all databases
  async healthCheck(): Promise<DatabaseHealth> {
    const results: DatabaseHealth = {
      main: false,
      analytics: false,
      documents: false,
      compliance: false,
      readReplica: false
    };

    try {
      await this.mainPool.query('SELECT 1');
      results.main = true;
    } catch (error) {
      console.error('Main database health check failed:', error);
    }

    if (this.analyticsPool) {
      try {
        await this.analyticsPool.query('SELECT 1');
        results.analytics = true;
      } catch (error) {
        console.error('Analytics database health check failed:', error);
      }
    } else {
      results.analytics = true; // Using main DB
    }

    if (this.documentsPool) {
      try {
        await this.documentsPool.query('SELECT 1');
        results.documents = true;
      } catch (error) {
        console.error('Documents database health check failed:', error);
      }
    } else {
      results.documents = true; // Using main DB
    }

    if (this.compliancePool) {
      try {
        await this.compliancePool.query('SELECT 1');
        results.compliance = true;
      } catch (error) {
        console.error('Compliance database health check failed:', error);
      }
    } else {
      results.compliance = true; // Using main DB
    }

    if (this.readReplicaPool) {
      try {
        await this.readReplicaPool.query('SELECT 1');
        results.readReplica = true;
      } catch (error) {
        console.error('Read replica health check failed:', error);
      }
    } else {
      results.readReplica = true; // Using main DB
    }

    return results;
  }

  // Performance monitoring
  async getConnectionStats() {
    return {
      main: {
        totalConnections: this.mainPool.totalCount,
        idleConnections: this.mainPool.idleCount,
        waitingConnections: this.mainPool.waitingCount
      },
      analytics: this.analyticsPool ? {
        totalConnections: this.analyticsPool.totalCount,
        idleConnections: this.analyticsPool.idleCount,
        waitingConnections: this.analyticsPool.waitingCount
      } : null,
      documents: this.documentsPool ? {
        totalConnections: this.documentsPool.totalCount,
        idleConnections: this.documentsPool.idleCount,
        waitingConnections: this.documentsPool.waitingCount
      } : null,
      compliance: this.compliancePool ? {
        totalConnections: this.compliancePool.totalCount,
        idleConnections: this.compliancePool.idleCount,
        waitingConnections: this.compliancePool.waitingCount
      } : null,
      readReplica: this.readReplicaPool ? {
        totalConnections: this.readReplicaPool.totalCount,
        idleConnections: this.readReplicaPool.idleCount,
        waitingConnections: this.readReplicaPool.waitingCount
      } : null
    };
  }

  // Transaction support across multiple databases
  async executeDistributedTransaction(operations: Array<{
    database: 'main' | 'analytics' | 'documents' | 'compliance';
    operation: () => Promise<any>;
  }>) {
    const results = [];
    const rollbackOperations = [];

    try {
      for (const { database, operation } of operations) {
        const db = this[database];
        const result = await operation();
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Distributed transaction failed:', error);
      throw error;
    }
  }

  // Graceful shutdown
  async closeAll() {
    const promises = [];

    promises.push(this.mainPool.end());
    
    if (this.analyticsPool) promises.push(this.analyticsPool.end());
    if (this.documentsPool) promises.push(this.documentsPool.end());
    if (this.compliancePool) promises.push(this.compliancePool.end());
    if (this.readReplicaPool) promises.push(this.readReplicaPool.end());

    await Promise.all(promises);
    console.log('All database connections closed');
  }

  // Failover support
  async switchToBackup(primaryDb: string) {
    console.log(`Switching ${primaryDb} to backup connection`);
    // Implementation would depend on backup database URLs
    // This is a placeholder for failover logic
  }
}

// Create and export singleton instance
export const dbManager = new MultiDatabaseManager();

// Export individual database connections for backward compatibility
export const db = dbManager.main;
export const analyticsDb = dbManager.analytics;
export const documentsDb = dbManager.documents;
export const complianceDb = dbManager.compliance;
export const readReplicaDb = dbManager.readReplica;