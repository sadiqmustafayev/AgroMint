import React from 'react';
import { AgronomicAdvisoryReport } from '../../types/advisory';
import { ResultsHeader } from './ResultsHeader';
import { FarmProfileCard } from './FarmProfileCard';
import { MainFindingsCard } from './MainFindingsCard';
import { FertilizerCard } from './FertilizerCard';
import { IrrigationCard } from './IrrigationCard';
import { PlantProtectionCard } from './PlantProtectionCard';
import { UncertaintiesCard } from './UncertaintiesCard';
import { CitationsCard } from './CitationsCard';
import { WeatherAnalysisCard } from './WeatherAnalysisCard';
import { useLanguage } from '../../i18n/LanguageContext';

interface ResultsDashboardProps {
  report: AgronomicAdvisoryReport;
  onReset?: () => void;
  className?: string;
}

export function ResultsDashboard({
  report,
  onReset,
  className = '',
}: ResultsDashboardProps) {
  const { language } = useLanguage();
  const isAz = language === 'az';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with summary badges & actions */}
      <ResultsHeader
        reportId={report.id}
        crop={report.farmProfile.crop}
        region={report.farmProfile.region}
        growthStage={report.farmProfile.growthStage}
        createdAt={report.createdAt}
        onReset={onReset}
      />

      {/* 2-Column Responsive Card Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Core 1: Unified Executive Assessment, Problem Resolution & Prioritized Action Steps */}
        <div className="lg:col-span-2">
          <MainFindingsCard
            summaryDiagnosis={report.summaryDiagnosis}
            findings={report.mainFindings}
            actions={report.actionSteps}
            identifiedProblem={report.identifiedProblem}
          />
        </div>

        {/* Submitted Farm Profile Data */}
        <div className="lg:col-span-2">
          <FarmProfileCard profile={report.farmProfile} />
        </div>

        {/* Plant Protection & Medicine Prescriptions */}
        <PlantProtectionCard plantProtection={report.plantProtection} />

        {/* Irrigation Management */}
        <IrrigationCard irrigation={report.irrigationAdvisory} />

        {/* Uncertainties and Gaps */}
        <UncertaintiesCard uncertainties={report.uncertaintiesAndGaps} />

        {/* Scientific Citations */}
        <CitationsCard citations={report.scientificCitations} />

        {/* Section Divider: Supplementary Analyses (Ən axırda: Əlavə Təhlillər və Aqronomik Detallar) */}
        <div className="lg:col-span-2 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                {isAz
                  ? 'Əlavə Təhlillər və Aqronomik Detallar'
                  : 'Supplementary Analyses & Agronomic Details'}
              </h2>
              <p className="text-xs text-slate-500">
                {isAz
                  ? 'Hava proqnozu, mineral qidalanma və torpaq yaxşılaşdırma planı'
                  : 'Detailed weather forecast and mineral fertilizer nutrition parameters'}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {isAz ? 'Əlavə Məlumat' : 'Supplementary Data'}
            </span>
          </div>
        </div>

        {/* 7 Günlük Hava Proqnozu & AI Aqronomik Nəticələri */}
        {(report.weatherData || report.weatherSynthesis) && (
          <div className="lg:col-span-2">
            <WeatherAnalysisCard
              weatherData={report.weatherData}
              weatherSynthesis={report.weatherSynthesis}
            />
          </div>
        )}

        {/* Gübrələmə və Torpaq Yaxşılaşdırma Planı */}
        <div className="lg:col-span-2">
          <FertilizerCard fertilizerAdvisory={report.fertilizerAdvisory} />
        </div>
      </div>
    </div>
  );
}
