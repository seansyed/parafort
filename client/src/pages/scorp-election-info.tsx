import { useState } from "react";
import LeftNavigation from "@/components/left-navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DollarSign,
  Award,
  ClipboardList,
  CalendarCheck,
  Briefcase,
  ShieldCheck,
  CheckCircle,
  FileText,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function SCorpElectionPage() {
  const handleElectSCorp = () => {
    console.log("Elect S-Corp Status clicked");
    // Navigate to S-Corp election service
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LeftNavigation />
      <div className="ml-64 min-h-screen pl-4">
        <div className="max-w-4xl mx-auto py-8 pr-8 space-y-8 mt-16">
          
          {/* Hero/Introduction Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Unlock Tax Savings: Electing S-Corporation Status
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              S-Corporation (S-Corp) status is a tax election, not a business entity type, 
              primarily chosen by LLCs and Corporations to reduce self-employment tax burden 
              and optimize owner compensation through strategic salary and distribution planning.
            </p>
          </div>

          {/* Key Advantages Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Why S-Corp Status Can Benefit Your Business
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Self-Employment Tax Savings</h3>
                    <p className="text-gray-600">
                      Owners can be paid a reasonable salary and receive remaining profits as distributions, 
                      avoiding FICA tax on distributions and potentially saving thousands annually.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Pass-Through Taxation</h3>
                    <p className="text-gray-600">
                      Income and losses flow directly to the owner's personal tax return, 
                      avoiding double taxation that C-Corporations face.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Enhanced Credibility</h3>
                    <p className="text-gray-600">
                      Maintaining a corporate structure can enhance business credibility 
                      with clients, vendors, and financial institutions.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Simplified Ownership</h3>
                    <p className="text-gray-600">
                      Generally fewer complexities than a C-Corporation while maintaining 
                      professional business structure and tax advantages.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Eligibility Requirements Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Eligibility Requirements for S-Corp Election
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-blue-600 mt-1" />
                  <p className="text-gray-700">Must be a domestic corporation, LLC, or partnership</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-blue-600 mt-1" />
                  <p className="text-gray-700">Generally cannot have more than 100 shareholders</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-blue-600 mt-1" />
                  <p className="text-gray-700">Shareholders must typically be U.S. citizens or resident aliens</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-blue-600 mt-1" />
                  <p className="text-gray-700">Can only have one class of stock</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-blue-600 mt-1" />
                  <p className="text-gray-700">
                    Certain types of corporations are ineligible (e.g., certain financial institutions, insurance companies)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Election Process & Deadlines Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                How to Elect S-Corp Status & Important Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">The Process</h3>
                  </div>
                  <p className="text-gray-700 ml-9">
                    Election is made by filing IRS Form 2553, Election by a Small Business Corporation, 
                    with the IRS. This form must be completed accurately and submitted within specific deadlines.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <CalendarCheck className="h-6 w-6 text-red-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Key Deadlines</h3>
                  </div>
                  <div className="ml-9 space-y-2">
                    <p className="text-gray-700">
                      <strong>Critical:</strong> Election must be made by the 15th day of the 3rd month 
                      of the tax year the election is to take effect, or at any time during the tax year 
                      immediately preceding the tax year the election is to take effect.
                    </p>
                    <p className="text-gray-600">
                      Late elections may be possible with reasonable cause documentation, 
                      but timing is crucial for tax savings.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ongoing Responsibilities Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Maintaining Your S-Corp Status: What to Know
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Reasonable Salary</h4>
                    <p className="text-gray-700">
                      Owners working for the S-Corp must pay themselves a "reasonable salary" 
                      subject to payroll taxes based on industry standards.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <RefreshCw className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Payroll & Bookkeeping</h4>
                    <p className="text-gray-700">
                      More stringent requirements for payroll processing, bookkeeping, 
                      and accounting compared to sole proprietorships or single-member LLCs.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Tax Filings</h4>
                    <p className="text-gray-700">
                      Separate corporate tax return (Form 1120-S) required in addition to individual returns, 
                      with specific deadlines and reporting requirements.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">State-Specific Rules</h4>
                    <p className="text-gray-700">
                      Some states may have different S-Corp recognition rules or additional 
                      requirements that must be considered and maintained.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Choose Our Service Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Seamless S-Corp Election with Our Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Guidance</h4>
                    <p className="text-gray-700">
                      Help determine if S-Corp is right for your business with personalized consultation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CalendarCheck className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Accurate & Timely Filing</h4>
                    <p className="text-gray-700">
                      Ensure Form 2553 is filed correctly and on time to secure your tax benefits.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Sparkles className="h-6 w-6 text-purple-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Avoid Costly Errors</h4>
                    <p className="text-gray-700">
                      Prevent common mistakes that can invalidate your election or delay processing.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-6 w-6 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Dedicated Support</h4>
                    <p className="text-gray-700">
                      Answer your questions throughout the process and provide ongoing guidance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action / Pricing Card */}
          <Card className="shadow-lg border-2 border-green-500">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">
                Optimize Your Taxes: Elect S-Corp Now
              </CardTitle>
              <CardDescription className="text-lg">
                Start saving on self-employment taxes with professional S-Corp election filing. 
                Our expert team handles all the complex IRS paperwork for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-3xl font-bold text-green-500 mb-2">$299</div>
                <div className="text-gray-600">One-time professional filing fee</div>
                <div className="text-sm text-gray-500 mt-2">
                  Includes Form 2553 preparation, filing, and consultation
                </div>
              </div>
              
              <Button 
                onClick={handleElectSCorp}
                className="bg-green-500 hover:bg-[#E5510A] text-white px-8 py-3 text-lg font-semibold w-full sm:w-auto"
              >
                Elect S-Corp Status
              </Button>
              
              <p className="text-sm text-gray-500">
                Get started in minutes with our streamlined process
              </p>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">
                    Is an LLC automatically an S-Corp?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    No, an LLC is not automatically an S-Corp. An LLC is a business entity type, 
                    while S-Corp is a tax election. LLCs can elect S-Corp tax status by filing 
                    Form 2553 with the IRS, but they remain LLCs from a legal structure standpoint. 
                    This election allows the LLC to be taxed as an S-Corporation while maintaining 
                    the operational flexibility of an LLC.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">
                    What is a 'reasonable salary'?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    A reasonable salary is what you would pay someone else to do the same job in your 
                    geographic area and industry. The IRS requires S-Corp owners who work in the business 
                    to pay themselves a reasonable salary subject to payroll taxes before taking distributions. 
                    This prevents abuse of the tax benefits. Factors considered include your role, 
                    responsibilities, time spent, company profits, and industry compensation standards.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">
                    Can I revoke S-Corp status?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700">
                    Yes, you can revoke S-Corp status, but there are important considerations. The revocation 
                    must be made by the 15th day of the 3rd month of the tax year for which you want it to 
                    take effect. After revocation, you generally cannot re-elect S-Corp status for 5 years 
                    without IRS consent. The revocation affects your tax treatment, so it's important to 
                    consult with a tax professional before making this decision.
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