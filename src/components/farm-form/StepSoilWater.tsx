import React from 'react';
import { Layers, Droplets, FileUp, PenLine } from 'lucide-react';
import { SoilMetrics, SoilType, IrrigationMethod, WaterSource } from '../../types/farm';
import { SoilManualInput } from './SoilManualInput';
import { FileUploadZone } from '../shared/FileUploadZone';

const SOIL_TYPES: SoilType[] = [
  'Sandy',
  'Loamy',
  'Clay',
  'Silt',
  'Peaty',
  'Chalky',
  'Unknown / Unsure',
];

const IRRIGATION_METHODS: IrrigationMethod[] = [
  'Drip Irrigation',
  'Sprinkler System',
  'Flood / Furrow',
  'Rain-fed Only',
  'Not Specified',
];

const WATER_SOURCES: WaterSource[] = [
  'Deep Borewell / Groundwater',
  'Irrigation Canal',
  'River / Stream',
  'Rainwater Reservoir',
  'Municipal Supply',
  'Not Specified',
];

interface StepSoilWaterProps {
  soilMode: 'upload' | 'manual';
  soilType: string;
  soilMetrics: SoilMetrics;
  uploadedDocs: string[];
  irrigationMethod: string;
  waterSource: string;
  onSoilModeChange: (mode: 'upload' | 'manual') => void;
  onSoilTypeChange: (type: string) => void;
  onSoilMetricChange: (field: keyof SoilMetrics, val: number | undefined) => void;
  onDocsChange: (docs: string[]) => void;
  onIrrigationChange: (method: string) => void;
  onWaterSourceChange: (source: string) => void;
}

export function StepSoilWater({
  soilMode,
  soilType,
  soilMetrics,
  uploadedDocs,
  irrigationMethod,
  waterSource,
  onSoilModeChange,
  onSoilTypeChange,
  onSoilMetricChange,
  onDocsChange,
  onIrrigationChange,
  onWaterSourceChange,
}: StepSoilWaterProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Soil Fertility & Irrigation Infrastructure
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Soil texture and hydrology govern nutrient solubility and fertilizer leaching rates.
        </p>
      </div>

      {/* Soil Type Selection */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="soil-type-select"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            <Layers className="w-3.5 h-3.5 text-mint-600" />
            Soil Classification / Texture
          </label>
          <div className="mt-1.5">
            <select
              id="soil-type-select"
              value={soilType}
              onChange={(e) => onSoilTypeChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              {SOIL_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            If unsure, select "Unknown / Unsure" to allow regional estimation.
          </p>
        </div>

        <div>
          <label
            htmlFor="irrigation-method-select"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            <Droplets className="w-3.5 h-3.5 text-mint-600" />
            Irrigation System
          </label>
          <div className="mt-1.5">
            <select
              id="irrigation-method-select"
              value={irrigationMethod}
              onChange={(e) => onIrrigationChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              {IRRIGATION_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Enables fertigation and moisture interval modeling.
          </p>
        </div>
      </div>

      {/* Water Source */}
      <div>
        <label
          htmlFor="water-source-select"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          <Droplets className="w-3.5 h-3.5 text-mint-600" />
          Primary Water Source <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <div className="mt-1.5 max-w-sm">
          <select
            id="water-source-select"
            value={waterSource}
            onChange={(e) => onWaterSourceChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          >
            {WATER_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Soil Analysis Entry Mode Toggle */}
      <div className="space-y-3 pt-2 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Soil Test Analysis Report
            </h4>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Provide soil test results via PDF/image upload or manual entry (optional).
            </p>
          </div>

          {/* Toggle pill buttons */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onSoilModeChange('upload')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                soilMode === 'upload'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileUp className="w-3.5 h-3.5" />
              Document Upload
            </button>
            <button
              type="button"
              onClick={() => onSoilModeChange('manual')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 transition ${
                soilMode === 'manual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              Manual Data Entry
            </button>
          </div>
        </div>

        {soilMode === 'upload' ? (
          <FileUploadZone
            label="Upload Soil Lab Report"
            description="Upload official laboratory analysis sheets (PDF or scanned images)"
            acceptedTypes={['pdf', 'png', 'jpg']}
            initialFiles={uploadedDocs}
            onFilesSelected={onDocsChange}
          />
        ) : (
          <SoilManualInput metrics={soilMetrics} onChange={onSoilMetricChange} />
        )}
      </div>
    </div>
  );
}
