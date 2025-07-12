import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, Search, MapPin, Zap, HeadphonesIcon } from "lucide-react";
const businessConsultationImg = "/business-management-hero.jpg";

export default function BusinessLicenseServices() {
  // Fetch Business License Service data (ID: 8)
  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ["/api/services/8"],
    retry: false,
  });

  // Fetch Business License Plans
  const { data: licensePlans, isLoading: licensePlansLoading } = useQuery({
    queryKey: ['/api/services?category=Business%20Licenses'],
  });

  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/8";
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
                <span className="block">Business License</span>
                <span className="block text-green-500">Services</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Navigate the complex world of business licensing with expert guidance. We help you identify, obtain, and maintain all required licenses and permits for your business operations.
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
                    Get License Research
                  </span>
                </button>
  
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Scale className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">License Compliance</h3>
                      <p className="text-lg mt-2 opacity-90">Expert Guidance</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Service Card */}
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={businessConsultationImg}
                    alt="Professional business consultation"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* License Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business License Categories
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive licensing support across all industries
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Federal Licenses</h3>
                <p className="text-gray-600 mb-4">Required for businesses regulated by federal agencies.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• FCC Licenses (Broadcasting, Wireless)</li>
                  <li>• FDA Permits (Food, Drugs, Medical)</li>
                  <li>• ATF Licenses (Alcohol, Tobacco, Firearms)</li>
                  <li>• DOT Permits (Transportation)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">State Licenses</h3>
                <p className="text-gray-600 mb-4">State-specific licenses for professional and trade services.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Professional Licenses (Legal, Medical)</li>
                  <li>• Contractor Licenses (General, Specialty)</li>
                  <li>• Real Estate Licenses</li>
                  <li>• Sales Tax Permits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Building className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Permits</h3>
                <p className="text-gray-600 mb-4">City and county permits for business operations.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Business Operating Permits</li>
                  <li>• Building & Zoning Permits</li>
                  <li>• Fire Department Permits</li>
                  <li>• Health Department Permits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry-Specific</h3>
                <p className="text-gray-600 mb-4">Specialized licenses for specific business types.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Restaurant & Food Service</li>
                  <li>• Retail & Wholesale</li>
                  <li>• Manufacturing & Production</li>
                  <li>• Technology & Software</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental</h3>
                <p className="text-gray-600 mb-4">Environmental compliance and safety permits.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• EPA Environmental Permits</li>
                  <li>• Waste Management Licenses</li>
                  <li>• Water & Air Quality Permits</li>
                  <li>• Hazardous Materials Permits</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Employment</h3>
                <p className="text-gray-600 mb-4">Employee-related permits and registrations.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Workers' Compensation Registration</li>
                  <li>• Unemployment Insurance Registration</li>
                  <li>• OSHA Safety Compliance</li>
                  <li>• Labor Relations Permits</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our License Service Process
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Streamlined approach to business licensing compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Search className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. License Research</h3>
                <p className="text-gray-600">Comprehensive analysis of all required licenses for your business type and location.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Application Preparation</h3>
                <p className="text-gray-600">Expert preparation of all license applications with required documentation.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Zap className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Fast Processing</h3>
                <p className="text-gray-600">Expedited submission and follow-up with licensing authorities for quick approval.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <HeadphonesIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Ongoing Support</h3>
                <p className="text-gray-600">Renewal reminders and compliance monitoring to keep your licenses current.</p>
              </CardContent>
            </Card>
          </div>
          {/* Business License Services Plans */}
          <div className="mt-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Business License Services
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Professional business license guidance and filing services
              </p>
            </div>

            {licensePlansLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
                  {licensePlans?.map((plan: any, index: number) => (
                    <Card key={plan.id} className={`border-2 hover:shadow-xl transition-shadow ${index === 0 ? 'border-green-500' : 'border-gray-200'}`}>
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                        <div className="text-4xl font-bold text-green-500 mb-6">
                          ${plan.oneTimePrice ? parseFloat(plan.oneTimePrice).toFixed(0) : 'Contact Us'}
                        </div>
                        <div className="mb-6">
                          <p className="text-gray-600">{plan.description}</p>
                        </div>
                        {plan.features && plan.features.length > 0 && (
                          <ul className="space-y-3 mb-8">
                            {plan.features.map((feature: string, featureIndex: number) => (
                              <li key={featureIndex} className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        <button
                          onClick={() => window.location.href = `/dynamic-checkout?serviceId=${plan.id}`}
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
                            e.currentTarget.style.backgroundColor = '#059669';
                            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#10b981';
                            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          Get Started
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {!licensePlansLoading && (!licensePlans || licensePlans.length === 0) && (
              <div className="text-center py-12">
                <p className="text-gray-600">Business license services will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              How Our Process Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple, efficient licensing with expert guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-600">We analyze your business requirements and identify all necessary licenses.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Research</h3>
              <p className="text-gray-600">Our experts research federal, state, and local licensing requirements.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Application</h3>
              <p className="text-gray-600">We prepare and submit all required applications on your behalf.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Monitoring</h3>
              <p className="text-gray-600">We track application status and ensure timely renewal reminders.</p>
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
              Common questions about business licensing
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How do I know which licenses my business needs?</h3>
              <p className="text-gray-600">Business license requirements vary by industry, location, and business structure. Our experts conduct comprehensive research to identify all federal, state, and local licenses required for your specific business.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does the licensing process take?</h3>
              <p className="text-gray-600">Processing times vary by licensing authority and license type. Simple permits may take 1-2 weeks, while specialized licenses can take 2-6 months. We provide realistic timelines during our consultation.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens if my license application is denied?</h3>
              <p className="text-gray-600">We work with you to address any deficiencies and resubmit your application. Our thorough preparation process minimizes the risk of denial, but we provide ongoing support if issues arise.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you help with license renewals?</h3>
              <p className="text-gray-600">Yes, we provide renewal reminders and can handle the renewal process for ongoing clients. Many licenses require annual or periodic renewals to maintain compliance.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Are government fees included in your pricing?</h3>
              <p className="text-gray-600">Our service fees are separate from government filing fees. We provide a detailed breakdown of all costs upfront, including estimated government fees for transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Get Your Business Licensed Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Don't let licensing complexity delay your business launch. Our experts handle the entire process for you.
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
              Start License Research
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
                  <span>licenses@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Expert Support</h3>
              <div className="space-y-1">
                <p>License Research</p>
                <p>Compliance Monitoring</p>
                <p>Renewal Management</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}