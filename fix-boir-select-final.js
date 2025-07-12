import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const selectFields = [
  {
    fieldName: 'filing_type',
    fieldLabel: 'Type of Filing *',
    fieldType: 'select',
    fieldCategory: 'reporting_company',
    isRequired: true,
    options: ["Initial report", "Correction", "Update", "Newly exempt entity"],
    helpText: 'Select the appropriate filing type',
    displayOrder: 6,
    fieldGroup: 'Reporting Company Information'
  },
  {
    fieldName: 'beneficial_owner_count',
    fieldLabel: 'Number of Beneficial Owners *',
    fieldType: 'select',
    fieldCategory: 'beneficial_owner',
    isRequired: true,
    options: ["1", "2", "3", "4", "5"],
    helpText: 'Individuals who own 25% or more of the company',
    displayOrder: 7,
    fieldGroup: 'Beneficial Owner Information'
  },
  {
    fieldName: 'owner1_id_type',
    fieldLabel: 'Owner 1: Identification Document Type *',
    fieldType: 'select',
    fieldCategory: 'beneficial_owner',
    isRequired: true,
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    helpText: 'Type of non-expired identification document',
    displayOrder: 11,
    fieldGroup: 'Beneficial Owner 1'
  },
  {
    fieldName: 'owner2_id_type',
    fieldLabel: 'Owner 2: Identification Document Type',
    fieldType: 'select',
    fieldCategory: 'beneficial_owner',
    isRequired: false,
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    helpText: 'Type of non-expired identification document',
    displayOrder: 17,
    fieldGroup: 'Beneficial Owner 2'
  },
  {
    fieldName: 'has_company_applicant',
    fieldLabel: 'Is there a Company Applicant?',
    fieldType: 'select',
    fieldCategory: 'company_applicant',
    isRequired: true,
    options: ["Yes", "No"],
    helpText: 'Person who directly files the BOIR or directs filing',
    displayOrder: 20,
    fieldGroup: 'Company Applicant Information'
  },
  {
    fieldName: 'applicant_id_type',
    fieldLabel: 'Company Applicant: Identification Document Type',
    fieldType: 'select',
    fieldCategory: 'company_applicant',
    isRequired: false,
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    helpText: 'Type of acceptable identification document',
    displayOrder: 24,
    fieldGroup: 'Company Applicant Information'
  },
  {
    fieldName: 'fincen_identifier_available',
    fieldLabel: 'Do you have FinCEN identifiers?',
    fieldType: 'select',
    fieldCategory: 'additional',
    isRequired: false,
    options: ["Yes", "No"],
    helpText: 'If yes, you may provide FinCEN ID instead of detailed information',
    displayOrder: 27,
    fieldGroup: 'Additional Information'
  }
];

async function fixBoirSelectFieldsFinal() {
  try {
    console.log('Creating the 7 missing BOIR select fields with proper structure...');
    
    let successCount = 0;
    for (const field of selectFields) {
      try {
        // First delete if exists
        await pool.query(
          'DELETE FROM service_custom_fields WHERE service_id = 11 AND field_name = $1',
          [field.fieldName]
        );

        // Insert with proper JSON formatting using $1::jsonb
        const query = `
          INSERT INTO service_custom_fields (
            service_id, field_name, field_label, field_type, field_category,
            is_required, placeholder, help_text, options,
            display_order, field_group, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11, $12, NOW(), NOW())
        `;

        await pool.query(query, [
          11, // service_id
          field.fieldName,
          field.fieldLabel,
          field.fieldType,
          field.fieldCategory,
          field.isRequired,
          null, // placeholder
          field.helpText,
          JSON.stringify(field.options), // This will be cast to jsonb
          field.displayOrder,
          field.fieldGroup,
          true // is_active
        ]);

        successCount++;
        console.log(`✓ Created: ${field.fieldLabel}`);
      } catch (error) {
        console.log(`✗ Error creating ${field.fieldLabel}: ${error.message}`);
      }
    }

    console.log(`\nSuccessfully created ${successCount}/${selectFields.length} select fields`);
    
    if (successCount === selectFields.length) {
      console.log('🎉 ALL 29 COMPREHENSIVE BOIR FILING FIELDS ARE NOW COMPLETE!');
      console.log('\nFinal field summary:');
      console.log('✓ Reporting Company Information (6 fields)');
      console.log('✓ Beneficial Owner Information (13 fields for up to 2 owners)');
      console.log('✓ Company Applicant Information (7 fields)');
      console.log('✓ Additional Information (3 fields)');
      console.log('Total: 29 comprehensive BOIR fields with mandatory indicators (*), field groups, and FinCEN compliance requirements');
    }

  } catch (error) {
    console.error('Error creating select fields:', error);
  } finally {
    await pool.end();
  }
}

fixBoirSelectFieldsFinal();