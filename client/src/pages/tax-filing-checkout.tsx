import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, ChevronLeft, Check, Upload, DollarSign, FileText, User, Building } from 'lucide-react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";

// Initialize Stripe with config from server
let stripePromise: Promise<any> | null = null;

const initializeStripe = async () => {
  if (!stripePromise) {
    try {
      const response = await fetch('/api/stripe/config');
      const config = await response.json();
      stripePromise = loadStripe(config.publishableKey);
    } catch (error) {
      console.error('Failed to load Stripe config:', error);
      stripePromise = Promise.resolve(null);
    }
  }
  return stripePromise;
};

interface TaxFilingData {
  // Basic Information
  companyName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  industry: string;
  businessStructure: string;
  einSSN: string;
  taxYearStart: string;
  taxYearEnd: string;
  filingYear: string;
  
  // Entity-Specific
  partnerInfo?: string;
  shareholderInfo?: string;
  dividendInfo?: string;
  
  // Documents
  documentsUploaded: File[];
  
  // Service Details
  service: string;
  plan: string;
  amount: number;
}

const PaymentForm = ({ clientSecret, onSuccess }: { clientSecret: string; onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Processing your tax filing service...",
      });
      onSuccess();
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isProcessing ? 'Processing...' : 'Complete Payment'}
      </Button>
    </form>
  );
};

