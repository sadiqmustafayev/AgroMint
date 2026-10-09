'use client';

import React from 'react';
import { Layers, TestTube2 } from 'lucide-react';
import { MetricEvaluation } from '../../types/advisory';
import { DataBadge } from '../shared/DataBadge';
import { MetricGauge } from '../shared/MetricGauge';
import { useLanguage } from '../../i18n/LanguageContext';

interface SoilFertilityData {
  soilType: string;
  fertilityIndex: string;
  notes: string;
  metrics: MetricEvaluation[];
}

interface SoilNutrientCardProps {
  soilFertility: SoilFertilityData;
  className?: string;
}

export function SoilNutrientCard({
  soilFertility,
  className = '',
}: SoilNutrientCardProps) {
  const { t, language } = useLanguage();

  const getFertilityIndexLabel = (idx: string) => {
    if (language === 'az') {
      if (idx === 'Balanced') return 'Balanslaşdırılmış';
      if (idx === 'Low') return 'Aşağı';
      if (idx === 'Moderate') return 'Orta';
      if (idx === 'Alkaline Stress') return 'Qələvi Stres';
      return 'Naməlum';
    }
    return idx;
  };

  const soilTypeLabel =
    t(`options.soils.${soilFertility.soilType}`) || soilFertility.soilType;

  const subText = (t('dashboard.soilProfileSub') || 'Texture: {soilType} • Index: {index}')
    .replace('{soilType}', soilTypeLabel)
    .replace('{index}', getFertilityIndexLabel(soilFertility.fertilityIndex));

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('dashboard.soilProfileTitle')}
            </h3>
            <span className="text-[11px] text-slate-500">
              {subText}
            </span>
          </div>
        </div>

        <DataBadge variant="ai-assessment" />
      </div>

      {/* Summary Note */}
      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 flex items-start gap-2">
        <TestTube2 className="w-4 h-4 text-mint-600 mt-0.5 shrink-0" />
        <span>{soilFertility.notes}</span>
      </div>

      {/* Metric Gauges Grid */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {soilFertility.metrics.map((metric, idx) => (
          <MetricGauge
            key={idx}
            label={metric.parameter}
            value={metric.value}
            unit={metric.unit}
            status={metric.status}
            benchmark={metric.benchmark}
            interpretation={metric.interpretation}
          />
        ))}
      </div>
    </div>
  );
}
