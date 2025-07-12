import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Download, FileText, AlertTriangle, CheckCircle, Clock, Bell, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ComplianceDueDate {
  id: number;
  orderId: string;
  businessName: string;
  entityType: string;
  state: string;
  complianceType: string;
  dueDate: string;
  frequency: string;
  description: string;
  filingFee: string | null;
  status: string;
  reminderSent: boolean;
  notificationDays: number;
}

interface CompletionCertificate {
  id: number;
  orderId: string;
  orderType: string;
  certificateType: string;
  certificateUrl: string;
  certificateData: any;
  issuedAt: string;
}

export default function ComplianceCalendar() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deadlines");
  const [visibleDeadlines, setVisibleDeadlines] = useState(5);
  const [visibleCertificates, setVisibleCertificates] = useState(5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fetch compliance due dates
  const { data: allDueDates = [], isLoading: dueDatesLoading } = useQuery<ComplianceDueDate[]>({
    queryKey: ['/api/compliance/due-dates'],
  });

  // Filter out expired deadlines (past due dates) and sort by due date
  const activeDueDates = (allDueDates || [])
    .filter(dueDate => getDaysUntilDue(dueDate.dueDate) >= 0)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Fetch completion certificates
  const { data: allCertificates = [], isLoading: certificatesLoading, error: certificatesError } = useQuery<CompletionCertificate[]>({
    queryKey: ['/api/completion-certificates'],
  });

  // Sort certificates by most recent first
  const certificates = (allCertificates || []).sort((a, b) => 
    new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );

  const getStatusColor = (status: string, dueDate: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return "bg-red-100 text-red-800 border-red-200";
    if (daysUntil <= 7) return "bg-orange-100 text-orange-800 border-orange-200";
    if (daysUntil <= 30) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusIcon = (status: string, dueDate: string) => {
    const daysUntil = getDaysUntilDue(dueDate);
    if (daysUntil < 0) return <AlertTriangle className="w-3 h-3" />;
    if (daysUntil <= 7) return <Clock className="w-3 h-3" />;
    return <CalendarDays className="w-3 h-3" />;
  };

  const handleDownloadCertificate = async (certificateId: number, orderId: string) => {
    try {
      const response = await fetch(`/api/completion-certificates/${certificateId}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `completion-certificate-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your completion certificate is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download certificate. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Compliance Calendar</h1>
          <p className="text-gray-600 mt-2">
            Track your business compliance deadlines and download completion certificates.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="deadlines" className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Compliance Deadlines
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Certificates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deadlines" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Bell className="w-6 h-6 mr-3 text-blue-600" />
                Upcoming Compliance Deadlines
              </h2>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                {activeDueDates.length} {activeDueDates.length === 1 ? 'deadline' : 'deadlines'}
              </Badge>
            </div>
            
            {dueDatesLoading ? (
              <div className="grid gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-20"></div>
                      </div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : activeDueDates && activeDueDates.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-6">
                  {activeDueDates.slice(0, visibleDeadlines).map((dueDate) => {
                  const daysUntil = getDaysUntilDue(dueDate.dueDate);
                  const isUrgent = daysUntil <= 7;
                  const isApproaching = daysUntil <= 30 && daysUntil > 7;
                  
                  return (
                    <Card key={dueDate.id} className={`hover:shadow-lg transition-all duration-200 border-l-4 ${
                      isUrgent ? 'border-l-red-500 bg-red-50/30' : 
                      isApproaching ? 'border-l-yellow-500 bg-yellow-50/30' : 
                      'border-l-green-500 bg-green-50/30'
                    }`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              {dueDate.businessName}
                              {isUrgent && <AlertTriangle className="w-5 h-5 text-red-500" />}
                            </CardTitle>
                            <CardDescription className="text-base font-medium text-gray-600 mt-1">
                              {dueDate.complianceType.replace('_', ' ').toUpperCase()}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <Badge className={`text-sm px-3 py-1 ${
                              isUrgent ? 'bg-red-100 text-red-800 border-red-200' :
                              isApproaching ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                              'bg-green-100 text-green-800 border-green-200'
                            }`}>
                              {daysUntil} days
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(dueDate.dueDate)}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Entity Type:</span>
                              <span className="font-medium">{dueDate.entityType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">State:</span>
                              <span className="font-medium">{dueDate.state}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Filing Fee:</span>
                              <span className="font-medium">{dueDate.filingFee ? `$${dueDate.filingFee}` : '$0.00'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Frequency:</span>
                              <span className="font-medium capitalize">{dueDate.frequency}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 rounded-lg mb-4">
                          <p className="text-sm text-gray-700 leading-relaxed">{dueDate.description}</p>
                        </div>
                        
                        {daysUntil <= dueDate.notificationDays && (
                          <div className={`p-4 rounded-lg border ${
                            isUrgent ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'
                          }`}>
                            <div className={`flex items-center ${
                              isUrgent ? 'text-red-800' : 'text-yellow-800'
                            }`}>
                              <Bell className="w-4 h-4 mr-2" />
                              <span className="text-sm font-medium">
                                {isUrgent ? 'URGENT: ' : 'Reminder: '}
                                This deadline is approaching in {daysUntil} days.
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                </div>
                
                {/* Load More Button */}
                {visibleDeadlines < activeDueDates.length && (
                  <div className="text-center">
                    <button
                      onClick={() => setVisibleDeadlines(prev => Math.min(prev + 5, activeDueDates.length))}
                      className="bg-blue-600 hover:bg-blue-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto text-[#05ed3f]"
                    >
                      Load More ({Math.min(5, activeDueDates.length - visibleDeadlines)} more)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No upcoming compliance deadlines</h3>
                  <p className="text-gray-600">Your compliance deadlines will appear here when you have active business entities.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                {/* Custom Certificate Badge Icon */}
                <svg className="w-6 h-6 mr-3 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="certificateGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2L15.09 8.26L22 9L17 14.74L18.18 21.02L12 17.77L5.82 21.02L7 14.74L2 9L8.91 8.26L12 2Z" fill="url(#certificateGradient)" />
                  <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Completion Certificates
              </h2>
              <Badge variant="outline" className="text-green-600 border-green-200">
                {certificates.length} {certificates.length === 1 ? 'certificate' : 'certificates'}
              </Badge>
            </div>
            
            {certificatesLoading ? (
              <div className="grid gap-6">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="flex justify-between">
                        <div className="h-5 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : certificatesError ? (
              <Card className="text-center py-12">
                <CardContent>
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load completion certificates</h3>
                  <p className="text-gray-600">Please try refreshing the page or contact support if the issue persists.</p>
                </CardContent>
              </Card>
            ) : certificates && certificates.length > 0 ? (
              <div className="space-y-6">
                <div className="grid gap-6">
                  {certificates.slice(0, visibleCertificates).map((certificate) => {
                  let certData = null;
                  try {
                    certData = typeof certificate.certificateData === 'string' 
                      ? JSON.parse(certificate.certificateData) 
                      : certificate.certificateData;
                  } catch (error) {
                    console.error('Error parsing certificate data:', error);
                    certData = {};
                  }

                  return (
                    <Card key={certificate.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500 bg-green-50/30">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                              {certData?.businessName || 'Business Formation'}
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </CardTitle>
                            <CardDescription className="text-base font-medium text-gray-600 mt-1">
                              Order #{certificate.orderId}
                            </CardDescription>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                            Completed
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Entity Type:</span>
                              <span className="font-medium">{certData?.entityType || 'Corporation'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">State:</span>
                              <span className="font-medium">{certData?.state || 'DE'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Completion Date:</span>
                              <span className="font-medium">{formatDate(certificate.issuedAt)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Certificate Type:</span>
                              <span className="font-medium capitalize">{certificate.certificateType}</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDownloadCertificate(certificate.id, certificate.orderId)}
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download Certificate
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
                </div>
                
                {/* Load More Button for Certificates */}
                {visibleCertificates < certificates.length && (
                  <div className="text-center">
                    <button
                      onClick={() => setVisibleCertificates(prev => Math.min(prev + 5, certificates.length))}
                      className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
                    >
                      Load More ({Math.min(5, certificates.length - visibleCertificates)} more)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9L17 14.74L18.18 21.02L12 17.77L5.82 21.02L7 14.74L2 9L8.91 8.26L12 2Z" fill="currentColor" />
                    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No completion certificates available</h3>
                  <p className="text-gray-600">Certificates will appear here once your orders are completed and processed.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Information Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bell className="w-5 h-5 mr-2 text-blue-600" />
              Notification Schedule & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Automated Tracking</h3>
                <p className="text-sm text-gray-600">
                  AI generates compliance requirements based on your entity type and state when orders are completed.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">30-Day Reminders</h3>
                <p className="text-sm text-gray-600">
                  Email notifications are sent 30 days before deadlines. Urgent alerts appear 7 days before due dates.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Digital Certificates</h3>
                <p className="text-sm text-gray-600">
                  Download official completion certificates for all successfully processed business formations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}