# ParaFort Multi-Database Architecture Guide

## Overview
ParaFort uses a strategic multi-database architecture to optimize performance, ensure high availability, and prevent data conflicts. This system separates concerns across specialized databases while maintaining seamless operation.

## Database Structure

### 1. Main Database (Required)
- **Purpose**: Core business operations
- **Contains**: Users, business entities, subscriptions, authentication
- **Connection Pool**: 20 connections, 30s timeout
- **Environment**: `DATABASE_URL`

### 2. Analytics Database (Optional)
- **Purpose**: User behavior tracking, business metrics, reporting
- **Contains**: Activity logs, performance metrics, revenue analytics
- **Connection Pool**: 15 connections, 45s timeout
- **Environment**: `ANALYTICS_DATABASE_URL`
- **Fallback**: Uses main database if not configured

### 3. Documents Database (Optional)
- **Purpose**: Document storage, file metadata, version control
- **Contains**: Document records, file shares, AI processing results
- **Connection Pool**: 25 connections, 60s timeout
- **Environment**: `DOCUMENTS_DATABASE_URL`
- **Fallback**: Uses main database if not configured

### 4. Compliance Database (Optional)
- **Purpose**: Regulatory data, BOIR filings, audit trails
- **Contains**: Legal documents, compliance records, regulatory filings
- **Connection Pool**: 10 connections, 30s timeout
- **Environment**: `COMPLIANCE_DATABASE_URL`
- **Fallback**: Uses main database if not configured

### 5. Read Replica (Optional)
- **Purpose**: Read-heavy operations, reporting, dashboards
- **Contains**: Read-only copy of main database
- **Connection Pool**: 30 connections, 20s timeout
- **Environment**: `READ_REPLICA_DATABASE_URL`
- **Region**: US-West (for geographic distribution)
- **Fallback**: Uses main database if not configured

## Performance Benefits

### 1. Load Distribution
- **Write Operations**: Distributed across specialized databases
- **Read Operations**: Routed to read replica when available
- **Heavy Analytics**: Isolated to analytics database
- **Document Processing**: Handled by dedicated documents database

### 2. Conflict Prevention
- **Table Separation**: Different data types in different databases
- **Connection Isolation**: Separate connection pools prevent resource conflicts
- **Schema Independence**: Each database can evolve independently

### 3. High Availability
- **Failover Support**: Automatic fallback to main database
- **Geographic Distribution**: Read replica in different region
- **Health Monitoring**: Continuous database health checks
- **Connection Pooling**: Optimized for each database's workload

## Configuration Guide

### Environment Variables
```bash
# Required - Main database
DATABASE_URL=postgresql://user:pass@host:port/main_db

# Optional - Specialized databases
ANALYTICS_DATABASE_URL=postgresql://user:pass@host:port/analytics_db
DOCUMENTS_DATABASE_URL=postgresql://user:pass@host:port/documents_db
COMPLIANCE_DATABASE_URL=postgresql://user:pass@host:port/compliance_db

# Optional - Read replica (different region recommended)
READ_REPLICA_DATABASE_URL=postgresql://user:pass@host:port/main_db_replica
```

### Database Setup Examples

#### Single Database (Development)
```bash
# Only main database required
DATABASE_URL=postgresql://localhost:5432/parafort_dev
```

#### Production Setup
```bash
# Main database (US-East)
DATABASE_URL=postgresql://prod-main.company.com:5432/parafort_main

# Analytics database (optimized for aggregations)
ANALYTICS_DATABASE_URL=postgresql://prod-analytics.company.com:5432/parafort_analytics

# Documents database (optimized for large objects)
DOCUMENTS_DATABASE_URL=postgresql://prod-docs.company.com:5432/parafort_documents

# Compliance database (encrypted, audit-enabled)
COMPLIANCE_DATABASE_URL=postgresql://prod-compliance.company.com:5432/parafort_compliance

# Read replica (US-West)
READ_REPLICA_DATABASE_URL=postgresql://prod-read.company.com:5432/parafort_main_replica
```

