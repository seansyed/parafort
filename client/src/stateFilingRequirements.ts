// State-specific filing requirements for different entity types
// This data has been verified through AI services (OpenAI, Gemini) for accuracy

export interface FilingRequirement {
  required: boolean;
  frequency?: string;
  notes?: string;
  exemptions?: string[];
}

export interface StateFilingRequirements {
  state: string;
  LLC: FilingRequirement;
  Corporation: FilingRequirement;
  'Professional Corporation': FilingRequirement;
  'Non-Profit Corporation': FilingRequirement;
}

export const stateFilingRequirements: { [state: string]: StateFilingRequirements } = {
  Alabama: {
    state: 'Alabama',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report required by last day of anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report required by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report required by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report required by last day of anniversary month'
    }
  },
  Alaska: {
    state: 'Alaska',
    LLC: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report required by January 2nd of even years'
    },
    Corporation: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report required by January 2nd of even years'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report required by January 2nd of even years'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report required by January 2nd of even years'
    }
  },
  Arizona: {
    state: 'Arizona',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report required between January 1 and April 15'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report required between January 1 and April 15'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report required between January 1 and April 15'
    }
  },
  Arkansas: {
    state: 'Arkansas',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual franchise tax report due May 1st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual franchise tax report due May 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual franchise tax report due May 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the 15th day of the 5th month after year-end'
    }
  },
  California: {
    state: 'California',
    LLC: {
      required: true,
      frequency: 'biennial',
      notes: 'Statement of Information due every two years'
    },
    Corporation: {
      required: true,
      frequency: 'biennial',
      notes: 'Statement of Information due every two years'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Statement of Information due every two years'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Statement of Information due every two years'
    }
  },
  Colorado: {
    state: 'Colorado',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Periodic report due by last day of anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Periodic report due by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Periodic report due by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Periodic report due by last day of anniversary month'
    }
  },
  Connecticut: {
    state: 'Connecticut',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    }
  },
  Delaware: {
    state: 'Delaware',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual franchise tax due June 1st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual franchise tax and report due March 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual franchise tax and report due March 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual franchise tax due March 1st'
    }
  },
  Florida: {
    state: 'Florida',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by May 1st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by May 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by May 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by May 1st'
    }
  },
  Georgia: {
    state: 'Georgia',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration due April 1st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration due April 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration due April 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration due April 1st'
    }
  },
  Hawaii: {
    state: 'Hawaii',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    }
  },
  Idaho: {
    state: 'Idaho',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    }
  },
  Illinois: {
    state: 'Illinois',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary of incorporation'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary of incorporation'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary of incorporation'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary of incorporation'
    }
  },
  Indiana: {
    state: 'Indiana',
    LLC: {
      required: true,
      frequency: 'biennial',
      notes: 'Business Entity Report due every two years'
    },
    Corporation: {
      required: true,
      frequency: 'biennial',
      notes: 'Business Entity Report due every two years'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Business Entity Report due every two years'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Business Entity Report due every two years'
    }
  },
  Iowa: {
    state: 'Iowa',
    LLC: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report due by April 1st of odd years'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by April 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by April 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by April 1st'
    }
  },
  Kansas: {
    state: 'Kansas',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due August 15th'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due August 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due August 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due August 15th'
    }
  },
  Kentucky: {
    state: 'Kentucky',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due June 30th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due June 30th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due June 30th'
    }
  },
  Louisiana: {
    state: 'Louisiana',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    }
  },
  Maine: {
    state: 'Maine',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due June 1st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due June 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due June 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due June 1st'
    }
  },
  Maryland: {
    state: 'Maryland',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    }
  },
  Massachusetts: {
    state: 'Massachusetts',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    }
  },
  Michigan: {
    state: 'Michigan',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual statement due by February 15th'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual statement due by February 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual statement due by February 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual statement due by February 15th'
    }
  },
  Minnesota: {
    state: 'Minnesota',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due December 31st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due December 31st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due December 31st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due December 31st'
    }
  },
  Mississippi: {
    state: 'Mississippi',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    }
  },
  Missouri: {
    state: 'Missouri',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration report due by the end of the anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration report due by the end of the anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration report due by the end of the anniversary month'
    }
  },
  Montana: {
    state: 'Montana',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    }
  },
  Nebraska: {
    state: 'Nebraska',
    LLC: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report due September 1st of odd years'
    },
    Corporation: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report due September 1st of odd years'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report due September 1st of odd years'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report due September 1st of odd years'
    }
  },
  Nevada: {
    state: 'Nevada',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual list due by last day of anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual list due by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual list due by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual list due by last day of anniversary month'
    }
  },
  'New Hampshire': {
    state: 'New Hampshire',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 1st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 1st'
    }
  },
  'New Jersey': {
    state: 'New Jersey',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by last day of anniversary month'
    }
  },
  'New Mexico': {
    state: 'New Mexico',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due 15th day of 3rd month after year-end'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due 15th day of 3rd month after year-end'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due 15th day of 5th month after year-end'
    }
  },
  'New York': {
    state: 'New York',
    LLC: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial statement due every two years'
    },
    Corporation: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial statement due every two years'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial statement due every two years'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial statement due every two years'
    }
  },
  'North Carolina': {
    state: 'North Carolina',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    }
  },
  'North Dakota': {
    state: 'North Dakota',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due November 15th'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due November 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due November 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due November 15th'
    }
  },
  Ohio: {
    state: 'Ohio',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary date'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary date'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary date'
    }
  },
  Oklahoma: {
    state: 'Oklahoma',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual certificate due by July 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual certificate due by July 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual certificate due by July 1st'
    }
  },
  Oregon: {
    state: 'Oregon',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary date'
    }
  },
  Pennsylvania: {
    state: 'Pennsylvania',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due April 15th'
    }
  },
  'Rhode Island': {
    state: 'Rhode Island',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by anniversary month'
    }
  },
  'South Carolina': {
    state: 'South Carolina',
    LLC: {
      required: true,
      frequency: 'biennial',
      notes: 'Biennial report due by the end of anniversary month every two years'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the anniversary month'
    }
  },
  'South Dakota': {
    state: 'South Dakota',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due February 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due February 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due February 1st'
    }
  },
  Tennessee: {
    state: 'Tennessee',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    }
  },
  Texas: {
    state: 'Texas',
    LLC: {
      required: false,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: false,
      frequency: 'annual',
      notes: 'Franchise tax report due May 15th'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Franchise tax report due May 15th'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due May 15th'
    }
  },
  Utah: {
    state: 'Utah',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due by anniversary date'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due by anniversary date'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due by anniversary date'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual renewal due by anniversary date'
    }
  },
  Vermont: {
    state: 'Vermont',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the last day of the anniversary month'
    }
  },
  Virginia: {
    state: 'Virginia',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration fee due by the last day of the anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration fee due by the last day of the anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration fee due by the last day of the anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual registration fee due by the last day of the anniversary month'
    }
  },
  Washington: {
    state: 'Washington',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary month'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary month'
    }
  },
  'West Virginia': {
    state: 'West Virginia',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due July 1st'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due July 1st'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due July 1st'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due July 1st'
    }
  },
  Wisconsin: {
    state: 'Wisconsin',
    LLC: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary quarter'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary quarter'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary quarter'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the end of anniversary quarter'
    }
  },
  Wyoming: {
    state: 'Wyoming',
    LLC: {
      required: true,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the first day of anniversary month'
    },
    'Professional Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the first day of anniversary month'
    },
    'Non-Profit Corporation': {
      required: true,
      frequency: 'annual',
      notes: 'Annual report due by the first day of anniversary month'
    }
  }
};

// Helper function to get filing requirement for a specific state and entity type
export function getFilingRequirement(stateName: string, entityType: string): FilingRequirement | null {
  const stateData = stateFilingRequirements[stateName];
  if (!stateData) return null;
  
  const entityRequirement = stateData[entityType as keyof typeof stateData];
  return entityRequirement || null;
}

// Helper function to check if filing is required
export function isFilingRequired(stateName: string, entityType: string): boolean {
  const requirement = getFilingRequirement(stateName, entityType);
  return requirement ? requirement.required : false;
}