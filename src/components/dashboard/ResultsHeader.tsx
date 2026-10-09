'use client';

import React from 'react';
import { Download, Printer, RotateCcw, Calendar, MapPin, Sprout, Share2, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ResultsHeaderProps {
  reportId: string;
  source?: string;
  crop: string;
  region: string;
  growthStage?: string;
  createdAt?: string;
  onReset?: () => void;
  className?: string;
}

export function ResultsHeader({
  reportId,
  source,
  crop,
  region,
  growthStage,
  createdAt,
  onReset,
  className = '',
}: ResultsHeaderProps) {
  let t = (k: string) => {
    const map: Record<string, string> = {
      'dashboard.dossierTitle': 'Agronomic Intelligence Dossier',
      'dashboard.verifiedTag': 'Verified Analysis',
      'dashboard.reportTitle': 'Personalized Farm Advisory Report',
      'common.printReport': 'Print Report',
      'common.newAnalysis': 'New Analysis',
    };
    return map[k] || k;
  };

  let isAz = false;
  try {
    const lang = useLanguage();
    if (lang && lang.t) t = lang.t;
    if (lang && lang.language === 'az') isAz = true;
  } catch (e) {
    // fallback
  }

  const isGemini = source === 'gemini' || reportId.startsWith('agro-gemini');

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : new Date().toLocaleDateString();

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-mint-700">
              {t('dashboard.dossierTitle')}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600">
              {reportId}
            </span>
            {isGemini ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200 shadow-xs">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>{isAz ? 'Gemini AI ilə Təhlil Edildi' : 'Powered by Gemini AI'}</span>
              </span>
            ) : (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                {t('dashboard.verifiedTag')}
              </span>
            )}
          </div>

          <h1 className="mt-1.5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {t('dashboard.reportTitle')}
          </h1>

          {/* Metadata pill tags */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
              <Sprout className="w-3.5 h-3.5 text-mint-600" />
              {crop}
            </span>
            {growthStage && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">{growthStage}</span>
              </>
            )}
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {region}
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            {t('common.printReport')}
          </button>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              {t('common.newAnalysis')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
