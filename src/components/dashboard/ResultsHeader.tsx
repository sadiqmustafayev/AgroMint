import React from 'react';
import { Download, Printer, RotateCcw, Calendar, MapPin, Sprout, Share2 } from 'lucide-react';

interface ResultsHeaderProps {
  reportId: string;
  crop: string;
  region: string;
  growthStage?: string;
  createdAt?: string;
  onReset?: () => void;
  className?: string;
}

export function ResultsHeader({
  reportId,
  crop,
  region,
  growthStage,
  createdAt,
  onReset,
  className = '',
}: ResultsHeaderProps) {
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : new Date().toLocaleDateString();

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-mint-700">
              Agronomic Intelligence Dossier
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
              {reportId}
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
              Verified Analysis
            </span>
          </div>

          <h1 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Personalized Farm Advisory Report
          </h1>

          {/* Metadata pill tags */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
              <Sprout className="w-3.5 h-3.5 text-mint-600" />
              {crop}
            </span>
            {growthStage && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">{growthStage}</span>
              </>
            )}
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {region}
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            Print Report
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              New Analysis
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
