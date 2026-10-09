import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultsHeader } from '../src/components/dashboard/ResultsHeader';
import { FarmProfileCard } from '../src/components/dashboard/FarmProfileCard';
import { MainFindingsCard } from '../src/components/dashboard/MainFindingsCard';
import { CropAdvisoryCard } from '../src/components/dashboard/CropAdvisoryCard';

describe('Dashboard Header and Finding Cards', () => {
  it('renders ResultsHeader with report ID and print/download buttons', () => {
    render(
      <ResultsHeader
        reportId="AGM-481923"
        crop="Cotton"
        region="Ganja-Dashkasan"
        growthStage="Squaring / Flowering"
        createdAt="2026-10-09T10:00:00Z"
      />
    );
    expect(screen.getByText(/AGM-481923/i)).toBeInTheDocument();
    expect(screen.getByText(/Cotton/i)).toBeInTheDocument();
    expect(screen.getByText(/Squaring \/ Flowering/i)).toBeInTheDocument();
  });

  it('renders FarmProfileCard with submitted data badge and farm metrics', () => {
    render(
      <FarmProfileCard
        profile={{
          region: 'Shirvan',
          district: 'Hajigabul',
          crop: 'Pomegranate',
          farmAreaHectares: 12,
          soilType: 'Loamy',
          irrigationMethod: 'Drip Irrigation',
          mainProblem: 'Foliar mite infestation query',
        }}
      />
    );
    expect(screen.getByText(/Submitted Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Shirvan/i)).toBeInTheDocument();
    expect(screen.getByText(/12 Hectares/i)).toBeInTheDocument();
    expect(screen.getByText(/Pomegranate/i)).toBeInTheDocument();
  });

  it('renders MainFindingsCard with health score and diagnosis', () => {
    render(
      <MainFindingsCard
        healthScore={84}
        summaryDiagnosis="Good vegetative vigor with localized nitrogen limitation."
        findings={['Optimal canopy aeration', 'Split top-dressing recommended']}
      />
    );
    expect(screen.getByText(/84/i)).toBeInTheDocument();
    expect(screen.getByText(/Good vegetative vigor/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Assessment/i)).toBeInTheDocument();
  });

  it('renders CropAdvisoryCard with cultivation guidelines', () => {
    render(
      <CropAdvisoryCard
        crop="Wheat"
        stage="Tillering"
        guidance={{
          optimalTemperature: '15-22°C',
          stageManagement: 'Keep nitrogen split',
          canopyCare: 'Monitor rust fungi',
          keyRisks: ['Early frost', 'Aphids'],
        }}
      />
    );
    expect(screen.getByText(/15-22°C/i)).toBeInTheDocument();
    expect(screen.getByText(/Early frost/i)).toBeInTheDocument();
  });
});
