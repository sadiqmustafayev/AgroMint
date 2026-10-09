'use client';

import React from 'react';
import { CalendarCheck2, Clock } from 'lucide-react';
import { RecommendationAction } from '../../types/advisory';
import { DataBadge } from '../shared/DataBadge';
import { useLanguage } from '../../i18n/LanguageContext';

interface ActionStepsCardProps {
  actions: RecommendationAction[];
  className?: string;
}

export function ActionStepsCard({ actions, className = '' }: ActionStepsCardProps) {
  const { t, language } = useLanguage();

  const getTimelineLabel = (timeline: string) => {
    if (language === 'az') {
      if (timeline.includes('Immediate')) return 'Təxirəsalınmaz (1-2 Gün)';
      if (timeline.includes('Near-term')) return 'Yaxın günlərdə (3-7 Gün)';
      if (timeline.includes('Next Growth Phase')) return 'Növbəti İnkişaf Mərhələsi';
    }
    return timeline;
  };

  const getTimelineBadge = (timeline: string) => {
    if (timeline.includes('Immediate') || timeline.includes('Təxirəsalınmaz')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (timeline.includes('Near-term') || timeline.includes('Yaxın günlərdə')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-blue-50 text-blue-700 border-blue-200';
  };

  return (
    <div
      className={`rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint-50 text-mint-700">
            <CalendarCheck2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {t('dashboard.actionStepsTitle')}
            </h3>
            <span className="text-[11px] text-slate-500">
              {t('dashboard.actionStepsSub')}
            </span>
          </div>
        </div>

        <DataBadge variant="recommendation" />
      </div>

      <div className="mt-4 space-y-3">
        {actions.map((act, idx) => (
          <div
            key={act.id || idx}
            className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint-100 text-xs font-bold text-mint-800">
                {idx + 1}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getTimelineBadge(
                      act.timeline
                    )}`}
                  >
                    <Clock className="w-2.5 h-2.5" />
                    {getTimelineLabel(act.timeline)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
