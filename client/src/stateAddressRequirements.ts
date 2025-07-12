// State-specific address requirements for Annual Report Filing
// Each state has different requirements for address information

export interface AddressRequirement {
  field: string;
  label: string;
  required: boolean;
  helpText?: string;
  validation?: {
    pattern?: string;
    maxLength?: number;
  };
}

export interface StateAddressConfig {
  principalAddress: {
    requirements: AddressRequirement[];
    notes?: string[];
  };
  mailingAddress: {
    required: boolean;
    allowPOBox: boolean;
    notes?: string[];
  };
  additionalFields?: AddressRequirement[];
}

export const stateAddressRequirements: { [state: string]: StateAddressConfig } = {
  California: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Must be a physical street address in California (no P.O. Boxes)"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true,
          helpText: "Must be CA for principal office"
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "Principal office must be located in California",
        "Street address required - no P.O. Boxes accepted"
      ]
    },
    mailingAddress: {
      required: false,
      allowPOBox: true,
      notes: [
        "Mailing address is optional",
        "Can be different from principal office",
        "P.O. Boxes are acceptable for mailing address"
      ]
    }
  },

  Delaware: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Business address (can be outside Delaware)"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "Principal office can be located anywhere in the United States",
        "Must be a street address for principal office"
      ]
    },
    mailingAddress: {
      required: false,
      allowPOBox: true
    },
    additionalFields: [
      {
        field: "delawareAddress",
        label: "Delaware Business Address",
        required: false,
        helpText: "If different from registered agent address"
      }
    ]
  },

  Nevada: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Principal place of business (can be outside Nevada)"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "Principal place of business can be located anywhere",
        "Must provide complete address information"
      ]
    },
    mailingAddress: {
      required: false,
      allowPOBox: true
    }
  },

  Texas: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Principal office address"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "No annual report required for Texas LLCs",
        "Corporations must file annual reports"
      ]
    },
    mailingAddress: {
      required: false,
      allowPOBox: true
    }
  },

  Florida: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Principal place of business in Florida"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true,
          helpText: "Must be FL for Florida entities"
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "Principal place of business must be in Florida",
        "Street address required - no P.O. Boxes"
      ]
    },
    mailingAddress: {
      required: true,
      allowPOBox: true,
      notes: [
        "Mailing address is required in Florida",
        "Can be same as principal address",
        "P.O. Boxes acceptable for mailing address"
      ]
    }
  },

  Colorado: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Principal office or place of business"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "Principal office can be located anywhere",
        "Complete address information required"
      ]
    },
    mailingAddress: {
      required: false,
      allowPOBox: true
    }
  },

  Alaska: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Principal place of business"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "Biennial report required every two years",
        "Principal office can be located anywhere in the United States"
      ]
    },
    mailingAddress: {
      required: false,
      allowPOBox: true
    }
  },

  // Default configuration for states not specifically configured
  Default: {
    principalAddress: {
      requirements: [
        {
          field: "street",
          label: "Street Address",
          required: true,
          helpText: "Principal business address"
        },
        {
          field: "city",
          label: "City",
          required: true
        },
        {
          field: "state",
          label: "State",
          required: true
        },
        {
          field: "zipCode",
          label: "ZIP Code",
          required: true,
          validation: {
            pattern: "^[0-9]{5}(-[0-9]{4})?$"
          }
        }
      ],
      notes: [
        "Complete address information required",
        "Verify state-specific requirements with local authorities"
      ]
    },
    mailingAddress: {
      required: false,
      allowPOBox: true
    }
  }
};

export function getStateAddressConfig(state: string): StateAddressConfig {
  return stateAddressRequirements[state] || stateAddressRequirements.Default;
}