
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
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

export default function ClientAnnualReports() {
  const [selectedState, setSelectedState] = useState<string>("CA");
  const [selectedEntityType, setSelectedEntityType] = useState<string>("LLC");

  const handleFileAnnualReport = () => {
    console.log("File Annual Report clicked");
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
    "IL": { dueDate: "Anniversary month of incorporation", fee: "$25", interval: "Annual" },
    "IN": { dueDate: "By July 1st", fee: "$30", interval: "Biennial" },
    "IA": { dueDate: "By April 1st", fee: "$30", interval: "Biennial" },
    "KS": { dueDate: "By August 15th", fee: "$40", interval: "Annual" },
    "KY": { dueDate: "By June 30th", fee: "$15", interval: "Annual" },
    "LA": { dueDate: "Anniversary month of incorporation", fee: "$30", interval: "Annual" },
    "ME": { dueDate: "By June 1st", fee: "$85", interval: "Annual" },
    "MD": { dueDate: "By April 15th", fee: "$300", interval: "Annual" },
    "MA": { dueDate: "Anniversary of incorporation", fee: "$125", interval: "Annual" },
    "MI": { dueDate: "By May 15th", fee: "$25", interval: "Annual" },
    "MN": { dueDate: "By December 31st", fee: "$25", interval: "Annual" },
    "MS": { dueDate: "By April 1st", fee: "$25", interval: "Annual" },
    "MO": { dueDate: "Anniversary month of incorporation", fee: "$45", interval: "Annual" },
    "MT": { dueDate: "By April 15th", fee: "$20", interval: "Annual" },
    "NE": { dueDate: "By March 1st", fee: "$25", interval: "Biennial" },
    "NV": { dueDate: "Anniversary month of incorporation", fee: "$350", interval: "Annual" },
    "NH": { dueDate: "By April 1st", fee: "$100", interval: "Annual" },
    "NJ": { dueDate: "Anniversary month of incorporation", fee: "$50", interval: "Annual" },
    "NM": { dueDate: "By March 15th", fee: "$25", interval: "Annual" },
    "NY": { dueDate: "Anniversary of incorporation", fee: "$25", interval: "Biennial" },
    "NC": { dueDate: "By April 15th", fee: "$20", interval: "Annual" },
    "ND": { dueDate: "By November 15th", fee: "$50", interval: "Annual" },
    "OH": { dueDate: "Anniversary of incorporation", fee: "$50", interval: "Annual" },
    "OK": { dueDate: "By July 1st", fee: "$25", interval: "Annual" },
    "OR": { dueDate: "Anniversary of incorporation", fee: "$100", interval: "Annual" },
    "PA": { dueDate: "By April 15th", fee: "$70", interval: "Annual" },
    "RI": { dueDate: "By September 30th", fee: "$50", interval: "Annual" },
    "SC": { dueDate: "By April 1st", fee: "$25", interval: "Annual" },
    "SD": { dueDate: "By February 1st", fee: "$25", interval: "Annual" },
    "TN": { dueDate: "By April 1st", fee: "$20", interval: "Annual" },
    "TX": { dueDate: "Anniversary of incorporation", fee: "$25", interval: "Annual" },
    "UT": { dueDate: "Anniversary of incorporation", fee: "$20", interval: "Annual" },
    "VT": { dueDate: "By March 1st", fee: "$35", interval: "Annual" },
    "VA": { dueDate: "Anniversary month of incorporation", fee: "$50", interval: "Annual" },
    "WA": { dueDate: "Anniversary of incorporation", fee: "$60", interval: "Annual" },
    "WV": { dueDate: "By July 1st", fee: "$25", interval: "Annual" },
    "WI": { dueDate: "Anniversary of incorporation", fee: "$25", interval: "Annual" },
    "WY": { dueDate: "Anniversary of incorporation", fee: "$60", interval: "Annual" }
  };

  const currentRequirement = stateRequirements[selectedState as keyof typeof stateRequirements];
  const entityType = entityTypeFees[selectedEntityType as keyof typeof entityTypeFees];
  const calculatedFee = currentRequirement ? 
    `$${Math.round(parseInt(currentRequirement.fee.replace('$', '')) * entityType.multiplier)}` : 
    "$0";

  return (
    <div className="flex-1 pt-32 p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Annual Report Filing</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Professional annual report preparation and filing services. We handle all state requirements 
            and ensure timely compliance to keep your business in good standing.
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Filing Deadline Approaching</h3>
                <p className="text-orange-800">
                  Don't risk losing your business's good standing. Annual reports must be filed on time 
                  to avoid penalties, late fees, and potential administrative dissolution.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Select Your State
              </CardTitle>
              <CardDescription>
                Choose your state of incorporation to see specific requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stateRequirements).map(([state, info]) => (
                    <SelectItem key={state} value={state}>
                      {state} - Due {info.dueDate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Entity Type
              </CardTitle>
              <CardDescription>
                Select your business entity type for accurate fee calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select entity type..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(entityTypeFees).map(([type, info]) => (
                    <SelectItem key={type} value={type}>
                      {type} - {info.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Requirements Display */}
        {currentRequirement && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">
                {selectedState} Annual Report Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Due Date</p>
                    <p className="text-blue-700">{currentRequirement.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">State Fee</p>
                    <p className="text-blue-700">{calculatedFee}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Filing Frequency</p>
                    <p className="text-blue-700">{currentRequirement.interval}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service Options */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Standard Filing
              </CardTitle>
              <CardDescription>
                Professional preparation and filing within 7-10 business days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-green-600">
                ${currentRequirement ? (75 + parseInt(currentRequirement.fee.replace('$', ''))) : 75}
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Professional form preparation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  State filing fee included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  7-10 business day processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Confirmation documentation
                </li>
              </ul>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleFileAnnualReport}
              >
                Select Standard Filing
              </Button>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Bell className="h-5 w-5" />
                Expedited Filing
              </CardTitle>
              <CardDescription>
                Rush processing with 2-3 business day completion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-orange-600">
                ${currentRequirement ? (150 + parseInt(currentRequirement.fee.replace('$', ''))) : 150}
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  Priority processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  State filing fee included
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  2-3 business day processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  Email notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  Dedicated support
                </li>
              </ul>
              <Button 
                className="w-full bg-green-700 hover:bg-orange-700"
                onClick={handleFileAnnualReport}
              >
                Select Expedited Filing
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions about annual report filing requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="what-is">
                <AccordionTrigger>What is an Annual Report?</AccordionTrigger>
                <AccordionContent>
                  An annual report is a document that provides updated information about your business 
                  to the state where it's incorporated. It typically includes current business address, 
                  registered agent information, and details about company officers or managers.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="when-due">
                <AccordionTrigger>When is my Annual Report due?</AccordionTrigger>
                <AccordionContent>
                  Due dates vary by state. Some states require filing by a specific date (like April 1st), 
                  while others use your incorporation anniversary. Select your state above to see the 
                  specific requirements for your business.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="consequences">
                <AccordionTrigger>What happens if I don't file on time?</AccordionTrigger>
                <AccordionContent>
                  Failing to file your annual report can result in late fees, loss of good standing status, 
                  and eventually administrative dissolution of your business. This can affect your ability 
                  to conduct business and may require costly reinstatement procedures.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="information-needed">
                <AccordionTrigger>What information do I need to provide?</AccordionTrigger>
                <AccordionContent>
                  Typically, you'll need your business address, registered agent information, names and 
                  addresses of officers/managers, and sometimes financial information. We'll guide you 
                  through collecting all required information for your specific state.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="multiple-states">
                <AccordionTrigger>I do business in multiple states. Do I need multiple reports?</AccordionTrigger>
                <AccordionContent>
                  You only need to file an annual report in your state of incorporation. However, if you're 
                  registered as a foreign entity in other states, you may need to file reports there as well. 
                  Contact us for guidance on multi-state compliance requirements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Process Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Our Filing Process</CardTitle>
            <CardDescription>
              How we handle your annual report filing from start to finish
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Information Collection</h3>
                <p className="text-sm text-gray-600">
                  We gather all required information and verify accuracy
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Form Preparation</h3>
                <p className="text-sm text-gray-600">
                  Professional preparation using state-specific forms
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gavel className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">3. State Filing</h3>
                <p className="text-sm text-gray-600">
                  We file directly with the state and pay all required fees
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">4. Confirmation</h3>
                <p className="text-sm text-gray-600">
                  You receive confirmation and filed documents
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}