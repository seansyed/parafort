import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { usePageTransition } from "@/hooks/usePageTransition";
import { UnsavedChangesProvider } from "@/contexts/UnsavedChangesContext";
import { NavigationWarning } from "@/components/NavigationWarning";
import { AuthWrapper } from "@/components/AuthWrapper";


import { PageLoader } from "@/components/LoadingSpinner";
import { ParaFortPageLoader } from "@/components/ParaFortLoader";
import PageTransitionLoader from "@/components/PageTransitionLoader";

import Navigation from "@/components/navigation";
import ClientNavigation from "@/components/client-navigation";
import AdminNavigation from "@/components/admin-navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntercomWidget from "@/components/IntercomWidget";

import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import EnhancedDashboard from "@/pages/enhanced-dashboard";
import ClientDashboard from "@/pages/client-dashboard";

import SubscriptionPlans from "@/pages/subscription-plans";
import GlobalFooter from "@/components/GlobalFooter";
import FooterManager from "@/components/admin/FooterManager";
import FormationWorkflow from "@/pages/formation-workflow";
import FormationPayment from "@/pages/formation-payment";
import FormationPaymentDedicated from "@/pages/formation-payment-dedicated";
import FormationSuccess from "@/pages/formation-success";
import EntityDetails from "@/pages/entity-details";
import RegisteredAgent from "@/pages/registered-agent";
import DigitalMailbox from "@/pages/digital-mailbox";
import EinApplication from "@/pages/ein-application";
import EinService from "@/pages/ein-service";
import BoirFiling from "@/pages/boir-filing";
import BoirCheckout from "@/pages/boir-checkout";
import SCorpElection from "@/pages/scorp-election";
import SCorpElectionInfo from "@/pages/scorp-election-info";
import SCorporationElectionService from "@/pages/s-corporation-election-service";
import AnnualReportFiling from "@/pages/annual-report-filing";
import AnnualReportService from "@/pages/annual-report-service";
import AnnualReportsPage from "@/pages/annual-reports";
import BusinessNameChange from "@/pages/business-name-change";
import BusinessLegalNameChange from "@/pages/business-legal-name-change";
import BusinessDissolution from "@/pages/business-dissolution";
import BusinessDissolutionService from "@/pages/business-dissolution-service";
import BusinessFormationService from "@/pages/business-formation-service";
import LegalDocumentsPage from "@/pages/legal-documents";
import LegalDocumentsService from "@/pages/legal-documents-service";
import ContactUs from "@/pages/contact-us";
import AboutUs from "@/pages/about-us";
import CookiePreferences from "@/pages/cookie-preferences";
import CancellationPolicy from "@/pages/cancellation-policy";
import PrivacyPolicy from "@/pages/privacy-policy";
import SimpleDocumentManager from "@/components/SimpleDocumentManager";
import ClientAnnualReports from "@/components/ClientAnnualReports";
import ClientSCorpElection from "@/components/ClientSCorpElection";
import ClientBusinessLicenses from "@/components/ClientBusinessLicenses";
import BusinessLicenseServices from "@/pages/business-license-services";
import BusinessManagement from "@/pages/business-management";
import DigitalMailboxServices from "@/pages/digital-mailbox-services";
import MailboxCheckout from "@/pages/mailbox-checkout";
import FictitiousBusinessServices from "@/pages/fictitious-business-services";
import RegisteredAgentServices from "@/pages/registered-agent-services";
import BusinessLicenses from "@/pages/business-licenses";
import AccountingBookkeepingServices from "@/pages/accounting-bookkeeping-services";
import BusinessPayrollServices from "@/pages/business-payroll-services";
import BusinessTaxFilingServices from "@/pages/business-tax-filing-services";
import TaxFilingCheckout from "@/pages/tax-filing-checkout";
import ClientTaxFiling from "@/pages/client-tax-filing";
import UXSecurityDemo from "@/pages/ux-security-demo";
import SecurityDashboard from "@/pages/security-dashboard";
import ComplianceDashboard from "@/pages/compliance-dashboard";
import AdminSubscriptionManagement from "@/pages/admin-subscription-management";
import AdminClientManagement from "@/pages/admin-client-management";
import AdminClientManagementTest from "@/pages/admin-client-management-test";
import AdminDocumentManagement from "@/pages/admin-document-management";
import ClientSubscriptionDashboard from "@/pages/client-subscription-dashboard";
import AnnualReportDueDates from "@/pages/annual-report-due-dates";

