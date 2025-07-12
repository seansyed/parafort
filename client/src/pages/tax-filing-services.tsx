import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Calculator, DollarSign, Clock, CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
const taxConsultationImg = "/business-management-hero.jpg";

interface TaxService {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  category: string;
  entityTypes: string[];
}

export default function TaxFilingServices() {
  const [selectedService, setSelectedService] = useState<TaxService | null>(null);

  // Fetch tax services
  const { data: taxServices = [], isLoading } = useQuery({
    queryKey: ["/api/tax-services"],
    queryFn: () => apiRequest("GET", "/api/tax-services").then(res => res.json()),
  });

  const handleOrderService = (serviceId: number) => {
    window.location.href = `/multi-step-checkout/${serviceId}`;
  };

  const taxPlans = [
    {
      id: 1,
      name: "Individual Tax Return",
      price: 299,
      description: "Complete individual tax preparation and filing service",
      features: [
        "Form 1040 preparation",
        "Schedule A, B, C, D support", 
        "State tax return included",
        "E-filing service",
        "Tax planning consultation",
        "Audit protection available"
      ],
      entityTypes: ["Individual", "Sole Proprietorship"]
    },
    {
      id: 2,
      name: "Business Tax Return",
      price: 799,
      description: "Comprehensive business tax preparation for corporations and LLCs",
      features: [
        "Form 1120/1120S preparation",
        "Schedule K-1 preparation",
        "Multi-state filing support",
        "Quarterly estimated payments",
        "Tax strategy consultation",
        "Year-round support"
      ],
      entityTypes: ["LLC", "S-Corp", "C-Corp"]
    },
    {
      id: 3,
      name: "Tax Planning & Strategy",
      price: 499,
      description: "Proactive tax planning to minimize your tax liability",
      features: [
        "Tax projection analysis",
        "Strategic planning session",
        "Quarterly check-ins",
        "Entity structure optimization",
        "Deduction maximization",
        "Multi-year planning"
      ],
      entityTypes: ["All Entity Types"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl font-bold text-white mb-6">Professional Tax Filing Services</h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Expert tax preparation and strategic planning to maximize your savings and ensure compliance
              </p>
              <div className="space-x-4">
                <button
                  onClick={() => window.location.href = "/multi-step-checkout/3"}
                  style={{
                    backgroundColor: 'white',
                    color: '#059669',
                    fontWeight: '600',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  Start Tax Filing
                </button>
                <button
                  onClick={() => window.location.href = "tel:844-444-5411"}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontWeight: '600',
                    padding: '16px 32px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    border: '2px solid white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#059669';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }}
                >
                  Get Quote
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 mt-12 lg:mt-0">
              <div className="relative space-y-6">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-[#27884b] to-[#1a5f33] rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Calculator className="h-20 w-20 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold">Tax Preparation</h3>
                      <p className="text-lg mt-2 opacity-90">Expert Service</p>
                    </div>
                  </div>
                </div>
                
                {/* Tax Consultation Card */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Tax Services</TabsTrigger>
            <TabsTrigger value="deadlines">Tax Calendar</TabsTrigger>
            <TabsTrigger value="resources">Tax Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-8">
            {/* Service Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {taxPlans.map((plan) => (
                <Card key={plan.id} className="relative border-2 border-gray-200 hover:border-green-300 transition-colors duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">${plan.price}</div>
                        <p className="text-sm text-gray-500">per filing</p>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-300 mb-3">
                      {plan.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1">
                      {plan.entityTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleOrderService(plan.id)}
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
                        (e.target as HTMLElement).style.backgroundColor = '#059669';
                        (e.target as HTMLElement).style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#10b981';
                        (e.target as HTMLElement).style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      Order Tax Filing Service
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tax Calendar Tab */}
          <TabsContent value="deadlines" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  2025 Tax Calendar & Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      date: "January 31, 2025",
                      deadline: "Form W-2 & 1099 Distribution",
                      description: "Employers must provide W-2s to employees",
                      status: "upcoming"
                    },
                    {
                      date: "March 17, 2025",
                      deadline: "Corporate Tax Returns (C-Corp)",
                      description: "Form 1120 due for calendar-year corporations",
                      status: "upcoming"
                    },
                    {
                      date: "April 15, 2025",
                      deadline: "Individual Tax Returns",
                      description: "Form 1040 due for individual taxpayers",
                      status: "critical"
                    },
                    {
                      date: "April 15, 2025",
                      deadline: "Q1 Estimated Tax Payments",
                      description: "First quarter estimated tax payments due",
                      status: "critical"
                    },
                    {
                      date: "June 16, 2025",
                      deadline: "Q2 Estimated Tax Payments",
                      description: "Second quarter estimated tax payments due",
                      status: "upcoming"
                    },
                    {
                      date: "September 15, 2025",
                      deadline: "Q3 Estimated Tax Payments",
                      description: "Third quarter estimated tax payments due",
                      status: "upcoming"
                    }
                  ].map((item, index) => (
                    <Card key={index} className={`border-l-4 ${item.status === 'critical' ? 'border-l-red-500' : 'border-l-green-500'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{item.deadline}</h3>
                          {item.status === 'critical' ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{item.date}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tax Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    Tax Forms & Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Form 1040 - Individual Income Tax Return",
                      "Form 1120 - Corporation Income Tax Return",
                      "Form 1120S - S Corporation Income Tax Return",
                      "Schedule C - Profit or Loss from Business",
                      "Schedule K-1 - Partner's Share of Income",
                      "Form 941 - Quarterly Federal Tax Return"
                    ].map((form, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{form}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-green-500" />
                    Tax Calculators & Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Tax Withholding Calculator",
                      "Estimated Tax Payment Calculator",
                      "Self-Employment Tax Calculator",
                      "Business Expense Tracker",
                      "Mileage Log Calculator",
                      "Home Office Deduction Calculator"
                    ].map((tool, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <Calculator className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tool}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Tax Deductions Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Business Equipment & Supplies",
                      "Home Office Expenses",
                      "Travel & Transportation",
                      "Professional Development",
                      "Health Insurance Premiums",
                      "Retirement Contributions"
                    ].map((deduction, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{deduction}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Tax Planning Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      "Maximize retirement contributions",
                      "Time income and expenses strategically",
                      "Consider entity structure optimization",
                      "Track business expenses throughout the year",
                      "Plan for estimated tax payments",
                      "Review withholdings quarterly"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <TrendingUp className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}