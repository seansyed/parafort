import { Link, useLocation } from "wouter";
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
  Cog,
  Users
} from "lucide-react";

const navigationItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: Home, path: '/dashboard' },
  { id: 'formation', label: 'Business Formation', icon: Building, path: '/formation' },
  { id: 'marketplace', label: 'Services Marketplace', icon: ShoppingCart, path: '/services-marketplace' },
  { id: 'ein', label: 'EIN Application', icon: FileText, path: '/ein' },
  { id: 'boir', label: 'BOIR Filing', icon: Shield, path: '/boir' },
  { id: 'registered-agent', label: 'Registered Agent', icon: UserCheck, path: '/registered-agent' },
  { id: 'annual-reports', label: 'Annual Reports', icon: Calendar, path: '/annual-reports' },
  { id: 'scorp-election', label: 'S-Corp Election', icon: Scale, path: '/scorp-election' },
  { id: 'name-change', label: 'Name Change', icon: FileText, path: '/name-change' },
  { id: 'dissolution', label: 'Business Dissolution', icon: AlertCircle, path: '/dissolution' },
  { id: 'legal-docs', label: 'Legal Documents', icon: FileText, path: '/legal-documents' },
  { id: 'licenses', label: 'Business Licenses', icon: Scale, path: '/licenses' },
  { id: 'mailbox', label: 'Digital Mailbox', icon: Mail, path: '/mailbox' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const adminNavigationItems = [
  { id: 'admin-clients', label: 'Client Management', icon: Users, path: '/admin/clients' },
  { id: 'admin-subscriptions', label: 'Manage Subscriptions', icon: Settings, path: '/admin/subscriptions' },
  { id: 'admin-services', label: 'Manage Services', icon: Cog, path: '/admin/services' },
];

export default function LeftNavigation() {
  const [location] = useLocation();

  return (
    <div className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg z-40">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">ParaFort</h2>
            <p className="text-sm text-gray-500">Business Services</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="px-3 pb-6">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Admin Section */}
        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="px-3 mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administration
            </p>
          </div>
          <div className="space-y-1">
            {adminNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              
              return (
                <Link
                  key={item.id}
                  href={item.path}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}