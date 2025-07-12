import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Search, FileText, Calculator, Shield, CreditCard, Archive, TrendingUp, Lock, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

interface UserSubscription {
  id: string;
  planName: string;
  planLevel: 'free' | 'silver' | 'gold';
}

export default function BusinessTools() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("name-checker");

  // Get user subscription data
  const { data: userSubscription, isLoading: subscriptionLoading } = useQuery({
    queryKey: ["/api/user-subscription"],
    enabled: isAuthenticated,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || subscriptionLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const planLevel = userSubscription?.planLevel || 'free';

  const hasAccess = (requiredLevel: string | string[]): boolean => {
    const levels = ['free', 'silver', 'gold'];
    const userLevelIndex = levels.indexOf(planLevel);
    
    if (Array.isArray(requiredLevel)) {
      return requiredLevel.some(level => levels.indexOf(level) <= userLevelIndex);
    }
    
    return levels.indexOf(requiredLevel) <= userLevelIndex;
  };

  const UpgradePrompt = ({ requiredPlan }: { requiredPlan: string }) => (
    <div className="text-center py-8">
      <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {requiredPlan === 'gold' ? 'Gold Plan Required' : 'Silver or Gold Plan Required'}
      </h3>
      <p className="text-gray-600 mb-4">
        Upgrade your subscription to access this premium business tool.
      </p>
      <Button className="bg-green-500 hover:bg-green-600">
        Upgrade to {requiredPlan === 'gold' ? 'Gold' : 'Silver'} Plan
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Business Tools Suite
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive tools to help you manage and grow your business
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="mr-2 bg-[#ff5a00]">
              Current Plan: {userSubscription?.planName || 'Free'}
            </Badge>
          </div>
        </div>

        {/* Tools Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="name-checker">Name Check</TabsTrigger>
            <TabsTrigger value="compliance-calendar">Calendar</TabsTrigger>
            <TabsTrigger value="tax-calculator">Tax Calc</TabsTrigger>
            <TabsTrigger value="boir-checker">BOIR Check</TabsTrigger>
            <TabsTrigger value="operating-agreement">Operating</TabsTrigger>
            <TabsTrigger value="bylaws-generator">Bylaws</TabsTrigger>
            <TabsTrigger value="expense-categorizer">Expenses</TabsTrigger>
            <TabsTrigger value="credit-builder">Credit</TabsTrigger>
          </TabsList>

          {/* Business Name Availability Checker */}
          <TabsContent value="name-checker">
            <BusinessNameChecker />
          </TabsContent>

          {/* Compliance Calendar Generator */}
          <TabsContent value="compliance-calendar">
            <ComplianceCalendar />
          </TabsContent>

          {/* Tax Impact Calculator */}
          <TabsContent value="tax-calculator">
            <TaxImpactCalculator />
          </TabsContent>

          {/* BOIR Compliance Checker */}
          <TabsContent value="boir-checker">
            {hasAccess(['silver', 'gold']) ? (
              <BoirComplianceChecker />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <UpgradePrompt requiredPlan="silver" />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Operating Agreement Builder */}
          <TabsContent value="operating-agreement">
            {hasAccess('gold') ? (
              <OperatingAgreementBuilder />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Operating Agreement Builder
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Gold Plan: Free • Other Plans: $139/year
                    </p>
                    <div className="space-x-2">
                      <Button className="bg-green-500 hover:bg-green-600">
                        Upgrade to Gold
                      </Button>
                      <Button variant="outline">
                        Purchase for $139/year
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Corporate Bylaws Generator */}
          <TabsContent value="bylaws-generator">
            {hasAccess('gold') ? (
              <BylawsGenerator />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Corporate Bylaws Generator
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Gold Plan: Free • Other Plans: $139/year
                    </p>
                    <div className="space-x-2">
                      <Button className="bg-green-500 hover:bg-green-600">
                        Upgrade to Gold
                      </Button>
                      <Button variant="outline">
                        Purchase for $139/year
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Business Expense Categorizer */}
          <TabsContent value="expense-categorizer">
            {hasAccess('gold') ? (
              <ExpenseCategorizer />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <UpgradePrompt requiredPlan="gold" />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Business Credit Building Guide */}
          <TabsContent value="credit-builder">
            {hasAccess('gold') ? (
              <CreditBuildingGuide />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <UpgradePrompt requiredPlan="gold" />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Individual Tool Components
function BusinessNameChecker() {
  const [businessName, setBusinessName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [entityType, setEntityType] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const handleNameCheck = async () => {
    if (!businessName || !selectedState || !entityType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to check name availability.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      const response = await apiRequest("POST", "/api/check-business-name", {
        businessName,
        state: selectedState,
        entityType
      });
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check business name availability.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-blue-500" />
          Business Name Availability Checker
        </CardTitle>
        <CardDescription>
          Check if your desired business name is available for registration in your state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="business-name">Business Name</Label>
            <Input
              id="business-name"
              placeholder="Enter business name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="entity-type">Entity Type</Label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LLC">LLC</SelectItem>
                <SelectItem value="Corporation">Corporation</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Nonprofit">Nonprofit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          onClick={handleNameCheck} 
          disabled={isChecking}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          {isChecking ? "Checking..." : "Check Name Availability"}
        </Button>

        {results && (
          <div className="mt-6 p-4 border rounded-lg">
            <h4 className="font-semibold mb-2">Search Results</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Name: {businessName}</span>
                <Badge variant={results.available ? "default" : "destructive"}>
                  {results.available ? "Available" : "Not Available"}
                </Badge>
              </div>
              {results.similarNames && results.similarNames.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Similar existing names:</p>
                  <ul className="text-sm space-y-1">
                    {results.similarNames.map((name: string, index: number) => (
                      <li key={index} className="text-gray-500">• {name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ComplianceCalendar() {
  const [entityType, setEntityType] = useState("");
  const [state, setState] = useState("");
  const [formationDate, setFormationDate] = useState("");
  const [calendar, setCalendar] = useState<any>(null);
  const { toast } = useToast();

  const generateCalendar = async () => {
    if (!entityType || !state || !formationDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate calendar.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/generate-compliance-calendar", {
        entityType,
        state,
        formationDate
      });
      
      if (response.ok) {
        const data = await response.json();
        setCalendar(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate compliance calendar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-500" />
          Compliance Calendar Generator
        </CardTitle>
        <CardDescription>
          Generate a personalized compliance calendar with all your filing deadlines
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="entity-type-cal">Entity Type</Label>
            <Select value={entityType} onValueChange={setEntityType}>
              <SelectTrigger>
                <SelectValue placeholder="Select entity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LLC">LLC</SelectItem>
                <SelectItem value="Corporation">Corporation</SelectItem>
                <SelectItem value="S-Corp">S-Corporation</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="state-cal">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="DE">Delaware</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="formation-date">Formation Date</Label>
            <Input
              id="formation-date"
              type="date"
              value={formationDate}
              onChange={(e) => setFormationDate(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={generateCalendar}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Generate Compliance Calendar
        </Button>

        {calendar && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold">Your Compliance Calendar</h4>
            <div className="space-y-2">
              {calendar.events?.map((event: any, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{event.title}</h5>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                    <Badge variant="outline">{event.dueDate}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TaxImpactCalculator() {
  const [revenue, setRevenue] = useState("");
  const [expenses, setExpenses] = useState("");
  const [ownerSalary, setOwnerSalary] = useState("");
  const [results, setResults] = useState<any>(null);

  const calculateTaxImpact = () => {
    const netIncome = parseFloat(revenue) - parseFloat(expenses);
    const salaryAmount = parseFloat(ownerSalary) || 0;

    const llcTax = netIncome * 0.15; // Simplified calculation
    const corpTax = netIncome * 0.21;
    const sCorpTax = (netIncome - salaryAmount) * 0.15 + salaryAmount * 0.1524;

    setResults({
      netIncome,
      llc: { tax: llcTax, effectiveRate: (llcTax / netIncome * 100).toFixed(2) },
      corp: { tax: corpTax, effectiveRate: (corpTax / netIncome * 100).toFixed(2) },
      sCorp: { tax: sCorpTax, effectiveRate: (sCorpTax / netIncome * 100).toFixed(2) }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-500" />
          Tax Impact Calculator
        </CardTitle>
        <CardDescription>
          Compare tax implications across different business entity types
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="revenue">Annual Revenue</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="$100,000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="expenses">Annual Expenses</Label>
            <Input
              id="expenses"
              type="number"
              placeholder="$50,000"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="owner-salary">Owner Salary (S-Corp)</Label>
            <Input
              id="owner-salary"
              type="number"
              placeholder="$60,000"
              value={ownerSalary}
              onChange={(e) => setOwnerSalary(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={calculateTaxImpact}
          disabled={!revenue || !expenses}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          Calculate Tax Impact
        </Button>

        {results && (
          <div className="mt-6 space-y-4">
            <h4 className="font-semibold">Tax Comparison Results</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">LLC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${results.llc.tax.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{results.llc.effectiveRate}% effective rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">C-Corporation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${results.corp.tax.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{results.corp.effectiveRate}% effective rate</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">S-Corporation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${results.sCorp.tax.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{results.sCorp.effectiveRate}% effective rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BoirComplianceChecker() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          BOIR Compliance Checker
        </CardTitle>
        <CardDescription>
          Determine if your business needs to file Beneficial Ownership Information Reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            BOIR compliance checking tool will be implemented here with comprehensive questionnaire
            to determine filing requirements under the Corporate Transparency Act.
          </p>
          <Button className="bg-green-500 hover:bg-green-600">
            Start BOIR Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OperatingAgreementBuilder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Operating Agreement Builder
        </CardTitle>
        <CardDescription>
          Create a customized LLC operating agreement with guided steps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Step-by-step operating agreement builder with customizable templates
            and legal guidance will be implemented here.
          </p>
          <Button className="bg-green-500 hover:bg-green-600">
            Start Building Agreement
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BylawsGenerator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-500" />
          Corporate Bylaws Generator
        </CardTitle>
        <CardDescription>
          Generate comprehensive corporate bylaws for your corporation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Corporate bylaws generator with industry-specific templates
            and compliance requirements will be implemented here.
          </p>
          <Button className="bg-green-500 hover:bg-green-600">
            Generate Bylaws
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpenseCategorizer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-purple-500" />
          Business Expense Categorizer
        </CardTitle>
        <CardDescription>
          Properly categorize business expenses for tax purposes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            AI-powered expense categorization tool with IRS compliance
            and automated tax code assignment will be implemented here.
          </p>
          <Button className="bg-green-500 hover:bg-green-600">
            Start Categorizing Expenses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CreditBuildingGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          Business Credit Building Guide
        </CardTitle>
        <CardDescription>
          Step-by-step plan for establishing and building business credit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Comprehensive business credit building roadmap with actionable steps,
            vendor recommendations, and progress tracking will be implemented here.
          </p>
          <Button className="bg-green-500 hover:bg-green-600">
            Start Credit Building Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}