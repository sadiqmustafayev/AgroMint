import React from 'react';
import { AgronomicAdvisoryReport } from '../../types/advisory';
import { ResultsHeader } from './ResultsHeader';
import { FarmProfileCard } from './FarmProfileCard';
import { MainFindingsCard } from './MainFindingsCard';
import { CropAdvisoryCard } from './CropAdvisoryCard';
import { SoilNutrientCard } from './SoilNutrientCard';
import { FertilizerCard } from './FertilizerCard';
import { IrrigationCard } from './IrrigationCard';
import { PlantProtectionCard } from './PlantProtectionCard';
import { ActionStepsCard } from './ActionStepsCard';
import { UncertaintiesCard } from './UncertaintiesCard';
import { CitationsCard } from './CitationsCard';

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

        {/* Card 3: Crop-Specific Cultivation Guidance */}
        <CropAdvisoryCard
          crop={report.farmProfile.crop}
          stage={report.farmProfile.growthStage}
          guidance={report.cropSpecificGuidance}
        />

        {/* Card 4: Soil Fertility Profile & Gauges */}
        <SoilNutrientCard soilFertility={report.soilFertility} />

        {/* Card 5: Fertilizer Advisory & AgroSphere Link */}
        <div className="lg:col-span-2">
          <FertilizerCard fertilizerAdvisory={report.fertilizerAdvisory} />
        </div>

        {/* Card 6: Irrigation Management */}
        <IrrigationCard irrigation={report.irrigationAdvisory} />

        {/* Card 7: Plant Protection & AgroSphere Link */}
        <PlantProtectionCard plantProtection={report.plantProtection} />

        {/* Card 8: Action Steps Schedule */}
        <div className="lg:col-span-2">
          <ActionStepsCard actions={report.actionSteps} />
        </div>

        {/* Card 9: Uncertainties and Gaps */}
        <UncertaintiesCard uncertainties={report.uncertaintiesAndGaps} />

        {/* Card 10: Scientific Citations */}
        <CitationsCard citations={report.scientificCitations} />
      </div>
    </div>
  );
}
