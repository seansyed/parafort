import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, DollarSign, TrendingUp, Users, Package } from "lucide-react";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  oneTimePrice: z.number().min(0, "Price must be non-negative"),
  recurringPrice: z.number().optional(),
  recurringInterval: z.enum(["monthly", "yearly"]).optional(),
  isActive: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const planSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  description: z.string().min(1, "Description is required"),
  monthlyPrice: z.number().min(0, "Monthly price must be non-negative"),
  yearlyPrice: z.number().min(0, "Yearly price must be non-negative"),
  features: z.array(z.string()).min(1, "At least one feature is required"),
  isActive: z.boolean(),
});

type PlanFormData = z.infer<typeof planSchema>;

export default function AdminPricing() {
  const [activeTab, setActiveTab] = useState<"services" | "plans">("services");
  const [editingService, setEditingService] = useState<any>(null);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ["/api/admin/services"],
    retry: false,
  });

  // Fetch subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ["/api/admin/subscription-plans"],
    retry: false,
  });

  // Service form
  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      oneTimePrice: 0,
      recurringPrice: undefined,
      recurringInterval: undefined,
      isActive: true,
    },
  });

  // Plan form
  const planForm = useForm<PlanFormData>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [],
      isActive: true,
    },
  });

  // Service mutations
  const createServiceMutation = useMutation({
    mutationFn: (data: ServiceFormData) => apiRequest("POST", "/api/admin/services", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setServiceDialogOpen(false);
      serviceForm.reset();
      toast({ title: "Success", description: "Service created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: ({ id, ...data }: ServiceFormData & { id: number }) => 
      apiRequest("PATCH", `/api/admin/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setServiceDialogOpen(false);
      setEditingService(null);
      serviceForm.reset();
      toast({ title: "Success", description: "Service updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({ title: "Success", description: "Service deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Plan mutations
  const createPlanMutation = useMutation({
    mutationFn: (data: PlanFormData) => apiRequest("POST", "/api/admin/subscription-plans", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscription-plans"] });
      setPlanDialogOpen(false);
      planForm.reset();
      toast({ title: "Success", description: "Plan created successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ id, ...data }: PlanFormData & { id: number }) => 
      apiRequest("PATCH", `/api/admin/subscription-plans/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscription-plans"] });
      setPlanDialogOpen(false);
      setEditingPlan(null);
      planForm.reset();
      toast({ title: "Success", description: "Plan updated successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/admin/subscription-plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/subscription-plans"] });
      toast({ title: "Success", description: "Plan deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleEditService = (service: any) => {
    setEditingService(service);
    serviceForm.reset({
      name: service.name,
      description: service.description || "",
      category: service.category || "",
      oneTimePrice: service.oneTimePrice || 0,
      recurringPrice: service.recurringPrice || undefined,
      recurringInterval: service.recurringInterval || undefined,
      isActive: service.isActive,
    });
    setServiceDialogOpen(true);
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    planForm.reset({
      name: plan.name,
      description: plan.description || "",
      monthlyPrice: plan.monthlyPrice || 0,
      yearlyPrice: plan.yearlyPrice || 0,
      features: plan.features || [],
      isActive: plan.isActive,
    });
    setPlanDialogOpen(true);
  };

  const onServiceSubmit = (data: ServiceFormData) => {
    if (editingService) {
      updateServiceMutation.mutate({ ...data, id: editingService.id });
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const onPlanSubmit = (data: PlanFormData) => {
    if (editingPlan) {
      updatePlanMutation.mutate({ ...data, id: editingPlan.id });
    } else {
      createPlanMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pricing Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage services and subscription plans pricing</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Package className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-slate-600">
              {services.filter((s: any) => s.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Plans</CardTitle>
            <Users className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-slate-600">
              {plans.filter((p: any) => p.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Service Price</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${services.length > 0 ? 
                Math.round(services.reduce((sum: number, s: any) => sum + (s.oneTimePrice || 0), 0) / services.length) : 0}
            </div>
            <p className="text-xs text-slate-600">One-time services</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Potential</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${plans.reduce((sum: number, p: any) => sum + (p.monthlyPrice || 0), 0)}
            </div>
            <p className="text-xs text-slate-600">Monthly potential</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-2 px-1 ${activeTab === "services" 
            ? "border-b-2 border-blue-600 text-blue-600 font-medium" 
            : "text-slate-600 hover:text-slate-900"}`}
        >
          Services Management
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`pb-2 px-1 ${activeTab === "plans" 
            ? "border-b-2 border-blue-600 text-blue-600 font-medium" 
            : "text-slate-600 hover:text-slate-900"}`}
        >
          Subscription Plans
        </button>
      </div>

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Services</h2>
            <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingService(null);
                    serviceForm.reset();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                  <DialogDescription>
                    {editingService ? "Update service details" : "Create a new service offering"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...serviceForm}>
                  <form onSubmit={serviceForm.handleSubmit(onServiceSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={serviceForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="business_formation">Business Formation</SelectItem>
                                  <SelectItem value="compliance">Compliance</SelectItem>
                                  <SelectItem value="mailbox">Mailbox Services</SelectItem>
                                  <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                                  <SelectItem value="payroll">Payroll</SelectItem>
                                  <SelectItem value="tax_filing">Tax Filing</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={serviceForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={serviceForm.control}
                        name="oneTimePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>One-time Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="recurringPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recurring Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={serviceForm.control}
                        name="recurringInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Interval</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select interval" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={serviceForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Service</FormLabel>
                            <div className="text-sm text-slate-600">
                              Service is available for purchase
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setServiceDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {editingService ? "Update" : "Create"} Service
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {servicesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid gap-4">
              {services.map((service: any) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {service.name}
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditService(service)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteServiceMutation.mutate(service.id)}
                          disabled={deleteServiceMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-600">Category: {service.category}</div>
                        <div className="text-lg font-semibold">
                          ${service.oneTimePrice}
                          {service.recurringPrice && (
                            <span className="text-sm font-normal">
                              {" + "}${service.recurringPrice}/{service.recurringInterval}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Subscription Plans</h2>
            <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => {
                    setEditingPlan(null);
                    planForm.reset();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingPlan ? "Edit Plan" : "Add New Plan"}</DialogTitle>
                  <DialogDescription>
                    {editingPlan ? "Update plan details" : "Create a new subscription plan"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...planForm}>
                  <form onSubmit={planForm.handleSubmit(onPlanSubmit)} className="space-y-4">
                    <FormField
                      control={planForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plan Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={planForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={planForm.control}
                        name="monthlyPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={planForm.control}
                        name="yearlyPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yearly Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={planForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active Plan</FormLabel>
                            <div className="text-sm text-slate-600">
                              Plan is available for subscription
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setPlanDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createPlanMutation.isPending || updatePlanMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {editingPlan ? "Update" : "Create"} Plan
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {plansLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid gap-4">
              {plans.map((plan: any) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {plan.name}
                          <Badge variant={plan.isActive ? "default" : "secondary"}>
                            {plan.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePlanMutation.mutate(plan.id)}
                          disabled={deletePlanMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-semibold">
                          ${plan.monthlyPrice}/month or ${plan.yearlyPrice}/year
                        </div>
                        {plan.features && plan.features.length > 0 && (
                          <div className="text-sm text-slate-600 mt-2">
                            Features: {plan.features.join(", ")}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}