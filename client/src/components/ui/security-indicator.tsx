import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityIndicatorProps {
  level: "high" | "medium" | "low";
  encrypted?: boolean;
  visible?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function SecurityIndicator({ 
  level, 
  encrypted = false, 
  visible = true, 
  className,
  children 
}: SecurityIndicatorProps) {
  const levelStyles = {
    high: "bg-green-50 text-green-800 border-green-200",
    medium: "bg-yellow-50 text-yellow-800 border-yellow-200", 
    low: "bg-red-50 text-red-800 border-red-200"
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
      levelStyles[level],
      className
    )}>
      <Shield className="w-3 h-3" />
      {encrypted && <Lock className="w-3 h-3" />}
      {visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {children || (
        <>
          {level === "high" && "Secure & Encrypted"}
          {level === "medium" && "Protected Data"}
          {level === "low" && "Basic Security"}
        </>
      )}
    </div>
  );
}

interface DataProtectionNoticeProps {
  className?: string;
}

export function DataProtectionNotice({ className }: DataProtectionNoticeProps) {
  return (
    <div className={cn(
      "flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg",
      className
    )}>
      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
      <div className="text-sm space-y-1">
        <p className="font-medium text-blue-900">Data Protection & Privacy</p>
        <p className="text-blue-700 leading-relaxed">
          Your information is encrypted and securely stored. We comply with all privacy regulations 
          and never share your data without permission. You maintain full control over your information.
        </p>
      </div>
    </div>
  );
}