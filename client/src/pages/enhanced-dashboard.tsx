import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { LoadingPage } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, CheckCircle, Clock, Plus, Shield, FileText, Mail, CreditCard, Scale, UserCheck, PieChart, Settings } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { BusinessEntity } from "@shared/schema";
import { useLocation } from "wouter";

export default function EnhancedDashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: entities = [], isLoading: entitiesLoading } = useQuery<BusinessEntity[]>({
    queryKey: ["/api/business-entities"],
    enabled: isAuthenticated,
    retry: false,
  });

  const services = [
    {
      title: "Security Dashboard",
      description: "Enterprise-grade data protection and compliance monitoring",
      icon: Shield,
      path: "/security-dashboard",
      color: "bg-red-50 text-red-600",
      badge: "95% Compliant"
    },
    {
      title: "Business Formation",
      description: "Create LLCs and Corporations with guided workflow",
      icon: Building,
      path: "/formation",
      color: "bg-blue-50 text-blue-600",
      badge: "Step-by-step"
    },
    {
      title: "Digital Mailbox",
      description: "Virtual address with mail scanning and OCR processing",
      icon: Mail,
      path: "/digital-mailbox",
      color: "bg-green-50 text-green-600",
      badge: "OCR Enabled"
    },
    {
      title: "EIN Application",
      description: "Federal tax ID number acquisition service",
      icon: CreditCard,
      path: "/ein-application",
      color: "bg-yellow-50 text-yellow-600",
      badge: "IRS Direct"
    },
    {
      title: "BOIR Filing",
      description: "Beneficial ownership information reporting",
      icon: FileText,
      path: "/boir-filing",
      color: "bg-purple-50 text-purple-600",
      badge: "Suspended 2025"
    },
    {
      title: "Legal Documents",
      description: "AI-powered document generation and templates",
      icon: Scale,
      path: "/legal-documents",
      color: "bg-indigo-50 text-indigo-600",
      badge: "AI Generated"
    },
    {
      title: "Registered Agent",
      description: "Professional registered agent services",
      icon: UserCheck,
      path: "/registered-agent",
      color: "bg-green-50 text-orange-600",
      badge: "All States"
    },
    {
      title: "S-Corp Election",
      description: "Federal S-Corporation tax election filing",
      icon: CreditCard,
      path: "/scorp-election",
      color: "bg-blue-50 text-blue-600",
      badge: "Tax Election"
    },
    {
      title: "Annual Reports",
      description: "State annual report filing and compliance tracking",
      icon: FileText,
      path: "/annual-reports",
      color: "bg-green-50 text-green-600",
      badge: "Compliance"
    },
    {
      title: "Name Change",
      description: "Business legal name change process",
      icon: Building,
      path: "/business-name-change",
      color: "bg-yellow-50 text-yellow-600",
      badge: "Legal Process"
    },
    {
      title: "Business Dissolution",
      description: "Complete business entity dissolution service",
      icon: Scale,
      path: "/business-dissolution",
      color: "bg-red-50 text-red-600",
      badge: "Dissolution"
    },
    {
      title: "Business Licenses",
      description: "License discovery and compliance management",
      icon: UserCheck,
      path: "/business-licenses",
      color: "bg-purple-50 text-purple-600",
      badge: "Licensing"
    },
    {
      title: "UX Security Demo",
      description: "Interactive security and accessibility features",
      icon: Settings,
      path: "/ux-demo",
      color: "bg-pink-50 text-pink-600",
      badge: "Interactive"
    }
  ];

  if (isLoading || entitiesLoading) {
    return <LoadingPage message="Loading your dashboard..." />;
  }

  const activeEntities = entities.filter(e => e.status === 'active' || e.status === 'filed').length;
  const completedEntities = entities.filter(e => e.status === 'filed').length;
  const inProgressEntities = entities.filter(e => e.status === 'pending' || e.status === 'processing').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">ParaFort Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive business formation and compliance platform</p>
          </div>
          <Button 
            onClick={() => setLocation("/formation")}
            className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Business
          </Button>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-[#27884b]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Entities</p>
                  <p className="text-2xl font-bold text-gray-900">{activeEntities}</p>
                </div>
                <Building className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedEntities}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressEntities}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <Card 
                key={service.title} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer group border hover:border-green-500/20"
                onClick={() => setLocation(service.path)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${service.color} group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-500 transition-colors">
                      {service.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {service.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Business Entities Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Business Entities</h2>
          
          {entities.length === 0 ? (
            <Card className="p-12 text-center">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No business entities yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first business entity</p>
              <Button 
                onClick={() => setLocation("/formation")}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Business
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map((entity) => (
                <Card key={entity.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{entity.legalName}</h3>
                      <Badge 
                        variant={entity.status === 'filed' ? 'default' : 'secondary'}
                        className={entity.status === 'filed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {entity.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p><span className="font-medium">Type:</span> {entity.entityType}</p>
                      <p><span className="font-medium">State:</span> {entity.state}</p>
                      <p><span className="font-medium">Created:</span> {new Date(entity.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setLocation(`/entity/${entity.id}`)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      {entity.status !== 'filed' && (
                        <Button 
                          size="sm"
                          onClick={() => setLocation(`/formation/${entity.id}`)}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                        >
                          Continue
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}