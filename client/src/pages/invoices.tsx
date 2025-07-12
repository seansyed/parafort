import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, ArrowLeft, Filter, Calendar, Building, DollarSign } from "lucide-react";
import { useLocation } from "wouter";

export default function Invoices() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Fetch all invoices
  const { data: invoicesData, isLoading, error } = useQuery({
    queryKey: ["/api/billing/invoices"],
    retry: false,
  });

  const invoices = invoicesData?.invoices || [];

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter((invoice: any) => {
      const matchesSearch = 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "amount":
          return b.amount - a.amount;
        case "business":
          return (a.businessName || "").localeCompare(b.businessName || "");
        default:
          return 0;
      }
    });

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      // Use fetch to download the invoice with authentication
      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        method: 'GET',
        credentials: 'include' // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.statusText}`);
      }

      // Get the blob data
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      // You could show a toast notification here
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getTotalAmount = () => {
    return filteredInvoices.reduce((sum: number, invoice: any) => sum + (invoice.amount || 0), 0);
  };

  const getPaidAmount = () => {
    return filteredInvoices
      .filter((invoice: any) => invoice.status === "paid")
      .reduce((sum: number, invoice: any) => sum + (invoice.amount || 0), 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => navigate("/settings")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Settings
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600">Manage and download all your invoices</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${(getTotalAmount() / 100).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${(getPaidAmount() / 100).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <Building className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search invoices by ID, business, or customer name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest)</SelectItem>
                  <SelectItem value="amount">Amount (Highest)</SelectItem>
                  <SelectItem value="business">Business Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Invoice History ({filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'})
            </CardTitle>
            <CardDescription>
              Complete list of all invoices with detailed information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "You don't have any invoices yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice: any) => (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{invoice.id}</h4>
                            <p className="text-sm text-gray-500">
                              {invoice.businessName && (
                                <span className="font-medium">{invoice.businessName}</span>
                              )}
                              {invoice.businessName && invoice.planName && " • "}
                              {invoice.planName && (
                                <span>{invoice.planName} Plan</span>
                              )}
                            </p>
                          </div>
                          <Badge variant={getStatusBadgeVariant(invoice.status)} className="ml-auto">
                            {invoice.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium">${(invoice.amount / 100).toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Customer</p>
                            <p className="font-medium">{invoice.customerName}</p>
                          </div>
                        </div>

                        {invoice.description && (
                          <p className="text-sm text-gray-600 mt-2">{invoice.description}</p>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleDownloadInvoice(invoice.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
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
  );
}