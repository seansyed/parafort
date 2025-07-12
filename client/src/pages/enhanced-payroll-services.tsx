import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  DollarSign, 
  Calculator, 
  FileText, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  Shield,
  Building2,
  UserPlus,
  CreditCard,
  Receipt
} from "lucide-react";

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  ssn: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hourlyRate?: number;
  salary?: number;
  payType: 'hourly' | 'salary';
  department: string;
  position: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  federalAllowances: number;
  stateAllowances: number;
  directDepositAccount?: string;
  directDepositRouting?: string;
}

interface PayrollRun {
  id: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  status: 'draft' | 'approved' | 'processed' | 'completed';
  totalGross: number;
  totalNet: number;
  totalTaxes: number;
  employeeCount: number;
  processedAt?: string;
}

interface PayStub {
  id: number;
  employeeId: number;
  payrollRunId: number;
  grossPay: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  stateDisability: number;
  unemployment: number;
  netPay: number;
  hoursWorked?: number;
  overtimeHours?: number;
  regularPay: number;
  overtimePay: number;
  deductions: number;
  benefits: number;
}

interface TaxSummary {
  federalIncomeTax: number;
  stateIncomeTax: number;
  socialSecurityTax: number;
  medicareTax: number;
  federalUnemploymentTax: number;
  stateUnemploymentTax: number;
  stateDisabilityTax: number;
  totalTaxLiability: number;
}

