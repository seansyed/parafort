import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, DollarSign, Settings, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SubscriptionPlan, Service, PlanService } from '@shared/schema';

// Extended interface for plan services with service details from the join query
interface PlanServiceWithDetails {
  id: number;
  serviceId: number;
  includedInPlan: boolean | null;
  availableAsAddon: boolean | null;
  addonType: string | null;
  serviceName: string;
  serviceDescription: string;
  oneTimePrice: string | null;
  recurringPrice: string | null;
}

interface PlanFormData {
  name: string;
  description: string;
  yearlyPrice: string;
  features: string[];
  isActive: boolean;
}

interface ServiceFormData {
  name: string;
  description: string;
  category: string;
  oneTimePrice: string | null;
  recurringPrice: string | null;
  recurringInterval: string | null;
  expeditedPrice: string | null;
  isActive: boolean;
}

export default function AdminSubscriptionManagement() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState(false);
  const [isPlanServicesOpen, setIsPlanServicesOpen] = useState(false);
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Fetch subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ['/api/subscription-plans'],
  });

  // Fetch services (admin endpoint shows all services including inactive)
  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ['/api/admin/services'],
  });

  // Fetch plan services for selected plan
  const { data: planServices = [] } = useQuery<PlanServiceWithDetails[]>({
    queryKey: ['/api/admin/plan-services', selectedPlan?.id],
    queryFn: selectedPlan?.id 
      ? () => fetch(`/api/admin/plan-services?planId=${selectedPlan.id}`).then(res => res.json())
      : undefined,
    enabled: !!selectedPlan?.id,
  });

  // Create plan mutation
  const createPlanMutation = useMutation({
    mutationFn: (data: PlanFormData) => 
      apiRequest('POST', '/api/admin/subscription-plans', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-plans'] });
      setIsCreatePlanOpen(false);
      toast({ title: 'Success', description: 'Subscription plan created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create subscription plan', variant: 'destructive' });
    },
  });

  // Create service mutation
  const createServiceMutation = useMutation({
    mutationFn: (data: ServiceFormData) => 
      apiRequest('POST', '/api/admin/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      setIsCreateServiceOpen(false);
      toast({ title: 'Success', description: 'Service created successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create service', variant: 'destructive' });
    },
  });

  // Update plan mutation
  const updatePlanMutation = useMutation({
    mutationFn: (data: { id: number } & PlanFormData) => 
      apiRequest('PUT', `/api/admin/subscription-plans/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscription-plans'] });
      setIsEditPlanOpen(false);
      setEditingPlan(null);
      toast({ title: 'Success', description: 'Plan updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update plan', variant: 'destructive' });
    },
  });

  // Update service mutation
  const updateServiceMutation = useMutation({
    mutationFn: (data: { id: number } & ServiceFormData) => 
      apiRequest('PUT', `/api/admin/services/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      setIsEditServiceOpen(false);
      setEditingService(null);
      toast({ title: 'Success', description: 'Service updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update service', variant: 'destructive' });
    },
  });

  // Add service to plan mutation
  const addServiceToPlanMutation = useMutation({
    mutationFn: (data: { planId: number; serviceId: number; includedInPlan: boolean; availableAsAddon: boolean }) => 
      apiRequest('POST', '/api/admin/plan-services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/plan-services', selectedPlan?.id] });
      toast({ title: 'Success', description: 'Service added to plan successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add service to plan', variant: 'destructive' });
    },
  });

  // Delete service mutation
  const deleteServiceMutation = useMutation({
    mutationFn: (serviceId: number) => 
      apiRequest('DELETE', `/api/admin/services/${serviceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/services'] });
      toast({ title: 'Success', description: 'Service deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete service', variant: 'destructive' });
    },
  });

  // Remove service from plan mutation
  const removeServiceFromPlanMutation = useMutation({
    mutationFn: (planServiceId: number) => 
      apiRequest('DELETE', `/api/admin/plan-services/${planServiceId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/plan-services', selectedPlan?.id] });
      toast({ title: 'Success', description: 'Service removed from plan successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to remove service from plan', variant: 'destructive' });
    },
  });

  const PlanForm = ({ onSubmit, initialData }: { onSubmit: (data: PlanFormData) => void; initialData?: Partial<PlanFormData> }) => {
    const [formData, setFormData] = useState<PlanFormData>({
      name: initialData?.name || '',
      description: initialData?.description || '',
      yearlyPrice: initialData?.yearlyPrice || '0',
      features: initialData?.features || [],
      isActive: initialData?.isActive ?? true,
    });
    const [featureInput, setFeatureInput] = useState('');

    // Update form data when initialData changes
    useEffect(() => {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          yearlyPrice: initialData.yearlyPrice || '0',
          features: initialData.features || [],
          isActive: initialData.isActive ?? true,
        });
      }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    const addFeature = () => {
      if (featureInput.trim()) {
        setFormData(prev => ({
          ...prev,
          features: [...prev.features, featureInput.trim()]
        }));
        setFeatureInput('');
      }
    };

    const removeFeature = (index: number) => {
      setFormData(prev => ({
        ...prev,
        features: prev.features.filter((_, i) => i !== index)
      }));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Plan Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Professional Plan"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Plan description..."
          />
        </div>

        <div>
          <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
          <Input
            id="yearlyPrice"
            type="number"
            step="0.01"
            value={formData.yearlyPrice}
            onChange={(e) => setFormData(prev => ({ ...prev, yearlyPrice: e.target.value }))}
            placeholder="e.g., 1499.00"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            ${formData.yearlyPrice} per year
          </p>
        </div>

        <div>
          <Label>Features</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              placeholder="Add a feature..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(index)}>
                {feature} ×
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: !!checked }))}
          />
          <Label htmlFor="isActive">Active Plan</Label>
        </div>

        <Button type="submit" className="w-full bg-green-500 hover:bg-[#E54F00]">
          Create Plan
        </Button>
      </form>
    );
  };

  const ServiceForm = ({ onSubmit, initialData }: { onSubmit: (data: ServiceFormData) => void; initialData?: Partial<ServiceFormData> }) => {
    const [formData, setFormData] = useState<ServiceFormData>({
      name: initialData?.name || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      oneTimePrice: initialData?.oneTimePrice || null,
      recurringPrice: initialData?.recurringPrice || null,
      recurringInterval: initialData?.recurringInterval || null,
      expeditedPrice: initialData?.expeditedPrice || null,
      isActive: initialData?.isActive ?? true,
    });

    // Update form data when initialData changes
    useEffect(() => {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          category: initialData.category || '',
          oneTimePrice: initialData.oneTimePrice || null,
          recurringPrice: initialData.recurringPrice || null,
          recurringInterval: initialData.recurringInterval || null,
          expeditedPrice: initialData.expeditedPrice || null,
          isActive: initialData.isActive ?? true,
        });
      }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="serviceName">Service Name</Label>
          <Input
            id="serviceName"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., EIN Number Application"
            required
          />
        </div>

        <div>
          <Label htmlFor="serviceDescription">Description</Label>
          <Textarea
            id="serviceDescription"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Service description..."
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Formation">Formation</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="Banking">Banking</SelectItem>
              <SelectItem value="Tax">Tax</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Mail">Mail Services</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="oneTimePrice">One-time Price ($)</Label>
          <Input
            id="oneTimePrice"
            type="number"
            step="0.01"
            value={formData.oneTimePrice || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, oneTimePrice: e.target.value || null }))}
            placeholder="e.g., 99.00"
          />
        </div>

        <div>
          <Label htmlFor="recurringPrice">Recurring Price ($)</Label>
          <Input
            id="recurringPrice"
            type="number"
            step="0.01"
            value={formData.recurringPrice || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, recurringPrice: e.target.value || null }))}
            placeholder="e.g., 29.00"
          />
        </div>

        <div>
          <Label htmlFor="recurringInterval">Recurring Interval</Label>
          <Select value={formData.recurringInterval || undefined} onValueChange={(value) => setFormData(prev => ({ ...prev, recurringInterval: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="expeditedPrice">Expedited Processing Price ($)</Label>
          <Input
            id="expeditedPrice"
            type="number"
            step="0.01"
            value={formData.expeditedPrice || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, expeditedPrice: e.target.value || null }))}
            placeholder="e.g., 50.00"
          />
          <p className="text-sm text-gray-500 mt-1">
            Additional charge for expedited processing when ordered individually (if $1 or more, will be added to checkout)
          </p>
        </div>

        <Button type="submit" className="w-full bg-green-500 hover:bg-[#E54F00]">
          Create Service
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage subscription plans, services, and their relationships</p>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Subscription Plans</h2>
              <Dialog open={isCreatePlanOpen} onOpenChange={setIsCreatePlanOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-[#E54F00]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Subscription Plan</DialogTitle>
                  </DialogHeader>
                  <PlanForm onSubmit={(data) => createPlanMutation.mutate(data)} />
                </DialogContent>
              </Dialog>
            </div>

            {plansLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card key={plan.id} className="border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm">{plan.description}</p>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-2xl font-bold">${parseFloat(plan.yearlyPrice).toFixed(0)}</span>
                        <span className="text-gray-500">/year</span>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {plan.features?.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {plan.features && plan.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{plan.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setSelectedPlan(plan);
                            setIsPlanServicesOpen(true);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Services
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingPlan(plan);
                            setIsEditPlanOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Services</h2>
              <Dialog open={isCreateServiceOpen} onOpenChange={setIsCreateServiceOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-[#E54F00]">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Service</DialogTitle>
                  </DialogHeader>
                  <ServiceForm onSubmit={(data) => createServiceMutation.mutate(data)} />
                </DialogContent>
              </Dialog>
            </div>

            {servicesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-12 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (services && services.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">{service.category}</Badge>
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 text-sm">{service.description}</p>
                      
                      <div className="space-y-2">
                        {service.oneTimePrice && (
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-blue-500" />
                            <span className="text-sm">One-time: ${parseFloat(service.oneTimePrice).toFixed(2)}</span>
                          </div>
                        )}
                        {service.recurringPrice && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="text-sm">
                              Recurring: ${parseFloat(service.recurringPrice).toFixed(2)}/{service.recurringInterval}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingService(service);
                            setIsEditServiceOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant={service.isActive ? "secondary" : "default"}
                          size="sm"
                          onClick={() => {
                            updateServiceMutation.mutate({
                              id: service.id,
                              ...service,
                              isActive: !service.isActive
                            });
                          }}
                          disabled={updateServiceMutation.isPending}
                        >
                          {service.isActive ? "Deactivate" : "Activate"}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${service.name}"? This action cannot be undone.`)) {
                              deleteServiceMutation.mutate(service.id);
                            }
                          }}
                          disabled={deleteServiceMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No services found. Create your first service to get started.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">{(plans || []).length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-500">{(services || []).length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {(plans || []).filter(p => p.isActive).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Plan Dialog */}
        <Dialog open={isEditPlanOpen} onOpenChange={(open) => {
          setIsEditPlanOpen(open);
          if (!open) setEditingPlan(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Plan: {editingPlan?.name}</DialogTitle>
            </DialogHeader>
            {editingPlan && (
              <PlanForm 
                key={editingPlan.id}
                onSubmit={(data) => {
                  updatePlanMutation.mutate({ id: editingPlan.id, ...data });
                  setIsEditPlanOpen(false);
                  setEditingPlan(null);
                }}
                initialData={{
                  name: editingPlan.name,
                  description: editingPlan.description || '',
                  yearlyPrice: editingPlan.yearlyPrice,
                  features: editingPlan.features || [],
                  isActive: editingPlan.isActive
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditServiceOpen} onOpenChange={(open) => {
          setIsEditServiceOpen(open);
          if (!open) setEditingService(null);
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Service: {editingService?.name}</DialogTitle>
            </DialogHeader>
            {editingService && (
              <ServiceForm 
                key={editingService.id}
                onSubmit={(data) => {
                  updateServiceMutation.mutate({ id: editingService.id, ...data });
                  setIsEditServiceOpen(false);
                  setEditingService(null);
                }}
                initialData={{
                  name: editingService.name,
                  description: editingService.description || '',
                  category: editingService.category || '',
                  oneTimePrice: editingService.oneTimePrice,
                  recurringPrice: editingService.recurringPrice,
                  recurringInterval: editingService.recurringInterval,
                  expeditedPrice: editingService.expeditedPrice,
                  isActive: editingService.isActive
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Plan Services Management Dialog */}
        <Dialog open={isPlanServicesOpen} onOpenChange={setIsPlanServicesOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                Manage Services for {selectedPlan?.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Available Services</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {services.map((service) => {
                      const isInPlan = planServices.some(ps => ps.serviceId === service.id);
                      return (
                        <Card key={service.id} className={`p-4 cursor-pointer hover:bg-gray-50 ${isInPlan ? 'bg-blue-50 border-blue-200' : ''}`}>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-gray-600">{service.description}</p>
                              <div className="flex gap-2 mt-2">
                                {service.oneTimePrice && (
                                  <Badge variant="outline">One-time: ${parseFloat(service.oneTimePrice).toFixed(2)}</Badge>
                                )}
                                {service.recurringPrice && (
                                  <Badge variant="outline">
                                    Recurring: ${parseFloat(service.recurringPrice).toFixed(2)}/{service.recurringInterval}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {!isInPlan && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    if (selectedPlan) {
                                      addServiceToPlanMutation.mutate({
                                        planId: selectedPlan.id,
                                        serviceId: service.id,
                                        includedInPlan: true,
                                        availableAsAddon: false,
                                      });
                                    }
                                  }}
                                >
                                  Include
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (selectedPlan) {
                                      addServiceToPlanMutation.mutate({
                                        planId: selectedPlan.id,
                                        serviceId: service.id,
                                        includedInPlan: false,
                                        availableAsAddon: true,
                                      });
                                    }
                                  }}
                                >
                                  Add-on
                                </Button>
                              </div>
                            )}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Plan Services</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {planServices.map((planService) => (
                      <Card key={planService.id} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{planService.serviceName}</h4>
                            <p className="text-sm text-gray-600">{planService.serviceDescription}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant={planService.includedInPlan ? "default" : "secondary"}>
                                {planService.includedInPlan ? "Included" : "Add-on"}
                              </Badge>
                              {planService.addonType && (
                                <Badge variant="outline">{planService.addonType}</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              removeServiceFromPlanMutation.mutate(planService.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}