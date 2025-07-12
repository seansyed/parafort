import { Link } from "wouter";

export default function LLC() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V14.5C14.8,16.9 13.4,18.5 12,18.5C10.6,18.5 9.2,16.9 9.2,14.5V10C9.2,8.6 10.6,7 12,7Z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Limited Liability Company (LLC)</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The most popular business structure combining liability protection with operational flexibility
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Why LLCs Are Popular</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Small to medium-sized businesses
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Real estate investments
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Professional services
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  E-commerce businesses
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Startups seeking flexibility
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Limited liability protection
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pass-through taxation (default)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Flexible management structure
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Professional credibility
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tax election options
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* LLC Types */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of LLCs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Single-Member LLC</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• One owner (member)</li>
                <li>• Disregarded entity for taxes</li>
                <li>• Simple management</li>
                <li>• Easy conversion to multi-member</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Multi-Member LLC</h3>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• Two or more owners</li>
                <li>• Partnership taxation</li>
                <li>• Operating agreement required</li>
                <li>• Shared management decisions</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Series LLC</h3>
              <ul className="space-y-1 text-purple-700 text-sm">
                <li>• Multiple protected series</li>
                <li>• Asset protection benefits</li>
                <li>• Available in select states</li>
                <li>• Complex structure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Advantages */}
          <div className="bg-green-50 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-green-900 mb-6">Advantages</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Limited Liability Protection</h3>
                  <p className="text-green-700">Personal assets protected from business debts and lawsuits</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Tax Flexibility</h3>
                  <p className="text-green-700">Choose pass-through or corporate taxation</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Management Flexibility</h3>
                  <p className="text-green-700">No required board of directors or formal meetings</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Credibility</h3>
                  <p className="text-green-700">Professional image enhances business relationships</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Ownership Flexibility</h3>
                  <p className="text-green-700">No restrictions on number or type of members</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Perpetual Existence</h3>
                  <p className="text-green-700">Business continues even if member leaves</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disadvantages */}
          <div className="bg-red-50 rounded-3xl p-8">
            <h2 className="text-3xl font-bold text-red-900 mb-6">Disadvantages</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Self-Employment Tax</h3>
                  <p className="text-red-700">Members pay SE tax on their share of income</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Limited Life in Some States</h3>
                  <p className="text-red-700">May dissolve upon member death or departure</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Ongoing Compliance</h3>
                  <p className="text-red-700">Annual reports and fees required in most states</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Varied State Laws</h3>
                  <p className="text-red-700">LLC laws differ significantly between states</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Transfer Restrictions</h3>
                  <p className="text-red-700">Membership interests harder to transfer than stock</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formation Requirements */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Formation Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose State & Name</h4>
                    <p className="text-gray-600">Select formation state and available LLC name</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">File Articles of Organization</h4>
                    <p className="text-gray-600">Submit formation documents to state</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Designate Registered Agent</h4>
                    <p className="text-gray-600">Appoint agent to receive legal documents</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Operating Agreement</h4>
                    <p className="text-gray-600">Define member rights and company operations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Obtain EIN</h4>
                    <p className="text-gray-600">Get tax identification number from IRS</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Typical Costs</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">State Filing Fees</h4>
                  <p className="text-gray-600 text-sm">Range: $50 - $500 depending on state</p>
                  <p className="text-gray-600 text-sm">Most common: $100 - $200</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Registered Agent</h4>
                  <p className="text-gray-600 text-sm">Annual fee: $100 - $300</p>
                  <p className="text-gray-600 text-sm">Can serve as your own agent for free</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Operating Agreement</h4>
                  <p className="text-gray-600 text-sm">Attorney fees: $500 - $2,500</p>
                  <p className="text-gray-600 text-sm">Templates available for simple LLCs</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Annual Reports</h4>
                  <p className="text-gray-600 text-sm">Annual fee: $10 - $800</p>
                  <p className="text-gray-600 text-sm">Varies significantly by state</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-blue-50 rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Tax Information</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Default: Pass-Through</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• No entity-level tax</li>
                <li>• Income flows to members</li>
                <li>• Self-employment tax applies</li>
                <li>• Form 1065 if multi-member</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">S-Corp Election</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Potential SE tax savings</li>
                <li>• Reasonable salary required</li>
                <li>• File Form 2553</li>
                <li>• Ownership restrictions</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">C-Corp Election</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Double taxation</li>
                <li>• Retain earnings at lower rates</li>
                <li>• More deduction opportunities</li>
                <li>• Form 8832 election</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">State Taxes</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Franchise taxes in some states</li>
                <li>• Gross receipts taxes</li>
                <li>• Annual LLC fees</li>
                <li>• Multi-state considerations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Form Your LLC?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Start your LLC formation with professional guidance and state-specific expertise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formation-workflow">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Start LLC Formation
              </button>
            </Link>
            <Link href="/entity-comparison">
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Compare Entity Types
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}