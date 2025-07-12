import { Link } from "wouter";

export default function Partnership() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8S11 7.1 11 6V4L5 7V9C5 10.1 5.9 11 7 11S9 10.1 9 9V15L11 17V22H13V17L15 15V9C15 10.1 15.9 11 17 11S19 10.1 19 9Z"/>
              <path d="M6 14C6.55 14 7 14.45 7 15V19C7 19.55 6.55 20 6 20S5 19.55 5 19V15C5 14.45 5.45 14 6 14ZM18 14C18.55 14 19 14.45 19 15V19C19 19.55 18.55 20 18 20S17 19.55 17 19V15C17 14.45 17.45 14 18 14Z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Partnership</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A business structure owned by two or more partners who share profits, losses, and responsibilities
          </p>
        </div>

        {/* Partnership Types */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Partnerships</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">General Partnership (GP)</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• All partners manage the business</li>
                <li>• Unlimited personal liability</li>
                <li>• Pass-through taxation</li>
                <li>• No state filing required</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">Limited Partnership (LP)</h3>
              <ul className="space-y-2 text-green-700">
                <li>• General + Limited partners</li>
                <li>• Limited liability for LPs</li>
                <li>• Must file with state</li>
                <li>• More complex structure</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-purple-900 mb-4">Limited Liability Partnership (LLP)</h3>
              <ul className="space-y-2 text-purple-700">
                <li>• Protection from partner actions</li>
                <li>• Professional service firms</li>
                <li>• State registration required</li>
                <li>• Annual reporting obligations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">General Partnership Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Professional service firms (law, accounting)
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Small businesses with multiple owners
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Joint ventures and collaborations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Real estate investments
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Features:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Shared ownership and management
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pass-through taxation
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Partnership agreement governs operations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Joint and several liability
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
                  <h3 className="font-semibold text-green-900 mb-1">Shared Resources</h3>
                  <p className="text-green-700">Pool capital, skills, and expertise from multiple partners</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Easy Formation</h3>
                  <p className="text-green-700">Simple to establish with partnership agreement</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Tax Benefits</h3>
                  <p className="text-green-700">Pass-through taxation avoids double taxation</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Shared Decision Making</h3>
                  <p className="text-green-700">Multiple perspectives on business decisions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Flexible Structure</h3>
                  <p className="text-green-700">Customizable partnership terms and profit sharing</p>
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
                  <h3 className="font-semibold text-red-900 mb-1">Unlimited Liability</h3>
                  <p className="text-red-700">Personal liability for all partnership debts and obligations</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Joint Liability</h3>
                  <p className="text-red-700">Liable for actions of other partners</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Potential Conflicts</h3>
                  <p className="text-red-700">Disagreements between partners can disrupt business</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Limited Life</h3>
                  <p className="text-red-700">Partnership may dissolve if partner leaves or dies</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Self-Employment Tax</h3>
                  <p className="text-red-700">All partners pay self-employment tax on their share</p>
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
                    <h4 className="font-semibold text-gray-900">Partnership Agreement</h4>
                    <p className="text-gray-600">Draft comprehensive agreement outlining terms</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Name Registration</h4>
                    <p className="text-gray-600">Register DBA if using name other than partners' names</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">EIN Application</h4>
                    <p className="text-gray-600">Obtain Employer Identification Number from IRS</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Business Licenses</h4>
                    <p className="text-gray-600">Obtain necessary licenses and permits</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Partnership Agreement Must Include</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-yellow-600 font-bold text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Capital Contributions</h4>
                    <p className="text-gray-600">Each partner's initial investment</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-yellow-600 font-bold text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Profit/Loss Distribution</h4>
                    <p className="text-gray-600">How profits and losses are shared</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-yellow-600 font-bold text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Management Structure</h4>
                    <p className="text-gray-600">Decision-making authority and responsibilities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-yellow-600 font-bold text-sm">•</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Exit Provisions</h4>
                    <p className="text-gray-600">Process for partner withdrawal or death</p>
                  </div>
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
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Partnership Tax Return</h3>
              <p className="text-blue-800 mb-3">File Form 1065 annually with the IRS</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Informational return only</li>
                <li>• No tax paid at partnership level</li>
                <li>• Must provide K-1s to partners</li>
                <li>• Due March 15th</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Partner Tax Obligations</h3>
              <p className="text-blue-800 mb-3">Partners report income on personal returns</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Receive Schedule K-1 from partnership</li>
                <li>• Pay tax on distributive share</li>
                <li>• Self-employment tax applies</li>
                <li>• Quarterly estimated payments</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Business Deductions</h3>
              <p className="text-blue-800 mb-3">Partnership can deduct business expenses</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Operating expenses</li>
                <li>• Business equipment</li>
                <li>• Professional services</li>
                <li>• Interest on business loans</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Form Your Partnership?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Get professional guidance to create the right partnership structure for your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formation-workflow">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Start Business Formation
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