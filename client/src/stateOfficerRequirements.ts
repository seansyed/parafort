// State-specific officer/manager requirements for Annual Report Filing
// Requirements vary by state and entity type

export interface OfficerRequirement {
  title: string;
  required: boolean;
  description?: string;
  minRequired?: number;
  maxRequired?: number;
}

export interface EntityOfficerConfig {
  LLC?: {
    requirements: OfficerRequirement[];
    notes?: string[];
  };
  Corporation?: {
    requirements: OfficerRequirement[];
    notes?: string[];
  };
  'Professional Corporation'?: {
    requirements: OfficerRequirement[];
    notes?: string[];
  };
  'Non-Profit Corporation'?: {
    requirements: OfficerRequirement[];
    notes?: string[];
  };
}

export const stateOfficerRequirements: { [state: string]: EntityOfficerConfig } = {
  California: {
    LLC: {
      requirements: [
        {
          title: "Manager(s)",
          required: true,
          description: "At least one manager required for manager-managed LLC",
          minRequired: 1
        },
        {
          title: "Managing Member(s)",
          required: false,
          description: "Required for member-managed LLC (alternative to managers)"
        }
      ],
      notes: [
        "Must specify if LLC is manager-managed or member-managed",
        "Manager-managed: List all managers with full names and addresses",
        "Member-managed: List managing members instead of managers"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "Chief Executive Officer (CEO)",
          required: true,
          description: "Required for all California corporations",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary required",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Chief Financial Officer (CFO)",
          required: false,
          description: "Required if corporation has designated CFO"
        }
      ],
      notes: [
        "CEO and Secretary are mandatory officer positions",
        "Same person can hold multiple officer positions except CEO and Secretary",
        "Must provide full names and business addresses"
      ]
    },
    'Professional Corporation': {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Licensed professional required as president",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary required",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Licensed Shareholders",
          required: true,
          description: "All shareholders must be licensed professionals"
        }
      ],
      notes: [
        "All officers and shareholders must hold required professional licenses",
        "License verification may be required",
        "Professional corporation must practice only the licensed profession"
      ]
    },
    'Non-Profit Corporation': {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Board president required",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary required",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Treasurer",
          required: true,
          description: "Financial officer required",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Board of Directors",
          required: true,
          description: "Minimum 3 directors required",
          minRequired: 3
        }
      ],
      notes: [
        "Minimum 3 board members required",
        "No compensation restrictions for officers",
        "Must maintain charitable/educational purpose"
      ]
    }
  },

  Delaware: {
    LLC: {
      requirements: [
        {
          title: "Manager(s)",
          required: false,
          description: "Only required for manager-managed LLCs"
        },
        {
          title: "Member(s)",
          required: true,
          description: "At least one member required",
          minRequired: 1
        }
      ],
      notes: [
        "Delaware LLCs can be member-managed or manager-managed",
        "Single-member LLCs are permitted",
        "Members can be individuals or entities"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Chief executive officer",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Treasurer",
          required: false,
          description: "Financial officer (optional)"
        }
      ],
      notes: [
        "President and Secretary are required positions",
        "One person may hold multiple offices",
        "Delaware allows single-director corporations"
      ]
    },
    'Professional Corporation': {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Must be licensed professional",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        }
      ],
      notes: [
        "Only licensed professionals can be shareholders",
        "Corporation limited to practice of licensed profession",
        "Regular compliance with professional licensing boards required"
      ]
    },
    'Non-Profit Corporation': {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Board president",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary", 
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Board of Directors",
          required: true,
          description: "Minimum 3 directors",
          minRequired: 3
        }
      ],
      notes: [
        "Must maintain charitable, educational, or religious purpose",
        "No private benefit to individuals",
        "Annual reporting to Delaware Department of State required"
      ]
    }
  },

  Nevada: {
    LLC: {
      requirements: [
        {
          title: "Manager(s)",
          required: false,
          description: "Required only for manager-managed LLCs"
        },
        {
          title: "Managing Member(s)",
          required: false,
          description: "Required only for member-managed LLCs"
        }
      ],
      notes: [
        "Nevada LLCs must specify management structure",
        "List of managers required for manager-managed LLCs",
        "List of managing members required for member-managed LLCs"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Chief executive officer",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Treasurer", 
          required: true,
          description: "Chief financial officer",
          minRequired: 1,
          maxRequired: 1
        }
      ],
      notes: [
        "President, Secretary, and Treasurer all required",
        "Same person can hold multiple offices",
        "Must provide current officer information"
      ]
    }
  },

  Texas: {
    LLC: {
      requirements: [
        {
          title: "Manager(s)",
          required: false,
          description: "Only required for manager-managed LLCs"
        }
      ],
      notes: [
        "Texas LLCs are not required to file annual reports",
        "This information may be needed for other state filings",
        "Management structure should be clearly defined"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Chief executive officer",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        }
      ],
      notes: [
        "Minimum of President and Secretary required",
        "Annual franchise tax report required",
        "Officer information must be current and accurate"
      ]
    }
  },

  Florida: {
    LLC: {
      requirements: [
        {
          title: "Manager(s)",
          required: true,
          description: "At least one manager or managing member required",
          minRequired: 1
        }
      ],
      notes: [
        "Florida requires annual reports for LLCs",
        "Must list current managers or managing members",
        "Addresses must be current and accurate"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Chief executive officer",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Director(s)",
          required: true,
          description: "Board of directors",
          minRequired: 1
        }
      ],
      notes: [
        "President, Secretary, and at least one Director required",
        "Directors elect officers",
        "Annual report must list current officers and directors"
      ]
    }
  },

  Colorado: {
    LLC: {
      requirements: [
        {
          title: "Manager(s) or Managing Member(s)",
          required: true,
          description: "Must list management structure",
          minRequired: 1
        }
      ],
      notes: [
        "Periodic report required every other year",
        "Must specify manager-managed or member-managed",
        "Complete names and addresses required"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Chief executive officer",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        }
      ],
      notes: [
        "Periodic report required every other year",
        "Must list current principal officers",
        "Officer changes should be reported promptly"
      ]
    }
  },

  Alaska: {
    LLC: {
      requirements: [
        {
          title: "Manager(s)",
          required: false,
          description: "Required only if manager-managed"
        },
        {
          title: "Member(s)",
          required: true,
          description: "At least one member required",
          minRequired: 1
        }
      ],
      notes: [
        "Biennial report filed every two years",
        "Management structure must be clearly identified",
        "Current information required as of report date"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Chief executive officer",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        }
      ],
      notes: [
        "Biennial report required every two years",
        "Officers must be listed with current information",
        "Changes in officers should be reported between filings"
      ]
    }
  },

  // Default configuration for states not specifically configured
  Default: {
    LLC: {
      requirements: [
        {
          title: "Manager(s) or Managing Member(s)",
          required: true,
          description: "Management information required",
          minRequired: 1
        }
      ],
      notes: [
        "Check state-specific requirements",
        "Management structure varies by state",
        "Consult with legal counsel if uncertain"
      ]
    },
    Corporation: {
      requirements: [
        {
          title: "President",
          required: true,
          description: "Chief executive officer",
          minRequired: 1,
          maxRequired: 1
        },
        {
          title: "Secretary",
          required: true,
          description: "Corporate secretary",
          minRequired: 1,
          maxRequired: 1
        }
      ],
      notes: [
        "Standard corporate officer requirements",
        "Verify state-specific requirements",
        "Current officer information required"
      ]
    }
  }
};

export function getStateOfficerConfig(state: string, entityType: string): EntityOfficerConfig[keyof EntityOfficerConfig] | undefined {
  const stateConfig = stateOfficerRequirements[state] || stateOfficerRequirements.Default;
  return stateConfig[entityType as keyof EntityOfficerConfig];
}