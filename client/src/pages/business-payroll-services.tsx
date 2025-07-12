
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, User, Wallet, CreditCard as CreditCardIcon, Percent, FileSpreadsheet, AlertCircle } from "lucide-react";
const payrollConsultationImg = "/business-management-hero.jpg";

export default function BusinessPayrollServices() {
  // Fetch payroll plans from API
  const { data: payrollPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/admin/payroll/plans"],
  });

  const handleGetStarted = () => {
    window.location.href = "/payroll-purchase";
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
                <span className="block">Business Payroll</span>
                <span className="block text-green-500">Services</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Comprehensive payroll management services that ensure accurate, compliant, and timely payroll processing. From employee onboarding to tax filings, we handle every aspect of your payroll needs.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button
                  onClick={handleGetStarted}
                  style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '18px',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#047857';
                    e.target.style.color = '#ffffff';
                    e.target.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#059669';
                    e.target.style.color = '#ffffff';
                    e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Start Payroll Service
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Wallet className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Payroll Processing</h3>
                      <p className="text-lg mt-2 opacity-90">Complete Solution</p>
                    </div>
                  </div>
                </div>
                
                {/* Payroll Consultation Card */}
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={payrollConsultationImg}
                    alt="Professional payroll consultation"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payroll Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Complete Payroll Management
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to manage employee compensation and compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Calculator className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payroll Processing</h3>
                <p className="text-gray-600 mb-4">Accurate calculation and distribution of employee wages and salaries.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Hourly and salary calculations</li>
                  <li>• Overtime and bonus processing</li>
                  <li>• Commission tracking</li>
                  <li>• Multiple pay frequencies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Percent className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Management</h3>
                <p className="text-gray-600 mb-4">Complete payroll tax calculation, withholding, and filing services.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Federal tax withholding</li>
                  <li>• State and local taxes</li>
                  <li>• FICA and unemployment taxes</li>
                  <li>• Quarterly tax filings</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <FileSpreadsheet className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Employee Records</h3>
                <p className="text-gray-600 mb-4">Comprehensive employee database and record management.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Employee onboarding</li>
                  <li>• I-9 and W-4 management</li>
                  <li>• Time and attendance tracking</li>
                  <li>• Benefits administration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <CreditCardIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Direct Deposit</h3>
                <p className="text-gray-600 mb-4">Secure electronic payment processing for employees.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Bank account setup</li>
                  <li>• Multiple account splits</li>
                  <li>• Pay card options</li>
                  <li>• Payment confirmation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Pay Stubs & Reports</h3>
                <p className="text-gray-600 mb-4">Detailed pay statements and comprehensive payroll reporting.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Digital pay stubs</li>
                  <li>• Year-end W-2 forms</li>
                  <li>• Custom payroll reports</li>
                  <li>• Employee self-service portal</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance & Security</h3>
                <p className="text-gray-600 mb-4">Ensure full compliance with employment laws and regulations.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Labor law compliance</li>
                  <li>• Audit protection</li>
                  <li>• Data encryption</li>
                  <li>• Regular compliance updates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Payroll Service Plans
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Flexible payroll solutions to match your business size and needs
            </p>
          </div>

          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-2 border-gray-200 animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-12 bg-gray-200 rounded mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-3 mb-8">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : Array.isArray(payrollPlans) && payrollPlans.length > 0 ? (
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {payrollPlans
                  .filter((plan: any) => plan.isActive)
                  .map((plan: any) => {
                    const features = Array.isArray(plan.features) ? plan.features : [];
                    const monthlyPrice = (plan.monthlyPrice / 100).toFixed(0); // Convert cents to dollars
                    const additionalCost = (plan.additionalEmployeeCost / 100).toFixed(0); // Convert cents to dollars
                    
                    return (
                      <Card 
                        key={plan.id} 
                        className={`border-2 hover:shadow-xl transition-shadow relative ${
                          plan.isMostPopular ? 'border-green-500' : 'border-gray-200'
                        }`}
                      >
                        {plan.isMostPopular && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                              Most Popular
                            </span>
                          </div>
                        )}
                        <CardContent className={`p-8 ${plan.isMostPopular ? 'pt-12' : ''}`}>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {plan.displayName || plan.name}
                          </h3>
                          <div className="text-4xl font-bold text-green-500 mb-6">
                            ${monthlyPrice}
                            <span className="text-lg font-normal text-gray-600">/month</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-6">
                            + ${additionalCost} per additional employee
                          </p>
                          <p className="text-gray-600 mb-6">{plan.description}</p>
                          
                          {features.length > 0 && (
                            <ul className="space-y-3 mb-8">
                              {features.map((feature: string, index: number) => (
                                <li key={index} className="flex items-center">
                                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          
                          <button
                            className="w-full"
                            style={{
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              fontWeight: '600',
                              fontSize: '16px',
                              padding: '12px 24px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              outline: 'none',
                              textDecoration: 'none',
                              display: 'block',
                              width: '100%'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#047857';
                              e.target.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#059669';
                              e.target.style.color = '#ffffff';
                            }}
                            onClick={() => window.location.href = '/payroll-purchase'}
                          >
                            Get Started
                          </button>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No payroll plans available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Why Choose Our Payroll Services?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Save time, reduce errors, and ensure compliance with our comprehensive payroll management solution. Our experienced team handles all aspects of payroll so you can focus on growing your business.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">99.9% Accuracy Guarantee</h4>
                    <p className="text-gray-600">Our rigorous quality controls ensure error-free payroll processing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Full Compliance Support</h4>
                    <p className="text-gray-600">Stay current with ever-changing tax laws and regulations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Dedicated Support Team</h4>
                    <p className="text-gray-600">Expert payroll specialists available when you need them</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Seamless Integration</h4>
                    <p className="text-gray-600">Works with your existing accounting and HR systems</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleGetStarted}
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '16px',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#047857';
                  e.target.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#059669';
                  e.target.style.color = '#ffffff';
                }}
              >
                Get Started Today
              </button>
            </div>
            <div className="mt-12 lg:mt-0">
              <Card className="border-2 border-green-500 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Payroll Features</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Automated Calculations</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Tax Filing & Payments</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Direct Deposit</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Employee Portal</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Year-End Forms</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Mobile Access</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Common Payroll Challenges Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Common Payroll Challenges We Solve
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Avoid these costly mistakes with professional payroll management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Tax Compliance Errors</h3>
                    <p className="text-gray-700 mb-4">Incorrect tax calculations and missed filing deadlines can result in significant penalties and interest charges.</p>
                    <p className="text-sm text-gray-600 font-semibold">Our Solution: Automated tax calculations and guaranteed filing compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Overtime Miscalculations</h3>
                    <p className="text-gray-700 mb-4">Complex overtime rules and varying state regulations can lead to costly calculation errors and labor disputes.</p>
                    <p className="text-sm text-gray-600 font-semibold">Our Solution: Automated overtime tracking with state-specific compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Security Risks</h3>
                    <p className="text-gray-700 mb-4">Payroll data contains sensitive employee information that requires robust security measures to prevent breaches.</p>
                    <p className="text-sm text-gray-600 font-semibold">Our Solution: Bank-level encryption and secure cloud infrastructure</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Time-Consuming Processes</h3>
                    <p className="text-gray-700 mb-4">Manual payroll processing can consume hours each pay period, taking valuable time away from core business activities.</p>
                    <p className="text-sm text-gray-600 font-semibold">Our Solution: Fully automated payroll processing and reporting</p>
                  </div>
                </div>
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
              Common questions about payroll services
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How quickly can you set up payroll for my business?</h3>
              <p className="text-gray-600">Most businesses can be set up within 1-2 business days. We'll handle all the setup work including employee data entry, direct deposit forms, and tax registrations.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you handle multi-state payroll?</h3>
              <p className="text-gray-600">Yes, our Complete and Enterprise plans include multi-state payroll processing with automatic compliance for all state and local tax requirements.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What if there's an error in payroll processing?</h3>
              <p className="text-gray-600">We guarantee 99.9% accuracy and will correct any errors at no cost to you. We also carry professional liability insurance for additional protection.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can employees access their pay information online?</h3>
              <p className="text-gray-600">Yes, all plans include an employee self-service portal where employees can view pay stubs, tax documents, update personal information, and manage direct deposit settings.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you provide year-end tax documents?</h3>
              <p className="text-gray-600">Yes, we prepare and distribute all year-end tax documents including W-2s, 1099s, and provide all necessary reports for your business tax filings.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Simplify Your Payroll Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Let our experts handle your payroll so you can focus on what matters most - growing your business.
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
              Start Payroll Service
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
                  <span>payroll@parafort.com</span>
                </div>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
              <div className="space-y-1">
                <p>Monday - Friday: 8AM - 7PM EST</p>
                <p>Saturday: 9AM - 5PM EST</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
            <div className="text-white">
              <h3 className="text-lg font-semibold mb-4">Payroll Services</h3>
              <div className="space-y-1">
                <p>Payroll Processing</p>
                <p>Tax Management</p>
                <p>Employee Benefits</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}