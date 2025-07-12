import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Upload, FileText, User, Building, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ParaFortLoader from "@/components/ParaFortLoader";

// US States array for select options
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
  "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
  "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
  "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

// Form validation schema
const boirFormSchema = z.object({
  // Reporting Company Information
  company_legal_name: z.string().min(1, "Company legal name is required"),
  trade_dba_names: z.string().optional(),
  principal_us_address: z.string().min(1, "Principal US address is required"),
  jurisdiction_of_formation: z.string().min(1, "Jurisdiction of formation is required"),
  tax_identification_number: z.string().min(1, "Tax identification number is required"),
  filing_type: z.enum(["initial", "updated", "corrected"]),
  
  // Beneficial Owner 1 Information
  owner1_full_name: z.string().min(1, "Owner 1 full name is required"),
  owner1_date_of_birth: z.string().min(1, "Owner 1 date of birth is required"),
  owner1_address: z.string().min(1, "Owner 1 address is required"),
  owner1_identification_type: z.string().min(1, "Owner 1 identification type is required"),
  owner1_identification_number: z.string().min(1, "Owner 1 identification number is required"),
  owner1_identification_jurisdiction: z.string().min(1, "Owner 1 identification jurisdiction is required"),
  owner1_ownership_percentage: z.string().optional(),
  
  // Beneficial Owner 2 Information (optional)
  owner2_full_name: z.string().optional(),
  owner2_date_of_birth: z.string().optional(),
  owner2_address: z.string().optional(),
  owner2_identification_type: z.string().optional(),
  owner2_identification_number: z.string().optional(),
  owner2_identification_jurisdiction: z.string().optional(),
  owner2_ownership_percentage: z.string().optional(),
  
  // Company Applicant Information
  applicant_full_name: z.string().min(1, "Company applicant full name is required"),
  applicant_date_of_birth: z.string().min(1, "Company applicant date of birth is required"),
  applicant_address: z.string().min(1, "Company applicant address is required"),
  applicant_identification_type: z.string().min(1, "Company applicant identification type is required"),
  applicant_identification_number: z.string().min(1, "Company applicant identification number is required"),
  applicant_identification_jurisdiction: z.string().min(1, "Company applicant identification jurisdiction is required"),
  
  // Additional Information
  fincen_identifier: z.string().optional(),
  special_circumstances: z.string().optional(),
});

type BOIRFormData = z.infer<typeof boirFormSchema>;

export default function PostPaymentForm() {
  const { orderId } = useParams<{ orderId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  // Fetch order details to verify payment and get service info
  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId,
  });

  const form = useForm<BOIRFormData>({
    resolver: zodResolver(boirFormSchema),
    defaultValues: {
      filing_type: "initial",
    },
  });

  // Submit form mutation
  const submitFormMutation = useMutation({
    mutationFn: async (formData: BOIRFormData & { files: Record<string, File> }) => {
      const submitData = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'files' && value) {
          submitData.append(key, value);
        }
      });
      
      // Add uploaded files
      Object.entries(formData.files).forEach(([fieldName, file]) => {
        submitData.append(fieldName, file);
      });
      
      // Add order ID
      submitData.append('orderId', orderId!);
      
      const response = await fetch(`/api/orders/${orderId}/complete-form`, {
        method: 'POST',
        body: submitData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "BOIR Information Submitted",
        description: "Your BOIR filing information has been submitted successfully. We'll process your filing and send confirmation.",
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      console.error('Form submission error:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your information. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (fieldName: string, file: File) => {
    setUploadedFiles(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const onSubmit = (data: BOIRFormData) => {
    submitFormMutation.mutate({
      ...data,
      files: uploadedFiles
    });
  };

  if (orderLoading) {
    return <ParaFortLoader />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
          <p>The requested order could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">BOIR Filing Information</h1>
                <p className="text-gray-600">Complete your Beneficial Ownership Information Report</p>
              </div>
            </div>
            
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Payment confirmed! Now we need to collect your detailed BOIR filing information to submit to FinCEN.
              </AlertDescription>
            </Alert>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Reporting Company Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Reporting Company Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="company_legal_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Legal Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter exact legal name as registered" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="trade_dba_names"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Trade/DBA Names</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Any trade names or DBA names (optional)" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="principal_us_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Principal US Address *</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Full street address including city, state, and ZIP code" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="jurisdiction_of_formation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Jurisdiction of Formation *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state or jurisdiction" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {US_STATES.map((state) => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tax_identification_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax Identification Number (EIN) *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="XX-XXXXXXX" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="filing_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filing Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="initial">Initial Filing</SelectItem>
                                <SelectItem value="updated">Updated Filing</SelectItem>
                                <SelectItem value="corrected">Corrected Filing</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Beneficial Owner 1 */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Beneficial Owner 1 Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="owner1_full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Legal Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="First Middle Last" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="owner1_date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="owner1_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Residential Address *</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Full residential address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="owner1_identification_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Identification Document Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ID type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="passport">US Passport</SelectItem>
                                <SelectItem value="drivers_license">Driver's License</SelectItem>
                                <SelectItem value="state_id">State ID Card</SelectItem>
                                <SelectItem value="foreign_passport">Foreign Passport</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="owner1_identification_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Identification Number *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="ID number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="owner1_identification_jurisdiction"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuing Jurisdiction *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select issuing state/country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {US_STATES.map((state) => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* File Upload for Owner 1 */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Upload Identification Document *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('owner1_id_document', file);
                            }}
                            className="w-full"
                          />
                          <p className="text-sm text-gray-500 mt-2">
                            Upload a clear photo of your government-issued ID
                          </p>
                          {uploadedFiles['owner1_id_document'] && (
                            <div className="mt-2 flex items-center gap-2 text-green-600">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">{uploadedFiles['owner1_id_document'].name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Beneficial Owner 2 (Optional) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Beneficial Owner 2 Information (Optional)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="owner2_full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Legal Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="First Middle Last" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="owner2_date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* File Upload for Owner 2 */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Upload Identification Document
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('owner2_id_document', file);
                            }}
                            className="w-full"
                          />
                          {uploadedFiles['owner2_id_document'] && (
                            <div className="mt-2 flex items-center gap-2 text-green-600">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">{uploadedFiles['owner2_id_document'].name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Company Applicant */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        Company Applicant Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="applicant_full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Legal Name *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="First Middle Last" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="applicant_date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth *</FormLabel>
                            <FormControl>
                              <Input {...field} type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* File Upload for Applicant */}
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Upload Identification Document
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload('applicant_id_document', file);
                            }}
                            className="w-full"
                          />
                          {uploadedFiles['applicant_id_document'] && (
                            <div className="mt-2 flex items-center gap-2 text-green-600">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">{uploadedFiles['applicant_id_document'].name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Submit Button */}
                  <Card>
                    <CardContent className="pt-6">
                      <Button 
                        type="submit" 
                        className="w-full h-12 text-lg"
                        disabled={submitFormMutation.isPending}
                      >
                        {submitFormMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Submitting BOIR Information...
                          </div>
                        ) : (
                          "Submit BOIR Filing Information"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </form>
              </Form>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Service</span>
                    <span>BOIR Filing</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid</span>
                    <span>${order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Payment Complete
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="font-medium">What happens next:</p>
                    <ul className="space-y-1">
                      <li>• Review your information</li>
                      <li>• Prepare FinCEN filing</li>
                      <li>• Submit to FinCEN</li>
                      <li>• Send confirmation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}