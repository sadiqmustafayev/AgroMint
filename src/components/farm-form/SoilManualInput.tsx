import React from 'react';
import { SoilMetrics } from '../../types/farm';

interface SoilManualInputProps {
  metrics: SoilMetrics;
  onChange: (field: keyof SoilMetrics, val: number | undefined) => void;
}

export function SoilManualInput({ metrics, onChange }: SoilManualInputProps) {
  const handleChange = (field: keyof SoilMetrics, strVal: string) => {
    if (strVal === '') {
      onChange(field, undefined);
    } else {
      const parsed = parseFloat(strVal);
      onChange(field, isNaN(parsed) ? undefined : parsed);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Soil Chemistry & Nutrient Metrics
        </h4>
        <p className="mt-0.5 text-[11px] text-slate-500">
          Enter values from your soil laboratory test sheet. Leave unknown fields blank.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* pH */}
        <div>
          <label
            htmlFor="metric-ph"
            className="block text-xs font-medium text-slate-700"
          >
            Soil pH (H₂O)
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="metric-ph"
              type="number"
              step="0.1"
              min="3"
              max="11"
              placeholder="e.g. 6.8"
              value={metrics.ph ?? ''}
              onChange={(e) => handleChange('ph', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-1 focus:ring-mint-500"
            />
          </div>
          <span className="text-[10px] text-slate-400">Optimum: 6.0 - 7.2</span>
        </div>

        {/* Organic Matter */}
        <div>
          <label
            htmlFor="metric-om"
            className="block text-xs font-medium text-slate-700"
          >
            Organic Matter (%)
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="metric-om"
              type="number"
              step="0.1"
              min="0"
              max="25"
              placeholder="e.g. 2.4"
              value={metrics.organicMatterPct ?? ''}
              onChange={(e) => handleChange('organicMatterPct', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-1 focus:ring-mint-500"
            />
          </div>
          <span className="text-[10px] text-slate-400">Optimum: &gt; 2.5%</span>
        </div>

        {/* Nitrogen */}
        <div>
          <label
            htmlFor="metric-n"
            className="block text-xs font-medium text-slate-700"
          >
            Available Nitrogen (N)
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="metric-n"
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 35"
              value={metrics.nitrogenPpm ?? ''}
              onChange={(e) => handleChange('nitrogenPpm', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-1 focus:ring-mint-500"
            />
          </div>
          <span className="text-[10px] text-slate-400">NO₃-N (ppm / mg/kg)</span>
        </div>

        {/* Phosphorus */}
        <div>
          <label
            htmlFor="metric-p"
            className="block text-xs font-medium text-slate-700"
          >
            Phosphorus (P Olsen)
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="metric-p"
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 22"
              value={metrics.phosphorusPpm ?? ''}
              onChange={(e) => handleChange('phosphorusPpm', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-1 focus:ring-mint-500"
            />
          </div>
          <span className="text-[10px] text-slate-400">ppm (mg/kg)</span>
        </div>

        {/* Potassium */}
        <div>
          <label
            htmlFor="metric-k"
            className="block text-xs font-medium text-slate-700"
          >
            Exchangeable Potassium (K)
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="metric-k"
              type="number"
              step="1"
              min="0"
              placeholder="e.g. 195"
              value={metrics.potassiumPpm ?? ''}
              onChange={(e) => handleChange('potassiumPpm', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-1 focus:ring-mint-500"
            />
          </div>
          <span className="text-[10px] text-slate-400">ppm (mg/kg)</span>
        </div>

        {/* Salinity EC */}
        <div>
          <label
            htmlFor="metric-ec"
            className="block text-xs font-medium text-slate-700"
          >
            Electrical Cond. (Salinity EC)
          </label>
          <div className="mt-1 flex items-center">
            <input
              id="metric-ec"
              type="number"
              step="0.1"
              min="0"
              placeholder="e.g. 1.2"
              value={metrics.salinityEc ?? ''}
              onChange={(e) => handleChange('salinityEc', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-mint-500 focus:outline-none focus:ring-1 focus:ring-mint-500"
            />
          </div>
          <span className="text-[10px] text-slate-400">dS/m (Salinity index)</span>
        </div>
      </div>
    </div>
  );
}
