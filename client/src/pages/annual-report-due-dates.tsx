import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// State data with comprehensive information
const stateData = [
  {
    state: "Alabama",
    abbreviation: "AL",
    dueDate: "Anniversary of Incorporation",
    fee: "$25-$100",
    franchiseTax: "No franchise tax",
    penalty: "$25-$100",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Must file by anniversary date of incorporation. Grace period of 30 days with penalty.",
    aiInsights: "Alabama has one of the lowest annual report fees in the US. Consider filing early to avoid penalties.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Alabama Secretary of State",
        description: "Official business formation and compliance portal",
        url: "https://www.sos.alabama.gov/",
        type: "Official Resource"
      },
      {
        category: "Economic Development",
        title: "Alabama Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://www.madeinalabama.com/",
        type: "Development Resource"
      },
      {
        category: "Tax Information",
        title: "Alabama Department of Revenue",
        description: "State tax obligations and filing requirements",
        url: "https://www.revenue.alabama.gov/",
        type: "Tax Resource"
      },
      {
        category: "Small Business Support",
        title: "Alabama SBDC Network",
        description: "Free business consulting and training programs",
        url: "https://www.asbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Alaska",
    abbreviation: "AK", 
    dueDate: "January 2nd",
    fee: "$100",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "All entities must file by January 2nd regardless of formation date.",
    aiInsights: "Alaska's uniform January deadline makes compliance planning easier for multi-state entities.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Alaska Division of Corporations",
        description: "State business formation and annual report filing",
        url: "https://www.commerce.alaska.gov/web/cbpl/",
        type: "Official Resource"
      },
      {
        category: "Economic Development",
        title: "Alaska Industrial Development",
        description: "Business financing and development opportunities",
        url: "https://www.aidea.org/",
        type: "Development Resource"
      },
      {
        category: "Tax Information",
        title: "Alaska Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://www.tax.alaska.gov/",
        type: "Tax Resource"
      },
      {
        category: "Small Business Support",
        title: "Alaska SBDC",
        description: "Business counseling and training programs",
        url: "https://aksbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Arizona",
    abbreviation: "AZ",
    dueDate: "Anniversary of Incorporation", 
    fee: "$45-$150",
    franchiseTax: "No franchise tax",
    penalty: "$45",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Filing period opens 60 days before anniversary date.",
    aiInsights: "Arizona offers early filing windows. Take advantage of the 60-day advance filing period.",
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
  {
    state: "Arkansas",
    abbreviation: "AR",
    dueDate: "May 1st",
    fee: "$150-$300",
    franchiseTax: "$150 minimum",
    penalty: "$300",
    filingMethod: "Online/Mail",
    processingTime: "2-3 weeks",
    additionalInfo: "Franchise tax report required annually by May 1st.",
    aiInsights: "Arkansas combines annual reports with franchise tax. Budget for both fees when planning.",
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
  {
    state: "California",
    abbreviation: "CA",
    dueDate: "Anniversary of Incorporation",
    fee: "$20-$800",
    franchiseTax: "$800 minimum",
    penalty: "$250",
    filingMethod: "Online/Mail",
    processingTime: "2-4 weeks", 
    additionalInfo: "Statement of Information due every 2 years. Franchise tax due annually.",
    aiInsights: "California has the highest minimum franchise tax. Consider entity structure carefully for tax efficiency.",
    businessResources: [
      {
        category: "Business Registration",
        title: "California Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.ca.gov/business-programs/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "California Franchise Tax Board",
        description: "State franchise tax obligations and calculations",
        url: "https://www.ftb.ca.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "California Governor's Office of Business Development",
        description: "Business incentives and development programs",
        url: "https://business.ca.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "California SBDC Network",
        description: "Free business consulting and training statewide",
        url: "https://www.californiasbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Colorado",
    abbreviation: "CO",
    dueDate: "Anniversary of Incorporation",
    fee: "$10",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online",
    processingTime: "1 week",
    additionalInfo: "One of the lowest annual report fees in the US.",
    aiInsights: "Colorado offers excellent value with low fees and efficient online processing.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Colorado Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.state.co.us/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Colorado Department of Revenue",
        description: "State tax requirements and business obligations",
        url: "https://tax.colorado.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Colorado Office of Economic Development",
        description: "Business incentives and development programs",
        url: "https://choosecolorado.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Colorado SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.coloradosbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Connecticut",
    abbreviation: "CT",
    dueDate: "March 31st",
    fee: "$80-$275",
    franchiseTax: "$250 minimum",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "2-3 weeks",
    additionalInfo: "Annual report and franchise tax due March 31st.",
    aiInsights: "Connecticut's March deadline affects Q1 cash flow. Plan accordingly for tax obligations.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Connecticut Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://portal.ct.gov/sots",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Connecticut Department of Revenue Services",
        description: "State tax requirements and franchise tax obligations",
        url: "https://portal.ct.gov/drs",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Connecticut Department of Economic Development",
        description: "Business incentives and development programs",
        url: "https://portal.ct.gov/decd",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Connecticut SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.ctsbdc.com/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Delaware",
    abbreviation: "DE",
    dueDate: "March 1st",
    fee: "$175-$200",
    franchiseTax: "$175 minimum",
    penalty: "$200",
    filingMethod: "Online/Mail/Phone",
    processingTime: "1-2 weeks",
    additionalInfo: "Popular incorporation state with streamlined processes.",
    aiInsights: "Delaware's corporate-friendly laws and courts make it attractive despite higher fees.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Delaware Division of Corporations",
        description: "Premier state for corporate formation and compliance",
        url: "https://corp.delaware.gov/",
        type: "Official Resource"
      },
      {
        category: "Legal Support",
        title: "Delaware Court of Chancery",
        description: "Specialized business court for corporate disputes",
        url: "https://courts.delaware.gov/chancery/",
        type: "Legal Resource"
      },
      {
        category: "Tax Information",
        title: "Delaware Franchise Tax Calculator",
        description: "Calculate annual franchise tax obligations",
        url: "https://corp.delaware.gov/paytaxes/",
        type: "Calculator Tool"
      },
      {
        category: "Business Development",
        title: "Delaware Economic Development Office",
        description: "Resources for business growth and incentives",
        url: "https://businessindelaware.com/",
        type: "Development Resource"
      }
    ]
  },
  {
    state: "Florida",
    abbreviation: "FL",
    dueDate: "May 1st",
    fee: "$138.75",
    franchiseTax: "No franchise tax",
    penalty: "$400",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by May 1st for all entity types.",
    aiInsights: "Florida's no state income tax and reasonable fees make it business-friendly.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Florida Division of Corporations",
        description: "State business formation and annual report filing",
        url: "https://dos.fl.gov/sunbiz/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Florida Department of Revenue",
        description: "State tax requirements and business licensing",
        url: "https://floridarevenue.com/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Enterprise Florida",
        description: "Business development and incentive programs",
        url: "https://www.enterpriseflorida.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Florida SBDC Network",
        description: "Free business consulting and training programs",
        url: "https://www.floridasbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Georgia",
    abbreviation: "GA", 
    dueDate: "April 1st",
    fee: "$50",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual registration due by April 1st.",
    aiInsights: "Georgia offers competitive fees and no franchise tax, beneficial for small businesses.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Georgia Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sos.ga.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information", 
        title: "Georgia Department of Revenue",
        description: "State tax requirements and business obligations",
        url: "https://dor.georgia.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Georgia Department of Economic Development", 
        description: "Business incentives and development programs",
        url: "https://www.georgia.org/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Georgia SBDC",
        description: "Free business consulting and training programs", 
        url: "https://www.georgiasbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Hawaii",
    abbreviation: "HI",
    dueDate: "March 31st", 
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online/Mail",
    processingTime: "2-3 weeks",
    additionalInfo: "One of the lowest annual report fees nationally.",
    aiInsights: "Hawaii's low fees offset some of the challenges of doing business in a remote location.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Hawaii Department of Commerce and Consumer Affairs",
        description: "Official business formation and annual filing portal",
        url: "https://cca.hawaii.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Hawaii Department of Taxation", 
        description: "State tax requirements and business obligations",
        url: "https://tax.hawaii.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Hawaii Department of Business Development",
        description: "Business incentives and development programs",
        url: "https://invest.hawaii.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Hawaii SBDC Network",
        description: "Free business consulting and training programs",
        url: "https://www.hawaiisbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Idaho",
    abbreviation: "ID",
    dueDate: "Anniversary of Incorporation",
    fee: "$30",
    franchiseTax: "No franchise tax", 
    penalty: "$30",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date.",
    aiInsights: "Idaho's business-friendly environment includes low fees and minimal regulatory burden.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Idaho Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sos.idaho.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Idaho State Tax Commission",
        description: "State tax requirements and business obligations",
        url: "https://tax.idaho.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Idaho Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://commerce.idaho.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Idaho SBDC",
        description: "Free business consulting and training programs",
        url: "https://idahosbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Illinois",
    abbreviation: "IL",
    dueDate: "Anniversary of Incorporation",
    fee: "$75-$150",
    franchiseTax: "$150-$2M+",
    penalty: "$300",
    filingMethod: "Online/Mail",
    processingTime: "2-3 weeks",
    additionalInfo: "Annual report and franchise tax based on net worth.",
    aiInsights: "Illinois franchise tax can be substantial for larger companies. Consider tax planning strategies.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Illinois Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.ilsos.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Illinois Department of Revenue",
        description: "State tax requirements and franchise tax obligations",
        url: "https://www2.illinois.gov/rev/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Illinois Department of Commerce",
        description: "Business incentives and development programs",
        url: "https://www2.illinois.gov/dceo/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Illinois SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.ilsbdc.net/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Texas",
    abbreviation: "TX",
    dueDate: "Anniversary of Incorporation",
    fee: "$300",
    franchiseTax: "$300-$2M+",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Public Information Report due by anniversary date with franchise tax.",
    aiInsights: "Texas has substantial franchise tax obligations. Plan for both annual report and franchise tax filings.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Texas Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.sos.state.tx.us/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Texas Comptroller of Public Accounts",
        description: "Franchise tax and state tax obligations",
        url: "https://comptroller.texas.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Texas Economic Development Corporation",
        description: "Business incentives and development programs",
        url: "https://gov.texas.gov/business/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Texas SBDC Network",
        description: "Free business consulting and training programs",
        url: "https://www.txsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Indiana",
    abbreviation: "IN",
    dueDate: "Anniversary of Incorporation",
    fee: "$50",
    franchiseTax: "No franchise tax",
    penalty: "$30",
    filingMethod: "Online/Mail", 
    processingTime: "1-2 weeks",
    additionalInfo: "Business Entity Report due by anniversary date.",
    aiInsights: "Indiana's stable business environment and reasonable fees attract many corporations.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Indiana Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.in.gov/sos/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Indiana Department of Revenue",
        description: "State tax requirements and business obligations",
        url: "https://www.in.gov/dor/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Indiana Economic Development Corporation",
        description: "Business incentives and development programs",
        url: "https://iedc.in.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Indiana SBDC",
        description: "Free business consulting and training programs",
        url: "https://isbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Iowa",
    abbreviation: "IA",
    dueDate: "April 1st",
    fee: "$30-$60",
    franchiseTax: "No franchise tax",
    penalty: "$5/month",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Biennial filing required (every 2 years).",
    aiInsights: "Iowa's biennial filing reduces administrative burden while maintaining compliance.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Iowa Secretary of State",
        description: "Official business formation and biennial filing portal",
        url: "https://sos.iowa.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Iowa Department of Revenue",
        description: "State tax requirements and business obligations",
        url: "https://tax.iowa.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Iowa Economic Development Authority",
        description: "Business incentives and development programs",
        url: "https://www.iowaeconomicdevelopment.com/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Iowa SBDC",
        description: "Free business consulting and training programs",
        url: "https://www.iowasbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Nevada",
    abbreviation: "NV",
    dueDate: "Anniversary of Incorporation",
    fee: "$325",
    franchiseTax: "No franchise tax",
    penalty: "$75",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual List of Officers due by anniversary date. One of the most business-friendly states.",
    aiInsights: "Nevada offers excellent privacy protection and no state income tax, making it attractive for businesses.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Nevada Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://www.nvsos.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Nevada Department of Taxation",
        description: "State tax requirements and business licensing",
        url: "https://tax.nv.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Nevada Governor's Office of Economic Development",
        description: "Business incentives and development programs",
        url: "https://goed.nv.gov/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Nevada SBDC",
        description: "Free business consulting and training programs",
        url: "https://nevadasbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Wyoming",
    abbreviation: "WY",
    dueDate: "Anniversary of Incorporation",
    fee: "$50",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual Report due by anniversary date. Known for privacy protection and low fees.",
    aiInsights: "Wyoming offers the lowest annual report fees and strong privacy protections for business owners.",
    businessResources: [
      {
        category: "Business Registration",
        title: "Wyoming Secretary of State",
        description: "Official business formation and annual filing portal",
        url: "https://sos.wyo.gov/",
        type: "Official Resource"
      },
      {
        category: "Tax Information",
        title: "Wyoming Department of Revenue",
        description: "State tax requirements and business obligations",
        url: "https://revenue.wyo.gov/",
        type: "Tax Resource"
      },
      {
        category: "Economic Development",
        title: "Wyoming Business Council",
        description: "Business development and economic growth programs",
        url: "https://wyomingbusiness.org/",
        type: "Development Resource"
      },
      {
        category: "Small Business Support",
        title: "Wyoming SBDC",
        description: "Business consulting and entrepreneurship support",
        url: "https://www.wyomingsbdc.org/",
        type: "Support Resource"
      }
    ]
  },
  {
    state: "Kansas",
    abbreviation: "KS",
    dueDate: "July 15th",
    fee: "$55",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due July 15th with 30-day grace period.",
    aiInsights: "Kansas offers reasonable fees and business-friendly policies for small businesses.",
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
  {
    state: "Kentucky",
    abbreviation: "KY",
    dueDate: "June 30th",
    fee: "$15",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "One of the lowest filing fees in the nation.",
    aiInsights: "Kentucky provides extremely affordable annual report filing with minimal penalties.",
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
  {
    state: "Louisiana",
    abbreviation: "LA",
    dueDate: "Anniversary of Incorporation",
    fee: "$35",
    franchiseTax: "No franchise tax",
    penalty: "$100",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date of incorporation.",
    aiInsights: "Louisiana offers reasonable fees with moderate penalties for late filing.",
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
  {
    state: "Maine",
    abbreviation: "ME",
    dueDate: "June 1st",
    fee: "$85",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due June 1st for all entity types.",
    aiInsights: "Maine has moderate fees with straightforward filing requirements.",
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
  {
    state: "Maryland",
    abbreviation: "MD",
    dueDate: "April 15th",
    fee: "$300",
    franchiseTax: "No franchise tax",
    penalty: "$125",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due April 15th with electronic filing required.",
    aiInsights: "Maryland has higher fees but offers robust business support services.",
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
  {
    state: "Massachusetts",
    abbreviation: "MA",
    dueDate: "Anniversary of Incorporation",
    fee: "$125",
    franchiseTax: "No franchise tax",
    penalty: "$100",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date of incorporation.",
    aiInsights: "Massachusetts requires electronic filing with moderate fees and penalties.",
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
  {
    state: "Michigan",
    abbreviation: "MI",
    dueDate: "May 15th",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting with online filing required.",
    aiInsights: "Michigan offers some of the lowest fees in the nation with efficient online processing.",
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
  {
    state: "Minnesota",
    abbreviation: "MN",
    dueDate: "December 31st",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due December 31st with low fees.",
    aiInsights: "Minnesota provides affordable annual reporting with minimal penalties.",
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
  {
    state: "Mississippi",
    abbreviation: "MS",
    dueDate: "April 15th",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due April 15th.",
    aiInsights: "Mississippi offers very affordable annual report fees with minimal penalties.",
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
  {
    state: "Missouri",
    abbreviation: "MO",
    dueDate: "Anniversary of Incorporation",
    fee: "$45",
    franchiseTax: "No franchise tax",
    penalty: "$45",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date of incorporation.",
    aiInsights: "Missouri provides reasonable fees with flexible filing options.",
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
  {
    state: "Montana",
    abbreviation: "MT",
    dueDate: "April 15th",
    fee: "$20",
    franchiseTax: "No franchise tax",
    penalty: "$10",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due April 15th.",
    aiInsights: "Montana offers the lowest annual report fees with minimal penalties.",
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
  {
    state: "Nebraska",
    abbreviation: "NE",
    dueDate: "March 1st",
    fee: "$26",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due March 1st with reasonable fees.",
    aiInsights: "Nebraska provides affordable annual reporting with efficient processing.",
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
  {
    state: "New Hampshire",
    abbreviation: "NH",
    dueDate: "April 1st",
    fee: "$100",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due April 1st with moderate fees.",
    aiInsights: "New Hampshire offers business-friendly policies with reasonable annual report costs.",
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
  {
    state: "New Jersey",
    abbreviation: "NJ",
    dueDate: "Anniversary of Incorporation",
    fee: "$75",
    franchiseTax: "$150 minimum",
    penalty: "$100",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with franchise tax.",
    aiInsights: "New Jersey has moderate fees but includes franchise tax requirements.",
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
  {
    state: "New Mexico",
    abbreviation: "NM",
    dueDate: "March 15th",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due March 15th.",
    aiInsights: "New Mexico offers affordable fees with straightforward filing requirements.",
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
  {
    state: "New York",
    abbreviation: "NY",
    dueDate: "Anniversary of Incorporation",
    fee: "$25",
    franchiseTax: "$25 minimum",
    penalty: "$50",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Biennial report due every two years by anniversary date.",
    aiInsights: "New York requires biennial filing with low base fees but includes franchise tax.",
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
  {
    state: "North Carolina",
    abbreviation: "NC",
    dueDate: "April 15th",
    fee: "$200",
    franchiseTax: "No franchise tax",
    penalty: "$200",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due April 15th with electronic filing required.",
    aiInsights: "North Carolina has higher fees but provides comprehensive business support services.",
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
  {
    state: "North Dakota",
    abbreviation: "ND",
    dueDate: "November 15th",
    fee: "$50",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due November 15th with reasonable fees.",
    aiInsights: "North Dakota offers moderate fees with business-friendly policies.",
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
  {
    state: "Ohio",
    abbreviation: "OH",
    dueDate: "Anniversary of Incorporation",
    fee: "$50",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with electronic filing.",
    aiInsights: "Ohio provides reasonable fees with efficient online filing systems.",
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
  {
    state: "Oklahoma",
    abbreviation: "OK",
    dueDate: "July 1st",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due July 1st.",
    aiInsights: "Oklahoma offers very affordable annual report fees with business-friendly policies.",
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
  {
    state: "Oregon",
    abbreviation: "OR",
    dueDate: "Anniversary of Incorporation",
    fee: "$100",
    franchiseTax: "No franchise tax",
    penalty: "$100",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with electronic filing.",
    aiInsights: "Oregon requires electronic filing with moderate fees and penalties.",
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
  {
    state: "Pennsylvania",
    abbreviation: "PA",
    dueDate: "April 15th",
    fee: "$70",
    franchiseTax: "No franchise tax",
    penalty: "$250",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due April 15th with significant penalties for late filing.",
    aiInsights: "Pennsylvania has moderate fees but substantial penalties emphasizing timely filing.",
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
  {
    state: "Rhode Island",
    abbreviation: "RI",
    dueDate: "Anniversary of Incorporation",
    fee: "$50",
    franchiseTax: "No franchise tax",
    penalty: "$100",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with electronic filing.",
    aiInsights: "Rhode Island provides reasonable fees with efficient online processing.",
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
  {
    state: "South Carolina",
    abbreviation: "SC",
    dueDate: "Anniversary of Incorporation",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due by anniversary date.",
    aiInsights: "South Carolina offers very affordable fees with minimal penalties.",
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
  {
    state: "South Dakota",
    abbreviation: "SD",
    dueDate: "Anniversary of Incorporation",
    fee: "$50",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with reasonable fees.",
    aiInsights: "South Dakota provides business-friendly policies with moderate fees.",
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
  {
    state: "Tennessee",
    abbreviation: "TN",
    dueDate: "Anniversary of Incorporation",
    fee: "$20",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due by anniversary date.",
    aiInsights: "Tennessee offers some of the lowest annual report fees with electronic filing.",
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
  {
    state: "Utah",
    abbreviation: "UT",
    dueDate: "Anniversary of Incorporation",
    fee: "$20",
    franchiseTax: "No franchise tax",
    penalty: "$20",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Very low-cost annual reporting due by anniversary date.",
    aiInsights: "Utah offers among the lowest annual report fees with efficient online systems.",
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
  {
    state: "Vermont",
    abbreviation: "VT",
    dueDate: "Anniversary of Incorporation",
    fee: "$35",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with reasonable fees.",
    aiInsights: "Vermont provides affordable annual reporting with flexible filing options.",
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
  {
    state: "Virginia",
    abbreviation: "VA",
    dueDate: "Anniversary of Incorporation",
    fee: "$50",
    franchiseTax: "$50 minimum",
    penalty: "$100",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with franchise tax.",
    aiInsights: "Virginia has moderate fees but includes franchise tax requirements.",
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
  {
    state: "Washington",
    abbreviation: "WA",
    dueDate: "Anniversary of Incorporation",
    fee: "$71",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Annual report due by anniversary date with electronic filing.",
    aiInsights: "Washington requires electronic filing with moderate fees and efficient processing.",
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
  {
    state: "West Virginia",
    abbreviation: "WV",
    dueDate: "July 1st",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$50",
    filingMethod: "Online/Mail",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due July 1st.",
    aiInsights: "West Virginia offers affordable fees with business-friendly policies.",
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
  {
    state: "Wisconsin",
    abbreviation: "WI",
    dueDate: "Anniversary of Incorporation",
    fee: "$25",
    franchiseTax: "No franchise tax",
    penalty: "$25",
    filingMethod: "Online",
    processingTime: "1-2 weeks",
    additionalInfo: "Low-cost annual reporting due by anniversary date.",
    aiInsights: "Wisconsin offers very affordable fees with efficient electronic filing.",
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
];

export default function AnnualReportDueDates() {
  const [selectedState, setSelectedState] = useState<typeof stateData[0] | null>(null);
  const [selectedStateForDirectory, setSelectedStateForDirectory] = useState<string>("");
  const [selectedStateForAI, setSelectedStateForAI] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");

  const selectedStateData = selectedStateForDirectory 
    ? stateData.find(state => state.state === selectedStateForDirectory)
    : null;

  const selectedAIStateData = stateData.find(state => state.state === selectedStateForAI);

  const upcomingDeadlines = stateData.filter(state => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    
    // Check for states with fixed deadlines in the next 60 days
    if (state.dueDate.includes("January") && currentMonth >= 11) return true;
    if (state.dueDate.includes("March") && currentMonth >= 1 && currentMonth <= 3) return true;
    if (state.dueDate.includes("April") && currentMonth >= 2 && currentMonth <= 4) return true;
    if (state.dueDate.includes("May") && currentMonth >= 3 && currentMonth <= 5) return true;
    
    return false;
  }).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#1a5f33] via-[#27884b] to-[#34d058] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Compliance Tools</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Annual Report Due Dates
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              State-by-state filing deadlines, fees, and AI-powered compliance insights
            </p>
            
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="states">State Directory</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">50</div>
                  <div className="text-sm text-gray-600">States Covered</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">$10-$800</div>
                  <div className="text-sm text-gray-600">Fee Range</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">15</div>
                  <div className="text-sm text-gray-600">States with Franchise Tax</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">{upcomingDeadlines.length}</div>
                  <div className="text-sm text-gray-600">Upcoming Deadlines</div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Deadlines Alert */}
            {upcomingDeadlines.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <AlertDescription>
                  <strong>Upcoming Deadlines:</strong> {upcomingDeadlines.map(s => s.state).join(", ")} have annual reports due soon. Plan your filings accordingly.
                </AlertDescription>
              </Alert>
            )}

            {/* Popular States */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                  </svg>
                  Popular Business Formation States
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stateData.filter(s => ["Delaware", "California", "Florida", "Texas", "Nevada", "Wyoming"].includes(s.state)).map((state) => (
                    <div key={state.state} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedState(state)}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{state.state}</h3>
                        <Badge variant="outline">{state.abbreviation}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div><strong>Due:</strong> {state.dueDate}</div>
                        <div><strong>Fee:</strong> {state.fee}</div>
                        <div><strong>Franchise Tax:</strong> {state.franchiseTax}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="states" className="space-y-6">
            {/* State Selection Dropdown */}
            <div className="max-w-md mx-auto mb-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select a State</label>
                <Select value={selectedStateForDirectory} onValueChange={setSelectedStateForDirectory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a US State..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stateData.map((state) => (
                      <SelectItem key={state.state} value={state.state}>
                        {state.state} ({state.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected State Details */}
            {selectedStateData ? (
              <div className="max-w-4xl mx-auto">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">{selectedStateData.abbreviation}</span>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">{selectedStateData.state}</CardTitle>
                        <p className="text-gray-600">Annual Report Requirements</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-8">
                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Due Date</h3>
                        </div>
                        <p className="text-lg font-medium text-gray-800">{selectedStateData.dueDate}</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Filing Fee</h3>
                        </div>
                        <p className="text-lg font-medium text-gray-800">{selectedStateData.fee}</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Franchise Tax</h3>
                        </div>
                        <p className="text-lg font-medium text-gray-800">{selectedStateData.franchiseTax}</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Late Penalty</h3>
                        </div>
                        <p className="text-lg font-medium text-red-600">{selectedStateData.penalty}</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 0a1 1 0 100 2h.01a1 1 0 100-2H9zm2 0a1 1 0 100 2h.01a1 1 0 100-2H11z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Filing Method</h3>
                        </div>
                        <p className="text-lg font-medium text-gray-800">{selectedStateData.filingMethod}</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Processing Time</h3>
                        </div>
                        <p className="text-lg font-medium text-gray-800">{selectedStateData.processingTime}</p>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                        </svg>
                        Additional Information
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{selectedStateData.additionalInfo}</p>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                      <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                        </svg>
                        AI Strategic Insights
                      </h3>
                      <p className="text-purple-800 leading-relaxed">{selectedStateData.aiInsights}</p>
                    </div>

                    {/* Business Resources Section */}
                    {selectedStateData.businessResources && (
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                          </svg>
                          State-Specific Business Resources
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {selectedStateData.businessResources.map((resource, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-white bg-green-500 px-2 py-1 rounded-full">
                                      {resource.category}
                                    </span>
                                    <span className="text-xs text-gray-500">{resource.type}</span>
                                  </div>
                                  <h4 className="font-medium text-gray-900 mb-1">{resource.title}</h4>
                                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                                  <button
                                    onClick={() => window.open(resource.url, '_blank')}
                                    style={{
                                      backgroundColor: '#10b981',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '8px 16px',
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px'
                                    }}
                                    onMouseEnter={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = '#059669';
                                    }}
                                    onMouseLeave={(e) => {
                                      (e.target as HTMLElement).style.backgroundColor = '#10b981';
                                    }}
                                  >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                                    </svg>
                                    Visit Resource
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        onClick={() => window.location.href = `/annual-report-service`}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '16px 24px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#059669';
                          (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#10b981';
                          (e.target as HTMLElement).style.transform = 'translateY(0)';
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                        </svg>
                        File Annual Report for {selectedStateData.state}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedState(selectedStateData);
                          setActiveTab("insights");
                        }}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#6b7280',
                          border: '2px solid #d1d5db',
                          borderRadius: '8px',
                          padding: '16px 24px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.borderColor = '#10b981';
                          (e.target as HTMLElement).style.color = '#10b981';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.borderColor = '#d1d5db';
                          (e.target as HTMLElement).style.color = '#6b7280';
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                        </svg>
                        View Detailed AI Insights
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a State</h3>
                <p className="text-gray-600 max-w-md mx-auto">Choose a state from the dropdown above to view detailed annual report requirements, fees, and AI-powered compliance insights.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* State Selection for AI Insights */}
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered State Insights</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Get intelligent insights and strategic recommendations for annual report compliance in any state
                </p>
                
                <Select value={selectedStateForAI || ""} onValueChange={setSelectedStateForAI}>
                  <SelectTrigger className="w-full max-w-md mx-auto">
                    <SelectValue placeholder="Choose a US State for AI Insights...">
                      {selectedStateForAI && stateData.find(s => s.state === selectedStateForAI) 
                        ? `${selectedStateForAI} (${stateData.find(s => s.state === selectedStateForAI)?.abbreviation})`
                        : "Choose a US State for AI Insights..."
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {stateData.map((state) => (
                      <SelectItem key={state.state} value={state.state}>
                        {state.state} ({state.abbreviation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* AI Insights Display */}
            {selectedAIStateData && (
              <div className="max-w-4xl mx-auto">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
                  <CardHeader className="text-center pb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle className="text-3xl font-bold text-gray-900">{selectedAIStateData.state} AI Insights</CardTitle>
                        <p className="text-gray-600">Strategic compliance recommendations powered by AI</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-8">
                    {/* State Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Filing Fee</h3>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{selectedAIStateData.fee}</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Due Date</h3>
                        </div>
                        <p className="text-lg font-medium text-gray-800">{selectedAIStateData.dueDate}</p>
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900">Late Penalty</h3>
                        </div>
                        <p className="text-lg font-bold text-red-600">{selectedAIStateData.penalty}</p>
                      </div>
                    </div>

                    {/* AI Strategic Insights Section */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-8 text-white">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold mb-4">AI Strategic Analysis</h3>
                          <p className="text-lg leading-relaxed text-purple-100">
                            {selectedAIStateData.aiInsights}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <button
                        onClick={() => window.location.href = `/annual-report-service`}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '16px 32px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          flex: 1
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#059669';
                          (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.backgroundColor = '#10b981';
                          (e.target as HTMLElement).style.transform = 'translateY(0)';
                        }}
                      >
                        File Annual Report for {selectedAIStateData.state}
                      </button>
                      <button
                        onClick={() => setSelectedStateForDirectory(selectedAIStateData.state)}
                        style={{
                          backgroundColor: 'transparent',
                          color: '#6b7280',
                          border: '2px solid #d1d5db',
                          borderRadius: '12px',
                          padding: '16px 32px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          flex: 1
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.borderColor = '#9ca3af';
                          (e.target as HTMLElement).style.color = '#374151';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.borderColor = '#d1d5db';
                          (e.target as HTMLElement).style.color = '#6b7280';
                        }}
                      >
                        View {selectedAIStateData.state} Resources
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Show placeholder only when no state is selected for AI insights */}
            {!selectedStateForAI && (
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardContent className="p-12 text-center">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a State for AI Insights</h3>
                    <p className="text-gray-600">Choose a state from the dropdown above to view detailed AI-powered compliance insights and recommendations.</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}