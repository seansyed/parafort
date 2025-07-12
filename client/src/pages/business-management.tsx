import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, BarChart3, Cog, Database, PieChart, Monitor, Server } from "lucide-react";
const businessHeroImage = "/business-analytics-hero.jpg";

export default function BusinessManagement() {
  // Fetch subscription plans for Silver & Gold
  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
    retry: false,
  });

  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/1"; // Payroll/business management service
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
                <span className="block">Business</span>
                <span className="block text-green-500">Management</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Streamline your business operations with comprehensive management services. From financial tracking to compliance monitoring, we help you run your business efficiently and effectively.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="bg-gradient-to-r from-green-500 to-green-600 border-2 border-green-500 rounded-lg p-8 mb-6 shadow-lg">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-full mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      Business Management Included
                    </h3>
                    <p className="text-lg text-white text-opacity-95">
                      Complete business management services are included in our Silver & Gold subscription plans
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleContactUs}
                  variant="outline"
                  className="bg-transparent border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
                ><span className="text-white font-semibold">Schedule Consultation</span></Button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <img 
                    src={businessHeroImage} 
                    alt="Professional business management consultation" 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Comprehensive Management Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Everything you need to run your business professionally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <PieChart className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Management</h3>
                <p className="text-gray-600 mb-4">Professional bookkeeping and financial oversight.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Monthly financial statements</li>
                  <li>• Expense tracking & categorization</li>
                  <li>• Cash flow analysis</li>
                  <li>• Budget planning & forecasting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance Monitoring</h3>
                <p className="text-gray-600 mb-4">Stay compliant with all regulatory requirements.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Annual report filings</li>
                  <li>• License renewal tracking</li>
                  <li>• Tax deadline management</li>
                  <li>• Regulatory updates & alerts</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">HR Management</h3>
                <p className="text-gray-600 mb-4">Human resources support and employee management.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Employee handbook creation</li>
                  <li>• Payroll processing support</li>
                  <li>• Benefits administration</li>
                  <li>• Performance review systems</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Management</h3>
                <p className="text-gray-600 mb-4">Organize and maintain important business documents.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Digital document storage</li>
                  <li>• Contract management</li>
                  <li>• Record retention policies</li>
                  <li>• Document version control</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Analytics</h3>
                <p className="text-gray-600 mb-4">Data-driven insights for business growth.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• KPI tracking & reporting</li>
                  <li>• Sales performance analysis</li>
                  <li>• Market trend identification</li>
                  <li>• Growth opportunity assessment</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Cog className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Operations Support</h3>
                <p className="text-gray-600 mb-4">Streamline daily business operations.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Process optimization</li>
                  <li>• Vendor management</li>
                  <li>• Inventory tracking</li>
                  <li>• Quality control systems</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Business Formation Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Formation Plans
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Silver & Gold subscription plans for complete business services
            </p>
          </div>

          {plansLoading ? (
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading plans...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {subscriptionPlans?.filter(plan => plan.name === 'Silver' || plan.name === 'Gold').map((plan) => (
                  <Card key={plan.id} className={`border-2 ${plan.name === 'Gold' ? 'border-green-500' : 'border-gray-200'} hover:shadow-xl transition-shadow relative`}>
                    {plan.name === 'Gold' && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardContent className={`p-8 ${plan.name === 'Gold' ? 'pt-12' : ''}`}>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name} Plan</h3>
                      <div className="text-4xl font-bold text-green-500 mb-6">
                        ${parseFloat(plan.yearlyPrice || '0')}
                        <span className="text-lg font-normal text-gray-600">/year</span>
                      </div>
                      <p className="text-gray-600 mb-6">{plan.description}</p>
                      <ul className="space-y-3 mb-8">
                        {plan.features?.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => window.location.href = `/formation-workflow?planId=${plan.id}`}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200"
                        style={{ 
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: '#ffffff', fontWeight: '600' }}>
                          Get Started with {plan.name}
                        </span>
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Notice about Business Management */}
              <div className="mt-12 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-blue-700 font-medium">
                        Business Management services are included in the above subscription plans
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Technology Platform Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Advanced Management Platform
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our proprietary business management platform integrates all aspects of your business operations into a single, easy-to-use dashboard. Access real-time data, generate reports, and make informed decisions from anywhere.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Monitor className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Real-time business dashboard</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Secure cloud data storage</span>
                </div>
                <div className="flex items-center">
                  <Server className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">API integrations with popular tools</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Access from any device, anywhere</span>
                </div>
              </div>
              <Button
                onClick={handleGetStarted}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg"
              >
                See Platform Demo
              </Button>
            </div>
            <div className="mt-12 lg:mt-0">
              <Card className="border-2 border-green-500 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Financial Dashboard</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Compliance Calendar</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Document Vault</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Performance Analytics</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Task Management</span>
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

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common questions about business management services
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What's included in business management services?</h3>
              <p className="text-gray-600">Our business management services include financial tracking, compliance monitoring, HR support, document management, performance analytics, and operations optimization. The specific services vary by package level.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I upgrade or downgrade my management package?</h3>
              <p className="text-gray-600">Yes, you can change your management package at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle. We'll help you transition smoothly between packages.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How do you ensure data security and privacy?</h3>
              <p className="text-gray-600">We use enterprise-grade encryption, secure cloud infrastructure, and strict access controls to protect your business data. Our platform is SOC 2 compliant and regularly audited for security.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you integrate with existing business software?</h3>
              <p className="text-gray-600">Yes, our platform integrates with popular accounting software, CRM systems, and other business tools. We offer API connections and can set up custom integrations as needed.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What kind of support do you provide?</h3>
              <p className="text-gray-600">Support levels vary by package, from email support in our Essential plan to 24/7 priority support with dedicated account managers in our Enterprise plan. All clients have access to our knowledge base and training resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Transform Your Business Management Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Focus on growing your business while we handle the operational details.
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
              Start Managing Better
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
                  <span>management@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Management Services</h3>
              <div className="space-y-1">
                <p>Financial Management</p>
                <p>Compliance Monitoring</p>
                <p>Performance Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}