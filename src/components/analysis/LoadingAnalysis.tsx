import React, { useState, useEffect } from 'react';
import { Sprout, CheckCircle2, Loader2, Database, BookOpen, Sparkles } from 'lucide-react';

interface AnalysisStep {
  id: number;
  label: string;
  detail: string;
}

const EVALUATION_STEPS: AnalysisStep[] = [
  {
    id: 1,
    label: 'Normalizing Soil Chemistry',
    detail: 'Calibrating pH, baseline cation exchange capacity, and salinity indices against regional soil benchmarks...',
  },
  {
    id: 2,
    label: 'Correlating Phenology & Growth Stage',
    detail: 'Aligning plant growth phase with critical evapotranspiration and nutrient uptake curves...',
  },
  {
    id: 3,
    label: 'Evaluating Nutrient & Protection Thresholds',
    detail: 'Screening foliar disease risks and calculating split nitrogen fertilizer requirements...',
  },
  {
    id: 4,
    label: 'Compiling Agronomic Advisory Dossier',
    detail: 'Synthesizing evidence-based action schedule with explicit data gap disclosures...',
  },
];

interface LoadingAnalysisProps {
  onComplete: () => void;
  durationMs?: number;
  className?: string;
}

export function LoadingAnalysis({
  onComplete,
  durationMs = 2400,
  className = '',
}: LoadingAnalysisProps) {
  const [activeStep, setActiveStep] = useState(1);
  const [progressPct, setProgressPct] = useState(10);

  useEffect(() => {
    const stepDuration = durationMs / EVALUATION_STEPS.length;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < EVALUATION_STEPS.length) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    const progressInterval = setInterval(() => {
      setProgressPct((prev) => {
        if (prev < 96) {
          return prev + 6;
        }
        return prev;
      });
    }, durationMs / 18);

    const timeout = setTimeout(() => {
      setProgressPct(100);
      onComplete();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [durationMs, onComplete]);

  return (
    <div
      className={`mx-auto max-w-2xl rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-100/90 ${className}`}
    >
      <div className="text-center">
        {/* Animated pulse badge */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-mint-50 border border-mint-200 text-mint-600 shadow-sm animate-pulse">
          <Sprout className="h-7 w-7" />
        </div>

        <h2 className="mt-5 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Synthesizing Field Observations & Scientific References
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          AgroMint AI is processing your farm parameters through our curated agronomic knowledge base.
        </p>

        {/* Overall progress bar */}
        <div className="mt-6 mx-auto max-w-md">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Agronomic Modeling</span>
            <span className="text-mint-700">{progressPct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-mint-500 to-emerald-600 transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Checklist */}
      <div className="mt-8 space-y-3.5 border-t border-slate-100 pt-6">
        {EVALUATION_STEPS.map((step) => {
          const isDone = activeStep > step.id;
          const isCurrent = activeStep === step.id;

          return (
            <div
              key={step.id}
              className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all ${
                isCurrent
                  ? 'border-mint-500/80 bg-mint-50/50 shadow-sm'
                  : isDone
                  ? 'border-slate-200/70 bg-white text-slate-700'
                  : 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-mint-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 bg-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                    {step.id}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent
                        ? 'text-mint-950 font-bold'
                        : isDone
                        ? 'text-slate-800'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] font-medium text-mint-700 animate-pulse">
                      Processing...
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-medium text-emerald-700">
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                  {step.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-center">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
          <BookOpen className="w-3.5 h-3.5 text-mint-600" />
          Cross-referencing scientific literature and FAO extension models
        </span>
      </div>
    </div>
  );
}
