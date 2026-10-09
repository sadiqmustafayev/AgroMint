'use client';

import React from 'react';
import { ShieldCheck, Bug, Flower2 } from 'lucide-react';
import { AgroSphereOutboundLink } from '../../types/advisory';
import { DataBadge } from '../shared/DataBadge';
import { AgroSphereLink } from '../shared/AgroSphereLink';
import { useLanguage } from '../../i18n/LanguageContext';

interface PlantProtectionData {
  diagnosedStressors: string[];
  preventativeControls: string[];
  organicInterventions: string[];
  agroSphereLink?: AgroSphereOutboundLink;
}

interface PlantProtectionCardProps {
  plantProtection: PlantProtectionData;
  className?: string;
}

export function PlantProtectionCard({
  plantProtection,
  className = '',
}: PlantProtectionCardProps) {
  const { t } = useLanguage();

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('dashboard.protectionTitle')}
            </h3>
            <span className="text-[11px] text-slate-500">
              {t('dashboard.protectionSub')}
            </span>
          </div>
        </div>

        <DataBadge variant="recommendation" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
        {/* Identified Stressors */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Bug className="w-3.5 h-3.5 text-rose-500" />
            <span>{t('dashboard.diagnosedPestsTitle')}</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 pl-4 list-disc">
            {plantProtection.diagnosedStressors.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>

        {/* Preventative Cultural Controls */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Flower2 className="w-3.5 h-3.5 text-mint-600" />
            <span>{t('dashboard.culturalMeasuresTitle')}</span>
          </div>
          <ul className="space-y-1.5 text-slate-600 pl-4 list-disc">
            {plantProtection.preventativeControls.map((c, idx) => (
              <li key={idx}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Organic Biological Interventions */}
      {plantProtection.organicInterventions && plantProtection.organicInterventions.length > 0 && (
        <div className="mt-4 rounded-xl border border-emerald-200/70 bg-emerald-50/40 p-3 text-xs">
          <span className="font-semibold text-emerald-950">
            {t('dashboard.biologicalTreatmentsTitle')}
          </span>
          <ul className="mt-1.5 space-y-1 text-emerald-800 pl-4 list-disc">
            {plantProtection.organicInterventions.map((o, idx) => (
              <li key={idx}>{o}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Contextual AgroSphere Outbound Link */}
      {plantProtection.agroSphereLink && (
        <div className="mt-5">
          <AgroSphereLink
            title={plantProtection.agroSphereLink.title}
            description={plantProtection.agroSphereLink.description}
            destinationUrl={plantProtection.agroSphereLink.destinationUrl}
            serviceType="protection"
            callToActionText={plantProtection.agroSphereLink.callToActionText}
          />
        </div>
      )}
    </div>
  );
}
