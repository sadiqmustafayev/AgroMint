'use client';

import React from 'react';
import { ClipboardCheck, CheckCircle2, Clock, AlertTriangle, Lightbulb } from 'lucide-react';
import { RecommendationAction, IdentifiedProblem } from '../../types/advisory';
import { DataBadge } from '../shared/DataBadge';
import { useLanguage } from '../../i18n/LanguageContext';

interface MainFindingsCardProps {
  summaryDiagnosis: string;
  findings: string[];
  actions?: RecommendationAction[];
  identifiedProblem?: IdentifiedProblem;
  healthScore?: number; // kept optional for backwards compat, not rendered
  className?: string;
}

export function MainFindingsCard({
  summaryDiagnosis,
  findings,
  actions = [],
  identifiedProblem,
  className = '',
}: MainFindingsCardProps) {
  const { t, language } = useLanguage();
  const isAz = language === 'az';

  const getTimelineLabel = (timeline: string) => {
    if (isAz) {
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
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-mint-50 text-mint-700 shadow-xs">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              {isAz
                ? 'İcraedici Aqronomik Qiymətləndirmə və Görülməli İşlər'
                : 'Executive Agronomic Assessment & Action Plan'}
            </h3>
            <span className="text-[11px] text-slate-500">
              {isAz
                ? 'Sahə diaqnostikası, əsas problemin həlli və təcili prioritet tədbirlər'
                : 'Field diagnostics, root cause resolution, and prioritized action steps'}
            </span>
          </div>
        </div>

        <DataBadge variant="ai-assessment" />
      </div>

      <div className="mt-4 space-y-4">
        {/* Identified Core Problem & Concrete Solution Banner */}
        {identifiedProblem && (
          <div className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50/40 to-slate-50 p-4 text-xs shadow-xs">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-amber-950 text-xs sm:text-sm">
                    {isAz ? 'Aşkar Edilən Əsas Problem:' : 'Identified Core Problem:'}{' '}
                    <span className="text-slate-900 font-extrabold">{identifiedProblem.problemTitle}</span>
                  </span>
                  <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                    {identifiedProblem.severity === 'critical'
                      ? isAz ? 'Təcili Müdaxilə' : 'Critical'
                      : isAz ? 'Diqqət Tələb Olunur' : 'Moderate'}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
                  <strong>{isAz ? 'Səbəb və Təhlil:' : 'Root Cause:'}</strong> {identifiedProblem.causeAnalysis}
                </p>

                <div className="mt-2 rounded-lg border border-amber-200 bg-white/90 p-2.5 text-[11px] sm:text-xs text-slate-800 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-900">
                      {isAz ? 'Necə Aradan Qaldırmaq Olar (Dərmanlama & Aqrotexniki Həll): ' : 'Recommended Remediation Protocol: '}
                    </span>
                    <span className="leading-relaxed">{identifiedProblem.solutionPlan}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostic Narrative */}
        <div className="rounded-xl bg-mint-50/40 border border-mint-100 p-3.5 text-xs leading-relaxed text-slate-800">
          <span className="font-bold text-mint-950">
            {t('dashboard.diagnosticSynthesis')}{' '}
          </span>
          {summaryDiagnosis}
        </div>

        {/* Primary Observations */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {t('dashboard.primaryObservations')}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600">
            {findings.map((finding, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-mint-600 mt-0.5 shrink-0" />
                <span>{finding}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Action Steps (Merged Right into Executive Card) */}
        {actions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{isAz ? 'Görülməli Olan Prioritet İşlər (İcra Qrafiki):' : 'Prioritized Action Steps (Timeline):'}</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {isAz ? '1-3-7 günlük tədbirlər' : '1-3-7 day schedule'}
              </span>
            </div>

            <div className="space-y-2.5">
              {actions.map((act, idx) => (
                <div
                  key={act.id || idx}
                  className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5 transition-all hover:bg-white hover:shadow-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{act.title}</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${getTimelineBadge(
                            act.timeline
                          )}`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          {getTimelineLabel(act.timeline)}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                        {act.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
