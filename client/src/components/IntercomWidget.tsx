import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Intercom Widget Component
// This component handles the Intercom chat widget initialization and user context updates
export default function IntercomWidget() {
  const { user } = useAuth();

  useEffect(() => {
    // Check if Intercom is already loaded
    if (window.Intercom) {
      console.log('Intercom already loaded, booting...');
      bootIntercomWidget();
      return;
    }

    // Load Intercom script dynamically
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://widget.intercom.io/widget/k4esf5p6';
    
    script.onload = () => {
      console.log('Intercom script loaded successfully');
      bootIntercomWidget();
    };

    script.onerror = () => {
      console.error('Failed to load Intercom script');
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // Update user context when user changes
    if (window.Intercom && user) {
      const userData = {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email,
        user_id: user.id ? String(user.id) : '',
        created_at: user.createdAt ? Math.floor(new Date(user.createdAt).getTime() / 1000) : Math.floor(Date.now() / 1000)
      };
      
      console.log('Updating Intercom with user data:', userData);
      window.Intercom('update', userData);
    }
  }, [user]);

  const bootIntercomWidget = () => {
    if (!window.Intercom) return;

    const settings = {
      app_id: 'k4esf5p6',
      ...(user && {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email,
        user_id: user.id.toString(),
        created_at: user.createdAt ? Math.floor(new Date(user.createdAt).getTime() / 1000) : Math.floor(Date.now() / 1000)
      })
    };

    console.log('Booting Intercom with settings:', settings);
    window.Intercom('boot', settings);
  };

  return null;
}

// Global type declaration
declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}