'use client';

import React from 'react';
import { Droplets, Clock, Gauge, Lightbulb } from 'lucide-react';
import { DataBadge } from '../shared/DataBadge';
import { useLanguage } from '../../i18n/LanguageContext';

interface IrrigationAdvisoryData {
  currentMethod: string;
  recommendedFrequency: string;
  waterRequirementMmPerWeek: number;
  managementTips: string[];
}

interface IrrigationCardProps {
  irrigation: IrrigationAdvisoryData;
  className?: string;
}

export function IrrigationCard({ irrigation, className = '' }: IrrigationCardProps) {
  const { t } = useLanguage();

  const methodSubText = (t('dashboard.irrigationMethodSub') || 'Method: {method}').replace(
    '{method}',
    irrigation.currentMethod
  );
  const evaporationSubText = (t('dashboard.evaporationSub') || 'Equivalent to ~{m3} m³ per hectare.').replace(
    '{m3}',
    String(irrigation.waterRequirementMmPerWeek * 10)
  );

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
            <Droplets className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('dashboard.irrigationTitle')}
            </h3>
            <span className="text-[11px] text-slate-500">
              {methodSubText}
            </span>
          </div>
        </div>

        <DataBadge variant="recommendation" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
        {/* Recommended Interval */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('dashboard.waterIntervalTitle')}</span>
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">
            {irrigation.recommendedFrequency}
          </p>
          <span className="text-[10px] text-slate-500">
            {t('dashboard.waterIntervalSub')}
          </span>
        </div>

        {/* Volume requirement */}
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('dashboard.evaporationTitle')}</span>
          </div>
          <p className="mt-1 text-base font-bold text-slate-900">
            ~{irrigation.waterRequirementMmPerWeek} mm / week
          </p>
          <span className="text-[10px] text-slate-500">
            {evaporationSubText}
          </span>
        </div>
      </div>

      {/* Practical Management Tips */}
      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          {t('dashboard.waterTipsTitle')}
        </h4>
        <ul className="space-y-1.5 text-xs text-slate-600">
          {irrigation.managementTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
