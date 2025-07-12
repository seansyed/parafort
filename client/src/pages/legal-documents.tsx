import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Download, 
  CheckCircle, 
  MessageSquare,
  Building,
  Users,
  Shield,
  Briefcase,
  Scale,
  FileCheck
} from "lucide-react";

export default function LegalDocuments() {
  const [typedText, setTypedText] = useState("");
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({});
  
  const fullText = "Legal Document Library";

  // Fetch subscription plans
  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/subscription-plans"],
  });
  
  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout;
    
    const typeText = () => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
        if (index <= fullText.length) {
          timer = setTimeout(typeText, 100);
        }
      }
    };
    
    typeText();
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

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
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const { data: serviceData, isLoading: serviceLoading } = useQuery({
    queryKey: ['/api/services/9'],
    retry: false,
  });

  const documentCategories = [
    {
      title: "Business Formation",
      description: "Essential documents for starting your business",
      icon: Building,
      documents: [
        { name: "Articles of Incorporation", type: "Corporation", price: "Free" },
        { name: "Operating Agreement", type: "LLC", price: "Free" },
        { name: "Bylaws Template", type: "Corporation", price: "Free" },
        { name: "Partnership Agreement", type: "Partnership", price: "Free" }
      ]
    },
    {
      title: "Employment & HR",
      description: "Manage your workforce legally and efficiently",
      icon: Users,
      documents: [
        { name: "Employment Agreement", type: "Contract", price: "Free" },
        { name: "Independent Contractor Agreement", type: "Contract", price: "Free" },
        { name: "Employee Handbook Template", type: "Policy", price: "Free" },
        { name: "Non-Disclosure Agreement", type: "Legal", price: "Free" }
      ]
    },
    {
      title: "Contracts & Agreements",
      description: "Protect your business relationships",
      icon: FileCheck,
      documents: [
        { name: "Service Agreement", type: "Contract", price: "Free" },
        { name: "Purchase Agreement", type: "Contract", price: "Free" },
        { name: "Lease Agreement", type: "Real Estate", price: "Free" },
        { name: "Vendor Agreement", type: "Contract", price: "Free" }
      ]
    }
  ];

  const legalDocuments = [
    {
      name: "Non-Disclosure Agreement (NDA)",
      description: "Protect confidential information and trade secrets",
      category: "Legal Protection",
      features: [
        "Mutual or one-way protection",
        "Customizable terms and duration",
        "Industry-specific templates",
        "Attorney-reviewed content"
      ]
    },
    {
      name: "Operating Agreement",
      description: "Define LLC structure, ownership, and operations",
      category: "Business Formation", 
      features: [
        "Multi-member LLC support",
        "Profit/loss distribution",
        "Management structure",
        "State-specific compliance"
      ]
    },
    {
      name: "Employment Contract",
      description: "Standardized agreements for hiring employees",
      category: "HR & Employment",
      features: [
        "At-will employment clauses",
        "Compensation structures",
        "Benefits and policies",
        "Termination procedures"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechStart Solutions",
      content: "The legal document templates saved us thousands in attorney fees. Professional quality and easy to customize.",
      rating: 5
    },
    {
      name: "Michael Chen", 
      company: "GreenLeaf Consulting",
      content: "Having access to up-to-date legal documents gives me peace of mind. The templates are comprehensive and well-organized.",
      rating: 5
    },
    {
      name: "Maria Rodriguez",
      company: "Rodriguez Consulting",
      content: "As a small business owner, having access to professional legal documents is invaluable. Highly recommend ParaFort.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#27884b] overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">{typedText}</span>
              <span className="block text-3xl md:text-4xl text-green-400 mt-4 font-light">
                Professional Templates at Your Fingertips
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Access attorney-reviewed legal document templates designed for modern businesses. 
              Download, customize, and protect your business interests.
            </p>

            <div className="flex justify-center">
              <button
                className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-white hover:border-green-600 flex items-center justify-center"
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
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => window.location.href = '/multi-step-checkout/9'}
              >
                <FileText className="w-6 h-6 mr-3" />
                Browse Document Library
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Documents Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured <span className="gradient-text">Documents</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Most popular legal document templates trusted by thousands of businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalDocuments.map((doc, index) => (
              <div key={index} className="group">
                <Card className="hover-lift h-full border-0 shadow-lg hover:shadow-2xl bg-white overflow-hidden relative">
                  {/* Popular badge */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-gradient-to-r from-[#27884b] to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#27884b]/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative z-10 pb-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300 animate-float">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-500 transition-colors duration-300 mb-2">
                      {doc.name}
                    </CardTitle>
                    <p className="text-gray-600 leading-relaxed">{doc.description}</p>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 pt-0">
                    <ul className="space-y-3 mb-8">
                      {doc.features.map((feature, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-center text-sm text-gray-700 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                          style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documents Plan Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Documents <span className="gradient-text">Plan</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get instant access to professional legal documents with our Documents plan
            </p>
            
            {/* Gold Plan Notification */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-800">
                      <span className="font-bold">💎 Good News!</span> The Documents Plan is included in our Gold Plan subscription.
                      <span className="block mt-1 text-yellow-700">
                        Upgrade to Gold for unlimited access to all legal documents plus additional premium features.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gold Plan Card */}
          {plansLoading ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {(() => {
                const goldPlan = Array.isArray(subscriptionPlans) 
                  ? subscriptionPlans.find(plan => plan.name === 'Gold')
                  : null;
                
                if (!goldPlan) {
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
                      <p className="text-gray-600">Gold Plan not available</p>
                    </div>
                  );
                }

                const features = Array.isArray(goldPlan.features) ? goldPlan.features : [];
                
                return (
                  <div className="bg-white border border-green-500 rounded-lg shadow-lg p-6 relative">
                    {/* Premium Badge */}
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ✨ Includes Documents Access
                      </span>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6 pt-4">
                      <h3 className="text-3xl font-bold text-gray-900 mb-2">{goldPlan.name} Plan</h3>
                      <p className="text-gray-600">{goldPlan.description}</p>
                    </div>

                    {/* Pricing */}
                    <div className="text-center mb-8">
                      <div className="text-5xl font-bold text-green-500 mb-2">
                        ${parseFloat(goldPlan.yearlyPrice || '0').toFixed(0)}
                        <span className="text-lg font-normal text-gray-600">/year</span>
                      </div>
                      <p className="text-gray-500">Includes unlimited legal document access</p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {features.map((feature: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                      
                      {/* Always show documents feature */}
                      <div className="flex items-center bg-green-50 p-3 rounded-lg border border-green-200">
                        <FileText className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-green-700 font-medium">Unlimited Legal Document Library Access</span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="text-center">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-xl hover:shadow-2xl w-full"
                        style={{
                          backgroundColor: '#059669',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          padding: '16px 32px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => window.location.href = '/subscription-plans'}
                      >
                        Upgrade to Gold Plan
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Document Categories */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4">
          <div 
            id="categories-title"
            data-animate
            className={`text-center mb-16 transform transition-all duration-800 ${
              isVisible['categories-title'] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Document <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Organized by business needs and legal requirements for easy navigation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {documentCategories.map((category, index) => (
              <div
                key={index}
                id={`category-${index}`}
                data-animate
                className={`transform transition-all duration-700 ${
                  isVisible[`category-${index}`] 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <Card className="hover-lift group h-full border-0 shadow-lg hover:shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#27884b]/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-center mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#27884b] to-[#FF8C42] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 animate-float">
                        <category.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="ml-4">
                        <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-green-500 transition-colors duration-300">
                          {category.title}
                        </CardTitle>
                        <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    <div className="space-y-4 mb-8">
                      {category.documents.map((doc, idx) => (
                        <div 
                          key={idx} 
                          className="border border-gray-200 rounded-lg p-4 hover:border-green-500/30 hover:bg-gray-50/50 transition-all duration-300 transform hover:translate-x-1"
                          style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                              {doc.name}
                            </h4>
                            <span className="bg-green-500 text-white font-bold text-sm px-3 py-1 rounded-md shadow-sm">
                              {doc.price}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{doc.type}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative py-20 bg-gradient-to-br from-[#27884b] via-green-700 to-green-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Access Professional Legal Documents?
          </h2>
          <p className="text-xl text-green-100 mb-12 leading-relaxed">
            Join thousands of businesses who trust ParaFort for their legal document needs
          </p>
          
          <div className="flex justify-center">
            <button
              className="bg-white text-green-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-white hover:border-green-600 flex items-center justify-center"
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
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => window.location.href = '/multi-step-checkout/9'}
            >
              <FileText className="w-5 h-5 mr-2" />
              Browse All Documents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}