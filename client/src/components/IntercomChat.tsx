import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

declare global {
  interface Window {
    Intercom: any;
    intercomSettings: any;
  }
}

export default function IntercomChat() {
  const { user } = useAuth();

  useEffect(() => {
    // Initial Intercom boot attempt
    const bootIntercom = () => {
      if (window.Intercom && typeof window.Intercom === 'function') {
        console.log('Booting Intercom widget');
        
        const settings = {
          app_id: 'k4esf5p6',
          ...(user && {
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
            email: user.email || undefined,
            user_id: user.id.toString(),
            created_at: user.createdAt ? Math.floor(new Date(user.createdAt).getTime() / 1000) : Math.floor(Date.now() / 1000)
          })
        };

        window.Intercom('boot', settings);
        return true;
      }
      return false;
    };

    // Try to boot immediately
    if (!bootIntercom()) {
      // Try again after 1 second if not ready
      const timeout = setTimeout(() => {
        bootIntercom();
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    // Update user info when user changes
    if (window.Intercom && typeof window.Intercom === 'function' && user) {
      console.log('Updating Intercom with user data:', user);
      window.Intercom('update', {
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
        email: user.email || undefined,
        user_id: user.id.toString(),
        created_at: user.createdAt ? Math.floor(new Date(user.createdAt).getTime() / 1000) : Math.floor(Date.now() / 1000)
      });
    }
  }, [user]);

  return null;
}

// Debug component to help troubleshoot
export const IntercomDebugger = () => {
  useEffect(() => {
    const checkIntercom = () => {
      console.log('=== INTERCOM DEBUG ===');
      console.log('window.Intercom available:', !!window.Intercom);
      console.log('window.intercomSettings:', window.intercomSettings);
      console.log('Intercom messenger visible:', document.querySelector('#intercom-frame'));
      console.log('======================');
    };

    // Check immediately and after delay
    checkIntercom();
    const timer = setTimeout(checkIntercom, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'red', 
      color: 'white', 
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999
    }}>
      Intercom Debug Active
    </div>
  );
};