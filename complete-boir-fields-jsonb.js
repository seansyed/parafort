import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const selectFields = [
  {
    serviceId: 11,
    fieldName: 'filing_type',
    fieldLabel: 'Type of Filing *',
    fieldType: 'select',
    fieldCategory: 'reporting_company',
    isRequired: true,
    placeholder: null,
    helpText: 'Select the appropriate filing type',
    options: ["Initial report", "Correction", "Update", "Newly exempt entity"],
    displayOrder: 6,
    fieldGroup: 'Reporting Company Information'
  },
  {
    serviceId: 11,
    fieldName: 'beneficial_owner_count',
    fieldLabel: 'Number of Beneficial Owners *',
    fieldType: 'select',
    fieldCategory: 'beneficial_owner',
    isRequired: true,
    placeholder: null,
    helpText: 'Individuals who own 25% or more of the company',
    options: ["1", "2", "3", "4", "5"],
    displayOrder: 7,
    fieldGroup: 'Beneficial Owner Information'
  },
  {
    serviceId: 11,
    fieldName: 'owner1_id_type',
    fieldLabel: 'Owner 1: Identification Document Type *',
    fieldType: 'select',
    fieldCategory: 'beneficial_owner',
    isRequired: true,
    placeholder: null,
    helpText: 'Type of non-expired identification document',
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    displayOrder: 11,
    fieldGroup: 'Beneficial Owner 1'
  },
  {
    serviceId: 11,
    fieldName: 'owner2_id_type',
    fieldLabel: 'Owner 2: Identification Document Type',
    fieldType: 'select',
    fieldCategory: 'beneficial_owner',
    isRequired: false,
    placeholder: null,
    helpText: 'Type of non-expired identification document',
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    displayOrder: 17,
    fieldGroup: 'Beneficial Owner 2'
  },
  {
    serviceId: 11,
    fieldName: 'has_company_applicant',
    fieldLabel: 'Is there a Company Applicant?',
    fieldType: 'select',
    fieldCategory: 'company_applicant',
    isRequired: true,
    placeholder: null,
    helpText: 'Person who directly files the BOIR or directs filing',
    options: ["Yes", "No"],
    displayOrder: 20,
    fieldGroup: 'Company Applicant Information'
  },
  {
    serviceId: 11,
    fieldName: 'applicant_id_type',
    fieldLabel: 'Company Applicant: Identification Document Type',
    fieldType: 'select',
    fieldCategory: 'company_applicant',
    isRequired: false,
    placeholder: null,
    helpText: 'Type of acceptable identification document',
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    displayOrder: 24,
    fieldGroup: 'Company Applicant Information'
  },
  {
    serviceId: 11,
    fieldName: 'fincen_identifier_available',
    fieldLabel: 'Do you have FinCEN identifiers?',
    fieldType: 'select',
    fieldCategory: 'additional',
    isRequired: false,
    placeholder: null,
    helpText: 'If yes, you may provide FinCEN ID instead of detailed information',
    options: ["Yes", "No"],
    displayOrder: 27,
    fieldGroup: 'Additional Information'
  }
];

async function completeBoirFieldsJsonb() {
  try {
    console.log('Adding the final 7 BOIR select fields with proper JSONB format...');
    
    let successCount = 0;
    for (const field of selectFields) {
      try {
        // First delete if exists
        await pool.query(
          'DELETE FROM service_custom_fields WHERE service_id = 11 AND field_name = $1',
          [field.fieldName]
        );

        // Insert with proper parameters matching schema exactly
        const query = `
          INSERT INTO service_custom_fields (
            service_id, field_name, field_label, field_type, field_category,
            is_required, placeholder, help_text, options,
            display_order, field_group, is_active, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
        `;

        await pool.query(query, [
          field.serviceId,
          field.fieldName,
          field.fieldLabel,
          field.fieldType,
          field.fieldCategory,
          field.isRequired,
          field.placeholder,
          field.helpText,
          JSON.stringify(field.options), // Convert array to JSON string for JSONB
          field.displayOrder,
          field.fieldGroup,
          true // is_active
        ]);

        successCount++;
        console.log(`✓ Added: ${field.fieldLabel}`);
      } catch (error) {
        console.log(`✗ Error adding ${field.fieldLabel}: ${error.message}`);
      }
    }

    console.log(`\nSuccessfully added ${successCount}/${selectFields.length} select fields`);
    
    if (successCount === selectFields.length) {
      console.log('\n🎉 ALL 29 COMPREHENSIVE BOIR FILING FIELDS ARE NOW COMPLETE!');
      console.log('\n✅ FINAL FIELD SUMMARY:');
      console.log('✓ Reporting Company Information (6 fields)');
      console.log('✓ Beneficial Owner Information (13 fields for up to 2 owners)');
      console.log('✓ Company Applicant Information (7 fields)');
      console.log('✓ Additional Information (3 fields)');
      console.log('\nTotal: 29 comprehensive BOIR fields with:');
      console.log('- Mandatory field indicators (*)');
      console.log('- Organized field groups');
      console.log('- FinCEN compliance requirements');
      console.log('- Proper select field options');
      console.log('- Help text and validation');
    }

  } catch (error) {
    console.error('Error completing BOIR fields:', error);
  } finally {
    await pool.end();
  }
}

completeBoirFieldsJsonb();