import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Shield, Clock, AlertTriangle, FileText, Users, Building, Phone, Mail, Calendar, DollarSign, Star, Globe, Award, Target, BookOpen, Scale, Briefcase, UserCheck, TrendingUp, CreditCard, CheckCircle, ArrowRight, Hash, Building2, Calculator, Clipboard, BarChart3, PieChart, TrendingDown, Receipt, Banknote, FileBarChart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
const accountingConsultationImg = "/business-management-hero.jpg";

interface BookkeepingPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  documentsLimit: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export default function AccountingBookkeepingServices() {
  const [selectedPlans, setSelectedPlans] = useState<BookkeepingPlan[]>([]);

  // Fetch bookkeeping plans from admin system
  const { data: bookkeepingPlans, isLoading } = useQuery<BookkeepingPlan[]>({
    queryKey: ["/api/bookkeeping/plans"],
    retry: 1,
  });

  useEffect(() => {
    if (bookkeepingPlans) {
      // Filter active plans and sort by order
      const activePlans = bookkeepingPlans.filter(plan => plan.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
      setSelectedPlans(activePlans.slice(0, 3)); // Take first 3 plans
    }
  }, [bookkeepingPlans]);

  const handlePlanClick = (planId: number) => {
    const selectedPlan = selectedPlans.find(plan => plan.id === planId);
    if (!selectedPlan) return;
    
    // Use unified dynamic checkout system - map bookkeeping plan to service ID
    // For bookkeeping services, we'll use a special service ID that represents bookkeeping plans
    window.location.href = `/multi-step-checkout/bookkeeping-${planId}`;
  };

  const handleContactUs = () => {
    window.location.href = "tel:+1-800-123-4567";
  };

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Accounting &</span>
                <span className="block text-green-500">Bookkeeping Services</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-3xl">
                Professional accounting and bookkeeping services to keep your business finances organized, compliant, and optimized for growth. From daily transaction recording to comprehensive financial reporting.
              </p>
              <div className="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-200 h-16 w-64 rounded-lg"></div>
                ) : selectedPlans.length > 0 ? (
                  <button
                    onClick={() => handlePlanClick(selectedPlans[0].id)}
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
                      Get Accounting Services - ${formatPrice(selectedPlans[0].monthlyPrice)}/mo
                    </span>
                  </button>
                ) : (
                  <div className="bg-gray-200 h-16 w-64 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No plans available</span>
                  </div>
                )}
                
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Calculator className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Professional Accounting</h3>
                      <p className="text-lg mt-2 opacity-90">Expert Financial Management</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Service Card */}
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-green-500 overflow-hidden">
                  <img 
                    src={accountingConsultationImg}
                    alt="Professional accounting consultation"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Comprehensive Accounting Solutions
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Complete financial management services for businesses of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Receipt className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Bookkeeping</h3>
                <p className="text-gray-600 mb-4">Accurate recording of all business transactions and expenses.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Transaction categorization</li>
                  <li>• Expense tracking</li>
                  <li>• Invoice management</li>
                  <li>• Bank reconciliation</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <FileBarChart className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Reporting</h3>
                <p className="text-gray-600 mb-4">Comprehensive reports to understand your business performance.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Profit & Loss statements</li>
                  <li>• Balance sheets</li>
                  <li>• Cash flow reports</li>
                  <li>• Custom analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <PieChart className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tax Preparation</h3>
                <p className="text-gray-600 mb-4">Year-round tax planning and preparation services.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Quarterly tax estimates</li>
                  <li>• Tax return preparation</li>
                  <li>• Deduction optimization</li>
                  <li>• IRS correspondence</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Analysis</h3>
                <p className="text-gray-600 mb-4">Strategic insights to grow your business profitably.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Performance metrics</li>
                  <li>• Trend analysis</li>
                  <li>• Budget planning</li>
                  <li>• Growth forecasting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Banknote className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Accounts Payable/Receivable</h3>
                <p className="text-gray-600 mb-4">Manage cash flow with professional AR/AP services.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• Invoice processing</li>
                  <li>• Payment tracking</li>
                  <li>• Collections management</li>
                  <li>• Vendor payments</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance & Audit</h3>
                <p className="text-gray-600 mb-4">Ensure compliance with accounting standards and regulations.</p>
                <ul className="text-sm text-gray-600 text-left space-y-2">
                  <li>• GAAP compliance</li>
                  <li>• Audit preparation</li>
                  <li>• Internal controls</li>
                  <li>• Risk assessment</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dynamic Bookkeeping Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Bookkeeping Service Plans
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the perfect bookkeeping solution for your business needs
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white rounded-lg p-8 shadow-lg">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-3 mb-8">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                    <div className="h-12 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {selectedPlans.map((plan, index) => (
                <Card key={plan.id} className={`border-2 hover:shadow-xl transition-shadow ${plan.isPopular ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200'}`}>
                  <CardContent className="p-8">
                    {plan.isPopular && (
                      <div className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full text-center mb-4">
                        Most Popular
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                    <div className="text-4xl font-bold text-green-500 mb-6">
                      ${formatPrice(plan.monthlyPrice)}
                      <span className="text-lg font-normal text-gray-600">/month</span>
                    </div>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePlanClick(plan.id)}
                      style={{
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontWeight: '600',
                        padding: '16px 48px',
                        borderRadius: '8px',
                        fontSize: '18px',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s ease-in-out',
                        transform: 'translateY(0)',
                        width: '100%',
                        textDecoration: 'none',
                        textAlign: 'center' as const,
                        display: 'inline-block',
                        lineHeight: '1.5'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#059669';
                        (e.target as HTMLElement).style.color = '#ffffff';
                        (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#10b981';
                        (e.target as HTMLElement).style.color = '#ffffff';
                        (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ color: '#ffffff', fontWeight: '600' }}>
                        Get Started - ${formatPrice(plan.monthlyPrice)}/mo
                      </span>
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No bookkeeping plans available at this time.</p>
            </div>
          )}
        </div>
      </section>



      {/* Accounting & Bookkeeping Services Section */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#c3fad7' }}>
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-8 h-8 text-orange-300">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 left-20 w-6 h-6 text-pink-300">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="absolute top-1/2 right-20 w-4 h-4 text-purple-300">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              {/* Icon and Title */}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                    <circle cx="12" cy="4" r="1"/>
                  </svg>
                </div>
                <span className="text-lg font-semibold text-gray-700">Accounting & Bookkeeping</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Accounting and bookkeeping services for all types of businesses
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                We do it right...
              </p>
              
              <p className="text-gray-600 mb-12 leading-relaxed">
                Need an accountant for your business? Running a small business? Whether you are a sole proprietor, a non-USA company, or a large corporation, you can rely on us for full-service online accounting support.
              </p>
              
              {/* Service Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Data Entry */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Data Entry</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Daily, weekly, or monthly data entry from your bank accounts to your accounting software.
                  </p>
                </div>
                
                {/* Transaction Reconciliation */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7h-3V2h-2v2H8V2H6v2H3c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 18H3V9h14v13z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Transaction Reconciliation</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Reconciliation of all cleared transactions, open deposits, and open checks.
                  </p>
                </div>
                
                {/* Trial Balance Matching */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Trial Balance Matching</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Matching bank reconciliation balances to your trial balance for financial statement review.
                  </p>
                </div>
              </div>
              
              {/* Get Started Button */}
              {selectedPlans.length > 0 ? (
                <button
                  onClick={() => handlePlanClick(selectedPlans[0].id)}
                  style={{
                    backgroundColor: '#ea580c',
                    color: '#ffffff',
                    fontWeight: '600',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'all 0.2s ease-in-out',
                    transform: 'translateY(0)',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#c2410c';
                    (e.target as HTMLElement).style.color = '#ffffff';
                    (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.backgroundColor = '#ea580c';
                    (e.target as HTMLElement).style.color = '#ffffff';
                    (e.target as HTMLElement).style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                    (e.target as HTMLElement).style.transform = 'translateY(0)';
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: '600' }}>
                    Get Started
                  </span>
                </button>
              ) : (
                <button
                  style={{
                    backgroundColor: '#e5e7eb',
                    color: '#6b7280',
                    fontWeight: '600',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    border: 'none',
                    cursor: 'not-allowed',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                  disabled
                >
                  <span style={{ color: '#6b7280', fontWeight: '600' }}>
                    No Plans Available
                  </span>
                </button>
              )}
            </div>
            
            {/* Right Image */}
            <div className="mt-12 lg:mt-0 lg:ml-8">
              <div className="relative">
                <img 
                  src="/professional-business-analytics.jpg" 
                  alt="Professional businessman with financial data overlay showing business success metrics"
                  className="rounded-2xl shadow-2xl w-full h-auto"
                  style={{
                    minHeight: '400px',
                    objectFit: 'cover'
                  }}
                />
                {/* Decorative star */}
                <div className="absolute bottom-8 right-8 w-6 h-6 text-yellow-400">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
              </div>
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
              Common questions about accounting and bookkeeping services
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What's the difference between bookkeeping and accounting?</h3>
              <p className="text-gray-600">Bookkeeping involves recording daily financial transactions, while accounting includes analyzing, interpreting, and summarizing financial data to provide strategic insights and prepare tax returns.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">How often will I receive financial reports?</h3>
              <p className="text-gray-600">We provide monthly financial statements including Profit & Loss, Balance Sheet, and Cash Flow reports. Enterprise clients can receive weekly or custom reporting schedules.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Do you work with my existing accounting software?</h3>
              <p className="text-gray-600">Yes, we work with all major accounting platforms including QuickBooks, Xero, Wave, and others. We can also help you transition to a more suitable platform if needed.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Is my financial data secure?</h3>
              <p className="text-gray-600">Absolutely. We use bank-level encryption, secure cloud storage, and follow strict confidentiality protocols. All our team members are bonded and sign confidentiality agreements.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Can you help with tax preparation?</h3>
              <p className="text-gray-600">Yes, our accounting services include tax preparation support, quarterly estimates, and year-round tax planning to minimize your tax liability and ensure compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to Streamline Your Business Finances?
          </h2>
          <p className="text-xl text-white mb-8 leading-relaxed">
            Let our expert accountants handle your books while you focus on growing your business.
          </p>
          <div className="space-x-4">
            {selectedPlans.length > 0 ? (
              <button
                onClick={() => handlePlanClick(selectedPlans[0].id)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#10b981',
                  fontWeight: '600',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease-in-out',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#f3f4f6';
                  (e.target as HTMLElement).style.color = '#10b981';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.backgroundColor = '#ffffff';
                  (e.target as HTMLElement).style.color = '#10b981';
                }}
              >
                <span style={{ color: '#10b981', fontWeight: '600' }}>
                  Start Bookkeeping Services
                </span>
              </button>
            ) : (
              <button
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#6b7280',
                  fontWeight: '600',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  border: 'none',
                  cursor: 'not-allowed',
                  textDecoration: 'none',
                  display: 'inline-block'
                }}
                disabled
              >
                <span style={{ color: '#6b7280', fontWeight: '600' }}>
                  No Plans Available
                </span>
              </button>
            )}
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
                  <span>accounting@parafort.com</span>
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
              <h3 className="text-lg font-semibold mb-4">Accounting Services</h3>
              <div className="space-y-1">
                <p>Bookkeeping</p>
                <p>Financial Reporting</p>
                <p>Tax Preparation</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}