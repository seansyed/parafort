import { db } from './server/db.ts';
import { footerConfig } from './shared/schema.ts';
import { eq } from 'drizzle-orm';

async function createFooterConfig() {
  try {
    console.log('Creating footer configuration...');
    
    const footerData = {
      id: 1,
      companyName: "ParaFort LLC",
      companyDescription: "Professional business formation and compliance management platform",
      phone: "(844) 444-5411",
      email: "info@parafort.com",
      address: "123 Business Ave, Suite 100, Business City, BC 12345",
      socialLinks: {
        "twitter": "https://twitter.com/parafort",
        "youtube": "https://youtube.com/@parafort",
        "facebook": "https://facebook.com/parafort",
        "linkedin": "https://linkedin.com/company/parafort",
        "instagram": "https://instagram.com/parafort"
      },
      sections: [
        {
          "title": "Entity Types",
          "links": [
            {
              "title": "Sole Proprietorship",
              "url": "/entity-types/sole-proprietorship",
              "description": "Simplest business structure for individuals"
            },
            {
              "title": "Partnership",
              "url": "/entity-types/partnership",
              "description": "Business owned by two or more people"
            },
            {
              "title": "LLC",
              "url": "/entity-types/llc",
              "description": "Flexible structure with liability protection"
            },
            {
              "title": "C Corporation",
              "url": "/entity-types/c-corporation",
              "description": "Traditional corporation structure"
            },
            {
              "title": "S Corporation",
              "url": "/entity-types/s-corporation",
              "description": "Pass-through taxation with corporate benefits"
            }
          ]
        },
        {
          "title": "Services & Compliance",
          "links": [
            {
              "title": "Business Formation",
              "url": "/services/business-formation",
              "description": "Start your business professionally"
            },
            {
              "title": "BOIR Filing",
              "url": "/services/boir-filing",
              "description": "Beneficial Ownership Information Report"
            },
            {
              "title": "Annual Report Filing",
              "url": "/services/annual-report-filing",
              "description": "Maintain compliance and annual filings"
            },
            {
              "title": "EIN Application",
              "url": "/services/ein-application",
              "description": "Federal tax ID for your business"
            },
            {
              "title": "S Corporation Election",
              "url": "/services/s-corporation-election",
              "description": "Elect S-Corp tax status"
            }
          ]
        },
        {
          "title": "Accounting & Tax",
          "links": [
            {
              "title": "Accounting & Bookkeeping",
              "url": "/services/accounting-bookkeeping",
              "description": "Professional bookkeeping and accounting"
            },
            {
              "title": "Business Payroll Services",
              "url": "/services/payroll-services",
              "description": "Complete payroll management solution"
            },
            {
              "title": "Business Tax Filing",
              "url": "/services/business-tax-filing",
              "description": "Professional business tax preparation"
            }
          ]
        },
        {
          "title": "Tools & Resources",
          "links": [
            {
              "title": "Entity Comparison Tool",
              "url": "/tools/entity-comparison",
              "description": "Compare business entity types"
            },
            {
              "title": "Business Name Generator",
              "url": "/tools/business-name-generator",
              "description": "AI-powered business name suggestions"
            },
            {
              "title": "Annual Report Due Dates",
              "url": "/tools/annual-report-due-dates",
              "description": "State filing deadlines and requirements"
            },
            {
              "title": "Business Learning Center",
              "url": "/learning-center",
              "description": "Comprehensive business education courses",
              "badge": "New"
            }
          ]
        },
        {
          "title": "Support",
          "links": [
            {
              "title": "ParaFort Help Center",
              "url": "/help",
              "description": "Comprehensive help and documentation"
            },
            {
              "title": "Contact ParaFort",
              "url": "/contact-us",
              "description": "Get in touch with our support team"
            },
            {
              "title": "About ParaFort",
              "url": "/about-us",
              "description": "Learn about our company and mission"
            },
            {
              "title": "Frequently Asked Questions",
              "url": "/faq",
              "description": "Common questions and answers"
            }
          ],
          "dashboardButton": {
            "title": "Login to Dashboard",
            "url": "/api/login",
            "description": "Access your client dashboard"
          }
        }
      ],
      copyrightText: "© 2024 ParaFort LLC. All rights reserved.",
      legalLinks: [
        {
          "text": "Privacy Policy",
          "url": "/privacy-policy"
        },
        {
          "text": "Terms of Service",
          "url": "/terms-of-service"
        },
        {
          "text": "Cookie Policy",
          "url": "/cookie-policy"
        }
      ],
      showNewsletter: true,
      newsletterTitle: "Stay Updated",
      newsletterDescription: "Get the latest updates on business formation and compliance.",
      showSocialMedia: true,
      backgroundColor: "#1f2937",
      textColor: "#d1d5db",
      linkColor: "#10b981",
      isActive: true
    };

    // Check if footer config already exists
    const existing = await db.select().from(footerConfig).where(eq(footerConfig.id, 1)).limit(1);
    
    if (existing.length > 0) {
      // Update existing
      await db.update(footerConfig)
        .set(footerData)
        .where(eq(footerConfig.id, 1));
      console.log('Footer configuration updated successfully!');
    } else {
      // Insert new
      await db.insert(footerConfig).values(footerData);
      console.log('Footer configuration created successfully!');
    }
    
  } catch (error) {
    console.error('Error creating footer config:', error);
  }
}

createFooterConfig();