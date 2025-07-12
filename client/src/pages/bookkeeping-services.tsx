import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

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
}

interface BusinessEntity {
  id: string;
  legalName: string;
  entityType: string;
  state: string;
  status: string;
}

export default function BookkeepingServices() {
  const [, setLocation] = useLocation();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch bookkeeping plans
  const { data: bookkeepingPlans = [] } = useQuery({
    queryKey: ["/api/bookkeeping-plans"],
    retry: false,
  });

  // Fetch user's business entities
  const { data: businessEntities = [] } = useQuery({
    queryKey: ["/api/business-entities"],
    retry: false,
  });

  const handleSubscribe = (plan: BookkeepingPlan) => {
    setIsLoading(true);
    // Navigate to checkout with plan details
    setLocation(`/checkout?service=bookkeeping&plan=${plan.id}&billing=${billingCycle}`);
  };

  return (
    <>
      {/* Header Section */}
      <div className="min-h-screen bg-gray-50 pt-36">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Bookkeeping Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert bookkeeping and accounting solutions tailored for small and medium businesses. 
              Stay organized, compliant, and focused on growth.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 bg-white rounded-lg p-2 shadow-sm border">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          {/* Subscription Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookkeepingPlans
              .filter((plan: BookkeepingPlan) => plan.isActive)
              .sort((a: BookkeepingPlan, b: BookkeepingPlan) => a.monthlyPrice - b.monthlyPrice)
              .map((plan: BookkeepingPlan) => {
                const isYearly = billingCycle === 'yearly';
                const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
                const displayPrice = isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
                
                return (
                  <div 
                    key={plan.id}
                    className={`relative rounded-lg border ${
                      plan.isPopular 
                        ? 'border-green-500 ring-2 ring-green-500 ring-opacity-50' 
                        : 'border-gray-200'
                    } bg-white p-8 shadow-sm`}
                  >
                    {plan.isPopular && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="inline-flex rounded-full bg-green-500 px-4 py-1 text-sm font-semibold text-white">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="mt-4 text-gray-600">{plan.description}</p>
                      
                      <div className="mt-6">
                        <span className="text-4xl font-bold text-gray-900">
                          ${displayPrice}
                        </span>
                        <span className="text-gray-600">/month</span>
                        {isYearly && (
                          <p className="text-sm text-green-600 mt-1">
                            Billed annually (${plan.yearlyPrice}/year)
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-sm text-gray-600">
                          Up to {plan.documentsLimit} documents per month
                        </p>
                      </div>
                    </div>
                    
                    <ul className="mt-8 space-y-3">
                      {plan.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-3 text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8">
                      <button
                        onClick={() => handleSubscribe(plan)}
                        disabled={isLoading}
                        style={{
                          backgroundColor: '#10b981',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '8px',
                          border: 'none',
                          width: '100%',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#059669';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#10b981';
                        }}
                      >
                        {isLoading ? 'Processing...' : 'Get Started'}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Business Entities Section */}
          {businessEntities.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Business Entities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businessEntities.map((entity: BusinessEntity) => (
                  <div key={entity.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900">{entity.legalName}</h3>
                    <p className="text-sm text-gray-600">{entity.entityType} • {entity.state}</p>
                    <p className={`text-sm mt-2 ${
                      entity.status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {entity.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
            <div className="lg:col-span-7 lg:text-left text-center">
              <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                <span className="block">Streamline Your</span>
                <span className="block text-green-600">Financial Operations</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Professional bookkeeping services designed for growing businesses. 
                From basic record keeping to comprehensive financial management, 
                we help you stay organized and compliant.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }}
                  onClick={() => setLocation('/contact')}
                >
                  Start Your Service
                </button>
                <button
                  style={{
                    backgroundColor: 'transparent',
                    color: '#10b981',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    border: '2px solid #10b981',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#10b981';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#10b981';
                  }}
                  onClick={() => setLocation('/consultation')}
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative">
                <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden shadow-xl">
                  <img
                    className="object-cover w-full h-full"
                    src="/bookkeeping-hero.jpg"
                    alt="Professional bookkeeping services"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'block';
                    }}
                  />
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg" style={{display: 'none'}}>
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-white p-8">
                        <svg className="mx-auto h-20 w-20 mb-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-xl font-semibold">Financial Excellence</h3>
                        <p className="mt-2">Professional bookkeeping solutions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Bookkeeping Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to keep your finances organized and compliant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Monthly Financial Reports",
                description: "Detailed profit & loss statements, balance sheets, and cash flow reports delivered monthly",
                icon: "📊"
              },
              {
                title: "Transaction Categorization",
                description: "Accurate categorization of all business transactions for clear financial insights",
                icon: "📋"
              },
              {
                title: "Bank Reconciliation",
                description: "Monthly bank account reconciliation to ensure accuracy and catch discrepancies",
                icon: "🏦"
              },
              {
                title: "Accounts Payable/Receivable",
                description: "Manage vendor bills and customer invoices with professional tracking systems",
                icon: "💰"
              },
              {
                title: "Tax Preparation Support",
                description: "Organized records and documentation to streamline your tax filing process",
                icon: "📄"
              },
              {
                title: "Dedicated Support Team",
                description: "Get personalized support from your dedicated bookkeeping team",
                icon: "👥"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}