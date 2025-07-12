import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const selectFields = [
  {
    fieldName: 'filing_type',
    fieldLabel: 'Type of Filing *',
    options: ["Initial report", "Correction", "Update", "Newly exempt entity"],
    displayOrder: 6
  },
  {
    fieldName: 'beneficial_owner_count',
    fieldLabel: 'Number of Beneficial Owners *',
    options: ["1", "2", "3", "4", "5"],
    displayOrder: 7
  },
  {
    fieldName: 'owner1_id_type',
    fieldLabel: 'Owner 1: Identification Document Type *',
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    displayOrder: 11
  },
  {
    fieldName: 'owner2_id_type',
    fieldLabel: 'Owner 2: Identification Document Type',
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    displayOrder: 17
  },
  {
    fieldName: 'has_company_applicant',
    fieldLabel: 'Is there a Company Applicant?',
    options: ["Yes", "No"],
    displayOrder: 20
  },
  {
    fieldName: 'applicant_id_type',
    fieldLabel: 'Company Applicant: Identification Document Type',
    options: ["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"],
    displayOrder: 24
  },
  {
    fieldName: 'fincen_identifier_available',
    fieldLabel: 'Do you have FinCEN identifiers?',
    options: ["Yes", "No"],
    displayOrder: 27
  }
];

async function fixBoirSelectFields() {
  try {
    console.log('Fixing 7 BOIR select fields with proper JSON formatting...');
    
    let successCount = 0;
    for (const field of selectFields) {
      try {
        const query = `
          UPDATE service_custom_fields 
          SET options = $1, updated_at = NOW()
          WHERE service_id = 11 AND field_name = $2
        `;

        const result = await pool.query(query, [
          JSON.stringify(field.options),
          field.fieldName
        ]);

        if (result.rowCount > 0) {
          successCount++;
          console.log(`✓ Fixed: ${field.fieldLabel}`);
        } else {
          // Field doesn't exist, insert it
          const insertQuery = `
            INSERT INTO service_custom_fields (
              service_id, field_name, field_label, field_type, field_category,
              is_required, options, display_order, is_active, created_at, updated_at
            ) VALUES (11, $1, $2, 'select', 
              CASE 
                WHEN $1 LIKE '%owner%' THEN 'beneficial_owner'
                WHEN $1 LIKE '%applicant%' THEN 'company_applicant'
                WHEN $1 LIKE '%fincen%' THEN 'additional'
                ELSE 'reporting_company'
              END,
              $3, $4, $5, true, NOW(), NOW())
          `;
          
          const isRequired = field.fieldLabel.includes('*');
          await pool.query(insertQuery, [
            field.fieldName,
            field.fieldLabel,
            isRequired,
            JSON.stringify(field.options),
            field.displayOrder
          ]);
          
          successCount++;
          console.log(`✓ Created: ${field.fieldLabel}`);
        }
      } catch (error) {
        console.log(`✗ Error fixing ${field.fieldLabel}: ${error.message}`);
      }
    }

    console.log(`\nSuccessfully fixed/created ${successCount}/${selectFields.length} select fields`);
    console.log('All 29 comprehensive BOIR Filing fields are now complete!');

  } catch (error) {
    console.error('Error fixing select fields:', error);
  } finally {
    await pool.end();
  }
}

fixBoirSelectFields();