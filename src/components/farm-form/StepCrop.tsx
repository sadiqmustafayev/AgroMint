import React from 'react';
import { Sprout, Calendar, History, Info } from 'lucide-react';
import { AVAILABLE_CROPS, getCropGrowthStages } from '../../lib/cropStages';

interface StepCropProps {
  selectedCrop: string;
  selectedStage: string;
  previousCrop?: string;
  onCropChange: (crop: string) => void;
  onStageChange: (stage: string) => void;
  onPreviousCropChange: (crop: string) => void;
}

export function StepCrop({
  selectedCrop,
  selectedStage,
  previousCrop = '',
  onCropChange,
  onStageChange,
  onPreviousCropChange,
}: StepCropProps) {
  const growthStages = getCropGrowthStages(selectedCrop);

  const handleCropSelect = (crop: string) => {
    onCropChange(crop);
    // Auto-select first stage or clear if crop changes
    const newStages = getCropGrowthStages(crop);
    if (newStages.length > 0 && !newStages.includes(selectedStage)) {
      onStageChange(newStages[0]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          Crop Biology & Growth Phenology
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Crop stage determines evapotranspiration needs, critical nitrogen thresholds, and pest susceptibility.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Crop Selection */}
        <div>
          <label
            htmlFor="crop-select"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            <Sprout className="w-3.5 h-3.5 text-mint-600" />
            Current Crop <span className="text-red-500">*</span>
          </label>
          <div className="mt-1.5">
            <select
              id="crop-select"
              value={selectedCrop}
              onChange={(e) => handleCropSelect(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              <option value="">Select a crop...</option>
              {AVAILABLE_CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="Other / Unlisted Crop">Other / Unlisted Crop</option>
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            Select your main active or planned crop.
          </p>
        </div>

        {/* Dynamic Growth Stage */}
        <div>
          <label
            htmlFor="stage-select"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            <Calendar className="w-3.5 h-3.5 text-mint-600" />
            Crop Growth Stage <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="mt-1.5">
            <select
              id="stage-select"
              value={selectedStage}
              onChange={(e) => onStageChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              <option value="">Select growth stage...</option>
              {growthStages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {selectedCrop
              ? `Stages specific to ${selectedCrop}.`
              : 'Select a crop to load stages.'}
          </p>
        </div>
      </div>

      {/* Previous Crop Rotation */}
      <div>
        <label
          htmlFor="prev-crop-input"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          <History className="w-3.5 h-3.5 text-mint-600" />
          Previous Crop in Field <span className="text-slate-400 font-normal">(Optional)</span>
        </label>
        <div className="mt-1.5 max-w-sm">
          <input
            id="prev-crop-input"
            type="text"
            placeholder="e.g. Alfalfa, Wheat, Fallow..."
            value={previousCrop}
            onChange={(e) => onPreviousCropChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          />
        </div>
        <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span>
            Previous legumes (alfalfa, clover) fix biological nitrogen, reducing current synthetic fertilizer requirements.
          </span>
        </div>
      </div>
    </div>
  );
}
