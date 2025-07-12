
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Shield,
  Gavel,
  DollarSign,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function ClientSCorpElection() {
  const handleElectSCorp = () => {
    console.log("Elect S-Corp status clicked");
    window.location.href = "/multi-step-checkout/10";
  };

  return (
    <div className="flex-1 pt-32 pb-8 px-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">S-Corporation Election (Form 2553)</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Professional S-Corporation election filing service. We handle Form 2553 preparation and IRS submission 
              to help your business achieve pass-through taxation benefits and reduce self-employment taxes.
            </p>
          </div>

          {/* Key Benefits Alert */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                <h3 className="font-semibold text-green-900 mb-2">Potential Tax Savings</h3>
                <p className="text-green-800 mb-3">
                  S-Corp election can significantly reduce self-employment taxes for profitable businesses by 
                  allowing owners to take salary plus distributions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                    Pass-through taxation
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                    Reduced SE taxes
                  </Badge>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                    Salary + distributions
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filing Deadline Warning */}
        <Alert className="border-orange-200 bg-green-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Time-Sensitive Filing:</strong> Form 2553 must be filed within 2 months and 15 days of 
            your corporation's formation date, or by March 15th for the current tax year election.
          </AlertDescription>
        </Alert>

        {/* Service Options */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="h-5 w-5" />
                Standard S-Corp Election
              </CardTitle>
              <CardDescription>
                Complete Form 2553 preparation and IRS filing service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-blue-600">$99</div>
              <div className="text-sm text-blue-700 mb-4">7-10 Business Days Processing</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Form 2553 preparation and review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  IRS electronic filing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Supporting documentation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Filing confirmation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Tax compliance guidance
                </li>
              </ul>
              <button 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                onClick={handleElectSCorp}
                style={{ 
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Start S-Corp Election
              </button>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Clock className="h-5 w-5" />
                Expedited S-Corp Election
              </CardTitle>
              <CardDescription>
                Rush processing - 2 business days instead of 7-10 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-orange-600">$99</div>
              <div className="text-sm text-orange-700 mb-4">Expedited Processing Fee</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  Form 2553 preparation and review
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  Priority IRS electronic filing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  2 business day processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  Filing confirmation
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-orange-500" />
                  Tax compliance guidance
                </li>
              </ul>
              <button 
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                onClick={handleElectSCorp}
                style={{ 
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Choose Expedited Service
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Eligibility Requirements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              S-Corporation Eligibility Requirements
            </CardTitle>
            <CardDescription>
              Ensure your business meets IRS requirements for S-Corp election
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 mb-3">✓ Eligible Entities</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Domestic corporations</li>
                  <li>• Single-member LLCs</li>
                  <li>• Multi-member LLCs (with election)</li>
                  <li>• Partnerships (with election)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-3">✗ Restrictions</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Maximum 100 shareholders</li>
                  <li>• Only individual or certain trust shareholders</li>
                  <li>• One class of stock only</li>
                  <li>• No non-resident alien shareholders</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Structure Comparison</CardTitle>
            <CardDescription>
              Understanding the tax differences between entity types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Entity Type</th>
                    <th className="text-left p-3 font-medium">Income Tax</th>
                    <th className="text-left p-3 font-medium">Self-Employment Tax</th>
                    <th className="text-left p-3 font-medium">Owner Distributions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-medium">LLC (Default)</td>
                    <td className="p-3">Pass-through to owners</td>
                    <td className="p-3 text-red-600">15.3% on all profits</td>
                    <td className="p-3">No restrictions</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">S-Corporation</td>
                    <td className="p-3">Pass-through to owners</td>
                    <td className="p-3 text-green-600">15.3% on salary only</td>
                    <td className="p-3">Tax-free distributions</td>
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="p-3 font-medium">C-Corporation</td>
                    <td className="p-3 text-red-600">Double taxation</td>
                    <td className="p-3">Not applicable</td>
                    <td className="p-3">Taxed as dividends</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Common questions about S-Corporation election
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="when-elect">
                <AccordionTrigger>When should I elect S-Corp status?</AccordionTrigger>
                <AccordionContent>
                  S-Corp election is most beneficial when your business has consistent profits above $60,000-$80,000 
                  annually. The self-employment tax savings must outweigh the additional payroll compliance costs and 
                  reasonable salary requirements.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="reasonable-salary">
                <AccordionTrigger>What is a "reasonable salary" requirement?</AccordionTrigger>
                <AccordionContent>
                  S-Corp owners who work in the business must pay themselves a reasonable salary before taking 
                  distributions. The IRS expects compensation comparable to what you'd pay an employee for the same 
                  work. This salary is subject to payroll taxes.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="deadline">
                <AccordionTrigger>What's the deadline for filing Form 2553?</AccordionTrigger>
                <AccordionContent>
                  Form 2553 must be filed within 2 months and 15 days of your corporation's formation date. For 
                  existing entities, file by March 15th of the tax year you want the election to take effect. 
                  Late elections may be accepted with reasonable cause.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="revoke-election">
                <AccordionTrigger>Can I revoke S-Corp election later?</AccordionTrigger>
                <AccordionContent>
                  Yes, but there are restrictions. You can revoke S-Corp status, but generally cannot re-elect for 
                  5 years without IRS permission. The revocation must be filed by March 15th of the tax year, and 
                  shareholders must consent to the revocation.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="state-election">
                <AccordionTrigger>Do I need to file state S-Corp elections too?</AccordionTrigger>
                <AccordionContent>
                  Most states automatically recognize federal S-Corp elections, but some require separate state 
                  filings. We'll research your state's requirements and handle any necessary state elections as 
                  part of our service.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Process Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>S-Corp Election Process</CardTitle>
            <CardDescription>
              Step-by-step timeline for your S-Corporation election
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">1. Information Gathering</h3>
                <p className="text-sm text-gray-600">
                  Collect entity details, shareholder information, and election preferences
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">2. Form 2553 Preparation</h3>
                <p className="text-sm text-gray-600">
                  Professional preparation and review of your S-Corp election form
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gavel className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-2">3. IRS Filing</h3>
                <p className="text-sm text-gray-600">
                  Electronic submission to IRS with all required supporting documentation
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">4. Confirmation & Setup</h3>
                <p className="text-sm text-gray-600">
                  Receive IRS confirmation and guidance for ongoing compliance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}