## Smart Database Routing

### Automatic Routing Rules
```typescript
// Read operations → Read replica (if available)
const userData = await dbManager.getDbForOperation('read').select().from(users);

// Analytics data → Analytics database
const metrics = await dbManager.getDbForOperation('write', 'analytics').insert(businessMetrics);

// Document operations → Documents database
const documents = await dbManager.getDbForOperation('write', 'documents').insert(documentTable);

// Compliance data → Compliance database
const boirFiling = await dbManager.getDbForOperation('write', 'compliance').insert(complianceTable);
```

### Manual Database Selection
```typescript
// Direct database access
const mainData = await dbManager.main.select().from(users);
const analytics = await dbManager.analytics.select().from(userActivity);
const documents = await dbManager.documents.select().from(documentTable);
const compliance = await dbManager.compliance.select().from(complianceTable);
```

## Monitoring and Health Checks

### Health Check Endpoint
```bash
GET /api/health/databases
```

### Response Format
```json
{
  "main": true,
  "analytics": true,
  "documents": true,
  "compliance": true,
  "readReplica": false
}
```

### Connection Statistics
```bash
GET /api/health/connections
```

### Response Format
```json
{
  "main": {
    "totalConnections": 15,
    "idleConnections": 8,
    "waitingConnections": 0
  },
  "analytics": {
    "totalConnections": 5,
    "idleConnections": 3,
    "waitingConnections": 0
  }
}
```

## Migration Strategy

### Phase 1: Single Database (Current)
- All data in main database
- No configuration changes needed

### Phase 2: Add Analytics Database
1. Create analytics database
2. Set `ANALYTICS_DATABASE_URL`
3. Analytics data automatically routes to new database
4. Main database continues handling other data

### Phase 3: Add Specialized Databases
1. Create documents and compliance databases
2. Set respective environment variables
3. New data automatically routes to specialized databases
4. Existing data remains in main database

### Phase 4: Add Read Replica
1. Create read replica in different region
2. Set `READ_REPLICA_DATABASE_URL`
3. Read operations automatically route to replica
4. Write operations continue to main database

## Performance Optimization

### Connection Pool Tuning
- **Main DB**: 20 connections (balanced for mixed workload)
- **Analytics DB**: 15 connections (optimized for complex queries)
- **Documents DB**: 25 connections (high concurrency for file operations)
- **Compliance DB**: 10 connections (lower volume, secure operations)
- **Read Replica**: 30 connections (high read concurrency)

### Regional Distribution
- **Primary Databases**: US-East (low latency to main application)
- **Read Replica**: US-West (geographic distribution)
- **CDN Integration**: Document delivery optimization

### Caching Strategy
- **Application Cache**: Redis for session data
- **Database Cache**: Query result caching
- **CDN Cache**: Static document delivery

## Security Considerations

### Database Isolation
- Separate credentials for each database
- Network-level isolation where possible
- Encryption in transit and at rest

### Compliance Database
- Enhanced encryption requirements
- Audit logging enabled
- Restricted access controls
- Regular compliance reviews

### Access Control
- Role-based database access
- Least privilege principle
- Regular credential rotation

## Troubleshooting

### Common Issues

#### Database Connection Failures
1. Check environment variables
2. Verify network connectivity
3. Confirm database credentials
4. Review connection pool limits

#### Performance Issues
1. Monitor connection statistics
2. Check for connection pool exhaustion
3. Review query performance
4. Consider read replica utilization

#### Failover Scenarios
1. System automatically falls back to main database
2. Health checks identify failed databases
3. Application continues operating with reduced functionality
4. Alerts notify operations team

## Best Practices

### Development
- Use single database for local development
- Test with multiple databases in staging
- Monitor performance metrics regularly

### Production
- Enable all specialized databases for optimal performance
- Configure read replica in different region
- Set up comprehensive monitoring
- Regular database maintenance windows

### Scaling
- Add read replicas as traffic grows
- Consider database sharding for extreme scale
- Implement connection pooling optimization
- Monitor and adjust connection limits