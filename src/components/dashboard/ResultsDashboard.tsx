import React from 'react';
import { AgronomicAdvisoryReport } from '../../types/advisory';
import { ResultsHeader } from './ResultsHeader';
import { FarmProfileCard } from './FarmProfileCard';
import { MainFindingsCard } from './MainFindingsCard';
import { FertilizerCard } from './FertilizerCard';
import { IrrigationCard } from './IrrigationCard';
import { PlantProtectionCard } from './PlantProtectionCard';
import { ActionStepsCard } from './ActionStepsCard';
import { UncertaintiesCard } from './UncertaintiesCard';
import { CitationsCard } from './CitationsCard';
import { WeatherAnalysisCard } from './WeatherAnalysisCard';

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
        {/* Card 1: Submitted Farm Profile */}
        <FarmProfileCard profile={report.farmProfile} />

        {/* Card 2: Executive Findings & Health Score */}
        <MainFindingsCard
          healthScore={report.overallHealthScore}
          summaryDiagnosis={report.summaryDiagnosis}
          findings={report.mainFindings}
        />

        {/* Live Weather Forecast & AI Meteorological Synthesis */}
        {(report.weatherData || report.weatherSynthesis) && (
          <div className="lg:col-span-2">
            <WeatherAnalysisCard
              weatherData={report.weatherData}
              weatherSynthesis={report.weatherSynthesis}
            />
          </div>
        )}

        {/* Card 3: Fertilizer Advisory & AgroSphere Link */}
        <div className="lg:col-span-2">
          <FertilizerCard fertilizerAdvisory={report.fertilizerAdvisory} />
        </div>

        {/* Card 4: Irrigation Management */}
        <IrrigationCard irrigation={report.irrigationAdvisory} />

        {/* Card 5: Plant Protection & AgroSphere Link */}
        <PlantProtectionCard plantProtection={report.plantProtection} />

        {/* Card 6: Action Steps Schedule */}
        <div className="lg:col-span-2">
          <ActionStepsCard actions={report.actionSteps} />
        </div>

        {/* Card 7: Uncertainties and Gaps */}
        <UncertaintiesCard uncertainties={report.uncertaintiesAndGaps} />

        {/* Card 8: Scientific Citations */}
        <CitationsCard citations={report.scientificCitations} />
      </div>
    </div>
  );
}
