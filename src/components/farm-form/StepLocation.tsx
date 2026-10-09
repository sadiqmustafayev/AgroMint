import React from 'react';
import { MapPin, Building2, Maximize2 } from 'lucide-react';

export const COMMON_REGIONS = [
  'Aran',
  'Ganja-Dashkasan',
  'Shaki-Zagatala',
  'Guba-Khachmaz',
  'Lankaran-Astara',
  'Shirvan-Salyan',
  'Mil-Mughan',
  'Karabakh',
  'East Zangezur',
  'Absheron-Khizi',
  'Central Plains',
  'North Valley',
  'Coastal Delta',
  'Other / International Region',
];

interface StepLocationProps {
  region: string;
  district: string;
  farmAreaHectares?: number | string;
  onChange: (field: 'region' | 'district' | 'farmAreaHectares', value: any) => void;
}

export function StepLocation({
  region,
  district,
  farmAreaHectares,
  onChange,
}: StepLocationProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Farm Location & Field Dimensions
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Geographic context enables climate, macro-soil, and regional growing degree-day modeling.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Region */}
        <div>
          <label
            htmlFor="region-select"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            <MapPin className="w-3.5 h-3.5 text-mint-600" />
            Agricultural Region <span className="text-red-500">*</span>
          </label>
          <div className="mt-1.5">
            <input
              id="region-select"
              list="regions-list"
              type="text"
              required
              placeholder="e.g. Aran, Ganja-Dashkasan..."
              value={region}
              onChange={(e) => onChange('region', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            />
            <datalist id="regions-list">
              {COMMON_REGIONS.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Select or type your agricultural region/province.
          </p>
        </div>

        {/* District */}
        <div>
          <label
            htmlFor="district-input"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            <Building2 className="w-3.5 h-3.5 text-mint-600" />
            District / Municipality <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="mt-1.5">
            <input
              id="district-input"
              type="text"
              placeholder="e.g. Samukh, Tartar, Khachmaz..."
              value={district}
              onChange={(e) => onChange('district', e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            For finer micro-climate and elevation calibration.
          </p>
        </div>
      </div>

      {/* Farm Area in Hectares */}
      <div>
        <label
          htmlFor="farm-area-input"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          <Maximize2 className="w-3.5 h-3.5 text-mint-600" />
          Total Farm Area (Hectares) <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <div className="mt-1.5 flex max-w-xs items-center">
          <input
            id="farm-area-input"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="e.g. 15.5"
            value={farmAreaHectares ?? ''}
            onChange={(e) =>
              onChange('farmAreaHectares', e.target.value ? parseFloat(e.target.value) : undefined)
            }
            className="w-full rounded-l-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          />
          <span className="inline-flex items-center rounded-r-lg border border-l-0 border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-600">
            Hectares (ha)
          </span>
        </div>
        <p className="mt-1 text-[11px] text-slate-500">
          Used to calculate total input quantities (kg/ha) and irrigation volume. Can be skipped.
        </p>
      </div>
    </div>
  );
}
