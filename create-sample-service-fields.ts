import { db } from './server/db';
import { serviceCustomFields } from './shared/schema';

// Sample custom fields for different services
const sampleFields = [
  // Annual Report Filing Service (ID: 5)
  {
    serviceId: 5,
    fieldName: 'legal_business_name',
    fieldLabel: 'Legal Business Name',
    fieldType: 'text',
    isRequired: true,
    options: null,
    placeholder: 'Enter your legal business name as registered',
    helpText: 'This must match exactly with your state filing records',
    validation: null,
    displayOrder: 1,
    isActive: true
  },
  {
    serviceId: 5,
    fieldName: 'state_of_incorporation',
    fieldLabel: 'State of Incorporation',
    fieldType: 'state_select',
    isRequired: true,
    options: null,
    placeholder: 'Select state',
    helpText: 'The state where your business was originally formed',
    validation: null,
    displayOrder: 2,
    isActive: true
  },
  {
    serviceId: 5,
    fieldName: 'entity_type',
    fieldLabel: 'Business Entity Type',
    fieldType: 'entity_type_select',
    isRequired: true,
    options: null,
    placeholder: 'Select entity type',
    helpText: 'Your business structure type',
    validation: null,
    displayOrder: 3,
    isActive: true
  },
  {
    serviceId: 5,
    fieldName: 'filing_year',
    fieldLabel: 'Filing Year',
    fieldType: 'select',
    isRequired: true,
    options: ['2024', '2025'],
    placeholder: 'Select filing year',
    helpText: 'The year for which you are filing the annual report',
    validation: null,
    displayOrder: 4,
    isActive: true
  },

  // EIN Service (ID: 17)
  {
    serviceId: 17,
    fieldName: 'business_legal_name',
    fieldLabel: 'Business Legal Name',
    fieldType: 'text',
    isRequired: true,
    options: null,
    placeholder: 'Enter exact legal name',
    helpText: 'Must match your business formation documents exactly',
    validation: null,
    displayOrder: 1,
    isActive: true
  },
  {
    serviceId: 17,
    fieldName: 'responsible_party_name',
    fieldLabel: 'Responsible Party Name',
    fieldType: 'text',
    isRequired: true,
    options: null,
    placeholder: 'Enter full name',
    helpText: 'Individual who controls the business finances',
    validation: null,
    displayOrder: 2,
    isActive: true
  },
  {
    serviceId: 17,
    fieldName: 'responsible_party_ssn',
    fieldLabel: 'Responsible Party SSN',
    fieldType: 'text',
    isRequired: true,
    options: null,
    placeholder: 'XXX-XX-XXXX',
    helpText: 'Social Security Number of the responsible party',
    validation: null,
    displayOrder: 3,
    isActive: true
  },
  {
    serviceId: 17,
    fieldName: 'business_start_date',
    fieldLabel: 'Business Start Date',
    fieldType: 'date',
    isRequired: true,
    options: null,
    placeholder: 'MM/DD/YYYY',
    helpText: 'Date when business began operations',
    validation: null,
    displayOrder: 4,
    isActive: true
  },

  // BOIR Filing Service (ID: 11)
  {
    serviceId: 11,
    fieldName: 'company_legal_name',
    fieldLabel: 'Company Legal Name',
    fieldType: 'text',
    isRequired: true,
    options: null,
    placeholder: 'Enter exact legal name',
    helpText: 'Must match your formation documents exactly',
    validation: null,
    displayOrder: 1,
    isActive: true
  },
  {
    serviceId: 11,
    fieldName: 'formation_jurisdiction',
    fieldLabel: 'Formation Jurisdiction',
    fieldType: 'state_select',
    isRequired: true,
    options: null,
    placeholder: 'Select state',
    helpText: 'State where your business was formed',
    validation: null,
    displayOrder: 2,
    isActive: true
  },
  {
    serviceId: 11,
    fieldName: 'beneficial_owner_count',
    fieldLabel: 'Number of Beneficial Owners',
    fieldType: 'select',
    isRequired: true,
    options: ['1', '2', '3', '4', '5+'],
    placeholder: 'Select count',
    helpText: 'Individuals who own 25% or more of the company',
    validation: null,
    displayOrder: 3,
    isActive: true
  },
  {
    serviceId: 11,
    fieldName: 'is_existing_company',
    fieldLabel: 'Is this an existing company?',
    fieldType: 'radio',
    isRequired: true,
    options: ['Yes - formed before January 1, 2024', 'No - formed on or after January 1, 2024'],
    placeholder: null,
    helpText: 'Determines filing deadline requirements',
    validation: null,
    displayOrder: 4,
    isActive: true
  },

  // Tax Filing Service (ID: 3)
  {
    serviceId: 3,
    fieldName: 'tax_year',
    fieldLabel: 'Tax Year',
    fieldType: 'select',
    isRequired: true,
    options: ['2023', '2024'],
    placeholder: 'Select tax year',
    helpText: 'The tax year for which you need filing services',
    validation: null,
    displayOrder: 1,
    isActive: true
  },
  {
    serviceId: 3,
    fieldName: 'filing_type',
    fieldLabel: 'Filing Type',
    fieldType: 'select',
    isRequired: true,
    options: ['Individual Tax Return', 'Business Tax Return', 'Tax Planning & Strategy'],
    placeholder: 'Select filing type',
    helpText: 'Type of tax service needed',
    validation: null,
    displayOrder: 2,
    isActive: true
  },
  {
    serviceId: 3,
    fieldName: 'has_multiple_states',
    fieldLabel: 'Do you have tax obligations in multiple states?',
    fieldType: 'radio',
    isRequired: true,
    options: ['Yes', 'No'],
    placeholder: null,
    helpText: 'Affects complexity and pricing',
    validation: null,
    displayOrder: 3,
    isActive: true
  },

  // Business License Service (ID: 8)
  {
    serviceId: 8,
    fieldName: 'business_activity',
    fieldLabel: 'Primary Business Activity',
    fieldType: 'text',
    isRequired: true,
    options: null,
    placeholder: 'Describe your main business activity',
    helpText: 'What your business does (e.g., restaurant, consulting, retail)',
    validation: null,
    displayOrder: 1,
    isActive: true
  },
  {
    serviceId: 8,
    fieldName: 'business_location_state',
    fieldLabel: 'Business Location State',
    fieldType: 'state_select',
    isRequired: true,
    options: null,
    placeholder: 'Select state',
    helpText: 'Primary state where business operates',
    validation: null,
    displayOrder: 2,
    isActive: true
  },
  {
    serviceId: 8,
    fieldName: 'license_urgency',
    fieldLabel: 'How soon do you need the license?',
    fieldType: 'select',
    isRequired: true,
    options: ['ASAP', 'Within 2 weeks', 'Within 1 month', 'Within 3 months'],
    placeholder: 'Select timeline',
    helpText: 'Helps us prioritize your application',
    validation: null,
    displayOrder: 3,
    isActive: true
  }
];

async function createSampleServiceFields() {
  try {
    console.log('Creating sample service custom fields...');
    
    // Insert all sample fields
    for (const field of sampleFields) {
      await db.insert(serviceCustomFields).values(field);
      console.log(`✓ Created field: ${field.fieldLabel} for service ${field.serviceId}`);
    }
    
    console.log(`\n✅ Successfully created ${sampleFields.length} sample service custom fields!`);
    console.log('\nServices with custom fields:');
    console.log('- Annual Report Filing (ID: 5) - 4 fields');
    console.log('- EIN Service (ID: 17) - 4 fields');
    console.log('- BOIR Filing (ID: 11) - 4 fields');
    console.log('- Tax Filing Service (ID: 3) - 3 fields');
    console.log('- Business License Service (ID: 8) - 3 fields');
    
  } catch (error) {
    console.error('Error creating sample service fields:', error);
  } finally {
    process.exit(0);
  }
}

// Run the script
createSampleServiceFields();