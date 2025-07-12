import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  Users, 
  Settings,
  CreditCard,
  User,
  LogOut,
  Shield,
  BarChart3,
  FileText,
  Database,
  Mail,
  Calculator,
  DollarSign,
  Package,
  Cog,
  ShoppingCart,
  AlertCircle,
  TrendingUp,
  Megaphone,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
const logoPath = "/parafort-logo-white.png";

interface OrderCounts {
  formationOrders: number;
  serviceOrders: number;
}

const adminNavigationItems = [
  { 
    section: 'Administration',
    items: [
      { id: 'admin-overview', label: 'Admin Dashboard', icon: Home, path: '/admin/dashboard' },
      { id: 'admin-clients', label: 'Client Management', icon: Users, path: '/admin/clients' },
      { id: 'admin-business-entities', label: 'Business Entities', icon: Building, path: '/admin/business-entities' },
      { id: 'admin-compliance', label: 'Compliance Dashboard', icon: AlertCircle, path: '/compliance' },
      { id: 'compliance-visualization', label: 'Compliance Visualization', icon: TrendingUp, path: '/compliance-visualization' },
      { id: 'business-health-radar', label: 'Business Health Radar', icon: BarChart3, path: '/business-health-radar' },
      { id: 'admin-documents', label: 'Document Management', icon: FileText, path: '/documents' },
      { id: 'admin-orders', label: 'Formation Orders', icon: Package, path: '/admin/orders' },
      { id: 'admin-order-tracking', label: 'Service Orders', icon: ShoppingCart, path: '/admin/order-tracking' },
      { id: 'admin-announcements', label: 'Announcement Management', icon: Megaphone, path: '/admin/announcements' },
      { id: 'admin-footer', label: 'Footer Management', icon: Settings, path: '/admin/footer-management' },
      { id: 'admin-analytics', label: 'Analytics & Reports', icon: BarChart3, path: '/admin/analytics' },
    ]
  },
  {
    section: 'Plan Management',
    items: [
      { id: 'admin-plans', label: 'Manage Plans', icon: Package, path: '/admin/plan-management' },
      { id: 'admin-subscriptions', label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptions' },
      { id: 'admin-pricing', label: 'Pricing Control', icon: DollarSign, path: '/admin/pricing' },
    ]
  },
  {
    section: 'System Management',
    items: [
      { id: 'admin-services', label: 'Service Configuration', icon: Cog, path: '/admin/services' },
      { id: 'admin-security', label: 'Security & Audit', icon: Shield, path: '/admin/security' },
      { id: 'admin-database', label: 'Database Management', icon: Database, path: '/admin/database' },
      { id: 'admin-settings', label: 'System Settings', icon: Settings, path: '/admin/settings' },
    ]
  }
];

export default function AdminNavigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Fetch order counts for admin menu counters
  const { data: orderCounts } = useQuery<OrderCounts>({
    queryKey: ["/api/admin/order-counts"],
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  return (
    <div className="fixed left-0 top-0 w-80 h-full bg-slate-900 shadow-lg z-40 border-r border-slate-700">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center space-x-3 mb-8">
          <img src={logoPath} alt="ParaFort" className="h-20 w-auto" />
          <div>
            <h2 className="text-lg font-bold text-white">ParaFort</h2>
            <p className="text-sm text-blue-400">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="px-4 pb-4 space-y-6">
        {adminNavigationItems.map((section) => (
          <div key={section.section}>
            <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location === item.path;
                const IconComponent = item.icon;
                
                // Get counter for specific menu items
                let counter = null;
                if (item.id === 'admin-orders' && orderCounts) {
                  counter = orderCounts.formationOrders;
                } else if (item.id === 'admin-order-tracking' && orderCounts) {
                  counter = orderCounts.serviceOrders;
                }
                
                return (
                  <Link key={item.id} href={item.path}>
                    <div className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}>
                      <div className="flex items-center">
                        <IconComponent className="h-5 w-5 mr-3" />
                        {item.label}
                      </div>
                      {counter !== null && (
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                          isActive 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-green-600 text-white'
                        }`}>
                          {counter}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName || 'Admin'}
            </p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-slate-300 hover:text-red-400 hover:bg-slate-800"
          onClick={() => window.location.href = '/api/logout'}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}