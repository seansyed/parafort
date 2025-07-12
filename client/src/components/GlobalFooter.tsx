import { useQuery } from '@tanstack/react-query';
import { FooterConfig } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth';
import logoWhite from '/parafort-logo-white.png';

interface FooterSection {
  title: string;
  links?: Array<{
    title: string;
    url: string;
    badge?: string;
    description?: string;
    external?: boolean;
  }>;
  subSections?: Array<{
    title: string;
    links: Array<{
      title: string;
      url: string;
      badge?: string;
      description?: string;
      external?: boolean;
    }>;
  }>;
  dashboardButton?: {
    title: string;
    url: string;
    description: string;
  };
  disclaimer?: string;
}

interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

interface LegalLink {
  text: string;
  url: string;
}

export default function GlobalFooter() {
  const { isAuthenticated } = useAuth();

  const { data: footerConfig, isLoading, error } = useQuery<FooterConfig>({
    queryKey: ['/api/footer/config'],
    staleTime: 0,
    retry: 3,
  });



  // Fallback footer configuration matching the expected structure
  const fallbackConfig: FooterConfig = {
    id: 1,
    isActive: true,
    companyName: "ParaFort",
    companyDescription: "Professional business formation and compliance management platform",
    logoUrl: "/parafort-main-logo.svg",
    phone: "(844) 444-5411",
    email: "info@parafort.com",
    address: "123 Business Ave, Suite 100, Business City, BC 12345",
    sections: [
      {
        title: "Entity Types",
        links: [
          { title: "Sole Proprietorship", url: "/entity-types/sole-proprietorship", description: "Simplest business structure for individuals" },
          { title: "Partnership", url: "/entity-types/partnership", description: "Business owned by two or more people" },
          { title: "LLC", url: "/entity-types/llc", description: "Limited liability with flexible management" },
          { title: "C Corporation", url: "/entity-types/c-corporation", description: "Traditional corporate structure" },
          { title: "S Corporation", url: "/entity-types/s-corporation", description: "Tax-advantaged corporation option" },
          { title: "Professional Corporation", url: "/entity-types/professional-corporation", description: "For licensed professionals" },
          { title: "PLLC", url: "/entity-types/pllc", description: "Professional Limited Liability Company" },
          { title: "Nonprofit Corporation", url: "/entity-types/nonprofit", description: "Tax-exempt organization structure" },
          { title: "Cooperative", url: "/entity-types/cooperative", description: "Member-owned business organization" }
        ]
      },
      {
        title: "Services & Compliance",
        links: [
          { title: "Business Formation", url: "/business-formation-service", description: "Start your LLC or Corporation professionally" },
          { title: "BOIR Filing", url: "/boir-filing", description: "Beneficial Ownership Information Report" },
          { title: "Annual Report Filing", url: "/annual-report-service", description: "State compliance and annual filings" },
          { title: "EIN Application", url: "/ein-service", description: "Federal Tax ID number service" },
          { title: "S-Corporation Election", url: "/s-corporation-election", description: "IRS Form 2553 tax election" },
          { title: "Legal Name Change", url: "/business-legal-name-change", description: "Official business name amendments" },
          { title: "Business Dissolution", url: "/business-dissolution-service", description: "Formally close your business entity" },
          { title: "Business License Services", url: "/business-license-services", description: "Professional licensing assistance" },
          { title: "Fictitious Business Name", url: "/fictitious-business-services", description: "DBA and trade name registration" },
          { title: "Registered Agent Services", url: "/registered-agent-services", description: "Professional registered agent service" },
          { title: "Digital Mailbox Services", url: "/digital-mailbox-services", description: "Virtual business address solution" },
          { title: "Business Management", url: "/business-management", description: "Ongoing business support services" }
        ]
      },
      {
        title: "Accounting & Tax",
        subSections: [
          {
            title: "Accounting & Tax",
            links: [
              { title: "Accounting & Bookkeeping", url: "/accounting-bookkeeping-services", description: "Professional bookkeeping and accounting" },
              { title: "Business Payroll Services", url: "/business-payroll-services", description: "Complete payroll management solution" },
              { title: "Business Tax Filing", url: "/business-tax-filing-services", description: "Professional business tax preparation" },
              { title: "Tax Forms", url: "#", badge: "Coming Soon", description: "Business tax forms and resources" }
            ]
          },
          {
            title: "Tools & Resources",
            links: [
              { title: "Entity Comparison Tool", url: "/entity-comparison", description: "Compare business entity types" },
              { title: "Entity Requirements", url: "/entity-requirements", description: "State-specific formation requirements" },
              { title: "Business Name Generator", url: "/business-name-generator", description: "AI-powered business name suggestions" },
              { title: "Annual Report Due Dates", url: "/annual-report-due-dates", description: "State filing deadlines and requirements" },
              { title: "LLC/Corporation Kit", url: "/legal-documents-service", description: "Professional corporate records and document kit" },
              { title: "Business Learning Center", url: "/business-learning-center", badge: "New", description: "Comprehensive business education courses for Gold subscribers" }
            ]
          }
        ]
      },
      {
        title: "Support",
        links: [
          { title: "ParaFort Help Center", url: "/help", description: "Comprehensive help and documentation" },
          { title: "Contact ParaFort", url: "/contact", description: "Get in touch with our support team" },
          { title: "About ParaFort", url: "/about", description: "Learn about our company and mission" },
          { title: "Frequently Asked Questions", url: "/faq", description: "Common questions and answers" },
          { title: "Cookie Preferences", url: "/cookie-preferences", description: "Manage your cookie and privacy settings" },
          { title: "Cancellation Policy", url: "/cancellation-policy", description: "Information about cancellations and refunds" },
          { title: "Privacy Policy", url: "/privacy-policy", description: "Our privacy practices and data protection" }
        ],
        dashboardButton: {
          title: "Login to Dashboard",
          url: "/dashboard",
          description: "Access your client dashboard"
        }
      }
    ],
    socialLinks: {
      facebook: "https://facebook.com/parafort",
      twitter: "https://twitter.com/parafort",
      linkedin: "https://linkedin.com/company/parafort",
      instagram: "https://instagram.com/parafort",
      youtube: "https://youtube.com/@parafort"
    },
    legalLinks: [
      { text: "Privacy Policy", url: "https://parafort.com/privacy-policy" },
      { text: "Terms of Service", url: "https://parafort.com/terms-of-service" },
      { text: "Cookie Policy", url: "https://parafort.com/cookie-policy" },
      { text: "Disclaimer", url: "https://parafort.com/disclaimer" }
    ],
    showSocialMedia: true,
    showNewsletter: true,
    newsletterTitle: "Stay Updated",
    newsletterDescription: "Get the latest updates on business formation and compliance.",
    backgroundColor: "#1f2937",
    textColor: "#d1d5db",
    linkColor: "#10b981",
    disclaimer: "ParaFort is not a law firm and does not provide legal advice. Our services are designed to assist with business formation and compliance based on the information you provide.",
    copyrightText: "© 2025 ParaFort. All rights reserved.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Use fallback config if API fails or is loading
  const config = footerConfig || fallbackConfig;

  if (isLoading) {
    return (
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="space-y-3">
                <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const sections = (config?.sections as FooterSection[]) || [];
  const socialLinks = (config?.socialLinks as SocialLinks) || {};
  const legalLinks = (config?.legalLinks as LegalLink[]) || [];

  return (
    <footer 
      className="relative z-30"
      style={{ 
        backgroundColor: config.backgroundColor || '#1f2937',
        color: config.textColor || '#d1d5db'
      }}
    >
      <div className={`max-w-7xl mx-auto px-6 py-12 ${isAuthenticated ? 'ml-80' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Information with Support Section */}
          <div className="lg:col-span-1">
            <img 
              src={logoWhite} 
              alt="ParaFort - Business Services & Compliance" 
              className="h-24 w-auto mb-4"
            />
            <p className="text-sm mb-6 leading-relaxed">
              {config.companyDescription}
            </p>
            
            {/* Dynamic Support Section */}
            {(() => {
              const supportSection = sections.find(section => section.title === 'Support');
              if (!supportSection) return null;
              
              return (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {supportSection.title}
                  </h4>
                  <ul className="space-y-3">
                    {supportSection.links?.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <div className="flex flex-col">
                          <a
                            href={link.url}
                            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium mb-1"
                          >
                            {link.title}
                          </a>
                          {link.description && (
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {link.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Dashboard Button */}
                  {supportSection.dashboardButton && (
                    <div className="mt-6">
                      <a
                        href={isAuthenticated ? "/dashboard" : "/api/login"}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        {isAuthenticated ? "Go to Dashboard" : "Login to Dashboard"}
                      </a>
                      <p className="text-xs text-gray-400 mt-2">
                        {supportSection.dashboardButton.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Contact Information */}
            <div className="space-y-4">
              {config.phone && (
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400 mb-2">Call Us</div>
                  <div className="text-3xl font-bold text-white tracking-wide hover:scale-105 transition-transform duration-300 cursor-pointer" style={{
                    animation: 'pulse 3s ease-in-out infinite'
                  }}>
                    {config.phone}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Other Footer Sections (excluding Support) */}
          {sections.filter(section => section.title !== 'ParaFort Help Center' && section.title !== 'Support').map((section, index) => (
            <div key={index} className="lg:col-span-1">
              {/* Handle disclaimer sections */}
              {section.disclaimer ? (
                <>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {section.title}
                  </h4>
                  <div className="bg-gray-700 border-l-4 border-orange-500 p-4 rounded">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {section.disclaimer}
                    </p>
                  </div>
                </>
              ) : section.subSections ? (
                /* Handle sections with subsections */
                <div className="space-y-6">
                  {section.subSections.map((subSection, subIndex) => (
                    <div key={subIndex}>
                      <h4 className="text-lg font-semibold text-white mb-4">
                        {subSection.title}
                      </h4>
                      <ul className="space-y-3">
                        {subSection.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <div className="flex items-start gap-2">
                              <a
                                href={link.url}
                                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                style={{ color: config.linkColor || '#10b981' }}
                                className={`text-sm font-medium transition-colors duration-200 ${link.url === '#' ? 'cursor-default' : 'hover:underline'}`}
                              >
                                {link.title}
                              </a>
                              {link.badge && (
                                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                  {link.badge}
                                </span>
                              )}
                            </div>
                            {link.description && (
                              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                {link.description}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                      {/* Add divider line between subsections */}
                      {subIndex < (section.subSections?.length || 0) - 1 && (
                        <hr className="my-4 border-gray-600" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Handle regular sections */
                <>
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links?.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <div className="flex items-start gap-2">
                          <a
                            href={link.url}
                            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            style={{ color: config.linkColor || '#10b981' }}
                            className={`text-sm font-medium transition-colors duration-200 ${link.url === '#' ? 'cursor-default' : 'hover:underline'}`}
                          >
                            {link.title}
                          </a>
                          {link.badge && (
                            <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {link.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>

                </>
              )}
            </div>
          ))}


        </div>

        {/* Social Media Links */}
        {config.showSocialMedia && Object.keys(socialLinks).length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: config.linkColor || '#10b981' }}
                  className="hover:opacity-75 transition-opacity duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: config.linkColor || '#10b981' }}
                  className="hover:opacity-75 transition-opacity duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: config.linkColor || '#10b981' }}
                  className="hover:opacity-75 transition-opacity duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: config.linkColor || '#10b981' }}
                  className="hover:opacity-75 transition-opacity duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986s11.987-5.368 11.987-11.986C24.014 5.367 18.635.001 12.017.001zM8.449 16.988c-1.297 0-2.347-1.051-2.347-2.347s1.05-2.347 2.347-2.347 2.347 1.05 2.347 2.347-1.05 2.347-2.347 2.347zm7.119 0c-1.297 0-2.347-1.051-2.347-2.347s1.05-2.347 2.347-2.347 2.347 1.05 2.347 2.347-1.05 2.347-2.347 2.347z"/>
                  </svg>
                </a>
              )}
              {socialLinks.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: config.linkColor || '#10b981' }}
                  className="hover:opacity-75 transition-opacity duration-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
            
            {/* Disclaimer */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-3">Disclaimer</h5>
              <div className="bg-gray-700 border-l-4 border-orange-500 p-4 rounded">
                <p className="text-sm text-gray-300 leading-relaxed">
                  ParaFort is not a law firm and does not provide legal advice. Our services are designed to assist with business formation and compliance based on the information you provide.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Legal Links */}
        {legalLinks.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  style={{ color: config.linkColor || '#10b981' }}
                  className="text-sm hover:underline transition-colors duration-200"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          {config.disclaimer && (
            <p className="text-center text-sm text-gray-500 mb-4">
              {config.disclaimer}
            </p>
          )}
          <p className="text-center text-sm text-gray-500">
            {config.copyrightText || `© ${new Date().getFullYear()} ${config.companyName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}