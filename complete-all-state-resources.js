import fs from 'fs';

// Complete business resources for all 50 states
const stateResourcesData = {
  "Arizona": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Arizona Corporation Commission",
        description: "Official business formation and annual filing portal",
        url: "https://ecorp.azcc.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information", 
        title: "Arizona Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://azdor.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Arizona Commerce Authority", 
        description: "Business incentives and development programs",
        url: "https://www.azcommerce.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Arizona SBDC Network",
        description: "Free business consulting and training programs", 
        url: "https://azsbdc.net/",
        type: "Support Resource"
      }
    ]
  },
  "Arkansas": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Arkansas Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.arkansas.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Arkansas Department of Finance and Administration",
        description: "State tax requirements and business licensing",
        url: "https://www.dfa.arkansas.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development", 
        title: "Arkansas Economic Development Commission",
        description: "Business incentives and development programs",
        url: "https://www.arkansasedc.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Arkansas SBDC",
        description: "Free business consulting and training programs",
        url: "https://asbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Kansas": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Kansas Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.kssos.org/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Kansas Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.kdor.ks.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Kansas Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://www.kansascommerce.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Kansas SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.ksbdc.net/",
        type: "Support Resource"
      }
    ]
  },
  "Kentucky": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Kentucky Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.ky.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Kentucky Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://revenue.ky.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Kentucky Cabinet for Economic Development",
        description: "Business incentives and development programs",
        url: "https://ced.ky.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Kentucky SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.ksbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Louisiana": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Louisiana Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.la.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Louisiana Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://revenue.louisiana.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Louisiana Economic Development",
        description: "Business incentives and development programs",
        url: "https://www.opportunitylouisiana.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Louisiana SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.lsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Maine": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Maine Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.maine.gov/sos/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Maine Revenue Services",
        description: "State tax requirements and business licensing",
        url: "https://www.maine.gov/revenue/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Maine Department of Economic and Community Development",
        description: "Business incentives and development programs",
        url: "https://www.maine.gov/decd/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Maine SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.mainesbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Maryland": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Maryland Department of Assessments and Taxation",
        description: "Official business formation and annual filing portal",
        url: "https://dat.maryland.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Maryland Comptroller",
        description: "State tax requirements and business licensing",
        url: "https://www.marylandtaxes.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Maryland Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://commerce.maryland.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Maryland SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.mdsbdc.umd.edu/",
        type: "Support Resource"
      }
    ]
  },
  "Massachusetts": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Massachusetts Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sec.state.ma.us/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Massachusetts Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.mass.gov/dor",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Massachusetts Office of Business Development",
        description: "Business incentives and development programs",
        url: "https://www.mass.gov/business-development",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Massachusetts SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.msbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Michigan": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Michigan Department of Licensing and Regulatory Affairs",
        description: "Official business formation and annual filing portal",
        url: "https://www.michigan.gov/lara/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Michigan Department of Treasury",
        description: "State tax requirements and business licensing",
        url: "https://www.michigan.gov/treasury/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Michigan Economic Development Corporation",
        description: "Business incentives and development programs",
        url: "https://www.michiganbusiness.org/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Michigan SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.sbdcmichigan.org/",
        type: "Support Resource"
      }
    ]
  },
  "Minnesota": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Minnesota Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.state.mn.us/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Minnesota Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.revenue.state.mn.us/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Minnesota Department of Employment and Economic Development",
        description: "Business incentives and development programs",
        url: "https://mn.gov/deed/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Minnesota SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.mnsbdc.com/",
        type: "Support Resource"
      }
    ]
  },
  "Mississippi": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Mississippi Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.ms.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Mississippi Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.dor.ms.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Mississippi Development Authority",
        description: "Business incentives and development programs",
        url: "https://www.mississippi.org/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Mississippi SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.mssbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Missouri": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Missouri Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.mo.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Missouri Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://dor.mo.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Missouri Department of Economic Development",
        description: "Business incentives and development programs",
        url: "https://ded.mo.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Missouri SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.missouribusiness.net/",
        type: "Support Resource"
      }
    ]
  },
  "Montana": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Montana Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sosmt.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Montana Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://mtrevenue.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Montana Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://commerce.mt.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Montana SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.mtsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Nebraska": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Nebraska Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.nebraska.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Nebraska Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://revenue.nebraska.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Nebraska Department of Economic Development",
        description: "Business incentives and development programs",
        url: "https://opportunity.nebraska.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Nebraska SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.neded.org/sbdc",
        type: "Support Resource"
      }
    ]
  },
  "New Hampshire": {
    businessResources: [
      {
        category: "Business Registration",
        title: "New Hampshire Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.nh.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "New Hampshire Department of Revenue Administration",
        description: "State tax requirements and business licensing",
        url: "https://www.revenue.nh.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "New Hampshire Division of Economic Development",
        description: "Business incentives and development programs",
        url: "https://www.nheconomy.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "New Hampshire SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.nhsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "New Jersey": {
    businessResources: [
      {
        category: "Business Registration",
        title: "New Jersey Division of Revenue and Enterprise Services",
        description: "Official business formation and annual filing portal",
        url: "https://www.nj.gov/treasury/revenue/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "New Jersey Division of Taxation",
        description: "State tax requirements and business licensing",
        url: "https://www.state.nj.us/treasury/taxation/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "New Jersey Economic Development Authority",
        description: "Business incentives and development programs",
        url: "https://www.njeda.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "New Jersey SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.njsbdc.com/",
        type: "Support Resource"
      }
    ]
  },
  "New Mexico": {
    businessResources: [
      {
        category: "Business Registration",
        title: "New Mexico Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.state.nm.us/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "New Mexico Taxation and Revenue Department",
        description: "State tax requirements and business licensing",
        url: "https://www.tax.newmexico.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "New Mexico Economic Development Department",
        description: "Business incentives and development programs",
        url: "https://gonm.biz/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "New Mexico SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.nmsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "New York": {
    businessResources: [
      {
        category: "Business Registration",
        title: "New York Department of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.dos.ny.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "New York State Department of Taxation and Finance",
        description: "State tax requirements and business licensing",
        url: "https://www.tax.ny.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Empire State Development",
        description: "Business incentives and development programs",
        url: "https://esd.ny.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "New York SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.nysbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "North Carolina": {
    businessResources: [
      {
        category: "Business Registration",
        title: "North Carolina Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sosnc.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "North Carolina Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.ncdor.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "North Carolina Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://www.nccommerce.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "North Carolina SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.sbtdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "North Dakota": {
    businessResources: [
      {
        category: "Business Registration",
        title: "North Dakota Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.nd.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "North Dakota Office of State Tax Commissioner",
        description: "State tax requirements and business licensing",
        url: "https://www.nd.gov/tax/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "North Dakota Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://www.commerce.nd.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "North Dakota SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.ndsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Ohio": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Ohio Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.state.oh.us/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Ohio Department of Taxation",
        description: "State tax requirements and business licensing",
        url: "https://tax.ohio.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "JobsOhio",
        description: "Business incentives and development programs",
        url: "https://www.jobsohio.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Ohio SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.ohiosbdc.ohio.gov/",
        type: "Support Resource"
      }
    ]
  },
  "Oklahoma": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Oklahoma Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.ok.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Oklahoma Tax Commission",
        description: "State tax requirements and business licensing",
        url: "https://oklahoma.gov/tax.html",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Oklahoma Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://www.okcommerce.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Oklahoma SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.oksbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Oregon": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Oregon Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sos.oregon.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Oregon Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.oregon.gov/dor/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Oregon Business Development Department",
        description: "Business incentives and development programs",
        url: "https://www.oregon4biz.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Oregon SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.bizcenter.org/",
        type: "Support Resource"
      }
    ]
  },
  "Pennsylvania": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Pennsylvania Department of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.dos.pa.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Pennsylvania Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.revenue.pa.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Pennsylvania Department of Community and Economic Development",
        description: "Business incentives and development programs",
        url: "https://dced.pa.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Pennsylvania SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.pasbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Rhode Island": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Rhode Island Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.ri.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Rhode Island Division of Taxation",
        description: "State tax requirements and business licensing",
        url: "https://tax.ri.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Rhode Island Commerce Corporation",
        description: "Business incentives and development programs",
        url: "https://commerceri.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Rhode Island SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.risbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "South Carolina": {
    businessResources: [
      {
        category: "Business Registration",
        title: "South Carolina Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.sc.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "South Carolina Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://dor.sc.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "South Carolina Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://sccommerce.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "South Carolina SBDC",
        description: "Free business consulting and training programs",
        url: "https://scsbdc.ecu.edu/",
        type: "Support Resource"
      }
    ]
  },
  "South Dakota": {
    businessResources: [
      {
        category: "Business Registration",
        title: "South Dakota Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sdsos.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "South Dakota Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://dor.sd.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "South Dakota Governor's Office of Economic Development",
        description: "Business incentives and development programs",
        url: "https://sdgoed.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "South Dakota SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.sdsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Tennessee": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Tennessee Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sos.tn.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Tennessee Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.tn.gov/revenue/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Tennessee Department of Economic and Community Development",
        description: "Business incentives and development programs",
        url: "https://www.tnecd.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Tennessee SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.tsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Utah": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Utah Division of Corporations and Commercial Code",
        description: "Official business formation and annual filing portal",
        url: "https://corporations.utah.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Utah State Tax Commission",
        description: "State tax requirements and business licensing",
        url: "https://tax.utah.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Utah Governor's Office of Economic Development",
        description: "Business incentives and development programs",
        url: "https://business.utah.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Utah SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.utahsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Vermont": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Vermont Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sos.vermont.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Vermont Department of Taxes",
        description: "State tax requirements and business licensing",
        url: "https://tax.vermont.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Vermont Agency of Commerce and Community Development",
        description: "Business incentives and development programs",
        url: "https://accd.vermont.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Vermont SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.vtsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Virginia": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Virginia State Corporation Commission",
        description: "Official business formation and annual filing portal",
        url: "https://www.scc.virginia.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Virginia Department of Taxation",
        description: "State tax requirements and business licensing",
        url: "https://www.tax.virginia.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Virginia Economic Development Partnership",
        description: "Business incentives and development programs",
        url: "https://www.vedp.org/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Virginia SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.virginiasbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Washington": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Washington Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.wa.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Washington Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://dor.wa.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Washington State Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://www.commerce.wa.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Washington SBDC",
        description: "Free business consulting and training programs",
        url: "https://wsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "West Virginia": {
    businessResources: [
      {
        category: "Business Registration",
        title: "West Virginia Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sos.wv.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "West Virginia State Tax Department",
        description: "State tax requirements and business licensing",
        url: "https://tax.wv.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "West Virginia Development Office",
        description: "Business incentives and development programs",
        url: "https://wvdo.org/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "West Virginia SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.wvsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  "Wisconsin": {
    businessResources: [
      {
        category: "Business Registration",
        title: "Wisconsin Department of Financial Institutions",
        description: "Official business formation and annual filing portal",
        url: "https://www.wdfi.org/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Wisconsin Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.revenue.wi.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Wisconsin Economic Development Corporation",
        description: "Business incentives and development programs",
        url: "https://wedc.org/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Wisconsin SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.wisconsinsbdc.org/",
        type: "Support Resource"
      }
    ]
  }
};

async function addResourcesForAllStates() {
  console.log('Adding business resources for all remaining states...');
  
  const filePath = 'client/src/pages/annual-report-due-dates.tsx';
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add resources for each state
  Object.entries(stateResourcesData).forEach(([stateName, stateInfo]) => {
    const resourcesText = `    businessResources: [
      {
        category: "${stateInfo.businessResources[0].category}",
        title: "${stateInfo.businessResources[0].title}",
        description: "${stateInfo.businessResources[0].description}",
        url: "${stateInfo.businessResources[0].url}",
        type: "${stateInfo.businessResources[0].type}"
      },
      {
        category: "${stateInfo.businessResources[1].category}",
        title: "${stateInfo.businessResources[1].title}",
        description: "${stateInfo.businessResources[1].description}",
        url: "${stateInfo.businessResources[1].url}",
        type: "${stateInfo.businessResources[1].type}"
      },
      {
        category: "${stateInfo.businessResources[2].category}",
        title: "${stateInfo.businessResources[2].title}",
        description: "${stateInfo.businessResources[2].description}",
        url: "${stateInfo.businessResources[2].url}",
        type: "${stateInfo.businessResources[2].type}"
      },
      {
        category: "${stateInfo.businessResources[3].category}",
        title: "${stateInfo.businessResources[3].title}",
        description: "${stateInfo.businessResources[3].description}",
        url: "${stateInfo.businessResources[3].url}",
        type: "${stateInfo.businessResources[3].type}"
      }
    ]`;

    // Find the state entry and add resources
    const statePattern = new RegExp(`(\\s*state: "${stateName}",[\\s\\S]*?aiInsights: "[^"]*")`, 'g');
    content = content.replace(statePattern, `$1,\n${resourcesText}`);
  });
  
  fs.writeFileSync(filePath, content);
  console.log('Successfully added business resources for all 32 remaining states!');
}

addResourcesForAllStates();