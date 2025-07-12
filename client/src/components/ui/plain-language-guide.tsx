import { Info, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideItemProps {
  type: "info" | "warning" | "success" | "question";
  title: string;
  content: string;
  className?: string;
}

export function GuideItem({ type, title, content, className }: GuideItemProps) {
  const typeStyles = {
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-900",
      icon: <Info className="w-5 h-5 text-blue-600" />,
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-900",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    },
    success: {
      container: "bg-green-50 border-green-200 text-green-900",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    question: {
      container: "bg-purple-50 border-purple-200 text-purple-900",
      icon: <HelpCircle className="w-5 h-5 text-purple-600" />,
    },
  };

  const style = typeStyles[type];

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg border",
      style.container,
      className
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {style.icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-sm leading-relaxed opacity-90">{content}</p>
      </div>
    </div>
  );
}

interface PlainLanguageExplanationProps {
  legalTerm: string;
  explanation: string;
  example?: string;
  className?: string;
}

export function PlainLanguageExplanation({ 
  legalTerm, 
  explanation, 
  example, 
  className 
}: PlainLanguageExplanationProps) {
  return (
    <div className={cn(
      "p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3",
      className
    )}>
      <div>
        <dt className="font-medium text-gray-900 text-sm">
          {legalTerm}
        </dt>
        <dd className="mt-1 text-sm text-gray-700 leading-relaxed">
          {explanation}
        </dd>
      </div>
      {example && (
        <div className="pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <span className="font-medium">Example:</span> {example}
          </p>
        </div>
      )}
    </div>
  );
}

interface ComplianceChecklistProps {
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
    required: boolean;
    helpText?: string;
  }>;
  className?: string;
}

export function ComplianceChecklist({ items, className }: ComplianceChecklistProps) {
  const completedCount = items.filter(item => item.completed).length;
  const requiredCount = items.filter(item => item.required).length;
  const progressPercentage = (completedCount / items.length) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Compliance Checklist</h3>
        <span className="text-sm text-gray-600">
          {completedCount} of {items.length} completed
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 p-3 rounded border">
            <div className={cn(
              "mt-0.5 h-4 w-4 rounded border-2 flex items-center justify-center",
              item.completed 
                ? "bg-green-500 border-green-500" 
                : "border-gray-300 bg-white"
            )}>
              {item.completed && <CheckCircle className="h-3 w-3 text-white" />}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm",
                  item.completed ? "text-green-700 line-through" : "text-gray-900"
                )}>
                  {item.text}
                </span>
                {item.required && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    Required
                  </span>
                )}
              </div>
              
              {item.helpText && (
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.helpText}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {requiredCount > completedCount && (
        <div className="p-3 bg-green-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <AlertTriangle className="inline w-4 h-4 mr-1" />
            {requiredCount - completedCount} required items remain incomplete
          </p>
        </div>
      )}
    </div>
  );
}

interface ErrorPreventionProps {
  commonMistakes: string[];
  preventionTips: string[];
  className?: string;
}

export function ErrorPrevention({ commonMistakes, preventionTips, className }: ErrorPreventionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h4 className="font-medium text-red-900 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Common Mistakes to Avoid
        </h4>
        <ul className="space-y-1 text-sm text-red-800">
          {commonMistakes.map((mistake, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Best Practices
        </h4>
        <ul className="space-y-1 text-sm text-green-800">
          {preventionTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}