import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LLCCorporationKit() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    // Redirect to dynamic checkout for LLC/Corporation Kit service
    window.location.href = "/dynamic-checkout/18"; // Will create service ID 18 for this
  };

  const kitIncludes = [
    {
      title: "Corporate Seal & Certificate",
      description: "Official corporate seal with embossing capability and stock certificates",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
        </svg>
      )
    },
    {
      title: "Bylaws & Operating Agreement",
      description: "Customized governing documents tailored to your business structure",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Meeting Minutes Templates",
      description: "Pre-formatted templates for board meetings and member resolutions",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      title: "Stock Ledger & Transfer Books",
      description: "Professional record-keeping books for share ownership tracking",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Professional Binder",
      description: "High-quality leather binder to organize all your corporate documents",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      title: "Compliance Calendar",
      description: "Annual filing deadlines and important compliance dates for your entity",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  const benefits = [
    "Maintain Professional Corporate Image",
    "Ensure Compliance with State Requirements", 
    "Protect Limited Liability Status",
    "Organize Important Business Documents",
    "Ready for Banking and Legal Transactions",
    "Lifetime Access to Digital Templates"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              LLC/Corporation Kit
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Professional corporate records kit with everything you need to maintain proper 
              business documentation and compliance for your LLC or Corporation.
            </p>
            <div className="bg-white/20 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-3xl font-bold mb-2">$99</div>
              <div className="text-lg">One-time purchase</div>
              <div className="text-sm opacity-90 mt-2">Includes everything shown below</div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Corporate Kit Includes
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to maintain professional corporate records and ensure 
              compliance with your state's requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kitIncludes.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 rounded-lg p-2 mr-4">
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Our Corporate Kit?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Proper corporate record-keeping is essential for maintaining your business's 
                legal protections and professional standing. Our comprehensive kit provides 
                everything you need in one professional package.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Professional Corporate Kit
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-4">$99</div>
                <p className="text-gray-600 mb-6">
                  One-time purchase includes physical kit shipped to your address 
                  plus digital templates for immediate use.
                </p>
                <button
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Get Your Corporate Kit"}
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Ships within 3-5 business days • Digital templates available immediately
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do I need a corporate kit for my LLC or Corporation?
              </h3>
              <p className="text-gray-600">
                While not legally required in all states, maintaining proper corporate records 
                is essential for preserving your limited liability protection and demonstrating 
                that your business operates as a separate legal entity.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What's the difference between LLC and Corporation kits?
              </h3>
              <p className="text-gray-600">
                Our kit is customized based on your entity type. LLCs receive operating agreements 
                and member certificates, while Corporations receive bylaws and stock certificates. 
                The core organizational documents are tailored to your specific business structure.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How quickly will I receive my corporate kit?
              </h3>
              <p className="text-gray-600">
                Physical kits ship within 3-5 business days via standard shipping. Digital templates 
                are available for immediate download after purchase, so you can start organizing 
                your corporate records right away.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I customize the documents for my specific business?
              </h3>
              <p className="text-gray-600">
                Yes! All documents come with customizable templates that can be tailored to your 
                business's specific needs. We also include guidance on how to properly complete 
                and maintain these important corporate records.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}