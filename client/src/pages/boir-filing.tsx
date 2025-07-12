import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function BoirFiling() {
  const [location, setLocation] = useLocation();
  
  // Fetch BOIR services from the backend
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services/all"],
  });

  // Find BOIR service
  const boirService = services.find((service: any) => 
    service.name.toLowerCase().includes('boir') || 
    service.name.toLowerCase().includes('beneficial ownership')
  );

  const handleGetStarted = () => {
    setLocation("/multi-step-checkout/11");
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
                <span className="block">BOIR Filing Service</span>
                <span className="block text-green-500">Beneficial Ownership Information Report</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Stay compliant with the Corporate Transparency Act. We handle your BOIR filing requirements with precision and expertise, ensuring your business meets all federal reporting obligations.
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
                    Start BOIR Filing
                  </span>
                </button>
                <Button
                  onClick={handleContactUs}
                  variant="outline"
                  className="bg-transparent border-green-500 text-green-500 hover:bg-green-500 hover:text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200"
                ><span className="text-white font-semibold">Get Expert Help</span></Button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="relative">
                    <div className="w-full h-[400px] bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex items-center justify-center">
                      <div className="text-center text-white px-8">
                        <div className="mb-6">
                          <svg className="w-20 h-20 mx-auto text-white/90" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            <path d="M14 2v6h6"/>
                            <path d="M16 13H8"/>
                            <path d="M16 17H8"/>
                            <path d="M10 9H8"/>
                          </svg>
                        </div>
                        <div className="flex items-center justify-center mb-4">
                          <div className="bg-white/20 rounded-full p-3 mr-4">
                            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                              <path d="M10 11L8 9l-1.5 1.5L10 14l6-6-1.5-1.5L10 11z"/>
                            </svg>
                          </div>
                          <h3 className="text-3xl font-bold">Expert BOIR Compliance</h3>
                        </div>
                        <p className="text-xl text-white/90 mb-6">Professional consultation and filing services</p>
                        <div className="flex items-center justify-center space-x-8 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                            <span>Expert Review</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                            <span>Secure Filing</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-white rounded-full mr-2"></div>
                            <span>Deadline Management</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Critical Notice Section */}
      <section className="py-16 bg-red-50 border-t border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-100 border border-red-300 rounded-lg p-8">
            <div className="flex items-start">
              <AlertTriangle className="w-8 h-8 text-red-600 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-4">IMPORTANT: BOIR Filing Deadline</h2>
                <div className="space-y-3 text-red-700">
                  <p className="font-semibold">
                    • Existing companies formed before January 1, 2024: Must file by January 1, 2025
                  </p>
                  <p className="font-semibold">
                    • Companies formed in 2024: Must file within 90 calendar days of formation
                  </p>
                  <p className="font-semibold">
                    • Companies formed after January 1, 2024: Must file within 30 calendar days
                  </p>
                  <p className="mt-4 font-bold text-lg">
                    Penalties for non-compliance: Up to $10,000 in fines and up to 2 years imprisonment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is BOIR Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-8">
                What is BOIR Filing?
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  The Beneficial Ownership Information Report (BOIR) is a federal requirement under the Corporate Transparency Act (CTA) designed to combat money laundering, terrorism financing, and other illicit activities.
                </p>
                <p>
                  Most U.S. companies must report information about their beneficial owners and company applicants to the Financial Crimes Enforcement Network (FinCEN), a bureau of the U.S. Treasury Department.
                </p>
                <p>
                  This reporting requirement aims to increase transparency in business ownership and prevent the misuse of shell companies for illegal purposes.
                </p>
              </div>
            </div>
            <div>
              <Card className="service-card-animated card-business-interactive border-2 border-green-500 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Key BOIR Requirements</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Report beneficial owners (25% or more ownership)</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Include company applicant information</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Provide personal identifying information</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">Update information within 30 days of changes</span>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">File electronically through FinCEN</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* BOIR Service Pricing Section */}
      {!servicesLoading && boirService && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {boirService.name}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                BOIR filing reports company owners and control parties to FinCEN for CTA compliance. Processes in 7 to 10 business days. Expedited service reduces processing to 2 business days.
              </p>
            </div>

            <Card className="service-card-animated card-business-interactive border-2 border-green-500 shadow-2xl">
              <CardContent className="p-12 text-center">
                <div className="mb-8">
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">$</span>
                    <span className="text-7xl font-bold text-gray-900">{boirService.oneTimePrice}</span>
                  </div>
                  <p className="text-xl text-gray-600">{boirService.name}</p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      BOIR filing reports company owners and control parties to FinCEN for CTA compliance. Processes in 7 to 10 business days. Expedited service reduces processing to 2 business days.
                    </p>
                  </div>
                </div>

                {boirService.features && boirService.features.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 mb-4">Included Services:</h4>
                      <ul className="space-y-3">
                        {boirService.features.slice(0, Math.ceil(boirService.features.length / 2)).map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-5 h-5 mr-3 flex-shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900 mb-4">Additional Benefits:</h4>
                      <ul className="space-y-3">
                        {boirService.features.slice(Math.ceil(boirService.features.length / 2)).map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-5 h-5 mr-3 flex-shrink-0">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    onClick={handleGetStarted}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-lg text-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    style={{ 
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontSize: '1.25rem',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#10b981';
                    }}
                  >
                    <span style={{ color: '#ffffff', fontWeight: 'bold' }}>
                      Start Your BOIR Filing
                    </span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Who Must File Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Who Must File a BOIR?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Understanding if your business needs to comply with BOIR requirements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="service-card-animated card-business-interactive border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Must File BOIR</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Corporations (C-Corp, S-Corp)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Limited Liability Companies (LLCs)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Limited Partnerships</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Limited Liability Partnerships</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Business trusts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Other entities created by state filing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive border-gray-200 bg-gray-50">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-gray-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Exempt Entities</h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Large operating companies (500+ employees, $5M+ revenue)</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Public companies</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Banks and credit unions</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Insurance companies</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Investment companies</span>
                  </li>
                  <li className="flex items-start">
                    <Shield className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-1" />
                    <span>Certain other regulated entities</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Filing Deadlines Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              BOIR Filing Deadlines
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Critical deadlines you cannot afford to miss
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="service-card-animated card-business-interactive border-2 border-blue-200 bg-blue-50">
              <CardContent className="p-8 text-center">
                <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Companies</h3>
                <p className="text-gray-600 mb-4">Formed before January 1, 2024</p>
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-800">January 1, 2025</p>
                  <p className="text-blue-700 font-semibold">Final Deadline</p>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive border-2 border-yellow-200 bg-yellow-50">
              <CardContent className="p-8 text-center">
                <div className="bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">2024 Companies</h3>
                <p className="text-gray-600 mb-4">Formed during 2024</p>
                <div className="bg-yellow-100 rounded-lg p-4">
                  <p className="text-2xl font-bold text-yellow-800">90 Days</p>
                  <p className="text-yellow-700 font-semibold">From Formation</p>
                </div>
              </CardContent>
            </Card>

            <Card className="service-card-animated card-business-interactive border-2 border-red-200 bg-red-50">
              <CardContent className="p-8 text-center">
                <div className="bg-red-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">New Companies</h3>
                <p className="text-gray-600 mb-4">Formed after January 1, 2024</p>
                <div className="bg-red-100 rounded-lg p-4">
                  <p className="text-2xl font-bold text-red-800">30 Days</p>
                  <p className="text-red-700 font-semibold">From Formation</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Penalties Section */}
      <section className="py-20 bg-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Penalties for Non-Compliance
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              The consequences of failing to file your BOIR are severe
            </p>
          </div>

          <Card className="service-card-animated card-business-interactive border-2 border-red-300 bg-white shadow-xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="bg-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 mb-4">Civil Penalties</h3>
                  <p className="text-4xl font-bold text-red-600 mb-2">$10,000</p>
                  <p className="text-red-700">Maximum daily fine</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-red-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Scale className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 mb-4">Criminal Penalties</h3>
                  <p className="text-4xl font-bold text-red-600 mb-2">2 Years</p>
                  <p className="text-red-700">Maximum imprisonment</p>
                </div>
              </div>
              
              <div className="mt-8 bg-red-100 rounded-lg p-6 text-center">
                <p className="text-red-800 font-semibold text-lg">
                  Don't risk your business and personal freedom. File your BOIR on time with our expert assistance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose ParaFort Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose ParaFort for BOIR Filing?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional expertise you can trust for critical compliance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white">
                  <path d="M12 15l3.5-3.5L12 8l-3.5 3.5L12 15z" fill="currentColor"/>
                  <path d="M12 2L3 7v10c0 5.55 3.84 9.74 9 9.74s9-4.19 9-9.74V7l-9-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Compliance</h3>
              <p className="text-gray-600">Specialized knowledge of BOIR requirements and FinCEN regulations</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Filing</h3>
              <p className="text-gray-600">Bank-level security for your sensitive personal and business information</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Deadline Management</h3>
              <p className="text-gray-600">We track deadlines and ensure timely filing to avoid penalties</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ongoing Support</h3>
              <p className="text-gray-600">Continued assistance for updates and changes to your BOIR</p>
            </div>
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
              Common questions about BOIR filing requirements
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens if I don't file my BOIR?</h3>
              <p className="text-gray-600">Failure to file can result in civil penalties of up to $10,000 and criminal penalties including up to 2 years imprisonment. The penalties are severe, making compliance essential.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do I need to update my BOIR after filing?</h3>
              <p className="text-gray-600">Yes, you must file an updated BOIR within 30 calendar days of any change to the required information, including changes to beneficial ownership or company information.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Who qualifies as a beneficial owner?</h3>
              <p className="text-gray-600">A beneficial owner is an individual who owns or controls at least 25% of the ownership interests of the company, or exercises substantial control over the company.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Is my information kept confidential?</h3>
              <p className="text-gray-600">Yes, BOIR information is confidential and only available to authorized government agencies for specific purposes. It is not public information.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How long does the BOIR filing process take?</h3>
              <p className="text-gray-600">With ParaFort's professional service, most BOIR filings are completed within 3-5 business days once we receive all required information and documentation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Don't Risk Penalties - File Your BOIR Today
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Protect your business with professional BOIR filing services. Our experts ensure compliance and peace of mind.
          </p>

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
                  <span>support@parafort.com</span>
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
                <p>BOIR Compliance Guide</p>
                <p>Filing Requirements</p>
                <p>Penalty Information</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}