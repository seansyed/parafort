import { Link } from "wouter";

export default function Cooperative() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,4V6C15,7.1 14.1,8 13,8S11,7.1 11,6V4L5,7V9C5,10.1 5.9,11 7,11S9,10.1 9,9V15L11,17V22H13V17L15,15V9C15,10.1 15.9,11 17,11S19,10.1 19,9M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Cooperative Corporation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Member-owned business structure operating for mutual benefit and democratic control
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Cooperative Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Agricultural producers and farmers
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Consumer purchasing groups
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Worker-owned businesses
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Credit unions and financial services
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Housing cooperatives
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Principles:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Democratic member control
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Economic participation by members
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Concern for community
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Education and training
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Cooperation among cooperatives
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Types of Cooperatives */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Types of Cooperatives</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Consumer Cooperatives</h3>
              <p className="text-green-700 text-sm mb-3">Members purchase goods or services collectively</p>
              <ul className="space-y-1 text-green-700 text-sm">
                <li>• Food cooperatives</li>
                <li>• Buying clubs</li>
                <li>• Retail stores</li>
                <li>• Utility cooperatives</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Producer Cooperatives</h3>
              <p className="text-blue-700 text-sm mb-3">Members jointly process, market, or sell products</p>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• Agricultural cooperatives</li>
                <li>• Marketing cooperatives</li>
                <li>• Processing cooperatives</li>
                <li>• Supply cooperatives</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">Worker Cooperatives</h3>
              <p className="text-purple-700 text-sm mb-3">Employees own and democratically manage business</p>
              <ul className="space-y-1 text-purple-700 text-sm">
                <li>• Manufacturing cooperatives</li>
                <li>• Service cooperatives</li>
                <li>• Professional cooperatives</li>
                <li>• Technology cooperatives</li>
              </ul>
            </div>
            <div className="bg-orange-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-3">Financial Cooperatives</h3>
              <p className="text-orange-700 text-sm mb-3">Provide financial services to members</p>
              <ul className="space-y-1 text-orange-700 text-sm">
                <li>• Credit unions</li>
                <li>• Mutual banks</li>
                <li>• Insurance cooperatives</li>
                <li>• Investment clubs</li>
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-3">Housing Cooperatives</h3>
              <p className="text-red-700 text-sm mb-3">Members collectively own and manage housing</p>
              <ul className="space-y-1 text-red-700 text-sm">
                <li>• Residential cooperatives</li>
                <li>• Limited equity cooperatives</li>
                <li>• Market-rate cooperatives</li>
                <li>• Senior housing cooperatives</li>
              </ul>
            </div>
            <div className="bg-teal-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-teal-900 mb-3">Multi-Stakeholder</h3>
              <p className="text-teal-700 text-sm mb-3">Multiple groups with shared interests</p>
              <ul className="space-y-1 text-teal-700 text-sm">
                <li>• Community cooperatives</li>
                <li>• Platform cooperatives</li>
                <li>• Social cooperatives</li>
                <li>• Solidarity cooperatives</li>
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
                  <h3 className="font-semibold text-green-900 mb-1">Democratic Control</h3>
                  <p className="text-green-700">Members have equal voice in governance decisions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Economic Benefits</h3>
                  <p className="text-green-700">Members share in profits and reduced costs</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Community Focus</h3>
                  <p className="text-green-700">Serves community needs rather than external investors</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Stability</h3>
                  <p className="text-green-700">Less likely to relocate or drastically change operations</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Tax Benefits</h3>
                  <p className="text-green-700">Potential tax advantages and special deductions</p>
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
                  <h3 className="font-semibold text-red-900 mb-1">Complex Decision Making</h3>
                  <p className="text-red-700">Democratic process can slow business decisions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Limited Capital</h3>
                  <p className="text-red-700">Difficulty raising capital from outside investors</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Member Conflicts</h3>
                  <p className="text-red-700">Potential disagreements among diverse member interests</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Limited Growth</h3>
                  <p className="text-red-700">May face challenges scaling operations rapidly</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Educational Requirements</h3>
                  <p className="text-red-700">Members need ongoing education about cooperative principles</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cooperative Principles */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Seven Cooperative Principles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Voluntary & Open Membership</h3>
                  <p className="text-gray-600">Open to all without discrimination</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Democratic Member Control</h3>
                  <p className="text-gray-600">One member, one vote principle</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Member Economic Participation</h3>
                  <p className="text-gray-600">Members contribute to and democratically control capital</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-blue-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Autonomy & Independence</h3>
                  <p className="text-gray-600">Self-help organizations controlled by members</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-green-600 font-bold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Education, Training & Information</h3>
                  <p className="text-gray-600">Ongoing education for members and community</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-green-600 font-bold text-sm">6</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Cooperation Among Cooperatives</h3>
                  <p className="text-gray-600">Working together through local, national, and international structures</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-green-600 font-bold text-sm">7</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Concern for Community</h3>
                  <p className="text-gray-600">Working for sustainable development of communities</p>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Formation Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Feasibility Study</h4>
                    <p className="text-gray-600">Assess market demand and member interest</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Organize Founding Members</h4>
                    <p className="text-gray-600">Recruit committed founding members</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose Legal Structure</h4>
                    <p className="text-gray-600">Select appropriate cooperative corporation type</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">File Incorporation Documents</h4>
                    <p className="text-gray-600">Submit articles of incorporation to state</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Required Documents</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Articles of Incorporation</h4>
                  <p className="text-gray-600 text-sm">Must include cooperative purpose and member structure</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Bylaws</h4>
                  <p className="text-gray-600 text-sm">Governance structure and member rights</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Membership Agreement</h4>
                  <p className="text-gray-600 text-sm">Terms and conditions of membership</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Business Plan</h4>
                  <p className="text-gray-600 text-sm">Financial projections and operational strategy</p>
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
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Subchapter T</h3>
              <p className="text-blue-800 mb-3">Special tax treatment for cooperatives</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Single taxation on member income</li>
                <li>• Patronage dividends deductible</li>
                <li>• Form 1120-C filing</li>
                <li>• Member receives Form 1099-PATR</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Patronage Dividends</h3>
              <p className="text-blue-800 mb-3">Profits distributed to members based on use</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Taxable to members when received</li>
                <li>• Deductible to cooperative</li>
                <li>• Must be based on business done</li>
                <li>• 20% minimum in cash</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">State Considerations</h3>
              <p className="text-blue-800 mb-3">State tax treatment varies</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Some states offer tax exemptions</li>
                <li>• Special cooperative tax rates</li>
                <li>• Property tax considerations</li>
                <li>• Sales tax exemptions possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Form Your Cooperative?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Get expert guidance for cooperative formation and member-owned business structure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formation-workflow">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Start Cooperative Formation
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