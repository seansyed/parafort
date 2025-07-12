const { Client } = require('pg');

// Simple footer configuration
const footerData = {
  id: 1,
  isActive: true,
  companyName: "ParaFort",
  companyDescription: "Your trusted partner for business formation and compliance solutions.",
  logoUrl: "/parafort-main-logo.svg",
  sections: [
    {
      title: "Services",
      links: [
        { text: "LLC Formation", url: "/services/llc-formation" },
        { text: "Corporation Formation", url: "/services/corporation-formation" },
        { text: "Registered Agent", url: "/services/registered-agent" },
        { text: "EIN Services", url: "/services/ein" }
      ]
    },
    {
      title: "Support",
      links: [
        { text: "Help Center", url: "/support" },
        { text: "Contact Us", url: "/contact" },
        { text: "Live Chat", url: "#" }
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About Us", url: "/about" },
        { text: "Privacy Policy", url: "/privacy" },
        { text: "Terms of Service", url: "/terms" }
      ]
    }
  ],
  socialLinks: {
    facebook: "https://facebook.com/parafort",
    twitter: "https://twitter.com/parafort",
    linkedin: "https://linkedin.com/company/parafort",
    instagram: "https://instagram.com/parafort"
  },
  contactInfo: {
    phone: "844-494-5411",
    email: "support@parafort.com",
    address: "123 Business Ave, Suite 100, Business City, BC 12345"
  },
  disclaimer: "ParaFort is not a law firm and does not provide legal advice. We provide self-help services at your specific direction.",
  copyrightText: "© 2024 ParaFort. All rights reserved."
};

async function createFooterConfig() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://username:CHANGE_PASSWORD@localhost:5432/parafort_db'
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check if footer config already exists
    const existingConfig = await client.query('SELECT * FROM "footerConfig" WHERE "isActive" = true LIMIT 1');
    
    if (existingConfig.rows.length > 0) {
      // Update existing config
      await client.query(
        'UPDATE "footerConfig" SET "companyName" = $1, "companyDescription" = $2, "logoUrl" = $3, "sections" = $4, "socialLinks" = $5, "contactInfo" = $6, "disclaimer" = $7, "copyrightText" = $8, "updatedAt" = NOW() WHERE "isActive" = true',
        [
          footerData.companyName,
          footerData.companyDescription,
          footerData.logoUrl,
          JSON.stringify(footerData.sections),
          JSON.stringify(footerData.socialLinks),
          JSON.stringify(footerData.contactInfo),
          footerData.disclaimer,
          footerData.copyrightText
        ]
      );
      console.log('Footer configuration updated successfully!');
    } else {
      // Insert new config
      await client.query(
        'INSERT INTO "footerConfig" ("isActive", "companyName", "companyDescription", "logoUrl", "sections", "socialLinks", "contactInfo", "disclaimer", "copyrightText", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())',
        [
          footerData.isActive,
          footerData.companyName,
          footerData.companyDescription,
          footerData.logoUrl,
          JSON.stringify(footerData.sections),
          JSON.stringify(footerData.socialLinks),
          JSON.stringify(footerData.contactInfo),
          footerData.disclaimer,
          footerData.copyrightText
        ]
      );
      console.log('Footer configuration created successfully!');
    }

  } catch (error) {
    console.error('Error creating footer configuration:', error);
  } finally {
    await client.end();
  }
}

createFooterConfig();