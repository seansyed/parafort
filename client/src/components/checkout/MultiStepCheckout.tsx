import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Service {
  id: number;
  name: string;
  description: string;
  oneTimePrice?: string;
  recurringPrice?: string;
  expeditedPrice?: string;
}

interface CheckoutStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const MultiStepCheckout: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpedited, setIsExpedited] = useState(false);
  
  // Form data states
  const [emailData, setEmailData] = useState({
    email: '',
    isVerified: false,
    verificationCode: '',
    codeSent: false
  });
  
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });
  
  const [serviceQuestions, setServiceQuestions] = useState({});
  const [clientInformation, setClientInformation] = useState({
    businessName: '',
    businessType: '',
    state: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    ein: '',
    contactPerson: ''
  });

  const steps: CheckoutStep[] = [
    { id: 1, title: 'Email Verification', description: 'Verify your email address', completed: emailData.isVerified },
    { id: 2, title: 'Account Creation', description: 'Create your account', completed: !!(accountData.firstName && accountData.lastName && accountData.password) },
    { id: 3, title: 'Service Questions', description: 'Answer service-specific questions', completed: false },
    { id: 4, title: 'Client Information', description: 'Provide required information', completed: false },
    { id: 5, title: 'Review & Payment', description: 'Complete your order', completed: false }
  ];

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const response = await apiRequest('GET', `/api/services/${serviceId}`);
      const serviceData = await response.json();
      setService(serviceData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load service information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    try {
      await apiRequest('POST', '/api/auth/send-verification', { email: emailData.email });
      setEmailData(prev => ({ ...prev, codeSent: true }));
      toast({
        title: "Verification Code Sent",
        description: "Check your email for the verification code",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive",
      });
    }
  };

  const verifyEmail = async () => {
    try {
      await apiRequest('POST', '/api/auth/verify-email', { 
        email: emailData.email, 
        code: emailData.verificationCode 
      });
      setEmailData(prev => ({ ...prev, isVerified: true }));
      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully",
      });
      setCurrentStep(2);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid verification code",
        variant: "destructive",
      });
    }
  };

  const createAccount = async () => {
    if (accountData.password !== accountData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/auth/register', {
        email: emailData.email,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        password: accountData.password
      });
      toast({
        title: "Account Created",
        description: "Your account has been created successfully",
      });
      setCurrentStep(3);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive",
      });
    }
  };

  const calculateTotal = () => {
    const basePrice = parseFloat(service?.oneTimePrice || service?.recurringPrice || "0");
    const expeditedPrice = isExpedited ? parseFloat(service?.expeditedPrice || "75") : 0;
    return (basePrice + expeditedPrice).toFixed(2);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
            step.id === currentStep 
              ? 'border-green-600 bg-green-600 text-white'
              : step.completed
                ? 'border-green-600 bg-green-100 text-green-600'
                : 'border-gray-300 bg-gray-100 text-gray-400'
          }`}>
            {step.completed ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              step.id
            )}
          </div>
          <div className="ml-4 min-w-0 flex-1">
            <p className={`text-sm font-medium ${step.id === currentStep ? 'text-green-600' : 'text-gray-500'}`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-400">{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-gray-300 mx-4" />
          )}
        </div>
      ))}
    </div>
  );

  const renderEmailVerification = () => (
    <Card>
      <CardHeader>
        <CardTitle>Email Verification</CardTitle>
        <CardDescription>
          We'll send you a verification code to confirm your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={emailData.email}
            onChange={(e) => setEmailData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
            disabled={emailData.codeSent}
          />
        </div>
        
        {!emailData.codeSent ? (
          <Button 
            onClick={sendVerificationCode}
            disabled={!emailData.email}
            className="w-full"
          >
            Send Verification Code
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                value={emailData.verificationCode}
                onChange={(e) => setEmailData(prev => ({ ...prev, verificationCode: e.target.value }))}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={verifyEmail}
                disabled={emailData.verificationCode.length !== 6}
                className="flex-1"
              >
                Verify Email
              </Button>
              <Button 
                variant="outline"
                onClick={() => setEmailData(prev => ({ ...prev, codeSent: false, verificationCode: '' }))}
              >
                Resend Code
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAccountCreation = () => (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Set up your ParaFort account to manage your services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={accountData.firstName}
              onChange={(e) => setAccountData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={accountData.lastName}
              onChange={(e) => setAccountData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Doe"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={accountData.password}
            onChange={(e) => setAccountData(prev => ({ ...prev, password: e.target.value }))}
            placeholder="Create a secure password"
          />
        </div>
        
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={accountData.confirmPassword}
            onChange={(e) => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            placeholder="Confirm your password"
          />
        </div>
        
        <Button 
          onClick={createAccount}
          disabled={!accountData.firstName || !accountData.lastName || !accountData.password || !accountData.confirmPassword}
          className="w-full"
        >
          Create Account
        </Button>
      </CardContent>
    </Card>
  );

  const renderServiceQuestions = () => (
    <Card>
      <CardHeader>
        <CardTitle>Service Questions</CardTitle>
        <CardDescription>
          Please answer a few questions about your {service?.name} needs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service-specific questions will be rendered here */}
        <p className="text-gray-600">Service-specific questions for {service?.name} will be displayed here.</p>
        
        {/* Processing Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Processing Options</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-4 border rounded-lg bg-gray-50">
              <input
                type="radio"
                id="standard"
                name="processingType"
                checked={!isExpedited}
                onChange={() => setIsExpedited(false)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="standard" className="font-medium text-gray-900 cursor-pointer">
                  Standard Processing
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Standard processing timeframe - 7-10 business days
                </p>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  Included
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg border-orange-200 bg-orange-50">
              <input
                type="radio"
                id="expedited"
                name="processingType"
                checked={isExpedited}
                onChange={() => setIsExpedited(true)}
                className="mt-1"
              />
              <div className="flex-1">
                <label htmlFor="expedited" className="font-medium text-gray-900 cursor-pointer">
                  Expedited Processing
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  Rush processing with priority handling - 2-3 business days
                </p>
                <p className="text-sm font-semibold text-orange-600 mt-1">
                  +${service?.expeditedPrice || "75"}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => setCurrentStep(4)}
          className="w-full"
        >
          Continue to Client Information
        </Button>
      </CardContent>
    </Card>
  );

  const renderClientInformation = () => (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>
          Provide the required information for your {service?.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              value={clientInformation.businessName}
              onChange={(e) => setClientInformation(prev => ({ ...prev, businessName: e.target.value }))}
              placeholder="Your Business Name"
            />
          </div>
          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              value={clientInformation.businessType}
              onChange={(e) => setClientInformation(prev => ({ ...prev, businessType: e.target.value }))}
              placeholder="LLC, Corporation, etc."
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={clientInformation.phone}
              onChange={(e) => setClientInformation(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={clientInformation.state}
              onChange={(e) => setClientInformation(prev => ({ ...prev, state: e.target.value }))}
              placeholder="CA, NY, TX, etc."
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="address">Business Address</Label>
          <Input
            id="address"
            value={clientInformation.address}
            onChange={(e) => setClientInformation(prev => ({ ...prev, address: e.target.value }))}
            placeholder="123 Business St"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={clientInformation.city}
              onChange={(e) => setClientInformation(prev => ({ ...prev, city: e.target.value }))}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={clientInformation.zipCode}
              onChange={(e) => setClientInformation(prev => ({ ...prev, zipCode: e.target.value }))}
              placeholder="12345"
            />
          </div>
        </div>
        
        <Button 
          onClick={() => setCurrentStep(5)}
          className="w-full"
        >
          Continue to Review & Payment
        </Button>
      </CardContent>
    </Card>
  );

  const renderReviewAndPayment = () => (
    <Card>
      <CardHeader>
        <CardTitle>Review & Payment</CardTitle>
        <CardDescription>
          Review your order details and complete payment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{service?.name}</span>
              <span>${service?.oneTimePrice || service?.recurringPrice}</span>
            </div>
            
            {isExpedited && (
              <div className="flex justify-between">
                <span>Expedited Processing</span>
                <span>+${service?.expeditedPrice || "75"}</span>
              </div>
            )}
            
            <Separator />
            
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-green-600">${calculateTotal()}</span>
            </div>
          </div>
        </div>
        
        {/* Customer Information */}
        <div>
          <h3 className="font-semibold mb-2">Customer Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Name:</strong> {accountData.firstName} {accountData.lastName}</p>
            <p><strong>Email:</strong> {emailData.email}</p>
            <p><strong>Business:</strong> {clientInformation.businessName}</p>
            <p><strong>Phone:</strong> {clientInformation.phone}</p>
          </div>
        </div>
        
        <Button className="w-full">
          Complete Order
        </Button>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Service not found</p>
        <Button onClick={() => setLocation('/')} className="mt-4">
          Return Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Order</h1>
          <p className="text-gray-600 mt-2">
            Ordering: <span className="font-semibold">{service.name}</span>
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && renderEmailVerification()}
          {currentStep === 2 && renderAccountCreation()}
          {currentStep === 3 && renderServiceQuestions()}
          {currentStep === 4 && renderClientInformation()}
          {currentStep === 5 && renderReviewAndPayment()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Previous
            </Button>
          )}
          <div className="flex-1" />
          {currentStep < 5 && currentStep > 1 && (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepCheckout;