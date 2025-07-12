import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, MailOpen, Package, Scan, Cloud, Download, Eye, Smartphone, Lock } from "lucide-react";
import { MailboxPlan } from "@shared/schema";
const businessWomanImage = "/business-management-hero.jpg";

export default function DigitalMailboxServices() {
  const { isAuthenticated } = useAuth();
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/mailbox-plans"],
  });

  const handleGetStarted = () => {
    // Navigate to the pricing section on the same page
    const pricingSection = document.querySelector('#pricing-plans');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If pricing section not found, scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactUs = () => {
    window.location.href = "tel:+1-800-123-4567";
  };

  const handlePlanSelect = (plan: MailboxPlan) => {
    // Store selected plan for checkout flow
    sessionStorage.setItem('selectedMailboxPlan', JSON.stringify(plan));
    // Direct to dynamic checkout (step-by-step) - handles authentication internally
    window.location.href = `/dynamic-checkout/mailbox-${plan.id}`;
  };

  const getPlanFeatures = (plan: MailboxPlan) => [
    `${plan.businessAddresses} business address${plan.businessAddresses > 1 ? 'es' : ''} of your choice`,
    `${plan.mailItemsPerMonth} mail items per month`,
    `Cost per mail received over plan limits: $${plan.costPerExtraItem} per item`,
    `Shipping: $${plan.shippingCost} per shipment plus postage`,
    plan.secureShredding ? "Secure shredding" : null,
    `Check deposit subscription: $${plan.checkDepositFee} per month`,
    `${plan.checksIncluded} checks included in plan`,
    `$${plan.additionalCheckFee} per additional check deposits`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Streamline Document Management</span>
                <span className="block text-green-500">with a Digital Mailroom Solution</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Revolutionize your mail handling with a secure, automated Digital Mailroom Solution. Eliminate manual processes, minimize delays, and ensure accurate document routing for faster, more efficient operations.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button
                  onClick={handleGetStarted}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-12 rounded-lg text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 min-h-[60px] w-full sm:w-auto border-0 transition-all duration-200"
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
                    Get Your Digital Mailbox
                  </span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
                    <img 
                      src={businessWomanImage} 
                      alt="Professional woman working with laptop - Digital Mailbox Management" 
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Core Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Performance</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Cutting-edge scanning technology paired with highly trained, experienced staff.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Accuracy</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A rigorous quality control process ensures exceptional accuracy.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Commitment</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We maintain the highest standards of data security in our SSAE-18 SOC 2 compliant facility.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Experience</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Backed by more than 5 years of expertise in document scanning and information management.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Dynamic Pricing Plans Section */}
      <section id="pricing-plans" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Digital Mailbox Plans
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the perfect plan for your business mail needs
            </p>
          </div>

          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-3 mb-8">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans?.filter((plan: MailboxPlan) => plan.isActive).map((plan: MailboxPlan) => (
                <Card key={plan.id} className={`relative transition-all duration-200 hover:shadow-lg ${
                  plan.isMostPopular ? 'border-2 border-green-500 shadow-lg scale-105' : 'border-2 border-gray-200'
                }`}>
                  {plan.isMostPopular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Badge className="bg-green-500 text-white px-4 py-1 text-sm font-semibold">
                        MOST POPULAR
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${plan.isMostPopular ? 'pt-12' : 'pt-8'}`}>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {plan.displayName}
                    </CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-green-500">
                        ${plan.monthlyPrice}
                      </span>
                      <span className="text-lg font-normal text-gray-600 ml-2">
                        /month
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-8 pb-8">
                    <ul className="space-y-3 mb-8">
                      {getPlanFeatures(plan).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                onClick={() => handlePlanSelect(plan)}
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
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#059669';
                  target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = '#10b981';
                  target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  target.style.transform = 'translateY(0)';
                }}
              >
                Start {plan.displayName}
              </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Digital Mailroom Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Inside the Digital Mailroom
            </h2>
            <h3 className="text-2xl font-semibold text-gray-700 mb-8">
              How It Works?
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Streamline your mail handling with our secure Digital Mailroom. Incoming documents—
              like invoices, claims, and business mail—are sent to our secure scanning facility, where 
              we use high-speed scanners to capture and verify key data. Through our Cloud 
              platform, documents are securely delivered and automatically routed to the right person 
              for fast, hands-free processing.
            </p>
          </div>

          <div className="relative mb-20">
            {/* Process Flow with Connecting Lines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting Lines - Hidden on mobile, visible on large screens */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#27884b] via-[#27884b] to-[#27884b] opacity-30 transform -translate-y-1/2 z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10">
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-500/20">
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <MailOpen className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 font-bold text-sm">
                        1
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">We Collect/Receive Your Mail</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Your documents, including invoices and claims, are sent to our secure facility.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="relative z-10">
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-500/20">
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Clipboard className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 font-bold text-sm">
                        2
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">We Sort & Organize Your Mail</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We sort your mail and organize it for efficient digitization and processing.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="relative z-10">
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-500/20">
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <FileText className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 font-bold text-sm">
                        3
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">We Digitize Your Documents</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We scan and extract data using high-speed scanners and intelligent capture.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Step 4 */}
              <div className="relative z-10">
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-green-500/20">
                  <CardContent className="p-8">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <Cloud className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-green-500 rounded-full flex items-center justify-center text-green-500 font-bold text-sm">
                        4
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">We Deliver Your Mail Digitally</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Documents are securely delivered via our cloud system to the right person or team.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ideal for securely accessing and managing personal or business mail from anywhere.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Individuals and families</h3>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Small office and home businesses</h3>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Entrepreneurs and start-ups</h3>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-700">Expats and students</h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
                Why Choose Digital Mailbox?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform how you handle business mail with our comprehensive digital mailbox solution. Perfect for remote businesses, frequent travelers, and privacy-conscious entrepreneurs.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Building2 className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Professional business presence</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Access mail from anywhere</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Enhanced privacy protection</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Time-saving automation</span>
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
                Start Your Mailbox
              </button>
            </div>
            <div className="mt-12 lg:mt-0">
              <Card className="border-2 border-green-500 shadow-xl">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Perfect For</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Remote businesses & startups</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Digital nomads & travelers</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Home-based businesses</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">E-commerce companies</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">International businesses</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Privacy-focused entrepreneurs</span>
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
              Common questions about digital mailbox services
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How quickly are mail pieces scanned and available?</h3>
              <p className="text-gray-600">Most mail pieces are scanned and available in your digital mailbox within 24 hours of receipt. Priority mail and time-sensitive documents are processed the same day.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I use the address for business registration?</h3>
              <p className="text-gray-600">Yes, our business addresses can be used for business registration, banking, and official correspondence. We provide all necessary documentation for business setup.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens to junk mail and unwanted items?</h3>
              <p className="text-gray-600">We can filter and discard junk mail based on your preferences. You can set up automatic filtering rules or manually manage mail disposition from your dashboard.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How secure is my mail and personal information?</h3>
              <p className="text-gray-600">We use bank-level security with 256-bit encryption, secure facilities with 24/7 monitoring, and strict privacy protocols. All staff undergo background checks and sign confidentiality agreements.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I receive packages at my digital mailbox address?</h3>
              <p className="text-gray-600">Yes, all plans include package receiving. We'll notify you with photos when packages arrive and can forward them to your location or hold them for pickup.</p>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Get Your Professional Business Address Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Start managing your business mail digitally with our secure, professional mailbox service.
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
              Start Digital Mailbox
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
                  <span>mailbox@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Mailbox Features</h3>
              <div className="space-y-1">
                <p>Mail Scanning</p>
                <p>Package Receiving</p>
                <p>Global Forwarding</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}