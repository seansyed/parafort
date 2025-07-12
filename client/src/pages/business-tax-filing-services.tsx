import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Check, Shield, Clock, FileText, Users, Building, Calculator, User, TrendingUp, Star, DollarSign, ArrowRight, Calendar } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
const taxConsultationImg = "/business-management-hero.jpg";

export default function BusinessTaxFilingServices() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  // Fetch all Tax category services
  const { data: taxPlans, isLoading } = useQuery({
    queryKey: ['/api/services?category=Tax'],
    retry: false,
  });

  const handleSelectPlan = (planId: number) => {
    setSelectedPlan(planId);
    const plan = taxPlans?.find(p => p.id === planId);
    if (plan) {
      // Navigate to tax filing checkout with proper parameters
      setLocation(`/tax-filing-checkout?service=tax-filing&plan=${plan.name.toLowerCase().replace(/\s+/g, '-')}&amount=${plan.oneTimePrice}`);
    }
  };

  const taxPlanDetails = {
    "LLC Tax Return": {
      icon: User,
      description: "Perfect for single-member LLCs and multi-member LLCs electing partnership taxation",
      features: [
        "Schedule C or Form 1065 preparation",
        "Self-employment tax calculation",
        "Business expense optimization",
        "Federal and state filing",
        "Tax consultation included"
      ],
      entityType: "LLC"
    },
    "Partnership Tax Return": {
      icon: Users,
      description: "Comprehensive tax preparation for partnerships and multi-member LLCs",
      features: [
        "Form 1065 preparation",
        "Partner K-1 statements",
        "Basis tracking and calculations",
        "Distribution planning",
        "Multi-state filing support"
      ],
      entityType: "Partnership"
    },
    "S-Corporation Tax Return": {
      icon: Building,
      description: "Specialized filing for S-Corporation elections with payroll compliance",
      features: [
        "Form 1120S preparation",
        "Shareholder K-1 statements",
        "Reasonable salary analysis",
        "Pass-through deduction optimization",
        "Payroll tax compliance review"
      ],
      entityType: "S-Corporation"
    },
    "C-Corporation Tax Return": {
      icon: Calculator,
      description: "Complete corporate tax preparation for C-Corporations",
      features: [
        "Form 1120 preparation",
        "Corporate tax planning",
        "Depreciation schedules",
        "Multi-state compliance",
        "Quarterly estimate planning"
      ],
      entityType: "C-Corporation"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Professional Business</span>
                <span className="block text-green-500">Tax Filing Services</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Expert tax preparation and filing services for all business entity types. Maximize deductions, ensure compliance, and minimize your tax liability with our professional team.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>IRS Certified Preparers</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>100% Accuracy Guarantee</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>Audit Protection</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <FileText className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Expert Tax Preparation</h3>
                      <p className="text-lg mt-2 opacity-90">All Entity Types</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={taxConsultationImg}
                    alt="Professional tax consultation"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
              <Shield className="h-6 w-6 text-yellow-300 mr-3" />
              <span className="text-white font-semibold text-lg">
                AUDIT PROTECTION INCLUDED
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Complete IRS Audit Support & Representation
            </h3>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              No extra charges • No hidden fees • Full professional representation if audited
            </p>
          </div>
        </div>
      </section>

      {/* Tax Filing Plans Section */}
      <section className="py-20 bg-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Choose Your Tax Filing Plan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional tax preparation tailored to your business entity type
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-4 gap-4 min-w-0">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-8">
                    <div className="bg-gray-200 h-12 w-12 rounded mx-auto mb-4"></div>
                    <div className="bg-gray-200 h-6 w-3/4 rounded mx-auto mb-4"></div>
                    <div className="bg-gray-200 h-8 w-1/2 rounded mx-auto mb-6"></div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="bg-gray-200 h-4 w-full rounded"></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 min-w-0">
              {taxPlans?.map((plan: any) => {
                const details = taxPlanDetails[plan.name as keyof typeof taxPlanDetails];
                if (!details) return null;
                
                const IconComponent = details.icon;
                
                return (
                  <Card 
                    key={plan.id} 
                    className={`hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                      selectedPlan === plan.id 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <div className="bg-green-100 p-3 rounded-full">
                          <IconComponent className="w-8 h-8 text-green-600" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        ${parseFloat(plan.oneTimePrice).toFixed(0)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-6">
                        {details.description}
                      </p>
                      
                      <ul className="space-y-2 mb-8 text-left">
                        {details.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan(plan.id);
                        }}
                        style={{
                          backgroundColor: '#34de73',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          border: 'none',
                          cursor: 'pointer',
                          width: '100%',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#28ba62';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#34de73';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Select Plan
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose ParaFort Tax Services
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Professional expertise you can trust
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">100% Accuracy Guarantee</h3>
                <p className="text-gray-600">
                  We stand behind our work with a complete accuracy guarantee and audit protection.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <Clock className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Turnaround</h3>
                <p className="text-gray-600">
                  Most returns completed within 3-5 business days with expedited options available.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Maximum Deductions</h3>
                <p className="text-gray-600">
                  Our experts identify every possible deduction to minimize your tax liability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>



      {/* Tax Due Dates Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Business Tax Filing Deadlines 2024
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Don't miss critical deadlines - ParaFort ensures timely filing for all business entities
            </p>
            
            {/* ParaFort Experience Banner */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-12 max-w-4xl mx-auto border-l-4 border-green-500">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-gray-900">15+ Years of Tax Excellence</h3>
                  <p className="text-gray-600">Over 10,000 business returns filed • 99.8% accuracy rate • Zero missed deadlines</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-green-600 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-sm text-white">Years Experience</div>
                </div>
                <div className="bg-blue-600 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">10,000+</div>
                  <div className="text-sm text-white">Returns Filed</div>
                </div>
                <div className="bg-purple-600 rounded-lg p-4">
                  <div className="text-2xl font-bold text-white">99.8%</div>
                  <div className="text-sm text-white">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Standard Filing Deadlines */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Calendar className="h-6 w-6 mr-3" />
                  Standard Filing Deadlines
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">C-Corporations</div>
                    <div className="text-sm text-gray-600">Form 1120</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">April 15, 2024</div>
                    <div className="text-xs text-gray-500">4th month after year-end</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">S-Corporations</div>
                    <div className="text-sm text-gray-600">Form 1120S</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">March 15, 2024</div>
                    <div className="text-xs text-gray-500">3rd month after year-end</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Partnerships</div>
                    <div className="text-sm text-gray-600">Form 1065</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">March 15, 2024</div>
                    <div className="text-xs text-gray-500">3rd month after year-end</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">LLCs (Multi-Member)</div>
                    <div className="text-sm text-gray-600">Form 1065</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">March 15, 2024</div>
                    <div className="text-xs text-gray-500">3rd month after year-end</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Sole Proprietorships</div>
                    <div className="text-sm text-gray-600">Schedule C (Form 1040)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">April 15, 2024</div>
                    <div className="text-xs text-gray-500">Same as individual returns</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Extension Deadlines */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Clock className="h-6 w-6 mr-3" />
                  Extension Deadlines (If Filed)
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div>
                    <div className="font-semibold text-gray-900">C-Corporations</div>
                    <div className="text-sm text-gray-600">Form 7004 Extension</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">October 15, 2024</div>
                    <div className="text-xs text-gray-500">6-month extension</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div>
                    <div className="font-semibold text-gray-900">S-Corporations</div>
                    <div className="text-sm text-gray-600">Form 7004 Extension</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">September 15, 2024</div>
                    <div className="text-xs text-gray-500">6-month extension</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div>
                    <div className="font-semibold text-gray-900">Partnerships</div>
                    <div className="text-sm text-gray-600">Form 7004 Extension</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">September 15, 2024</div>
                    <div className="text-xs text-gray-500">6-month extension</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div>
                    <div className="font-semibold text-gray-900">LLCs (Multi-Member)</div>
                    <div className="text-sm text-gray-600">Form 7004 Extension</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">September 15, 2024</div>
                    <div className="text-xs text-gray-500">6-month extension</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                  <div>
                    <div className="font-semibold text-gray-900">Sole Proprietorships</div>
                    <div className="text-sm text-gray-600">Form 4868 Extension</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-600">October 15, 2024</div>
                    <div className="text-xs text-gray-500">6-month extension</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose ParaFort */}
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Why 10,000+ Businesses Trust ParaFort
              </h3>
              <p className="text-gray-600">
                Your deadlines are our deadlines. We've never missed a filing deadline in 15 years.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Shield className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Deadline Guarantee</h4>
                <p className="text-sm text-gray-600">
                  15 years, zero missed deadlines. We handle extensions automatically when needed.
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Users className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Dedicated Team</h4>
                <p className="text-sm text-gray-600">
                  Certified tax professionals specializing in business entities and complex returns.
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <TrendingUp className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Proactive Service</h4>
                <p className="text-sm text-gray-600">
                  We track your deadlines, send reminders, and ensure compliance year-round.
                </p>
              </div>
            </div>
          </div>

          {/* Client Retention Message */}
          <div className="mt-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-8 text-center text-white max-w-4xl mx-auto">
            <h3 className="text-xl font-bold mb-4">
              Join Our Family of Satisfied Business Clients
            </h3>
            <p className="text-green-100 mb-6">
              "ParaFort has handled our corporate taxes for 8 years. Their attention to deadlines and proactive communication gives us complete peace of mind during tax season."
            </p>
            <div className="text-sm text-green-200">
              - Sarah Johnson, CEO of TechStart Solutions
            </div>
            <div className="mt-6 bg-white/10 rounded-lg p-4">
              <div className="text-sm font-medium">Average Client Retention Rate</div>
              <div className="text-3xl font-bold">94%</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our tax filing services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What documents do I need to provide?
                  </h3>
                  <p className="text-gray-600">
                    Required documents vary by business structure but typically include: prior year tax returns, financial statements, receipts for business expenses, payroll records, and Form 1099s. We'll provide a complete checklist after you select your service.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    How long does the tax preparation process take?
                  </h3>
                  <p className="text-gray-600">
                    Most business tax returns are completed within 5-10 business days after we receive all required documents. Complex returns may take longer, and we'll keep you updated throughout the process.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What if I get audited by the IRS?
                  </h3>
                  <p className="text-gray-600">
                    All our tax preparation services include audit support. If you're selected for an IRS audit, we'll represent you and provide all necessary documentation to resolve the matter efficiently.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Can you help with quarterly estimated taxes?
                  </h3>
                  <p className="text-gray-600">
                    Yes! We calculate and help you set up quarterly estimated tax payments to avoid penalties. This service is included with all business tax preparation packages.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What makes your service different?
                  </h3>
                  <p className="text-gray-600">
                    Our certified tax professionals specialize in business taxes and stay current with all tax law changes. We provide personalized service, maximum deduction identification, and year-round support for all your tax needs.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Do you handle multi-state tax returns?
                  </h3>
                  <p className="text-gray-600">
                    Absolutely. We prepare federal and state returns for businesses operating in multiple states, including nexus determination and proper allocation of income across jurisdictions.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Is my information secure?
                  </h3>
                  <p className="text-gray-600">
                    Your data security is our top priority. We use bank-level encryption, secure file transfer protocols, and maintain strict confidentiality standards. All staff are bonded and background-checked.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    What if I need to amend my return?
                  </h3>
                  <p className="text-gray-600">
                    If we made an error, amendments are free. If new information becomes available after filing, we'll prepare amended returns at a reduced rate and help you understand any additional tax implications.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center bg-white p-8 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our tax professionals are here to help. Contact us for personalized assistance with your specific tax situation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center text-green-600">
                  <FileText className="h-5 w-5 mr-2" />
                  <span className="font-medium">Expert Tax Preparation</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Shield className="h-5 w-5 mr-2" />
                  <span className="font-medium">Audit Protection Included</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-medium">Fast Turnaround</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Moved from above */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to File Your Business Taxes?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Get started with professional tax preparation today and maximize your deductions.
          </p>
          
          <div className="text-center">
            <p className="text-green-100 text-lg">
              Select your tax service plan above to get started with professional tax preparation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}