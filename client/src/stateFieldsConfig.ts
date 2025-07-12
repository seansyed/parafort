// State-specific field configurations for Annual Report Filing
// Each state has unique requirements for annual report filings

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea' | 'email' | 'tel' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface StateFieldCategory {
  category: string;
  description: string;
  fields: FieldConfig[];
}

export interface StateConfig {
  [serviceName: string]: StateFieldCategory[];
}

export const stateFieldsConfig: { [state: string]: StateConfig } = {
  California: {
    "Annual Report Filing": [
      {
        category: "Entity Identification",
        description: "Basic information about your business entity",
        fields: [
          {
            name: "entityNumber",
            label: "Entity Number (CA SOS File Number)",
            type: "text",
            required: true,
            placeholder: "C1234567 or 2020123456",
            helpText: "Your 12-digit CA Secretary of State file number",
            validation: {
              pattern: "^[C]?[0-9]{7,12}$",
              minLength: 7,
              maxLength: 12
            }
          },
          {
            name: "legalEntityName",
            label: "Legal Entity Name",
            type: "text",
            required: true,
            placeholder: "Exact name as registered with CA SOS",
            helpText: "Must match exactly with your SOS registration"
          },
          {
            name: "entityType",
            label: "Entity Type",
            type: "select",
            required: true,
            options: ["Corporation", "LLC", "Nonprofit Corporation", "Professional Corporation"],
            helpText: "Select your business entity type"
          }
        ]
      },
      {
        category: "Address Information",
        description: "Business location and mailing addresses",
        fields: [
          {
            name: "principalOfficeStreet",
            label: "Principal Office Street Address",
            type: "text",
            required: true,
            placeholder: "123 Main Street",
            helpText: "Physical street address (P.O. Boxes not accepted)"
          },
          {
            name: "principalOfficeCity",
            label: "Principal Office City",
            type: "text",
            required: true,
            placeholder: "Los Angeles"
          },
          {
            name: "principalOfficeState",
            label: "Principal Office State",
            type: "select",
            required: true,
            options: ["CA"],
            helpText: "Principal office must be in California"
          },
          {
            name: "principalOfficeZip",
            label: "Principal Office ZIP Code",
            type: "text",
            required: true,
            placeholder: "90210",
            validation: {
              pattern: "^[0-9]{5}(-[0-9]{4})?$"
            }
          },
          {
            name: "mailingStreet",
            label: "Mailing Address Street",
            type: "text",
            required: false,
            placeholder: "P.O. Box 123 or Street Address",
            helpText: "Can be different from principal office (P.O. Boxes accepted)"
          },
          {
            name: "mailingCity",
            label: "Mailing Address City",
            type: "text",
            required: false,
            placeholder: "San Francisco"
          },
          {
            name: "mailingState",
            label: "Mailing Address State",
            type: "select",
            required: false,
            options: ["CA", "AL", "AK", "AZ", "AR", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]
          },
          {
            name: "mailingZip",
            label: "Mailing Address ZIP Code",
            type: "text",
            required: false,
            placeholder: "90210",
            validation: {
              pattern: "^[0-9]{5}(-[0-9]{4})?$"
            }
          }
        ]
      },
      {
        category: "Registered Agent Information",
        description: "Agent for service of process details",
        fields: [
          {
            name: "agentName",
            label: "Registered Agent Name",
            type: "text",
            required: true,
            placeholder: "John Doe or ABC Agent Services LLC",
            helpText: "Name of your CA-registered agent for service of process"
          },
          {
            name: "agentStreet",
            label: "Agent Street Address",
            type: "text",
            required: true,
            placeholder: "456 Business Ave",
            helpText: "Must be a CA street address (no P.O. Boxes)"
          },
          {
            name: "agentCity",
            label: "Agent City",
            type: "text",
            required: true,
            placeholder: "Sacramento"
          },
          {
            name: "agentZip",
            label: "Agent ZIP Code",
            type: "text",
            required: true,
            placeholder: "95814",
            validation: {
              pattern: "^[0-9]{5}(-[0-9]{4})?$"
            }
          },
          {
            name: "agentConsent",
            label: "Agent Consent Confirmation",
            type: "select",
            required: true,
            options: ["Yes, agent has consented to serve", "No, need to obtain consent"],
            helpText: "Confirm your agent has agreed to serve"
          }
        ]
      },
      {
        category: "Officer/Director/Manager Details",
        description: "Leadership information (varies by entity type)",
        fields: [
          {
            name: "ceoName",
            label: "Chief Executive Officer Name",
            type: "text",
            required: false,
            placeholder: "Jane Smith",
            helpText: "Required for Corporations"
          },
          {
            name: "ceoAddress",
            label: "CEO Address",
            type: "textarea",
            required: false,
            placeholder: "123 Executive Blvd, Beverly Hills, CA 90210",
            helpText: "Complete address of CEO"
          },
          {
            name: "secretaryName",
            label: "Secretary Name",
            type: "text",
            required: false,
            placeholder: "Robert Johnson",
            helpText: "Required for Corporations"
          },
          {
            name: "secretaryAddress",
            label: "Secretary Address",
            type: "textarea",
            required: false,
            placeholder: "789 Secretary St, Los Angeles, CA 90001"
          },
          {
            name: "cfoName",
            label: "Chief Financial Officer Name",
            type: "text",
            required: false,
            placeholder: "Maria Garcia",
            helpText: "Required for Corporations if applicable"
          },
          {
            name: "cfoAddress",
            label: "CFO Address",
            type: "textarea",
            required: false,
            placeholder: "456 Finance Ave, San Diego, CA 92101"
          },
          {
            name: "managersMembers",
            label: "Managers/Members Information",
            type: "textarea",
            required: false,
            placeholder: "List all managers (manager-managed LLC) or members (member-managed LLC)",
            helpText: "Required for LLCs - include names and addresses"
          }
        ]
      },
      {
        category: "Business Activity Information",
        description: "Description of business operations",
        fields: [
          {
            name: "generalPurpose",
            label: "General Purpose Statement",
            type: "textarea",
            required: true,
            placeholder: "To operate a retail bakery and provide catering services",
            helpText: "Brief description of business activities (required for Corporations)",
            validation: {
              maxLength: 500
            }
          },
          {
            name: "sicCode",
            label: "SIC Code",
            type: "text",
            required: false,
            placeholder: "5461",
            helpText: "4-digit Standard Industrial Classification code (optional for Corporations)",
            validation: {
              pattern: "^[0-9]{4}$",
              minLength: 4,
              maxLength: 4
            }
          },
          {
            name: "llcPurpose",
            label: "LLC Purpose",
            type: "text",
            required: false,
            placeholder: "Any lawful purpose",
            helpText: "Purpose of LLC (often 'Any lawful purpose' suffices)"
          }
        ]
      }
    ]
  },

  Delaware: {
    "Annual Report Filing": [
      {
        category: "Entity Identification",
        description: "Delaware entity identification details",
        fields: [
          {
            name: "delawareFileNumber",
            label: "Delaware File Number",
            type: "text",
            required: true,
            placeholder: "1234567",
            helpText: "Your Delaware Division of Corporations file number"
          },
          {
            name: "legalEntityName",
            label: "Legal Entity Name",
            type: "text",
            required: true,
            placeholder: "Exact name as registered with Delaware"
          },
          {
            name: "entityType",
            label: "Entity Type",
            type: "select",
            required: true,
            options: ["Corporation", "LLC", "Limited Partnership", "Professional Association"]
          }
        ]
      },
      {
        category: "Address Information",
        description: "Delaware registered office and principal business address",
        fields: [
          {
            name: "registeredOfficeStreet",
            label: "Delaware Registered Office Address",
            type: "text",
            required: true,
            placeholder: "123 Corporation Blvd",
            helpText: "Must be a Delaware address"
          },
          {
            name: "registeredOfficeCity",
            label: "Registered Office City",
            type: "text",
            required: true,
            placeholder: "Wilmington"
          },
          {
            name: "registeredOfficeZip",
            label: "Registered Office ZIP",
            type: "text",
            required: true,
            placeholder: "19801",
            validation: {
              pattern: "^[0-9]{5}(-[0-9]{4})?$"
            }
          },
          {
            name: "principalBusinessAddress",
            label: "Principal Business Address",
            type: "textarea",
            required: true,
            placeholder: "456 Main Street, Any City, Any State 12345",
            helpText: "Complete address where business is primarily conducted"
          }
        ]
      },
      {
        category: "Registered Agent Information",
        description: "Delaware registered agent details",
        fields: [
          {
            name: "registeredAgentName",
            label: "Registered Agent Name",
            type: "text",
            required: true,
            placeholder: "Delaware Agent Services Inc.",
            helpText: "Must be authorized to do business in Delaware"
          },
          {
            name: "agentAddress",
            label: "Agent Address",
            type: "textarea",
            required: true,
            placeholder: "789 Agent Street, Wilmington, DE 19801",
            helpText: "Delaware address of registered agent"
          }
        ]
      },
      {
        category: "Officer Information",
        description: "Corporate officers and directors",
        fields: [
          {
            name: "presidentName",
            label: "President Name",
            type: "text",
            required: true,
            placeholder: "John President"
          },
          {
            name: "presidentAddress",
            label: "President Address",
            type: "textarea",
            required: true,
            placeholder: "123 Executive Way, Business City, State 12345"
          },
          {
            name: "secretaryName",
            label: "Secretary Name",
            type: "text",
            required: true,
            placeholder: "Jane Secretary"
          },
          {
            name: "treasurerName",
            label: "Treasurer Name",
            type: "text",
            required: true,
            placeholder: "Bob Treasurer"
          },
          {
            name: "directorNames",
            label: "Director Names",
            type: "textarea",
            required: true,
            placeholder: "List all director names, one per line",
            helpText: "Names of all current directors"
          }
        ]
      }
    ]
  },

  Nevada: {
    "Annual Report Filing": [
      {
        category: "Entity Information",
        description: "Nevada entity identification",
        fields: [
          {
            name: "nevadaEntityNumber",
            label: "Nevada Entity Number",
            type: "text",
            required: true,
            placeholder: "NV20201234567",
            helpText: "Your Nevada Secretary of State entity number"
          },
          {
            name: "entityName",
            label: "Entity Name",
            type: "text",
            required: true,
            placeholder: "Your Nevada Business Name LLC"
          },
          {
            name: "entityType",
            label: "Entity Type",
            type: "select",
            required: true,
            options: ["LLC", "Corporation", "Limited Partnership", "Nonprofit Corporation"]
          },
          {
            name: "dateOfFormation",
            label: "Date of Formation",
            type: "text",
            required: true,
            placeholder: "MM/DD/YYYY",
            helpText: "Date entity was formed in Nevada"
          }
        ]
      },
      {
        category: "Registered Agent",
        description: "Nevada registered agent information",
        fields: [
          {
            name: "registeredAgentName",
            label: "Registered Agent Name",
            type: "text",
            required: true,
            placeholder: "Nevada Agent LLC"
          },
          {
            name: "agentStreetAddress",
            label: "Agent Street Address",
            type: "text",
            required: true,
            placeholder: "123 Agent Street",
            helpText: "Nevada street address (no P.O. Boxes)"
          },
          {
            name: "agentCity",
            label: "Agent City",
            type: "text",
            required: true,
            placeholder: "Las Vegas"
          },
          {
            name: "agentZip",
            label: "Agent ZIP Code",
            type: "text",
            required: true,
            placeholder: "89101",
            validation: {
              pattern: "^[0-9]{5}(-[0-9]{4})?$"
            }
          }
        ]
      },
      {
        category: "Business Activity",
        description: "Nevada business information",
        fields: [
          {
            name: "businessAddress",
            label: "Principal Business Address",
            type: "textarea",
            required: true,
            placeholder: "456 Business Blvd, Las Vegas, NV 89102",
            helpText: "Where business operations are conducted"
          },
          {
            name: "natureOfBusiness",
            label: "Nature of Business",
            type: "textarea",
            required: true,
            placeholder: "Technology consulting and software development",
            helpText: "Brief description of business activities"
          },
          {
            name: "managersOfficers",
            label: "Managers/Officers",
            type: "textarea",
            required: true,
            placeholder: "List current managers (LLC) or officers (Corporation)",
            helpText: "Names and titles of current management"
          }
        ]
      }
    ]
  },

  // Default configuration for states without specific setup
  Default: {
    "Annual Report Filing": [
      {
        category: "Basic Information",
        description: "Essential business information",
        fields: [
          {
            name: "businessName",
            label: "Legal Business Name",
            type: "text",
            required: true,
            placeholder: "Your Business Name LLC"
          },
          {
            name: "entityType",
            label: "Business Entity Type",
            type: "select",
            required: true,
            options: ["LLC", "Corporation", "Partnership", "Sole Proprietorship"]
          },
          {
            name: "stateOfFormation",
            label: "State of Formation",
            type: "text",
            required: true,
            placeholder: "State where business was formed"
          },
          {
            name: "businessAddress",
            label: "Business Address",
            type: "textarea",
            required: true,
            placeholder: "Complete business address"
          },
          {
            name: "registeredAgent",
            label: "Registered Agent Information",
            type: "textarea",
            required: true,
            placeholder: "Name and address of registered agent"
          }
        ]
      }
    ]
  }
};

// Helper function to get state-specific fields
export const getStateSpecificFields = (serviceName: string, selectedState: string): StateFieldCategory[] => {
  const stateConfig = stateFieldsConfig[selectedState];
  if (stateConfig && stateConfig[serviceName]) {
    return stateConfig[serviceName];
  }
  
  // Fallback to default configuration
  return stateFieldsConfig.Default[serviceName] || [];
};

// Helper function to get all supported states for a service
export const getSupportedStates = (serviceName: string): string[] => {
  const states = Object.keys(stateFieldsConfig).filter(state => 
    state !== 'Default' && stateFieldsConfig[state][serviceName]
  );
  return states;
};

// Helper function to check if a state has specific configuration
export const hasStateSpecificConfig = (serviceName: string, selectedState: string): boolean => {
  return !!(stateFieldsConfig[selectedState] && stateFieldsConfig[selectedState][serviceName]);
};