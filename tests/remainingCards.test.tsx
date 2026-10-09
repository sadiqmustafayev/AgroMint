import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IrrigationCard } from '../src/components/dashboard/IrrigationCard';
import { PlantProtectionCard } from '../src/components/dashboard/PlantProtectionCard';
import { ActionStepsCard } from '../src/components/dashboard/ActionStepsCard';
import { UncertaintiesCard } from '../src/components/dashboard/UncertaintiesCard';
import { CitationsCard } from '../src/components/dashboard/CitationsCard';

describe('Remaining Dashboard Cards (Cards 6 - 10)', () => {
  it('renders IrrigationCard with water frequency and management tips', () => {
    render(
      <IrrigationCard
        irrigation={{
          currentMethod: 'Drip Irrigation',
          recommendedFrequency: 'Every 4-6 days',
          waterRequirementMmPerWeek: 35,
          managementTips: ['Irrigate during early dawn', 'Check soil tensiometer'],
        }}
      />
    );
    expect(screen.getByText(/Irrigation & Moisture Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Every 4-6 days/i)).toBeInTheDocument();
  });

  it('renders PlantProtectionCard with pest risks and AgroSphere protection link', () => {
    render(
      <PlantProtectionCard
        plantProtection={{
          diagnosedStressors: ['Aphid colonization on upper foliage'],
          preventativeControls: ['Deploy yellow sticky traps'],
          organicInterventions: ['Neem oil spray (5%)'],
          agroSphereLink: {
            title: 'Explore Plant Protection Products on AgroSphere',
            description: 'Order certified biological and organic pest control',
            destinationUrl: 'https://agrosphere.org/marketplace/protection',
            serviceType: 'protection',
            callToActionText: 'Explore Crop Protection on AgroSphere',
          },
        }}
      />
    );
    expect(screen.getByText(/Integrated Plant Protection & Disease Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Aphid colonization on upper foliage/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Plant Protection Products on AgroSphere/i)).toBeInTheDocument();
  });

  it('renders ActionStepsCard with chronological next steps', () => {
    render(
      <ActionStepsCard
        actions={[
          {
            id: '1',
            title: 'Calibrate Drip Irrigation',
            timeline: 'Immediate (1-2 Days)',
            description: 'Check emitter pressure',
            importance: 'critical',
          },
        ]}
      />
    );
    expect(screen.getByText(/Priority Agronomic Action Steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Calibrate Drip Irrigation/i)).toBeInTheDocument();
  });

  it('renders UncertaintiesCard explicitly listing missing parameters', () => {
    render(
      <UncertaintiesCard
        uncertainties={['Exact soil organic matter percentage not provided']}
      />
    );
    expect(screen.getByText(/Data Uncertainties & Information Gaps/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Exact soil organic matter percentage not provided/i)
    ).toBeInTheDocument();
  });

  it('renders CitationsCard with scientific literature references', () => {
    render(
      <CitationsCard
        citations={[
          {
            title: 'FAO Irrigation Paper 56',
            source: 'Food and Agriculture Organization',
            year: 2021,
            relevance: 'Crop evapotranspiration baselines',
          },
        ]}
      />
    );
    expect(screen.getByText(/Scientific Literature & Agronomic Citations/i)).toBeInTheDocument();
    expect(screen.getByText(/FAO Irrigation Paper 56/i)).toBeInTheDocument();
  });
});
