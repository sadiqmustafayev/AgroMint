import React from 'react';

interface MetricGaugeProps {
  label: string;
  value: number | string;
  unit: string;
  status: 'low' | 'optimal' | 'high' | 'unknown';
  benchmark: string;
  interpretation?: string;
  className?: string;
}

export function MetricGauge({
  label,
  value,
  unit,
  status,
  benchmark,
  interpretation,
  className = '',
}: MetricGaugeProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'optimal':
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
            Optimal
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 border border-amber-200">
            Deficient / Low
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 border border-rose-200">
            Excess / High
          </span>
        );
      case 'unknown':
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 border border-slate-200">
            Estimated / Unknown
          </span>
        );
    }
  };

  const getBarColor = () => {
    switch (status) {
      case 'optimal':
        return 'bg-emerald-500';
      case 'low':
        return 'bg-amber-500';
      case 'high':
        return 'bg-rose-500';
      default:
        return 'bg-slate-300';
    }
  };

  const getProgressPercentage = () => {
    if (status === 'unknown') return 50;
    if (status === 'low') return 30;
    if (status === 'optimal') return 70;
    return 95;
  };

  return (
    <div
      className={`rounded-lg border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all hover:border-slate-300 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        {getStatusBadge()}
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-lg font-bold tracking-tight text-slate-900">
          {value}
        </span>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>

      {/* Visual meter bar */}
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>Target:</span>
        <span className="font-medium text-slate-700">{benchmark}</span>
      </div>

      {interpretation && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600 border-t border-slate-100 pt-1.5">
          {interpretation}
        </p>
      )}
    </div>
  );
}
