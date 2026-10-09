'use client';

import React from 'react';
import { Sprout, Calendar, History, Info } from 'lucide-react';
import { AVAILABLE_CROPS, getCropGrowthStages, getCropLabel, getStageLabel } from '../../lib/cropStages';
import { useLanguage } from '../../i18n/LanguageContext';

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
  const { t, language } = useLanguage();
  const growthStages = getCropGrowthStages(selectedCrop);

  const handleCropSelect = (crop: string) => {
    onCropChange(crop);
    if (!crop) {
      onStageChange('');
      return;
    }
    const newStages = getCropGrowthStages(crop);
    if (newStages.length === 0) {
      onStageChange('');
    } else if (!newStages.includes(selectedStage)) {
      onStageChange(newStages[0]);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          {t('step2.title')}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {t('step2.desc')}
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
            {t('step2.cropLabel')} <span className="text-red-500">*</span>
          </label>
          <div className="mt-1.5">
            <select
              id="crop-select"
              value={selectedCrop}
              onChange={(e) => handleCropSelect(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              <option value="">{t('step2.cropPlaceholder')}</option>
              {AVAILABLE_CROPS.map((c) => (
                <option key={c} value={c}>
                  {getCropLabel(c, language)}
                </option>
              ))}
              <option value="Other / Unlisted Crop">{t('step2.otherCrop')}</option>
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {t('step2.cropHelper')}
          </p>
        </div>

        {/* Dynamic Growth Stage */}
        <div>
          <label
            htmlFor="stage-select"
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
          >
            <Calendar className="w-3.5 h-3.5 text-mint-600" />
            {t('step2.stageLabel')}{' '}
            <span className="text-slate-400 font-normal">({t('common.optional')})</span>
          </label>
          <div className="mt-1.5">
            <select
              id="stage-select"
              value={selectedStage}
              onChange={(e) => onStageChange(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
            >
              <option value="">{t('step2.stagePlaceholder')}</option>
              {growthStages.map((stage) => (
                <option key={stage} value={stage}>
                  {getStageLabel(stage, language)}
                </option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-[11px] text-slate-500">
            {selectedCrop
              ? t('step2.stageHelperWithCrop').replace('{crop}', getCropLabel(selectedCrop, language))
              : t('step2.stageHelperNoCrop')}
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
          {t('step2.prevCropLabel')}{' '}
          <span className="text-slate-400 font-normal">({t('common.optional')})</span>
        </label>
        <div className="mt-1.5 max-w-sm">
          <input
            id="prev-crop-input"
            type="text"
            placeholder={t('step2.prevCropPlaceholder')}
            value={previousCrop}
            onChange={(e) => onPreviousCropChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          />
        </div>
        <div className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
          <span>
            {t('step2.prevCropHelper')}
          </span>
        </div>
      </div>
    </div>
  );
}
