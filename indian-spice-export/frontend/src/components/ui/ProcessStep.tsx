import React from "react";
import {
  FileText,
  Search,
  Calculator,
  Sparkles,
  Boxes,
  Ship,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { ExportProcessStep } from "../../types";
import { cn } from "../../utils/cn";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Search,
  Calculator,
  Sparkles,
  Boxes,
  Ship,
  CheckCircle2,
};

export interface ProcessStepProps {
  step: ExportProcessStep;
  isActive?: boolean;
  className?: string;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({
  step,
  isActive = false,
  className,
}) => {
  const IconComponent = ICON_MAP[step.iconName] || FileText;
  const formattedNumber = String(step.stepNumber).padStart(2, "0");

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between p-6 sm:p-7 bg-white rounded-sm border transition-all duration-300 min-w-[300px] sm:min-w-[340px] max-w-[380px] shrink-0 shadow-md hover:shadow-2xl hover:-translate-y-1",
        isActive
          ? "border-sky-400 shadow-xl bg-white"
          : "border-sky-100 hover:border-sky-300",
        className
      )}
    >
      <div>
        {/* Top bar with Step Number and Duration */}
        <div className="flex items-center justify-between pb-4 border-b border-ivory-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-800 text-gold-400 flex items-center justify-center font-sans text-sm font-bold">
              {formattedNumber}
            </div>
            <div className="text-[11px] font-eyebrow text-gold-600 uppercase tracking-widest">
              Stage {step.stepNumber}
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-ivory-300/80 rounded-[2px] text-charcoal font-medium">
            {step.duration}
          </span>
        </div>

        {/* Title */}
        <div className="mt-5 flex items-center gap-3">
          <IconComponent className="w-5 h-5 text-forest-800 shrink-0" />
          <h3 className="font-sans text-xl font-bold text-forest-900">
            {step.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-charcoal-light leading-relaxed mt-3">
          {step.description}
        </p>
      </div>

      {/* Deliverable & Action Box */}
      <div className="mt-6 pt-4 border-t border-ivory-300/80 flex flex-col gap-2 text-xs">
        <div>
          <span className="font-semibold text-forest-900">Deliverable: </span>
          <span className="text-charcoal-light">{step.deliverable}</span>
        </div>
        <div className="text-[11px] text-gold-700 bg-gold-500/10 p-2 rounded-[2px] border border-gold-500/20">
          <span className="font-semibold">Action: </span>
          {step.actionRequired}
        </div>
      </div>
    </div>
  );
};
