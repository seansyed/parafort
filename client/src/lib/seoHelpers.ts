// SEO utility functions and constants

export const baseUrl = "https://parafort.com";

// Common SEO data
export const defaultMetaData = {
  siteName: "ParaFort",
  author: "ParaFort Inc.",
  twitterHandle: "@ParaFort",
  defaultImage: `${baseUrl}/assets/parafort-social-image.jpg`,
  companyInfo: {
    name: "ParaFort Inc.",
    address: "9175 Elk Grove Florin Road, Ste 5, Elk Grove, CA 95624",
    phone: "+1-800-PARAFORT",
    email: "support@parafort.com"
  }
};

// Service-specific SEO templates
export const serviceMetaTemplates = {
  llcFormation: {
    title: "LLC Formation Services - Start Your LLC Online | ParaFort",
    description: "Form your LLC quickly and easily with our expert guidance. Includes state filing, registered agent service, and ongoing compliance support. Starting at $149 + state fees.",
    keywords: "LLC formation, start LLC online, LLC registration, limited liability company, business formation, registered agent"
  },
  
  corporationFormation: {
    title: "Corporation Formation - Incorporate Your Business | ParaFort", 
    description: "Incorporate your business with professional support. C-Corp and S-Corp formation available with ongoing compliance management. Starting at $199 + state fees.",
    keywords: "corporation formation, incorporate business, C-corp formation, S-corp formation, business incorporation"
  },
  
  einApplication: {
    title: "EIN Application Service - Get Your Federal Tax ID | ParaFort",
    description: "Get your Federal Employer Identification Number (EIN) quickly. Essential for business banking, taxes, and hiring employees. Fast processing in 1-2 business days.",
    keywords: "EIN application, federal tax ID, employer identification number, business tax ID, IRS EIN"
  },
  
  registeredAgent: {
    title: "Registered Agent Services - Professional Business Address | ParaFort",
    description: "Professional registered agent service in all 50 states. Reliable mail forwarding, legal document receipt, and compliance notifications. $99/year.",
    keywords: "registered agent service, business address, mail forwarding, legal document service, compliance notifications"
  },
  
  bookkeeping: {
    title: "Professional Bookkeeping Services - Accounting Support | ParaFort",
    description: "Expert bookkeeping services for small businesses. Monthly financial reports, tax preparation support, and QuickBooks management. Plans starting at $100/month.",
    keywords: "bookkeeping services, small business accounting, financial reports, QuickBooks, tax preparation"
  },
  
  payroll: {
    title: "Payroll Services - Employee Payment Processing | ParaFort",
    description: "Complete payroll processing for your business. Direct deposits, tax filings, compliance management, and employee self-service. Competitive pricing.",
    keywords: "payroll services, employee payroll, direct deposit, payroll taxes, payroll processing"
  },
  
  annualReports: {
    title: "Annual Report Filing Service - Stay Compliant | ParaFort",
    description: "Professional annual report filing to keep your business in good standing. State-specific requirements handled by experts. Never miss a deadline.",
    keywords: "annual report filing, business compliance, state filings, corporate maintenance, business good standing"
  },
  
  digitalMailbox: {
    title: "Digital Mailbox Service - Virtual Business Address | ParaFort",
    description: "Professional virtual mailbox service for your business. Mail scanning, forwarding, and digital access to important documents. Multiple locations available.",
    keywords: "digital mailbox, virtual address, mail forwarding, business address, mail scanning service"
  }
};

// Generate canonical URLs
export const generateCanonicalUrl = (path: string): string => {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Generate meta descriptions with dynamic content
export const generateMetaDescription = (template: string, variables: Record<string, string>): string => {
  let description = template;
  Object.entries(variables).forEach(([key, value]) => {
    description = description.replace(`{${key}}`, value);
  });
  return description;
};