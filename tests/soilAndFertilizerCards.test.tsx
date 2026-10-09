import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SoilNutrientCard } from '../src/components/dashboard/SoilNutrientCard';
import { FertilizerCard } from '../src/components/dashboard/FertilizerCard';

describe('Soil and Fertilizer Cards', () => {
  it('renders SoilNutrientCard with metric gauges and fertility index', () => {
    render(
      <SoilNutrientCard
        soilFertility={{
          soilType: 'Loamy',
          fertilityIndex: 'Balanced',
          notes: 'Balanced cation capacity.',
          metrics: [
            {
              parameter: 'Soil pH',
              value: 6.8,
              unit: 'pH',
              status: 'optimal',
              benchmark: '6.0 - 7.2',
              interpretation: 'Optimal bioavailability',
            },
          ],
        }}
      />
    );
    expect(screen.getByText(/Soil Fertility & Nutrient Profile/i)).toBeInTheDocument();
    expect(screen.getByText('Soil pH')).toBeInTheDocument();
    expect(screen.getByText(/Index:\s*Balanced/i)).toBeInTheDocument();
  });

  it('renders FertilizerCard with safe dosage notice and contextual AgroSphere outbound link', () => {
    render(
      <FertilizerCard
        fertilizerAdvisory={{
          safeDosageNotice: 'Caution: Conservative estimate without lab sheet.',
          prescriptions: [
            {
              nutrient: 'Nitrogen (N)',
              fertilizerType: 'Urea (46-0-0)',
              timing: 'Split top-dress',
              estimatedRate: '60 kg/ha',
              isGuardedEstimate: true,
            },
          ],
          agroSphereLink: {
            title: 'Order certified fertilizers on AgroSphere',
            description: 'Connect with verified regional agricultural distributors',
            destinationUrl: 'https://agrosphere.org/marketplace/fertilizers',
            serviceType: 'fertilizer',
            callToActionText: 'View Suitable Fertilizers on AgroSphere',
          },
        }}
      />
    );
    expect(screen.getByText(/Fertilizer & Soil Amendment Plan/i)).toBeInTheDocument();
    expect(screen.getByText(/Caution: Conservative estimate/i)).toBeInTheDocument();
    expect(screen.getByText('Urea (46-0-0)')).toBeInTheDocument();
    expect(screen.getByText(/Order certified fertilizers on AgroSphere/i)).toBeInTheDocument();
  });
});
