import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepSoilWater } from '../src/components/farm-form/StepSoilWater';
import { StepQuestionsMedia } from '../src/components/farm-form/StepQuestionsMedia';

describe('StepSoilWater and StepQuestionsMedia Components', () => {
  it('toggles between document upload mode and manual nutrient entry', () => {
    const handleModeChange = vi.fn();
    const handleMetricChange = vi.fn();

    const { rerender } = render(
      <StepSoilWater
        soilMode="upload"
        soilType="Loamy"
        soilMetrics={{}}
        uploadedDocs={[]}
        irrigationMethod="Drip Irrigation"
        waterSource="Deep Borewell / Groundwater"
        onSoilModeChange={handleModeChange}
        onSoilTypeChange={() => {}}
        onSoilMetricChange={handleMetricChange}
        onDocsChange={() => {}}
        onIrrigationChange={() => {}}
        onWaterSourceChange={() => {}}
      />
    );

    expect(screen.getByText(/Upload Soil Lab Report/i)).toBeInTheDocument();

    rerender(
      <StepSoilWater
        soilMode="manual"
        soilType="Loamy"
        soilMetrics={{ ph: 6.8, nitrogenPpm: 32 }}
        uploadedDocs={[]}
        irrigationMethod="Drip Irrigation"
        waterSource="Deep Borewell / Groundwater"
        onSoilModeChange={handleModeChange}
        onSoilTypeChange={() => {}}
        onSoilMetricChange={handleMetricChange}
        onDocsChange={() => {}}
        onIrrigationChange={() => {}}
        onWaterSourceChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/Soil pH/i)).toHaveValue(6.8);
    expect(screen.getByLabelText(/Available Nitrogen \(N\)/i)).toHaveValue(32);
  });

  it('renders StepQuestionsMedia with problem textarea and quick inquiry pills', () => {
    const handleQuestionChange = vi.fn();
    render(
      <StepQuestionsMedia
        mainProblem=""
        uploadedPhotos={[]}
        onProblemChange={handleQuestionChange}
        onPhotosChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/Main Agricultural Problem or Question/i)).toBeInTheDocument();
    
    // Quick prompt pill click
    const quickPill = screen.getByText(/Yellowing lower leaves/i);
    fireEvent.click(quickPill);
    expect(handleQuestionChange).toHaveBeenCalledWith(
      expect.stringContaining('Yellowing lower leaves')
    );
  });
});
