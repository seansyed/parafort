import { useState } from 'react';
import { Link } from 'wouter';
import { USAMapSelect } from "react-usa-map-select";

interface StateRequirement {
  state: string;
  abbreviation: string;
  howToStart: {
    steps: string[];
    timeframe: string;
    difficulty: 'Easy' | 'Moderate' | 'Complex';
  };
  pros: string[];
  cons: string[];
  costs: {
    llcFiling: string;
    corpFiling: string;
    registeredAgent: string;
    annualReport: string;
  };
  dueDates: {
    llcAnnualReport: string;
    corpAnnualReport: string;
    taxFiling: string;
  };
  yearlyFees: {
    llc: string;
    corporation: string;
    franchise: string;
  };
  compliance: {
    requirements: string[];
    penalties: string[];
    renewals: string[];
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  businessClimate: {
    rating: number;
    keyFeatures: string[];
  };
}

const stateRequirements: StateRequirement[] = [
  {
    state: "Alabama",
    abbreviation: "AL",
    howToStart: {
      steps: [
        "Choose your business name and check availability",
        "Designate a registered agent in Alabama",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain EIN from the IRS",
        "Register for Alabama business privilege tax",
        "Obtain necessary business licenses"
      ],
      timeframe: "10-15 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Low cost of living and doing business",
      "Business-friendly tax environment",
      "Growing economic development",
      "Strategic location for logistics",
      "Competitive filing fees",
      "Simple compliance requirements"
    ],
    cons: [
      "Annual business privilege tax required",
      "Must file annual report",
      "Limited legal precedent",
      "Smaller business ecosystem",
      "Must use Alabama registered agent"
    ],
    costs: {
      llcFiling: "$200",
      corpFiling: "$200",
      registeredAgent: "$100-250/year",
      annualReport: "$100"
    },
    dueDates: {
      llcAnnualReport: "March 15th",
      corpAnnualReport: "March 15th", 
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$100 business privilege tax",
      corporation: "$100+ business privilege tax",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual business privilege tax return",
        "Maintain registered agent",
        "Keep corporate records",
        "File annual report",
        "Renew business licenses"
      ],
      penalties: [
        "$25 penalty for late annual report",
        "Interest on late tax payments",
        "Administrative dissolution for non-compliance"
      ],
      renewals: [
        "Business privilege tax due March 15th",
        "Annual report due March 15th",
        "Business license renewals vary"
      ]
    },
    faqs: [
      {
        question: "What is Alabama's business privilege tax?",
        answer: "It's an annual tax based on the entity's net worth in Alabama. The minimum is $100 for most small businesses."
      },
      {
        question: "Do I need to be an Alabama resident to form a business?",
        answer: "No, you don't need to be a resident, but you must have a registered agent with an Alabama address."
      },
      {
        question: "How long does it take to form a business in Alabama?",
        answer: "Standard processing takes 10-15 business days. Expedited processing is available for additional fees."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Low cost of business operations",
        "Growing economic development",
        "Strategic logistics location",
        "Business-friendly policies"
      ]
    }
  },
  {
    state: "Alaska",
    abbreviation: "AK",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate an Alaska registered agent",
        "File Articles of Organization or Articles of Incorporation",
        "Create operating agreement or corporate bylaws",
        "Obtain federal EIN",
        "Register for Alaska business license if required",
        "Obtain industry-specific permits"
      ],
      timeframe: "5-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "No state income tax",
      "No sales tax",
      "Rich natural resources",
      "Government contracts opportunities",
      "Tourism industry potential",
      "Simple filing process"
    ],
    cons: [
      "High cost of living",
      "Limited market size",
      "Geographic isolation",
      "Higher operating costs",
      "Seasonal business challenges"
    ],
    costs: {
      llcFiling: "$250",
      corpFiling: "$250",
      registeredAgent: "$150-300/year",
      annualReport: "$100"
    },
    dueDates: {
      llcAnnualReport: "January 2nd",
      corpAnnualReport: "January 2nd",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$100 biennial report",
      corporation: "$100 biennial report",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File biennial report every two years",
        "Maintain registered agent",
        "Keep corporate records",
        "Alaska business license if applicable"
      ],
      penalties: [
        "$25 penalty for late biennial report",
        "Dissolution for non-filing",
        "Reinstatement fees"
      ],
      renewals: [
        "Biennial report due January 2nd (odd years)",
        "Business license renewals vary",
        "Professional license renewals"
      ]
    },
    faqs: [
      {
        question: "Does Alaska have any business taxes?",
        answer: "Alaska has no state income tax or sales tax, but may have local taxes and specific industry taxes like oil and gas production taxes."
      },
      {
        question: "How often do I need to file reports in Alaska?",
        answer: "Alaska requires a biennial report every two years, due on January 2nd of odd-numbered years."
      },
      {
        question: "What business opportunities exist in Alaska?",
        answer: "Key industries include oil and gas, fishing, tourism, government contracting, and natural resource extraction."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "No state income or sales tax",
        "Natural resource opportunities",
        "Government contract potential",
        "Tourism industry growth"
      ]
    }
  },
  {
    state: "Delaware",
    abbreviation: "DE",
    howToStart: {
      steps: [
        "Choose your business name and verify availability",
        "Designate a registered agent in Delaware",
        "File Certificate of Formation (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain EIN from the IRS",
        "Register for state taxes if applicable",
        "Obtain necessary business licenses and permits"
      ],
      timeframe: "1-2 business days (expedited available)",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly laws and court system",
      "No sales tax on business purchases",
      "Strong corporate law framework",
      "Court of Chancery specializes in business disputes",
      "Favorable tax structure for holding companies",
      "Privacy protection for owners",
      "Fast filing process"
    ],
    cons: [
      "Must pay franchise tax annually",
      "More expensive than some states",
      "Must use Delaware registered agent",
      "Complex tax calculations for larger entities",
      "Higher filing fees"
    ],
    costs: {
      llcFiling: "$90",
      corpFiling: "$89",
      registeredAgent: "$50-200/year",
      annualReport: "$300 (franchise tax)"
    },
    dueDates: {
      llcAnnualReport: "June 1st",
      corpAnnualReport: "March 1st",
      taxFiling: "March 15th (varies by entity)"
    },
    yearlyFees: {
      llc: "$300 minimum franchise tax",
      corporation: "$175-400,000+ (based on shares/assets)",
      franchise: "Based on authorized shares or assumed par value"
    },
    compliance: {
      requirements: [
        "Annual franchise tax payment",
        "Maintain registered agent",
        "Keep corporate records",
        "Hold annual meetings (corporations)",
        "File annual report"
      ],
      penalties: [
        "$200 penalty for late franchise tax",
        "Administrative dissolution for non-payment",
        "$125 penalty for late annual report"
      ],
      renewals: [
        "Franchise tax due June 1st (LLC) / March 1st (Corp)",
        "Registered agent service renewal",
        "Business license renewals"
      ]
    },
    faqs: [
      {
        question: "Why is Delaware so popular for businesses?",
        answer: "Delaware offers a specialized Court of Chancery, well-developed corporate law, business-friendly policies, and privacy protections that make it attractive to businesses of all sizes."
      },
      {
        question: "Do I need to live in Delaware to form a business there?",
        answer: "No, you don't need to be a Delaware resident. However, you must have a registered agent with a Delaware address."
      },
      {
        question: "What is the Delaware franchise tax?",
        answer: "It's an annual tax that all Delaware entities must pay. For LLCs, it's $300. For corporations, it ranges from $175 to potentially much higher based on authorized shares."
      },
      {
        question: "How quickly can I form a business in Delaware?",
        answer: "Standard processing is 1-2 business days. Same-day and 2-hour expedited services are available for additional fees."
      }
    ],
    businessClimate: {
      rating: 9,
      keyFeatures: [
        "World-renowned corporate legal system",
        "No sales tax for business purchases",
        "Excellent privacy protections",
        "Fast and efficient filing process"
      ]
    }
  },
  {
    state: "Nevada",
    abbreviation: "NV",
    howToStart: {
      steps: [
        "Choose and reserve your business name",
        "Appoint a registered agent in Nevada",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or corporate bylaws",
        "Obtain federal EIN",
        "Register for Nevada business license",
        "Obtain required industry-specific licenses"
      ],
      timeframe: "3-5 business days",
      difficulty: "Easy"
    },
    pros: [
      "No state income tax",
      "No corporate income tax",
      "Strong privacy protections",
      "Minimal reporting requirements",
      "Business-friendly regulations",
      "No franchise tax",
      "Asset protection benefits"
    ],
    cons: [
      "Must file annual list of officers/directors",
      "Higher annual fees than some states",
      "Must use Nevada registered agent",
      "Commerce tax for businesses over $4M revenue",
      "Limited court precedent compared to Delaware"
    ],
    costs: {
      llcFiling: "$75",
      corpFiling: "$75",
      registeredAgent: "$100-300/year",
      annualReport: "$150 (LLC) / $150 (Corp)"
    },
    dueDates: {
      llcAnnualReport: "Last day of anniversary month",
      corpAnnualReport: "Last day of anniversary month",
      taxFiling: "March 15th (federal)"
    },
    yearlyFees: {
      llc: "$150 annual list fee",
      corporation: "$150 annual list fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual list of managers/officers",
        "Maintain registered agent",
        "Keep corporate records",
        "Nevada business license renewal",
        "Industry-specific license renewals"
      ],
      penalties: [
        "$100 penalty for late annual list",
        "Forfeiture for non-filing",
        "$50 reinstatement fee"
      ],
      renewals: [
        "Annual list due by end of anniversary month",
        "Business license renewal varies by industry",
        "Registered agent service annual renewal"
      ]
    },
    faqs: [
      {
        question: "Does Nevada really have no state income tax?",
        answer: "Correct! Nevada has no state income tax for individuals or corporations, making it very tax-friendly for business owners."
      },
      {
        question: "What is Nevada's commerce tax?",
        answer: "It's a tax on businesses with Nevada gross revenue over $4 million annually. The rate varies by industry, starting at 0.051%."
      },
      {
        question: "How private are Nevada business filings?",
        answer: "Nevada offers strong privacy protections. Member/shareholder information is not required in public filings, and nominee services are permitted."
      },
      {
        question: "What is the annual list requirement?",
        answer: "All Nevada entities must file an annual list showing current officers, directors, or managers. It's due by the last day of the anniversary month."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Zero state income tax",
        "Strong asset protection laws",
        "Excellent privacy protections",
        "Business-friendly regulations"
      ]
    }
  },
  {
    state: "Wyoming",
    abbreviation: "WY",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a Wyoming registered agent",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Draft operating agreement or bylaws",
        "Obtain EIN from IRS",
        "Register for Wyoming unemployment tax if hiring employees",
        "Obtain necessary business licenses"
      ],
      timeframe: "1-2 business days",
      difficulty: "Easy"
    },
    pros: [
      "No state income tax",
      "No corporate income tax",
      "Low filing fees",
      "Minimal reporting requirements",
      "Strong privacy protections",
      "Business-friendly laws",
      "Fast processing times"
    ],
    cons: [
      "Limited legal precedent",
      "Must use Wyoming registered agent",
      "Annual report required",
      "Smaller business ecosystem",
      "Less developed corporate law"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$100",
      registeredAgent: "$50-200/year",
      annualReport: "$50 (LLC) / $50 (Corp)"
    },
    dueDates: {
      llcAnnualReport: "First day of anniversary month",
      corpAnnualReport: "First day of anniversary month",
      taxFiling: "March 15th (federal)"
    },
    yearlyFees: {
      llc: "$50 annual report fee",
      corporation: "$50 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep business records",
        "Renew business licenses as needed"
      ],
      penalties: [
        "$25 penalty for late annual report",
        "Dissolution for non-filing after 2 years",
        "Reinstatement fees vary"
      ],
      renewals: [
        "Annual report due on 1st of anniversary month",
        "Registered agent service renewal",
        "Business license renewals as applicable"
      ]
    },
    faqs: [
      {
        question: "Why choose Wyoming for business formation?",
        answer: "Wyoming offers no state income tax, low fees, strong privacy laws, and minimal compliance requirements, making it very business-friendly."
      },
      {
        question: "What privacy protections does Wyoming offer?",
        answer: "Wyoming allows nominee services and doesn't require member/shareholder information in public filings, providing excellent privacy protection."
      },
      {
        question: "Are there any taxes for Wyoming businesses?",
        answer: "No state income tax, but businesses may be subject to federal taxes and local taxes. Wyoming has no franchise tax."
      },
      {
        question: "How often must I file reports in Wyoming?",
        answer: "Annual reports are due on the first day of the anniversary month of formation. The fee is $50 for both LLCs and corporations."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "No state income tax",
        "Very low filing fees",
        "Minimal reporting requirements",
        "Strong privacy protections"
      ]
    }
  },
  {
    state: "Texas",
    abbreviation: "TX",
    howToStart: {
      steps: [
        "Search and reserve business name if desired",
        "Designate a registered agent in Texas",
        "File Certificate of Formation with Texas Secretary of State",
        "Create operating agreement or corporate bylaws",
        "Obtain federal EIN",
        "Register for Texas state taxes",
        "Obtain required permits and licenses"
      ],
      timeframe: "2-3 business days",
      difficulty: "Moderate"
    },
    pros: [
      "No state income tax",
      "Large, diverse economy",
      "Business-friendly environment",
      "Access to major markets",
      "Strong infrastructure",
      "Abundant workforce",
      "Low cost of living"
    ],
    cons: [
      "Franchise tax for most entities",
      "Higher registered agent costs",
      "More complex tax requirements",
      "Annual report required",
      "Higher filing fees than some states"
    ],
    costs: {
      llcFiling: "$300",
      corpFiling: "$300",
      registeredAgent: "$150-400/year",
      annualReport: "No separate fee (included in franchise tax)"
    },
    dueDates: {
      llcAnnualReport: "May 15th (franchise tax report)",
      corpAnnualReport: "May 15th (franchise tax report)",
      taxFiling: "May 15th (franchise tax)"
    },
    yearlyFees: {
      llc: "$0-$1,180,000+ (based on revenue)",
      corporation: "$0-$1,180,000+ (based on revenue)",
      franchise: "Minimum $800 if revenue > $1,230,000"
    },
    compliance: {
      requirements: [
        "File annual franchise tax report",
        "Maintain registered agent",
        "Keep corporate records",
        "Renew business permits",
        "File periodic reports if required"
      ],
      penalties: [
        "5% penalty per month for late franchise tax",
        "Forfeiture for non-payment",
        "$25-50 penalties for late filings"
      ],
      renewals: [
        "Franchise tax report due May 15th",
        "Business permits renewal varies",
        "Professional licenses renewal as required"
      ]
    },
    faqs: [
      {
        question: "What is the Texas franchise tax?",
        answer: "It's an annual tax on most business entities doing business in Texas. The rate is generally 0.375% to 0.75% of margin (revenue minus certain deductions)."
      },
      {
        question: "Do all Texas businesses pay franchise tax?",
        answer: "No, businesses with annual revenue under $1,230,000 are exempt from franchise tax but must still file a no-tax-due report."
      },
      {
        question: "Why are Texas filing fees higher?",
        answer: "Texas has higher base filing fees but offers a large, robust market and no state income tax, which can offset the higher initial costs."
      },
      {
        question: "What makes Texas business-friendly?",
        answer: "No state income tax, strong infrastructure, access to diverse markets, abundant workforce, and generally supportive business policies."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "No state income tax",
        "Large, diverse economy",
        "Business-friendly policies",
        "Strong infrastructure"
      ]
    }
  },
  {
    state: "California",
    abbreviation: "CA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a California registered agent",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register with California tax agencies",
        "Obtain business licenses and permits",
        "File Statement of Information"
      ],
      timeframe: "5-7 business days",
      difficulty: "Complex"
    },
    pros: [
      "Access to largest U.S. state economy",
      "Innovation and technology hub",
      "Diverse talent pool",
      "Access to venture capital",
      "Strong consumer market",
      "International trade opportunities",
      "Established business infrastructure"
    ],
    cons: [
      "High annual franchise tax",
      "Complex regulatory environment",
      "High cost of doing business",
      "Extensive compliance requirements",
      "High state income tax rates",
      "Expensive filing fees",
      "Lengthy processing times"
    ],
    costs: {
      llcFiling: "$70",
      corpFiling: "$100",
      registeredAgent: "$200-500/year",
      annualReport: "$20 (Statement of Information)"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary month",
      corpAnnualReport: "By end of anniversary month",
      taxFiling: "March 15th (state) / varies by entity"
    },
    yearlyFees: {
      llc: "$800 minimum franchise tax",
      corporation: "$800 minimum franchise tax + income tax",
      franchise: "Additional based on income/gross receipts"
    },
    compliance: {
      requirements: [
        "Pay annual franchise tax",
        "File Statement of Information biennially",
        "Maintain registered agent",
        "Keep detailed corporate records",
        "File various state tax returns",
        "Comply with employment laws",
        "Renew business licenses"
      ],
      penalties: [
        "$250 penalty for late franchise tax",
        "$25 penalty for late Statement of Information",
        "Suspension/forfeiture for non-compliance",
        "Interest on late payments"
      ],
      renewals: [
        "Franchise tax due 15th day of 4th month",
        "Statement of Information due by end of anniversary month",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is California's franchise tax so high?",
        answer: "California's $800 minimum franchise tax helps fund state services and programs. The fee applies to all entities doing business in California."
      },
      {
        question: "Can I avoid California taxes by forming elsewhere?",
        answer: "If you do business in California, you'll likely need to register and pay taxes there regardless of where you're formed."
      },
      {
        question: "What is the Statement of Information?",
        answer: "It's a biennial filing that updates the state on your business's current information, including officers, directors, and addresses."
      },
      {
        question: "Is it worth forming in California despite the costs?",
        answer: "For businesses operating in California, the access to markets, talent, and opportunities often justifies the higher costs and compliance burden."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Largest state economy",
        "Innovation hub",
        "Access to capital",
        "Diverse markets"
      ]
    }
  },
  {
    state: "Arizona",
    abbreviation: "AZ",
    howToStart: {
      steps: [
        "Choose and reserve your business name",
        "Designate a statutory agent in Arizona",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Arizona state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "No publication requirement for LLCs",
      "Business-friendly environment",
      "Low cost of living",
      "Growing economy",
      "Simple filing process",
      "No franchise tax",
      "Fast processing times"
    ],
    cons: [
      "Must file annual report",
      "Hot climate may limit some businesses",
      "Water scarcity concerns",
      "Limited public transportation"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$60",
      registeredAgent: "$100-200/year",
      annualReport: "$45"
    },
    dueDates: {
      llcAnnualReport: "By anniversary date",
      corpAnnualReport: "By anniversary date",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$45 annual report fee",
      corporation: "$45 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain statutory agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due on anniversary date",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Does Arizona require publication for LLCs?",
        answer: "No, Arizona does not require LLC formation to be published in newspapers, unlike some other states."
      },
      {
        question: "What is a statutory agent?",
        answer: "A statutory agent is Arizona's term for a registered agent - the person or company that accepts legal documents on behalf of your business."
      },
      {
        question: "Can I be my own statutory agent?",
        answer: "Yes, if you have a physical address in Arizona and are available during business hours to accept service of process."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Business-friendly policies",
        "Low taxes",
        "Growing tech sector",
        "Strategic location"
      ]
    }
  },
  {
    state: "Arkansas",
    abbreviation: "AR",
    howToStart: {
      steps: [
        "Choose and check business name availability",
        "Designate a registered agent in Arkansas",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Arkansas state taxes",
        "Obtain necessary business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Low filing fees",
      "Business-friendly environment",
      "Low cost of living",
      "Central location",
      "Simple compliance requirements",
      "No franchise tax"
    ],
    cons: [
      "Smaller economy",
      "Limited access to capital",
      "Rural areas may lack infrastructure",
      "Must file annual report"
    ],
    costs: {
      llcFiling: "$45",
      corpFiling: "$50",
      registeredAgent: "$100-200/year",
      annualReport: "$150 (LLC), $75 (Corp)"
    },
    dueDates: {
      llcAnnualReport: "May 1st",
      corpAnnualReport: "May 1st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$150 annual report fee",
      corporation: "$75 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due May 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is LLC annual report fee higher than corporation?",
        answer: "Arkansas has different fee structures for different entity types. LLCs pay $150 while corporations pay $75 for annual reports."
      },
      {
        question: "Can I file my annual report online?",
        answer: "Yes, Arkansas allows online filing of annual reports through the Secretary of State's website."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Low business costs",
        "Central location",
        "Business incentives",
        "Growing industries"
      ]
    }
  },
  {
    state: "Colorado",
    abbreviation: "CO",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Colorado",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Colorado state taxes",
        "Obtain required business licenses",
        "File periodic report"
      ],
      timeframe: "5-7 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Business-friendly environment",
      "Growing tech and startup scene",
      "Educated workforce",
      "Outdoor lifestyle attracts talent",
      "Strategic location",
      "Reasonable filing fees"
    ],
    cons: [
      "Higher cost of living in Denver/Boulder",
      "Competitive business environment",
      "Must file periodic report",
      "State income tax required"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$50",
      registeredAgent: "$150-300/year",
      annualReport: "$10 (periodic report)"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary month",
      corpAnnualReport: "By end of anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$10 periodic report fee",
      corporation: "$10 periodic report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File periodic report annually",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for periodic report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Periodic report due by end of anniversary month",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is Colorado's periodic report?",
        answer: "Colorado's periodic report is similar to an annual report in other states. It updates the state on your business's current information."
      },
      {
        question: "Is Colorado good for startups?",
        answer: "Yes, Colorado has a thriving startup ecosystem, especially in Denver and Boulder, with access to capital and talent."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Innovation hub",
        "Educated workforce",
        "Business incentives",
        "Quality of life"
      ]
    }
  },
  {
    state: "Connecticut",
    abbreviation: "CT",
    howToStart: {
      steps: [
        "Choose and reserve business name",
        "Designate a registered agent in Connecticut",
        "File Certificate of Organization (LLC) or Certificate of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Connecticut state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Proximity to New York City",
      "Educated workforce",
      "Strong financial services sector",
      "Good infrastructure",
      "Access to capital markets"
    ],
    cons: [
      "High cost of living",
      "High state taxes",
      "Expensive filing fees",
      "Must file annual report",
      "Business entity tax required"
    ],
    costs: {
      llcFiling: "$120",
      corpFiling: "$250",
      registeredAgent: "$200-400/year",
      annualReport: "$80"
    },
    dueDates: {
      llcAnnualReport: "March 31st",
      corpAnnualReport: "March 31st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$80 annual report fee",
      corporation: "$80 annual report fee + business entity tax",
      franchise: "Business entity tax based on authorized shares"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay business entity tax",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due March 31st",
        "Business entity tax due March 31st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is Connecticut's business entity tax?",
        answer: "Connecticut imposes an annual business entity tax on corporations based on authorized capital stock, with a minimum of $250."
      },
      {
        question: "Why are Connecticut's filing fees higher?",
        answer: "Connecticut has higher filing fees compared to many states, but offers proximity to major markets and a skilled workforce."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Proximity to NYC",
        "Financial sector strength",
        "Educated workforce",
        "Good infrastructure"
      ]
    }
  },
  {
    state: "Florida",
    abbreviation: "FL",
    howToStart: {
      steps: [
        "Choose and check business name availability",
        "Designate a registered agent in Florida",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Florida state taxes if applicable",
        "Obtain required business licenses"
      ],
      timeframe: "3-5 business days",
      difficulty: "Easy"
    },
    pros: [
      "No state income tax",
      "Business-friendly environment",
      "Large consumer market",
      "International business hub",
      "Year-round business activity",
      "Fast processing times",
      "Tourism and retiree influx"
    ],
    cons: [
      "Must file annual report",
      "Hurricane risk",
      "Competitive market",
      "Hot and humid climate",
      "Sales tax required for most businesses"
    ],
    costs: {
      llcFiling: "$125",
      corpFiling: "$70",
      registeredAgent: "$150-300/year",
      annualReport: "$138.75 (LLC), $150 (Corp)"
    },
    dueDates: {
      llcAnnualReport: "May 1st",
      corpAnnualReport: "By anniversary date",
      taxFiling: "No state income tax"
    },
    yearlyFees: {
      llc: "$138.75 annual report fee",
      corporation: "$150 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "Register for sales tax if applicable",
        "Renew business licenses"
      ],
      penalties: [
        "$400 penalty for late annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid fees"
      ],
      renewals: [
        "LLC annual report due May 1st",
        "Corporation annual report due on anniversary date",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is Florida popular for business formation?",
        answer: "Florida has no state income tax, is business-friendly, offers fast processing, and provides access to large domestic and international markets."
      },
      {
        question: "Do I need to collect sales tax in Florida?",
        answer: "Most businesses selling tangible goods or certain services in Florida must register for and collect sales tax."
      },
      {
        question: "What happens if I file my annual report late?",
        answer: "Florida imposes a $400 penalty for late annual reports and may administratively dissolve your entity for non-compliance."
      }
    ],
    businessClimate: {
      rating: 9,
      keyFeatures: [
        "No state income tax",
        "Business-friendly policies",
        "Large market access",
        "International gateway"
      ]
    }
  },
  {
    state: "Georgia",
    abbreviation: "GA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Georgia",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Georgia state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of doing business",
      "Strategic location",
      "Growing economy",
      "Reasonable filing fees",
      "No franchise tax",
      "Strong logistics hub"
    ],
    cons: [
      "Must file annual registration",
      "State income tax required",
      "Sales tax registration needed",
      "Hurricane risk in coastal areas"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$100",
      registeredAgent: "$100-250/year",
      annualReport: "$50"
    },
    dueDates: {
      llcAnnualReport: "April 1st",
      corpAnnualReport: "April 1st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$50 annual registration",
      corporation: "$50 annual registration",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual registration",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual registration",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual registration due April 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Georgia good for business?",
        answer: "Yes, Georgia consistently ranks as one of the best states for business due to its pro-business policies and strategic location."
      },
      {
        question: "What is Georgia's annual registration?",
        answer: "Georgia requires an annual registration filing to keep your business in good standing, which costs $50 and is due April 1st."
      }
    ],
    businessClimate: {
      rating: 9,
      keyFeatures: [
        "Top business rankings",
        "Strategic location",
        "Low business costs",
        "Strong infrastructure"
      ]
    }
  },
  {
    state: "Hawaii",
    abbreviation: "HI",
    howToStart: {
      steps: [
        "Choose and reserve business name",
        "Designate a registered agent in Hawaii",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Hawaii state taxes",
        "Obtain required business licenses",
        "Register for General Excise Tax"
      ],
      timeframe: "10-15 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Unique market location",
      "Tourism industry opportunities",
      "Strategic Pacific location",
      "Island lifestyle",
      "Limited competition in some sectors"
    ],
    cons: [
      "High cost of living",
      "Expensive shipping and logistics",
      "Limited local market",
      "High state taxes",
      "Complex tax structure"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$50",
      registeredAgent: "$200-400/year",
      annualReport: "$15"
    },
    dueDates: {
      llcAnnualReport: "March 31st",
      corpAnnualReport: "March 31st",
      taxFiling: "March 20th"
    },
    yearlyFees: {
      llc: "$15 annual report fee",
      corporation: "$15 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Register for General Excise Tax",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Forfeiture for non-compliance"
      ],
      renewals: [
        "Annual report due March 31st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is Hawaii's General Excise Tax?",
        answer: "Hawaii's GET is similar to a sales tax but applies to almost all business activities, including services, with rates from 0.15% to 4.5%."
      },
      {
        question: "Is it expensive to do business in Hawaii?",
        answer: "Yes, Hawaii has a high cost of living and doing business due to its remote location and import dependencies."
      }
    ],
    businessClimate: {
      rating: 5,
      keyFeatures: [
        "Unique location",
        "Tourism opportunities",
        "Pacific gateway",
        "Limited competition"
      ]
    }
  },
  {
    state: "Idaho",
    abbreviation: "ID",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Idaho",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Idaho state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of living",
      "No franchise tax",
      "Growing tech sector",
      "Strategic location",
      "Reasonable filing fees"
    ],
    cons: [
      "Smaller market size",
      "Limited access to capital",
      "Rural infrastructure",
      "Must file annual report"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$100",
      registeredAgent: "$100-200/year",
      annualReport: "$30"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary month",
      corpAnnualReport: "By end of anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$30 annual report fee",
      corporation: "$30 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$20 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due by end of anniversary month",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Idaho good for tech companies?",
        answer: "Yes, Idaho has a growing tech sector with companies like Micron Technology and is attracting new tech businesses with favorable policies."
      },
      {
        question: "What are Idaho's advantages for small businesses?",
        answer: "Idaho offers low costs, business-friendly regulations, no franchise tax, and a supportive environment for entrepreneurs."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Business-friendly policies",
        "Low costs",
        "Growing tech sector",
        "Quality of life"
      ]
    }
  },
  {
    state: "Illinois",
    abbreviation: "IL",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Illinois",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Illinois state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Major business hub",
      "Access to large markets",
      "Excellent transportation infrastructure",
      "Educated workforce",
      "Diverse economy",
      "Central location"
    ],
    cons: [
      "High state taxes",
      "Complex regulatory environment",
      "High cost of doing business in Chicago",
      "Must file annual report",
      "Franchise tax required"
    ],
    costs: {
      llcFiling: "$150",
      corpFiling: "$175",
      registeredAgent: "$150-350/year",
      annualReport: "$75"
    },
    dueDates: {
      llcAnnualReport: "By anniversary date",
      corpAnnualReport: "By anniversary date",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$75 annual report fee",
      corporation: "$75 annual report fee + franchise tax",
      franchise: "$2.50 per $1,000 of stated capital"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay franchise tax (corporations)",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due on anniversary date",
        "Franchise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why are Illinois taxes so high?",
        answer: "Illinois has financial challenges that have led to higher tax rates to fund state operations and debt obligations."
      },
      {
        question: "Is Chicago still a good place for business?",
        answer: "Despite high taxes, Chicago remains a major business hub with excellent infrastructure and access to markets."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Major business hub",
        "Excellent infrastructure",
        "Central location",
        "Diverse economy"
      ]
    }
  },
  {
    state: "Indiana",
    abbreviation: "IN",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Indiana",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Indiana state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of doing business",
      "Central location",
      "Good transportation infrastructure",
      "Reasonable filing fees",
      "Manufacturing base"
    ],
    cons: [
      "Must file biennial report",
      "State income tax required",
      "Smaller market size",
      "Weather challenges"
    ],
    costs: {
      llcFiling: "$95",
      corpFiling: "$90",
      registeredAgent: "$100-250/year",
      annualReport: "$30 (biennial)"
    },
    dueDates: {
      llcAnnualReport: "Every two years by July 31st",
      corpAnnualReport: "Every two years by July 31st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$30 biennial report fee",
      corporation: "$30 biennial report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File biennial report every two years",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$30 late fee for biennial report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Biennial report due every two years by July 31st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why does Indiana require biennial reports?",
        answer: "Indiana requires reports every two years instead of annually, which reduces the compliance burden and costs for businesses."
      },
      {
        question: "Is Indiana good for manufacturing?",
        answer: "Yes, Indiana has a strong manufacturing base and offers incentives for manufacturing businesses."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Business-friendly policies",
        "Low costs",
        "Central location",
        "Manufacturing strength"
      ]
    }
  },
  {
    state: "Iowa",
    abbreviation: "IA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Iowa",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Iowa state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of living",
      "Central location",
      "Strong agriculture sector",
      "Educated workforce",
      "Low crime rates"
    ],
    cons: [
      "Smaller market size",
      "Limited access to capital",
      "Must file biennial report",
      "Rural infrastructure in some areas"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$50",
      registeredAgent: "$100-200/year",
      annualReport: "$45 (biennial)"
    },
    dueDates: {
      llcAnnualReport: "Every two years by April 1st",
      corpAnnualReport: "Every two years by April 1st",
      taxFiling: "March 31st"
    },
    yearlyFees: {
      llc: "$45 biennial report fee",
      corporation: "$45 biennial report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File biennial report every two years",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for biennial report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Biennial report due every two years by April 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What are Iowa's advantages for businesses?",
        answer: "Iowa offers low costs, a skilled workforce, business-friendly policies, and strong support for agriculture and renewable energy."
      },
      {
        question: "Is Iowa good for renewable energy businesses?",
        answer: "Yes, Iowa is a leader in wind energy and offers incentives for renewable energy companies."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Low business costs",
        "Skilled workforce",
        "Agriculture strength",
        "Renewable energy leadership"
      ]
    }
  },
  {
    state: "Kansas",
    abbreviation: "KS",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Kansas",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Kansas state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of doing business",
      "Central location",
      "Strong agriculture sector",
      "Reasonable filing fees",
      "Good transportation infrastructure"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Limited access to capital",
      "Weather challenges"
    ],
    costs: {
      llcFiling: "$160",
      corpFiling: "$90",
      registeredAgent: "$100-250/year",
      annualReport: "$55"
    },
    dueDates: {
      llcAnnualReport: "August 15th",
      corpAnnualReport: "August 15th",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$55 annual report fee",
      corporation: "$55 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$20 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due August 15th",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is Kansas LLC filing fee higher than corporation?",
        answer: "Kansas has different fee structures for different entity types, with LLCs costing $160 to file versus $90 for corporations."
      },
      {
        question: "Is Kansas good for agriculture businesses?",
        answer: "Yes, Kansas has a strong agriculture sector and offers various programs to support agricultural businesses."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Agriculture strength",
        "Central location",
        "Low business costs",
        "Business-friendly policies"
      ]
    }
  },
  {
    state: "Kentucky",
    abbreviation: "KY",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Kentucky",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Kentucky state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of doing business",
      "Strategic location",
      "Growing economy",
      "Reasonable filing fees",
      "No franchise tax"
    ],
    cons: [
      "Must file annual report",
      "State income tax required",
      "Smaller market size",
      "Limited tech sector"
    ],
    costs: {
      llcFiling: "$40",
      corpFiling: "$50",
      registeredAgent: "$100-200/year",
      annualReport: "$15"
    },
    dueDates: {
      llcAnnualReport: "June 30th",
      corpAnnualReport: "June 30th",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$15 annual report fee",
      corporation: "$15 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$10 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due June 30th",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why are Kentucky's fees so low?",
        answer: "Kentucky keeps filing and annual report fees low to encourage business formation and maintain competitiveness."
      },
      {
        question: "Is Kentucky good for logistics businesses?",
        answer: "Yes, Kentucky's central location and transportation infrastructure make it excellent for logistics and distribution."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Low business costs",
        "Strategic location",
        "Business incentives",
        "Transportation hub"
      ]
    }
  },
  {
    state: "Louisiana",
    abbreviation: "LA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Louisiana",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Louisiana state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "10-15 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Strategic Gulf Coast location",
      "Energy sector opportunities",
      "Cultural diversity",
      "Port access for international trade",
      "Business incentives available"
    ],
    cons: [
      "Hurricane risk",
      "Must file annual report",
      "Complex tax structure",
      "Infrastructure challenges",
      "Higher filing fees"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$75",
      registeredAgent: "$150-300/year",
      annualReport: "$35"
    },
    dueDates: {
      llcAnnualReport: "By anniversary date",
      corpAnnualReport: "By anniversary date",
      taxFiling: "May 15th"
    },
    yearlyFees: {
      llc: "$35 annual report fee",
      corporation: "$35 annual report fee",
      franchise: "Franchise tax based on capital stock"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay franchise tax (corporations)",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due on anniversary date",
        "Franchise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is Louisiana's franchise tax?",
        answer: "Louisiana corporations pay franchise tax based on capital stock, with a minimum of $10 and maximum of $300."
      },
      {
        question: "Is Louisiana good for energy businesses?",
        answer: "Yes, Louisiana has a strong energy sector, especially oil and gas, with supportive infrastructure and policies."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Energy sector strength",
        "Port access",
        "Business incentives",
        "Cultural diversity"
      ]
    }
  },
  {
    state: "Maine",
    abbreviation: "ME",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Maine",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Maine state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Quality of life",
      "Tourism opportunities",
      "Skilled workforce",
      "Growing tech sector",
      "Reasonable filing fees"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Higher cost of living",
      "Limited access to capital",
      "Seasonal business challenges"
    ],
    costs: {
      llcFiling: "$175",
      corpFiling: "$145",
      registeredAgent: "$150-300/year",
      annualReport: "$85"
    },
    dueDates: {
      llcAnnualReport: "June 1st",
      corpAnnualReport: "June 1st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$85 annual report fee",
      corporation: "$85 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due June 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Maine good for tourism businesses?",
        answer: "Yes, Maine has a strong tourism industry, especially during summer months, with opportunities in hospitality and recreation."
      },
      {
        question: "What are Maine's advantages for small businesses?",
        answer: "Maine offers quality of life, a skilled workforce, supportive business community, and opportunities in tourism and technology."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Quality of life",
        "Tourism opportunities",
        "Skilled workforce",
        "Growing tech sector"
      ]
    }
  },
  {
    state: "Maryland",
    abbreviation: "MD",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Maryland",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Maryland state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Proximity to Washington DC",
      "Educated workforce",
      "Strong technology sector",
      "Access to federal contracts",
      "Diverse economy",
      "Good infrastructure"
    ],
    cons: [
      "High cost of living",
      "High state taxes",
      "Must file personal property return",
      "Complex regulatory environment",
      "Expensive filing fees"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$120",
      registeredAgent: "$200-400/year",
      annualReport: "$300 (personal property return)"
    },
    dueDates: {
      llcAnnualReport: "April 15th (personal property return)",
      corpAnnualReport: "April 15th (personal property return)",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$300 personal property tax",
      corporation: "$300 personal property tax",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File personal property return",
        "Pay personal property tax",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "Interest on late personal property tax",
        "Penalties for non-compliance",
        "Forfeiture for non-payment"
      ],
      renewals: [
        "Personal property return due April 15th",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is Maryland's personal property return?",
        answer: "Maryland requires businesses to file an annual personal property return and pay personal property tax, which typically costs $300."
      },
      {
        question: "Is Maryland good for government contractors?",
        answer: "Yes, Maryland's proximity to Washington DC makes it ideal for businesses seeking federal contracts."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Federal contracting opportunities",
        "Educated workforce",
        "Technology sector",
        "Proximity to DC"
      ]
    }
  },
  {
    state: "Massachusetts",
    abbreviation: "MA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Massachusetts",
        "File Certificate of Organization (LLC) or Articles of Organization (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Massachusetts state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Innovation and technology hub",
      "Educated workforce",
      "Access to capital",
      "Strong economy",
      "Healthcare and biotech leadership",
      "Proximity to major markets"
    ],
    cons: [
      "High cost of living",
      "High state taxes",
      "Must file annual report",
      "Expensive operating costs",
      "Complex regulatory environment"
    ],
    costs: {
      llcFiling: "$520",
      corpFiling: "$275",
      registeredAgent: "$200-500/year",
      annualReport: "$520 (LLC), $125 (Corp)"
    },
    dueDates: {
      llcAnnualReport: "By anniversary date",
      corpAnnualReport: "By anniversary date",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$520 annual report fee",
      corporation: "$125 annual report fee",
      franchise: "Minimum excise tax based on entity type"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay minimum excise tax",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due on anniversary date",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why are Massachusetts fees so high?",
        answer: "Massachusetts has higher fees but offers access to top universities, skilled workforce, and major innovation hubs like Boston and Cambridge."
      },
      {
        question: "Is Massachusetts good for biotech companies?",
        answer: "Yes, Massachusetts is a global leader in biotechnology with strong research institutions and industry clusters."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Innovation leadership",
        "Top universities",
        "Biotech hub",
        "Access to capital"
      ]
    }
  },
  {
    state: "Michigan",
    abbreviation: "MI",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Michigan",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Michigan state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Strong manufacturing base",
      "Automotive industry hub",
      "Business-friendly policies",
      "Reasonable filing fees",
      "Skilled workforce",
      "Great Lakes access"
    ],
    cons: [
      "Must file annual statement",
      "Economic challenges in some areas",
      "Weather challenges",
      "Limited venture capital"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$60",
      registeredAgent: "$100-250/year",
      annualReport: "$25"
    },
    dueDates: {
      llcAnnualReport: "February 15th",
      corpAnnualReport: "May 15th",
      taxFiling: "March 31st"
    },
    yearlyFees: {
      llc: "$25 annual statement fee",
      corporation: "$25 annual statement fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual statement",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual statement",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "LLC annual statement due February 15th",
        "Corporation annual statement due May 15th",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Michigan still good for manufacturing?",
        answer: "Yes, Michigan remains a manufacturing leader, especially in automotive, with a skilled workforce and supporting infrastructure."
      },
      {
        question: "What are Michigan's business advantages?",
        answer: "Michigan offers low costs, manufacturing expertise, Great Lakes access, and supportive business policies."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Manufacturing leadership",
        "Automotive expertise",
        "Low business costs",
        "Skilled workforce"
      ]
    }
  },
  {
    state: "Minnesota",
    abbreviation: "MN",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Minnesota",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Minnesota state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Strong economy",
      "Educated workforce",
      "Corporate headquarters hub",
      "Good quality of life",
      "Innovation-friendly",
      "Diverse industries"
    ],
    cons: [
      "High state taxes",
      "Must file annual registration",
      "Cold climate",
      "Higher cost of living",
      "Complex tax structure"
    ],
    costs: {
      llcFiling: "$135",
      corpFiling: "$135",
      registeredAgent: "$150-300/year",
      annualReport: "$25"
    },
    dueDates: {
      llcAnnualReport: "December 31st",
      corpAnnualReport: "December 31st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$25 annual registration",
      corporation: "$25 annual registration",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual registration",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual registration",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual registration due December 31st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is Minnesota good for corporate headquarters?",
        answer: "Minnesota offers a skilled workforce, quality of life, and business-friendly environment that attracts major corporations."
      },
      {
        question: "What industries are strong in Minnesota?",
        answer: "Minnesota has diverse strengths including healthcare, technology, manufacturing, and agriculture."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Corporate headquarters",
        "Skilled workforce",
        "Quality of life",
        "Diverse economy"
      ]
    }
  },
  {
    state: "Mississippi",
    abbreviation: "MS",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Mississippi",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Mississippi state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Low cost of doing business",
      "Business-friendly environment",
      "Strategic location",
      "Low filing fees",
      "Growing economy",
      "Port access"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Limited access to capital",
      "Infrastructure challenges",
      "Hurricane risk"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$50",
      registeredAgent: "$100-200/year",
      annualReport: "$25"
    },
    dueDates: {
      llcAnnualReport: "April 1st",
      corpAnnualReport: "April 1st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$25 annual report fee",
      corporation: "$25 annual report fee",
      franchise: "Franchise tax based on capital stock"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay franchise tax (corporations)",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Forfeiture for non-compliance"
      ],
      renewals: [
        "Annual report due April 1st",
        "Franchise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What are Mississippi's business advantages?",
        answer: "Mississippi offers very low costs, business-friendly policies, strategic location, and access to Gulf Coast ports."
      },
      {
        question: "Is Mississippi good for logistics businesses?",
        answer: "Yes, Mississippi's central location and port access make it attractive for logistics and distribution businesses."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Low business costs",
        "Strategic location",
        "Port access",
        "Business incentives"
      ]
    }
  },
  {
    state: "Missouri",
    abbreviation: "MO",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Missouri",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Missouri state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Central location",
      "Low cost of doing business",
      "No franchise tax",
      "Reasonable filing fees",
      "Good transportation infrastructure"
    ],
    cons: [
      "Must file annual registration",
      "State income tax required",
      "Smaller market in some areas",
      "Weather challenges"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$58",
      registeredAgent: "$100-250/year",
      annualReport: "$45"
    },
    dueDates: {
      llcAnnualReport: "By end of registration anniversary month",
      corpAnnualReport: "By end of registration anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$45 annual registration",
      corporation: "$45 annual registration",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual registration",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual registration",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual registration due by end of anniversary month",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is Missouri good for businesses?",
        answer: "Missouri offers a central location, low costs, business-friendly policies, and excellent transportation infrastructure."
      },
      {
        question: "What are Missouri's key industries?",
        answer: "Missouri has strengths in agriculture, manufacturing, transportation, and financial services."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Central location",
        "Low business costs",
        "Business-friendly policies",
        "Transportation hub"
      ]
    }
  },
  {
    state: "Montana",
    abbreviation: "MT",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Montana",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Montana state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "10-15 business days",
      difficulty: "Easy"
    },
    pros: [
      "No sales tax",
      "Business-friendly environment",
      "Quality of life",
      "Natural resource opportunities",
      "Growing tourism sector",
      "Low population density"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Limited infrastructure in rural areas",
      "Seasonal business challenges",
      "Limited access to capital"
    ],
    costs: {
      llcFiling: "$70",
      corpFiling: "$70",
      registeredAgent: "$100-200/year",
      annualReport: "$20"
    },
    dueDates: {
      llcAnnualReport: "April 15th",
      corpAnnualReport: "April 15th",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$20 annual report fee",
      corporation: "$20 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$10 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due April 15th",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Does Montana have sales tax?",
        answer: "No, Montana is one of five states with no statewide sales tax, though some localities may impose resort taxes."
      },
      {
        question: "Is Montana good for outdoor businesses?",
        answer: "Yes, Montana's natural beauty and outdoor recreation opportunities make it ideal for tourism and outdoor-related businesses."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "No sales tax",
        "Quality of life",
        "Natural resources",
        "Tourism opportunities"
      ]
    }
  },
  {
    state: "Nebraska",
    abbreviation: "NE",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Nebraska",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Nebraska state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of living",
      "Central location",
      "Strong agriculture sector",
      "Good work ethic",
      "Reasonable filing fees"
    ],
    cons: [
      "Smaller market size",
      "Must file biennial report",
      "Limited access to capital",
      "Weather challenges"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$60",
      registeredAgent: "$100-200/year",
      annualReport: "$26 (biennial)"
    },
    dueDates: {
      llcAnnualReport: "Every two years by March 1st",
      corpAnnualReport: "Every two years by March 1st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$26 biennial report fee",
      corporation: "$26 biennial report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File biennial report every two years",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for biennial report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Biennial report due every two years by March 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why does Nebraska require biennial reports?",
        answer: "Nebraska requires reports every two years instead of annually, reducing compliance burden and costs for businesses."
      },
      {
        question: "Is Nebraska good for agriculture businesses?",
        answer: "Yes, Nebraska has a strong agriculture sector and offers various programs to support agricultural businesses."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Agriculture strength",
        "Central location",
        "Low business costs",
        "Strong work ethic"
      ]
    }
  },
  {
    state: "New Hampshire",
    abbreviation: "NH",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in New Hampshire",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for New Hampshire state taxes if applicable",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "No state income tax",
      "No sales tax",
      "Business-friendly environment",
      "Quality of life",
      "Proximity to Boston",
      "Low crime rates"
    ],
    cons: [
      "Must file annual report",
      "Smaller market size",
      "Higher property taxes",
      "Limited venture capital",
      "Cold climate"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$100",
      registeredAgent: "$150-300/year",
      annualReport: "$100"
    },
    dueDates: {
      llcAnnualReport: "April 1st",
      corpAnnualReport: "April 1st",
      taxFiling: "No state income tax"
    },
    yearlyFees: {
      llc: "$100 annual report fee",
      corporation: "$100 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "Register for business profits tax if applicable",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due April 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Does New Hampshire have any state taxes?",
        answer: "New Hampshire has no state income tax or sales tax, but does have business profits tax and business enterprise tax for larger businesses."
      },
      {
        question: "Is New Hampshire good for small businesses?",
        answer: "Yes, New Hampshire's lack of state income and sales taxes, combined with business-friendly policies, make it attractive for small businesses."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "No income or sales tax",
        "Business-friendly policies",
        "Quality of life",
        "Proximity to Boston"
      ]
    }
  },
  {
    state: "New Jersey",
    abbreviation: "NJ",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in New Jersey",
        "File Certificate of Formation (LLC) or Certificate of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for New Jersey state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Proximity to New York and Philadelphia",
      "Educated workforce",
      "Strong economy",
      "Excellent infrastructure",
      "Diverse industries",
      "Port access"
    ],
    cons: [
      "High cost of living",
      "High state taxes",
      "Must file annual report",
      "Expensive operating costs",
      "Complex regulatory environment"
    ],
    costs: {
      llcFiling: "$125",
      corpFiling: "$125",
      registeredAgent: "$200-400/year",
      annualReport: "$75"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary month",
      corpAnnualReport: "By end of anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$75 annual report fee",
      corporation: "$75 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due by end of anniversary month",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is New Jersey expensive for businesses?",
        answer: "New Jersey has high costs but offers proximity to major markets, excellent infrastructure, and a skilled workforce."
      },
      {
        question: "Is New Jersey good for logistics businesses?",
        answer: "Yes, New Jersey's location between major cities and port access make it excellent for logistics and distribution."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Strategic location",
        "Excellent infrastructure",
        "Educated workforce",
        "Market access"
      ]
    }
  },
  {
    state: "New Mexico",
    abbreviation: "NM",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in New Mexico",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for New Mexico state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "10-15 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of living",
      "Cultural diversity",
      "Growing economy",
      "Reasonable filing fees",
      "Strategic location"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Limited infrastructure in rural areas",
      "Limited access to capital"
    ],
    costs: {
      llcFiling: "$50",
      corpFiling: "$100",
      registeredAgent: "$100-200/year",
      annualReport: "$25"
    },
    dueDates: {
      llcAnnualReport: "March 15th",
      corpAnnualReport: "March 15th",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$25 annual report fee",
      corporation: "$25 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due March 15th",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What are New Mexico's business advantages?",
        answer: "New Mexico offers low costs, business-friendly policies, cultural diversity, and opportunities in energy and technology."
      },
      {
        question: "Is New Mexico good for energy businesses?",
        answer: "Yes, New Mexico has significant oil, gas, and renewable energy resources with supportive policies."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Low business costs",
        "Energy resources",
        "Cultural diversity",
        "Strategic location"
      ]
    }
  },
  {
    state: "New York",
    abbreviation: "NY",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in New York",
        "File Articles of Organization (LLC) or Certificate of Incorporation (Corp)",
        "Publish formation notice in newspapers (LLC only)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for New York state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "10-15 business days (plus publication)",
      difficulty: "Complex"
    },
    pros: [
      "Access to largest markets",
      "Financial capital of the world",
      "Diverse economy",
      "Educated workforce",
      "Innovation hub",
      "International business center"
    ],
    cons: [
      "High cost of doing business",
      "Complex regulatory environment",
      "High state taxes",
      "Publication requirement for LLCs",
      "Expensive filing fees",
      "High cost of living"
    ],
    costs: {
      llcFiling: "$200",
      corpFiling: "$125",
      registeredAgent: "$300-600/year",
      annualReport: "$9 (biennial statement)"
    },
    dueDates: {
      llcAnnualReport: "Every two years by anniversary date",
      corpAnnualReport: "Every two years by anniversary date",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$9 biennial statement + publication costs",
      corporation: "$9 biennial statement",
      franchise: "Franchise tax based on capital base or income"
    },
    compliance: {
      requirements: [
        "File biennial statement every two years",
        "Maintain registered agent",
        "Publication requirement for LLCs",
        "Pay franchise tax",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for biennial statement",
        "Interest on unpaid franchise tax",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Biennial statement due every two years",
        "Franchise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is New York's LLC publication requirement?",
        answer: "New York LLCs must publish their formation in newspapers for six weeks, which typically costs $1,000-$2,000 depending on the county."
      },
      {
        question: "Is it worth forming in New York despite the costs?",
        answer: "For businesses operating in New York, the access to markets, capital, and opportunities often justifies the higher costs."
      },
      {
        question: "What is New York's franchise tax?",
        answer: "New York corporations pay franchise tax based on capital base or income, with minimum amounts varying by entity type."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Financial capital",
        "Largest markets",
        "Innovation hub",
        "International gateway"
      ]
    }
  },
  {
    state: "North Carolina",
    abbreviation: "NC",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in North Carolina",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for North Carolina state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Growing economy",
      "Research Triangle tech hub",
      "Reasonable filing fees",
      "Skilled workforce",
      "Strategic location"
    ],
    cons: [
      "Must file annual report",
      "State income tax required",
      "Hurricane risk in coastal areas",
      "Competitive market"
    ],
    costs: {
      llcFiling: "$125",
      corpFiling: "$125",
      registeredAgent: "$150-300/year",
      annualReport: "$200"
    },
    dueDates: {
      llcAnnualReport: "April 15th",
      corpAnnualReport: "April 15th",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$200 annual report fee",
      corporation: "$200 annual report fee",
      franchise: "Franchise tax based on capital stock"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay franchise tax",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid franchise tax",
        "Administrative dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due April 15th",
        "Franchise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is North Carolina good for tech companies?",
        answer: "Yes, the Research Triangle area (Raleigh-Durham-Chapel Hill) is a major tech hub with universities and established companies."
      },
      {
        question: "What is North Carolina's franchise tax?",
        answer: "North Carolina corporations pay franchise tax based on capital stock, with a minimum of $200."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Research Triangle tech hub",
        "Business-friendly policies",
        "Strategic location",
        "Skilled workforce"
      ]
    }
  },
  {
    state: "North Dakota",
    abbreviation: "ND",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in North Dakota",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for North Dakota state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Low cost of doing business",
      "Business-friendly environment",
      "Energy sector opportunities",
      "Low unemployment",
      "No franchise tax",
      "Simple compliance"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Limited infrastructure",
      "Cold climate",
      "Limited access to capital"
    ],
    costs: {
      llcFiling: "$135",
      corpFiling: "$100",
      registeredAgent: "$100-200/year",
      annualReport: "$50"
    },
    dueDates: {
      llcAnnualReport: "November 15th",
      corpAnnualReport: "November 15th",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$50 annual report fee",
      corporation: "$50 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due November 15th",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is North Dakota good for energy businesses?",
        answer: "Yes, North Dakota has significant oil and gas resources in the Bakken formation and supports energy businesses."
      },
      {
        question: "What are North Dakota's economic advantages?",
        answer: "North Dakota offers low costs, business-friendly policies, energy opportunities, and low unemployment."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Energy sector strength",
        "Low business costs",
        "Business-friendly policies",
        "Low unemployment"
      ]
    }
  },
  {
    state: "Ohio",
    abbreviation: "OH",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Ohio",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Ohio state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of doing business",
      "Central location",
      "Strong manufacturing base",
      "Reasonable filing fees",
      "Skilled workforce"
    ],
    cons: [
      "Must file annual report",
      "State income tax required",
      "Weather challenges",
      "Economic challenges in some areas"
    ],
    costs: {
      llcFiling: "$99",
      corpFiling: "$99",
      registeredAgent: "$100-250/year",
      annualReport: "$50"
    },
    dueDates: {
      llcAnnualReport: "By anniversary date",
      corpAnnualReport: "By anniversary date",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$50 annual report fee",
      corporation: "$50 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due on anniversary date",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Ohio good for manufacturing?",
        answer: "Yes, Ohio has a strong manufacturing tradition with automotive, aerospace, and other industries well-established."
      },
      {
        question: "What are Ohio's business advantages?",
        answer: "Ohio offers low costs, central location, skilled workforce, and business-friendly policies."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Manufacturing strength",
        "Central location",
        "Low business costs",
        "Skilled workforce"
      ]
    }
  },
  {
    state: "Oklahoma",
    abbreviation: "OK",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Oklahoma",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Oklahoma state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of doing business",
      "Energy sector opportunities",
      "Central location",
      "Reasonable filing fees",
      "No franchise tax"
    ],
    cons: [
      "Must file annual report",
      "Weather challenges (tornadoes)",
      "Smaller market size",
      "Limited venture capital"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$50",
      registeredAgent: "$100-200/year",
      annualReport: "$25"
    },
    dueDates: {
      llcAnnualReport: "July 1st",
      corpAnnualReport: "July 1st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$25 annual report fee",
      corporation: "$25 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due July 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Oklahoma good for energy businesses?",
        answer: "Yes, Oklahoma has significant oil and gas resources and supports energy sector businesses."
      },
      {
        question: "What are Oklahoma's business advantages?",
        answer: "Oklahoma offers low costs, business-friendly policies, energy opportunities, and central location."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Energy sector strength",
        "Low business costs",
        "Central location",
        "Business-friendly policies"
      ]
    }
  },
  {
    state: "Oregon",
    abbreviation: "OR",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Oregon",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Oregon state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "No sales tax",
      "Business-friendly environment",
      "Quality of life",
      "Growing tech sector",
      "Innovation-friendly",
      "Strategic Pacific location"
    ],
    cons: [
      "Must file annual report",
      "State income tax required",
      "Higher cost of living in Portland",
      "Complex regulatory environment"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$100",
      registeredAgent: "$150-300/year",
      annualReport: "$100"
    },
    dueDates: {
      llcAnnualReport: "By anniversary date",
      corpAnnualReport: "By anniversary date",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$100 annual report fee",
      corporation: "$100 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due on anniversary date",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Does Oregon have sales tax?",
        answer: "No, Oregon is one of five states with no statewide sales tax, making it attractive for retail businesses."
      },
      {
        question: "Is Oregon good for tech companies?",
        answer: "Yes, Oregon has a growing tech sector, especially in Portland, with companies like Nike and Intel having major operations."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "No sales tax",
        "Tech sector growth",
        "Quality of life",
        "Innovation-friendly"
      ]
    }
  },
  {
    state: "Pennsylvania",
    abbreviation: "PA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Pennsylvania",
        "File Certificate of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Pennsylvania state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Moderate"
    },
    pros: [
      "Strategic location",
      "Strong manufacturing base",
      "Educated workforce",
      "Diverse economy",
      "Good infrastructure",
      "Access to major markets"
    ],
    cons: [
      "High state taxes",
      "Must file annual report",
      "Complex regulatory environment",
      "Higher filing fees",
      "Economic challenges in some areas"
    ],
    costs: {
      llcFiling: "$125",
      corpFiling: "$125",
      registeredAgent: "$150-350/year",
      annualReport: "$70"
    },
    dueDates: {
      llcAnnualReport: "April 15th",
      corpAnnualReport: "April 15th",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$70 annual report fee",
      corporation: "$70 annual report fee",
      franchise: "Capital stock/franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay capital stock/franchise tax",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due April 15th",
        "Capital stock tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is Pennsylvania's capital stock tax?",
        answer: "Pennsylvania corporations pay capital stock tax based on capital stock value, with minimum and maximum amounts."
      },
      {
        question: "Is Pennsylvania good for manufacturing?",
        answer: "Yes, Pennsylvania has a strong manufacturing tradition and infrastructure supporting various industries."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Strategic location",
        "Manufacturing strength",
        "Educated workforce",
        "Market access"
      ]
    }
  },
  {
    state: "Rhode Island",
    abbreviation: "RI",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Rhode Island",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Rhode Island state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Proximity to Boston and New York",
      "Small state, easy navigation",
      "Ocean access",
      "Historic charm",
      "Educated workforce",
      "Innovation initiatives"
    ],
    cons: [
      "High cost of living",
      "High state taxes",
      "Must file annual report",
      "Small market size",
      "Limited land availability"
    ],
    costs: {
      llcFiling: "$150",
      corpFiling: "$230",
      registeredAgent: "$150-300/year",
      annualReport: "$50"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary month",
      corpAnnualReport: "By end of anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$50 annual report fee",
      corporation: "$50 annual report fee",
      franchise: "Franchise tax based on authorized shares"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay franchise tax",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due by end of anniversary month",
        "Franchise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What are Rhode Island's advantages despite high costs?",
        answer: "Rhode Island offers proximity to major markets, educated workforce, and innovation initiatives in a compact state."
      },
      {
        question: "Is Rhode Island good for small businesses?",
        answer: "Rhode Island can work for small businesses that value proximity to Boston/NYC markets and don't mind higher costs."
      }
    ],
    businessClimate: {
      rating: 5,
      keyFeatures: [
        "Proximity to major markets",
        "Ocean access",
        "Educated workforce",
        "Innovation initiatives"
      ]
    }
  },
  {
    state: "South Carolina",
    abbreviation: "SC",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in South Carolina",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for South Carolina state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Low cost of doing business",
      "Growing economy",
      "Strategic location",
      "Reasonable filing fees",
      "Port access"
    ],
    cons: [
      "Must file annual report",
      "Hurricane risk in coastal areas",
      "Smaller market size",
      "Limited venture capital"
    ],
    costs: {
      llcFiling: "$110",
      corpFiling: "$135",
      registeredAgent: "$100-250/year",
      annualReport: "$0 (no annual report required)"
    },
    dueDates: {
      llcAnnualReport: "No annual report required",
      corpAnnualReport: "No annual report required",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "No annual report fee",
      corporation: "No annual report fee",
      franchise: "Franchise tax based on capital stock"
    },
    compliance: {
      requirements: [
        "No annual report required",
        "Pay franchise tax (corporations)",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "Interest on unpaid franchise tax",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "No annual report required",
        "Franchise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Does South Carolina require annual reports?",
        answer: "No, South Carolina is one of the few states that does not require annual reports for LLCs or corporations."
      },
      {
        question: "What is South Carolina's franchise tax?",
        answer: "South Carolina corporations pay franchise tax based on capital stock, with a minimum amount."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "No annual reports",
        "Business-friendly policies",
        "Low costs",
        "Strategic location"
      ]
    }
  },
  {
    state: "South Dakota",
    abbreviation: "SD",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in South Dakota",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for South Dakota state taxes if applicable",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "No state income tax",
      "No inheritance tax",
      "Business-friendly environment",
      "Low cost of doing business",
      "Privacy laws favorable",
      "Simple compliance"
    ],
    cons: [
      "Must file annual report",
      "Smaller market size",
      "Limited infrastructure",
      "Limited access to capital",
      "Cold climate"
    ],
    costs: {
      llcFiling: "$150",
      corpFiling: "$150",
      registeredAgent: "$100-200/year",
      annualReport: "$50"
    },
    dueDates: {
      llcAnnualReport: "February 1st",
      corpAnnualReport: "February 1st",
      taxFiling: "No state income tax"
    },
    yearlyFees: {
      llc: "$50 annual report fee",
      corporation: "$50 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "No state income tax filing",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due February 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is South Dakota popular for certain businesses?",
        answer: "South Dakota has no state income tax, favorable privacy laws, and is popular for trust and financial services."
      },
      {
        question: "Is South Dakota good for privacy?",
        answer: "Yes, South Dakota has favorable privacy laws and doesn't require disclosure of members/shareholders in many cases."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "No state income tax",
        "Privacy-friendly laws",
        "Low business costs",
        "Simple compliance"
      ]
    }
  },
  {
    state: "Tennessee",
    abbreviation: "TN",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Tennessee",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Tennessee state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "No state income tax",
      "Business-friendly environment",
      "Low cost of doing business",
      "Strategic location",
      "Growing economy",
      "Strong logistics hub"
    ],
    cons: [
      "Must file annual report",
      "Franchise/excise tax required",
      "Sales tax registration needed",
      "Limited venture capital in some areas"
    ],
    costs: {
      llcFiling: "$300",
      corpFiling: "$100",
      registeredAgent: "$100-250/year",
      annualReport: "$300 (LLC), $20 (Corp)"
    },
    dueDates: {
      llcAnnualReport: "By first day of anniversary month",
      corpAnnualReport: "By first day of anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$300 annual report fee",
      corporation: "$20 annual report fee + franchise/excise tax",
      franchise: "Franchise/excise tax based on net worth and income"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay franchise/excise tax",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$50 penalty for late annual report (LLC)",
        "$25 penalty for late annual report (Corp)",
        "Interest on unpaid taxes",
        "Dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due by first day of anniversary month",
        "Franchise/excise tax due annually",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Why is Tennessee's LLC annual report fee so high?",
        answer: "Tennessee charges $300 for LLC annual reports but has no state income tax, making the overall tax burden competitive."
      },
      {
        question: "What is Tennessee's franchise/excise tax?",
        answer: "Tennessee businesses pay franchise tax (0.25% of net worth) and excise tax (6.5% of income), but no personal income tax."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "No state income tax",
        "Business-friendly policies",
        "Strategic location",
        "Logistics hub"
      ]
    }
  },
  {
    state: "Utah",
    abbreviation: "UT",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Utah",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Utah state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Growing tech sector (Silicon Slopes)",
      "Low cost of doing business",
      "Educated workforce",
      "Strategic location",
      "Quality of life"
    ],
    cons: [
      "Must file annual report",
      "State income tax required",
      "Limited water resources",
      "Competitive market"
    ],
    costs: {
      llcFiling: "$70",
      corpFiling: "$70",
      registeredAgent: "$100-250/year",
      annualReport: "$20"
    },
    dueDates: {
      llcAnnualReport: "By anniversary date",
      corpAnnualReport: "By anniversary date",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$20 annual report fee",
      corporation: "$20 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$20 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due on anniversary date",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Utah good for tech companies?",
        answer: "Yes, Utah's Silicon Slopes area has become a major tech hub with companies like Adobe, eBay, and many startups."
      },
      {
        question: "What makes Utah attractive for businesses?",
        answer: "Utah offers business-friendly policies, low costs, educated workforce, and excellent quality of life."
      }
    ],
    businessClimate: {
      rating: 9,
      keyFeatures: [
        "Silicon Slopes tech hub",
        "Business-friendly policies",
        "Low costs",
        "Quality of life"
      ]
    }
  },
  {
    state: "Vermont",
    abbreviation: "VT",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Vermont",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Vermont state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Quality of life",
      "Proximity to Boston and Montreal",
      "Growing tech sector",
      "Strong local business community",
      "Tourism opportunities",
      "Environmental leadership"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Higher cost of living",
      "Limited access to capital",
      "Cold climate"
    ],
    costs: {
      llcFiling: "$125",
      corpFiling: "$125",
      registeredAgent: "$150-300/year",
      annualReport: "$35"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary month",
      corpAnnualReport: "By end of anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$35 annual report fee",
      corporation: "$35 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due by end of anniversary month",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Vermont good for sustainable businesses?",
        answer: "Yes, Vermont is a leader in environmental initiatives and attracts businesses focused on sustainability."
      },
      {
        question: "What are Vermont's advantages for small businesses?",
        answer: "Vermont offers quality of life, strong local business community, and opportunities in tourism and sustainable industries."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Quality of life",
        "Environmental leadership",
        "Local business support",
        "Tourism opportunities"
      ]
    }
  },
  {
    state: "Virginia",
    abbreviation: "VA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Virginia",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Virginia state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Proximity to Washington DC",
      "Strong economy",
      "Educated workforce",
      "Technology sector growth",
      "Federal contracting opportunities",
      "Business-friendly environment"
    ],
    cons: [
      "Must file annual registration",
      "State income tax required",
      "Higher cost of living in Northern VA",
      "Competitive market"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$75",
      registeredAgent: "$150-350/year",
      annualReport: "$50"
    },
    dueDates: {
      llcAnnualReport: "By last day of anniversary month",
      corpAnnualReport: "By last day of anniversary month",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$50 annual registration fee",
      corporation: "$50 annual registration fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual registration",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual registration",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual registration due by last day of anniversary month",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Virginia good for government contractors?",
        answer: "Yes, Virginia's proximity to Washington DC makes it ideal for businesses seeking federal contracts."
      },
      {
        question: "What are Virginia's key business advantages?",
        answer: "Virginia offers educated workforce, proximity to DC, growing tech sector, and business-friendly policies."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "Federal contracting hub",
        "Educated workforce",
        "Technology growth",
        "Proximity to DC"
      ]
    }
  },
  {
    state: "Washington",
    abbreviation: "WA",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Washington",
        "File Certificate of Formation (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Washington state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "5-7 business days",
      difficulty: "Moderate"
    },
    pros: [
      "No state income tax",
      "Major tech hub",
      "Innovation-friendly",
      "Strategic Pacific location",
      "Strong economy",
      "International trade opportunities"
    ],
    cons: [
      "Must file annual report",
      "Business & Occupation tax required",
      "Higher cost of living in Seattle",
      "Complex regulatory environment"
    ],
    costs: {
      llcFiling: "$200",
      corpFiling: "$200",
      registeredAgent: "$200-400/year",
      annualReport: "$71"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary month",
      corpAnnualReport: "By end of anniversary month",
      taxFiling: "No state income tax"
    },
    yearlyFees: {
      llc: "$71 annual report fee",
      corporation: "$71 annual report fee",
      franchise: "No franchise tax (B&O tax applies)"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Pay Business & Occupation tax",
        "Maintain registered agent",
        "Keep corporate records",
        "No state income tax filing",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Interest on unpaid B&O tax",
        "Administrative dissolution for non-compliance"
      ],
      renewals: [
        "Annual report due by end of anniversary month",
        "B&O tax filing varies by business size",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What is Washington's Business & Occupation tax?",
        answer: "Washington's B&O tax is based on gross receipts rather than income, with different rates for different business activities."
      },
      {
        question: "Is Washington good for tech companies?",
        answer: "Yes, Washington is home to major tech companies like Microsoft and Amazon, with a thriving innovation ecosystem."
      }
    ],
    businessClimate: {
      rating: 8,
      keyFeatures: [
        "No state income tax",
        "Major tech hub",
        "Innovation ecosystem",
        "International trade"
      ]
    }
  },
  {
    state: "West Virginia",
    abbreviation: "WV",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in West Virginia",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for West Virginia state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Low cost of doing business",
      "Business-friendly environment",
      "Strategic location",
      "Natural resource opportunities",
      "Low filing fees",
      "Simple compliance"
    ],
    cons: [
      "Smaller market size",
      "Must file annual report",
      "Economic challenges",
      "Limited infrastructure in rural areas",
      "Limited access to capital"
    ],
    costs: {
      llcFiling: "$100",
      corpFiling: "$100",
      registeredAgent: "$100-200/year",
      annualReport: "$25"
    },
    dueDates: {
      llcAnnualReport: "July 1st",
      corpAnnualReport: "July 1st",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$25 annual report fee",
      corporation: "$25 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due July 1st",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "What are West Virginia's business advantages?",
        answer: "West Virginia offers very low costs, business-friendly policies, strategic location, and opportunities in natural resources."
      },
      {
        question: "Is West Virginia good for energy businesses?",
        answer: "Yes, West Virginia has significant coal and natural gas resources and supports energy sector businesses."
      }
    ],
    businessClimate: {
      rating: 6,
      keyFeatures: [
        "Low business costs",
        "Natural resources",
        "Strategic location",
        "Business-friendly policies"
      ]
    }
  },
  {
    state: "Wisconsin",
    abbreviation: "WI",
    howToStart: {
      steps: [
        "Choose and verify business name availability",
        "Designate a registered agent in Wisconsin",
        "File Articles of Organization (LLC) or Articles of Incorporation (Corp)",
        "Create operating agreement or bylaws",
        "Obtain federal EIN",
        "Register for Wisconsin state taxes",
        "Obtain required business licenses"
      ],
      timeframe: "7-10 business days",
      difficulty: "Easy"
    },
    pros: [
      "Business-friendly environment",
      "Strong manufacturing base",
      "Educated workforce",
      "Central location",
      "Reasonable filing fees",
      "Quality of life"
    ],
    cons: [
      "Must file annual report",
      "Cold climate",
      "State income tax required",
      "Limited venture capital in some areas"
    ],
    costs: {
      llcFiling: "$130",
      corpFiling: "$100",
      registeredAgent: "$100-250/year",
      annualReport: "$25"
    },
    dueDates: {
      llcAnnualReport: "By end of anniversary quarter",
      corpAnnualReport: "By end of anniversary quarter",
      taxFiling: "March 15th"
    },
    yearlyFees: {
      llc: "$25 annual report fee",
      corporation: "$25 annual report fee",
      franchise: "No franchise tax"
    },
    compliance: {
      requirements: [
        "File annual report",
        "Maintain registered agent",
        "Keep corporate records",
        "File state tax returns",
        "Renew business licenses"
      ],
      penalties: [
        "$25 late fee for annual report",
        "Administrative dissolution for non-compliance",
        "Interest on unpaid taxes"
      ],
      renewals: [
        "Annual report due by end of anniversary quarter",
        "Various license renewals throughout year"
      ]
    },
    faqs: [
      {
        question: "Is Wisconsin good for manufacturing?",
        answer: "Yes, Wisconsin has a strong manufacturing tradition and supports manufacturing businesses with various programs."
      },
      {
        question: "What are Wisconsin's business advantages?",
        answer: "Wisconsin offers manufacturing expertise, central location, educated workforce, and business-friendly policies."
      }
    ],
    businessClimate: {
      rating: 7,
      keyFeatures: [
        "Manufacturing strength",
        "Central location",
        "Educated workforce",
        "Business-friendly policies"
      ]
    }
  }
];

