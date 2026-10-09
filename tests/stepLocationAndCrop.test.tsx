import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepLocation } from '../src/components/farm-form/StepLocation';
import { StepCrop } from '../src/components/farm-form/StepCrop';

describe('StepLocation and StepCrop Components', () => {
  it('renders StepLocation fields for region, district, and area', () => {
    const handleChange = vi.fn();
    render(
      <StepLocation
        region="Aran"
        district="Yevlakh"
        farmAreaHectares={18}
        onChange={handleChange}
      />
    );

    expect(screen.getByLabelText(/Agricultural Region/i)).toHaveValue('Aran');
    expect(screen.getByLabelText(/District/i)).toHaveValue('Yevlakh');
    expect(screen.getByLabelText(/Total Farm Area/i)).toHaveValue(18);
  });

  it('updates dynamic growth stages when a crop is selected in StepCrop', () => {
    const handleCropChange = vi.fn();
    const handleStageChange = vi.fn();

    render(
      <StepCrop
        selectedCrop="Wheat"
        selectedStage=""
        previousCrop=""
        onCropChange={handleCropChange}
        onStageChange={handleStageChange}
        onPreviousCropChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/Current Crop/i)).toHaveValue('Wheat');
    expect(screen.getByText(/Vegetative \/ Tillering/i)).toBeInTheDocument();

    const stageSelect = screen.getByLabelText(/Crop Growth Stage/i);
    fireEvent.change(stageSelect, { target: { value: 'Grain Filling / Maturation' } });
    expect(handleStageChange).toHaveBeenCalledWith('Grain Filling / Maturation');
  });
});
