import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatAsDollars, prepareForForm, prepareForDatabase } from '@/lib/priceUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Edit2,
  Trash2,
  X, 
  DollarSign, 
  Settings, 
  Package,
  Building,
  Mail,
  Calculator,
  FileText,
  Users,
  Star,
  UserCheck,
  CheckCircle,
  Upload,
  Download,
  Eye,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';

interface PlanFormData {
  name: string;
  description: string;
  category: string;
  serviceType: string;
  oneTimePrice: string;
  recurringPrice: string;
  recurringInterval: string;
  expeditedPrice: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  features: string[];
  entityTypes: string[];
  employeeLimit: string;
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
}

interface MailboxPlanFormData {
  name: string;
  displayName: string;
  monthlyPrice: string;
  businessAddresses: number;
  mailItemsPerMonth: number;
  costPerExtraItem: string;
  shippingCost: string;
  secureShredding: boolean;
  checkDepositFee: string;
  checksIncluded: number;
  additionalCheckFee: string;
  isActive: boolean;
  isMostPopular: boolean;
}

interface PayrollPlanFormData {
  name: string;
  displayName: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  employeeLimit: number;
  additionalEmployeeCost: string; // $15/month per additional employee
  features: string[];
  isActive: boolean;
  isMostPopular: boolean;
}

interface RegisteredAgentPlanFormData {
  name: string;
  displayName: string;
  description: string;
  yearlyPrice: string;
  expeditedPrice: string;
  states: string[];
  features: string[];
  isActive: boolean;
  isMostPopular: boolean;
}

// US States for Registered Agent services
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const defaultPlanForm: PlanFormData = {
  name: '',
  description: '',
  category: '',
  serviceType: 'subscription_plan',
  oneTimePrice: '',
  recurringPrice: '',
  recurringInterval: 'monthly',
  expeditedPrice: '',
  monthlyPrice: '',
  yearlyPrice: '',
  features: [],
  entityTypes: [],
  employeeLimit: '',
  isActive: true,
  isPopular: false,
  sortOrder: 0
};

const defaultMailboxForm: MailboxPlanFormData = {
  name: '',
  displayName: '',
  monthlyPrice: '',
  businessAddresses: 1,
  mailItemsPerMonth: 10,
  costPerExtraItem: '',
  shippingCost: '',
  secureShredding: true,
  checkDepositFee: '',
  checksIncluded: 5,
  additionalCheckFee: '',
  isActive: true,
  isMostPopular: false
};

const defaultPayrollForm: PayrollPlanFormData = {
  name: '',
  displayName: '',
  description: '',
  monthlyPrice: '',
  yearlyPrice: '',
  employeeLimit: 0,
  additionalEmployeeCost: '15.00', // $15/month per additional employee
  features: [],
  isActive: true,
  isMostPopular: false
};

const defaultRegisteredAgentForm: RegisteredAgentPlanFormData = {
  name: '',
  displayName: '',
  description: '',
  yearlyPrice: '',
  expeditedPrice: '',
  states: [],
  features: [],
  isActive: true,
  isMostPopular: false
};

