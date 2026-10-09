'use client';

import React from 'react';
import { Activity, CheckCircle } from 'lucide-react';
import { DataBadge } from '../shared/DataBadge';
import { useLanguage } from '../../i18n/LanguageContext';

interface MainFindingsCardProps {
  healthScore: number;
  summaryDiagnosis: string;
  findings: string[];
  className?: string;
}

export function MainFindingsCard({
  healthScore,
  summaryDiagnosis,
  findings,
  className = '',
}: MainFindingsCardProps) {
  const { t } = useLanguage();

  const getScoreColor = () => {
    if (healthScore >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (healthScore >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('dashboard.findingsTitle')}</h3>
            <span className="text-[11px] text-slate-500">
              {t('dashboard.findingsSub')}
            </span>
          </div>
        </div>

        <DataBadge variant="ai-assessment" />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Health Score Pill */}
        <div
          className={`flex shrink-0 flex-col items-center justify-center rounded-xl border p-4 text-center sm:w-36 ${getScoreColor()}`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {t('dashboard.cropHealthIndex')}
          </span>
          <span className="mt-1 text-3xl font-extrabold tracking-tight">
            {healthScore}/100
          </span>
          <span className="mt-1 text-[11px] font-medium">
            {healthScore >= 80 ? t('dashboard.favorableCondition') : t('dashboard.attentionRequired')}
          </span>
        </div>

        {/* Diagnostic Narrative & Bullets */}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="rounded-lg bg-mint-50/40 border border-mint-100 p-3 text-xs leading-relaxed text-slate-800">
            <span className="font-semibold text-mint-950">{t('dashboard.diagnosticSynthesis')} </span>
            {summaryDiagnosis}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-800">{t('dashboard.primaryObservations')}</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {findings.map((finding, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-mint-600 mt-0.5 shrink-0" />
                  <span>{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
