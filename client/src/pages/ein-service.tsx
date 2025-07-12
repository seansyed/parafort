import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
const annualReportImg = "/business-management-hero.jpg";

export default function EinService() {
  const { data: service, isLoading } = useQuery({
    queryKey: ['/api/services/17'], // EIN service ID
    retry: false,
  });

  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/17"; // EIN service
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
                <span className="block">Get Your</span>
                <span className="block text-green-500">EIN (Tax ID) Fast</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Obtain your Federal Employer Identification Number (EIN) quickly and easily. Required for opening business bank accounts, hiring employees, and filing taxes. Get your EIN in as little as 1 business day with our expedited service.
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
                    Apply for EIN Now
                  </span>
                </button>

              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Hash className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Federal Tax ID Number</h3>
                      <p className="text-lg mt-2 opacity-90">Fast & Reliable Service</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Service Card */}
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={annualReportImg}
                    alt="Professional business consultation"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is an EIN Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What is an EIN (Employer Identification Number)?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Your business tax identification number from the IRS
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Essential Business Identifier</h3>
              <p className="text-lg text-gray-600 mb-6">
                An Employer Identification Number (EIN), also known as a Federal Tax Identification Number, 
                is a unique nine-digit number assigned by the Internal Revenue Service (IRS) to identify 
                your business for tax purposes.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Format: XX-XXXXXXX</h4>
                    <p className="text-gray-600">Nine digits in the format 12-3456789</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Also Known As</h4>
                    <p className="text-gray-600">Federal Tax ID, Business Tax ID, or Tax Identification Number</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Issued By</h4>
                    <p className="text-gray-600">Internal Revenue Service (IRS)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">EIN Sample Format</h4>
              <div className="bg-white rounded-lg p-6 text-center border-2 border-dashed border-gray-300">
                <div className="text-4xl font-mono font-bold text-green-500 mb-2">12-3456789</div>
                <p className="text-sm text-gray-600">Your unique 9-digit business identifier</p>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Time:</span>
                  <span className="font-semibold">1-15 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-semibold">Free from IRS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valid:</span>
                  <span className="font-semibold">Lifetime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" style={{ backgroundColor: '#c4fed9' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              EIN Service Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Fast, reliable EIN service with expert support
            </p>
          </div>

          <Card className="border-2 border-green-500 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl font-bold text-gray-900">$</span>
                  <span className="text-7xl font-bold text-gray-900">
                    {isLoading ? "..." : Number(service?.oneTimePrice || 49).toFixed(0)}
                  </span>
                </div>
                <p className="text-xl text-gray-600">Professional EIN Service</p>
                <p className="text-sm text-gray-500 mt-2">Same-day IRS submission</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Included Services:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Expert application preparation</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Same-day IRS submission</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Application status tracking</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">IRS correspondence handling</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Guarantees:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Error-free application</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">1-2 business day processing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Customer support included</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">100% satisfaction guarantee</span>
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
                  (e.target as HTMLElement).style.backgroundColor = '#059669';
                  (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#10b981';
                  (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                Get Your EIN Today
              </button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why You Need an EIN Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Do You Need an EIN?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Essential for most business operations and legal requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Open Business Bank Account</h3>
                <p className="text-gray-600">Required by virtually all banks to open a business checking account and separate personal from business finances.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Hire Employees</h3>
                <p className="text-gray-600">Mandatory for businesses with employees to report payroll taxes and issue W-2 forms.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">File Tax Returns</h3>
                <p className="text-gray-600">Required for filing business tax returns and paying federal taxes.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply for Business Credit</h3>
                <p className="text-gray-600">Needed to establish business credit history and apply for business loans or credit cards.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Scale className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Compliance</h3>
                <p className="text-gray-600">Required for various business licenses, permits, and regulatory compliance.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Protect Your SSN</h3>
                <p className="text-gray-600">Use your EIN instead of your Social Security Number for business purposes to protect your personal information.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Needs an EIN Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Who Needs an EIN?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Most businesses require an EIN for operations and compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Required to Have an EIN</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses with employees (including one employee)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Multi-member LLCs</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Corporations (C-Corp and S-Corp)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Partnerships</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Non-profit organizations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Estates and trusts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-blue-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Recommended to Have an EIN</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Single-member LLCs (for banking and credit)</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Sole proprietors who want to protect their SSN</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses planning to hire employees in the future</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses that need separate business banking</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Businesses applying for business credit</span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Independent contractors receiving 1099s</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Get an EIN Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How to Get Your EIN
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Multiple ways to obtain your Federal Tax ID Number
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Professional Service</h3>
                  <p className="text-green-500 font-semibold">1-2 Business Days</p>
                </div>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Expert application preparation
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Same-day submission to IRS
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Application tracking & updates
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Error-free guarantee
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Customer support included
                  </li>
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">$149</div>
                  <p className="text-sm text-gray-600">+ IRS processing</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-gray-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">IRS Online</h3>
                  <p className="text-gray-600 font-semibold">7-15 Business Days</p>
                </div>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    Free but limited hours
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    Monday-Friday only
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    System downtime issues
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    No application support
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    Risk of errors/delays
                  </li>
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">Free</div>
                  <p className="text-sm text-gray-600">DIY application</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-gray-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">IRS by Mail/Fax</h3>
                  <p className="text-gray-600 font-semibold">4-6 Weeks</p>
                </div>
                <ul className="space-y-3 text-gray-600 mb-6">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    Free but very slow
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    Paper form SS-4 required
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    No tracking available
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    Potential mail delays
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 mr-2" />
                    Higher error rate
                  </li>
                </ul>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-2">Free</div>
                  <p className="text-sm text-gray-600">Slowest option</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* EIN Requirements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              EIN Application Requirements
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Information needed to complete your EIN application
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Information Required</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Legal Business Name</h4>
                      <p className="text-gray-600">Exact name as filed with the state</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Structure</h4>
                      <p className="text-gray-600">LLC, Corporation, Partnership, etc.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Address</h4>
                      <p className="text-gray-600">Principal business location (not P.O. Box)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">State of Formation</h4>
                      <p className="text-gray-600">Where business was legally formed</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Start Date</h4>
                      <p className="text-gray-600">When business started operations</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Responsible Party Information</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Full Name</h4>
                      <p className="text-gray-600">Owner, partner, or authorized person</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Social Security Number</h4>
                      <p className="text-gray-600">SSN or Individual Taxpayer ID (ITIN)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Personal Address</h4>
                      <p className="text-gray-600">Home address of responsible party</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Phone Number</h4>
                      <p className="text-gray-600">Primary contact number</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Purpose</h4>
                      <p className="text-gray-600">Brief description of business activities</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common questions about EIN applications
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does it take to get an EIN?</h3>
              <p className="text-gray-600">With our professional service, you'll receive your EIN in 1-2 business days. The IRS online application can take 7-15 business days, while mail applications take 4-6 weeks.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Does getting an EIN cost money?</h3>
              <p className="text-gray-600">The IRS does not charge for an EIN. However, professional services charge for preparation, submission, and support. Our $149 fee covers expert preparation and fast processing.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I apply for an EIN myself?</h3>
              <p className="text-gray-600">Yes, you can apply directly with the IRS online, by phone, mail, or fax. However, professional services ensure error-free applications and faster processing with expert support.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do I need an EIN for a single-member LLC?</h3>
              <p className="text-gray-600">While not required, it's highly recommended. An EIN allows you to open business bank accounts, build business credit, and protects your Social Security Number from business use.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I get multiple EINs for one business?</h3>
              <p className="text-gray-600">Generally, no. Each business entity gets one EIN. However, you may need a new EIN if you significantly change your business structure or ownership.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What if I made an error on my EIN application?</h3>
              <p className="text-gray-600">Minor errors can sometimes be corrected by contacting the IRS. Major errors may require applying for a new EIN. Our professional service includes error-checking to prevent this issue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Get Your EIN Fast & Easy
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Don't wait weeks for your EIN. Our expert service gets you approved in 1-2 business days with guaranteed accuracy.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-white hover:border-green-600"
              style={{
                backgroundColor: '#ffffff',
                color: '#059669',
                fontWeight: 'bold',
                fontSize: '20px',
                padding: '16px 32px',
                borderRadius: '8px',
                border: '2px solid #ffffff',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              Apply for EIN Now
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
                  <span>ein@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">EIN Resources</h3>
              <div className="space-y-1">
                <p>EIN Application Guide</p>
                <p>Business Structure Help</p>
                <p>Tax ID Requirements</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}