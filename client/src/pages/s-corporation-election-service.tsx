import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
const federalEinImg = "/business-management-hero.jpg";

export default function SCorporationElectionService() {
  // Fetch S-Corporation Election service data (ID: 10)
  const { data: service, isLoading, error } = useQuery({
    queryKey: ['/api/services/10'],
    retry: 1,
  });
  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/10";
  };

  const handleContactUs = () => {
    window.location.href = "tel:+1-800-123-4567";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">S-Corporation</span>
                <span className="block text-green-500">Tax Election</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Elect S-Corporation tax status for your LLC or Corporation and potentially save thousands in self-employment taxes. Our experts handle the Form 2553 filing and ensure compliance with all IRS requirements.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button
                  onClick={handleGetStarted}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-lg text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 min-h-[60px] w-full sm:w-auto border-0 transition-all duration-200 mr-4"
                  style={{ 
                    backgroundColor: '#22c55e',
                    color: '#ffffff',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                    File S-Corp Election
                  </span>
                </button>

              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Calculator className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Tax Savings Election</h3>
                      <p className="text-lg mt-2 opacity-90">IRS Form 2553</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Service Card */}
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={federalEinImg}
                    alt="Professional business document consultation"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is S-Corp Election Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What is S-Corporation Tax Election?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A tax designation that can provide significant savings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tax Status Election</h3>
              <p className="text-lg text-gray-600 mb-6">
                S-Corporation election is a tax designation that allows your LLC or Corporation to be taxed 
                as an S-Corp, potentially saving thousands in self-employment taxes. This election is made 
                by filing Form 2553 with the IRS.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Pass-Through Taxation</h4>
                    <p className="text-gray-600">Business profits and losses pass through to your personal tax return</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Self-Employment Tax Savings</h4>
                    <p className="text-gray-600">Only wages subject to SE tax, not business profits</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Payroll Requirements</h4>
                    <p className="text-gray-600">Must pay reasonable salary to owner-employees</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Potential Tax Savings Example</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Without S-Corp Election</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Business Profit:</span>
                      <span>$100,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Self-Employment Tax (15.3%):</span>
                      <span className="text-red-600">$15,300</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">With S-Corp Election</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Reasonable Salary:</span>
                      <span>$60,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Business Profit:</span>
                      <span>$40,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SE Tax on Salary (15.3%):</span>
                      <span className="text-red-600">$9,180</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600">
                      <span>Annual Savings:</span>
                      <span>$6,120</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              S-Corp Election Service Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional S-Corp election filing with expert guidance
            </p>
          </div>

          <Card className="border-2 border-green-500 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                {isLoading ? (
                  <div className="flex items-baseline justify-center mb-4">
                    <div className="h-16 w-32 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">$</span>
                    <span className="text-7xl font-bold text-gray-900">
                      {service?.oneTimePrice ? Math.floor(parseFloat(service.oneTimePrice)) : '299'}
                    </span>
                  </div>
                )}
                <p className="text-xl text-gray-600">{service?.name || 'Complete S-Corp Election Service'}</p>
                <p className="text-sm text-gray-500 mt-2">Form 2553 preparation and filing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Included Services:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">S-Corp eligibility analysis</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Form 2553 preparation</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">IRS filing and submission</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Filing confirmation</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Expert Guidance:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Tax savings analysis</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Payroll setup guidance</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Ongoing compliance support</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Tax professional consultation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={handleGetStarted}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 48px',
                  borderRadius: '8px',
                  fontSize: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease-in-out',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#10b981';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Start S-Corp Election
              </button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits of S-Corp Election Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Benefits of S-Corporation Election
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Advantages of electing S-Corp tax status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Self-Employment Tax Savings</h3>
                <p className="text-gray-600">Save on 15.3% self-employment tax on business profits above your reasonable salary.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Deductions</h3>
                <p className="text-gray-600">Deduct health insurance premiums and other benefits for owner-employees.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pass-Through Taxation</h3>
                <p className="text-gray-600">Avoid double taxation - business income flows through to personal returns.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Credibility</h3>
                <p className="text-gray-600">Enhanced business credibility with formal payroll and corporate structure.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Retirement Benefits</h3>
                <p className="text-gray-600">Contribute to qualified retirement plans as an employee of your business.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Scale className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Loss Deductions</h3>
                <p className="text-gray-600">Deduct business losses against other income on your personal tax return.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Should Consider S-Corp Election Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Who Should Consider S-Corp Election?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Determine if S-Corp election is right for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Good Candidates</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">LLCs or Corps with profits over $60,000</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Service-based businesses (consulting, professional services)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses with predictable income</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Owner-operators who can pay reasonable salary</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses wanting payroll benefits</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-yellow-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Consider Carefully</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses with irregular income</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Startups with initial losses</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses unable to pay reasonable salary</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Real estate rental businesses</span>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses with multiple unrelated income streams</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filing Requirements Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              S-Corp Election Requirements
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Understanding the rules and deadlines for S-Corp election
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Filing Deadlines</h3>
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">New Businesses</h4>
                    <p className="text-red-700">File within 2 months and 15 days of business formation</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Existing Businesses</h4>
                    <p className="text-blue-700">File by March 15th for election effective January 1st of current year</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Late Election Relief</h4>
                    <p className="text-green-700">Revenue Procedure 2013-30 may allow late elections with reasonable cause</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Eligibility Requirements</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Domestic Entity</h4>
                      <p className="text-gray-600">Must be a US-based LLC or Corporation</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Owner Limitations</h4>
                      <p className="text-gray-600">Maximum 100 shareholders/members</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ownership Type</h4>
                      <p className="text-gray-600">Only individuals, certain trusts, and estates</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Single Class</h4>
                      <p className="text-gray-600">Only one class of stock/membership interests</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common questions about S-Corporation election
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">When should I file for S-Corp election?</h3>
              <p className="text-gray-600">New businesses must file within 2 months and 15 days of formation. Existing businesses must file by March 15th for the election to be effective January 1st of the current tax year.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How much can I save with S-Corp election?</h3>
              <p className="text-gray-600">Savings depend on your business profits and reasonable salary. Generally, businesses with profits over $60,000 can see significant savings on self-employment taxes, often $3,000-$10,000+ annually.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What is a "reasonable salary" for S-Corp?</h3>
              <p className="text-gray-600">The IRS requires S-Corp owner-employees to receive reasonable compensation comparable to what similar businesses pay for similar services. This varies by industry, location, and business size.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I revoke S-Corp election later?</h3>
              <p className="text-gray-600">Yes, but you generally cannot re-elect S-Corp status for 5 years after revocation. Consider carefully before making the election and consult with a tax professional.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do I need to change my business structure?</h3>
              <p className="text-gray-600">No, S-Corp election is just a tax designation. Your LLC or Corporation remains the same legal entity - only the tax treatment changes.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What are the ongoing requirements for S-Corps?</h3>
              <p className="text-gray-600">S-Corps must run payroll for owner-employees, file annual tax returns (Form 1120S), and maintain proper corporate records. Additional compliance requirements may apply.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Start Saving on Taxes Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Let our tax experts handle your S-Corp election and start saving thousands in self-employment taxes.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.href = '/multi-step-checkout/10'}
              style={{
                backgroundColor: 'white',
                color: '#10b981',
                fontWeight: '600',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '18px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              File S-Corp Election
            </button>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>1-800-123-4567</span>
                </div>
                <div className="flex items-center justify-center md:justify-start">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>scorp@parafort.com</span>
                </div>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <div className="space-y-1">
                <p>Monday - Friday: 9AM - 6PM EST</p>
                <p>Saturday: 10AM - 4PM EST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Tax Resources</h3>
              <div className="space-y-1">
                <p>S-Corp Election Guide</p>
                <p>Tax Savings Calculator</p>
                <p>Payroll Setup Help</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}