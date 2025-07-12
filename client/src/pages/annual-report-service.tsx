import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard } from "lucide-react";
const digitalMailboxImg = "/business-management-hero.jpg";

export default function AnnualReportService() {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [typedText, setTypedText] = useState("");
  const fullText = "Annual Report Filing Service";

  // Fetch Annual Report Service data (ID: 5)
  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ["/api/services/5"],
    retry: false,
  });

  // Typing animation effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleGetStarted = () => {
    window.location.href = "/multi-step-checkout/5";
  };

  const handleContactUs = () => {
    window.location.href = "tel:+1-800-123-4567";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#27884b] py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-8 animate-float">
          <FileText className="w-8 h-8 text-white/30" />
        </div>
        <div className="absolute top-1/3 right-16 animate-float animation-delay-1000">
          <Calendar className="w-6 h-6 text-white/30" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float animation-delay-2000">
          <Shield className="w-7 h-7 text-white/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-white sm:text-5xl md:text-6xl leading-tight">
                <span className="block">{typedText}</span>
                <span className="text-green-500 animate-pulse">|</span>
              </h1>
              <div 
                className="transform translate-y-8 opacity-0 animate-[slideUp_0.8s_ease-out_1.5s_forwards]"
              >
                <p className="mt-6 text-xl text-gray-200 leading-relaxed max-w-3xl">
                  Stay compliant with state requirements through our professional annual report filing service. We handle all the paperwork, deadlines, and state submissions to keep your business in good standing.
                </p>
              </div>
              <div 
                className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 transform translate-y-8 opacity-0 animate-[slideUp_0.8s_ease-out_2s_forwards]"
              >
                <button
                  onClick={handleGetStarted}
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    border: 'none',
                    cursor: 'pointer',
                    marginRight: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#059669';
                    (e.target as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#10b981';
                    (e.target as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                  </svg>
                  File Annual Report
                </button>
                <Link
                  to="/annual-report-due-dates"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    border: '2px solid white',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'white';
                    (e.target as HTMLElement).style.color = '#374151';
                    (e.target as HTMLElement).style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    (e.target as HTMLElement).style.color = 'white';
                    (e.target as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Check Due Dates
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div 
                className="relative transform translate-y-8 opacity-0 animate-[slideUp_0.8s_ease-out_1s_forwards]"
              >
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden hover-lift">
                  <img 
                    src={digitalMailboxImg}
                    alt="Professional woman managing annual reports"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Annual Report Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              What is an Annual Report?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Required state filing to maintain your business in good standing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">State Compliance Requirement</h3>
              <p className="text-lg text-gray-600 mb-6">
                An Annual Report is a mandatory filing required by most states to maintain your business 
                entity in good standing. It provides updated information about your company to the state 
                and ensures your business remains compliant with local regulations.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Required Information</h4>
                    <p className="text-gray-600">Business address, registered agent, officers/members</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Annual Deadline</h4>
                    <p className="text-gray-600">Due dates vary by state, typically anniversary of formation</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Consequences of Non-Filing</h4>
                    <p className="text-gray-600">Late fees, loss of good standing, potential dissolution</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Annual Report Overview</h4>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Filing Frequency:</span>
                    <span className="text-green-500">Annually</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Required By:</span>
                    <span className="text-green-500">Most US States</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Typical Fee Range:</span>
                    <span className="text-green-500">$10 - $800</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Late Penalty:</span>
                    <span className="text-red-600">$25 - $500+</span>
                  </div>
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
              Annual Report Filing Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional filing service with deadline reminders
            </p>
          </div>

          <Card className="border-2 border-green-500 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                {serviceLoading ? (
                  <div className="animate-pulse">
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className="text-5xl font-bold text-gray-900">$</span>
                      <span className="text-7xl font-bold text-gray-900">
                        {serviceData?.oneTimePrice ? 
                          parseFloat(serviceData.oneTimePrice).toFixed(0) : 
                          serviceData?.recurringPrice ? 
                          parseFloat(serviceData.recurringPrice).toFixed(0) : 
                          'Loading...'
                        }
                      </span>
                    </div>
                    <p className="text-xl text-gray-600">
                      {serviceData?.name || 'Annual Report Filing Service'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {serviceData?.recurringPrice ? `per ${serviceData.recurringInterval || 'year'}` : 'one-time'} + State filing fees
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Included Services:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">State-specific form preparation</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Professional filing and submission</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Deadline tracking and reminders</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Filing confirmation receipt</span>
                    </li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900 mb-4">Additional Benefits:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Compliance monitoring</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Error-free guarantee</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Customer support included</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">Multi-state filing available</span>
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
                File Annual Report Now
              </button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why File Annual Reports Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why File Annual Reports?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Critical benefits of staying compliant with annual report requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Maintain Good Standing</h3>
                <p className="text-gray-600">Keep your business in good standing with the state and avoid administrative dissolution.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Protection</h3>
                <p className="text-gray-600">Preserve your limited liability protection and corporate veil defense.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Banking & Credit</h3>
                <p className="text-gray-600">Required for maintaining business bank accounts and establishing business credit.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Licenses</h3>
                <p className="text-gray-600">Necessary for renewing business licenses and professional certifications.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Scale className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Legal Transactions</h3>
                <p className="text-gray-600">Required for contracts, real estate transactions, and business sales.</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Growth</h3>
                <p className="text-gray-600">Essential for business expansion, partnerships, and investment opportunities.</p>
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
              State Annual Report Requirements
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Due dates and fees vary by state
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular State Examples</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Delaware</span>
                      <p className="text-sm text-gray-600">Due: March 1st</p>
                    </div>
                    <span className="text-green-500 font-semibold">$175</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Florida</span>
                      <p className="text-sm text-gray-600">Due: May 1st</p>
                    </div>
                    <span className="text-green-500 font-semibold">$138.75</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">California</span>
                      <p className="text-sm text-gray-600">Due: Anniversary Date</p>
                    </div>
                    <span className="text-green-500 font-semibold">$20-$800</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">Texas</span>
                      <p className="text-sm text-gray-600">Due: Anniversary Date</p>
                    </div>
                    <span className="text-green-500 font-semibold">$0</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">New York</span>
                      <p className="text-sm text-gray-600">Due: Anniversary Date</p>
                    </div>
                    <span className="text-green-500 font-semibold">$9</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Common Information Required</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Name & Address</h4>
                      <p className="text-gray-600">Current legal name and principal business address</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Registered Agent</h4>
                      <p className="text-gray-600">Current registered agent name and address</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Officers/Directors</h4>
                      <p className="text-gray-600">Names and addresses of current officers or members</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Business Purpose</h4>
                      <p className="text-gray-600">Description of business activities</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Share Information</h4>
                      <p className="text-gray-600">Number of authorized and issued shares (if applicable)</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Consequences of Non-Filing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Consequences of Not Filing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Serious penalties for missed annual report deadlines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-4">Late Fees & Penalties</h3>
                <p className="text-red-700">Immediate late fees ranging from $25 to $500+ per state, plus interest on unpaid amounts.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <Building className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-4">Loss of Good Standing</h3>
                <p className="text-red-700">Business marked as "not in good standing" which affects banking, contracts, and legal transactions.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <Scale className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-4">Administrative Dissolution</h3>
                <p className="text-red-700">State may dissolve your business entity, requiring expensive reinstatement procedures.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-4">Liability Protection Loss</h3>
                <p className="text-red-700">Personal liability protection may be compromised, exposing personal assets to business debts.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-4">Banking Issues</h3>
                <p className="text-red-700">Banks may freeze accounts or require additional documentation for business transactions.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-red-800 mb-4">License Suspension</h3>
                <p className="text-red-700">Professional licenses and business permits may be suspended or non-renewable.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Service Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Annual Report Service
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Complete filing service with deadline tracking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-green-500 hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Information Gathering</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Collect current business information
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Verify registered agent details
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Review officer/member information
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Confirm business address
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
                  <h3 className="text-xl font-semibold text-gray-900">Form Preparation</h3>
                </div>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Complete state-specific forms
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Ensure accuracy and compliance
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Include all required information
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Review for completeness
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
                    Submit to appropriate state agency
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Pay required filing fees
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Track filing status
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="w-4 h-4 text-green-500 mr-2" />
                    Provide confirmation receipt
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
              Common questions about annual report filing
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">When is my annual report due?</h3>
              <p className="text-gray-600">Due dates vary by state. Most states require filing by the anniversary of your business formation, while others have fixed dates like March 1st or May 1st. We track all deadlines for you.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens if I file late?</h3>
              <p className="text-gray-600">Late filing results in penalties ranging from $25 to $500+, loss of good standing status, and potential administrative dissolution. We help you avoid these consequences with timely filing.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do all states require annual reports?</h3>
              <p className="text-gray-600">Most states require annual reports, but a few don't (like Ohio for LLCs). Requirements and fees vary significantly by state. We know the specific requirements for all 50 states.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can I file the annual report myself?</h3>
              <p className="text-gray-600">Yes, you can file directly with the state. However, our service ensures accuracy, tracks deadlines, handles the paperwork, and provides ongoing compliance monitoring.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What information do you need from me?</h3>
              <p className="text-gray-600">We need current business information including address, registered agent details, officer/member information, and any changes from the previous year. We'll guide you through the process.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you handle multiple states?</h3>
              <p className="text-gray-600">Yes, we can file annual reports in all 50 states. If you have entities in multiple states, we can coordinate all filings and ensure no deadlines are missed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Stay Compliant with Professional Filing
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Don't risk late fees or loss of good standing. Let us handle your annual report filing professionally and on time.
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
              File Annual Report
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
                  <span>annualreport@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Compliance Resources</h3>
              <div className="space-y-1">
                <p>Filing Deadline Calendar</p>
                <p>State Requirements Guide</p>
                <p>Compliance Checklist</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}