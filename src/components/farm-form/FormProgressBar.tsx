'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onStepClick?: (step: number) => void;
}

export function FormProgressBar({
  currentStep,
  totalSteps,
  stepTitles,
  onStepClick,
}: FormProgressBarProps) {
  const { t } = useLanguage();

  const stepOfText = (t('common.stepOf') || 'Step {current} of {total}')
    .replace('{current}', String(currentStep))
    .replace('{total}', String(totalSteps));

  return (
    <div className="w-full">
      {/* Mobile step indicator */}
      <div className="flex items-center justify-between sm:hidden pb-3 border-b border-slate-200">
        <span className="text-xs font-semibold uppercase tracking-wider text-mint-700">
          {stepOfText}
        </span>
        <span className="text-xs font-medium text-slate-700">
          {stepTitles[currentStep - 1]}
        </span>
      </div>

      {/* Desktop breadcrumb progress bar */}
      <div className="hidden sm:grid sm:grid-cols-4 gap-2">
        {stepTitles.map((title, idx) => {
          const stepNum = idx + 1;
          const isComplete = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const stepNumText = (t('common.stepNum') || 'Step {step}').replace(
            '{step}',
            String(stepNum)
          );

          return (
            <button
              key={title}
              type="button"
              disabled={stepNum > currentStep}
              onClick={() => onStepClick && onStepClick(stepNum)}
              className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition ${
                isCurrent
                  ? 'border-mint-500 bg-mint-50/70 shadow-sm'
                  : isComplete
                  ? 'border-slate-200 bg-slate-50/70 text-slate-600 hover:bg-slate-100 cursor-pointer'
                  : 'border-slate-200 bg-white/40 text-slate-400 opacity-60 cursor-not-allowed'
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isCurrent
                    ? 'bg-mint-600 text-white'
                    : isComplete
                    ? 'bg-mint-100 text-mint-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {isComplete ? <Check className="w-3.5 h-3.5" /> : stepNum}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-slate-900">
                  {title}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {stepNumText}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
