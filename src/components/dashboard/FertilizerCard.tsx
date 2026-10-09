import React from 'react';
import { Sparkles, AlertTriangle, ShieldCheck, Check } from 'lucide-react';
import { AgroSphereOutboundLink } from '../../types/advisory';
import { DataBadge } from '../shared/DataBadge';
import { AgroSphereLink } from '../shared/AgroSphereLink';

interface FertilizerPrescription {
  nutrient: string;
  fertilizerType: string;
  timing: string;
  estimatedRate: string;
  isGuardedEstimate: boolean;
}

interface FertilizerAdvisoryData {
  safeDosageNotice: string;
  prescriptions: FertilizerPrescription[];
  agroSphereLink?: AgroSphereOutboundLink;
}

interface FertilizerCardProps {
  fertilizerAdvisory: FertilizerAdvisoryData;
  className?: string;
}

export function FertilizerCard({
  fertilizerAdvisory,
  className = '',
}: FertilizerCardProps) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Fertilizer & Soil Amendment Plan
            </h3>
            <span className="text-[11px] text-slate-500">
              Targeted mineral nutrition and split dosage recommendations
            </span>
          </div>
        </div>

        <DataBadge variant="recommendation" />
      </div>

      {/* Safe Dosage Notice banner */}
      <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold">Agronomic Safety Notice: </span>
          <span className="leading-relaxed">{fertilizerAdvisory.safeDosageNotice}</span>
        </div>
      </div>

      {/* Prescriptions Table / Cards */}
      <div className="mt-4 space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Prescribed Applications:
        </h4>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/80 bg-white">
          {fertilizerAdvisory.prescriptions.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs"
            >
              <div>
                <span className="font-semibold text-slate-900">{p.fertilizerType}</span>
                <span className="ml-2 text-slate-500">({p.nutrient})</span>
                <p className="mt-0.5 text-[11px] text-slate-500">{p.timing}</p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                    p.isGuardedEstimate
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {p.estimatedRate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contextual AgroSphere Outbound Link */}
      {fertilizerAdvisory.agroSphereLink && (
        <div className="mt-5">
          <AgroSphereLink
            title={fertilizerAdvisory.agroSphereLink.title}
            description={fertilizerAdvisory.agroSphereLink.description}
            destinationUrl={fertilizerAdvisory.agroSphereLink.destinationUrl}
            serviceType="fertilizer"
            callToActionText={fertilizerAdvisory.agroSphereLink.callToActionText}
          />
        </div>
      )}
    </div>
  );
}
