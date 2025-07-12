import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Shield,
  Gavel,
  DollarSign,
  MapPin,
  Building2,
  Users,
  Search,
  Star
} from "lucide-react";

export default function ClientBusinessLicenses() {
  const [selectedState, setSelectedState] = useState<string>("CA");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("restaurant");

  const handleGetLicense = () => {
    console.log("Get business license clicked");
  };

  // Industry-specific license requirements
  const industryLicenses = {
    "restaurant": {
      name: "Restaurant & Food Service",
      licenses: [
        { name: "Food Service License", authority: "Health Department", fee: "$200-$500", required: true },
        { name: "Liquor License", authority: "Alcoholic Beverage Control", fee: "$300-$14,000", required: false },
        { name: "Signage Permit", authority: "City Planning", fee: "$50-$200", required: false },
        { name: "Music License (ASCAP/BMI)", authority: "Performance Rights", fee: "$300-$2,000", required: false }
      ]
    },
    "construction": {
      name: "Construction & Contracting",
      licenses: [
        { name: "Contractor's License", authority: "State Licensing Board", fee: "$300-$1,000", required: true },
        { name: "Building Permits", authority: "City Building Dept", fee: "$100-$10,000", required: true },
        { name: "Workers' Compensation", authority: "State Insurance", fee: "Varies", required: true },
        { name: "Bonding License", authority: "Surety Company", fee: "$100-$1,000", required: false }
      ]
    },
    "retail": {
      name: "Retail & E-commerce",
      licenses: [
        { name: "Sales Tax License", authority: "State Revenue", fee: "$0-$100", required: true },
        { name: "Retail Merchant License", authority: "City/County", fee: "$50-$500", required: true },
        { name: "Fire Department Permit", authority: "Fire Marshal", fee: "$25-$200", required: false },
        { name: "Tobacco License", authority: "State/Local", fee: "$100-$1,000", required: false }
      ]
    },
    "healthcare": {
      name: "Healthcare & Medical",
      licenses: [
        { name: "Medical Practice License", authority: "State Medical Board", fee: "$200-$2,000", required: true },
        { name: "DEA Registration", authority: "Drug Enforcement", fee: "$731", required: false },
        { name: "HIPAA Compliance", authority: "Federal HHS", fee: "Varies", required: true },
        { name: "Facility License", authority: "Health Department", fee: "$500-$5,000", required: true }
      ]
    },
    "automotive": {
      name: "Automotive Services",
      licenses: [
        { name: "Auto Dealer License", authority: "Motor Vehicle Dept", fee: "$500-$5,000", required: true },
        { name: "Repair Shop License", authority: "Consumer Affairs", fee: "$100-$1,000", required: true },
        { name: "Environmental Permit", authority: "EPA/State", fee: "$200-$2,000", required: false },
        { name: "Used Car Dealer Bond", authority: "Surety Company", fee: "$10,000-$100,000", required: false }
      ]
    }
  };

  const currentIndustry = industryLicenses[selectedIndustry as keyof typeof industryLicenses];

  // Popular license types
  const popularLicenses = [
    { name: "Business License", description: "General business operation permit", fee: "$50-$400" },
    { name: "Sales Tax Permit", description: "Authority to collect sales tax", fee: "$0-$100" },
    { name: "Professional License", description: "Industry-specific certification", fee: "$100-$1,000" },
    { name: "Zoning Permit", description: "Property use compliance", fee: "$25-$500" },
    { name: "Health Permit", description: "Health department approval", fee: "$100-$1,000" },
    { name: "Fire Department Permit", description: "Fire safety compliance", fee: "$25-$300" }
  ];

  return (
    <div className="flex-1 pt-32 pb-8 px-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Business License Services</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Professional business license research, application, and compliance services. We identify required 
            licenses for your industry and location, then handle the entire application process.
          </p>
        </div>

        {/* Industry Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Select Your Industry
              </CardTitle>
              <CardDescription>
                Choose your business type to see specific license requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(industryLicenses).map(([key, industry]) => (
                    <SelectItem key={key} value={key}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Operating Location
              </CardTitle>
              <CardDescription>
                Select your primary business location for local requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="PA">Pennsylvania</SelectItem>
                  <SelectItem value="OH">Ohio</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="NC">North Carolina</SelectItem>
                  <SelectItem value="MI">Michigan</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Industry-Specific Licenses */}
        {currentIndustry && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">
                {currentIndustry.name} - License Requirements
              </CardTitle>
              <CardDescription className="text-blue-700">
                Common licenses required for your industry in {selectedState}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {currentIndustry.licenses.map((license, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      {license.required ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500" />
                      )}
                      <div>
                        <p className="font-medium">{license.name}</p>
                        <p className="text-sm text-gray-600">{license.authority}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{license.fee}</p>
                      <Badge variant={license.required ? "destructive" : "secondary"}>
                        {license.required ? "Required" : "Optional"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Packages */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                License Research
              </CardTitle>
              <CardDescription>
                Comprehensive research of required licenses and permits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-green-600">$149</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Complete license requirement analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Federal, state, and local requirements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Industry-specific compliance guide
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Application instructions
                </li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleGetLicense}
              >
                Get Research Report
              </Button>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="h-5 w-5" />
                Application Service
              </CardTitle>
              <CardDescription>
                Full license application preparation and submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-blue-600">$399</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Everything in Research package
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Professional application preparation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Document submission handling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Application status monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Government fee payment assistance
                </li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleGetLicense}
              >
                Apply for Licenses
              </Button>
            </CardContent>
          </Card>

          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Shield className="h-5 w-5" />
                Compliance Management
              </CardTitle>
              <CardDescription>
                Ongoing license monitoring and renewal management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-purple-600">$699</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Everything in Application package
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Annual compliance calendar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Renewal deadline monitoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Regulatory change notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  12 months of support
                </li>
              </ul>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={handleGetLicense}
              >
                Manage Compliance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Popular License Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-600" />
              Most Common Business Licenses
            </CardTitle>
            <CardDescription>
              Popular license types across all industries and locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularLicenses.map((license, index) => (
                <div key={index} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                  <h4 className="font-semibold mb-2">{license.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{license.description}</p>
                  <p className="text-sm font-medium text-blue-600">{license.fee}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* License Process */}
        <Card>
          <CardHeader>
            <CardTitle>Our License Application Process</CardTitle>
            <CardDescription>
              Step-by-step approach to getting your business properly licensed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Research & Analysis</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive review of federal, state, and local requirements
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Application Prep</h3>
                <p className="text-sm text-gray-600">
                  Professional preparation of all required forms and documentation
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gavel className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">3. Submission & Tracking</h3>
                <p className="text-sm text-gray-600">
                  Direct submission to agencies with application status monitoring
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">4. License Delivery</h3>
                <p className="text-sm text-gray-600">
                  Receive approved licenses and ongoing compliance guidance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions about business licensing requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="how-many-licenses">
                <AccordionTrigger>How many licenses does my business need?</AccordionTrigger>
                <AccordionContent>
                  The number of licenses varies by industry, location, and business activities. Most businesses need 
                  a general business license plus industry-specific permits. Professional services may require 
                  additional certifications, while retail businesses need sales tax permits.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="how-long">
                <AccordionTrigger>How long does the licensing process take?</AccordionTrigger>
                <AccordionContent>
                  Processing times vary by jurisdiction and license type. Simple business licenses may take 2-4 weeks, 
                  while specialized permits can take 2-6 months. We provide estimated timelines during our research 
                  phase and monitor applications for faster processing.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="costs">
                <AccordionTrigger>What are the typical costs for business licenses?</AccordionTrigger>
                <AccordionContent>
                  License fees range from $25 for basic permits to several thousand dollars for specialized licenses. 
                  Our service fees are separate from government fees. We provide detailed cost breakdowns including 
                  all government fees before starting any applications.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="renewals">
                <AccordionTrigger>Do I need to renew my business licenses?</AccordionTrigger>
                <AccordionContent>
                  Most business licenses require annual or periodic renewal. Professional licenses may have continuing 
                  education requirements. Our compliance management service tracks all renewal dates and requirements 
                  to ensure your business stays properly licensed.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="operating-without">
                <AccordionTrigger>What happens if I operate without proper licenses?</AccordionTrigger>
                <AccordionContent>
                  Operating without required licenses can result in fines, business closure, legal liability, and 
                  difficulty getting licenses later. Many business insurance policies also require proper licensing. 
                  It's always better to get licensed before starting operations.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}