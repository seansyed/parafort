import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const services = [
  { id: 1, name: 'Business Formation', description: 'Complete business formation services including LLC and Corporation setup', category: 'formation', oneTimePrice: '299.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: true, sortOrder: 1 },
  { id: 2, name: 'EIN Application', description: 'Federal Tax ID (EIN) application service', category: 'tax', oneTimePrice: '99.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 2 },
  { id: 3, name: 'Registered Agent', description: 'Professional registered agent service', category: 'compliance', oneTimePrice: '149.00', recurringPrice: '149.00', recurringInterval: 'yearly', isActive: true, isPopular: false, sortOrder: 3 },
  { id: 5, name: 'Annual Report Filing', description: 'Annual report filing service for business compliance', category: 'compliance', oneTimePrice: '199.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 5 },
  { id: 6, name: 'Operating Agreement', description: 'Custom operating agreement drafting service', category: 'legal', oneTimePrice: '299.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 6 },
  { id: 9, name: 'Legal Documents', description: 'Various legal document preparation services', category: 'legal', oneTimePrice: '199.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 9 },
  { id: 10, name: 'S-Corp Election', description: 'S-Corporation tax election filing service', category: 'tax', oneTimePrice: '149.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 10 },
  { id: 11, name: 'BOIR Filing', description: 'Beneficial Ownership Information Report filing service', category: 'compliance', oneTimePrice: '199.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: true, sortOrder: 11 },
  { id: 16, name: 'Business Formation', description: 'Comprehensive business formation package', category: 'formation', oneTimePrice: '399.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 16 },
  { id: 17, name: 'EIN Service', description: 'Federal Employer Identification Number service', category: '', oneTimePrice: '99.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 17 },
  { id: 30, name: 'Documents', description: 'Document management and filing services', category: 'documents', oneTimePrice: '99.00', recurringPrice: null, recurringInterval: null, isActive: true, isPopular: false, sortOrder: 30 }
];

async function insertServices() {
  try {
    console.log('🌱 Starting services insertion...');
    
    // Check if services already exist
    const existingServices = await pool.query('SELECT COUNT(*) FROM services');
    const count = parseInt(existingServices.rows[0].count);
    
    if (count > 0) {
      console.log(`Found ${count} existing services. Skipping insertion.`);
      return;
    }
    
    // Insert services one by one
    for (const service of services) {
      try {
        await pool.query(`
          INSERT INTO services (id, name, description, category, one_time_price, recurring_price, recurring_interval, is_active, is_popular, sort_order, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
          ON CONFLICT (id) DO NOTHING
        `, [
          service.id,
          service.name,
          service.description,
          service.category,
          service.oneTimePrice,
          service.recurringPrice,
          service.recurringInterval,
          service.isActive,
          service.isPopular,
          service.sortOrder
        ]);
        console.log(`✅ Inserted service: ${service.name} (ID: ${service.id})`);
      } catch (error) {
        console.error(`❌ Error inserting service ${service.name}:`, error.message);
      }
    }
    
    console.log('🎉 Services insertion completed!');
    
  } catch (error) {
    console.error('❌ Error during services insertion:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the insertion
insertServices()
  .then(() => {
    console.log('Services insertion script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Services insertion script failed:', error);
    process.exit(1);
  });