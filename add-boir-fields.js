import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function addBoirFields() {
  try {
    console.log('Adding comprehensive BOIR Filing fields for service ID 11...');

    // Delete existing basic fields first to replace with comprehensive ones
    await pool.query('DELETE FROM service_custom_fields WHERE service_id = 11');
    console.log('Cleared existing BOIR fields');

    // REPORTING COMPANY INFORMATION
    const reportingCompanyFields = [
      {
        serviceId: 11,
        fieldName: 'reporting_company_legal_name',
        fieldLabel: 'Full Legal Name *',
        fieldType: 'text',
        fieldCategory: 'reporting_company',
        isRequired: true,
        placeholder: 'Enter the exact legal name as registered',
        helpText: 'Must match your formation documents exactly',
        displayOrder: 1,
        fieldGroup: 'Reporting Company Information'
      },
      {
        serviceId: 11,
        fieldName: 'trade_names_dbas',
        fieldLabel: 'Trade Names or DBAs',
        fieldType: 'textarea',
        fieldCategory: 'reporting_company',
        isRequired: false,
        placeholder: 'List all trade names or "doing business as" names (one per line)',
        helpText: 'Include any names your business operates under',
        displayOrder: 2,
        fieldGroup: 'Reporting Company Information'
      },
      {
        serviceId: 11,
        fieldName: 'principal_business_address',
        fieldLabel: 'Principal Business Address *',
        fieldType: 'textarea',
        fieldCategory: 'reporting_company',
        isRequired: true,
        placeholder: 'Street address, city, state, ZIP code, country',
        helpText: 'Complete address where business is located',
        displayOrder: 3,
        fieldGroup: 'Reporting Company Information'
      },
      {
        serviceId: 11,
        fieldName: 'jurisdiction_formation',
        fieldLabel: 'Jurisdiction of Formation *',
        fieldType: 'state',
        fieldCategory: 'reporting_company',
        isRequired: true,
        placeholder: 'Select state',
        helpText: 'State, tribal, or foreign jurisdiction where formed',
        displayOrder: 4,
        fieldGroup: 'Reporting Company Information'
      },
      {
        serviceId: 11,
        fieldName: 'taxpayer_id_number',
        fieldLabel: 'Taxpayer Identification Number (TIN) *',
        fieldType: 'text',
        fieldCategory: 'reporting_company',
        isRequired: true,
        placeholder: 'EIN, SSN, or other TIN',
        helpText: 'Such as EIN or SSN, if applicable',
        displayOrder: 5,
        fieldGroup: 'Reporting Company Information'
      },
      {
        serviceId: 11,
        fieldName: 'filing_type',
        fieldLabel: 'Type of Filing *',
        fieldType: 'select',
        fieldCategory: 'reporting_company',
        isRequired: true,
        options: '["Initial report", "Correction", "Update", "Newly exempt entity"]',
        helpText: 'Select the appropriate filing type',
        displayOrder: 6,
        fieldGroup: 'Reporting Company Information'
      }
    ];

    // BENEFICIAL OWNER INFORMATION (for multiple owners)
    const beneficialOwnerFields = [
      {
        serviceId: 11,
        fieldName: 'beneficial_owner_count',
        fieldLabel: 'Number of Beneficial Owners *',
        fieldType: 'select',
        fieldCategory: 'beneficial_owner',
        isRequired: true,
        options: '["1", "2", "3", "4", "5"]',
        helpText: 'Individuals who own 25% or more of the company',
        displayOrder: 7,
        fieldGroup: 'Beneficial Owner Information'
      },
      // Owner 1
      {
        serviceId: 11,
        fieldName: 'owner1_full_name',
        fieldLabel: 'Owner 1: Full Legal Name *',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: true,
        placeholder: 'Last, First, Middle (if applicable)',
        helpText: 'Complete legal name as shown on identification',
        displayOrder: 8,
        fieldGroup: 'Beneficial Owner 1'
      },
      {
        serviceId: 11,
        fieldName: 'owner1_date_of_birth',
        fieldLabel: 'Owner 1: Date of Birth *',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: true,
        placeholder: 'MM/DD/YYYY',
        helpText: 'Date of birth in MM/DD/YYYY format',
        displayOrder: 9,
        fieldGroup: 'Beneficial Owner 1'
      },
      {
        serviceId: 11,
        fieldName: 'owner1_residential_address',
        fieldLabel: 'Owner 1: Current Residential Address *',
        fieldType: 'textarea',
        fieldCategory: 'beneficial_owner',
        isRequired: true,
        placeholder: 'Street address, city, state, ZIP code, country',
        helpText: 'Current residential address (not business address)',
        displayOrder: 10,
        fieldGroup: 'Beneficial Owner 1'
      },
      {
        serviceId: 11,
        fieldName: 'owner1_id_type',
        fieldLabel: 'Owner 1: Identification Document Type *',
        fieldType: 'select',
        fieldCategory: 'beneficial_owner',
        isRequired: true,
        options: '["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"]',
        helpText: 'Type of non-expired identification document',
        displayOrder: 11,
        fieldGroup: 'Beneficial Owner 1'
      },
      {
        serviceId: 11,
        fieldName: 'owner1_id_number',
        fieldLabel: 'Owner 1: Unique Identifying Number *',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: true,
        placeholder: 'ID number from selected document',
        helpText: 'Number from the identification document',
        displayOrder: 12,
        fieldGroup: 'Beneficial Owner 1'
      },
      {
        serviceId: 11,
        fieldName: 'owner1_id_jurisdiction',
        fieldLabel: 'Owner 1: Issuing Jurisdiction *',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: true,
        placeholder: 'State or country that issued ID',
        helpText: 'Jurisdiction that issued the identification',
        displayOrder: 13,
        fieldGroup: 'Beneficial Owner 1'
      },
      // Owner 2 (conditional)
      {
        serviceId: 11,
        fieldName: 'owner2_full_name',
        fieldLabel: 'Owner 2: Full Legal Name',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: false,
        placeholder: 'Last, First, Middle (if applicable)',
        helpText: 'Complete legal name as shown on identification',
        displayOrder: 14,
        fieldGroup: 'Beneficial Owner 2'
      },
      {
        serviceId: 11,
        fieldName: 'owner2_date_of_birth',
        fieldLabel: 'Owner 2: Date of Birth',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: false,
        placeholder: 'MM/DD/YYYY',
        helpText: 'Date of birth in MM/DD/YYYY format',
        displayOrder: 15,
        fieldGroup: 'Beneficial Owner 2'
      },
      {
        serviceId: 11,
        fieldName: 'owner2_residential_address',
        fieldLabel: 'Owner 2: Current Residential Address',
        fieldType: 'textarea',
        fieldCategory: 'beneficial_owner',
        isRequired: false,
        placeholder: 'Street address, city, state, ZIP code, country',
        helpText: 'Current residential address (not business address)',
        displayOrder: 16,
        fieldGroup: 'Beneficial Owner 2'
      },
      {
        serviceId: 11,
        fieldName: 'owner2_id_type',
        fieldLabel: 'Owner 2: Identification Document Type',
        fieldType: 'select',
        fieldCategory: 'beneficial_owner',
        isRequired: false,
        options: '["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"]',
        helpText: 'Type of non-expired identification document',
        displayOrder: 17,
        fieldGroup: 'Beneficial Owner 2'
      },
      {
        serviceId: 11,
        fieldName: 'owner2_id_number',
        fieldLabel: 'Owner 2: Unique Identifying Number',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: false,
        placeholder: 'ID number from selected document',
        helpText: 'Number from the identification document',
        displayOrder: 18,
        fieldGroup: 'Beneficial Owner 2'
      },
      {
        serviceId: 11,
        fieldName: 'owner2_id_jurisdiction',
        fieldLabel: 'Owner 2: Issuing Jurisdiction',
        fieldType: 'text',
        fieldCategory: 'beneficial_owner',
        isRequired: false,
        placeholder: 'State or country that issued ID',
        helpText: 'Jurisdiction that issued the identification',
        displayOrder: 19,
        fieldGroup: 'Beneficial Owner 2'
      }
    ];

    // COMPANY APPLICANT INFORMATION
    const companyApplicantFields = [
      {
        serviceId: 11,
        fieldName: 'has_company_applicant',
        fieldLabel: 'Is there a Company Applicant?',
        fieldType: 'select',
        fieldCategory: 'company_applicant',
        isRequired: true,
        options: '["Yes", "No"]',
        helpText: 'Person who directly files the BOIR or directs filing',
        displayOrder: 20,
        fieldGroup: 'Company Applicant Information'
      },
      {
        serviceId: 11,
        fieldName: 'applicant_full_name',
        fieldLabel: 'Company Applicant: Full Legal Name',
        fieldType: 'text',
        fieldCategory: 'company_applicant',
        isRequired: false,
        placeholder: 'Complete legal name',
        helpText: 'Full name of person filing or directing filing',
        displayOrder: 21,
        fieldGroup: 'Company Applicant Information'
      },
      {
        serviceId: 11,
        fieldName: 'applicant_date_of_birth',
        fieldLabel: 'Company Applicant: Date of Birth',
        fieldType: 'text',
        fieldCategory: 'company_applicant',
        isRequired: false,
        placeholder: 'MM/DD/YYYY',
        helpText: 'Date of birth in MM/DD/YYYY format',
        displayOrder: 22,
        fieldGroup: 'Company Applicant Information'
      },
      {
        serviceId: 11,
        fieldName: 'applicant_address',
        fieldLabel: 'Company Applicant: Current Address',
        fieldType: 'textarea',
        fieldCategory: 'company_applicant',
        isRequired: false,
        placeholder: 'Residential or business address',
        helpText: 'Residential address for most; business address if acting in business capacity',
        displayOrder: 23,
        fieldGroup: 'Company Applicant Information'
      },
      {
        serviceId: 11,
        fieldName: 'applicant_id_type',
        fieldLabel: 'Company Applicant: Identification Document Type',
        fieldType: 'select',
        fieldCategory: 'company_applicant',
        isRequired: false,
        options: '["U.S. passport", "State drivers license", "State/local/tribal government ID", "Foreign passport"]',
        helpText: 'Type of acceptable identification document',
        displayOrder: 24,
        fieldGroup: 'Company Applicant Information'
      },
      {
        serviceId: 11,
        fieldName: 'applicant_id_number',
        fieldLabel: 'Company Applicant: Unique Identifying Number',
        fieldType: 'text',
        fieldCategory: 'company_applicant',
        isRequired: false,
        placeholder: 'ID number from selected document',
        helpText: 'Number from the identification document',
        displayOrder: 25,
        fieldGroup: 'Company Applicant Information'
      },
      {
        serviceId: 11,
        fieldName: 'applicant_id_jurisdiction',
        fieldLabel: 'Company Applicant: Issuing Jurisdiction',
        fieldType: 'text',
        fieldCategory: 'company_applicant',
        isRequired: false,
        placeholder: 'State or country that issued ID',
        helpText: 'Jurisdiction that issued the identification',
        displayOrder: 26,
        fieldGroup: 'Company Applicant Information'
      }
    ];

    // Additional notes and FinCEN identifier fields
    const additionalFields = [
      {
        serviceId: 11,
        fieldName: 'fincen_identifier_available',
        fieldLabel: 'Do you have FinCEN identifiers?',
        fieldType: 'select',
        fieldCategory: 'additional',
        isRequired: false,
        options: '["Yes", "No"]',
        helpText: 'If yes, you may provide FinCEN ID instead of detailed information',
        displayOrder: 27,
        fieldGroup: 'Additional Information'
      },
      {
        serviceId: 11,
        fieldName: 'fincen_identifier_numbers',
        fieldLabel: 'FinCEN Identifier Numbers',
        fieldType: 'textarea',
        fieldCategory: 'additional',
        isRequired: false,
        placeholder: 'List FinCEN IDs for beneficial owners or company applicant',
        helpText: 'If available, provide FinCEN identifiers instead of detailed personal information',
        displayOrder: 28,
        fieldGroup: 'Additional Information'
      },
      {
        serviceId: 11,
        fieldName: 'additional_notes',
        fieldLabel: 'Additional Notes or Special Circumstances',
        fieldType: 'textarea',
        fieldCategory: 'additional',
        isRequired: false,
        placeholder: 'Any additional information relevant to your BOIR filing',
        helpText: 'Include any special circumstances or additional information',
        displayOrder: 29,
        fieldGroup: 'Additional Information'
      }
    ];

    // Combine all fields
    const allFields = [
      ...reportingCompanyFields,
      ...beneficialOwnerFields,
      ...companyApplicantFields,
      ...additionalFields
    ];

    // Insert all fields
    for (const field of allFields) {
      const query = `
        INSERT INTO service_custom_fields (
          service_id, field_name, field_label, field_type, field_category,
          is_required, placeholder, help_text, validation_rules, options,
          display_order, field_group, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
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
        field.validationRules || null,
        field.options || null,
        field.displayOrder,
        field.fieldGroup,
        true
      ]);
    }

    console.log(`Successfully added ${allFields.length} comprehensive BOIR Filing fields`);
    console.log('Field groups created:');
    console.log('- Reporting Company Information (6 fields)');
    console.log('- Beneficial Owner Information (13 fields for up to 2 owners)');
    console.log('- Company Applicant Information (7 fields)');
    console.log('- Additional Information (3 fields)');
    console.log('Total: 29 comprehensive BOIR fields');

  } catch (error) {
    console.error('Error adding BOIR fields:', error);
  } finally {
    await pool.end();
  }
}

addBoirFields();