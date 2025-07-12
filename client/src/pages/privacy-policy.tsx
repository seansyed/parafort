export default function PrivacyPolicy() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="mt-2 text-gray-600">
            Last updated: June 17, 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              ParaFort ("we," "our," or "us") is committed to protecting the privacy and security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              business formation and compliance management platform.
            </p>
            <p className="text-gray-700">
              By using our services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-4">We collect personal information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Name, email address, phone number, and business address</li>
              <li>Business information (entity name, type, state of incorporation)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Tax identification numbers (EIN) for business formation services</li>
              <li>Registered agent and officer information</li>
              <li>Document uploads and business filings</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.2 Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Device and browser information</li>
              <li>IP address and location data</li>
              <li>Usage patterns and interaction data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">2.3 Business Documents</h3>
            <p className="text-gray-700">
              We securely store business documents you upload, including articles of incorporation, 
              operating agreements, and compliance filings necessary for our services.
            </p>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use collected information for the following purposes:</p>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">3.1 Service Delivery</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Business entity formation and registration</li>
              <li>State and federal filing submissions</li>
              <li>Registered agent services</li>
              <li>Annual report and compliance tracking</li>
              <li>Document management and storage</li>
              <li>BOIR (Beneficial Ownership Information Report) filing</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.2 Platform Operations</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Account management and authentication</li>
              <li>Payment processing and billing</li>
              <li>Customer support and communication</li>
              <li>Platform improvements and feature development</li>
              <li>Security monitoring and fraud prevention</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">3.3 AI-Powered Features</h3>
            <p className="text-gray-700">
              We use Google Gemini AI to analyze business documents, provide insights, and enhance 
              our compliance recommendations. This processing occurs securely and in accordance 
              with our data protection standards.
            </p>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Government Agencies</h3>
            <p className="text-gray-700 mb-4">
              We share business formation information with appropriate state agencies and the IRS 
              as required for entity registration, EIN applications, and compliance filings.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Service Providers</h3>
            <p className="text-gray-700 mb-4">We work with trusted third-party providers for:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Payment processing (Stripe)</li>
              <li>Email services (Outlook SMTP)</li>
              <li>Document analysis (Google Gemini AI)</li>
              <li>Cloud hosting and database services</li>
              <li>Authentication services (Replit Auth)</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.3 Legal Requirements</h3>
            <p className="text-gray-700">
              We may disclose information when required by law, court order, or to protect our 
              rights and the safety of our users.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement comprehensive security measures to protect your information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Encryption in transit and at rest</li>
              <li>Secure database connections with connection pooling</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication protocols</li>
              <li>Secure file upload and document storage</li>
              <li>PCI DSS compliant payment processing</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Provide ongoing services and support</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Maintain business records for tax and audit purposes</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="text-gray-700">
              Business formation documents may be retained indefinitely as they constitute 
              official corporate records.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Access:</strong> Request copies of your personal information</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of personal information (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p className="text-gray-700">
              To exercise these rights, please contact us at{' '}
              <a href="mailto:privacy@parafort.com" className="text-blue-600 hover:text-blue-700">
                privacy@parafort.com
              </a>
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns and improve our services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-gray-700">
              You can manage cookie preferences through your browser settings or our{' '}
              <a href="/cookie-preferences" className="text-blue-600 hover:text-blue-700">
                Cookie Preferences
              </a>{' '}
              page.
            </p>
          </section>

          {/* International Users */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. International Users</h2>
            <p className="text-gray-700 mb-4">
              Our services are primarily designed for U.S. business formation. If you access our 
              platform from outside the United States, please note that your information may be 
              transferred to and processed in the United States, where our servers are located.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              Our services are not intended for individuals under 18 years of age. We do not 
              knowingly collect personal information from children under 18. If we become aware 
              that we have collected such information, we will take steps to delete it promptly.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically to reflect changes in our practices 
              or legal requirements. We will notify you of material changes by:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li>Posting the updated policy on our website</li>
              <li>Sending email notifications to registered users</li>
              <li>Displaying prominent notices on our platform</li>
            </ul>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:privacy@parafort.com" className="text-blue-600 hover:text-blue-700">
                  privacy@parafort.com
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Phone:</strong>{' '}
                <a href="tel:844-444-5411" className="text-blue-600 hover:text-blue-700">
                  (844) 444-5411
                </a>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Business Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM PST
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong><br />
                ParaFort LLC<br />
                Privacy Officer<br />
                123 Business Ave, Suite 100<br />
                Business City, BC 12345
              </p>
            </div>
          </section>

        </div>
      </div>

      {/* Contact Info */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="h-8 w-8 mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Sales & Support</h3>
              <p className="text-gray-300">844-444-5411</p>
            </div>
            <div className="text-white">
              <div className="h-8 w-8 mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Business Hours</h3>
              <p className="text-gray-300">Monday - Friday: 8am to 5pm PST</p>
            </div>
            <div className="text-white">
              <div className="h-8 w-8 mx-auto mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Sales Chat</h3>
              <p className="text-gray-300">Live chat available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}