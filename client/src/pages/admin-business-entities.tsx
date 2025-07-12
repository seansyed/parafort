import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Building, 
  Edit3, 
  Save, 
  X, 
  Search, 
  Filter,
  Eye,
  MapPin,
  Calendar,
  Hash,
  User,
  Phone,
  Mail
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BusinessEntity {
  id: string;
  name: string;
  entityType: string;
  state: string;
  status: string;
  ein: string;
  einStatus: string;
  registeredAgent: string;
  filedDate: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  subscriptionPlanId: number;
  subscriptionStatus: string;
}

interface EditFormData {
  name: string;
  ein: string;
  einStatus: string;
  registeredAgent: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
}

export default function AdminBusinessEntities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingEntity, setEditingEntity] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    ein: '',
    einStatus: 'not_applied',
    registeredAgent: '',
    contactEmail: '',
    contactPhone: '',
    status: 'active'
  });

  // Fetch business entities
  const { data: entities = [], isLoading, error } = useQuery({
    queryKey: ['/api/admin/business-entities'],
    select: (data: BusinessEntity[]) => data || []
  });

  // Update business entity mutation
  const updateEntityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EditFormData }) => {
      console.log('Frontend: About to update entity', id, 'with data:', data);
      const response = await apiRequest('PUT', `/api/admin/business-entities/${id}`, data);
      console.log('Frontend: Update response:', response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/admin/business-entities']);
      setEditingEntity(null);
      toast({
        title: "Success",
        description: "Business entity updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update business entity",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEinStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'not_applied': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startEditing = (entity: BusinessEntity) => {
    setEditingEntity(entity.id);
    setEditFormData({
      name: entity.name,
      ein: entity.ein || '',
      einStatus: entity.einStatus || 'not_applied',
      registeredAgent: entity.registeredAgent || '',
      contactEmail: entity.contactEmail || '',
      contactPhone: entity.contactPhone || '',
      status: entity.status || 'active'
    });
  };

  const cancelEditing = () => {
    setEditingEntity(null);
    setEditFormData({
      name: '',
      ein: '',
      einStatus: 'not_applied',
      registeredAgent: '',
      contactEmail: '',
      contactPhone: '',
      status: 'active'
    });
  };

  const handleSave = () => {
    if (!editingEntity) return;
    updateEntityMutation.mutate({
      id: editingEntity,
      data: editFormData
    });
  };

  // Filter entities
  const filteredEntities = entities.filter((entity) => {
    const matchesSearch = (entity.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (entity.ein?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (entity.contactEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entity.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Building className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg font-semibold">Failed to load business entities</p>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Entities Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage business entities, EIN numbers, and contact information
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {filteredEntities.length} entities
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by business name, EIN, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Entities List */}
      <div className="space-y-4">
        {filteredEntities.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No business entities found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Business entities will appear here once created'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEntities.map((entity) => (
            <Card key={entity.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-blue-500" />
                    <div>
                      <CardTitle className="text-xl">{entity.name || 'Unnamed Entity'}</CardTitle>
                      <CardDescription>
                        {entity.entityType} • {entity.state} • ID: {entity.id}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(entity.status || 'unknown')}>
                      {(entity.status || 'unknown').toUpperCase()}
                    </Badge>
                    {editingEntity === entity.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={updateEntityMutation.isPending}
                          style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: updateEntityMutation.isPending ? 'not-allowed' : 'pointer',
                            opacity: updateEntityMutation.isPending ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseOver={(e) => {
                            if (!updateEntityMutation.isPending) {
                              e.currentTarget.style.backgroundColor = '#15803d';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!updateEntityMutation.isPending) {
                              e.currentTarget.style.backgroundColor = '#16a34a';
                            }
                          }}
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          disabled={updateEntityMutation.isPending}
                          style={{
                            backgroundColor: 'white',
                            color: '#374151',
                            padding: '6px 12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            cursor: updateEntityMutation.isPending ? 'not-allowed' : 'pointer',
                            opacity: updateEntityMutation.isPending ? 0.6 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          onMouseOver={(e) => {
                            if (!updateEntityMutation.isPending) {
                              e.currentTarget.style.backgroundColor = '#f9fafb';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!updateEntityMutation.isPending) {
                              e.currentTarget.style.backgroundColor = 'white';
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(entity)}
                        style={{
                          backgroundColor: 'white',
                          color: '#374151',
                          padding: '6px 12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'white';
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingEntity === entity.id ? (
                  /* Edit Form */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Business Name</Label>
                        <Input
                          id="name"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="ein">EIN Number</Label>
                        <Input
                          id="ein"
                          value={editFormData.ein}
                          onChange={(e) => setEditFormData({...editFormData, ein: e.target.value})}
                          placeholder="XX-XXXXXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="einStatus">EIN Status</Label>
                        <select
                          id="einStatus"
                          value={editFormData.einStatus}
                          onChange={(e) => setEditFormData({...editFormData, einStatus: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="not_applied">Not Applied</option>
                          <option value="applied">Applied</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="registeredAgent">Registered Agent</Label>
                        <Input
                          id="registeredAgent"
                          value={editFormData.registeredAgent}
                          onChange={(e) => setEditFormData({...editFormData, registeredAgent: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={editFormData.contactEmail}
                          onChange={(e) => setEditFormData({...editFormData, contactEmail: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input
                          id="contactPhone"
                          value={editFormData.contactPhone}
                          onChange={(e) => setEditFormData({...editFormData, contactPhone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Display Information */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">EIN:</span>
                        <span className="font-mono">{entity.ein || 'Not Available'}</span>
                        <Badge variant="outline" className={getEinStatusColor(entity.einStatus)}>
                          {entity.einStatus?.replace('_', ' ').toUpperCase() || 'NOT SET'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Registered Agent:</span>
                        <span>{entity.registeredAgent || 'Not Set'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Email:</span>
                        <span>{entity.contactEmail || 'Not Available'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Phone:</span>
                        <span>{entity.contactPhone || 'Not Available'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Filed:</span>
                        <span>{entity.filedDate ? new Date(entity.filedDate).toLocaleDateString() : 'Not Filed'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Created:</span>
                        <span>{new Date(entity.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}