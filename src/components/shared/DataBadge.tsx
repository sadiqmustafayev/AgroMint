import React from 'react';
import { Database, Sparkles, CheckCircle2 } from 'lucide-react';

export type DataBadgeVariant = 'submitted' | 'ai-assessment' | 'recommendation';

interface DataBadgeProps {
  variant: DataBadgeVariant;
  className?: string;
}

export function DataBadge({ variant, className = '' }: DataBadgeProps) {
  if (variant === 'submitted') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80 ${className}`}
      >
        <Database className="w-3 h-3 text-blue-500" />
        Submitted Data
      </span>
    );
  }

  if (variant === 'ai-assessment') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-mint-50 text-mint-800 border border-mint-200 ${className}`}
      >
        <Sparkles className="w-3 h-3 text-mint-600" />
        AI Assessment
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 ${className}`}
    >
      <CheckCircle2 className="w-3 h-3 text-amber-600" />
      Actionable Recommendation
    </span>
  );
}
