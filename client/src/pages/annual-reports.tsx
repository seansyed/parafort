import LeftNavigation from "@/components/left-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  CalendarDays, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Shield,
  Gavel,
  XCircle,
  DollarSign,
  Bell,
  MapPin
} from "lucide-react";

export default function AnnualReportsPage() {
  const [selectedState, setSelectedState] = useState<string>("CA");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("LLC");
  const [, setLocation] = useLocation();

  // Fetch services data
  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/services/all"],
  });

  // Find Annual Report service
  const annualReportService = Array.isArray(services) 
    ? services.find((service: any) => service.name === "Annual Report Filing")
    : null;

  const handleFileAnnualReport = () => {
    if (annualReportService) {
      setLocation(`/service-purchase/${annualReportService.id}`);
    }
  };

  // Entity type-specific fee modifiers
  const entityTypeFees = {
    "LLC": { multiplier: 1, description: "Limited Liability Company" },
    "Corporation": { multiplier: 1.2, description: "C-Corporation" },
    "Non-Profit": { multiplier: 0.8, description: "Non-Profit Corporation" },
    "Professional Corporation": { multiplier: 1.3, description: "Professional Corporation (PC)" }
  };

  // State-specific annual report due dates and requirements
  const stateRequirements = {
    "AL": { dueDate: "By April 1st", fee: "$25", interval: "Annual" },
    "AK": { dueDate: "By January 2nd", fee: "$50", interval: "Biennial" },
    "AZ": { dueDate: "No filing required", fee: "$0", interval: "None" },
    "AR": { dueDate: "By May 1st", fee: "$150", interval: "Annual" },
    "CA": { dueDate: "Within 90 days of incorporation anniversary", fee: "$25", interval: "Biennial" },
    "CO": { dueDate: "Anniversary month of incorporation", fee: "$10", interval: "Annual" },
    "CT": { dueDate: "Anniversary month of incorporation", fee: "$80", interval: "Annual" },
    "DE": { dueDate: "By March 1st", fee: "$50", interval: "Annual" },
    "FL": { dueDate: "By May 1st", fee: "$150", interval: "Annual" },
    "GA": { dueDate: "By April 1st", fee: "$50", interval: "Annual" },
    "HI": { dueDate: "Anniversary month of incorporation", fee: "$25", interval: "Annual" },
    "ID": { dueDate: "Anniversary month of incorporation", fee: "$30", interval: "Annual" },
    "IL": { dueDate: "Anniversary month of incorporation", fee: "$75", interval: "Annual" },
    "IN": { dueDate: "Anniversary month of incorporation", fee: "$50", interval: "Biennial" },
    "IA": { dueDate: "Between January 1st and April 1st", fee: "$60", interval: "Biennial" },
    "KS": { dueDate: "By July 15th", fee: "$55", interval: "Annual" },
    "KY": { dueDate: "By June 30th", fee: "$15", interval: "Annual" },
    "LA": { dueDate: "Anniversary month of incorporation", fee: "$35", interval: "Annual" },
    "ME": { dueDate: "By June 1st", fee: "$85", interval: "Annual" },
    "MD": { dueDate: "By April 15th", fee: "$100", interval: "Annual" },
    "MA": { dueDate: "Anniversary month of incorporation", fee: "$125", interval: "Annual" },
    "MI": { dueDate: "By May 15th", fee: "$25", interval: "Annual" },
    "MN": { dueDate: "By December 31st", fee: "$25", interval: "Annual" },
    "MS": { dueDate: "Anniversary month of incorporation", fee: "$25", interval: "Annual" },
    "MO": { dueDate: "Anniversary month of incorporation", fee: "$45", interval: "Annual" },
    "MT": { dueDate: "By April 15th", fee: "$20", interval: "Annual" },
    "NE": { dueDate: "By September 1st", fee: "$26", interval: "Biennial" },
    "NV": { dueDate: "Anniversary month of incorporation", fee: "$350", interval: "Annual" },
    "NH": { dueDate: "By April 1st", fee: "$100", interval: "Annual" },
    "NJ": { dueDate: "Anniversary month of incorporation", fee: "$50", interval: "Annual" },
    "NM": { dueDate: "By March 15th", fee: "$25", interval: "Annual" },
    "NY": { dueDate: "Anniversary month of incorporation", fee: "$9", interval: "Biennial" },
    "NC": { dueDate: "Anniversary month of incorporation", fee: "$20", interval: "Annual" },
    "ND": { dueDate: "By November 15th", fee: "$25", interval: "Annual" },
    "OH": { dueDate: "Anniversary month of incorporation", fee: "$25", interval: "Annual" },
    "OK": { dueDate: "Anniversary month of incorporation", fee: "$25", interval: "Annual" },
    "OR": { dueDate: "Anniversary month of incorporation", fee: "$100", interval: "Annual" },
    "PA": { dueDate: "By April 15th", fee: "$70", interval: "Annual" },
    "RI": { dueDate: "Anniversary month of incorporation", fee: "$50", interval: "Annual" },
    "SC": { dueDate: "Anniversary month of incorporation", fee: "$25", interval: "Annual" },
    "SD": { dueDate: "Anniversary month of incorporation", fee: "$25", interval: "Annual" },
    "TN": { dueDate: "Anniversary month of incorporation", fee: "$20", interval: "Annual" },
    "TX": { dueDate: "Anniversary month of incorporation", fee: "$0", interval: "Annual" },
    "UT": { dueDate: "Anniversary month of incorporation", fee: "$18", interval: "Annual" },
    "VT": { dueDate: "Anniversary month of incorporation", fee: "$35", interval: "Annual" },
    "VA": { dueDate: "Anniversary month of incorporation", fee: "$50", interval: "Annual" },
    "WA": { dueDate: "Anniversary month of incorporation", fee: "$60", interval: "Annual" },
    "WV": { dueDate: "By June 30th", fee: "$25", interval: "Annual" },
    "WI": { dueDate: "Anniversary quarter of incorporation", fee: "$25", interval: "Annual" },
    "WY": { dueDate: "Anniversary month of incorporation", fee: "$52", interval: "Annual" }
  };

  const currentRequirement = stateRequirements[selectedState as keyof typeof stateRequirements];
  const currentEntityType = entityTypeFees[selectedEntityType as keyof typeof entityTypeFees];
  
  // Calculate adjusted fee based on entity type
  const calculateAdjustedFee = (baseFee: string, entityType: string) => {
    const numericFee = parseInt(baseFee.replace(/[^0-9]/g, ''));
    const multiplier = entityTypeFees[entityType as keyof typeof entityTypeFees]?.multiplier || 1;
    const adjustedFee = Math.round(numericFee * multiplier);
    return `$${adjustedFee}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="ml-80 pt-24 min-h-screen">
        <div className="max-w-none pt-8 pb-8 px-8 space-y-6">
            
            {/* Hero/Introduction Section */}
            <div className="text-center space-y-4 scroll-mt-24">
              <h1 className="text-4xl font-bold text-gray-900">
                Stay Compliant Annually: Effortless Annual Report Filing
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                An Annual Report (also called Statement of Information or Annual Registration) is a mandatory state filing 
                for most business entities including LLCs and Corporations. This annual requirement keeps your business 
                information updated with the state and maintains your good standing status, ensuring you can continue 
                operating legally and accessing essential state services.
              </p>
            </div>

            {/* Why File Your Annual Report */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-green-500" />
                  Why Annual Reports Are Crucial for Your Business
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Legal Obligation</h4>
                      <p className="text-gray-600">State-mandated requirement for maintaining business registration</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Maintain Good Standing</h4>
                      <p className="text-gray-600">Essential for legal operation and accessing state services</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Avoid Penalties</h4>
                      <p className="text-gray-600">Prevents fines, late fees, and potential administrative dissolution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Transparency</h4>
                      <p className="text-gray-600">Keeps your public business record accurate and up-to-date</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* State-Specific Due Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Annual Report Requirements by State
                </CardTitle>
                <CardDescription>
                  Select your state to see specific due dates and filing requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="state-select" className="text-sm font-medium text-gray-700">
                      Select State:
                    </label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(stateRequirements).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label htmlFor="entity-select" className="text-sm font-medium text-gray-700">
                      Entity Type:
                    </label>
                    <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(entityTypeFees).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {currentRequirement && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-blue-900">
                      {selectedState} Annual Report Requirements - {currentEntityType?.description}
                    </h4>
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-800">Due Date</div>
                          <div className="text-blue-700">{currentRequirement.dueDate}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-800">Base State Fee</div>
                          <div className="text-blue-700">{currentRequirement.fee}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">Entity Fee</div>
                          <div className="text-green-700">{calculateAdjustedFee(currentRequirement.fee, selectedEntityType)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-blue-800">Filing Frequency</div>
                          <div className="text-blue-700">{currentRequirement.interval}</div>
                        </div>
                      </div>
                    </div>
                    {currentEntityType?.multiplier !== 1 && (
                      <div className="bg-green-100 border border-green-200 rounded p-2 text-xs text-green-800">
                        <strong>Note:</strong> {selectedEntityType} fees are adjusted by {currentEntityType.multiplier}x the base state fee
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What's Included & Key Deadlines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  What Your Annual Report Includes & Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    What It Contains
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      Current business name and any assumed names
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      Principal business address and mailing address
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      Registered agent name and address
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      Names and addresses of officers, directors, or members
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                      Nature of business and principal business activities
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Key Deadlines
                  </h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-700">
                      <strong>Important:</strong> Annual report deadlines are state-specific and typically occur annually. 
                      Many states tie the deadline to your business formation date or require filing during a specific month. 
                      Missing these deadlines can result in serious consequences including fines and loss of good standing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Avoid Penalties */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  The Consequences of Missing Your Annual Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Late Fees and Accumulating Penalties</h4>
                      <p className="text-red-700">State-imposed fines that increase the longer you wait to file</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Loss of Good Standing Status</h4>
                      <p className="text-red-700">Your business becomes non-compliant with state requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Inability to Legally Transact Business</h4>
                      <p className="text-red-700">Loss of legal authority to conduct business operations in the state</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Administrative Dissolution by the State</h4>
                      <p className="text-red-700">State may involuntarily dissolve your business entity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800">Personal Liability Exposure</h4>
                      <p className="text-red-700">Potential personal liability for business debts and legal actions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Annual Report Filing Service */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Simplify Your Annual Compliance With Our Service
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Automated Reminders</h4>
                      <p className="text-gray-600">Never miss a deadline with timely notifications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Expert Preparation</h4>
                      <p className="text-gray-600">Ensures accuracy and compliance with state-specific requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Timely Filing</h4>
                      <p className="text-gray-600">We file your report on time, every time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Maintain Good Standing</h4>
                      <p className="text-gray-600">Helps keep your business compliant and active</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Peace of Mind</h4>
                      <p className="text-gray-600">Focus on your business, not paperwork</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action / Pricing */}
            {servicesLoading ? (
              <Card className="border-green-500 bg-green-50">
                <CardContent className="text-center py-8">
                  <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading service information...</p>
                </CardContent>
              </Card>
            ) : annualReportService ? (
              <Card className="border-green-500 bg-green-50">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-gray-900">Annual Report Filing Pricing</CardTitle>
                  <CardDescription className="text-lg">
                    Professional filing service with deadline reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="bg-white rounded-lg border-2 border-green-200 p-6 max-w-md mx-auto">
                    <div className="space-y-2">
                      <div className="text-4xl font-bold text-gray-900">${annualReportService.oneTimePrice}</div>
                      <p className="text-lg text-gray-600">{annualReportService.name}</p>
                      <p className="text-sm text-gray-500">+ State filing fees</p>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-800">Included Services:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              State-specific form preparation
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Professional filing and submission
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Deadline tracking and reminders
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Filing confirmation receipt
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-left">
                          <h4 className="font-semibold text-gray-800">Additional Benefits:</h4>
                          <div className="space-y-1 text-gray-600">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Compliance monitoring
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Error-free guarantee
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Customer support included
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                              </svg>
                              Multi-state filing available
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleFileAnnualReport}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 32px',
                        fontSize: '18px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginTop: '24px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#059669';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = '#10b981';
                      }}
                    >
                      Start Your Annual Report Filing
                    </button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-red-500 bg-red-50">
                <CardContent className="text-center py-8">
                  <p className="text-red-600">Annual Report service information is currently unavailable. Please try again later.</p>
                </CardContent>
              </Card>
            )}

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is an Annual Report the same as a tax return?</AccordionTrigger>
                    <AccordionContent>
                      No, an Annual Report and a tax return are completely different filings. An Annual Report is filed with your state's Secretary of State (or equivalent agency) to update your business information and maintain good standing. A tax return is filed with the IRS and state tax agencies to report income and pay taxes. Both are required, but they serve different purposes and are filed with different agencies.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What information do I need to provide for my Annual Report?</AccordionTrigger>
                    <AccordionContent>
                      You'll typically need current information about your business including: current business name and any trade names, principal business address, mailing address, registered agent information, names and addresses of officers/directors/members, and a description of your business activities. The exact requirements vary by state, but we'll guide you through gathering all necessary information and ensure everything is accurate before filing.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What if my business information has changed?</AccordionTrigger>
                    <AccordionContent>
                      The Annual Report is the perfect opportunity to update changed information with the state. This includes changes to your business address, registered agent, officers or directors, business activities, or other key details. Some states also require separate change filings when major changes occur, but the Annual Report ensures your state records reflect your current business status. We'll help you identify what information needs updating and ensure all changes are properly reported.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

        </div>
      </div>
    </div>
  );
}