export default function EntityRequirements() {
  const [selectedState, setSelectedState] = useState<string>("");
  
  const selectedStateData = selectedState 
    ? stateRequirements.find(state => state.state === selectedState)
    : null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-white bg-green-500';
      case 'Moderate': return 'text-yellow-800 bg-yellow-100';
      case 'Complex': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 10 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-8 h-8 text-green-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
              </svg>
              <span className="text-green-200 font-medium">Business Tools</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              State Entity Requirements
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto mb-8">
              Get comprehensive state-specific information for business formation, compliance requirements, costs, and regulations
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* State Selection Map */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Click on a State to View Requirements
            </h2>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <style>{`
                /* Only target actual state paths with name attribute */
                .map-container svg path[name] {
                  fill: #f9fafb !important;
                  stroke: #e5e7eb !important;
                  stroke-width: 1 !important;
                  cursor: pointer !important;
                  transition: all 0.2s ease !important;
                }
                .map-container svg path[name]:hover {
                  fill: #10b981 !important;
                  stroke: #059669 !important;
                  stroke-width: 2 !important;
                }
                .map-container svg path[name="${selectedState}"] {
                  fill: #10b981 !important;
                  stroke: #059669 !important;
                  stroke-width: 2 !important;
                }
                .map-container svg {
                  width: 100% !important;
                  height: auto !important;
                }
              `}</style>
              <div className="w-full flex justify-center items-center map-container">
                <div style={{
                  width: '100%',
                  maxWidth: '800px',
                  height: 'auto'
                }}>
                  <USAMapSelect
                    onClick={(event: any) => {
                      const stateName = event.currentTarget.getAttribute('name');
                      setSelectedState(stateName);
                    }}
                    showStateNameOnHover={false}
                    wrapperClassName="w-full h-auto"
                  />
                </div>
              </div>
              
              {selectedState && (
                <div className="mt-8 text-center">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                    <div className="flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Start Business in {selectedState}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-700 mb-6">
                      Get your business formation started in {selectedState} with professional guidance and streamlined filing processes.
                    </p>
                    <div className="flex items-center justify-center mb-6">
                      <div className="text-4xl font-bold text-green-600">$0</div>
                      <div className="text-xl text-gray-600 ml-2">+ State Fee</div>
                    </div>
                    <button
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '12px 32px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#059669';
                        (e.target as HTMLElement).style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#10b981';
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                      }}
                      onClick={() => {
                        // Navigate to formation workflow with selected state
                        window.location.href = `/formation?state=${encodeURIComponent(selectedState)}`;
                      }}
                    >
                      Start Your {selectedState} Business Today
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* State Details */}
        {selectedStateData ? (
          <div className="space-y-8">
            {/* State Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedStateData.state} Business Requirements
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedStateData.howToStart.difficulty)}`}>
                      {selectedStateData.howToStart.difficulty} Formation
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">Business Climate:</span>
                      <div className="flex">{getRatingStars(selectedStateData.businessClimate.rating)}</div>
                      <span className="text-sm text-gray-600">({selectedStateData.businessClimate.rating}/10)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Formation Time</div>
                  <div className="font-semibold text-green-600">{selectedStateData.howToStart.timeframe}</div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                {selectedStateData.businessClimate.keyFeatures.map((feature, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium text-green-800">{feature}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Start */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                </svg>
                How to Start Your Business in {selectedStateData.state}
              </h3>
              <div className="space-y-4">
                {selectedStateData.howToStart.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 pt-1">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Advantages
                </h3>
                <ul className="space-y-3">
                  {selectedStateData.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                  </svg>
                  Considerations
                </h3>
                <ul className="space-y-3">
                  {selectedStateData.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Costs and Fees */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
                Filing Costs & Annual Fees
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Initial Filing Costs</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">LLC Filing Fee:</span>
                      <span className="font-semibold">{selectedStateData.costs.llcFiling}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Corporation Filing Fee:</span>
                      <span className="font-semibold">{selectedStateData.costs.corpFiling}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Registered Agent:</span>
                      <span className="font-semibold">{selectedStateData.costs.registeredAgent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Report:</span>
                      <span className="font-semibold">{selectedStateData.costs.annualReport}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Annual Fees</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">LLC:</span>
                      <span className="font-semibold">{selectedStateData.yearlyFees.llc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Corporation:</span>
                      <span className="font-semibold">{selectedStateData.yearlyFees.corporation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Franchise Tax:</span>
                      <span className="font-semibold">{selectedStateData.yearlyFees.franchise}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Due Dates */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
                Important Due Dates
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="font-semibold text-purple-800 mb-2">LLC Annual Report</div>
                  <div className="text-purple-600">{selectedStateData.dueDates.llcAnnualReport}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="font-semibold text-purple-800 mb-2">Corp Annual Report</div>
                  <div className="text-purple-600">{selectedStateData.dueDates.corpAnnualReport}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="font-semibold text-purple-800 mb-2">Tax Filing</div>
                  <div className="text-purple-600">{selectedStateData.dueDates.taxFiling}</div>
                </div>
              </div>
            </div>

            {/* Compliance Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                Compliance Requirements
              </h3>
              <div className="grid lg:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Required Actions</h4>
                  <ul className="space-y-2">
                    {selectedStateData.compliance.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Penalties</h4>
                  <ul className="space-y-2">
                    {selectedStateData.compliance.penalties.map((penalty, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{penalty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Renewals</h4>
                  <ul className="space-y-2">
                    {selectedStateData.compliance.renewals.map((renewal, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{renewal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                </svg>
                Frequently Asked Questions
              </h3>
              <div className="space-y-6">
                {selectedStateData.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h4 className="font-semibold text-gray-900 mb-3">{faq.question}</h4>
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Your {selectedStateData.state} Business?</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Let our experts handle the formation process and ensure you meet all {selectedStateData.state} requirements from day one.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/business-formation-service">
                  <button
                    style={{
                      backgroundColor: 'white',
                      color: '#2563eb',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '16px 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(-2px)';
                      target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.transform = 'translateY(0)';
                      target.style.boxShadow = 'none';
                    }}
                  >
                    Start {selectedStateData.state} Formation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4z" clipRule="evenodd"/>
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Select a State</h3>
            <p className="text-gray-600">Choose a state from the dropdown above to view detailed business formation requirements and compliance information.</p>
          </div>
        )}
      </div>
    </div>
  );
}