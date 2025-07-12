import { Check, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "active" | "pending" | "error";
  isRequired?: boolean;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}

export function ProgressTracker({ 
  steps, 
  className,
  orientation = "vertical" 
}: ProgressTrackerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div className={cn(
      "space-y-4",
      isHorizontal && "flex space-y-0 space-x-8",
      className
    )}>
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            "relative flex items-start",
            isHorizontal && "flex-col items-center text-center"
          )}
        >
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className={cn(
              "absolute w-px bg-border",
              isHorizontal 
                ? "top-8 left-1/2 h-px w-full -translate-x-1/2" 
                : "left-4 top-8 h-full"
            )} />
          )}

          {/* Step indicator */}
          <div className={cn(
            "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background",
            step.status === "completed" && "border-green-500 bg-green-500 text-white",
            step.status === "active" && "border-primary bg-primary text-primary-foreground",
            step.status === "pending" && "border-muted-foreground bg-muted text-muted-foreground",
            step.status === "error" && "border-red-500 bg-red-50 text-red-600"
          )}>
            {step.status === "completed" && <Check className="h-4 w-4" />}
            {step.status === "active" && <Clock className="h-4 w-4" />}
            {step.status === "error" && <AlertCircle className="h-4 w-4" />}
            {step.status === "pending" && (
              <span className="text-xs font-medium">{index + 1}</span>
            )}
          </div>

          {/* Step content */}
          <div className={cn(
            "ml-4 min-w-0 flex-1",
            isHorizontal && "ml-0 mt-2"
          )}>
            <div className={cn(
              "flex items-center gap-2",
              isHorizontal && "justify-center"
            )}>
              <h3 className={cn(
                "text-sm font-medium leading-6",
                step.status === "completed" && "text-green-700",
                step.status === "active" && "text-foreground",
                step.status === "pending" && "text-muted-foreground",
                step.status === "error" && "text-red-600"
              )}>
                {step.title}
              </h3>
              {step.isRequired && (
                <span className="text-xs text-red-500" aria-label="Required">*</span>
              )}
            </div>
            {step.description && (
              <p className={cn(
                "mt-1 text-xs leading-5",
                step.status === "completed" && "text-green-600",
                step.status === "active" && "text-muted-foreground",
                step.status === "pending" && "text-muted-foreground",
                step.status === "error" && "text-red-500"
              )}>
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ComplianceTimelineProps {
  deadline: Date;
  milestones: Array<{
    date: Date;
    title: string;
    completed: boolean;
    critical?: boolean;
  }>;
  className?: string;
}

export function ComplianceTimeline({ 
  deadline, 
  milestones, 
  className 
}: ComplianceTimelineProps) {
  const now = new Date();
  const daysToDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between p-4 bg-green-50 border border-orange-200 rounded-lg">
        <div>
          <h3 className="font-medium text-orange-900">Compliance Deadline</h3>
          <p className="text-sm text-orange-700">
            {deadline.toLocaleDateString()} ({daysToDeadline} days remaining)
          </p>
        </div>
        {daysToDeadline <= 7 && (
          <AlertCircle className="h-5 w-5 text-orange-600" />
        )}
      </div>

      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
            <div className={cn(
              "h-3 w-3 rounded-full",
              milestone.completed ? "bg-green-500" : "bg-gray-300"
            )} />
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium",
                milestone.completed ? "text-green-700" : "text-gray-700"
              )}>
                {milestone.title}
              </p>
              <p className="text-xs text-gray-500">
                Due: {milestone.date.toLocaleDateString()}
              </p>
            </div>
            {milestone.critical && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                Critical
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}