export default function TaxFilingCheckout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [clientSecret, setClientSecret] = useState("");
  
  // Initialize Stripe
  useEffect(() => {
    initializeStripe();
  }, []);

  // Dynamic pricing based on business structure
  const getTaxServiceInfo = (businessStructure: string) => {
    const serviceMap = {
      'sole-proprietorship': { 
        plan: 'sole-proprietorship-tax-return', 
        amount: 299,
        form: 'Schedule C (Form 1040)',
        description: 'Individual Tax Return with Business Income'
      },
      'partnership': { 
        plan: 'partnership-tax-return', 
        amount: 499,
        form: 'Form 1065 + Schedule K-1',
        description: 'Partnership Tax Return'
      },
      'llc': { 
        plan: 'llc-tax-return', 
        amount: 399,
        form: 'Form 1065 or Schedule C',
        description: 'LLC Tax Return (depends on election)'
      },
      's-corp': { 
        plan: 's-corp-tax-return', 
        amount: 599,
        form: 'Form 1120S + Schedule K-1',
        description: 'S-Corporation Tax Return'
      },
      'c-corp': { 
        plan: 'c-corp-tax-return', 
        amount: 799,
        form: 'Form 1120',
        description: 'C-Corporation Tax Return'
      }
    };
    
    return serviceMap[businessStructure] || serviceMap['partnership'];
  };
  
  const [formData, setFormData] = useState<TaxFilingData>({
    companyName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    industry: '',
    businessStructure: '',
    einSSN: '',
    taxYearStart: '2024-01-01',
    taxYearEnd: '2024-12-31',
    filingYear: '2024',
    partnerInfo: '',
    shareholderInfo: '',
    dividendInfo: '',
    documentsUploaded: [],
    service: '',
    plan: '',
    amount: 0
  });

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get("service") || "";
    const plan = urlParams.get("plan") || "";
    const amount = parseFloat(urlParams.get("amount") || "0");
    
    setFormData(prev => ({ ...prev, service, plan, amount }));
  }, []);

  // Create payment intent when we reach step 2
  useEffect(() => {
    if (currentStep === 2 && !clientSecret && formData.amount > 0) {
      const createPaymentIntent = async () => {
        try {
          const response = await apiRequest("POST", "/api/create-payment-intent", {
            service: formData.service,
            businessId: "tax-service",
            plan: formData.plan,
            amount: formData.amount
          });
          
          const data = await response.json();
          setClientSecret(data.clientSecret);
        } catch (error) {
          toast({
            title: "Payment Setup Failed",
            description: "Unable to initialize payment. Please try again.",
            variant: "destructive",
          });
        }
      };
      
      createPaymentIntent();
    }
  }, [currentStep, clientSecret, formData.amount, formData.service, formData.plan, toast]);

  const steps = [
    { number: 1, title: "Business Information", icon: User },
    { number: 2, title: "Payment", icon: DollarSign },
    { number: 3, title: "Document Upload", icon: Upload },
    { number: 4, title: "Confirmation", icon: Check }
  ];

  const updateFormData = (field: keyof TaxFilingData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Update service details when business structure changes
      if (field === 'businessStructure') {
        const serviceInfo = getTaxServiceInfo(value);
        updated.plan = serviceInfo.plan;
        updated.amount = serviceInfo.amount;
      }
      
      // Auto-set tax year dates when filing year changes
      if (field === 'filingYear') {
        updated.taxYearStart = `${value}-01-01`;
        updated.taxYearEnd = `${value}-12-31`;
      }
      
      return updated;
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        // Required fields for step 1
        const requiredFields = [
          'companyName', 'address', 'city', 'state', 'zipCode', 
          'phone', 'email', 'industry', 'businessStructure', 
          'einSSN', 'taxYearStart', 'taxYearEnd', 'filingYear'
        ];
        
        for (const field of requiredFields) {
          if (!formData[field as keyof TaxFilingData] || 
              String(formData[field as keyof TaxFilingData]).trim() === '') {
            toast({
              title: "Required Fields Missing",
              description: `Please fill in all required fields before proceeding.`,
              variant: "destructive",
            });
            return false;
          }
        }
        
        // Additional validation for entity-specific fields
        if (formData.businessStructure === 'partnership' && !formData.partnerInfo?.trim()) {
          toast({
            title: "Partner Information Required",
            description: "Please provide partner information for partnership entities.",
            variant: "destructive",
          });
          return false;
        }
        
        if ((formData.businessStructure === 's-corp' || formData.businessStructure === 'c-corp') && 
            !formData.shareholderInfo?.trim()) {
          toast({
            title: "Shareholder Information Required", 
            description: "Please provide shareholder information for corporations.",
            variant: "destructive",
          });
          return false;
        }
        
        return true;
      case 2:
        // Payment step validation can be added here if needed
        return true;
      case 3:
        // Document upload validation
        if (formData.documentsUploaded.length === 0) {
          toast({
            title: "Documents Required",
            description: "Please upload at least one tax document to proceed.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ 
      ...prev, 
      documentsUploaded: [...prev.documentsUploaded, ...files] 
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentsUploaded: prev.documentsUploaded.filter((_, i) => i !== index)
    }));
  };

  const submitTaxFiling = async () => {
    try {
      const response = await apiRequest("POST", "/api/tax-filing/submit", {
        ...formData,
        // Convert files to base64 or handle file upload separately
        documentsUploaded: formData.documentsUploaded.map(f => f.name)
      });
      
      toast({
        title: "Tax Filing Submitted",
        description: "Your tax filing request has been submitted successfully!",
      });
      
      setLocation('/');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Business Information</h2>
              <p className="text-gray-600">Please provide your business details for tax preparation</p>
            </div>

            {/* Business Structure Selection - First Priority */}
            <Card className="bg-amber-50 border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Business Structure & Tax Forms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white p-3 rounded border border-amber-100">
                    <h4 className="font-medium text-amber-800 mb-2">📋 Required Tax Forms by Structure:</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• <strong>Sole Proprietorship:</strong> Schedule C (Form 1040)</li>
                      <li>• <strong>Partnership:</strong> Form 1065 + Schedule K-1</li>
                      <li>• <strong>LLC:</strong> Form 1065 (multi-member) or Schedule C (single-member)</li>
                      <li>• <strong>S-Corporation:</strong> Form 1120S + Schedule K-1</li>
                      <li>• <strong>C-Corporation:</strong> Form 1120</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="businessStructure">Business Structure *</Label>
                      <Select 
                        value={formData.businessStructure}
                        onValueChange={(value) => updateFormData('businessStructure', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="llc">LLC</SelectItem>
                          <SelectItem value="s-corp">S-Corporation</SelectItem>
                          <SelectItem value="c-corp">C-Corporation</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">Legal structure for tax purposes</p>
                    </div>
                    <div>
                      <Label htmlFor="einSSN">EIN or SSN *</Label>
                      <Input 
                        id="einSSN"
                        value={formData.einSSN}
                        onChange={(e) => updateFormData('einSSN', e.target.value)}
                        placeholder="XX-XXXXXXX or XXX-XX-XXXX"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Employer ID Number or Social Security Number</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Service Information */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-white">Selected Tax Service</h3>
                      <p className="text-sm text-white capitalize">{formData.plan.replace(/-/g, ' ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">${formData.amount}</div>
                    <div className="text-sm text-white">
                      {formData.businessStructure ? 
                        getTaxServiceInfo(formData.businessStructure).description : 
                        'Professional Tax Filing'
                      }
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-green-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">What's Included:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Professional tax preparation and review</li>
                        <li>• Federal and state tax filing</li>
                        <li>• Business expense optimization</li>
                        <li>• Tax consultation included</li>
                        <li>• 100% accuracy guarantee</li>
                      </ul>
                    </div>
                    {formData.businessStructure && (
                      <div className="text-right bg-blue-50 px-3 py-2 rounded border border-blue-200">
                        <div className="text-xs text-blue-600 font-medium">Required Form:</div>
                        <div className="text-sm text-blue-800 font-semibold">
                          {getTaxServiceInfo(formData.businessStructure).form}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input 
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder="Enter your business legal name"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Must match your EIN registration</p>
                </div>
                <div>
                  <Label htmlFor="industry">Industry/Business Type *</Label>
                  <Input 
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => updateFormData('industry', e.target.value)}
                    placeholder="e.g., Consulting, Retail, Manufacturing"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Primary business activity</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Business Address *</Label>
                <Input 
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Street address where business operates"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Physical business location (not P.O. Box)</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input 
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Primary business contact number</p>
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="business@company.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Where we'll send tax documents</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input 
                  id="website"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>
              

              
              {/* Tax Year Information with Tips */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Tax Year Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <h4 className="font-medium text-blue-800 mb-2">💡 Tax Year Tips:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>Calendar Year:</strong> January 1 - December 31 (most common)</li>
                        <li>• <strong>Fiscal Year:</strong> Any 12-month period ending on the last day of any month except December</li>
                        <li>• <strong>First Year:</strong> Can be less than 12 months if business started mid-year</li>
                        <li>• Most small businesses use calendar year (Jan 1 - Dec 31)</li>
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="taxYearStart">Tax Year Start *</Label>
                        <Input 
                          id="taxYearStart"
                          type="date"
                          value={formData.taxYearStart}
                          onChange={(e) => updateFormData('taxYearStart', e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Usually January 1st</p>
                      </div>
                      <div>
                        <Label htmlFor="taxYearEnd">Tax Year End *</Label>
                        <Input 
                          id="taxYearEnd"
                          type="date"
                          value={formData.taxYearEnd}
                          onChange={(e) => updateFormData('taxYearEnd', e.target.value)}
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Usually December 31st</p>
                      </div>
                      <div>
                        <Label htmlFor="filingYear">Filing Year *</Label>
                        <Select 
                          value={formData.filingYear}
                          onValueChange={(value) => updateFormData('filingYear', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                            <SelectItem value="2021">2021</SelectItem>
                            <SelectItem value="2020">2020</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-gray-500 mt-1">Tax year being filed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Entity-specific questions */}
              {formData.businessStructure === 'partnership' && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800 text-sm">Partnership Information Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="partnerInfo">Partner Information & Profit/Loss Allocation *</Label>
                      <Textarea 
                        id="partnerInfo"
                        value={formData.partnerInfo}
                        onChange={(e) => updateFormData('partnerInfo', e.target.value)}
                        placeholder="Example: John Smith - 60%, Jane Doe - 40%"
                        rows={4}
                        required
                      />
                      <p className="text-xs text-purple-600 mt-1">List all partners with their ownership percentages and profit/loss allocation</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {formData.businessStructure === 's-corp' && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800 text-sm">S-Corporation Information Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="shareholderInfo">Shareholder Information & Compensation *</Label>
                      <Textarea 
                        id="shareholderInfo"
                        value={formData.shareholderInfo}
                        onChange={(e) => updateFormData('shareholderInfo', e.target.value)}
                        placeholder="Shareholder names, ownership %, W-2 wages paid, distributions made"
                        rows={4}
                        required
                      />
                      <p className="text-xs text-purple-600 mt-1">Include shareholder compensation (W-2) and any distributions made during the tax year</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {formData.businessStructure === 'c-corp' && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-800 text-sm">C-Corporation Information Required</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="dividendInfo">Dividend Payments & Retained Earnings *</Label>
                      <Textarea 
                        id="dividendInfo"
                        value={formData.dividendInfo}
                        onChange={(e) => updateFormData('dividendInfo', e.target.value)}
                        placeholder="Dividend payments made, retained earnings, accumulated earnings and profits"
                        rows={4}
                        required
                      />
                      <p className="text-xs text-purple-600 mt-1">Provide details about dividend distributions and retained earnings for the tax year</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <Button onClick={nextStep} className="w-full bg-green-600 hover:bg-green-700">
              Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
              <p className="text-gray-600">Secure payment processing</p>
            </div>
            {/* Service Summary */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Service:</span>
                    <span>Tax Filing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Plan:</span>
                    <span className="capitalize">{formData.plan.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${formData.amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm 
                  clientSecret={clientSecret} 
                  onSuccess={nextStep}
                />
              </Elements>
            ) : (
              <div className="text-center">Setting up payment...</div>
            )}
            <Button variant="outline" onClick={prevStep} className="w-full">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Document Upload</h2>
              <p className="text-gray-600">Upload your tax documents and financial statements</p>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="documents">Upload Tax Documents</Label>
                    <Input 
                      id="documents"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileUpload}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Upload P&L statements, balance sheets, receipts, and other tax documents
                    </p>
                  </div>
                  
                  {formData.documentsUploaded.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Uploaded Files:</h4>
                      <div className="space-y-2">
                        {formData.documentsUploaded.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{file.name}</span>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={nextStep} className="flex-1 bg-green-600 hover:bg-green-700">
                Review & Submit <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Review & Confirmation</h2>
              <p className="text-gray-600">Please review your information before final submission</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Service Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>Tax Filing</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="capitalize">{formData.plan.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Amount Paid:</span>
                    <span className="text-green-600">${formData.amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Company:</strong> {formData.companyName}</div>
                  <div><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</div>
                  <div><strong>Contact:</strong> {formData.phone} | {formData.email}</div>
                  <div><strong>Business Type:</strong> {formData.businessStructure}</div>
                  <div><strong>EIN/SSN:</strong> {formData.einSSN}</div>
                  <div><strong>Tax Year:</strong> {formData.taxYearStart} to {formData.taxYearEnd}</div>
                  <div><strong>Filing Year:</strong> {formData.filingYear}</div>
                  <div><strong>Documents:</strong> {formData.documentsUploaded.length} files uploaded</div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-4">
              <Button variant="outline" onClick={prevStep} className="flex-1">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={submitTaxFiling} className="flex-1 bg-green-600 hover:bg-green-700">
                Submit Tax Filing Request <Check className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 text-sm">
                  <div className={`font-medium ${
                    currentStep >= step.number ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    Step {step.number}
                  </div>
                  <div className="text-gray-600">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-12 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}