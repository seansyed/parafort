import { Link } from "wouter";

export default function Nonprofit() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7L15,4V6C15,7.1 14.1,8 13,8S11,7.1 11,6V4L5,7V9C5,10.1 5.9,11 7,11S9,10.1 9,9V15L11,17V22H13V17L15,15V9C15,10.1 15.9,11 17,11S19,10.1 19,9M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Nonprofit Corporation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tax-exempt organization dedicated to charitable, educational, religious, or other public purposes
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nonprofit Corporation Overview</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Best For:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Charitable organizations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Educational institutions
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Religious organizations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Scientific research organizations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Community service groups
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Federal tax exemption
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Eligible for grants and donations
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Limited liability protection
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Public credibility and trust
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Perpetual existence
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 501(c)(3) Requirements */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">501(c)(3) Tax-Exempt Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Qualifying Purposes</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Charitable activities</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Educational programs</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Religious purposes</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Scientific research</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Testing for public safety</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Foster amateur sports competition</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Prevention of cruelty to children/animals</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Restrictions</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">No private benefit/inurement</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Limited political campaign activity</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Restricted lobbying activities</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Assets must serve exempt purpose</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">No excessive unrelated business income</span>
                </div>
                <div className="flex items-start">
                  <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">Dissolution clause required</span>
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
                  <h3 className="font-semibold text-green-900 mb-1">Tax Exemption</h3>
                  <p className="text-green-700">Federal and often state income tax exemption</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Grant Eligibility</h3>
                  <p className="text-green-700">Access to foundation and government grants</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Tax-Deductible Donations</h3>
                  <p className="text-green-700">Donors can deduct charitable contributions</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Public Trust</h3>
                  <p className="text-green-700">Enhanced credibility and public confidence</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Limited Liability</h3>
                  <p className="text-green-700">Board and officers protected from personal liability</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Volunteer Protection</h3>
                  <p className="text-green-700">Legal protections for volunteers and staff</p>
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
                  <h3 className="font-semibold text-red-900 mb-1">Complex Formation</h3>
                  <p className="text-red-700">Extensive documentation and IRS approval process</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Ongoing Compliance</h3>
                  <p className="text-red-700">Annual filings and strict operational requirements</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">No Private Benefit</h3>
                  <p className="text-red-700">Cannot benefit private individuals or shareholders</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Political Restrictions</h3>
                  <p className="text-red-700">Limited political campaign and lobbying activities</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                  <span className="text-white font-bold text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">Public Scrutiny</h3>
                  <p className="text-red-700">Tax returns and operations subject to public disclosure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formation Process */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Formation Process</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">State Incorporation</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose State & Name</h4>
                    <p className="text-gray-600">Select incorporation state and nonprofit name</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">File Articles of Incorporation</h4>
                    <p className="text-gray-600">Include required nonprofit language and purposes</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Bylaws</h4>
                    <p className="text-gray-600">Establish governance structure and procedures</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hold Organizational Meeting</h4>
                    <p className="text-gray-600">Elect board, adopt bylaws, and initial resolutions</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Federal Tax Exemption</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Apply for EIN</h4>
                    <p className="text-gray-600">Obtain Employer Identification Number</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">6</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">File Form 1023 or 1023-EZ</h4>
                    <p className="text-gray-600">Apply for 501(c)(3) tax-exempt status</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">7</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">IRS Review Process</h4>
                    <p className="text-gray-600">Wait for IRS determination (3-12 months)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <span className="text-green-600 font-bold text-sm">8</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">State Tax Exemption</h4>
                    <p className="text-gray-600">Apply for state and local tax exemptions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Governance Structure */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Governance Structure</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16,4C16.88,4 17.67,4.84 17.67,5.84C17.67,6.84 16.88,7.68 16,7.68C15.12,7.68 14.33,6.84 14.33,5.84C14.33,4.84 15.12,4 16,4M8,4C8.88,4 9.67,4.84 9.67,5.84C9.67,6.84 8.88,7.68 8,7.68C7.12,7.68 6.33,6.84 6.33,5.84C6.33,4.84 7.12,4 8,4M8,13.64C8.88,13.64 9.67,14.47 9.67,15.47C9.67,16.47 8.88,17.31 8,17.31C7.12,17.31 6.33,16.47 6.33,15.47C6.33,14.47 7.12,13.64 8,13.64M16,13.64C16.88,13.64 17.67,14.47 17.67,15.47C17.67,16.47 16.88,17.31 16,17.31C15.12,17.31 14.33,16.47 14.33,15.47C14.33,14.47 15.12,13.64 16,13.64M12,9.84C12.88,9.84 13.67,10.68 13.67,11.68C13.67,12.68 12.88,13.52 12,13.52C11.12,13.52 10.33,12.68 10.33,11.68C10.33,10.68 11.12,9.84 12,9.84Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Board of Directors</h3>
              <p className="text-gray-600">Provides strategic oversight and ensures mission compliance. Usually unpaid volunteers.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Executive Director/CEO</h3>
              <p className="text-gray-600">Manages day-to-day operations and implements board decisions. Usually paid staff position.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Staff & Volunteers</h3>
              <p className="text-gray-600">Carry out programs and services. Mix of paid employees and volunteer supporters.</p>
            </div>
          </div>
        </div>

        {/* Tax Information */}
        <div className="bg-blue-50 rounded-3xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Tax Information</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Annual Filings</h3>
              <p className="text-blue-800 mb-3">Required annual information returns</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Form 990 (most organizations)</li>
                <li>• Form 990-EZ (smaller organizations)</li>
                <li>• Form 990-N (very small organizations)</li>
                <li>• State charitable organization reports</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Tax Exemptions</h3>
              <p className="text-blue-800 mb-3">Various tax benefits available</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Federal income tax exemption</li>
                <li>• State income tax exemption</li>
                <li>• Property tax exemption</li>
                <li>• Sales tax exemption (varies)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Unrelated Business Income</h3>
              <p className="text-blue-800 mb-3">Taxable business activities</p>
              <ul className="space-y-1 text-blue-700">
                <li>• File Form 990-T if over $1,000</li>
                <li>• Regular corporate tax rates apply</li>
                <li>• Must be regularly carried on</li>
                <li>• Not substantially related to mission</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Form Your Nonprofit Corporation?</h2>
          <p className="text-green-100 mb-6 text-lg">
            Get expert guidance for nonprofit formation and 501(c)(3) tax exemption application
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/formation-workflow">
              <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors">
                Start Nonprofit Formation
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