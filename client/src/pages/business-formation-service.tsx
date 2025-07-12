import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, MapPin, Zap, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
const businessFormationImg = "/business-analytics-hero.jpg";
import { SEO, structuredDataTemplates } from "@/components/SEO";
import { serviceMetaTemplates, generateCanonicalUrl } from "@/lib/seoHelpers";

// Animated Counter Component
const AnimatedCounter = ({ target, duration = 2000, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * target));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span className="font-bold text-green-600">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

export default function BusinessFormationService() {
  // Fetch subscription plans from database
  const { data: subscriptionPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
    retry: false,
  });

  // SEO structured data
  const faqData = [
    {
      question: "What types of business entities can I form?",
      answer: "We help you form LLCs, C-Corporations, S-Corporations, and other business entities in all 50 states with expert guidance and ongoing support."
    },
    {
      question: "How much does business formation cost?",
      answer: "Our business formation packages start at $149 plus state filing fees. This includes registered agent service, articles filing, and compliance support."
    },
    {
      question: "Do you provide ongoing compliance support?",
      answer: "Yes, we provide AI-powered compliance monitoring, annual report reminders, and ongoing support to keep your business in good standing."
    },
    {
      question: "Can I get my EIN with business formation?",
      answer: "Yes, we can help you obtain your Federal EIN (Employer Identification Number) as part of our comprehensive business formation service."
    }
  ];

  const breadcrumbData = [
    { name: "Home", url: "https://parafort.com/" },
    { name: "Services", url: "https://parafort.com/services-marketplace" },
    { name: "Business Formation", url: "https://parafort.com/business-formation-service" }
  ];

  const handleGetStarted = () => {
    window.location.href = "/formation-workflow";
  };

  // Helper function to get plan name by features or position
  const getPlanName = (planType: 'basic' | 'standard' | 'premium') => {
    if (!Array.isArray(subscriptionPlans) || subscriptionPlans.length === 0) {
      return 'Plan';
    }
    
    // Sort plans by yearly price to determine tier
    const sortedPlans = [...subscriptionPlans].sort((a, b) => 
      parseFloat(a.yearlyPrice) - parseFloat(b.yearlyPrice)
    );
    
    switch (planType) {
      case 'basic':
        return sortedPlans[0]?.name || 'Free Plan';
      case 'standard':
        return sortedPlans[1]?.name || 'Silver Plan';
      case 'premium':
        return sortedPlans[2]?.name || 'Gold Plan';
      default:
        return 'Plan';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={serviceMetaTemplates.llcFormation.title}
        description={serviceMetaTemplates.llcFormation.description}
        keywords={serviceMetaTemplates.llcFormation.keywords}
        canonicalUrl={generateCanonicalUrl("/business-formation-service")}
        structuredData={[
          structuredDataTemplates.faq(faqData),
          structuredDataTemplates.breadcrumb(breadcrumbData),
          structuredDataTemplates.service(
            "Business Formation Services",
            "Starting at $149",
            "Professional business formation services including LLC and Corporation setup with ongoing compliance support."
          )
        ]}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Professional</span>
                <span className="block text-green-500">Business Formation</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Start your business the right way with our comprehensive formation services. We handle all the paperwork, state filings, and legal requirements so you can focus on building your business.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <button
                  onClick={handleGetStarted}
                  style={{
                    backgroundColor: '#22c55e',
                    color: 'white',
                    fontWeight: '600',
                    padding: '1rem 2rem',
                    fontSize: '1.125rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#16a34a';
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#22c55e';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  Start Your Business for $0 + State Fee
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative">
                <img 
                  src={businessFormationImg} 
                  alt="Professional Business Formation Consultation" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                
                {/* Animated Statistics Overlay */}
                <div className="absolute top-4 left-4 right-4 grid grid-cols-3 gap-2">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-green-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        <AnimatedCounter target={50000} suffix="+" />
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Businesses Formed</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-green-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        <AnimatedCounter target={48} duration={1500} /> hrs
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Average Processing</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-green-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        <AnimatedCounter target={99} duration={2500} />%
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Success Rate</div>
                    </div>
                  </div>
                </div>

                {/* Additional Stats at Bottom */}
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-green-100">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        $<AnimatedCounter target={0} duration={1000} />
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Setup Fee</div>
                    </div>
                  </div>
                  
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-green-100">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">
                        <AnimatedCounter target={24} duration={1800} />/7
                      </div>
                      <div className="text-xs text-gray-600 font-medium">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Form a Business Section */}
      <section className="pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Form a Business Entity?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Protect your personal assets and establish credibility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="service-card-animated card-business-interactive">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Asset Protection</h3>
                <p className="text-gray-600">Separate your personal assets from business liabilities and debts.</p>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive">
              <CardContent className="p-8 text-center">
                <Award className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Credibility</h3>
                <p className="text-gray-600">Establish trust with customers, vendors, and business partners.</p>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive">
              <CardContent className="p-8 text-center">
                <DollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Benefits</h3>
                <p className="text-gray-600">Access business tax deductions and potential tax savings.</p>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive">
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Credit</h3>
                <p className="text-gray-600">Build business credit separate from your personal credit history.</p>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth & Investment</h3>
                <p className="text-gray-600">Attract investors and expand with a formal business structure.</p>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive">
              <CardContent className="p-8 text-center">
                <Scale className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Compliance</h3>
                <p className="text-gray-600">Meet legal requirements for business operations and contracts.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Formation Packages Section - Moved under "Why Form a Business Entity?" */}
        <div className="w-full px-4 sm:px-6 lg:px-8 mt-20" style={{ backgroundColor: '#c4fdd9', padding: '80px 16px 0px 16px', borderRadius: '0', margin: '80px 0 0' }}>
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Formation Packages
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the package that fits your business needs
            </p>
          </div>

          {plansLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-2 border-gray-200">
                  <CardContent className="p-8 text-center">
                    <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded mb-6 animate-pulse"></div>
                    <div className="space-y-3 mb-8">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                    <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : Array.isArray(subscriptionPlans) && subscriptionPlans.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {subscriptionPlans
                .sort((a, b) => parseFloat(a.yearlyPrice) - parseFloat(b.yearlyPrice))
                .map((plan, index) => {
                  const isPopular = index === 1; // Middle plan is most popular
                  const features = Array.isArray(plan.features) ? plan.features : [];
                  
                  return (
                    <Card key={plan.id} className={`border-2 hover:shadow-xl transition-shadow relative ${
                      isPopular ? 'border-green-500' : 'border-gray-200'
                    }`}>
                      {isPopular && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                        <div className="mb-6">
                          <div className="flex items-baseline justify-center mb-2">
                            <span className="text-4xl font-bold text-gray-900">
                              ${parseFloat(plan.yearlyPrice).toFixed(0)}
                            </span>
                          </div>
                          <p className="text-gray-600">+ State filing fees</p>
                        </div>
                        
                        {plan.description && (
                          <p className="text-gray-600 mb-6">{plan.description}</p>
                        )}
                        
                        <ul className="space-y-3 mb-8 text-left">
                          {features.length > 0 ? (
                            features.map((feature, idx) => (
                              <li key={idx} className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-gray-700">{feature}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center">
                              <Check className="w-5 h-5 text-green-500 mr-3" />
                              <span className="text-gray-700">Professional business formation services</span>
                            </li>
                          )}
                        </ul>
                        
                        <button
                          onClick={handleGetStarted}
                          style={{
                            width: '100%',
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#059669';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#10b981';
                          }}
                        >
                          Get Started
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading subscription plans...</p>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Entity Types Section */}
      <section className="pt-0 pb-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Choose Your Business Structure
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We help you select the right entity type for your business goals
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Building className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">LLC Formation</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Limited Liability Company - The most popular choice for small businesses offering flexibility and protection.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Personal asset protection</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Tax flexibility (pass-through taxation)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Simple management structure</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Fewer compliance requirements</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
                  <p className="text-gray-600 text-sm">Small businesses, freelancers, real estate investors, consultants</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Building2 className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">Corporation Formation</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  C-Corporation - Ideal for businesses planning to raise capital or go public with formal structure.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Maximum liability protection</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Easier to raise capital</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Perpetual existence</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Employee benefit programs</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Best For:</h4>
                  <p className="text-gray-600 text-sm">High-growth businesses, companies seeking investment, future IPO candidates</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Formation Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Formation Process
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple, fast, and comprehensive business formation service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Structure</h3>
                <p className="text-gray-600">Select the best entity type for your business needs with our guidance.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Name & State</h3>
                <p className="text-gray-600">Reserve your business name and choose the optimal state for incorporation.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">File Documents</h3>
                <p className="text-gray-600">We prepare and file all required formation documents with the state.</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Started</h3>
                <p className="text-gray-600">Receive your documents and begin operating your legally formed business.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What's Included in Formation
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive service to get your business started right
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Articles of Organization/Incorporation</h3>
                </div>
                <p className="text-gray-600">Professional preparation and filing of your formation documents.</p>
                <div className="mt-3">
                  {plansLoading ? (
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xs text-gray-500">Included in {getPlanName('basic')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Registered Agent Service</h3>
                </div>
                <p className="text-gray-600">First year of professional registered agent service included.</p>
                <div className="mt-3">
                  {plansLoading ? (
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xs text-gray-500">Included in {getPlanName('standard')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Hash className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">EIN Application</h3>
                </div>
                <p className="text-gray-600">Federal Tax ID number application and processing.</p>
                <div className="mt-3">
                  {plansLoading ? (
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xs text-gray-500">Included in {getPlanName('standard')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Operating Agreement/Bylaws</h3>
                </div>
                <p className="text-gray-600">Customized governing documents for your business structure.</p>
                <div className="mt-3">
                  {plansLoading ? (
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xs text-gray-500">Included in {getPlanName('premium')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clipboard className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Compliance Calendar</h3>
                </div>
                <p className="text-gray-600">Important deadline tracking to maintain good standing.</p>
                <div className="mt-3">
                  {plansLoading ? (
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xs text-gray-500">Included in {getPlanName('premium')}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Zap className="w-8 h-8 text-green-500 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Rush Processing</h3>
                </div>
                <p className="text-gray-600">Expedited filing when you need to start operations quickly.</p>
                <div className="mt-3">
                  {plansLoading ? (
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <p className="text-xs text-gray-500">Included in {getPlanName('premium')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* State Filing Times Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Formation Times by State
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Processing times vary by state - we track all requirements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Fast States</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Delaware</span>
                      <p className="text-sm text-gray-600">Business-friendly laws</p>
                    </div>
                    <span className="text-green-600 font-semibold">1-2 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Nevada</span>
                      <p className="text-sm text-gray-600">No state income tax</p>
                    </div>
                    <span className="text-green-600 font-semibold">1-3 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Wyoming</span>
                      <p className="text-sm text-gray-600">Low fees, privacy</p>
                    </div>
                    <span className="text-green-600 font-semibold">1-2 days</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Florida</span>
                      <p className="text-sm text-gray-600">No state income tax</p>
                    </div>
                    <span className="text-green-600 font-semibold">3-5 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">State Selection Factors</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Tax Considerations</h4>
                      <p className="text-gray-600">State income tax, franchise tax, and other fees</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Laws</h4>
                      <p className="text-gray-600">Corporate governance and liability protection</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Annual Requirements</h4>
                      <p className="text-gray-600">Ongoing compliance and reporting obligations</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Privacy Protection</h4>
                      <p className="text-gray-600">Owner information disclosure requirements</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Business Formation Packages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Business Formation Packages
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the package that fits your business needs
            </p>
          </div>

          {plansLoading ? (
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading plans...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Free Plan */}
              <Card className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
                  <div className="text-4xl font-bold text-green-500 mb-6">
                    $0
                    <span className="text-lg font-normal text-gray-600">+ State filing fees</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Perfect for new entrepreneurs. Start your business at no cost with our Free Plan. 
                    Get essential business formation services, including company registration and basic compliance support, without any hidden fees.
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>Business Formation Filing</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span>Email Support</span>
                    </li>
                  </ul>
                  <button
                    onClick={handleGetStarted}
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
                      Get Started
                    </span>
                  </button>
                </CardContent>
              </Card>

              {/* Silver Plan */}
              {subscriptionPlans?.filter(plan => plan.name === 'Silver').map((plan) => (
                <Card key={plan.id} className="border-2 border-green-500 hover:shadow-xl transition-shadow relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                  <CardContent className="p-8 pt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Silver</h3>
                    <div className="text-4xl font-bold text-green-500 mb-6">
                      $195
                      <span className="text-lg font-normal text-gray-600">+ State filing fees</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Get more than the basics with our Silver Plan. Along with essential business formation services. 
                      Perfect for growing businesses, this plan ensures your company is set up with the right foundation and ongoing compliance support.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Everything in Starter</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Registered Agent Service (1 year)</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Digital Mailbox</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Business Bank Account Setup</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Compliance Calendar</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Priority Support</span>
                      </li>
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
                        Get Started
                      </span>
                    </button>
                  </CardContent>
                </Card>
              ))}

              {/* Gold Plan */}
              {subscriptionPlans?.filter(plan => plan.name === 'Gold').map((plan) => (
                <Card key={plan.id} className="border-2 border-gray-200 hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Gold</h3>
                    <div className="text-4xl font-bold text-green-500 mb-6">
                      $295
                      <span className="text-lg font-normal text-gray-600">+ State filing fees</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Upgrade to our Gold Plan for a comprehensive business formation experience. 
                      Ideal for entrepreneurs who want premium features and expert support as they launch and grow their business.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Everything in Professional</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Dedicated Account Manager</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Custom Legal Documents</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Tax Strategy Consultation</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>Multi-state Compliance</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>24/7 Phone Support</span>
                      </li>
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
                        Get Started
                      </span>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
              Common questions about business formation
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does business formation take?</h3>
              <p className="text-gray-600">Formation time varies by state, typically 1-15 business days. States like Delaware and Wyoming process in 1-2 days, while others may take 1-2 weeks. We offer expedited processing when available.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Should I form an LLC or Corporation?</h3>
              <p className="text-gray-600">LLCs offer flexibility and simplicity, ideal for small businesses and real estate. Corporations provide maximum liability protection and are better for raising capital. We provide free consultation to help you decide.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Which state should I incorporate in?</h3>
              <p className="text-gray-600">Most businesses incorporate in their home state for simplicity. Delaware is popular for corporations due to business-friendly laws. Nevada and Wyoming offer privacy and tax benefits. We help you choose the best state.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do I need a registered agent?</h3>
              <p className="text-gray-600">Yes, all states require a registered agent with a physical address in the state of formation. We provide professional registered agent service to ensure you never miss important legal documents.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What ongoing requirements are there?</h3>
              <p className="text-gray-600">Most states require annual reports and fees to maintain good standing. Some states have additional requirements like franchise taxes. We provide a compliance calendar to track all important dates.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I change my business structure later?</h3>
              <p className="text-gray-600">Yes, businesses can convert from one entity type to another, though the process and tax implications vary. It's important to choose the right structure initially to avoid complications and costs later.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Start Your Business Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Get professional business formation services and protect your personal assets while establishing credibility.
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGetStarted}
              style={{
                backgroundColor: 'white',
                color: '#22c55e',
                fontWeight: '600',
                padding: '1rem 2rem',
                fontSize: '1.125rem',
                borderRadius: '0.5rem',
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
              }}
            >
              Start Your Business for $0 + State Fee
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
                  <span>formation@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Formation Resources</h3>
              <div className="space-y-1">
                <p>Entity Type Comparison</p>
                <p>State Selection Guide</p>
                <p>Formation Checklist</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}