import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, Edit3, Search, MapPin, AlertCircle } from "lucide-react";
const businessConsultationImg = "/business-management-hero.jpg";
import { useQuery } from "@tanstack/react-query";

export default function FictitiousBusinessServices() {
  // Fetch FBN services from database using services API
  const { data: fbmPlans = [], isLoading } = useQuery({
    queryKey: ['/api/services'],
    select: (data) => {
      console.log('All services data:', data);
      // Filter to show only FBN-related services
      const filtered = data.filter(service => 
        service.name?.toLowerCase().includes('fictitious') ||
        service.name?.toLowerCase().includes('dba') ||
        service.description?.toLowerCase().includes('fictitious business name') ||
        service.description?.toLowerCase().includes('fictitious')
      );
      console.log('Filtered FBN services:', filtered);
      
      // If no FBN services found, create a hardcoded one for testing
      if (filtered.length === 0) {
        return [{
          id: 25,
          name: "Fictitious Business Name (DBA)",
          description: "Register your DBA (Doing Business As) name legally and professionally",
          oneTimePrice: 75,
          features: [
            "Complete DBA registration process",
            "Name availability search",
            "Publication requirements handled",
            "Legal compliance guaranteed"
          ],
          category: "business-formation"
        }];
      }
      
      return filtered;
    }
  });

  const handleGetStarted = (planId) => {
    // Ensure planId is a number/string, not an object
    const serviceId = typeof planId === 'object' ? planId?.id : planId;
    console.log('FBN handleGetStarted - planId:', planId, 'serviceId:', serviceId, 'type:', typeof serviceId);
    if (serviceId) {
      window.location.href = `/multi-step-checkout/${serviceId}`;
    } else {
      console.error('Invalid service ID for FBN service');
    }
  };

  const handleContactUs = () => {
    window.location.href = "tel:+1-800-123-4567";
  };

  const formatPrice = (price) => {
    if (!price) return '';
    const numPrice = parseFloat(price);
    return numPrice % 1 === 0 ? `$${numPrice.toFixed(0)}` : `$${numPrice.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Fictitious Business</span>
                <span className="block text-green-500">Name Services</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Register your DBA (Doing Business As) name legally and professionally. We handle the entire fictitious business name registration process, from availability searches to publication requirements.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button
                  onClick={() => handleGetStarted(25)} // Use service ID 25 for FBN
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
                    Register DBA Name
                  </span>
                </button>

              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Edit3 className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">DBA Registration</h3>
                      <p className="text-lg mt-2 opacity-90">Professional Service</p>
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

      {/* What is DBA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What is a Fictitious Business Name?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Understanding DBA registration and its benefits for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">DBA Definition</h3>
                <p className="text-gray-600 mb-4">A fictitious business name (DBA) allows you to operate under a different name than your legal business name.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Also called "Doing Business As"</li>
                  <li>• Trade name or assumed name</li>
                  <li>• Required for most states</li>
                  <li>• Must be legally registered</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Who Needs DBA</h3>
                <p className="text-gray-600 mb-4">Various business types require DBA registration to operate legally.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Sole proprietorships</li>
                  <li>• Partnerships without entity name</li>
                  <li>• LLCs operating under different names</li>
                  <li>• Corporations with trade names</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Benefits</h3>
                <p className="text-gray-600 mb-4">DBA registration provides important legal protections and business advantages.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Legal right to use the name</li>
                  <li>• Open business bank accounts</li>
                  <li>• Enter into contracts</li>
                  <li>• Protect against name conflicts</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Section - Moved under "What is a Fictitious Business Name?" */}
          <div className="mt-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                DBA Registration Packages
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Complete DBA registration services at transparent pricing
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
              </div>
            ) : fbmPlans.length > 0 ? (
              <div className="flex justify-center">
                {fbmPlans.map((plan) => (
                  <Card key={plan.id} className={`border-2 hover:shadow-xl transition-shadow max-w-md w-full ${plan.isPopular ? 'border-green-500 relative' : 'border-gray-200'}`}>
                    {plan.isPopular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-green-500 text-white px-4 py-1">Most Popular</Badge>
                      </div>
                    )}
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                      
                      <div className="space-y-3 mb-6">
                        {plan.oneTimePrice && (
                          <div className="text-4xl font-bold text-green-500">
                            Starting at {formatPrice(plan.oneTimePrice)}
                          </div>
                        )}
                        {plan.expeditedPrice && plan.expeditedPrice !== plan.oneTimePrice && (
                          <div className="text-lg text-orange-500 font-semibold">
                            Expedited: {formatPrice(plan.expeditedPrice)}
                          </div>
                        )}
                        {plan.recurringPrice && (
                          <div className="text-xl font-semibold text-gray-700">
                            {formatPrice(plan.recurringPrice)}/{plan.recurringInterval || 'month'}
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-6">{plan.description}</p>

                      {plan.features && plan.features.length > 0 && (
                        <ul className="space-y-3 mb-8">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <button
                        onClick={() => handleGetStarted(plan.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                        style={{
                          backgroundColor: '#22c55e',
                          color: '#ffffff',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                          Get Started
                        </span>
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No DBA packages are currently available. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DBA Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our DBA Registration Process
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Complete DBA registration service from start to finish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Search className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Name Search</h3>
                <p className="text-gray-600">Comprehensive availability search to ensure your desired name is available for registration.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <FileText className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Document Preparation</h3>
                <p className="text-gray-600">Professional preparation of all required DBA registration documents and applications.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Building className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Filing & Publication</h3>
                <p className="text-gray-600">File with appropriate authorities and arrange required newspaper publication.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Completion</h3>
                <p className="text-gray-600">Receive your official DBA certificate and all supporting documentation.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* State Requirements Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              State-Specific Requirements
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              DBA requirements vary by state - we handle all the details
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <MapPin className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Filing Locations</h3>
                <p className="text-gray-600 mb-4">Different states require filing at various levels.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• County clerk offices</li>
                  <li>• State secretary of state</li>
                  <li>• City or municipal offices</li>
                  <li>• Online filing systems</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Publication Requirements</h3>
                <p className="text-gray-600 mb-4">Many states require newspaper publication of your DBA.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Local newspaper publication</li>
                  <li>• Consecutive week requirements</li>
                  <li>• Proof of publication filing</li>
                  <li>• Publication cost varies by state</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Clock className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Renewal Periods</h3>
                <p className="text-gray-600 mb-4">DBA registrations have varying renewal requirements.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• 1-5 year terms depending on state</li>
                  <li>• Automatic renewal reminders</li>
                  <li>• Updated publication may be required</li>
                  <li>• Late fees for missed renewals</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Avoid Common DBA Mistakes
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Many businesses make costly errors when registering their DBA. Our expert service ensures compliance and protects your business interests.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Inadequate Name Search</h4>
                    <p className="text-gray-600">Failing to conduct thorough availability searches</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Missing Publication</h4>
                    <p className="text-gray-600">Not fulfilling required newspaper publication</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Incorrect Filing Location</h4>
                    <p className="text-gray-600">Filing with wrong government office</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Missed Renewals</h4>
                    <p className="text-gray-600">Forgetting to renew before expiration</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleGetStarted(25)} // Use service ID 25 for FBN
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
                Register DBA Correctly
              </button>
            </div>
            <div className="mt-12 lg:mt-0">
              <Card className="border-2 border-green-500 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our Service</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Comprehensive name searches</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Expert document preparation</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Publication coordination</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">State-specific compliance</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Renewal reminders</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Professional support</span>
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
              Common questions about DBA registration
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do I need a DBA if I'm operating under my legal business name?</h3>
              <p className="text-gray-600">No, if you're operating under your exact legal business name, you typically don't need a DBA. However, if you want to operate under any variation or different name, DBA registration is required.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibent text-gray-900 mb-4">How long does DBA registration take?</h3>
              <p className="text-gray-600">Basic filing typically takes 1-2 weeks. If newspaper publication is required, the process can take 4-6 weeks total, depending on state requirements and publication schedules.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I register the same DBA in multiple states?</h3>
              <p className="text-gray-600">Yes, but you must register separately in each state where you plan to operate. Each state has its own registration process and requirements.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens if I don't renew my DBA?</h3>
              <p className="text-gray-600">An expired DBA loses legal protection, and you may not be able to conduct business under that name, open bank accounts, or enter contracts. The name may also become available for others to register.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Does a DBA provide trademark protection?</h3>
              <p className="text-gray-600">No, a DBA registration doesn't provide trademark protection. For comprehensive name protection, you should consider federal trademark registration in addition to your DBA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Register Your DBA Name Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Secure your business name legally and start operating with confidence.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => handleGetStarted(25)} // Use service ID 25 for FBN
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
              Start DBA Registration
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
                  <span>dba@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">DBA Services</h3>
              <div className="space-y-1">
                <p>Name Availability Search</p>
                <p>Document Preparation</p>
                <p>Publication Coordination</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}