import MailboxPlans from "@/pages/mailbox-plans";
import ServicesMarketplace from "@/pages/services-marketplace";
import EntityComparison from "@/pages/entity-comparison";
import EntityRequirements from "@/pages/entity-requirements";
import BusinessNameGenerator from "@/pages/business-name-generator";

import BusinessTools from "@/pages/business-tools";
import LLCCorporationKit from "@/pages/llc-corporation-kit";
import MultiBusinessDashboard from "@/pages/multi-business-dashboard";
import ServicePurchase from "@/pages/service-purchase";
import ServiceOrders from "@/pages/service-orders-new";
import ServiceOrderDetails from "@/pages/service-order-details";
import ServiceOrderConfirmation from "@/pages/service-order-confirmation";
import AdminOrderDetails from "@/pages/admin/order-details";
import BookkeepingServices from "@/pages/bookkeeping-services";
import PayrollServices from "@/pages/payroll-services";
import PayrollCheckout from "@/pages/payroll-checkout";
import PayrollPurchase from "@/pages/payroll-purchase";
import PaymentSuccess from "@/pages/payment-success";
import TaxFilingServices from "@/pages/tax-filing-services";
import AdminPlanManagement from "@/pages/admin-plan-management";
import AdminPricing from "@/pages/admin-pricing";
import AdminSecurity from "@/pages/admin-security";
import AdminDatabase from "@/pages/admin-database";
import BusinessHealthRadar from "@/pages/business-health-radar";
import AdminSettings from "@/pages/admin-settings";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminOrders from "@/pages/admin-orders";
import AdminOrderTracking from "@/pages/admin-order-tracking";
import OrderTracking from "@/pages/order-tracking";
import Settings from "@/pages/settings";
import Filings from "@/pages/filings";
import Documents from "@/pages/documents";
import BusinessFilings from "@/pages/business-filings";
import Notifications from "@/pages/notifications";
import Checkout from "@/pages/checkout";
import CheckoutDemo from "@/pages/checkout-demo";
import ClientDocumentsPage from "@/pages/client-documents";
import DocumentCenter from "@/pages/document-center";
import AIAssistant from "@/pages/ai-assistant";
import GeminiChat from "@/pages/gemini-chat";
import Invoices from "@/pages/invoices";
import PaymentMethods from "@/pages/payment-methods";
import EinManagement from "@/pages/ein-management";
import Bookkeeping from "@/pages/bookkeeping";
import BookkeepingCheckout from "@/pages/bookkeeping-checkout";
import MultiStepCheckout from "@/pages/multi-step-checkout";
import DynamicCheckout from "@/pages/dynamic-checkout";
import ServiceCheckout from "@/pages/service-checkout";
import PostPaymentForm from "@/pages/post-payment-form";
import Payroll from "@/pages/payroll";
import EnhancedServicesDashboard from "@/pages/enhanced-services-dashboard";
import NotFound from "@/pages/not-found";
import AdminDocuments from "@/pages/admin-documents-new";
import ClientDocumentsNew from "@/pages/client-documents-new";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminBusinessEntities from "@/pages/admin-business-entities";
import ComplianceVisualization from "@/pages/ComplianceVisualization";
import ComplianceCalendar from "@/pages/compliance-calendar";

import AuthPage from "@/pages/auth-page";
import AdminAuthPage from "@/pages/admin-auth-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import AnnouncementManager from "@/components/admin/AnnouncementManager";

