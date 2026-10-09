'use client';

import React from 'react';
import { HelpCircle } from 'lucide-react';
import { FileUploadZone } from '../shared/FileUploadZone';
import { useLanguage } from '../../i18n/LanguageContext';
import { translations } from '../../i18n/translations';

interface StepQuestionsMediaProps {
  mainProblem: string;
  uploadedPhotos: string[];
  onProblemChange: (problem: string) => void;
  onPhotosChange: (photos: string[]) => void;
}

export function StepQuestionsMedia({
  mainProblem,
  uploadedPhotos,
  onProblemChange,
  onPhotosChange,
}: StepQuestionsMediaProps) {
  const { t, language } = useLanguage();
  const quickPrompts = translations[language].options.quickPrompts;

  const appendPrompt = (promptText: string) => {
    if (!mainProblem) {
      onProblemChange(promptText);
    } else if (!mainProblem.includes(promptText)) {
      onProblemChange(`${mainProblem}. ${promptText}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-slate-900">
          {t('step4.title')}
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          {t('step4.desc')}
        </p>
      </div>

      {/* Main Problem Textarea */}
      <div>
        <label
          htmlFor="main-problem-textarea"
          className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700"
        >
          <HelpCircle className="w-3.5 h-3.5 text-mint-600" />
          {t('step4.problemLabel')} <span className="text-red-500">*</span>
        </label>
        <div className="mt-1.5">
          <textarea
            id="main-problem-textarea"
            rows={4}
            required
            placeholder={t('step4.problemPlaceholder')}
            value={mainProblem}
            onChange={(e) => onProblemChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white p-3.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition focus:border-mint-500 focus:outline-none focus:ring-2 focus:ring-mint-500/20"
          />
        </div>

        {/* Quick prompt suggestion pills */}
        <div className="mt-2.5">
          <span className="text-[11px] font-medium text-slate-500">
            {t('step4.quickSuggestionsLabel')}
          </span>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {quickPrompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => appendPrompt(p)}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 transition hover:border-mint-300 hover:bg-mint-50/60 hover:text-mint-800 text-left"
              >
                + {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Photo & Document Uploads */}
      <div className="pt-2 border-t border-slate-200">
        <FileUploadZone
          label={t('step4.photoUploadLabel')}
          description={t('step4.photoUploadDesc')}
          acceptedTypes={['jpg', 'jpeg', 'png', 'webp']}
          maxFiles={6}
          initialFiles={uploadedPhotos}
          onFilesSelected={onPhotosChange}
        />
      </div>
    </div>
  );
}
