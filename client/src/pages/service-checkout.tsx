import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { LoadStripe, loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ParaFortLoader from "@/components/ParaFortLoader";

// Initialize Stripe using backend configuration
let stripePromise: Promise<any | null> | null = null;

async function initializeStripe(): Promise<any | null> {
  try {
    const response = await fetch('/api/stripe/config');
    const config = await response.json();
    
    if (config.requiresConfiguration || config.error) {
      console.error("Stripe configuration error:", config.message || "Stripe configuration required");
      console.warn("Continuing with limited functionality - payments will not work until Stripe is properly configured");
      return null;
    }
    
    if (config.publishableKey && config.publishableKey.startsWith('pk_')) {
      return await loadStripe(config.publishableKey);
    } else {
      throw new Error("Invalid publishable key received from server");
    }
  } catch (error) {
    console.error("Failed to initialize Stripe:", error);
    return null;
  }
}

// Initialize Stripe promise
stripePromise = initializeStripe();

// US States for form fields
const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
];

// Entity types for business services
const ENTITY_TYPES = [
  { value: "LLC", label: "Limited Liability Company (LLC)" },
  { value: "Corporation", label: "Corporation" },
  { value: "S-Corp", label: "S-Corporation" },
  { value: "C-Corp", label: "C-Corporation" },
  { value: "Partnership", label: "Partnership" },
  { value: "Sole Proprietorship", label: "Sole Proprietorship" },
  { value: "Non-Profit", label: "Non-Profit Organization" }
];

interface ServiceCustomField {
  id: number;
  serviceId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  isRequired: boolean;
  options: string[] | null;
  placeholder: string | null;
  helpText: string | null;
  validation: any;
  displayOrder: number;
  isActive: boolean;
}

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  oneTimePrice: number | null;
  recurringPrice: number | null;
  recurringInterval: string | null;
  isActive: boolean;
}