// Document Management Section Component
function DocumentManagementSection() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedService, setSelectedService] = useState<string>('general');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestForm, setRequestForm] = useState({
    clientId: '',
    documentName: '',
    description: '',
    serviceType: 'general',
    dueDate: '',
    priority: 'normal'
  });

  // Fetch all documents
  const { data: allDocuments, isLoading: loadingDocuments, refetch: refetchDocuments } = useQuery({
    queryKey: ['/api/admin/documents'],
    retry: false,
  });

  // Fetch all clients for document requests
  const { data: allClients, isLoading: loadingClients } = useQuery({
    queryKey: ['/api/admin/clients'],
    retry: false,
  });

  // Fetch document requests
  const { data: documentRequests, isLoading: loadingRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['/api/admin/document-requests'],
    retry: false,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Please select a client for this document",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('serviceType', selectedService);
      formData.append('clientId', selectedClient);

      const response = await fetch('/api/admin/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      setSelectedFile(null);
      setSelectedClient('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      refetchDocuments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCreateRequest = async () => {
    if (!requestForm.clientId || !requestForm.documentName || !requestForm.serviceType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/document-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestForm),
      });

      if (!response.ok) {
        throw new Error('Failed to create document request');
      }

      toast({
        title: "Success",
        description: "Document request created successfully",
      });

      setRequestForm({
        clientId: '',
        documentName: '',
        description: '',
        serviceType: 'general',
        dueDate: '',
        priority: 'normal'
      });
      setShowRequestDialog(false);
      refetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create document request",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (documentId: number, filename: string) => {
    try {
      const response = await fetch(`/api/admin/documents/${documentId}/download`);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download document",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (documentId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/admin/documents/${documentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Delete failed');

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      refetchDocuments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Document Management</h2>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            Upload documents for clients to access in their service portals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="client-select">Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {allClients && allClients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="service-type">Service Type</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="formation">Business Formation</SelectItem>
                  <SelectItem value="tax">Tax Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="document-file">Document File</Label>
              <Input
                id="document-file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </div>
          </div>
          
          {selectedFile && (
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || !selectedClient || uploading}
              className="bg-green-500 hover:bg-green-600"
            >
              {uploading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setShowRequestDialog(true)}
              className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Request Document
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Document Request</DialogTitle>
            <DialogDescription>
              Request a specific document from a client
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="request-client">Client</Label>
              <Select 
                value={requestForm.clientId} 
                onValueChange={(value) => setRequestForm({...requestForm, clientId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {allClients && allClients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName} ({client.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="request-service">Service Type</Label>
              <Select 
                value={requestForm.serviceType} 
                onValueChange={(value) => setRequestForm({...requestForm, serviceType: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="bookkeeping">Bookkeeping</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="formation">Business Formation</SelectItem>
                  <SelectItem value="tax">Tax Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="request-document-name">Document Name</Label>
              <Input
                id="request-document-name"
                value={requestForm.documentName}
                onChange={(e) => setRequestForm({...requestForm, documentName: e.target.value})}
                placeholder="e.g., Q3 Bank Statements"
              />
            </div>

            <div>
              <Label htmlFor="request-description">Description (Optional)</Label>
              <Input
                id="request-description"
                value={requestForm.description}
                onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                placeholder="Additional instructions..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="request-due-date">Due Date (Optional)</Label>
                <Input
                  id="request-due-date"
                  type="date"
                  value={requestForm.dueDate}
                  onChange={(e) => setRequestForm({...requestForm, dueDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="request-priority">Priority</Label>
                <Select 
                  value={requestForm.priority} 
                  onValueChange={(value) => setRequestForm({...requestForm, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRequest}
              className="bg-green-500 hover:bg-green-600"
            >
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Document Requests</CardTitle>
          <CardDescription>
            Track and manage document requests sent to clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRequests ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : documentRequests && documentRequests.length > 0 ? (
            <div className="space-y-3">
              {documentRequests.map((request: any) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      request.status === 'completed' ? 'bg-green-500' :
                      request.status === 'in_progress' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium">{request.documentName}</p>
                      <p className="text-sm text-gray-500">
                        Client: {request.clientName} • {request.serviceType} • 
                        Priority: {request.priority} • Status: {request.status}
                      </p>
                      {request.description && (
                        <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      )}
                      {request.dueDate && (
                        <p className="text-sm text-orange-600 mt-1">
                          Due: {new Date(request.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {request.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-green-500 border-green-500 hover:bg-green-500 hover:text-white"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Contact Support
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Plan
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No document requests created yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Manage documents available to clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingDocuments ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : allDocuments && allDocuments.length > 0 ? (
            <div className="space-y-3">
              {allDocuments.map((document: any) => (
                <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{document.filename}</p>
                      <p className="text-sm text-gray-500">
                        {document.serviceType} • Uploaded {new Date(document.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(document.id, document.filename)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents uploaded yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPlanManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('business-formation');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMailboxDialogOpen, setIsMailboxDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [planForm, setPlanForm] = useState<PlanFormData>(defaultPlanForm);
  const [mailboxForm, setMailboxForm] = useState<MailboxPlanFormData>(defaultMailboxForm);
  const [payrollForm, setPayrollForm] = useState<PayrollPlanFormData>(defaultPayrollForm);
  const [registeredAgentForm, setRegisteredAgentForm] = useState<RegisteredAgentPlanFormData>(defaultRegisteredAgentForm);
  const [isPayrollEditOpen, setIsPayrollEditOpen] = useState(false);
  const [isRegisteredAgentDialogOpen, setIsRegisteredAgentDialogOpen] = useState(false);
  const [newFeature, setNewFeature] = useState('');
  const [newEntityType, setNewEntityType] = useState('');

  // Fetch all services/plans by category
  const { data: businessFormationPlans, isLoading: loadingBusinessPlans } = useQuery({
    queryKey: ['/api/services?category=Formation'],
  });

  const { data: mailboxPlans, isLoading: loadingMailboxPlans } = useQuery({
    queryKey: ['/api/mailbox-plans'],
  });

  const { data: bookkeepingPlans, isLoading: loadingBookkeepingPlans } = useQuery({
    queryKey: ['/api/admin/bookkeeping/plans'],
  });

  const { data: payrollPlans = [], isLoading: loadingPayrollPlans } = useQuery({
    queryKey: ['/api/admin/payroll/plans'],
  });

  const { data: taxPlans, isLoading: loadingTaxPlans } = useQuery({
    queryKey: ['/api/services?category=Tax'],
  });

  const { data: licensePlans, isLoading: loadingLicensePlans } = useQuery({
    queryKey: ['/api/services?category=Business%20Licenses'],
  });

  const { data: allFbnPlans, isLoading: loadingFbnPlans } = useQuery({
    queryKey: ['/api/services?category=Compliance'],
  });

  // Filter to only show FBN-specific plans
  const fbnPlans = allFbnPlans?.filter((plan: any) => 
    plan.name?.toLowerCase().includes('fictitious') || 
    plan.name?.toLowerCase().includes('dba') ||
    plan.description?.toLowerCase().includes('fictitious business name')
  ) || [];

  const { data: registeredAgentPlans, isLoading: loadingRegisteredAgentPlans } = useQuery({
    queryKey: ['/api/admin/registered-agent/plans'],
  });

  // Mutations for Registered Agent plans
  const createRegisteredAgentMutation = useMutation({
    mutationFn: async (data: RegisteredAgentPlanFormData) => {
      return await apiRequest('POST', '/api/admin/registered-agent/plans', {
        ...data,
        yearlyPrice: data.yearlyPrice,
        expeditedPrice: data.expeditedPrice || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/registered-agent/plans'] });
      setIsRegisteredAgentDialogOpen(false);
      setRegisteredAgentForm(defaultRegisteredAgentForm);
      toast({
        title: "Success",
        description: "Registered Agent plan created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create plan",
        variant: "destructive",
      });
    },
  });

  const updateRegisteredAgentMutation = useMutation({
    mutationFn: async (data: { id: number } & RegisteredAgentPlanFormData) => {
      const { id, ...updateData } = data;
      return await apiRequest('PUT', `/api/admin/registered-agent/plans/${id}`, {
        ...updateData,
        yearlyPrice: updateData.yearlyPrice,
        expeditedPrice: updateData.expeditedPrice || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/registered-agent/plans'] });
      setIsRegisteredAgentDialogOpen(false);
      setRegisteredAgentForm(defaultRegisteredAgentForm);
      setEditingPlan(null);
      toast({
        title: "Success",
        description: "Registered Agent plan updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update plan",
        variant: "destructive",
      });
    },
  });

  const deleteRegisteredAgentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/admin/registered-agent/plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/registered-agent/plans'] });
      toast({
        title: "Success",
        description: "Registered Agent plan deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete plan",
        variant: "destructive",
      });
    },
  });

  // Handle form functions for Registered Agent
  const handleEditRegisteredAgentPlan = (plan: any) => {
    setRegisteredAgentForm({
      name: plan.name || '',
      displayName: plan.displayName || '',
      description: plan.description || '',
      yearlyPrice: plan.yearlyPrice?.toString() || '',
      expeditedPrice: plan.expeditedPrice?.toString() || '',
      states: plan.states || [],
      features: plan.features || [],
      isActive: plan.isActive ?? true,
      isMostPopular: plan.isMostPopular ?? false,
    });
    setEditingPlan(plan);
    setIsRegisteredAgentDialogOpen(true);
  };

  const handleRegisteredAgentSubmit = () => {
    if (editingPlan) {
      updateRegisteredAgentMutation.mutate({ id: editingPlan.id, ...registeredAgentForm });
    } else {
      createRegisteredAgentMutation.mutate(registeredAgentForm);
    }
  };

  const addRegisteredAgentFeature = () => {
    if (newFeature.trim() && !registeredAgentForm.features.includes(newFeature.trim())) {
      setRegisteredAgentForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeRegisteredAgentFeature = (feature: string) => {
    setRegisteredAgentForm(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const toggleRegisteredAgentState = (state: string) => {
    setRegisteredAgentForm(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state]
    }));
  };

  const selectAllStates = () => {
    setRegisteredAgentForm(prev => ({
      ...prev,
      states: [...US_STATES]
    }));
  };

  const clearAllStates = () => {
    setRegisteredAgentForm(prev => ({
      ...prev,
      states: []
    }));
  };

  // Mutations for services
  const createServiceMutation = useMutation({
    mutationFn: async (data: PlanFormData) => {
      return apiRequest('POST', '/api/admin/services', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services?category=Tax'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services?category=Formation'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services?category=Business%20Licenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/services?category=Compliance'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Service plan created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service plan",
        variant: "destructive",
      });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PlanFormData }) => {
      // Determine which endpoint to use based on plan category or name
      const isBookkeepingPlan = data.category === 'Bookkeeping' || 
                               data.name?.toLowerCase().includes('bookkeeping') ||
                               editingPlan?.name?.toLowerCase().includes('bookkeeping');
      
      const endpoint = isBookkeepingPlan 
        ? `/api/admin/bookkeeping/plans/${id}`
        : `/api/admin/services/${id}`;
      
      console.log('Using endpoint:', endpoint, 'for plan:', data.name);
      
      return apiRequest('PUT', endpoint, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookkeeping/plans'] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Service plan updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update service plan",
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (planData: any) => {
      // Determine which endpoint to use based on plan data
      const isBookkeepingPlan = planData.name?.toLowerCase().includes('bookkeeping') ||
                               planData.monthlyPrice !== undefined;
      
      const endpoint = isBookkeepingPlan 
        ? `/api/admin/bookkeeping/plans/${planData.id}`
        : `/api/admin/services/${planData.id}`;
      
      console.log('Deleting using endpoint:', endpoint, 'for plan:', planData.name);
      
      return apiRequest('DELETE', endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      queryClient.invalidateQueries({ queryKey: ['/api/bookkeeping/plans'] });
      toast({
        title: "Success",
        description: "Service plan deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service plan",
        variant: "destructive",
      });
    },
  });

  // Mutations for mailbox plans
  const createMailboxMutation = useMutation({
    mutationFn: async (data: MailboxPlanFormData) => {
      return apiRequest('POST', '/api/admin/mailbox-plans', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mailbox-plans'] });
      setIsMailboxDialogOpen(false);
      resetMailboxForm();
      toast({
        title: "Success",
        description: "Mailbox plan created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create mailbox plan",
        variant: "destructive",
      });
    },
  });

  const updatePayrollPlanMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest('PUT', `/api/bookkeeping/plans/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookkeeping/plans'] });
      setIsMailboxDialogOpen(false);
      resetMailboxForm();
      toast({
        title: "Success",
        description: "Payroll plan updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payroll plan",
        variant: "destructive",
      });
    },
  });

  const updateMailboxMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MailboxPlanFormData }) => {
      return apiRequest('PUT', `/api/admin/mailbox-plans/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mailbox-plans'] });
      setIsMailboxDialogOpen(false);
      resetMailboxForm();
      toast({
        title: "Success",
        description: "Mailbox plan updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update mailbox plan",
        variant: "destructive",
      });
    },
  });

  const deleteMailboxMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/admin/mailbox-plans/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mailbox-plans'] });
      toast({
        title: "Success",
        description: "Mailbox plan deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete mailbox plan",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setPlanForm(defaultPlanForm);
    setEditingPlan(null);
    setNewFeature('');
    setNewEntityType('');
  };

  const resetMailboxForm = () => {
    setMailboxForm(defaultMailboxForm);
    setEditingPlan(null);
  };

  const handleEditPlan = (plan: any) => {
    console.log('Editing plan:', plan); // Debug log
    setEditingPlan(plan);
    
    // For bookkeeping plans, set category to ensure proper form rendering
    const isBookkeepingPlan = plan.name?.toLowerCase().includes('bookkeeping') || 
                             plan.category === 'Bookkeeping' || 
                             (plan.monthlyPrice !== undefined && plan.yearlyPrice !== undefined);
    
    console.log('Is bookkeeping plan:', isBookkeepingPlan, 'Monthly price:', plan.monthlyPrice, 'Yearly price:', plan.yearlyPrice);
    
    const formData = {
      name: plan.name || '',
      description: plan.description || '',
      category: isBookkeepingPlan ? 'Bookkeeping' : (plan.category || ''),
      serviceType: plan.serviceType || 'subscription_plan',
      oneTimePrice: plan.oneTimePrice || '',
      recurringPrice: plan.recurringPrice || '',
      recurringInterval: plan.recurringInterval || 'monthly',
      expeditedPrice: plan.expeditedPrice || '',
      // Use Gemini AI's intelligent price detection for form display
      monthlyPrice: plan.monthlyPrice ? prepareForForm(plan.monthlyPrice) : '',
      yearlyPrice: plan.yearlyPrice ? prepareForForm(plan.yearlyPrice) : '',
      features: plan.features || [],
      entityTypes: plan.entityTypes || [],
      employeeLimit: plan.employeeLimit || '',
      isActive: plan.isActive ?? true,
      isPopular: plan.isPopular ?? false,
      sortOrder: plan.sortOrder || 0
    };
    
    console.log('Form data being set:', formData);
    setPlanForm(formData);
    setIsDialogOpen(true);
  };

  const handleEditPayrollPlan = (plan: any) => {
    console.log('Editing payroll plan:', plan);
    setEditingPlan(plan);
    setMailboxForm({
      name: plan.name || '',
      displayName: plan.displayName || '',
      monthlyPrice: prepareForForm(plan.monthlyPrice),
      businessAddresses: plan.businessAddresses || 1,
      mailItemsPerMonth: plan.mailItemsPerMonth || 10,
      costPerExtraItem: plan.costPerExtraItem || '',
      shippingCost: plan.shippingCost || '',
      secureShredding: plan.secureShredding ?? true,
      checkDepositFee: plan.checkDepositFee || '',
      checksIncluded: plan.checksIncluded || 5,
      additionalCheckFee: plan.additionalCheckFee || '',
      isActive: plan.isActive ?? true,
      isMostPopular: plan.isMostPopular ?? false
    });
    setIsMailboxDialogOpen(true);
  };

  const handleEditMailboxPlan = (plan: any) => {
    setEditingPlan(plan);
    setMailboxForm({
      name: plan.name || '',
      displayName: plan.displayName || '',
      monthlyPrice: plan.monthlyPrice || '',
      businessAddresses: plan.businessAddresses || 1,
      mailItemsPerMonth: plan.mailItemsPerMonth || 10,
      costPerExtraItem: plan.costPerExtraItem || '',
      shippingCost: plan.shippingCost || '',
      secureShredding: plan.secureShredding ?? true,
      checkDepositFee: plan.checkDepositFee || '',
      checksIncluded: plan.checksIncluded || 5,
      additionalCheckFee: plan.additionalCheckFee || '',
      isActive: plan.isActive ?? true,
      isMostPopular: plan.isMostPopular ?? false
    });
    setIsMailboxDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use Gemini AI's intelligent price conversion for database storage
    const formDataForSubmission = {
      ...planForm,
      monthlyPrice: planForm.monthlyPrice ? prepareForDatabase(planForm.monthlyPrice).toString() : '',
      yearlyPrice: planForm.yearlyPrice ? prepareForDatabase(planForm.yearlyPrice).toString() : ''
    };
    
    if (editingPlan) {
      updateServiceMutation.mutate({ id: editingPlan.id, data: formDataForSubmission });
    } else {
      createServiceMutation.mutate(formDataForSubmission);
    }
  };

  const handleMailboxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare payroll plan data for submission
    const payrollPlanData = {
      ...mailboxForm,
      monthlyPrice: prepareForDatabase(mailboxForm.monthlyPrice).toString()
    };
    
    if (editingPlan) {
      updatePayrollPlanMutation.mutate({ id: editingPlan.id, data: payrollPlanData });
    } else {
      createMailboxMutation.mutate(payrollPlanData);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !planForm.features.includes(newFeature.trim())) {
      setPlanForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setPlanForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addEntityType = () => {
    if (newEntityType.trim() && !planForm.entityTypes.includes(newEntityType.trim())) {
      setPlanForm(prev => ({
        ...prev,
        entityTypes: [...prev.entityTypes, newEntityType.trim()]
      }));
      setNewEntityType('');
    }
  };

  const removeEntityType = (index: number) => {
    setPlanForm(prev => ({
      ...prev,
      entityTypes: prev.entityTypes.filter((_, i) => i !== index)
    }));
  };

  const openNewPlanDialog = (category: string) => {
    resetForm();
    setPlanForm(prev => ({ ...prev, category }));
    setIsDialogOpen(true);
  };

  const renderPlanCard = (plan: any, onEdit: () => void, onDelete: () => void) => (
    <Card key={plan.id} className="relative">
      {plan.isPopular || plan.isMostPopular ? (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-green-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Popular
          </Badge>
        </div>
      ) : null}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{plan.name || plan.displayName}</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
        <div className="space-y-2">
          {/* Bookkeeping plans with monthly and yearly pricing */}
          {plan.monthlyPrice && plan.yearlyPrice && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Monthly:</span>
                <span className="font-semibold text-green-500">{formatAsDollars(plan.monthlyPrice)}/month</span>
              </div>
              <div className="flex justify-between">
                <span>Yearly:</span>
                <span className="font-semibold text-green-500">{formatAsDollars(plan.yearlyPrice)}/year</span>
              </div>
            </div>
          )}
          
          {/* Standard plans with single pricing */}
          {!plan.yearlyPrice && plan.monthlyPrice && (
            <div className="flex justify-between">
              <span>Monthly Price:</span>
              <span className="font-semibold text-green-500">{formatAsDollars(plan.monthlyPrice)}</span>
            </div>
          )}
          {!plan.yearlyPrice && plan.recurringPrice && (
            <div className="flex justify-between">
              <span>{plan.recurringInterval || 'Monthly'} Price:</span>
              <span className="font-semibold text-green-500">{formatAsDollars(plan.recurringPrice)}</span>
            </div>
          )}
          {plan.oneTimePrice && (
            <div className="flex justify-between">
              <span>One-time Price:</span>
              <span className="font-semibold text-green-500">{formatAsDollars(plan.oneTimePrice)}</span>
            </div>
          )}
          {plan.expeditedPrice && (
            <div className="flex justify-between">
              <span>Expedited Service Fee:</span>
              <span className="font-semibold text-orange-500">{formatAsDollars(plan.expeditedPrice)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Status:</span>
            <Badge variant={plan.isActive ? "default" : "secondary"}>
              {plan.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plan Management</h1>
          <Link href="/admin/subscription-management">
            <Button className="bg-green-500 hover:bg-[#E54F00] text-white">
              <UserCheck className="h-4 w-4 mr-2" />
              Manage Subscriptions
            </Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="business-formation" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Business Formation
            </TabsTrigger>
            <TabsTrigger value="digital-mailbox" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Digital Mailbox
            </TabsTrigger>
            <TabsTrigger value="bookkeeping" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Bookkeeping
            </TabsTrigger>
            <TabsTrigger value="payroll" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Payroll
            </TabsTrigger>
            <TabsTrigger value="tax-filing" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tax Filing
            </TabsTrigger>
            <TabsTrigger value="business-licenses" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Business Licenses
            </TabsTrigger>
            <TabsTrigger value="fictitious-business-name" className="flex items-center gap-2">
              <Edit2 className="h-4 w-4" />
              FBN
            </TabsTrigger>
            <TabsTrigger value="registered-agent" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Registered Agent
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          {/* Digital Mailbox Plans */}
          <TabsContent value="business-formation" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Digital Mailbox Plans</h2>
              <Button onClick={() => setIsMailboxDialogOpen(true)} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </div>
            
            {loadingMailboxPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mailboxPlans?.map((plan: any) =>
                  renderPlanCard(
                    plan,
                    () => handleEditMailboxPlan(plan),
                    () => deleteMailboxMutation.mutate(plan.id)
                  )
                )}
              </div>
            )}
          </TabsContent>

          {/* Digital Mailbox Plans */}
          <TabsContent value="digital-mailbox" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Digital Mailbox Plans</h2>
              <Button onClick={() => setIsMailboxDialogOpen(true)} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </div>
            
            {loadingMailboxPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mailboxPlans?.map((plan: any) =>
                  renderPlanCard(
                    plan,
                    () => handleEditMailboxPlan(plan),
                    () => deleteMailboxMutation.mutate(plan.id)
                  )
                )}
              </div>
            )}
          </TabsContent>

          {/* Bookkeeping Plans */}
          <TabsContent value="bookkeeping" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Bookkeeping Service Plans</h2>
              <Button onClick={() => openNewPlanDialog('Bookkeeping')} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </div>
            
            {loadingBookkeepingPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookkeepingPlans?.map((plan: any) =>
                  renderPlanCard(
                    plan,
                    () => handleEditPlan(plan),
                    () => deleteServiceMutation.mutate(plan)
                  )
                )}
              </div>
            )}
          </TabsContent>

          {/* Payroll Plans */}
          <TabsContent value="payroll" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Payroll Service Plans</h2>
              <Button onClick={() => openNewPlanDialog('Payroll')} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </div>
            
            {loadingPayrollPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {payrollPlans?.map((plan: any) => (
                  <Card key={plan.id} className="relative">
                    {plan.isMostPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-green-500 hover:bg-[#E54F00]">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{plan.displayName || plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-2xl font-bold text-green-500">
                        ${(plan.monthlyPrice / 100).toFixed(2)}/month
                      </div>
                      {plan.yearlyPrice && (
                        <div className="text-sm text-gray-600">
                          ${(plan.yearlyPrice / 100).toFixed(2)}/year (Save ${((plan.monthlyPrice * 12 - plan.yearlyPrice) / 100).toFixed(2)})
                        </div>
                      )}
                      <div className="text-sm text-gray-600">
                        Up to {plan.employeeLimit} employees
                      </div>
                      {plan.features && plan.features.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Features:</div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {plan.features.slice(0, 3).map((feature: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                            {plan.features.length > 3 && (
                              <li className="text-xs text-gray-500">
                                +{plan.features.length - 3} more features
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4">
                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
            setEditingPlan(plan);
            setPayrollForm({
              name: plan.name,
              displayName: plan.displayName || '',
              description: plan.description || '',
              monthlyPrice: (plan.monthlyPrice / 100).toString(),
              yearlyPrice: plan.yearlyPrice ? (plan.yearlyPrice / 100).toString() : '',
              employeeLimit: plan.employeeLimit || 0,
              additionalEmployeeCost: plan.additionalEmployeeCost ? (plan.additionalEmployeeCost / 100).toString() : '15.00',
              features: plan.features || [],
              isActive: plan.isActive,
              isMostPopular: plan.isMostPopular || false
            });
            setIsPayrollEditOpen(true);
          }}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${plan.displayName || plan.name}"?`)) {
                                // Create delete mutation for payroll plans
                                fetch(`/api/admin/payroll/plans/${plan.id}`, { method: 'DELETE' })
                                  .then(() => window.location.reload());
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tax Filing Plans */}
          <TabsContent value="tax-filing" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Tax Filing Service Plans</h2>
              <Button onClick={() => openNewPlanDialog('Tax')} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </div>
            
            {loadingTaxPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {taxPlans?.map((plan: any) =>
                  renderPlanCard(
                    plan,
                    () => handleEditPlan(plan),
                    () => deleteServiceMutation.mutate(plan.id)
                  )
                )}
              </div>
            )}
          </TabsContent>

          {/* Business License Plans */}
          <TabsContent value="business-licenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Business License Plans</h2>
              <Button onClick={() => openNewPlanDialog('License')} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </div>
            
            {loadingLicensePlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : licensePlans && licensePlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {licensePlans?.map((plan: any) =>
                  renderPlanCard(
                    plan,
                    () => handleEditPlan(plan),
                    () => deleteServiceMutation.mutate(plan.id)
                  )
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-dashed border-2 border-gray-300 flex items-center justify-center h-48">
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No business license plans yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => openNewPlanDialog('License')}
                    >
                      Create First Plan
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Fictitious Business Name Plans */}
          <TabsContent value="fictitious-business-name" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Fictitious Business Name (FBN) Plans</h2>
              <Button onClick={() => openNewPlanDialog('Compliance')} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New FBN Plan
              </Button>
            </div>
            
            {loadingFbnPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : fbnPlans && fbnPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fbnPlans?.map((plan: any) =>
                  renderPlanCard(
                    plan,
                    () => handleEditPlan(plan),
                    () => deleteServiceMutation.mutate(plan.id)
                  )
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-dashed border-2 border-gray-300 flex items-center justify-center h-48">
                  <div className="text-center">
                    <Edit2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No FBN plans created yet</p>
                    <p className="text-sm text-gray-400 mb-3">Create plans for Fictitious Business Name registration services</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => openNewPlanDialog('Compliance')}
                    >
                      Create First FBN Plan
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Registered Agent Plans */}
          <TabsContent value="registered-agent" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Registered Agent Plans</h2>
              <Button onClick={() => setIsRegisteredAgentDialogOpen(true)} className="bg-green-500 hover:bg-green-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </div>
            
            {loadingRegisteredAgentPlans ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : registeredAgentPlans && registeredAgentPlans.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredAgentPlans?.map((plan: any) => (
                  <Card key={plan.id} className="relative">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{plan.displayName || plan.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditRegisteredAgentPlan(plan)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteRegisteredAgentMutation.mutate(plan.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-green-600">
                          ${plan.yearlyPrice}/year
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {plan.states?.slice(0, 3).map((state: string) => (
                            <span key={state} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {state}
                            </span>
                          ))}
                          {plan.states?.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                              +{plan.states.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <ul className="text-sm space-y-1">
                          {plan.features?.slice(0, 3).map((feature: string) => (
                            <li key={feature} className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              {feature}
                            </li>
                          ))}
                          {plan.features?.length > 3 && (
                            <li className="text-gray-500">+{plan.features.length - 3} more features</li>
                          )}
                        </ul>
                        
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className={`px-2 py-1 rounded text-xs ${
                            plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {plan.isMostPopular && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                              Most Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-dashed border-2 border-gray-300 flex items-center justify-center h-48">
                  <div className="text-center">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No Registered Agent plans created yet</p>
                    <p className="text-sm text-gray-400 mb-3">Create plans for Registered Agent services</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setIsRegisteredAgentDialogOpen(true)}
                    >
                      Create First Plan
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Document Management */}
          <TabsContent value="documents" className="space-y-6">
            <DocumentManagementSection />
          </TabsContent>
        </Tabs>

        {/* Service Plan Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Service Plan' : 'Create New Service Plan'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={planForm.name}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={planForm.category} 
                    onValueChange={(value) => setPlanForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Formation">Business Formation</SelectItem>
                      <SelectItem value="Bookkeeping">Bookkeeping</SelectItem>
                      <SelectItem value="Payroll">Payroll</SelectItem>
                      <SelectItem value="Tax">Tax Filing</SelectItem>
                      <SelectItem value="Compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={planForm.description}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* Conditional pricing fields based on category */}
              {(planForm.category === 'Bookkeeping' || planForm.name.toLowerCase().includes('bookkeeping') || editingPlan?.name?.toLowerCase().includes('bookkeeping')) ? (
                <div>
                  <Label className="text-base font-semibold">Pricing Structure</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                      <Input
                        id="monthlyPrice"
                        type="number"
                        step="0.01"
                        value={planForm.monthlyPrice || ''}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, monthlyPrice: e.target.value }))}
                        placeholder="e.g., 100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearlyPrice">Yearly Price ($)</Label>
                      <Input
                        id="yearlyPrice"
                        type="number"
                        step="0.01"
                        value={planForm.yearlyPrice || ''}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, yearlyPrice: e.target.value }))}
                        placeholder="e.g., 1000"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="oneTimePrice">One-time Price ($)</Label>
                      <Input
                        id="oneTimePrice"
                        type="number"
                        step="0.01"
                        value={planForm.oneTimePrice}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, oneTimePrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recurringPrice">Recurring Price ($)</Label>
                      <Input
                        id="recurringPrice"
                        type="number"
                        step="0.01"
                        value={planForm.recurringPrice}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, recurringPrice: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="recurringInterval">Interval</Label>
                      <Select 
                        value={planForm.recurringInterval} 
                        onValueChange={(value) => setPlanForm(prev => ({ ...prev, recurringInterval: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expeditedPrice">Expedited Service Fee ($)</Label>
                    <Input
                      id="expeditedPrice"
                      type="number"
                      step="0.01"
                      value={planForm.expeditedPrice || ''}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, expeditedPrice: e.target.value }))}
                      placeholder="e.g., 50.00"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label>Features</Label>
                <div className="space-y-2">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {planForm.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeFeature(index)}>
                        {feature} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {planForm.category === 'Tax' && (
                <div>
                  <Label>Applicable Entity Types</Label>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Add entity type (e.g., LLC, Corporation)"
                        value={newEntityType}
                        onChange={(e) => setNewEntityType(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEntityType())}
                      />
                      <Button type="button" onClick={addEntityType} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {planForm.entityTypes.map((type, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeEntityType(index)}>
                          {type} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {planForm.category === 'Payroll' && (
                <div>
                  <Label htmlFor="employeeLimit">Employee Limit</Label>
                  <Input
                    id="employeeLimit"
                    value={planForm.employeeLimit}
                    onChange={(e) => setPlanForm(prev => ({ ...prev, employeeLimit: e.target.value }))}
                    placeholder="e.g., 10, 50, Unlimited"
                  />
                </div>
              )}

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={planForm.isActive}
                    onCheckedChange={(checked) => setPlanForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={planForm.isPopular}
                    onCheckedChange={(checked) => setPlanForm(prev => ({ ...prev, isPopular: checked }))}
                  />
                  <Label htmlFor="isPopular">Mark as Popular</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600"
                  disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Mailbox Plan Dialog */}
        <Dialog open={isMailboxDialogOpen} onOpenChange={setIsMailboxDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Mailbox Plan' : 'Create New Mailbox Plan'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleMailboxSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mailbox-name">Plan Name</Label>
                  <Input
                    id="mailbox-name"
                    value={mailboxForm.name}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., starter, growing, booming"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mailbox-displayName">Display Name</Label>
                  <Input
                    id="mailbox-displayName"
                    value={mailboxForm.displayName}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="e.g., MailBox Starter"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthlyPrice">Monthly Price ($)</Label>
                  <Input
                    id="monthlyPrice"
                    type="number"
                    step="0.01"
                    value={mailboxForm.monthlyPrice}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, monthlyPrice: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessAddresses">Business Addresses</Label>
                  <Input
                    id="businessAddresses"
                    type="number"
                    value={mailboxForm.businessAddresses}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, businessAddresses: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mailItemsPerMonth">Mail Items/Month</Label>
                  <Input
                    id="mailItemsPerMonth"
                    type="number"
                    value={mailboxForm.mailItemsPerMonth}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, mailItemsPerMonth: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="costPerExtraItem">Cost Per Extra Item ($)</Label>
                  <Input
                    id="costPerExtraItem"
                    type="number"
                    step="0.01"
                    value={mailboxForm.costPerExtraItem}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, costPerExtraItem: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shippingCost">Shipping Cost ($)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={mailboxForm.shippingCost}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, shippingCost: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="checkDepositFee">Check Deposit Fee ($)</Label>
                  <Input
                    id="checkDepositFee"
                    type="number"
                    step="0.01"
                    value={mailboxForm.checkDepositFee}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, checkDepositFee: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="checksIncluded">Checks Included</Label>
                  <Input
                    id="checksIncluded"
                    type="number"
                    value={mailboxForm.checksIncluded}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, checksIncluded: parseInt(e.target.value) }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="additionalCheckFee">Additional Check Fee ($)</Label>
                  <Input
                    id="additionalCheckFee"
                    type="number"
                    step="0.01"
                    value={mailboxForm.additionalCheckFee}
                    onChange={(e) => setMailboxForm(prev => ({ ...prev, additionalCheckFee: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="mailbox-isActive"
                    checked={mailboxForm.isActive}
                    onCheckedChange={(checked) => setMailboxForm(prev => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="mailbox-isActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="mailbox-secureShredding"
                    checked={mailboxForm.secureShredding}
                    onCheckedChange={(checked) => setMailboxForm(prev => ({ ...prev, secureShredding: checked }))}
                  />
                  <Label htmlFor="mailbox-secureShredding">Secure Shredding</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="mailbox-isMostPopular"
                    checked={mailboxForm.isMostPopular}
                    onCheckedChange={(checked) => setMailboxForm(prev => ({ ...prev, isMostPopular: checked }))}
                  />
                  <Label htmlFor="mailbox-isMostPopular">Most Popular</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsMailboxDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600"
                  disabled={createMailboxMutation.isPending || updateMailboxMutation.isPending}
                >
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Payroll Plan Edit Dialog */}
        <Dialog open={isPayrollEditOpen} onOpenChange={setIsPayrollEditOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Payroll Plan</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payrollName">Plan Name</Label>
                  <Input
                    id="payrollName"
                    value={payrollForm.name}
                    onChange={(e) => setPayrollForm({ ...payrollForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="payrollDisplayName">Display Name</Label>
                  <Input
                    id="payrollDisplayName"
                    value={payrollForm.displayName}
                    onChange={(e) => setPayrollForm({ ...payrollForm, displayName: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payrollDescription">Description</Label>
                <Input
                  id="payrollDescription"
                  value={payrollForm.description}
                  onChange={(e) => setPayrollForm({ ...payrollForm, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="payrollMonthlyPrice">Monthly Price ($)</Label>
                  <Input
                    id="payrollMonthlyPrice"
                    type="number"
                    step="0.01"
                    value={payrollForm.monthlyPrice}
                    onChange={(e) => setPayrollForm({ ...payrollForm, monthlyPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="payrollYearlyPrice">Yearly Price ($)</Label>
                  <Input
                    id="payrollYearlyPrice"
                    type="number"
                    step="0.01"
                    value={payrollForm.yearlyPrice}
                    onChange={(e) => setPayrollForm({ ...payrollForm, yearlyPrice: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="payrollEmployeeLimit">Employee Limit</Label>
                  <Input
                    id="payrollEmployeeLimit"
                    type="number"
                    value={payrollForm.employeeLimit}
                    onChange={(e) => setPayrollForm({ ...payrollForm, employeeLimit: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additionalEmployeeCost">Additional Employee Cost ($15/month each)</Label>
                <Input
                  id="additionalEmployeeCost"
                  type="number"
                  step="0.01"
                  value={payrollForm.additionalEmployeeCost}
                  onChange={(e) => setPayrollForm({ ...payrollForm, additionalEmployeeCost: e.target.value })}
                  placeholder="15.00"
                />
              </div>

              <div className="flex gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="payrollActive"
                    checked={payrollForm.isActive}
                    onChange={(e) => setPayrollForm({ ...payrollForm, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="payrollActive">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="payrollMostPopular"
                    checked={payrollForm.isMostPopular}
                    onChange={(e) => setPayrollForm({ ...payrollForm, isMostPopular: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="payrollMostPopular">Most Popular</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPayrollEditOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={async () => {
                  if (!editingPlan) return;
                  
                  try {
                    const updateData = {
                      ...payrollForm,
                      monthlyPrice: Math.round(parseFloat(payrollForm.monthlyPrice) * 100),
                      yearlyPrice: payrollForm.yearlyPrice ? Math.round(parseFloat(payrollForm.yearlyPrice) * 100) : null,
                      additionalEmployeeCost: Math.round(parseFloat(payrollForm.additionalEmployeeCost) * 100)
                    };
                    
                    await apiRequest('PUT', `/api/admin/payroll/plans/${editingPlan.id}`, updateData);
                    
                    queryClient.invalidateQueries({ queryKey: ['/api/admin/payroll/plans'] });
                    setIsPayrollEditOpen(false);
                    setEditingPlan(null);
                    setPayrollForm(defaultPayrollForm);
                    
                    toast({
                      title: "Success",
                      description: "Payroll plan updated successfully",
                    });
                  } catch (error: any) {
                    toast({
                      title: "Error",
                      description: error.message || "Failed to update payroll plan",
                      variant: "destructive",
                    });
                  }
                }}
                className="bg-green-500 hover:bg-green-600"
              >
                Update Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Registered Agent Plan Dialog */}
        <Dialog open={isRegisteredAgentDialogOpen} onOpenChange={setIsRegisteredAgentDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Registered Agent Plan' : 'Add Registered Agent Plan'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={registeredAgentForm.name}
                    onChange={(e) => setRegisteredAgentForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., basic-registered-agent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    value={registeredAgentForm.displayName}
                    onChange={(e) => setRegisteredAgentForm(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., Basic Registered Agent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={registeredAgentForm.description}
                  onChange={(e) => setRegisteredAgentForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Describe the registered agent service..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Yearly Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={registeredAgentForm.yearlyPrice}
                    onChange={(e) => setRegisteredAgentForm(prev => ({ ...prev, yearlyPrice: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Expedited Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={registeredAgentForm.expeditedPrice}
                    onChange={(e) => setRegisteredAgentForm(prev => ({ ...prev, expeditedPrice: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Available States</label>
                <div className="space-y-3">
                  {/* Quick selection buttons */}
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllStates}
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Select All 50 States
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllStates}
                      className="text-gray-600"
                    >
                      Clear All
                    </Button>
                  </div>
                  
                  {/* State selection grid */}
                  <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto p-3 border border-gray-200 rounded-md bg-gray-50">
                    {US_STATES.map(state => (
                      <label key={state} className="flex items-center space-x-1 cursor-pointer hover:bg-white rounded p-1">
                        <input
                          type="checkbox"
                          checked={registeredAgentForm.states.includes(state)}
                          onChange={() => toggleRegisteredAgentState(state)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-xs">{state}</span>
                      </label>
                    ))}
                  </div>
                  
                  {/* Selection summary */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Selected: {registeredAgentForm.states.length} of 50 states
                    </span>
                    {registeredAgentForm.states.length === 50 && (
                      <span className="text-green-600 font-medium">✓ Available in all states</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && addRegisteredAgentFeature()}
                  />
                  <Button onClick={addRegisteredAgentFeature} type="button" size="sm">
                    Add
                  </Button>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {registeredAgentForm.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{feature}</span>
                      <Button
                        onClick={() => removeRegisteredAgentFeature(feature)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={registeredAgentForm.isActive}
                    onChange={(e) => setRegisteredAgentForm(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <span className="text-sm">Active</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={registeredAgentForm.isMostPopular}
                    onChange={(e) => setRegisteredAgentForm(prev => ({ ...prev, isMostPopular: e.target.checked }))}
                  />
                  <span className="text-sm">Most Popular</span>
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRegisteredAgentDialogOpen(false);
                  setRegisteredAgentForm(defaultRegisteredAgentForm);
                  setEditingPlan(null);
                  setNewFeature('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRegisteredAgentSubmit}
                disabled={createRegisteredAgentMutation.isPending || updateRegisteredAgentMutation.isPending}
                className="bg-green-500 hover:bg-green-600"
              >
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}