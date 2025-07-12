import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, MapPin, User, Zap, HeadphonesIcon, AlertCircle } from "lucide-react";
const businessTeamImg = "/business-management-hero.jpg";
import { useQuery } from "@tanstack/react-query";

export default function RegisteredAgentServices() {
  // Fetch dynamic registered agent plans from admin
  const { data: registeredAgentPlans = [], isLoading } = useQuery({
    queryKey: ["/api/registered-agent-plans"],
  });

  const handleGetStarted = (plan: any) => {
    // Use the actual service ID for registered agent service in the services table
    window.location.href = `/multi-step-checkout/30`; // Use the registered agent service ID
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
                <span className="block">Registered Agent</span>
                <span className="block text-green-500">Services</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Professional registered agent services for your business. We provide a reliable address for legal documents and ensure you never miss important correspondence or legal deadlines.
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
                    Get Registered Agent
                  </span>
                </button>

              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <User className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Professional Agent</h3>
                      <p className="text-lg mt-2 opacity-90">Legal Compliance</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Service Card */}
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={businessTeamImg}
                    alt="Professional business team"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Registered Agent Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What is a Registered Agent?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Understanding the critical role of registered agents in business compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Scale className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Requirement</h3>
                <p className="text-gray-600 mb-4">Every business entity must have a registered agent in their state of formation.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Required by state law</li>
                  <li>• Must have physical address in state</li>
                  <li>• Available during business hours</li>
                  <li>• Accepts legal documents</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Receipt</h3>
                <p className="text-gray-600 mb-4">Registered agents receive important legal and official documents on behalf of your business.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Legal service of process</li>
                  <li>• Government correspondence</li>
                  <li>• Tax notices and documents</li>
                  <li>• Annual report reminders</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Privacy Protection</h3>
                <p className="text-gray-600 mb-4">Using a professional registered agent protects your personal privacy and information.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Keeps home address private</li>
                  <li>• Prevents unexpected visits</li>
                  <li>• Professional business image</li>
                  <li>• Confidential document handling</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans Section - moved under What is a Registered Agent */}
          <div className="mt-20">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Registered Agent Plans
              </h3>
              <p className="mt-4 text-lg text-gray-600">
                Reliable registered agent services at competitive rates
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : registeredAgentPlans.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-600">No registered agent plans available at this time.</p>
              </div>
            ) : (
              <div className={`grid gap-8 ${registeredAgentPlans.length === 1 ? 'max-w-md mx-auto' : registeredAgentPlans.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {registeredAgentPlans.map((plan: any) => (
                    <Card key={plan.id} className={`hover:shadow-xl transition-shadow relative ${plan.isMostPopular ? 'border-2 border-green-500' : 'border-2 border-gray-200'}`}>
                    {plan.isMostPopular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <CardContent className="p-8 pt-12">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.displayName || plan.name}</h3>
                      <div className="text-4xl font-bold text-green-500 mb-6">
                        ${plan.yearlyPrice}<span className="text-lg font-normal text-gray-600">/year</span>
                      </div>
                      {plan.description && (
                        <p className="text-gray-600 mb-6">{plan.description}</p>
                      )}
                      <ul className="space-y-3 mb-8">
                        {plan.features?.map((feature: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        )) || []}
                      </ul>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleGetStarted(plan);
                        }}
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
                          transform: 'translateY(0)',
                          width: '100%'
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
                        Get Started
                      </button>
                    </CardContent>
                    </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Service Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Registered Agent Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive registered agent support for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Zap className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Immediate Notification</h3>
                <p className="text-gray-600">Instant alerts via email and phone when important documents are received.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Scanning</h3>
                <p className="text-gray-600">Digital copies of all documents sent securely to your email within hours.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <MapPin className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">50-State Coverage</h3>
                <p className="text-gray-600">Professional registered agent services available in all 50 states.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <HeadphonesIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expert Support</h3>
                <p className="text-gray-600">Dedicated support team to help you understand and respond to legal documents.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Why Choose Our Registered Agent Service?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                With over a decade of experience, we've helped thousands of businesses maintain compliance while protecting their privacy. Our reliable service ensures you never miss important legal documents or deadlines.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">99.9% Uptime Guarantee</h4>
                    <p className="text-gray-600">Reliable service with backup systems to ensure document receipt</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Experienced Team</h4>
                    <p className="text-gray-600">Trained professionals who understand legal document requirements</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Secure Handling</h4>
                    <p className="text-gray-600">Confidential processing with secure document storage</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Compliance Expertise</h4>
                    <p className="text-gray-600">Deep knowledge of state requirements and regulations</p>
                  </div>
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
                Get Started Today
              </button>
            </div>
            <div className="mt-12 lg:mt-0">
              <Card className="border-2 border-green-500 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">What Happens When You Receive Documents</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Document Receipt</h4>
                        <p className="text-gray-600 text-sm">We receive and log the document immediately</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Instant Notification</h4>
                        <p className="text-gray-600 text-sm">You receive immediate alerts via email/phone</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Document Scanning</h4>
                        <p className="text-gray-600 text-sm">High-resolution scans sent to your email</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3 mt-1">4</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Secure Storage</h4>
                        <p className="text-gray-600 text-sm">Documents archived in your online account</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Avoid These Registered Agent Mistakes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Common pitfalls that can put your business at risk
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Acting as Your Own Agent</h3>
                    <p className="text-gray-700 mb-4">Using yourself or an employee as registered agent can lead to missed documents, privacy issues, and compliance problems.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Missed documents when unavailable</li>
                      <li>• Personal address becomes public record</li>
                      <li>• No backup system for document receipt</li>
                      <li>• Potential for legal service issues</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Using Unreliable Services</h3>
                    <p className="text-gray-700 mb-4">Cheap or unreliable registered agent services can disappear or fail to properly handle important documents.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Service discontinuation without notice</li>
                      <li>• Delayed or missed notifications</li>
                      <li>• Poor document handling procedures</li>
                      <li>• Limited customer support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Forgetting to Update Information</h3>
                    <p className="text-gray-700 mb-4">Failing to update registered agent information with the state can result in legal and compliance issues.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• State may administratively dissolve entity</li>
                      <li>• Legal documents go to wrong address</li>
                      <li>• Default judgments in lawsuits</li>
                      <li>• Compliance violations and penalties</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-red-500 bg-red-50">
              <CardContent className="p-8">
                <div className="flex items-start">
                  <AlertCircle className="w-8 h-8 text-red-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Ignoring Document Deadlines</h3>
                    <p className="text-gray-700 mb-4">Not responding promptly to legal documents or government notices can have serious consequences.</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Default judgments in legal proceedings</li>
                      <li>• Loss of good standing status</li>
                      <li>• Penalties and late fees</li>
                      <li>• Administrative dissolution</li>
                    </ul>
                  </div>
                </div>
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
              Common questions about registered agent services
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I be my own registered agent?</h3>
              <p className="text-gray-600">Yes, you can serve as your own registered agent if you have a physical address in the state and are available during business hours. However, using a professional service provides privacy protection and ensures reliable document receipt.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens if I change my registered agent?</h3>
              <p className="text-gray-600">You must file the appropriate forms with your state to officially change your registered agent. We handle this process for our clients and ensure all documentation is properly filed.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you provide registered agent services in all states?</h3>
              <p className="text-gray-600">Yes, we provide registered agent services in all 50 states. Each state has different requirements, and we ensure compliance with local regulations.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How quickly will I be notified when documents arrive?</h3>
              <p className="text-gray-600">We provide immediate notification via email and phone when documents are received. Premium plans include SMS notifications and expedited processing options.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What types of documents will I receive?</h3>
              <p className="text-gray-600">Common documents include legal service of process, government correspondence, tax notices, annual report reminders, and other official business documents that require formal delivery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Protect Your Business with Professional Registered Agent Service
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Ensure compliance and protect your privacy with our reliable registered agent services.
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
              Get Registered Agent
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
                  <span>agent@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Agent Services</h3>
              <div className="space-y-1">
                <p>Document Receipt</p>
                <p>Instant Notifications</p>
                <p>Compliance Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}