import { Link } from "wouter";

export default function CCorporation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">C Corporation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The traditional corporate structure offering maximum growth potential and investor appeal
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">C Corporation Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Businesses seeking investment capital
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Companies planning to go public
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  High-growth startups
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Businesses with employee stock plans
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  International businesses
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Separate legal entity
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Limited liability protection
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Unlimited growth potential
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Transferable ownership
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Perpetual existence
                </li>
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
                  <h3 className="font-semibold text-green-900 mb-1">Limited Liability</h3>
                  <p className="text-green-700">Shareholders protected from business debts and liabilities</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Access to Capital</h3>
                  <p className="text-green-700">Can raise funds through stock sales and attract investors</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Perpetual Existence</h3>
                  <p className="text-green-700">Corporation continues regardless of ownership changes</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Tax Deductions</h3>
                  <p className="text-green-700">Many business expenses are tax-deductible</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Employee Benefits</h3>
                  <p className="text-green-700">Tax-advantaged employee benefit programs</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Credibility</h3>
                  <p className="text-green-700">Enhanced business credibility with customers and vendors</p>
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
                  <h3 className="font-semibold text-red-900 mb-1">Double Taxation</h3>
                  <p className="text-red-700">Corporate profits and dividends both taxed</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Complex Compliance</h3>
                  <p className="text-red-700">Extensive record-keeping and reporting requirements</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Higher Costs</h3>
                  <p className="text-red-700">Formation and ongoing compliance costs</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Formal Structure</h3>
                  <p className="text-red-700">Required board meetings, resolutions, and corporate formalities</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Loss of Control</h3>
                  <p className="text-red-700">Shareholders may influence management decisions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Structure */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Corporate Structure</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,4C16.88,4 17.67,4.84 17.67,5.84C17.67,6.84 16.88,7.68 16,7.68C15.12,7.68 14.33,6.84 14.33,5.84C14.33,4.84 15.12,4 16,4M8,4C8.88,4 9.67,4.84 9.67,5.84C9.67,6.84 8.88,7.68 8,7.68C7.12,7.68 6.33,6.84 6.33,5.84C6.33,4.84 7.12,4 8,4M8,13.64C8.88,13.64 9.67,14.47 9.67,15.47C9.67,16.47 8.88,17.31 8,17.31C7.12,17.31 6.33,16.47 6.33,15.47C6.33,14.47 7.12,13.64 8,13.64M16,13.64C16.88,13.64 17.67,14.47 17.67,15.47C17.67,16.47 16.88,17.31 16,17.31C15.12,17.31 14.33,16.47 14.33,15.47C14.33,14.47 15.12,13.64 16,13.64M12,9.84C12.88,9.84 13.67,10.68 13.67,11.68C13.67,12.68 12.88,13.52 12,13.52C11.12,13.52 10.33,12.68 10.33,11.68C10.33,10.68 11.12,9.84 12,9.84Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Shareholders</h3>
              <p className="text-gray-600">Own the corporation through stock ownership. Elect board of directors and vote on major decisions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Board of Directors</h3>
              <p className="text-gray-600">Provides strategic oversight, hires officers, and makes major corporate decisions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Officers</h3>
              <p className="text-gray-600">Manage day-to-day operations. Typically includes CEO, CFO, and Secretary.</p>
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
                    <p className="text-gray-600">Select incorporation state and reserve corporate name</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">File Articles of Incorporation</h4>
                    <p className="text-gray-600">Submit incorporation documents to state</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Appoint Directors</h4>
                    <p className="text-gray-600">Name initial board of directors</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Bylaws</h4>
                    <p className="text-gray-600">Establish internal operating rules</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Issue Stock</h4>
                    <p className="text-gray-600">Issue shares to initial shareholders</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ongoing Requirements</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Annual Meetings</h4>
                  <p className="text-gray-600 text-sm">Board and shareholder meetings required</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Corporate Records</h4>
                  <p className="text-gray-600 text-sm">Maintain meeting minutes and resolutions</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Annual Reports</h4>
                  <p className="text-gray-600 text-sm">File state annual reports and pay fees</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Tax Returns</h4>
                  <p className="text-gray-600 text-sm">File Form 1120 corporate tax return</p>
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
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Corporate Tax</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Flat 21% federal rate</li>
                <li>• File Form 1120</li>
                <li>• Due April 15th</li>
                <li>• Quarterly estimated payments</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Dividend Tax</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Double taxation applies</li>
                <li>• Qualified dividend rates</li>
                <li>• 0%, 15%, or 20% rates</li>
                <li>• No deduction for corporation</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Payroll Tax</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Employee wages deductible</li>
                <li>• FICA taxes apply</li>
                <li>• Unemployment taxes</li>
                <li>• Payroll tax deposits</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">State Taxes</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Corporate income tax</li>
                <li>• Franchise taxes</li>
                <li>• Sales tax obligations</li>
                <li>• Property taxes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Incorporate Your C Corporation?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Start your C Corporation formation with professional guidance and compliance support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formation-workflow">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Start Corporation Formation
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