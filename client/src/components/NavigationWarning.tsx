import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';

interface NavigationWarningProps {
  children: React.ReactNode;
}

export function NavigationWarning({ children }: NavigationWarningProps) {
  const { hasUnsavedChanges, setHasUnsavedChanges } = useUnsavedChanges();
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [pendingPath, setPendingPath] = useState<string>('');

  // Create a custom navigation function
  const navigate = (path: string) => {
    if (hasUnsavedChanges) {
      setPendingPath(path);
      setShowModal(true);
    } else {
      setLocation(path);
    }
  };

  const handleConfirm = () => {
    setHasUnsavedChanges(false);
    setShowModal(false);
    setLocation(pendingPath);
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingPath('');
  };

  // Intercept all link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href && hasUnsavedChanges) {
        // Only intercept internal links
        if (link.href.includes(window.location.origin)) {
          e.preventDefault();
          e.stopPropagation();
          const path = link.href.replace(window.location.origin, '');
          navigate(path);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [hasUnsavedChanges]);

  return (
    <>
      {children}
      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Unsaved Changes Detected
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  You have unsaved changes in the formation workflow. All progress will be lost if you continue. Are you sure you want to leave this page?
                </p>
                <div className="flex space-x-3 justify-end">
                  <button
                    onClick={handleCancel}
                    style={{
                      border: '2px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f9fafb';
                      e.target.style.borderColor = '#9ca3af';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'white';
                      e.target.style.borderColor = '#d1d5db';
                    }}
                  >
                    Stay on Page
                  </button>
                  <button
                    onClick={handleConfirm}
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      fontWeight: '600',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#b91c1c';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#dc2626';
                    }}
                  >
                    Leave Anyway
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}