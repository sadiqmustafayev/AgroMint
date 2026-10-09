import React from 'react';
import { Layers, TestTube2, AlertCircle } from 'lucide-react';
import { MetricEvaluation } from '../../types/advisory';
import { DataBadge } from '../shared/DataBadge';
import { MetricGauge } from '../shared/MetricGauge';

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
              Soil Fertility & Nutrient Profile
            </h3>
            <span className="text-[11px] text-slate-500">
              Texture: {soilFertility.soilType} • Index: {soilFertility.fertilityIndex}
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