// Entity Type Pages
import SoleProprietorship from "@/pages/entity-types/sole-proprietorship";
import Partnership from "@/pages/entity-types/partnership";
import LLC from "@/pages/entity-types/llc";
import CCorporation from "@/pages/entity-types/c-corporation";
import SCorporation from "@/pages/entity-types/s-corporation";
import ProfessionalCorporation from "@/pages/entity-types/professional-corporation";
import PLLC from "@/pages/entity-types/pllc";
import Nonprofit from "@/pages/entity-types/nonprofit";
import Cooperative from "@/pages/entity-types/cooperative";

// Function to check if footer should be hidden on specific client pages
function shouldHideFooter(pathname: string): boolean {
  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) {
    return true;
  }
  
  // Hide footer on auth pages
  if (pathname === '/auth' || pathname === '/login' || pathname === '/register' || 
      pathname === '/admin/auth' || pathname === '/admin-auth' || pathname === '/forgot-password') {
    return true;
  }
  
  // Hide footer only on authenticated user dashboard and internal pages
  const authenticatedOnlyPaths = [
    '/client-dashboard',
    '/dashboard',
    '/enhanced-dashboard',
    '/multi-business-dashboard',
    '/client-subscription-dashboard',
    '/security-dashboard',
    '/compliance-dashboard',
    '/documents',
    '/client-documents',
    '/filings',
    '/settings',
    '/payment-methods',
    '/invoices',
    '/ai-assistant',
    '/gemini-chat',
    '/order-tracking',
    '/my-orders',
    '/service-orders',
    '/ein-management',
    '/client-tax-filing',
    '/multi-business',
    '/business-health-radar',
    '/client-annual-reports',
    '/client-scorp-election',
    '/client-licenses',
    '/document-center'
  ];
  
  // Check if the pathname starts with any of the authenticated-only paths
  return authenticatedOnlyPaths.some(path => pathname.startsWith(path));
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isLoading: isPageTransitioning } = usePageTransition();
  const [location] = useLocation();
  

  
  // Automatically detect admin status and set view mode
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');
  const [viewMode, setViewMode] = useState<'client' | 'admin'>(isAdmin ? 'admin' : 'client');
  
  // Update viewMode when user auth status changes
  useEffect(() => {
    console.log('User data:', user);
    console.log('Is Admin:', isAdmin);
    if (isAdmin) {
      console.log('Setting admin view mode');
      setViewMode('admin');
    } else if (user) {
      console.log('Setting client view mode');
      setViewMode('client');
    }
  }, [user, isAdmin]);

  // Force admin view for admin users on admin routes
  useEffect(() => {
    if (isAdmin && (window.location.pathname.startsWith('/admin'))) {
      setViewMode('admin');
    }
  }, [isAdmin, window.location.pathname]);

  // Check if user is a client (has clientId) or admin
  const isClient = user && user.clientId;
  
  // Check if current page is a sign-in/auth page where navigation should be hidden
  const isAuthPage = location === '/auth' || location === '/login' || location === '/register' || 
                     location === '/admin/auth' || location === '/admin-auth' || location === '/forgot-password';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Show top navigation only for non-authenticated users and not on auth pages */}
      {(!isAuthenticated && !isAuthPage) && <Navigation />}
      
      {/* Show navigation based on current view mode but not on auth pages */}
      {isAuthenticated && viewMode === 'admin' && !isAuthPage && <AdminNavigation />}
      {isAuthenticated && viewMode === 'client' && !isAuthPage && <ClientNavigation />}
      
      {/* Show header for client view only but not on auth pages */}
      {isAuthenticated && viewMode === 'client' && !isAuthPage && <Header />}
      
      {/* Role switcher for admin users only */}
      {isAuthenticated && isAdmin && (
        <div className="fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-lg border">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('client')}
              className={`px-3 py-1 text-xs rounded ${
                viewMode === 'client' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Client View
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1 text-xs rounded ${
                viewMode === 'admin' 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Admin View
            </button>
          </div>
        </div>
      )}
      
      {/* Main content area with proper spacing for navigation, but not on auth pages */}
      <div className={`flex-1 ${isAuthenticated && !isAuthPage ? "ml-80" : ""}`}>
        <AuthWrapper>
          <PageTransitionLoader isLoading={isPageTransitioning}>
            <Switch>
          {/* Authentication Pages - Must be first and outside AuthWrapper */}
          <Route path="/auth" component={AuthPage} />
          <Route path="/login" component={AuthPage} />
          <Route path="/register" component={AuthPage} />
          <Route path="/admin/auth" component={AdminAuthPage} />
          <Route path="/admin-auth" component={AdminAuthPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          
          {/* Home page routing */}
          {!isAuthenticated ? (
            <Route path="/" component={Landing} />
          ) : (
            <Route path="/" component={ClientDashboard} />
          )}
          
          {/* All other routes - accessible regardless of auth state */}
          <Route path="/checkout" component={Checkout} />
          <Route path="/checkout/:serviceId" component={Checkout} />
          <Route path="/dynamic-checkout/:serviceId" component={DynamicCheckout} />
          <Route path="/payment-success" component={PaymentSuccess} />
          <Route path="/client-dashboard" component={ClientDashboard} />
          <Route path="/client-tax-filing" component={ClientTaxFiling} />
          <Route path="/compliance" component={ComplianceCalendar} />
          <Route path="/compliance-dashboard" component={ComplianceCalendar} />
        <Route path="/subscription-plans" component={SubscriptionPlans} />
        <Route path="/dashboard">
          {viewMode === 'admin' ? <Dashboard /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/dashboard">
          {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
        </Route>
        <Route path="/admin">
          {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/clients">
          {viewMode === 'admin' ? <AdminClientManagement /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/business-entities">
          {viewMode === 'admin' ? <AdminBusinessEntities /> : <ClientDashboard />}
        </Route>

        <Route path="/admin/services">
          {viewMode === 'admin' ? <AdminSubscriptionManagement /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/pricing">
          {viewMode === 'admin' ? <AdminPricing /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/security">
          {viewMode === 'admin' ? <AdminSecurity /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/database">
          {viewMode === 'admin' ? <AdminDatabase /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/settings">
          {viewMode === 'admin' ? <AdminSettings /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/analytics">
          {viewMode === 'admin' ? <AdminAnalytics /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/reports">
          {viewMode === 'admin' ? <AdminAnalytics /> : <ClientDashboard />}
        </Route>
        <Route path="/compliance-visualization">
          <ComplianceVisualization />
        </Route>
        <Route path="/admin/orders">
          {viewMode === 'admin' ? <AdminOrders /> : <ClientDashboard />}
        </Route>
        <Route path="/admin-orders">
          {viewMode === 'admin' ? <AdminOrders /> : <ClientDashboard />}
        </Route>
        <Route path="/admin/plan-management">
          {viewMode === 'admin' ? <AdminPlanManagement /> : <ClientDashboard />}
        </Route>
        <Route path="/admin-plan-management">
          {viewMode === 'admin' ? <AdminPlanManagement /> : <ClientDashboard />}
        </Route>
        <Route path="/formation" component={() => <FormationWorkflow />} />
        <Route path="/formation-workflow" component={() => <FormationWorkflow />} />
        <Route path="/formation/:id" component={() => <FormationWorkflow />} />
        <Route path="/formation-payment" component={FormationPayment} />
        <Route path="/formation-payment-dedicated" component={FormationPaymentDedicated} />
        <Route path="/formation-success" component={FormationSuccess} />
        <Route path="/entity/:id" component={EntityDetails} />
        <Route path="/entity/:id/registered-agent" component={RegisteredAgent} />
        <Route path="/entity/:id/digital-mailbox" component={DigitalMailbox} />
        <Route path="/entity/:id/ein-application" component={EinApplication} />
        <Route path="/entity/:id/scorp-election" component={SCorpElection} />
        <Route path="/entity/:id/annual-report" component={AnnualReportFiling} />
        <Route path="/entity/:id/name-change" component={BusinessNameChange} />
        <Route path="/entity/:id/dissolution" component={BusinessDissolution} />
        <Route path="/entity/:id/business-licenses" component={BusinessLicenses} />
        <Route path="/digital-mailbox" component={DigitalMailbox} />
        <Route path="/mailbox" component={DigitalMailbox} />
        <Route path="/mailbox/:id" component={DigitalMailbox} />
        <Route path="/ein-application" component={EinApplication} />
        <Route path="/ein" component={EinManagement} />
        <Route path="/ein-management" component={EinManagement} />
        <Route path="/bookkeeping" component={Bookkeeping} />
        <Route path="/bookkeeping-checkout" component={BookkeepingCheckout} />
        <Route path="/ein-service" component={EinService} />
        <Route path="/tax-id" component={EinService} />
        <Route path="/registered-agent" component={RegisteredAgent} />
        <Route path="/agent" component={RegisteredAgent} />
        <Route path="/business-licenses" component={BusinessLicenses} />
        <Route path="/licenses" component={BusinessLicenses} />
        <Route path="/annual-report-filing" component={AnnualReportsPage} />
        <Route path="/annual-report" component={AnnualReportsPage} />
        <Route path="/business-name-change" component={BusinessNameChange} />
        <Route path="/name-change" component={BusinessNameChange} />
        <Route path="/business-legal-name-change" component={BusinessLegalNameChange} />
        <Route path="/legal-name-change" component={BusinessLegalNameChange} />
        <Route path="/business-dissolution" component={BusinessDissolution} />
        <Route path="/dissolution" component={BusinessDissolution} />
        <Route path="/business-dissolution-service" component={BusinessDissolutionService} />
        <Route path="/dissolution-service" component={BusinessDissolutionService} />
        <Route path="/business-formation" component={BusinessFormationService} />
        <Route path="/business-formation-service" component={BusinessFormationService} />
        <Route path="/formation" component={BusinessFormationService} />
        <Route path="/incorporate" component={BusinessFormationService} />
        <Route path="/scorp-election" component={SCorpElectionInfo} />
        <Route path="/scorp" component={SCorpElectionInfo} />
        <Route path="/s-corporation-election" component={SCorporationElectionService} />
        <Route path="/s-corp-election" component={SCorporationElectionService} />
        <Route path="/annual-reports" component={AnnualReportsPage} />
        <Route path="/annual-report-service" component={AnnualReportService} />
        <Route path="/annual-filing" component={AnnualReportService} />
        <Route path="/legal-documents" component={LegalDocumentsPage} />
        <Route path="/documents">
          {viewMode === 'admin' ? <AdminDocuments /> : <Documents />}
        </Route>
        <Route path="/admin/documents">
          {viewMode === 'admin' ? <AdminDocuments /> : <Documents />}
        </Route>
        <Route path="/admin-documents-new">
          {viewMode === 'admin' ? <AdminDocuments /> : <Documents />}
        </Route>
        <Route path="/client-documents" component={ClientDocumentsNew} />
        <Route path="/client-annual-reports" component={ClientAnnualReports} />
        <Route path="/client/annual-reports" component={ClientAnnualReports} />
        <Route path="/client-scorp-election" component={ClientSCorpElection} />
        <Route path="/client/scorp-election" component={ClientSCorpElection} />
        <Route path="/client-licenses" component={ClientBusinessLicenses} />
        <Route path="/client/licenses" component={ClientBusinessLicenses} />
        <Route path="/legal-documents-service" component={LegalDocumentsService} />
        <Route path="/legal-templates" component={LegalDocumentsService} />
        
        {/* Services & Compliance Menu Pages */}
        <Route path="/business-license" component={BusinessLicenseServices} />
        <Route path="/business-license-services" component={BusinessLicenseServices} />
        <Route path="/business-licenses" component={BusinessLicenseServices} />
        <Route path="/business-management" component={BusinessManagement} />
        <Route path="/business-management-services" component={BusinessManagement} />
        <Route path="/digital-mailbox/:id" component={DigitalMailbox} />
        <Route path="/digital-mailbox" component={DigitalMailboxServices} />
        <Route path="/digital-mailbox-services" component={DigitalMailboxServices} />
        <Route path="/mailbox-checkout" component={MailboxCheckout} />
        <Route path="/fictitious-business" component={FictitiousBusinessServices} />
        <Route path="/fictitious-business-services" component={FictitiousBusinessServices} />
        <Route path="/dba-services" component={FictitiousBusinessServices} />
        <Route path="/registered-agent" component={RegisteredAgentServices} />
        <Route path="/registered-agent-services" component={RegisteredAgentServices} />
        
        {/* Accounting & Tax Menu Pages */}
        <Route path="/accounting-bookkeeping" component={AccountingBookkeepingServices} />
        <Route path="/accounting-bookkeeping-services" component={AccountingBookkeepingServices} />
        <Route path="/bookkeeping-services" component={BookkeepingServices} />
        <Route path="/bookkeeping" component={BookkeepingServices} />
        <Route path="/business-payroll" component={BusinessPayrollServices} />
        <Route path="/business-payroll-services" component={BusinessPayrollServices} />
        <Route path="/payroll-services" component={PayrollServices} />
        <Route path="/payroll" component={PayrollServices} />
        <Route path="/business-tax-filing" component={BusinessTaxFilingServices} />
        <Route path="/business-tax-filing-services" component={BusinessTaxFilingServices} />
        <Route path="/tax-filing-checkout" component={TaxFilingCheckout} />
        <Route path="/tax-filing" component={BusinessTaxFilingServices} />
        
        <Route path="/boir-filing" component={BoirFiling} />
        <Route path="/boir" component={BoirFiling} />
        <Route path="/boir-checkout" component={BoirCheckout} />
        <Route path="/ux-demo" component={UXSecurityDemo} />
        <Route path="/security-dashboard" component={SecurityDashboard} />
        <Route path="/compliance-dashboard" component={ComplianceCalendar} />
        <Route path="/compliance" component={ComplianceCalendar} />
        <Route path="/compliance-calendar" component={ComplianceCalendar} />
        <Route path="/business-health-radar" component={BusinessHealthRadar} />
        <Route path="/health-radar" component={BusinessHealthRadar} />
        <Route path="/subscription-plans" component={SubscriptionPlans} />
        <Route path="/admin/clients" component={AdminClientManagement} />
        <Route path="/admin/announcements" component={AnnouncementManager} />
        <Route path="/admin/subscriptions" component={AdminSubscriptionManagement} />
        <Route path="/admin-subscription-management" component={AdminSubscriptionManagement} />
        <Route path="/admin/plan-management" component={AdminPlanManagement} />
        <Route path="/my-subscription" component={ClientSubscriptionDashboard} />

        <Route path="/mailbox-plans" component={MailboxPlans} />
        <Route path="/virtual-mail" component={MailboxPlans} />
        <Route path="/services-marketplace" component={ServicesMarketplace} />
        <Route path="/services" component={ServicesMarketplace} />
        <Route path="/enhanced-services" component={EnhancedServicesDashboard} />
        <Route path="/services-dashboard" component={EnhancedServicesDashboard} />
        <Route path="/entity-comparison" component={EntityComparison} />
        <Route path="/entity-requirements" component={EntityRequirements} />
        <Route path="/business-name-generator" component={BusinessNameGenerator} />

        <Route path="/business-tools" component={BusinessTools} />
        <Route path="/llc-corporation-kit" component={LLCCorporationKit} />
        
        {/* Entity Type Pages */}
        <Route path="/entity-types/sole-proprietorship" component={SoleProprietorship} />
        <Route path="/entity-types/partnership" component={Partnership} />
        <Route path="/entity-types/llc" component={LLC} />
        <Route path="/entity-types/c-corporation" component={CCorporation} />
        <Route path="/entity-types/s-corporation" component={SCorporation} />
        <Route path="/entity-types/professional-corporation" component={ProfessionalCorporation} />
        <Route path="/entity-types/pllc" component={PLLC} />
        <Route path="/entity-types/nonprofit" component={Nonprofit} />
        <Route path="/entity-types/cooperative" component={Cooperative} />

        <Route path="/annual-report-due-dates" component={AnnualReportDueDates} />
        <Route path="/multi-business" component={MultiBusinessDashboard} />
        <Route path="/business/:id/filings" component={BusinessFilings} />
        <Route path="/notifications" component={Notifications} />
        <Route path="/service-purchase" component={() => <ServicePurchase />} />
        <Route path="/service-orders" component={ServiceOrders} />
        <Route path="/service-orders/:id" component={ServiceOrderDetails} />
        <Route path="/service-order-confirmation" component={ServiceOrderConfirmation} />
        <Route path="/bookkeeping" component={BookkeepingServices} />
        <Route path="/bookkeeping-checkout" component={BookkeepingCheckout} />
        <Route path="/payroll" component={Payroll} />
        <Route path="/payroll-checkout" component={PayrollCheckout} />
        <Route path="/payroll-purchase" component={PayrollPurchase} />
        <Route path="/payment-success" component={PaymentSuccess} />
        <Route path="/tax-filing" component={TaxFilingServices} />
        <Route path="/filings" component={Filings} />
        <Route path="/documents" component={Documents} />
        <Route path="/document-center" component={DocumentCenter} />
        <Route path="/client-documents-old" component={SimpleDocumentManager} />
        <Route path="/legal-documents" component={Documents} />
        <Route path="/settings" component={Settings} />
        <Route path="/payment-methods" component={PaymentMethods} />
        <Route path="/invoices" component={Invoices} />
        <Route path="/ai-assistant" component={AIAssistant} />
        <Route path="/gemini-chat" component={GeminiChat} />
        <Route path="/order-tracking" component={OrderTracking} />
        <Route path="/my-orders" component={OrderTracking} />
        <Route path="/admin/order-tracking" component={AdminOrderTracking} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/checkout-demo" component={CheckoutDemo} />
        <Route path="/multi-step-checkout/:serviceId" component={MultiStepCheckout} />
        <Route path="/service-checkout/:serviceId" component={ServiceCheckout} />
        <Route path="/post-payment-form/:orderId" component={PostPaymentForm} />
        <Route path="/payment-success" component={PaymentSuccess} />

        <Route path="/admin/footer-management" component={FooterManager} />
        <Route path="/admin/order-details/:orderId" component={AdminOrderDetails} />
        

        
        {/* Support Pages */}
        <Route path="/contact-us" component={ContactUs} />
        <Route path="/about-us" component={AboutUs} />
        <Route path="/cookie-preferences" component={CookiePreferences} />
        <Route path="/cancellation-policy" component={CancellationPolicy} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        
        <Route component={NotFound} />
        </Switch>
          </PageTransitionLoader>
        </AuthWrapper>
      </div>
      
      {/* Show footer for all users except on specific client pages */}
      {!shouldHideFooter(location) && <GlobalFooter />}
      
      {/* Intercom chat widget */}
      <IntercomWidget />

    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UnsavedChangesProvider>
        <NavigationWarning>
          <TooltipProvider>
            <Toaster />
            <Router />

          </TooltipProvider>
        </NavigationWarning>
      </UnsavedChangesProvider>
    </QueryClientProvider>
  );
}

export default App;
