import React from 'react';
import { HelpCircle, AlertCircle, ShieldAlert } from 'lucide-react';
import { DataBadge } from '../shared/DataBadge';

interface UncertaintiesCardProps {
  uncertainties: string[];
  className?: string;
}

export function UncertaintiesCard({
  uncertainties,
  className = '',
}: UncertaintiesCardProps) {
  return (
    <div
      className={`rounded-2xl border border-amber-200/90 bg-gradient-to-br from-amber-50/50 via-white to-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100/70 text-amber-800">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Data Uncertainties & Information Gaps
            </h3>
            <span className="text-[11px] text-slate-500">
              Variables requiring caution or subsequent verification
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
          Transparency Guard
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        <p className="text-xs text-slate-600 leading-relaxed">
          To ensure farmer safety and prevent toxic over-dosage, AgroMint AI avoids fabricating unverified metrics. The following information gaps were identified in your submission:
        </p>

        <ul className="space-y-2 text-xs text-slate-700">
          {uncertainties.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 rounded-lg border border-amber-200/70 bg-amber-50/40 p-2.5 text-amber-950"
            >
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-3 pt-2 text-[11px] text-slate-500">
          Tip: You can re-run this assessment at any time by attaching official soil lab sheets or entering precise acreage.
        </div>
      </div>
    </div>
  );
}
