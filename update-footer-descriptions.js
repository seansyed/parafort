import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function updateFooterWithDescriptions() {
  try {
    const footerConfigWithDescriptions = {
      "id": 1,
      "companyName": "ParaFort LLC",
      "companyDescription": "Professional business formation and compliance management platform",
      "phone": "(844) 444-5411",
      "email": "info@parafort.com",
      "address": "123 Business Ave, Suite 100, Business City, BC 12345",
      "socialLinks": {
        "twitter": "https://twitter.com/parafort",
        "youtube": "https://youtube.com/@parafort",
        "facebook": "https://facebook.com/parafort",
        "linkedin": "https://linkedin.com/company/parafort",
        "instagram": "https://instagram.com/parafort"
      },
      "sections": [
        {
          "title": "Entity Types",
          "links": [
            {
              "url": "/entity-types/sole-proprietorship",
              "text": "Sole Proprietorship",
              "description": "Simplest business structure for individuals"
            },
            {
              "url": "/entity-types/partnership",
              "text": "Partnership",
              "description": "Business owned by two or more people"
            },
            {
              "url": "/entity-types/llc",
              "text": "Limited Liability Company (LLC)",
              "description": "Flexible structure with liability protection"
            },
            {
              "url": "/entity-types/c-corporation",
              "text": "C Corporation",
              "description": "Traditional corporation with double taxation"
            },
            {
              "url": "/entity-types/s-corporation",
              "text": "S Corporation",
              "description": "Pass-through taxation with corporate benefits"
            },
            {
              "url": "/entity-types/professional-corporation",
              "text": "Professional Corporation",
              "description": "For licensed professionals like doctors and lawyers"
            },
            {
              "url": "/entity-types/pllc",
              "text": "Professional LLC (PLLC)",
              "description": "LLC structure for professional services"
            },
            {
              "url": "/entity-types/nonprofit",
              "text": "Nonprofit Corporation",
              "description": "Tax-exempt organization for charitable purposes"
            },
            {
              "url": "/entity-types/cooperative",
              "text": "Cooperative",
              "description": "Member-owned and democratically controlled business"
            }
          ]
        },
        {
          "title": "Services & Compliance",
          "links": [
            {
              "url": "/business-formation-service",
              "text": "Business Formation",
              "description": "Start your LLC or Corporation professionally"
            },
            {
              "url": "/boir-filing",
              "text": "BOIR Filing",
              "description": "Corporate Transparency Act compliance"
            },
            {
              "url": "/annual-report-service",
              "text": "Annual Report Filing",
              "description": "State-required annual business reports"
            },
            {
              "url": "/ein-service",
              "text": "EIN Application",
              "description": "Federal tax identification number"
            },
            {
              "url": "/s-corporation-election",
              "text": "S-Corporation Election",
              "description": "IRS Form 2553 tax election filing"
            },
            {
              "url": "/business-legal-name-change",
              "text": "Legal Name Change",
              "description": "Update your business name officially"
            },
            {
              "url": "/business-dissolution-service",
              "text": "Business Dissolution",
              "description": "Legally close your business entity"
            },
            {
              "url": "/business-license-services",
              "text": "Business License Services",
              "description": "Required permits and licenses"
            },
            {
              "url": "/fictitious-business-services",
              "text": "Fictitious Business Name",
              "description": "Register your DBA or trade name"
            },
            {
              "url": "/registered-agent-services",
              "text": "Registered Agent Services",
              "description": "Professional legal document receipt"
            },
            {
              "url": "/digital-mailbox-services",
              "text": "Digital Mailbox Services",
              "description": "Virtual business address and mail handling"
            },
            {
              "url": "/business-management",
              "text": "Business Management",
              "description": "Comprehensive business support services"
            },
            {
              "url": "/legal-documents",
              "text": "Legal Document Library",
              "description": "Professional legal document templates"
            }
          ]
        },
        {
          "title": "Accounting & Tax",
          "subSections": [
            {
              "title": "Accounting & Tax",
              "links": [
                {
                  "url": "/accounting-bookkeeping-services",
                  "text": "Accounting & Bookkeeping",
                  "description": "Professional financial record keeping"
                },
                {
                  "url": "/business-payroll-services",
                  "text": "Business Payroll Services",
                  "description": "Complete payroll management"
                },
                {
                  "url": "/business-tax-filing-services",
                  "text": "Business Tax Filing",
                  "description": "Expert tax preparation and filing"
                },
                {
                  "url": "#",
                  "text": "Tax Forms",
                  "badge": "Coming Soon",
                  "description": "Downloadable tax forms and resources"
                }
              ]
            },
            {
              "title": "Tools & Resources",
              "links": [
                {
                  "url": "/entity-comparison",
                  "text": "Entity Comparison",
                  "description": "Compare business entity types side-by-side"
                },
                {
                  "url": "/entity-requirements",
                  "text": "State Requirements",
                  "description": "State-specific formation requirements"
                },
                {
                  "url": "/business-name-generator",
                  "text": "Business Name Generator",
                  "description": "AI-powered business name suggestions"
                },
                {
                  "url": "/business-learning-center",
                  "text": "Business Learning Center",
                  "badge": "New",
                  "description": "Educational courses for business growth"
                },
                {
                  "url": "/annual-report-due-dates",
                  "text": "Annual Report Due Dates",
                  "description": "State filing deadlines and requirements"
                },
                {
                  "url": "/legal-documents-service",
                  "text": "Legal Documents",
                  "description": "Professional legal document services"
                }
              ]
            }
          ]
        },
        {
          "title": "Support",
          "links": [
            {
              "url": "/help",
              "text": "Help Center",
              "description": "Find answers to common questions"
            },
            {
              "url": "/contact",
              "text": "Contact Us",
              "description": "Get in touch with our support team"
            },
            {
              "url": "#",
              "text": "Live Chat",
              "description": "Real-time support assistance"
            },
            {
              "url": "#",
              "text": "Schedule Call",
              "description": "Book a consultation with our experts"
            },
            {
              "url": "/faq",
              "text": "FAQ",
              "description": "Frequently asked questions and answers"
            }
          ]
        }
      ],
      "copyrightText": "© 2025 ParaFort. All rights reserved.",
      "legalLinks": [
        {
          "url": "https://parafort.com/privacy-policy",
          "text": "Privacy Policy"
        },
        {
          "url": "https://parafort.com/terms-of-service",
          "text": "Terms of Service"
        },
        {
          "url": "https://parafort.com/cookie-policy",
          "text": "Cookie Policy"
        },
        {
          "url": "https://parafort.com/disclaimer",
          "text": "Disclaimer"
        }
      ],
      "showSocialMedia": true,
      "showNewsletter": true,
      "newsletterTitle": "Stay Updated",
      "newsletterDescription": "Get the latest updates on business formation and compliance.",
      "backgroundColor": "#1f2937",
      "textColor": "#d1d5db",
      "linkColor": "#10b981",
      "isActive": true
    };

    const query = `
      UPDATE footer_config 
      SET sections = $1, updated_at = NOW()
      WHERE id = 1
    `;
    
    await pool.query(query, [JSON.stringify(footerConfigWithDescriptions.sections)]);
    
    console.log('✅ Footer descriptions updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating footer descriptions:', error);
  } finally {
    await pool.end();
  }
}

updateFooterWithDescriptions();