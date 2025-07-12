import { db } from './server/db.js';
import { services } from './shared/schema.js';

async function seedServices() {
  try {
    console.log('🌱 Starting services seeding...');
    
    // Check if services already exist
    const existingServices = await db.query.services.findMany();
    
    if (existingServices.length > 0) {
      console.log(`Found ${existingServices.length} existing services. Skipping seed.`);
      return;
    }
    
    // Create the essential services
    const servicesToSeed = [
      {
        id: 1,
        name: 'Business Formation',
        description: 'Complete business formation services including LLC and Corporation setup',
        category: 'formation',
        oneTimePrice: '299.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true,
        sortOrder: 1
      },
      {
        id: 2,
        name: 'EIN Application',
        description: 'Federal Tax ID (EIN) application service',
        category: 'tax',
        oneTimePrice: '99.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 2
      },
      {
        id: 3,
        name: 'Registered Agent',
        description: 'Professional registered agent service',
        category: 'compliance',
        oneTimePrice: '149.00',
        recurringPrice: '149.00',
        recurringInterval: 'yearly',
        isActive: true,
        isPopular: false,
        sortOrder: 3
      },
      {
        id: 5,
        name: 'Annual Report Filing',
        description: 'Annual report filing service for business compliance',
        category: 'compliance',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 5
      },
      {
        id: 6,
        name: 'Operating Agreement',
        description: 'Custom operating agreement drafting service',
        category: 'legal',
        oneTimePrice: '299.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 6
      },
      {
        id: 9,
        name: 'Legal Documents',
        description: 'Various legal document preparation services',
        category: 'legal',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 9
      },
      {
        id: 10,
        name: 'S-Corp Election',
        description: 'S-Corporation tax election filing service',
        category: 'tax',
        oneTimePrice: '149.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 10
      },
      {
        id: 11,
        name: 'BOIR Filing',
        description: 'Beneficial Ownership Information Report filing service',
        category: 'compliance',
        oneTimePrice: '199.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: true,
        sortOrder: 11
      },
      {
        id: 16,
        name: 'Business Formation',
        description: 'Comprehensive business formation package',
        category: 'formation',
        oneTimePrice: '399.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 16
      },
      {
        id: 17,
        name: 'EIN Service',
        description: 'Federal Employer Identification Number service',
        category: '',
        oneTimePrice: '99.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 17
      },
      {
        id: 30,
        name: 'Documents',
        description: 'Document management and filing services',
        category: 'documents',
        oneTimePrice: '99.00',
        recurringPrice: null,
        recurringInterval: null,
        isActive: true,
        isPopular: false,
        sortOrder: 30
      }
    ];
    
    // Insert services
    for (const service of servicesToSeed) {
      await db.insert(services).values({
        ...service,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Created service: ${service.name} (ID: ${service.id})`);
    }
    
    console.log('🎉 Services seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding services:', error);
    throw error;
  }
}

// Run the seed function
seedServices()
  .then(() => {
    console.log('Services seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Services seed script failed:', error);
    process.exit(1);
  });