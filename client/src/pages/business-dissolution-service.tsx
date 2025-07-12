import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, XCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
const businessNameChangeImg = "/businessnamechange.jpg";

export default function BusinessDissolutionService() {
  const { data: service, isLoading } = useQuery({
    queryKey: ["/api/services/21"],
  });

  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/21"; // Business Dissolution Service
  };

  const handleContactUs = () => {
    window.location.href = "tel:+1-800-123-4567";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Business Dissolution</span>
                <span className="block text-green-500">Complete Your Business Closure</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                End your business properly with our comprehensive dissolution services. We handle all the legal requirements, paperwork, and compliance to ensure your business closure is complete and protects you from future liabilities.
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
                    Start Dissolution Process
                  </span>
                </button>

              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0 space-y-6">
              {/* Business Dissolution Card */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <XCircle className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Professional Business Closure</h3>
                      <p className="text-lg mt-2 opacity-90">Complete & Compliant</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Name Change Alternative Card */}
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={businessNameChangeImg}
                    alt="Professional woman working on business name change"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why Dissolve Your Business Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Properly Dissolve Your Business?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Protect yourself from ongoing liabilities and obligations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Avoid Personal Liability</h3>
              <p className="text-gray-600">Protect your personal assets from business debts and obligations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stop Ongoing Fees</h3>
              <p className="text-gray-600">End annual filing fees, franchise taxes, and other business costs</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tax Compliance</h3>
              <p className="text-gray-600">Ensure proper tax closure and avoid future tax obligations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Clean Closure</h3>
              <p className="text-gray-600">Properly close all business relationships and obligations</p>
            </div>
          </div>
        </div>
      </section>

      {/* When to Dissolve Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              When Should You Dissolve Your Business?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common scenarios that require business dissolution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Business Circumstances</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Business is no longer operating or profitable</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Changing business structure or reorganizing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Selling or merging with another company</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Owner retirement or death</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Partnership disputes or dissolution</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Reasons</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Excessive debt or bankruptcy</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Inability to meet ongoing obligations</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Avoiding continued fees and taxes</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Market changes affecting viability</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">Loss of key customers or contracts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Dissolution Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional dissolution services with transparent pricing
            </p>
          </div>

          <Card className="border-2 border-green-500 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-5xl font-bold text-gray-900">$</span>
                  <span className="text-7xl font-bold text-gray-900">
                    {isLoading ? '...' : service?.oneTimePrice ? parseInt(service.oneTimePrice) : '399'}
                  </span>
                </div>
                <p className="text-xl text-gray-600">Complete Dissolution Service</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Included Services:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Articles of Dissolution preparation</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">State filing and processing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Board resolution drafting</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Creditor notification assistance</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Additional Benefits:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Tax closure guidance</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Asset distribution planning</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Compliance checklist</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Expert consultation included</span>
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
                Start Dissolution Process
              </button>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* Business Name Change Alternative Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-green-500 shadow-2xl bg-white">
            <CardContent className="p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Consider Business Name Change Instead?
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Before dissolving your business, explore whether a simple name change could address your needs. A business name change is often more cost-effective and maintains your business history.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center">
                      <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div style={{ color: '#1f2937', fontSize: '16px', fontWeight: '500', lineHeight: '1.5' }}>
                        Maintain business credit history
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div style={{ color: '#1f2937', fontSize: '16px', fontWeight: '500', lineHeight: '1.5' }}>
                        Keep existing contracts and relationships
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div style={{ color: '#1f2937', fontSize: '16px', fontWeight: '500', lineHeight: '1.5' }}>
                        Lower cost alternative
                      </div>
                    </li>
                    <li className="flex items-center">
                      <div className="w-5 h-5 mr-3 flex-shrink-0">
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div style={{ color: '#1f2937', fontSize: '16px', fontWeight: '500', lineHeight: '1.5' }}>
                        Faster processing time
                      </div>
                    </li>
                  </ul>
                  <button
                    onClick={() => window.location.href = '/multi-step-checkout/22'}
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      fontWeight: '600',
                      padding: '16px 40px',
                      borderRadius: '8px',
                      fontSize: '18px',
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
                    Explore Name Change Service
                  </button>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg p-12 flex items-center justify-center text-white max-w-md">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-white">Professional</h3>
                      <h3 className="text-2xl font-bold mb-4 text-white">Business Services</h3>
                      <p className="text-green-50">Expert guidance for all your business needs</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dissolution Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Dissolution Process
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our comprehensive approach to business closure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Initial Assessment</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Review business structure and obligations
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Identify dissolution requirements
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Assess outstanding liabilities
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Create dissolution timeline
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Document Preparation</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Draft Articles of Dissolution
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Prepare board resolutions
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Complete tax forms
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Notify creditors and stakeholders
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">State Filing</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    File with Secretary of State
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Pay dissolution fees
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Handle expedited processing
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Obtain dissolution certificate
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Tax Closure</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    File final tax returns
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Cancel EIN with IRS
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Handle state tax obligations
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Close business accounts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">5</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Asset Distribution</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Liquidate business assets
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Pay outstanding debts
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Distribute remaining assets
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Close business accounts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">6</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Final Compliance</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Cancel licenses and permits
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Terminate business insurance
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Close business relationships
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Maintain required records
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Types of Dissolution Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Types of Business Dissolution
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the right dissolution method for your situation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Voluntary Dissolution</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  When owners decide to close the business voluntarily, typically due to business completion, 
                  retirement, or strategic reasons.
                </p>
                <h4 className="font-semibold text-gray-900 mb-4">Common Reasons:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Business goals achieved
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Owner retirement
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Strategic restructuring
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Sale or merger
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Involuntary Dissolution</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  When the state or courts force business closure due to non-compliance, 
                  violations, or other legal issues.
                </p>
                <h4 className="font-semibold text-gray-900 mb-4">Common Causes:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    Failure to file annual reports
                  </li>
                  <li className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    Non-payment of taxes
                  </li>
                  <li className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    Regulatory violations
                  </li>
                  <li className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    Court orders
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Required Documents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Required Dissolution Documents
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Essential paperwork for proper business closure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Articles of Dissolution</h3>
                <p className="text-gray-600">Official state filing to terminate business existence</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Board Resolution</h3>
                <p className="text-gray-600">Corporate approval for dissolution decision</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Scale className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tax Clearance</h3>
                <p className="text-gray-600">Final tax returns and compliance certificates</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Creditor Notices</h3>
                <p className="text-gray-600">Required notifications to creditors and claimants</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Distribution</h3>
                <p className="text-gray-600">Documentation of final asset distribution</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Record Retention</h3>
                <p className="text-gray-600">Plan for maintaining required business records</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Dissolution Timeline
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Typical timeframe for business dissolution process
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Week 1-2: Planning & Preparation</h3>
              </div>
              <p className="text-gray-600 ml-12">
                Initial consultation, document review, and dissolution strategy development.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Week 3-4: Documentation</h3>
              </div>
              <p className="text-gray-600 ml-12">
                Prepare all required documents, board resolutions, and creditor notices.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Week 5-6: State Filing</h3>
              </div>
              <p className="text-gray-600 ml-12">
                File Articles of Dissolution with the state and obtain dissolution certificate.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Week 7-12: Wind Down</h3>
              </div>
              <p className="text-gray-600 ml-12">
                Complete tax filings, asset distribution, and final compliance requirements.
              </p>
            </div>
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
              Common questions about business dissolution
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does the dissolution process take?</h3>
              <p className="text-gray-600">The complete dissolution process typically takes 8-12 weeks, depending on the complexity of your business and state requirements. We can expedite certain filings if needed.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens to business assets during dissolution?</h3>
              <p className="text-gray-600">Assets must be liquidated to pay debts and obligations first. Any remaining assets are then distributed to owners according to their ownership percentages and the company's operating agreement.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Are owners personally liable for business debts after dissolution?</h3>
              <p className="text-gray-600">Proper dissolution protects owners from personal liability for most business debts. However, personal guarantees and certain obligations may still apply. Consulting with a professional is recommended.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do I need to file final tax returns?</h3>
              <p className="text-gray-600">Yes, final federal and state tax returns must be filed, and all tax obligations must be satisfied. The IRS and state tax agencies must be notified of the business closure.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I dissolve my business if it has outstanding debts?</h3>
              <p className="text-gray-600">Yes, but debts must be addressed during the dissolution process. Creditors must be notified, and available assets must be used to pay obligations before distribution to owners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Close Your Business Properly?
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Protect yourself with professional dissolution services. Our experts ensure complete compliance and peace of mind.
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
              Start Dissolution
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
                  <span>dissolution@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-1">
                <p>Dissolution Guide</p>
                <p>Required Documents</p>
                <p>State Requirements</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}