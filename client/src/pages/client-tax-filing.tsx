import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  PlusCircle,
  Eye
} from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "wouter";

interface TaxFiling {
  id: number;
  businessEntityId: string;
  filingYear: string;
  filingType: string;
  status: string;
  submissionDate: string;
  dueDate: string;
  amount: number;
  businessName: string;
  businessStructure: string;
  documentsUploaded: string[];
  completionDate?: string;
  notes?: string;
}

export default function ClientTaxFiling() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch user's tax filings
  const { data: taxFilings = [], isLoading } = useQuery({
    queryKey: ["/api/tax-filings"],
    enabled: !!user?.id,
  });

  const handleNewTaxFiling = () => {
    setLocation("/business-tax-filing-services");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-purple-100 text-purple-800';
      case 'requires_attention':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'submitted':
        return <FileText className="w-4 h-4" />;
      case 'requires_attention':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 pt-36 pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Filing Management</h1>
          <p className="text-gray-600 mt-2">Track your business tax filings and their status</p>
        </div>
        <Button 
          onClick={handleNewTaxFiling}
          className="bg-[#34de73] hover:bg-[#2bc866] text-white"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          New Tax Filing
        </Button>
      </div>

      {taxFilings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tax Filings Yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't submitted any tax filings yet. Get started with professional tax preparation services.
            </p>
            <Button 
              onClick={handleNewTaxFiling}
              className="bg-[#34de73] hover:bg-[#2bc866] text-white"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Start Tax Filing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {taxFilings.map((filing: TaxFiling) => (
            <Card key={filing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {filing.businessName} - {filing.filingYear} Tax Return
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {filing.filingType} | {filing.businessStructure}
                    </p>
                  </div>
                  <Badge className={getStatusColor(filing.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(filing.status)}
                      {filing.status.replace('_', ' ')}
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Filing Details */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Filing Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Submitted:</span>
                        <span>{format(new Date(filing.submissionDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Due Date:</span>
                        <span>{format(new Date(filing.dueDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Service Fee:</span>
                        <span>${filing.amount.toFixed(2)}</span>
                      </div>
                      {filing.completionDate && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">Completed:</span>
                          <span>{format(new Date(filing.completionDate), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Documents</h4>
                    <div className="space-y-2">
                      {filing.documentsUploaded.length > 0 ? (
                        filing.documentsUploaded.map((doc, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600 truncate">{doc}</span>
                            <Button variant="ghost" size="sm">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No documents uploaded</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      {filing.status === 'completed' && (
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Download Return
                        </Button>
                      )}
                      {filing.status === 'requires_attention' && (
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full justify-start bg-[#34de73] hover:bg-[#2bc866] text-white"
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Take Action
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {filing.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{filing.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tax Filing Summary */}
      {taxFilings.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tax Filing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {taxFilings.length}
                </div>
                <div className="text-sm text-gray-600">Total Filings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {taxFilings.filter((f: TaxFiling) => f.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {taxFilings.filter((f: TaxFiling) => f.status === 'in_progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {taxFilings.filter((f: TaxFiling) => f.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}