const CheckoutForm = ({ service, customFields, formData }: { 
  service: Service; 
  customFields: ServiceCustomField[];
  formData: any;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const createPaymentIntentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/create-payment-intent", data);
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/orders", data);
    },
  });

  // Calculate service amount safely
  const serviceAmount = typeof service?.oneTimePrice === 'number' ? service.oneTimePrice : 
                       typeof service?.recurringPrice === 'number' ? service.recurringPrice : 0;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = serviceAmount;

      // Create payment intent
      const paymentResponse = await createPaymentIntentMutation.mutateAsync({
        amount: totalAmount,
        currency: 'usd',
        serviceId: service.id,
        serviceName: service.name,
        formData
      });

      // Confirm payment
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: "if_required"
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Create order record
        await createOrderMutation.mutateAsync({
          serviceId: service.id,
          serviceName: service.name,
          amount: totalAmount,
          currency: 'usd',
          formData,
          paymentIntentId: paymentResponse.paymentIntentId
        });

        toast({
          title: "Payment Successful",
          description: `Your ${service.name} order has been processed successfully!`,
        });

        setLocation("/dashboard");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{service?.name || 'Loading...'}</span>
              <span>${(serviceAmount || 0).toFixed(2)}</span>
            </div>
            {service?.recurringInterval && (
              <div className="text-sm text-gray-600">
                Billed {service.recurringInterval}
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${(serviceAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none'
        }}
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <ParaFortLoader size="sm" />
            Processing Payment...
          </div>
        ) : (
          `Complete Order - $${(serviceAmount || 0).toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

const ServiceCheckout = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [clientSecret, setClientSecret] = useState<string>("");

  // Fetch service details
  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: [`/api/services/${serviceId}`],
    enabled: !!serviceId,
  });

  // Fetch custom fields for this service
  const { data: customFields = [], isLoading: fieldsLoading } = useQuery({
    queryKey: [`/api/services/${serviceId}/custom-fields`],
    enabled: !!serviceId,
  });

  // Create dynamic form schema based on custom fields
  const createFormSchema = (fields: ServiceCustomField[]) => {
    const schemaFields: Record<string, any> = {};
    
    fields.forEach(field => {
      let fieldSchema: any;
      
      switch (field.fieldType) {
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'phone':
          fieldSchema = z.string().min(10, 'Phone number must be at least 10 digits');
          break;
        case 'number':
          fieldSchema = z.coerce.number().min(0, 'Must be a positive number');
          break;
        case 'url':
          fieldSchema = z.string().url('Invalid URL');
          break;
        default:
          fieldSchema = z.string();
      }
      
      if (field.isRequired) {
        fieldSchema = fieldSchema.min(1, `${field.fieldLabel} is required`);
      } else {
        fieldSchema = fieldSchema.optional();
      }
      
      schemaFields[field.fieldName] = fieldSchema;
    });
    
    return z.object(schemaFields);
  };

  const formSchema = createFormSchema(customFields);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: customFields.reduce((acc, field) => {
      acc[field.fieldName] = '';
      return acc;
    }, {} as Record<string, any>)
  });

  // Create payment intent when component loads
  useEffect(() => {
    if (service && !clientSecret) {
      const amount = service.oneTimePrice || service.recurringPrice || 0;
      
      apiRequest("POST", "/api/create-payment-intent", {
        amount,
        currency: 'usd',
        serviceId: service.id,
        serviceName: service.name
      })
      .then(response => response.json())
      .then(data => {
        setClientSecret(data.clientSecret);
      })
      .catch(error => {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Error",
          description: "Failed to initialize payment. Please try again.",
          variant: "destructive"
        });
      });
    }
  }, [service, clientSecret, toast]);

  const renderCustomField = (field: ServiceCustomField) => {
    const commonProps = {
      name: field.fieldName,
      control: form.control,
    };

    switch (field.fieldType) {
      case 'select':
        return (
          <FormField
            key={field.id}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.fieldLabel}{field.isRequired && ' *'}</FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder || `Select ${field.fieldLabel}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'state_select':
        return (
          <FormField
            key={field.id}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.fieldLabel}{field.isRequired && ' *'}</FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'entity_type_select':
        return (
          <FormField
            key={field.id}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.fieldLabel}{field.isRequired && ' *'}</FormLabel>
                <Select onValueChange={formField.onChange} defaultValue={formField.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Entity Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ENTITY_TYPES.map((entity) => (
                      <SelectItem key={entity.value} value={entity.value}>
                        {entity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'radio':
        return (
          <FormField
            key={field.id}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className="space-y-3">
                <FormLabel>{field.fieldLabel}{field.isRequired && ' *'}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={formField.onChange}
                    defaultValue={formField.value}
                    className="flex flex-col space-y-1"
                  >
                    {field.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${field.fieldName}-${option}`} />
                        <Label htmlFor={`${field.fieldName}-${option}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'checkbox':
        return (
          <FormField
            key={field.id}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.fieldLabel}{field.isRequired && ' *'}</FormLabel>
                  {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case 'textarea':
        return (
          <FormField
            key={field.id}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.fieldLabel}{field.isRequired && ' *'}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder || ''}
                    {...formField}
                  />
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return (
          <FormField
            key={field.id}
            {...commonProps}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.fieldLabel}{field.isRequired && ' *'}</FormLabel>
                <FormControl>
                  <Input
                    type={field.fieldType}
                    placeholder={field.placeholder || ''}
                    {...formField}
                  />
                </FormControl>
                {field.helpText && <FormDescription>{field.helpText}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  const onSubmit = async (data: any) => {
    // Form data will be passed to checkout form
  };

  if (authLoading || serviceLoading || fieldsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ParaFortLoader />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600">The requested service could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{service.name}</h1>
          <p className="text-gray-600 mt-2">{service.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Information and Custom Fields */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {customFields.length > 0 ? (
                      customFields
                        .sort((a, b) => a.displayOrder - b.displayOrder)
                        .map(renderCustomField)
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No additional information required for this service.</p>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm 
                  service={service} 
                  customFields={customFields}
                  formData={form.getValues()}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCheckout;