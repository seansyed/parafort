import { Link } from "wouter";

export default function PLLC() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V14.5C14.8,16.9 13.4,18.5 12,18.5C10.6,18.5 9.2,16.9 9.2,14.5V10C9.2,8.6 10.6,7 12,7Z"/>
              <path d="M8,12H16V14H8V12M8,10H16V11H8V10M8,15H16V16H8V15Z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Professional Limited Liability Company (PLLC)</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Combines LLC flexibility with professional practice requirements for licensed professionals
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">PLLC Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Licensed healthcare professionals
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Legal practitioners and law firms
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Architects and engineers
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Certified Public Accountants
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Mental health professionals
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  LLC operational flexibility
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Limited liability protection
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pass-through taxation
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Professional compliance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Tax election options
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* PLLC vs PC Comparison */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">PLLC vs Professional Corporation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-4">PLLC Advantages</h3>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  More operational flexibility
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Pass-through taxation by default
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  No required board meetings
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Simpler record keeping
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Member-managed structure
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Professional Corporation</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  More formal corporate structure
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Corporate taxation by default
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Required board governance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  More extensive compliance
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Shareholder structure
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
                  <h3 className="font-semibold text-green-900 mb-1">LLC Flexibility</h3>
                  <p className="text-green-700">Operational simplicity without corporate formalities</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Limited Liability</h3>
                  <p className="text-green-700">Protection from business debts and non-professional claims</p>
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
                  <h3 className="font-semibold text-green-900 mb-1">Management Structure</h3>
                  <p className="text-green-700">Member-managed or manager-managed options</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Professional Credibility</h3>
                  <p className="text-green-700">Enhanced professional image and client trust</p>
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
                  <h3 className="font-semibold text-red-900 mb-1">Professional Liability</h3>
                  <p className="text-red-700">No protection from professional malpractice claims</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Ownership Restrictions</h3>
                  <p className="text-red-700">Only licensed professionals can be members</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Limited Availability</h3>
                  <p className="text-red-700">Not available in all states for all professions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Regulatory Complexity</h3>
                  <p className="text-red-700">Must comply with professional licensing requirements</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Self-Employment Tax</h3>
                  <p className="text-red-700">Members may be subject to SE tax without S election</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* State Availability */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">State Availability</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">PLLC Available</h3>
              <div className="space-y-2">
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">California</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Texas</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Florida</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">New York</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Illinois</span>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Nevada</span>
                <p className="text-gray-600 text-sm mt-3">...and many others</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">PLLC Not Available</h3>
              <div className="space-y-2">
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Delaware</span>
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Vermont</span>
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Massachusetts</span>
                <p className="text-gray-600 text-sm mt-3">Some states don't allow PLLCs</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Check Requirements</h3>
              <p className="text-gray-600 mb-3">PLLC availability and requirements vary by:</p>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• State laws</li>
                <li>• Professional type</li>
                <li>• Licensing board rules</li>
                <li>• Industry regulations</li>
              </ul>
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
                    <h4 className="font-semibold text-gray-900">Verify Eligibility</h4>
                    <p className="text-gray-600">Confirm PLLC availability for your profession</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose Name</h4>
                    <p className="text-gray-600">Select name with required designation (PLLC, P.L.L.C.)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">File Articles</h4>
                    <p className="text-gray-600">Submit Articles of Organization to state</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Operating Agreement</h4>
                    <p className="text-gray-600">Create professional operating agreement</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Requirements</h3>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Licensed Members Only</h4>
                  <p className="text-gray-600 text-sm">All members must hold valid professional licenses</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Services</h4>
                  <p className="text-gray-600 text-sm">Can only provide licensed professional services</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Insurance Requirements</h4>
                  <p className="text-gray-600 text-sm">Professional liability insurance may be required</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Board Approval</h4>
                  <p className="text-gray-600 text-sm">May need licensing board approval or notification</p>
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
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Default Taxation</h3>
              <p className="text-blue-800 mb-3">Pass-through taxation like regular LLC</p>
              <ul className="space-y-1 text-blue-700">
                <li>• No entity-level tax</li>
                <li>• Members report on personal returns</li>
                <li>• Self-employment tax may apply</li>
                <li>• Form 1065 if multi-member</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">S Corporation Election</h3>
              <p className="text-blue-800 mb-3">Can elect S corporation taxation</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Potential SE tax savings</li>
                <li>• Reasonable salary required</li>
                <li>• File Form 2553</li>
                <li>• Member restrictions apply</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Professional Deductions</h3>
              <p className="text-blue-800 mb-3">Business expense deductions available</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Professional development</li>
                <li>• Continuing education</li>
                <li>• Professional licenses</li>
                <li>• Malpractice insurance</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Form Your PLLC?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Get professional guidance for licensed professional LLC formation and compliance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formation-workflow">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Start PLLC Formation
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