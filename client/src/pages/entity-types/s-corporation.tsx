import { Link } from "wouter";

export default function SCorporation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19M16.5,16.25C16.5,16.81 16.06,17.25 15.5,17.25H14.5C13.94,17.25 13.5,16.81 13.5,16.25V15.75H11.5V16.25C11.5,16.81 11.06,17.25 10.5,17.25H9.5C8.94,17.25 8.5,16.81 8.5,16.25V15.75H7.5C6.94,15.75 6.5,15.31 6.5,14.75V13.5C6.5,12.94 6.94,12.5 7.5,12.5H8.5V10.75C8.5,10.19 8.94,9.75 9.5,9.75H10.5C11.06,9.75 11.5,10.19 11.5,10.75V12.5H13.5V10.75C13.5,10.19 13.94,9.75 14.5,9.75H15.5C16.06,9.75 16.5,10.19 16.5,10.75V16.25Z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">S Corporation (S Corp)</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combine corporate benefits with pass-through taxation to minimize self-employment taxes
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">S Corporation Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Profitable service businesses
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Owner-operators with significant income
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Businesses wanting tax savings
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Companies with 1-100 shareholders
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Domestic-only operations
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pass-through taxation
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Self-employment tax savings
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Limited liability protection
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Corporate structure benefits
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Easy conversion from C Corp
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tax Savings Explanation */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">How S Corps Save on Taxes</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-red-900 mb-4">Without S Corp Election</h3>
              <div className="space-y-3">
                <p className="text-gray-700">Business income: <span className="font-semibold">$100,000</span></p>
                <p className="text-gray-700">Self-employment tax (15.3%): <span className="font-semibold text-red-600">$15,300</span></p>
                <p className="text-gray-700">Income tax (22%): <span className="font-semibold">$22,000</span></p>
                <div className="border-t pt-2">
                  <p className="text-gray-900 font-bold">Total tax: <span className="text-red-600">$37,300</span></p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">With S Corp Election</h3>
              <div className="space-y-3">
                <p className="text-gray-700">Reasonable salary: <span className="font-semibold">$50,000</span></p>
                <p className="text-gray-700">SE tax on salary (15.3%): <span className="font-semibold">$7,650</span></p>
                <p className="text-gray-700">Distribution: <span className="font-semibold">$50,000</span></p>
                <p className="text-gray-700">Income tax (22%): <span className="font-semibold">$22,000</span></p>
                <div className="border-t pt-2">
                  <p className="text-gray-900 font-bold">Total tax: <span className="text-green-600">$29,650</span></p>
                  <p className="text-green-600 font-semibold">Savings: $7,650</p>
                </div>
              </div>
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
                  <h3 className="font-semibold text-green-900 mb-1">Tax Savings</h3>
                  <p className="text-green-700">Potentially significant self-employment tax savings</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Pass-Through Taxation</h3>
                  <p className="text-green-700">No double taxation like C corporations</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Limited Liability</h3>
                  <p className="text-green-700">Personal asset protection from business liabilities</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Business Credibility</h3>
                  <p className="text-green-700">Corporate structure enhances professional image</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">QBI Deduction</h3>
                  <p className="text-green-700">May qualify for 20% qualified business income deduction</p>
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
                  <h3 className="font-semibold text-red-900 mb-1">Reasonable Salary Requirement</h3>
                  <p className="text-red-700">Must pay reasonable salary subject to payroll taxes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Ownership Restrictions</h3>
                  <p className="text-red-700">Limited to 100 shareholders, one class of stock</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">IRS Scrutiny</h3>
                  <p className="text-red-700">Higher chance of audit due to salary/distribution split</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Calendar Year Requirement</h3>
                  <p className="text-red-700">Generally must use calendar tax year</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Corporate Formalities</h3>
                  <p className="text-red-700">Must maintain corporate meetings and records</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Eligibility Requirements */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">S Corp Eligibility Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Shareholder Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Maximum 100 shareholders</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Must be US citizens or residents</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">No corporate or partnership shareholders</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Certain trusts allowed as shareholders</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Corporate Requirements</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Domestic corporation only</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">One class of stock only</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">No nonresident alien shareholders</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Not an ineligible corporation</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formation & Election Process */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Formation & Election Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Formation Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Form Corporation</h4>
                    <p className="text-gray-600">Incorporate as regular C corporation first</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">File Form 2553</h4>
                    <p className="text-gray-600">Submit S corporation election to IRS</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Obtain Consent</h4>
                    <p className="text-gray-600">All shareholders must consent to election</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Set Up Payroll</h4>
                    <p className="text-gray-600">Establish payroll for shareholder-employees</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Important Deadlines</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">New Corporation</h4>
                  <p className="text-gray-600 text-sm">File Form 2553 within 2 months and 15 days of incorporation</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Existing Corporation</h4>
                  <p className="text-gray-600 text-sm">File by March 15th for current tax year election</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Late Election Relief</h4>
                  <p className="text-gray-600 text-sm">Available in certain circumstances with reasonable cause</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-blue-50 rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Tax Information</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Corporate Return</h3>
              <p className="text-blue-800 mb-3">File Form 1120S annually</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Due March 15th</li>
                <li>• Automatic 6-month extension available</li>
                <li>• Pass-through entity</li>
                <li>• Provide K-1s to shareholders</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Shareholder Taxes</h3>
              <p className="text-blue-800 mb-3">Report income on personal returns</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Receive Schedule K-1</li>
                <li>• Pay tax on pro-rata share</li>
                <li>• No self-employment tax on distributions</li>
                <li>• Quarterly estimated payments</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Payroll Taxes</h3>
              <p className="text-blue-800 mb-3">Required on reasonable salary</p>
              <ul className="space-y-1 text-blue-700">
                <li>• FICA taxes on wages</li>
                <li>• Federal and state withholding</li>
                <li>• Unemployment taxes</li>
                <li>• Quarterly 941 filings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Form Your S Corporation?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Start saving on self-employment taxes with professional S Corp formation and election
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formation-workflow">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Start S Corp Formation
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