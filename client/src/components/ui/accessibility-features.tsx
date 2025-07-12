import { useState } from "react";
import { ChevronDown, ChevronUp, Volume2, Type, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface SkipNavigationProps {
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function SkipNavigation({ links }: SkipNavigationProps) {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-50 bg-primary text-primary-foreground p-2 rounded-br-md">
        <nav aria-label="Skip navigation">
          <ul className="flex gap-2">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="skip-link px-3 py-1 bg-white text-primary rounded text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

interface AccessibilityToolbarProps {
  className?: string;
}

export function AccessibilityToolbar({ className }: AccessibilityToolbarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [contrast, setContrast] = useState(false);

  const adjustFontSize = (increment: number) => {
    const newSize = Math.max(75, Math.min(150, fontSize + increment));
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const toggleContrast = () => {
    setContrast(!contrast);
    document.documentElement.classList.toggle('high-contrast', !contrast);
  };

  return (
    <div className={cn("fixed top-4 right-4 z-40", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-primary text-primary-foreground p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Accessibility options"
        aria-expanded={isExpanded}
      >
        <Eye className="w-5 h-5" />
      </button>

      {isExpanded && (
        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 space-y-4">
          <h3 className="font-medium text-gray-900">Accessibility Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Size
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustFontSize(-25)}
                className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <span className="text-sm text-gray-600">{fontSize}%</span>
              <button
                onClick={() => adjustFontSize(25)}
                className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={toggleContrast}
              className={cn(
                "w-full text-left px-3 py-2 rounded border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary",
                contrast 
                  ? "bg-gray-900 text-white border-gray-900" 
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              )}
            >
              {contrast ? "Disable" : "Enable"} High Contrast
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileOptimizedFormProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileOptimizedForm({ children, className }: MobileOptimizedFormProps) {
  return (
    <div className={cn(
      "space-y-6",
      // Mobile optimizations
      "px-4 py-6 md:px-6 md:py-8",
      // Touch-friendly spacing
      "[&_button]:min-h-[44px] [&_input]:min-h-[44px] [&_select]:min-h-[44px]",
      // Improved tap targets
      "[&_label]:mb-2 [&_label]:block [&_label]:font-medium",
      className
    )}>
      {children}
    </div>
  );
}

interface ProgressiveDisclosureProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  required?: boolean;
  className?: string;
}

export function ProgressiveDisclosure({ 
  title, 
  children, 
  defaultExpanded = false, 
  required = false,
  className 
}: ProgressiveDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn("border border-gray-200 rounded-lg", className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
        aria-expanded={isExpanded}
        type="button"
      >
        <span className="font-medium text-gray-900 flex items-center gap-2">
          {title}
          {required && <span className="text-red-500" aria-label="Required">*</span>}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="pt-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface FormValidationMessageProps {
  type: "error" | "warning" | "success" | "info";
  message: string;
  fieldId?: string;
  className?: string;
}

export function FormValidationMessage({ 
  type, 
  message, 
  fieldId, 
  className 
}: FormValidationMessageProps) {
  const styles = {
    error: "text-red-600 bg-red-50 border-red-200",
    warning: "text-yellow-700 bg-yellow-50 border-yellow-200", 
    success: "text-green-700 bg-green-50 border-green-200",
    info: "text-blue-700 bg-blue-50 border-blue-200"
  };

  return (
    <div
      className={cn(
        "mt-2 p-3 border rounded-md text-sm",
        styles[type],
        className
      )}
      role={type === "error" ? "alert" : "status"}
      aria-describedby={fieldId}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {message}
    </div>
  );
}

interface KeyboardShortcutsProps {
  shortcuts: Array<{
    key: string;
    description: string;
    action: () => void;
  }>;
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      {shortcuts.map((shortcut, index) => (
        <button
          key={index}
          onClick={shortcut.action}
          style={{ position: 'absolute', left: '-9999px' }}
          tabIndex={-1}
          aria-label={`${shortcut.description} (${shortcut.key})`}
        />
      ))}
    </div>
  );
}