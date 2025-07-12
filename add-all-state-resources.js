// Script to add business resources for all 50 states
const fs = require('fs');

const stateResources = {
  "Georgia": [
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
  ],
  "Hawaii": [
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
  ],
  "Idaho": [
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
};

// Add resources for all remaining states...
const allStateResources = {
  ...stateResources,
  "Illinois": [
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
  ],
  "Indiana": [
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
};

console.log('State resources ready for implementation:', Object.keys(allStateResources));