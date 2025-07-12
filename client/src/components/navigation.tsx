import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUnsavedChanges } from "@/contexts/UnsavedChangesContext";
import { ConfirmingLink } from "@/components/ConfirmingLink";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Building2, FileText, DollarSign, Clipboard, Calculator, Hash, Shield, Scale, BookOpen, Users, Lock, Eye, Download, Award, MapPin, MailOpen, Edit3, User, Receipt, Wallet, Percent, BarChart3, Calendar, Phone, Clock, Lightbulb, Building, GraduationCap, Heart, Handshake, Globe, MonitorSpeaker } from "lucide-react";
const logoPath = "/parafort-logo-white.png";
import { NotificationBell } from "@/components/notification-bell";
import { useState } from "react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChanges();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);



  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-[100]" key="navigation-v3">
      <div className="max-w-[87.5rem] mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <img 
              src={logoPath} 
              alt="ParaFort - Business Services & Compliance" 
              className="h-20 w-auto"
            />
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Business Services Dropdown */}
            <DropdownMenu open={isServicesOpen} onOpenChange={setIsServicesOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1" style={{ color: '#374151' }}>
                  Business Services
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-2 z-50 dropdown-menu-content" align="start" style={{ zIndex: 9999 }}>
                {/* Formation Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Formation Services
                </div>
                <ConfirmingLink 
                  to="/business-formation"
                  hasUnsavedChanges={hasUnsavedChanges}
                  setHasUnsavedChanges={setHasUnsavedChanges}
                >
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <Building2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Business Formation</div>
                      <div className="text-sm text-gray-600">Start your LLC or Corporation professionally</div>
                    </div>
                  </DropdownMenuItem>
                </ConfirmingLink>

                <DropdownMenuSeparator />

                {/* Compliance Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Compliance Services
                </div>
                <Link href="/boir-filing">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => setIsServicesOpen(false)}>
                    <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">BOIR Filing</div>
                      <div className="text-sm text-gray-600">Corporate Transparency Act compliance</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/annual-report-service">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => setIsServicesOpen(false)}>
                    <Clipboard className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Annual Report Filing</div>
                      <div className="text-sm text-gray-600">Stay compliant with state requirements</div>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                {/* Tax Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tax Services
                </div>
                <Link href="/ein-service">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => setIsServicesOpen(false)}>
                    <Hash className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">EIN Application</div>
                      <div className="text-sm text-gray-600">Get your Federal Tax ID quickly</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/s-corporation-election">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => setIsServicesOpen(false)}>
                    <Calculator className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">S-Corporation Election</div>
                      <div className="text-sm text-gray-600">Save on self-employment taxes</div>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                {/* Business Changes */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Business Changes
                </div>
                <Link href="/business-legal-name-change">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => setIsServicesOpen(false)}>
                    <FileText className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Legal Name Change</div>
                      <div className="text-sm text-gray-600">Rebrand your business officially</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/business-dissolution-service">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer" onClick={() => setIsServicesOpen(false)}>
                    <Scale className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Business Dissolution</div>
                      <div className="text-sm text-gray-600">Close your business properly</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>



            {/* Services & Compliance Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1" style={{ color: '#374151' }}>
                  Services & Compliance
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-2 z-50 dropdown-menu-content" align="start" style={{ zIndex: 9999 }}>
                {/* Licensing Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Licensing Services
                </div>
                <Link href="/business-license-services">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <Award className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Business License Services</div>
                      <div className="text-sm text-gray-600">Get all required permits and licenses</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/fictitious-business-services">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <Edit3 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Fictitious Business Name</div>
                      <div className="text-sm text-gray-600">Register your DBA professionally</div>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                {/* Ongoing Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Ongoing Services
                </div>
                <Link href="/registered-agent-services">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <User className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Registered Agent Services</div>
                      <div className="text-sm text-gray-600">Professional legal document receipt</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/digital-mailbox-services">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <MailOpen className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Digital Mailbox Services</div>
                      <div className="text-sm text-gray-600">Virtual mail scanning and forwarding</div>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                {/* Management Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Management Services
                </div>
                <Link href="/business-management">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <Building2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Business Management</div>
                      <div className="text-sm text-gray-600">Comprehensive operations support</div>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                {/* Legal Documents */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Legal Documents
                </div>
                <Link href="/legal-documents">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <BookOpen className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Legal Document Library</div>
                      <div className="text-sm text-gray-600">Professional legal templates & forms</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Accounting & Tax Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Accounting & Tax
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80 p-2 z-50 dropdown-menu-content" align="start" style={{ zIndex: 9999 }}>
                {/* Financial Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Financial Services
                </div>
                <Link href="/accounting-bookkeeping-services">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <Receipt className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Accounting & Bookkeeping</div>
                      <div className="text-sm text-gray-600">Professional financial management</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Link href="/business-payroll-services">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <Wallet className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Business Payroll Services</div>
                      <div className="text-sm text-gray-600">Complete payroll processing</div>
                    </div>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                {/* Tax Services */}
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tax Services
                </div>
                <Link href="/business-tax-filing-services">
                  <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer">
                    <Percent className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Business Tax Filing</div>
                      <div className="text-sm text-gray-600">Expert tax preparation and filing</div>
                    </div>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Tools Dropdown */}
            <DropdownMenu open={isToolsOpen} onOpenChange={setIsToolsOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1" style={{ color: '#374151' }}>
                  Tools
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[720px] p-4 z-50 dropdown-menu-content" align="start" style={{ zIndex: 9999 }}>
                <div className="grid grid-cols-3 gap-6">
                  {/* Column 1: Business Planning Tools */}
                  <div>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Business Planning Tools
                    </div>
                    <div className="space-y-1">
                      <Link href="/business-name-generator">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Lightbulb className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Business Name Generator</div>
                            <div className="text-xs text-gray-600">AI-powered name suggestions</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-comparison">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Scale className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Entity Comparison Tool</div>
                            <div className="text-xs text-gray-600">Compare entity types</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-requirements">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <FileText className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Entity Requirements</div>
                            <div className="text-xs text-gray-600">State-specific requirements</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/business-learning-center">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <GraduationCap className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-sm">Business Learning Center</div>
                              <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">New</span>
                            </div>
                            <div className="text-xs text-gray-600">12+ courses for business growth</div>
                          </div>
                        </div>
                      </Link>

                      <Link href="/llc-corporation-kit">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <BookOpen className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">LLC/Corporation Kit</div>
                            <div className="text-xs text-gray-600">Professional corporate records kit</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/annual-report-due-dates">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Calendar className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Annual Report Due Dates</div>
                            <div className="text-xs text-gray-600">State filing deadlines</div>
                          </div>
                        </div>
                      </Link>
                      
                      <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer opacity-60">
                        <Globe className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm">Free Website for your Business</div>
                            <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                          </div>
                          <div className="text-xs text-gray-600">Professional website builder</div>
                        </div>
                      </div>
                      

                    </div>
                  </div>

                  {/* Column 2: Basic Entity Types */}
                  <div>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Basic Entity Types
                    </div>
                    <div className="space-y-1">
                      <Link href="/entity-types/sole-proprietorship">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <User className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Sole Proprietorship</div>
                            <div className="text-xs text-gray-600">Simplest structure</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-types/partnership">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Users className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Partnership</div>
                            <div className="text-xs text-gray-600">Two or more partners</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-types/llc">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Shield className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">LLC</div>
                            <div className="text-xs text-gray-600">Flexible with protection</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-types/c-corporation">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Building className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">C Corporation</div>
                            <div className="text-xs text-gray-600">Traditional corporation</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-types/s-corporation">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Building2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">S Corporation</div>
                            <div className="text-xs text-gray-600">Pass-through taxation</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>

                  {/* Column 3: Specialized Entity Types */}
                  <div>
                    <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Specialized Entity Types
                    </div>
                    <div className="space-y-1">
                      <Link href="/entity-types/professional-corporation">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <GraduationCap className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Professional Corporation</div>
                            <div className="text-xs text-gray-600">For licensed professionals</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-types/pllc">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Award className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Professional LLC</div>
                            <div className="text-xs text-gray-600">LLC for professionals</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-types/nonprofit">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Heart className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Nonprofit Corporation</div>
                            <div className="text-xs text-gray-600">Tax-exempt organization</div>
                          </div>
                        </div>
                      </Link>
                      <Link href="/entity-types/cooperative">
                        <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer" onClick={() => setIsToolsOpen(false)}>
                          <Handshake className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">Cooperative</div>
                            <div className="text-xs text-gray-600">Member-owned business</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <>
                <Link href="/multi-business">
                  <Button
                    variant={location === "/multi-business" ? "default" : "ghost"}
                    className="text-gray-700 hover:text-green-500"
                  >
                    My Businesses
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    variant={location === "/dashboard" ? "default" : "ghost"}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/subscriptions">
                  <Button
                    variant={location === "/admin/subscriptions" ? "default" : "ghost"}
                  >
                    Admin
                  </Button>
                </Link>
                {/* Notification Bell */}
                <NotificationBell />
                
                {/* User Profile Inline */}
                <div className="flex items-center gap-2">
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {user?.firstName
                        ? user.firstName.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {user?.firstName || "User"} {user?.lastName || ""}
                  </span>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                {/* Contact Information Dropdown */}
                <DropdownMenu open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-orange-500 hover:text-orange-600 hover:bg-orange-50">
                      <Phone className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64" style={{ zIndex: 9999 }}>
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-orange-500" />
                          Sales & Support
                        </div>
                        <div className="text-lg font-medium text-gray-900">
                          844-444-5411
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          Business Hours
                        </div>
                        <div className="text-sm text-gray-600">
                          Monday - Friday: 8am to 5pm PST
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <MailOpen className="h-4 w-4 text-orange-500" />
                          Sales chat
                        </div>
                        <div className="text-sm text-gray-600">
                          Available during business hours
                        </div>
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/business-formation">
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
                    style={{ 
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ color: '#ffffff', fontWeight: '600' }}>
                      Start Your Business Today
                    </span>
                  </button>
                </Link>

                <Link href="/auth">
                  <Button variant="outline" size="sm" className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}