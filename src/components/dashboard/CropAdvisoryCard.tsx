import React from 'react';
import { Sprout, Thermometer, ShieldAlert, SunMedium, Compass } from 'lucide-react';
import { DataBadge } from '../shared/DataBadge';

interface CropAdvisoryGuidance {
  optimalTemperature: string;
  stageManagement: string;
  canopyCare: string;
  keyRisks: string[];
}

interface CropAdvisoryCardProps {
  crop: string;
  stage?: string;
  guidance: CropAdvisoryGuidance;
  className?: string;
}

export function CropAdvisoryCard({
  crop,
  stage = 'Active Phase',
  guidance,
  className = '',
}: CropAdvisoryCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
            <Sprout className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Crop-Specific Cultivation Guidance: {crop}
            </h3>
            <span className="text-[11px] text-slate-500">
              Calibrated management for {stage}
            </span>
          </div>
        </div>

        <DataBadge variant="recommendation" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        {/* Thermal bounds */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Thermometer className="w-3.5 h-3.5 text-rose-500" />
            <span>Optimal Temperature Spectrum</span>
          </div>
          <p className="mt-1 text-slate-600 leading-relaxed">
            {guidance.optimalTemperature}
          </p>
        </div>

        {/* Canopy care */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <SunMedium className="w-3.5 h-3.5 text-amber-500" />
            <span>Canopy & Aeration Care</span>
          </div>
          <p className="mt-1 text-slate-600 leading-relaxed">
            {guidance.canopyCare}
          </p>
        </div>

        {/* Stage Management */}
        <div className="sm:col-span-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Compass className="w-3.5 h-3.5 text-mint-600" />
            <span>Phenology Management Strategy</span>
          </div>
          <p className="mt-1 text-slate-600 leading-relaxed">
            {guidance.stageManagement}
          </p>
        </div>
      </div>

      {/* Critical Phenological Risks */}
      {guidance.keyRisks && guidance.keyRisks.length > 0 && (
        <div className="mt-3.5 rounded-lg border border-amber-200/70 bg-amber-50/40 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Critical Risks for this Growth Phase:</span>
          </div>
          <ul className="mt-1.5 space-y-1 text-xs text-amber-800 pl-4 list-disc">
            {guidance.keyRisks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
