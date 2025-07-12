import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CreditCard, Plus, Trash2, Star, Edit, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';

interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  billing: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  isDefault: boolean;
  created: string;
}

interface NewPaymentMethodForm {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvc: string;
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export default function PaymentMethods() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingMethod, setEditingMethod] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US'
  });

  const [formData, setFormData] = useState<NewPaymentMethodForm>({
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US'
  });

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ['/api/payment-methods'],
    retry: false,
  });

  // Add payment method mutation
  const addPaymentMethodMutation = useMutation({
    mutationFn: async (data: NewPaymentMethodForm) => {
      return await apiRequest('POST', '/api/payment-methods', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      setShowAddCard(false);
      setFormData({
        cardNumber: '', expMonth: '', expYear: '', cvc: '', name: '',
        line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US'
      });
      toast({
        title: "Payment Method Added",
        description: "Your new payment method has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method",
        variant: "destructive",
      });
    },
  });

  // Set default payment method mutation
  const setDefaultMutation = useMutation({
    mutationFn: async (methodId: string) => {
      return await apiRequest('POST', `/api/payment-methods/${methodId}/set-default`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      toast({
        title: "Default Payment Method Updated",
        description: "Your default payment method has been updated.",
      });
    },
  });

  // Delete payment method mutation
  const deleteMethodMutation = useMutation({
    mutationFn: async (methodId: string) => {
      return await apiRequest('DELETE', `/api/payment-methods/${methodId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      toast({
        title: "Payment Method Removed",
        description: "The payment method has been removed successfully.",
      });
    },
  });

  // Update payment method mutation
  const updatePaymentMethodMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await apiRequest('PUT', `/api/payment-methods/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      setEditingMethod(null);
      toast({
        title: "Payment Method Updated",
        description: "Your billing information has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment method",
        variant: "destructive",
      });
    },
  });

  // Update billing address mutation
  const updateBillingMutation = useMutation({
    mutationFn: async ({ methodId, billing }: { methodId: string; billing: any }) => {
      return await apiRequest('PUT', `/api/payment-methods/${methodId}/billing`, billing);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      setEditingMethod(null);
      toast({
        title: "Billing Address Updated",
        description: "Your billing address has been updated successfully.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPaymentMethodMutation.mutate(formData);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const brandLogos: { [key: string]: string } = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳',
      default: '💳'
    };
    return brandLogos[brand.toLowerCase()] || brandLogos.default;
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-2">Manage your payment methods and billing information</p>
        </div>

        <div className="space-y-6">
          {/* Add New Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Add New Payment Method</span>
                </span>
                <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Card
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new credit or debit card to your account
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={formatCardNumber(formData.cardNumber)}
                          onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, '') })}
                          maxLength={19}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="expMonth">Month</Label>
                          <Select value={formData.expMonth} onValueChange={(value) => setFormData({ ...formData, expMonth: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {months.map((month) => (
                                <SelectItem key={month.value} value={month.value}>
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expYear">Year</Label>
                          <Select value={formData.expYear} onValueChange={(value) => setFormData({ ...formData, expYear: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={String(year)}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input
                            id="cvc"
                            placeholder="123"
                            value={formData.cvc}
                            onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, '') })}
                            maxLength={4}
                            required
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="name">Cardholder Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="line1">Address Line 1</Label>
                        <Input
                          id="line1"
                          placeholder="123 Main St"
                          value={formData.line1}
                          onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                        <Input
                          id="line2"
                          placeholder="Apt 4B"
                          value={formData.line2}
                          onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="NY"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="postal_code">ZIP Code</Label>
                          <Input
                            id="postal_code"
                            placeholder="10001"
                            value={formData.postal_code}
                            onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="US">United States</SelectItem>
                              <SelectItem value="CA">Canada</SelectItem>
                              <SelectItem value="GB">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setShowAddCard(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={addPaymentMethodMutation.isPending}>
                          {addPaymentMethodMutation.isPending ? 'Adding...' : 'Add Payment Method'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Existing Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Your Payment Methods</span>
              </CardTitle>
              <CardDescription>
                {paymentMethods.length === 0 
                  ? "You haven't added any payment methods yet"
                  : `${paymentMethods.length} payment method${paymentMethods.length === 1 ? '' : 's'} on file`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No payment methods added yet</p>
                  <Button onClick={() => setShowAddCard(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Payment Method
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.map((method: PaymentMethod) => (
                    <div key={method.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getCardBrandIcon(method.card.brand)}</div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium capitalize">
                                {method.card.brand} •••• {method.card.last4}
                              </span>
                              {method.isDefault && (
                                <Badge variant="default" className="text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              Expires {method.card.expMonth.toString().padStart(2, '0')}/{method.card.expYear}
                            </p>
                            <p className="text-sm text-gray-500">
                              {method.billing.name} • {method.billing.address.city}, {method.billing.address.state}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!method.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDefaultMutation.mutate(method.id)}
                              disabled={setDefaultMutation.isPending}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingMethod(method.id);
                              setEditFormData({
                                name: method.billing.name,
                                line1: method.billing.address.line1,
                                line2: method.billing.address.line2 || '',
                                city: method.billing.address.city,
                                state: method.billing.address.state,
                                postal_code: method.billing.address.postal_code,
                                country: method.billing.address.country
                              });
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteMethodMutation.mutate(method.id)}
                            disabled={deleteMethodMutation.isPending || method.isDefault}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Payment Method Dialog */}
      {editingMethod && (
        <Dialog open={!!editingMethod} onOpenChange={() => setEditingMethod(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Billing Information</DialogTitle>
              <DialogDescription>
                Update the billing information for this payment method.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updatePaymentMethodMutation.mutate({
                id: editingMethod,
                data: editFormData
              });
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_name">Full Name</Label>
                  <Input
                    id="edit_name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_line1">Address Line 1</Label>
                  <Input
                    id="edit_line1"
                    value={editFormData.line1}
                    onChange={(e) => setEditFormData({ ...editFormData, line1: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit_line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="edit_line2"
                    value={editFormData.line2}
                    onChange={(e) => setEditFormData({ ...editFormData, line2: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_city">City</Label>
                    <Input
                      id="edit_city"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_state">State</Label>
                    <Input
                      id="edit_state"
                      value={editFormData.state}
                      onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit_postal_code">ZIP Code</Label>
                    <Input
                      id="edit_postal_code"
                      value={editFormData.postal_code}
                      onChange={(e) => setEditFormData({ ...editFormData, postal_code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit_country">Country</Label>
                    <Select value={editFormData.country} onValueChange={(value) => setEditFormData({ ...editFormData, country: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditingMethod(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updatePaymentMethodMutation.isPending}>
                    {updatePaymentMethodMutation.isPending ? 'Updating...' : 'Update Billing Info'}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}