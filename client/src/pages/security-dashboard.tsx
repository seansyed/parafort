import { useState, useEffect } from 'react';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Activity, FileText, Users, Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SecurityMetrics {
  encryptedDataCount: number;
  auditLogCount: number;
  securityIncidents: number;
  complianceScore: number;
  lastAuditDate: string | null;
}

interface AuditLog {
  id: number;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export default function SecurityDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading: metricsLoading } = useQuery<SecurityMetrics>({
    queryKey: ['/api/security/metrics'],
  });

  const { data: auditLogs, isLoading: logsLoading } = useQuery<AuditLog[]>({
    queryKey: ['/api/security/audit-logs'],
  });

  const initializePolicies = useMutation({
    mutationFn: () => apiRequest('POST', '/api/security/initialize-policies'),
    onSuccess: () => {
      toast({
        title: "Security Policies Initialized",
        description: "Default data retention policies have been set up successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/security/metrics'] });
    },
    onError: () => {
      toast({
        title: "Initialization Failed",
        description: "Failed to initialize security policies. Please try again.",
        variant: "destructive",
      });
    },
  });

  const enforceRetention = useMutation({
    mutationFn: () => apiRequest('POST', '/api/security/enforce-retention'),
    onSuccess: () => {
      toast({
        title: "Data Retention Enforced",
        description: "Data retention policies have been successfully enforced.",
      });
    },
    onError: () => {
      toast({
        title: "Enforcement Failed",
        description: "Failed to enforce data retention policies.",
        variant: "destructive",
      });
    },
  });

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceStatus = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Attention';
  };

  if (metricsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-500" />
              Security & Compliance Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enterprise-grade data protection and compliance monitoring for ParaFort
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => initializePolicies.mutate()}
              disabled={initializePolicies.isPending}
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              Initialize Policies
            </Button>
            <Button
              onClick={() => enforceRetention.mutate()}
              disabled={enforceRetention.isPending}
              className="bg-green-500 hover:bg-green-600"
            >
              <Clock className="w-4 h-4 mr-2" />
              Enforce Retention
            </Button>
          </div>
        </div>

        {/* Security Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Encrypted Data Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics?.encryptedDataCount?.toLocaleString() || '0'}
              </div>
              <Badge variant="secondary" className="mt-2">
                AES-256 Encryption
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Audit Log Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics?.auditLogCount?.toLocaleString() || '0'}
              </div>
              <Badge variant="secondary" className="mt-2">
                Full Traceability
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Open Security Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metrics?.securityIncidents || '0'}
              </div>
              <Badge variant={metrics?.securityIncidents === 0 ? "secondary" : "destructive"} className="mt-2">
                {metrics?.securityIncidents === 0 ? 'All Clear' : 'Needs Review'}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#27884b]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getComplianceColor(metrics?.complianceScore || 0)}`}>
                {metrics?.complianceScore || 0}%
              </div>
              <Badge 
                variant={metrics?.complianceScore >= 90 ? "secondary" : "destructive"} 
                className="mt-2"
              >
                {getComplianceStatus(metrics?.complianceScore || 0)}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Security Overview</TabsTrigger>
            <TabsTrigger value="encryption">Data Protection</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Controls Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Security Controls Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Data Encryption</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Access Control</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Logging</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Incident Monitoring</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Retention</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Configured
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-500" />
                    Compliance Framework
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>GDPR Compliance</span>
                      <span>95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Data Security Standards</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Audit Requirements</span>
                      <span>88%</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Access Control</span>
                      <span>90%</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="encryption" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Encryption Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-500" />
                    Data Encryption Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium">Encryption Active</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All sensitive data is encrypted using AES-256-CBC encryption standard
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Personal Identifiable Information (PII)</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Encrypted
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Social Security Numbers (SSN)</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Encrypted
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Employer Identification Numbers (EIN)</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Encrypted
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Financial Data</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Encrypted
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span>Legal Documents</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Encrypted
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Protection Policies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    Data Protection Policies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-1">Data Minimization</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Only essential business formation data is collected and stored
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-1">Access Control</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Role-based access with principle of least privilege
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-1">Data Retention</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        7-year retention for business records, 10-year for legal documents
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="font-medium mb-1">Secure Deletion</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Cryptographic erasure for data past retention period
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* GDPR Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-500" />
                    GDPR Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Data Processing Lawfulness</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Legal basis for all data processing activities
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Consent Management</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Explicit consent tracking and management
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Data Subject Rights</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Access, rectification, erasure, and portability
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Privacy by Design</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Built-in privacy protection measures
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Standards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    Security Standards Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">ISO 27001</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Information security management system
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        In Progress
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">SOC 2 Type II</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Security, availability, and confidentiality
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Planned
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">AES-256 Encryption</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Industry-standard encryption protocols
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">TLS 1.3</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Secure data transmission protocols
                        </div>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Recent Audit Log Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs?.slice(0, 10).map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{log.action}</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              on {log.resource}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          User: {log.userId} • IP: {log.ipAddress}
                        </div>
                        {Object.keys(log.details).length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Details: {JSON.stringify(log.details, null, 2).substring(0, 100)}...
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-center py-8 text-gray-500">
                        No audit logs available. Audit logging is active and will appear here.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}