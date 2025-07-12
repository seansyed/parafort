import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Building, 
  FileText, 
  Shield, 
  UserCheck, 
  Calendar, 
  Scale, 
  AlertCircle, 
  Mail, 
  Settings,
  ShoppingCart,
  CreditCard,
  User,
  LogOut,
  HelpCircle,
  Bell,
  Briefcase,
  Calculator,
  Book,
  Archive,
  PlusCircle,
  Truck,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
const logoPath = "/parafort-logo-white.png";

const clientNavigationItems = [
  { 
    section: 'Dashboard',
    items: [
      { id: 'overview', label: 'Dashboard Overview', icon: Home, path: '/client-dashboard' },
      { id: 'multi-business', label: 'My Businesses', icon: Building, path: '/multi-business' },
      { id: 'order-tracking', label: 'Order Tracking', icon: Truck, path: '/order-tracking' },
      { id: 'filings', label: 'My Filings', icon: FileText, path: '/filings' },
      { id: 'documents', label: 'My Documents', icon: Archive, path: '/client-documents' },
    ]
  },
  {
    section: 'Business Services',
    items: [
      { id: 'formation', label: 'Business Formation', icon: PlusCircle, path: '/formation' },
      { id: 'marketplace', label: 'Services Marketplace', icon: ShoppingCart, path: '/services-marketplace' },
      { id: 'service-orders', label: 'Service Orders', icon: Briefcase, path: '/service-orders' },
      { id: 'registered-agent', label: 'Registered Agent', icon: UserCheck, path: '/registered-agent' },
      { id: 'mailbox', label: 'Digital Mailbox', icon: Mail, path: '/mailbox' },
      { id: 'ein', label: 'EIN Management', icon: FileText, path: '/ein-management' },
    ]
  },
  {
    section: 'Accounting & Tax',
    items: [
      { id: 'bookkeeping', label: 'Bookkeeping Services', icon: Book, path: '/bookkeeping' },
      { id: 'payroll', label: 'Payroll Services', icon: Calculator, path: '/payroll' },
      { id: 'tax-filing', label: 'Tax Filing Services', icon: FileText, path: '/client-tax-filing' },
    ]
  },
  {
    section: 'Compliance & Legal',
    items: [
      { id: 'compliance-calendar', label: 'Compliance Calendar', icon: Calendar, path: '/compliance-calendar' },
      { id: 'business-health-radar', label: 'Business Health Radar', icon: BarChart3, path: '/business-health-radar' },
      { id: 'boir', label: 'BOIR Filing', icon: Shield, path: '/boir' },
      { id: 'annual-reports', label: 'Annual Reports', icon: Calendar, path: '/client-annual-reports' },
      { id: 'scorp-election', label: 'S-Corp Election', icon: Scale, path: '/client-scorp-election' },
      { id: 'licenses', label: 'Business Licenses', icon: Scale, path: '/client-licenses' },
    ]
  },
  {
    section: 'Business Management',
    items: [
      { id: 'name-change', label: 'Name Change', icon: FileText, path: '/name-change' },
      { id: 'dissolution', label: 'Business Dissolution', icon: AlertCircle, path: '/dissolution' },
      { id: 'business-tools', label: 'Business Tools', icon: Calculator, path: '/business-tools' },
    ]
  },
  {
    section: 'Account',
    items: [
      { id: 'subscription', label: 'Subscription Plans', icon: CreditCard, path: '/subscription-plans' },
      { id: 'settings', label: 'Account Settings', icon: Settings, path: '/settings' },
    ]
  }
];

export default function ClientNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  // Fetch unread notification count
  const { data: unreadData } = useQuery({
    queryKey: ["/api/notifications/unread-count"],
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!user // Only fetch if user is logged in
  });
  
  const unreadCount = unreadData?.count || 0;

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <>
      {/* Logo at the very top */}
      <div className="fixed left-0 top-0 w-80 h-24 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 shadow-sm z-50 flex items-center justify-center">
        <Link href="/client-dashboard">
          <img 
            src={logoPath} 
            alt="ParaFort - Business Services & Compliance" 
            className="h-20 w-auto filter drop-shadow-sm"
          />
        </Link>
      </div>
      {/* Sidebar navigation */}
      <div className="fixed left-0 top-24 w-80 h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-50 via-white to-gray-50 shadow-xl z-40 overflow-y-auto border-r border-gray-200">
        <div className="p-6">

        {/* User Info */}
        {user && (
          <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
            <div className="flex items-center gap-3">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-green-200 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName || 'Client'}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {user.email}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="space-y-6">
          {clientNavigationItems.map((section, sectionIndex) => (
            <div key={section.section} className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-gradient-to-r from-green-400 to-emerald-400"></div>
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  {section.section}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = location === item.path || location.startsWith(item.path + '/');
                  const IconComponent = item.icon;
                  const isBusinessFormation = item.id === 'formation';
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${
                        isActive
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-200'
                          : 'text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 hover:shadow-md'
                      }`}
                    >
                      <IconComponent className={`h-5 w-5 mr-3 transition-colors duration-300 ${
                        isActive 
                          ? 'text-white' 
                          : isBusinessFormation 
                          ? 'text-green-500' 
                          : 'text-gray-500 group-hover:text-green-600'
                      }`} />
                      <span style={{ flex: '1', color: isActive ? '#ffffff' : '#374151', fontWeight: '500' }}>{item.label}</span>
                      {isActive && (
                        <div className="w-2 h-2 bg-white rounded-full opacity-80"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Support & Logout */}
        <div className="mt-8 pt-6 border-t border-gray-200" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <button
            onClick={() => window.open('https://help.parafort.com/en', '_blank')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #eff6ff, #e0f2fe)';
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              width: '20px', 
              height: '20px', 
              marginRight: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '18px', 
              fontWeight: '900',
              color: '#000000'
            }}>
              ?
            </div>
            <span style={{ flex: '1', color: '#000000', fontWeight: '500' }}>Help & Support</span>
          </button>
          


          <Link href="/notifications">
            <button
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: location === '/notifications' ? '#10b981' : 'transparent',
                background: location === '/notifications' ? 'linear-gradient(to right, #10b981, #059669)' : 'transparent',
                color: location === '/notifications' ? '#ffffff' : '#374151',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
                boxShadow: location === '/notifications' ? '0 10px 15px -3px rgba(16, 185, 129, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (location !== '/notifications') {
                  e.currentTarget.style.background = 'linear-gradient(to right, #fef3c7, #fde68a)';
                  e.currentTarget.style.color = '#d97706';
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (location !== '/notifications') {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ 
                width: '20px', 
                height: '20px', 
                marginRight: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '18px', 
                fontWeight: '900',
                color: location === '/notifications' ? '#ffffff' : '#000000'
              }}>
                ●
              </div>
              <span style={{ flex: '1', color: location === '/notifications' ? '#ffffff' : '#000000', fontWeight: '500' }}>Notifications</span>
              {location !== '/notifications' && unreadCount > 0 && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '12px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
              {location === '/notifications' && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                  opacity: 0.8
                }}></div>
              )}
            </button>
          </Link>
          
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #fef2f2, #fee2e2)';
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              width: '20px', 
              height: '20px', 
              marginRight: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '18px', 
              fontWeight: '900',
              color: '#b91c1c'
            }}>
              →
            </div>
            <span style={{ flex: '1', color: '#b91c1c', fontWeight: '500' }}>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}