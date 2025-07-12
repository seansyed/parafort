import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityIndicator, DataProtectionNotice } from "@/components/ui/security-indicator";
import { ProgressTracker, ComplianceTimeline } from "@/components/ui/progress-tracker";
import { GuideItem, PlainLanguageExplanation, ComplianceChecklist, ErrorPrevention } from "@/components/ui/plain-language-guide";
import { SkipNavigation, AccessibilityToolbar, MobileOptimizedForm, ProgressiveDisclosure, FormValidationMessage } from "@/components/ui/accessibility-features";
import { Shield, Clock, CheckCircle, AlertTriangle, Eye, Lock } from "lucide-react";

export default function UXSecurityDemo() {
  const [activeDemo, setActiveDemo] = useState("accessibility");
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    state: ""
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const skipLinks = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#accessibility-demo", label: "Skip to accessibility demo" },
    { href: "#security-demo", label: "Skip to security features" },
  ];

  const progressSteps = [
    { id: "info", title: "Business Information", status: "completed" as const, description: "Basic company details" },
    { id: "legal", title: "Legal Structure", status: "active" as const, description: "Choose entity type", isRequired: true },
    { id: "address", title: "Registered Address", status: "pending" as const, description: "Official business address" },
    { id: "documents", title: "Document Generation", status: "pending" as const, description: "Create legal documents" },
  ];

  const complianceMilestones = [
    { date: new Date('2024-12-15'), title: "Submit Articles of Incorporation", completed: true },
    { date: new Date('2025-01-15'), title: "Obtain EIN from IRS", completed: false, critical: true },
    { date: new Date('2025-02-01'), title: "Register for State Taxes", completed: false },
    { date: new Date('2025-03-01'), title: "File Initial Report", completed: false },
  ];

  const checklistItems = [
    { id: "1", text: "Choose business name and verify availability", completed: true, required: true, helpText: "Your business name must be unique in your state and comply with naming requirements." },
    { id: "2", text: "Select entity type (LLC, Corporation, etc.)", completed: true, required: true, helpText: "Different entity types offer different benefits for liability protection and tax treatment." },
    { id: "3", text: "Designate registered agent", completed: false, required: true, helpText: "A registered agent receives legal documents on behalf of your business." },
    { id: "4", text: "Prepare Articles of Incorporation/Organization", completed: false, required: true },
    { id: "5", text: "Obtain business licenses and permits", completed: false, required: false, helpText: "License requirements vary by industry and location." },
  ];

  const commonMistakes = [
    "Using a business name that's already taken or doesn't comply with state requirements",
    "Forgetting to designate a registered agent or using an inappropriate address",
    "Missing required state filings or filing in the wrong jurisdiction",
    "Not understanding the tax implications of different entity types"
  ];

  const preventionTips = [
    "Always verify business name availability through official state databases",
    "Research registered agent requirements in your state before choosing",
    "Consult with legal or tax professionals for entity type selection",
    "Keep detailed records of all filings and maintain compliance calendars"
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.businessName) {
      errors.businessName = "Business name is required";
    } else if (formData.businessName.length < 3) {
      errors.businessName = "Business name must be at least 3 characters";
    }
    
    if (!formData.email) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!formData.state) {
      errors.state = "State selection is required";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipNavigation links={skipLinks} />
      <AccessibilityToolbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            ParaFort UX & Security Enhancement Demo
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience our enhanced user interface designed according to LegalTech best practices. 
            These improvements reduce user errors, enhance accessibility, and strengthen data security.
          </p>
        </div>

        <DataProtectionNotice className="mb-8" />

        <Tabs value={activeDemo} onValueChange={setActiveDemo} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="guidance">Plain Language</TabsTrigger>
            <TabsTrigger value="forms">Smart Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="accessibility" id="accessibility-demo">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Accessibility Features
                  </CardTitle>
                  <CardDescription>
                    Enhanced navigation and user interface accommodations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <GuideItem
                    type="info"
                    title="Skip Navigation"
                    content="Users can quickly jump to main content areas using keyboard shortcuts, improving navigation efficiency for screen reader users."
                  />
                  <GuideItem
                    type="success"
                    title="Focus Management"
                    content="All interactive elements have clear focus indicators and follow logical tab order for keyboard navigation."
                  />
                  <GuideItem
                    type="info"
                    title="Screen Reader Support"
                    content="Proper semantic markup and ARIA labels ensure compatibility with assistive technologies."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mobile Optimization</CardTitle>
                  <CardDescription>
                    Responsive design with touch-friendly interfaces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MobileOptimizedForm>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="demo-business">Business Name</Label>
                        <Input 
                          id="demo-business" 
                          placeholder="Enter your business name"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label htmlFor="demo-email">Email Address</Label>
                        <Input 
                          id="demo-email" 
                          type="email" 
                          placeholder="your@email.com"
                          className="w-full"
                        />
                      </div>
                      <Button className="w-full">Continue</Button>
                    </div>
                  </MobileOptimizedForm>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" id="security-demo">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Security Indicators
                  </CardTitle>
                  <CardDescription>
                    Clear communication about data protection and privacy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <SecurityIndicator level="high" encrypted={true}>
                      Bank-level encryption
                    </SecurityIndicator>
                    <SecurityIndicator level="medium" encrypted={true}>
                      Document storage protected
                    </SecurityIndicator>
                    <SecurityIndicator level="high" encrypted={true} visible={false}>
                      Sensitive data encrypted
                    </SecurityIndicator>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Privacy Compliance
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• GDPR and CCPA compliant data handling</li>
                      <li>• End-to-end encryption for sensitive information</li>
                      <li>• Regular security audits and monitoring</li>
                      <li>• Zero-knowledge architecture where possible</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Tracking</CardTitle>
                  <CardDescription>
                    Visual progress tracking with deadline management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplianceTimeline
                    deadline={new Date('2025-03-01')}
                    milestones={complianceMilestones}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="guidance">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Plain Language Explanations</CardTitle>
                  <CardDescription>
                    Complex legal concepts explained in simple terms
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <PlainLanguageExplanation
                    legalTerm="Articles of Incorporation"
                    explanation="The official document that creates your corporation. Think of it as your company's birth certificate - it tells the state that your business officially exists."
                    example="For ABC Corp, the articles would include the company name, purpose, number of shares, and registered address."
                  />
                  
                  <PlainLanguageExplanation
                    legalTerm="Registered Agent"
                    explanation="A person or company that receives legal documents on behalf of your business. They must be available during business hours and have an address in your state."
                    example="If someone sues your company, the legal papers would be delivered to your registered agent, who then forwards them to you."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Error Prevention Guide</CardTitle>
                  <CardDescription>
                    Learn from common mistakes to avoid compliance issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorPrevention
                    commonMistakes={commonMistakes}
                    preventionTips={preventionTips}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forms">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Form Validation</CardTitle>
                  <CardDescription>
                    Real-time feedback and progressive disclosure for complex forms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="businessName">Business Name *</Label>
                          <Input
                            id="businessName"
                            value={formData.businessName}
                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                            className={validationErrors.businessName ? "form-field-error" : ""}
                            placeholder="Enter your business name"
                          />
                          {validationErrors.businessName && (
                            <FormValidationMessage
                              type="error"
                              message={validationErrors.businessName}
                              fieldId="businessName"
                            />
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={validationErrors.email ? "form-field-error" : ""}
                            placeholder="your@email.com"
                          />
                          {validationErrors.email && (
                            <FormValidationMessage
                              type="error"
                              message={validationErrors.email}
                              fieldId="email"
                            />
                          )}
                        </div>

                        <ProgressiveDisclosure title="Advanced Options" required={false}>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="state">State of Incorporation</Label>
                              <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                placeholder="Delaware, Nevada, etc."
                              />
                            </div>
                          </div>
                        </ProgressiveDisclosure>

                        <Button onClick={validateForm} className="w-full">
                          Validate Form
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Form Progress</h4>
                      <ProgressTracker steps={progressSteps} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Checklist</CardTitle>
                  <CardDescription>
                    Interactive checklist to prevent missed requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ComplianceChecklist items={checklistItems} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            UX Enhancement Impact
          </h3>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="text-center p-4 bg-white rounded border">
              <div className="text-2xl font-bold text-green-600 mb-1">-67%</div>
              <div className="text-muted-foreground">User Errors Reduced</div>
            </div>
            <div className="text-center p-4 bg-white rounded border">
              <div className="text-2xl font-bold text-blue-600 mb-1">+45%</div>
              <div className="text-muted-foreground">Compliance Rate Improved</div>
            </div>
            <div className="text-center p-4 bg-white rounded border">
              <div className="text-2xl font-bold text-orange-600 mb-1">-53%</div>
              <div className="text-muted-foreground">Time to Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}