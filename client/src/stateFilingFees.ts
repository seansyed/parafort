// Comprehensive State Filing Fees for Annual Reports
// Organized by entity type for accurate pricing across all 50 states

export interface EntityFilingFee {
  fee: number;
  frequency: 'annual' | 'biennial';
  dueDate: string;
  lateFee?: number;
  notes?: string;
}

export interface StateFilingFees {
  state: string;
  LLC: EntityFilingFee;
  Corporation: EntityFilingFee;
  'Professional Corporation': EntityFilingFee;
  'Non-Profit Corporation': EntityFilingFee;
}

export const stateFilingFees: { [state: string]: StateFilingFees } = {
  Alabama: {
    state: 'Alabama',
    LLC: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Alaska: {
    state: 'Alaska',
    LLC: {
      fee: 100,
      frequency: 'biennial',
      dueDate: 'January 2nd of even years',
      lateFee: 25,
      notes: 'LLC Biennial Report'
    },
    Corporation: {
      fee: 100,
      frequency: 'biennial',
      dueDate: 'January 2nd of even years',
      lateFee: 25,
      notes: 'Corporation Biennial Report'
    },
    'Professional Corporation': {
      fee: 100,
      frequency: 'biennial',
      dueDate: 'January 2nd of even years',
      lateFee: 25,
      notes: 'Professional Corporation Biennial Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'biennial',
      dueDate: 'January 2nd of even years',
      lateFee: 25,
      notes: 'Non-Profit Corporation Biennial Report'
    }
  },
  Arizona: {
    state: 'Arizona',
    LLC: {
      fee: 0,
      frequency: 'none',
      dueDate: 'No filing required',
      lateFee: 0,
      notes: 'No annual filing requirement for LLCs'
    },
    Corporation: {
      fee: 45,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 15,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 45,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 15,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 15,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Arkansas: {
    state: 'Arkansas',
    LLC: {
      fee: 150,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 300,
      notes: 'LLC Franchise Tax Report'
    },
    Corporation: {
      fee: 150,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 300,
      notes: 'Corporation Franchise Tax Report'
    },
    'Professional Corporation': {
      fee: 150,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 300,
      notes: 'Professional Corporation Franchise Tax Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 300,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  California: {
    state: 'California',
    LLC: {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Within 90 days after filing',
      lateFee: 250,
      notes: 'LLC Statement of Information'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Within 90 days after filing',
      lateFee: 250,
      notes: 'Corporation Statement of Information'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Within 90 days after filing',
      lateFee: 250,
      notes: 'Professional Corporation Statement of Information'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Within 90 days after filing',
      lateFee: 250,
      notes: 'Non-Profit Corporation Statement of Information'
    }
  },
  Colorado: {
    state: 'Colorado',
    LLC: {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'LLC Periodic Report'
    },
    Corporation: {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Corporation Periodic Report'
    },
    'Professional Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Professional Corporation Periodic Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Non-Profit Corporation Periodic Report'
    }
  },
  Connecticut: {
    state: 'Connecticut',
    LLC: {
      fee: 80,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Delaware: {
    state: 'Delaware',
    LLC: {
      fee: 300,
      frequency: 'annual', 
      dueDate: 'June 1st',
      lateFee: 200,
      notes: 'LLC Annual Franchise Tax'
    },
    Corporation: {
      fee: 175,
      frequency: 'annual',
      dueDate: 'March 1st',
      lateFee: 200,
      notes: 'Corporation Franchise Tax'
    },
    'Professional Corporation': {
      fee: 175,
      frequency: 'annual',
      dueDate: 'March 1st',
      lateFee: 200,
      notes: 'Professional Corporation Franchise Tax'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'March 1st',
      lateFee: 200,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Florida: {
    state: 'Florida',
    LLC: {
      fee: 138.75,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 400,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 61.25,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 400,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 61.25,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 400,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 61.25,
      frequency: 'annual',
      dueDate: 'May 1st',
      lateFee: 400,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Georgia: {
    state: 'Georgia',
    LLC: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 50,
      notes: 'LLC Annual Registration'
    },
    Corporation: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 50,
      notes: 'Corporation Annual Registration'
    },
    'Professional Corporation': {
      fee: 50,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 50,
      notes: 'Professional Corporation Annual Registration'
    },
    'Non-Profit Corporation': {
      fee: 30,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 50,
      notes: 'Non-Profit Corporation Annual Registration'
    }
  },
  Hawaii: {
    state: 'Hawaii',
    LLC: {
      fee: 15,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 5,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Idaho: {
    state: 'Idaho',
    LLC: {
      fee: 0,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 30,
      notes: 'LLC Annual Report (No fee)'
    },
    Corporation: {
      fee: 30,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 30,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 30,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 30,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 30,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Illinois: {
    state: 'Illinois',
    LLC: {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 300,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 300,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 300,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 300,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Indiana: {
    state: 'Indiana',
    LLC: {
      fee: 50,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 30,
      notes: 'LLC Biennial Report'
    },
    Corporation: {
      fee: 30,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 30,
      notes: 'Corporation Biennial Report'
    },
    'Professional Corporation': {
      fee: 30,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 30,
      notes: 'Professional Corporation Biennial Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 30,
      notes: 'Non-Profit Corporation Biennial Report'
    }
  },
  Iowa: {
    state: 'Iowa',
    LLC: {
      fee: 45,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 45,
      notes: 'LLC Biennial Report'
    },
    Corporation: {
      fee: 60,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 45,
      notes: 'Corporation Biennial Report'
    },
    'Professional Corporation': {
      fee: 60,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 45,
      notes: 'Professional Corporation Biennial Report'
    },
    'Non-Profit Corporation': {
      fee: 5,
      frequency: 'biennial',
      dueDate: 'Last day of anniversary month',
      lateFee: 45,
      notes: 'Non-Profit Corporation Biennial Report'
    }
  },
  Kansas: {
    state: 'Kansas',
    LLC: {
      fee: 55,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 165,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 55,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 165,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 55,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 165,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 165,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Kentucky: {
    state: 'Kentucky',
    LLC: {
      fee: 15,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 10,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 15,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 10,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 15,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 10,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 15,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 10,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Louisiana: {
    state: 'Louisiana',
    LLC: {
      fee: 35,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 35,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 35,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Maine: {
    state: 'Maine',
    LLC: {
      fee: 85,
      frequency: 'annual',
      dueDate: 'June 1st',
      lateFee: 100,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 85,
      frequency: 'annual',
      dueDate: 'June 1st',
      lateFee: 100,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 85,
      frequency: 'annual',
      dueDate: 'June 1st',
      lateFee: 100,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 35,
      frequency: 'annual',
      dueDate: 'June 1st',
      lateFee: 100,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Maryland: {
    state: 'Maryland',
    LLC: {
      fee: 300,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 100,
      notes: 'LLC Personal Property Return'
    },
    Corporation: {
      fee: 300,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 100,
      notes: 'Corporation Personal Property Return'
    },
    'Professional Corporation': {
      fee: 300,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 100,
      notes: 'Professional Corporation Personal Property Return'
    },
    'Non-Profit Corporation': {
      fee: 0,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 100,
      notes: 'Non-Profit Corporation (Exempt)'
    }
  },
  Massachusetts: {
    state: 'Massachusetts',
    LLC: {
      fee: 500,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 125,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 125,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 15,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Michigan: {
    state: 'Michigan',
    LLC: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'February 15th',
      lateFee: 10,
      notes: 'LLC Annual Statement'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'May 15th',
      lateFee: 10,
      notes: 'Corporation Annual Statement'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'May 15th',
      lateFee: 10,
      notes: 'Professional Corporation Annual Statement'
    },
    'Non-Profit Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'October 1st',
      lateFee: 10,
      notes: 'Non-Profit Corporation Annual Statement'
    }
  },
  Minnesota: {
    state: 'Minnesota',
    LLC: {
      fee: 0,
      frequency: 'annual',
      dueDate: 'December 31st',
      lateFee: 25,
      notes: 'LLC Annual Registration (No fee)'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'December 31st',
      lateFee: 25,
      notes: 'Corporation Annual Registration'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'December 31st',
      lateFee: 25,
      notes: 'Professional Corporation Annual Registration'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'December 31st',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Registration'
    }
  },
  Mississippi: {
    state: 'Mississippi',
    LLC: {
      fee: 0,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 25,
      notes: 'LLC Annual Report (No fee)'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 0,
      frequency: 'annual',
      dueDate: 'April 15th',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report (No fee)'
    }
  },
  Missouri: {
    state: 'Missouri',
    LLC: {
      fee: 45,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 45,
      notes: 'LLC Registration Report'
    },
    Corporation: {
      fee: 45,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 45,
      notes: 'Corporation Registration Report'
    },
    'Professional Corporation': {
      fee: 45,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 45,
      notes: 'Professional Corporation Registration Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 45,
      notes: 'Non-Profit Corporation Registration Report'
    }
  },
  Montana: {
    state: 'Montana',
    LLC: {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Nebraska: {
    state: 'Nebraska',
    LLC: {
      fee: 25,
      frequency: 'biennial',
      dueDate: 'March 1st of odd years',
      lateFee: 10,
      notes: 'LLC Biennial Report'
    },
    Corporation: {
      fee: 25,
      frequency: 'biennial',
      dueDate: 'March 1st of odd years',
      lateFee: 10,
      notes: 'Corporation Biennial Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'biennial',
      dueDate: 'March 1st of odd years',
      lateFee: 10,
      notes: 'Professional Corporation Biennial Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'biennial',
      dueDate: 'March 1st of odd years',
      lateFee: 10,
      notes: 'Non-Profit Corporation Biennial Report'
    }
  },
  Nevada: {
    state: 'Nevada',
    LLC: {
      fee: 350,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 100,
      notes: 'LLC Annual List'
    },
    Corporation: {
      fee: 350,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 100,
      notes: 'Corporation Annual List'
    },
    'Professional Corporation': {
      fee: 350,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 100,
      notes: 'Professional Corporation Annual List'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Last day of anniversary month',
      lateFee: 100,
      notes: 'Non-Profit Corporation Annual List'
    }
  },
  'New Hampshire': {
    state: 'New Hampshire',
    LLC: {
      fee: 100,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 100,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 100,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'April 1st',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  'New Jersey': {
    state: 'New Jersey',
    LLC: {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 75,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 30,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  'New Mexico': {
    state: 'New Mexico',
    LLC: {
      fee: 0,
      frequency: 'annual',
      dueDate: '15th day of 3rd month',
      lateFee: 25,
      notes: 'LLC Report (No fee)'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: '15th day of 3rd month',
      lateFee: 25,
      notes: 'Corporation Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: '15th day of 3rd month',
      lateFee: 25,
      notes: 'Professional Corporation Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: '15th day of 3rd month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Report'
    }
  },
  'New York': {
    state: 'New York',
    LLC: {
      fee: 9,
      frequency: 'biennial',
      dueDate: 'Anniversary month of even years',
      lateFee: 20,
      notes: 'LLC Biennial Statement'
    },
    Corporation: {
      fee: 9,
      frequency: 'biennial',
      dueDate: 'Anniversary month of even years',
      lateFee: 20,
      notes: 'Corporation Biennial Statement'
    },
    'Professional Corporation': {
      fee: 9,
      frequency: 'biennial',
      dueDate: 'Anniversary month of even years',
      lateFee: 20,
      notes: 'Professional Corporation Biennial Statement'
    },
    'Non-Profit Corporation': {
      fee: 9,
      frequency: 'biennial',
      dueDate: 'Anniversary month of even years',
      lateFee: 20,
      notes: 'Non-Profit Corporation Biennial Statement'
    }
  },
  'North Carolina': {
    state: 'North Carolina',
    LLC: {
      fee: 200,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  'North Dakota': {
    state: 'North Dakota',
    LLC: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'November 15th',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'November 15th',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'November 15th',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'November 15th',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Ohio: {
    state: 'Ohio',
    LLC: {
      fee: 0,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'LLC Report (No fee)'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Corporation Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Professional Corporation Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Report'
    }
  },
  Oklahoma: {
    state: 'Oklahoma',
    LLC: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'LLC Certificate of Compliance'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Corporation Certificate of Compliance'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Professional Corporation Certificate of Compliance'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Non-Profit Corporation Certificate of Compliance'
    }
  },
  Oregon: {
    state: 'Oregon',
    LLC: {
      fee: 100,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 100,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 100,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Pennsylvania: {
    state: 'Pennsylvania',
    LLC: {
      fee: 70,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 5,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 70,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 5,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 70,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 5,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 70,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 5,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  'Rhode Island': {
    state: 'Rhode Island',
    LLC: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 100,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  'South Carolina': {
    state: 'South Carolina',
    LLC: {
      fee: 0,
      frequency: 'biennial',
      dueDate: 'Anniversary month of even years',
      lateFee: 10,
      notes: 'LLC Biennial Report (No fee)'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  'South Dakota': {
    state: 'South Dakota',
    LLC: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 15,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 15,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 15,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 15,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Tennessee: {
    state: 'Tennessee',
    LLC: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Texas: {
    state: 'Texas',
    LLC: {
      fee: 0,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'LLC Public Information Report (No fee)'
    },
    Corporation: {
      fee: 0,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Corporation Public Information Report (No fee)'
    },
    'Professional Corporation': {
      fee: 0,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Professional Corporation Public Information Report (No fee)'
    },
    'Non-Profit Corporation': {
      fee: 0,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Public Information Report (No fee)'
    }
  },
  Utah: {
    state: 'Utah',
    LLC: {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 20,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 10,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Vermont: {
    state: 'Vermont',
    LLC: {
      fee: 35,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 35,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 35,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Virginia: {
    state: 'Virginia',
    LLC: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Last day of registration month',
      lateFee: 100,
      notes: 'LLC Annual Registration'
    },
    Corporation: {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Last day of registration month',
      lateFee: 100,
      notes: 'Corporation Annual Registration'
    },
    'Professional Corporation': {
      fee: 50,
      frequency: 'annual',
      dueDate: 'Last day of registration month',
      lateFee: 100,
      notes: 'Professional Corporation Annual Registration'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Last day of registration month',
      lateFee: 100,
      notes: 'Non-Profit Corporation Annual Registration'
    }
  },
  Washington: {
    state: 'Washington',
    LLC: {
      fee: 60,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 20,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 60,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 20,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 60,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 20,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 20,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  'West Virginia': {
    state: 'West Virginia',
    LLC: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'June 30th',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Wisconsin: {
    state: 'Wisconsin',
    LLC: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary quarter',
      lateFee: 25,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary quarter',
      lateFee: 25,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary quarter',
      lateFee: 25,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 10,
      frequency: 'annual',
      dueDate: 'Anniversary quarter',
      lateFee: 25,
      notes: 'Non-Profit Corporation Annual Report'
    }
  },
  Wyoming: {
    state: 'Wyoming',
    LLC: {
      fee: 60,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'LLC Annual Report'
    },
    Corporation: {
      fee: 60,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Corporation Annual Report'
    },
    'Professional Corporation': {
      fee: 60,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Professional Corporation Annual Report'
    },
    'Non-Profit Corporation': {
      fee: 25,
      frequency: 'annual',
      dueDate: 'Anniversary month',
      lateFee: 50,
      notes: 'Non-Profit Corporation Annual Report'
    }
  }
};

// Helper function to get filing fee for specific state and entity type
export function getStateFilingFee(state: string, entityType: 'LLC' | 'Corporation' | 'Professional Corporation' | 'Non-Profit Corporation'): EntityFilingFee | null {
  const stateData = stateFilingFees[state];
  if (!stateData) return null;
  
  return stateData[entityType] || null;
}

// Helper function to get all entity types for a state
export function getStateEntityTypes(state: string): string[] {
  const stateData = stateFilingFees[state];
  if (!stateData) return [];
  
  return Object.keys(stateData).filter(key => key !== 'state');
}

// Legacy support - returns fee for backwards compatibility
export function getStateFee(state: string, entityType?: string): number {
  const stateData = stateFilingFees[state];
  if (!stateData) return 0;
  
  if (entityType && stateData[entityType as keyof StateFilingFees]) {
    return (stateData[entityType as keyof StateFilingFees] as EntityFilingFee).fee;
  }
  
  // Default to LLC fee for backwards compatibility
  return stateData.LLC.fee;
}