export default function EnhancedPayrollServices() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedPayrollRun, setSelectedPayrollRun] = useState<PayrollRun | null>(null);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isPayrollRunDialogOpen, setIsPayrollRunDialogOpen] = useState(false);
  const [payPeriod, setPayPeriod] = useState({ start: "", end: "" });

  // Fetch employees
  const { data: employees = [], isLoading: employeesLoading } = useQuery({
    queryKey: ["/api/payroll/employees"],
    enabled: isAuthenticated,
  });

  // Fetch payroll runs
  const { data: payrollRuns = [], isLoading: payrollRunsLoading } = useQuery({
    queryKey: ["/api/payroll/runs"],
    enabled: isAuthenticated,
  });

  // Fetch tax summary
  const { data: taxSummary, isLoading: taxSummaryLoading } = useQuery({
    queryKey: ["/api/payroll/tax-summary"],
    enabled: isAuthenticated,
  });

  // Create employee mutation
  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: Partial<Employee>) => {
      return await apiRequest("POST", "/api/payroll/employees", employeeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/employees"] });
      setIsEmployeeDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Employee Created",
        description: "Employee has been successfully added to payroll",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create employee",
        variant: "destructive",
      });
    },
  });

  // Update employee mutation
  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Employee> }) => {
      return await apiRequest("PUT", `/api/payroll/employees/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/employees"] });
      setIsEmployeeDialogOpen(false);
      setSelectedEmployee(null);
      toast({
        title: "Employee Updated",
        description: "Employee information has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update employee",
        variant: "destructive",
      });
    },
  });

  // Create payroll run mutation
  const createPayrollRunMutation = useMutation({
    mutationFn: async (payrollData: { payPeriodStart: string; payPeriodEnd: string; payDate: string }) => {
      return await apiRequest("POST", "/api/payroll/runs", payrollData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/runs"] });
      setIsPayrollRunDialogOpen(false);
      setPayPeriod({ start: "", end: "" });
      toast({
        title: "Payroll Run Created",
        description: "New payroll run has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create payroll run",
        variant: "destructive",
      });
    },
  });

  // Process payroll mutation
  const processPayrollMutation = useMutation({
    mutationFn: async (runId: number) => {
      return await apiRequest("POST", `/api/payroll/runs/${runId}/process`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/runs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/payroll/tax-summary"] });
      toast({
        title: "Payroll Processed",
        description: "Payroll has been successfully processed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Processing Error",
        description: error.message || "Failed to process payroll",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'bg-green-100 text-green-800';
      case 'draft': case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'approved': case 'processed': return 'bg-blue-100 text-blue-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const activeEmployees = employees.filter((emp: Employee) => emp.status === 'active');
  const totalGrossPayroll = payrollRuns.reduce((sum: number, run: PayrollRun) => sum + run.totalGross, 0);
  const totalNetPayroll = payrollRuns.reduce((sum: number, run: PayrollRun) => sum + run.totalNet, 0);
  const totalTaxes = payrollRuns.reduce((sum: number, run: PayrollRun) => sum + run.totalTaxes, 0);

  if (employeesLoading || payrollRunsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Services</h1>
          <p className="text-gray-600 mt-1">Complete payroll management with automated tax calculations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsEmployeeDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Button>
          <Button 
            onClick={() => setIsPayrollRunDialogOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Payroll Run
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEmployees.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.length - activeEmployees.length} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gross Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGrossPayroll)}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net Payroll</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalNetPayroll)}</div>
            <p className="text-xs text-muted-foreground">
              After taxes and deductions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tax Liability</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalTaxes)}</div>
            <p className="text-xs text-muted-foreground">
              Total taxes withheld
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Runs</TabsTrigger>
          <TabsTrigger value="taxes">Tax Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Recent Payroll Runs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Payroll Runs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payrollRuns.slice(0, 5).map((run: PayrollRun) => (
                  <div key={run.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">
                        Pay Period: {new Date(run.payPeriodStart).toLocaleDateString()} - {new Date(run.payPeriodEnd).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {run.employeeCount} employees • Pay Date: {new Date(run.payDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(run.totalGross)}</div>
                      <Badge className={getStatusColor(run.status)}>
                        {run.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {payrollRuns.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No payroll runs yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Upcoming Tax Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <div>
                    <h4 className="font-medium">Quarterly 941 Filing</h4>
                    <p className="text-sm text-gray-600">Federal tax deposit due</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Jan 31, 2025</div>
                    <Badge variant="outline" className="text-yellow-800 border-yellow-300">
                      15 days
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                  <div>
                    <h4 className="font-medium">State Tax Deposit</h4>
                    <p className="text-sm text-gray-600">Monthly state tax payment</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">Jan 15, 2025</div>
                    <Badge variant="outline" className="text-red-800 border-red-300">
                      Overdue
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {employees.map((employee: Employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {employee.firstName} {employee.lastName}
                    </CardTitle>
                    <Badge className={getStatusColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{employee.position}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Department:</span>
                      <span className="text-sm font-medium">{employee.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pay Type:</span>
                      <span className="text-sm font-medium">{employee.payType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="text-sm font-medium">
                        {employee.payType === 'hourly' 
                          ? `$${employee.hourlyRate}/hour`
                          : formatCurrency(employee.salary || 0)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Hire Date:</span>
                      <span className="text-sm font-medium">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedEmployee(employee);
                        setIsEmployeeDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {employees.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No employees yet</h3>
                <p className="text-gray-600 mb-4">Add your first employee to get started with payroll</p>
                <Button onClick={() => setIsEmployeeDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-6">
          <div className="space-y-4">
            {payrollRuns.map((run: PayrollRun) => (
              <Card key={run.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        Pay Period: {new Date(run.payPeriodStart).toLocaleDateString()} - {new Date(run.payPeriodEnd).toLocaleDateString()}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Pay Date: {new Date(run.payDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(run.status)}>
                      {run.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Employees</p>
                      <p className="text-lg font-bold">{run.employeeCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Gross Pay</p>
                      <p className="text-lg font-bold">{formatCurrency(run.totalGross)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Taxes</p>
                      <p className="text-lg font-bold">{formatCurrency(run.totalTaxes)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Net Pay</p>
                      <p className="text-lg font-bold">{formatCurrency(run.totalNet)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {run.status === 'draft' && (
                      <Button 
                        size="sm"
                        onClick={() => processPayrollMutation.mutate(run.id)}
                        disabled={processPayrollMutation.isPending}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Process Payroll
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Download Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {payrollRuns.length === 0 && (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payroll runs yet</h3>
                <p className="text-gray-600 mb-4">Create your first payroll run to get started</p>
                <Button onClick={() => setIsPayrollRunDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Payroll Run
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="taxes" className="space-y-6">
          {taxSummary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Federal Income Tax</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.federalIncomeTax)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">State Income Tax</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.stateIncomeTax)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Social Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.socialSecurityTax)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Medicare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.medicareTax)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Federal Unemployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.federalUnemploymentTax)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">State Unemployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.stateUnemploymentTax)}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">State Disability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(taxSummary.stateDisabilityTax)}</div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-green-500">
                <CardHeader>
                  <CardTitle className="text-sm text-green-500">Total Tax Liability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{formatCurrency(taxSummary.totalTaxLiability)}</div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {!taxSummary && !taxSummaryLoading && (
            <div className="text-center py-12">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tax data available</h3>
              <p className="text-gray-600">Tax summary will appear after processing payroll</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Employee Dialog */}
      <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const employeeData = {
              firstName: formData.get('firstName') as string,
              lastName: formData.get('lastName') as string,
              email: formData.get('email') as string,
              ssn: formData.get('ssn') as string,
              address: formData.get('address') as string,
              city: formData.get('city') as string,
              state: formData.get('state') as string,
              zipCode: formData.get('zipCode') as string,
              payType: formData.get('payType') as 'hourly' | 'salary',
              hourlyRate: formData.get('payType') === 'hourly' ? Number(formData.get('hourlyRate')) : undefined,
              salary: formData.get('payType') === 'salary' ? Number(formData.get('salary')) : undefined,
              department: formData.get('department') as string,
              position: formData.get('position') as string,
              hireDate: formData.get('hireDate') as string,
              federalAllowances: Number(formData.get('federalAllowances')),
              stateAllowances: Number(formData.get('stateAllowances')),
              status: formData.get('status') as 'active' | 'inactive',
            };
            
            if (selectedEmployee) {
              updateEmployeeMutation.mutate({ id: selectedEmployee.id, data: employeeData });
            } else {
              createEmployeeMutation.mutate(employeeData);
            }
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={selectedEmployee?.firstName} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={selectedEmployee?.lastName} required />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={selectedEmployee?.email} required />
            </div>
            
            <div>
              <Label htmlFor="ssn">SSN</Label>
              <Input id="ssn" name="ssn" defaultValue={selectedEmployee?.ssn} required />
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" defaultValue={selectedEmployee?.address} required />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" defaultValue={selectedEmployee?.city} required />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" defaultValue={selectedEmployee?.state} required />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input id="zipCode" name="zipCode" defaultValue={selectedEmployee?.zipCode} required />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" defaultValue={selectedEmployee?.department} required />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" name="position" defaultValue={selectedEmployee?.position} required />
              </div>
            </div>
            
            <div>
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input id="hireDate" name="hireDate" type="date" defaultValue={selectedEmployee?.hireDate} required />
            </div>
            
            <div>
              <Label htmlFor="payType">Pay Type</Label>
              <Select name="payType" defaultValue={selectedEmployee?.payType || 'hourly'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate</Label>
                <Input 
                  id="hourlyRate" 
                  name="hourlyRate" 
                  type="number" 
                  step="0.01"
                  defaultValue={selectedEmployee?.hourlyRate} 
                />
              </div>
              <div>
                <Label htmlFor="salary">Annual Salary</Label>
                <Input 
                  id="salary" 
                  name="salary" 
                  type="number"
                  defaultValue={selectedEmployee?.salary} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="federalAllowances">Federal Allowances</Label>
                <Input 
                  id="federalAllowances" 
                  name="federalAllowances" 
                  type="number"
                  defaultValue={selectedEmployee?.federalAllowances || 0} 
                />
              </div>
              <div>
                <Label htmlFor="stateAllowances">State Allowances</Label>
                <Input 
                  id="stateAllowances" 
                  name="stateAllowances" 
                  type="number"
                  defaultValue={selectedEmployee?.stateAllowances || 0} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={selectedEmployee?.status || 'active'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
              >
                {selectedEmployee ? "Update Employee" : "Add Employee"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Payroll Run Dialog */}
      <Dialog open={isPayrollRunDialogOpen} onOpenChange={setIsPayrollRunDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Payroll Run</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const payrollData = {
              payPeriodStart: formData.get('payPeriodStart') as string,
              payPeriodEnd: formData.get('payPeriodEnd') as string,
              payDate: formData.get('payDate') as string,
            };
            createPayrollRunMutation.mutate(payrollData);
          }} className="space-y-4">
            <div>
              <Label htmlFor="payPeriodStart">Pay Period Start</Label>
              <Input 
                id="payPeriodStart" 
                name="payPeriodStart" 
                type="date" 
                value={payPeriod.start}
                onChange={(e) => setPayPeriod(prev => ({ ...prev, start: e.target.value }))}
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="payPeriodEnd">Pay Period End</Label>
              <Input 
                id="payPeriodEnd" 
                name="payPeriodEnd" 
                type="date" 
                value={payPeriod.end}
                onChange={(e) => setPayPeriod(prev => ({ ...prev, end: e.target.value }))}
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="payDate">Pay Date</Label>
              <Input id="payDate" name="payDate" type="date" required />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsPayrollRunDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPayrollRunMutation.isPending}>
                Create Payroll Run
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}